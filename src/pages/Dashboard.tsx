import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Clock, CheckCircle, Phone, Mail, MapPin,
  DollarSign, Calendar, ArrowRight, ChevronDown, Filter, RefreshCw,
  Eye, Edit, Trash2, MoreVertical
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  nouveau: { label: "Nouveau", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  inspection: { label: "Inspection", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  soumission: { label: "Soumission", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
  gagne: { label: "Gagné", color: "text-green-700", bgColor: "bg-green-50 border-green-200" },
  perdu: { label: "Perdu", color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
};

const kanbanColumns = ["nouveau", "inspection", "soumission", "gagne"];

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Erreur lors du chargement des leads");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;

      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  // Stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === "nouveau").length;
  const inProgress = leads.filter(l => ["inspection", "soumission"].includes(l.status)).length;
  const won = leads.filter(l => l.status === "gagne").length;
  const totalEstimate = leads
    .filter(l => l.status === "gagne" && l.estimate_mid)
    .reduce((sum, l) => sum + (l.estimate_mid || 0), 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Centre de Contrôle
              </h1>
              <p className="text-muted-foreground">
                Gestion des leads et pipeline de ventes
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Button variant="outline" onClick={fetchLeads} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{totalLeads}</p>
              <p className="text-sm text-muted-foreground">Leads</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-xs text-muted-foreground">Nouveau</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{newLeads}</p>
              <p className="text-sm text-muted-foreground">À traiter</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-xs text-muted-foreground">Gagnés</span>
              </div>
              <p className="text-3xl font-bold text-foreground">{won}</p>
              <p className="text-sm text-muted-foreground">Projets</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-xs text-muted-foreground">Revenus</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {totalEstimate.toLocaleString('fr-CA')}$
              </p>
              <p className="text-sm text-muted-foreground">Estimés</p>
            </motion.div>
          </div>

          {/* Kanban Board */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Pipeline des Ventes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
              {kanbanColumns.map((status) => {
                const config = statusConfig[status];
                const columnLeads = getLeadsByStatus(status);

                return (
                  <div key={status} className="min-w-[280px]">
                    {/* Column Header */}
                    <div className={`rounded-t-lg px-4 py-3 border ${config.bgColor}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${config.color}`}>
                          {config.label}
                        </span>
                        <span className={`text-sm font-mono ${config.color}`}>
                          {columnLeads.length}
                        </span>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="bg-muted/50 rounded-b-lg p-2 min-h-[400px] space-y-2">
                      {columnLeads.map((lead) => (
                        <motion.div
                          key={lead.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                              {lead.full_name}
                            </h3>
                            <div className="flex items-center gap-1">
                              {status !== "gagne" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextStatus = kanbanColumns[kanbanColumns.indexOf(status) + 1];
                                    if (nextStatus) updateLeadStatus(lead.id, nextStatus);
                                  }}
                                  className="p-1 hover:bg-muted rounded"
                                  title="Avancer"
                                >
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{lead.address}</span>
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground capitalize">
                              {lead.project_type}
                            </span>
                            {lead.estimate_mid && (
                              <span className="text-sm font-semibold text-green-600">
                                {lead.estimate_mid.toLocaleString('fr-CA')}$
                              </span>
                            )}
                          </div>

                          <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 bg-muted rounded-full hover:bg-accent/20"
                            >
                              <Phone className="h-3 w-3 text-muted-foreground" />
                            </a>
                            <a
                              href={`mailto:${lead.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 bg-muted rounded-full hover:bg-accent/20"
                            >
                              <Mail className="h-3 w-3 text-muted-foreground" />
                            </a>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(lead.created_at).toLocaleDateString('fr-CA')}
                            </span>
                          </div>
                        </motion.div>
                      ))}

                      {columnLeads.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Aucun lead
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Detail Modal */}
          {selectedLead && (
            <div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedLead.full_name}</h2>
                      <p className="text-muted-foreground">{selectedLead.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Statut</label>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(statusConfig).map(([status, config]) => (
                        <button
                          key={status}
                          onClick={() => {
                            updateLeadStatus(selectedLead.id, status);
                            setSelectedLead({ ...selectedLead, status });
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                            selectedLead.status === status
                              ? config.bgColor + ' ' + config.color
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Téléphone</label>
                      <a href={`tel:${selectedLead.phone}`} className="text-foreground hover:text-accent flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedLead.phone}
                      </a>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Courriel</label>
                      <a href={`mailto:${selectedLead.email}`} className="text-foreground hover:text-accent flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedLead.email}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Adresse</label>
                    <p className="text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedLead.address}
                    </p>
                  </div>

                  {/* Project Details */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Type de projet</label>
                      <p className="text-foreground capitalize">{selectedLead.project_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Type de propriété</label>
                      <p className="text-foreground capitalize">{selectedLead.property_type || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Type de toiture</label>
                      <p className="text-foreground capitalize">{selectedLead.roof_type || '-'}</p>
                    </div>
                  </div>

                  {/* Estimation */}
                  {selectedLead.estimate_mid && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <label className="text-sm font-medium text-muted-foreground mb-3 block">Estimation IA</label>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Bas</p>
                          <p className="text-xl font-bold text-foreground">
                            {selectedLead.estimate_low?.toLocaleString('fr-CA')}$
                          </p>
                        </div>
                        <div className="border-x border-border">
                          <p className="text-sm text-muted-foreground">Moyen</p>
                          <p className="text-2xl font-bold text-green-600">
                            {selectedLead.estimate_mid?.toLocaleString('fr-CA')}$
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Élevé</p>
                          <p className="text-xl font-bold text-foreground">
                            {selectedLead.estimate_high?.toLocaleString('fr-CA')}$
                          </p>
                        </div>
                      </div>
                      {selectedLead.estimate_timeline && (
                        <p className="text-center text-sm text-muted-foreground mt-3">
                          Durée estimée: <strong>{selectedLead.estimate_timeline}</strong>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Photos */}
                  {selectedLead.photos && selectedLead.photos.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Photos ({selectedLead.photos.length})
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedLead.photos.map((photo, index) => (
                          <a
                            key={index}
                            href={photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square rounded-lg overflow-hidden bg-muted"
                          >
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-border">
                    <Button variant="hero" className="flex-1" asChild>
                      <a href={`tel:${selectedLead.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </a>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={`mailto:${selectedLead.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Envoyer un courriel
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
