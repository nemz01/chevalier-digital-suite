-- =====================================================
-- CHEVALIER COUVREUR - LEADS & ADMIN SYSTEM
-- =====================================================

-- 1. Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'estimator')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  best_time_to_call TEXT,
  
  -- Property Information
  address TEXT NOT NULL,
  property_type TEXT,
  year_built TEXT,
  
  -- Project Details
  project_type TEXT NOT NULL CHECK (project_type IN ('residential', 'commercial', 'emergency')),
  
  -- Roof Details
  roof_type TEXT,
  roof_age TEXT,
  roof_issues JSONB DEFAULT '[]'::jsonb,
  access_difficulty TEXT DEFAULT 'easy',
  
  -- Preferences
  timeline TEXT,
  budget_range TEXT,
  
  -- Photos (Storage URLs)
  photos TEXT[] DEFAULT '{}',
  
  -- AI Analysis Results
  ai_analysis JSONB,
  
  -- Estimation Results
  estimate_low NUMERIC,
  estimate_mid NUMERIC,
  estimate_high NUMERIC,
  estimate_timeline TEXT,
  confidence_score INTEGER,
  
  -- Lead Management
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'scheduled', 'won', 'lost')),
  source TEXT DEFAULT 'ai_tool',
  notes TEXT
);

-- 3. Create communications log table
CREATE TABLE public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'sms', 'note')),
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can read own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Leads: Public can INSERT (for form submissions)
CREATE POLICY "Public can insert leads" 
  ON public.leads 
  FOR INSERT 
  WITH CHECK (true);

-- Leads: Authenticated users can read all leads
CREATE POLICY "Authenticated can read leads" 
  ON public.leads 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Leads: Authenticated users can update leads
CREATE POLICY "Authenticated can update leads" 
  ON public.leads 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Communications: Authenticated users can CRUD
CREATE POLICY "Authenticated can manage communications" 
  ON public.communications 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STORAGE BUCKET FOR ROOF PHOTOS
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('roof-photos', 'roof-photos', true, 10485760);

-- Storage policies for roof photos
CREATE POLICY "Public can upload roof photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'roof-photos');

CREATE POLICY "Public can read roof photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'roof-photos');

CREATE POLICY "Authenticated can delete roof photos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'roof-photos' AND auth.role() = 'authenticated');