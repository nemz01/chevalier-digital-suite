import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Clock, CheckCircle, Phone, Mail, MapPin,
  DollarSign, Calendar, ArrowRight, RefreshCw, Bot, Zap, TrendingUp,
  FileText, Send, MessageSquare, UserCheck, Truck, ClipboardList,
  Brain, Sparkles, AlertCircle, ChevronRight, X, Play, Pause,
  Settings, Bell, Search, Plus, Eye, BarChart3, PieChart, Activity
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

// Simulated AI Agents data for demo
const aiAgents = [
  {
    id: "estimator",
    name: "Agent Estimateur",
    description: "Analyse photos et génère estimations automatiques",
    status: "active",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    tasksToday: 12,
    successRate: 94,
  },
  {
    id: "followup",
    name: "Agent Suivi Client",
    description: "Envoie rappels et suivis automatiques",
    status: "active",
    icon: MessageSquare,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    tasksToday: 28,
    successRate: 100,
  },
  {
    id: "scheduler",
    name: "Agent Planification",
    description: "Optimise les horaires et assignations",
    status: "active",
    icon: Calendar,
    color: "text-green-500",
    bgColor: "bg-green-50",
    tasksToday: 8,
    successRate: 100,
  },
  {
    id: "invoicing",
    name: "Agent Facturation",
    description: "Génère et envoie factures automatiquement",
    status: "paused",
    icon: FileText,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    tasksToday: 3,
    successRate: 100,
  },
];

// Simulated team members
const teamMembers = [
  { id: 1, name: "Francis Chevalier", role: "Propriétaire", status: "available", jobs: 2, avatar: "FC" },
  { id: 2, name: "Marc Tremblay", role: "Couvreur Senior", status: "on_job", jobs: 1, avatar: "MT" },
  { id: 3, name: "Jean-Pierre Dubois", role: "Couvreur", status: "on_job", jobs: 1, avatar: "JD" },
  { id: 4, name: "Luc Bergeron", role: "Apprenti", status: "available", jobs: 0, avatar: "LB" },
];

// Simulated recent activities
const recentActivities = [
  { id: 1, type: "lead", message: "Nouveau lead reçu: Marie Lavoie, Longueuil", time: "Il y a 5 min", icon: Users },
  { id: 2, type: "ai", message: "Agent Estimateur: Estimation générée pour #1847", time: "Il y a 12 min", icon: Brain },
  { id: 3, type: "followup", message: "Agent Suivi: Rappel envoyé à Pierre Gagnon", time: "Il y a 25 min", icon: Send },
  { id: 4, type: "status", message: "Projet #1842 marqué comme complété", time: "Il y a 1h", icon: CheckCircle },
  { id: 5, type: "schedule", message: "Inspection planifiée: 45 Rue des Érables", time: "Il y a 2h", icon: Calendar },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  nouveau: { label: "Nouveau", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  inspection: { label: "Inspection", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  soumission: { label: "Soumission", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
  gagne: { label: "Gagné", color: "text-green-700", bgColor: "bg-green-50 border-green-200" },
  perdu: { label: "Perdu", color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
};

const kanbanColumns = ["nouveau", "inspection", "soumission", "gagne"];

type TabType = "overview" | "pipeline" | "agents" | "team" | "analytics";

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [agentStatuses, setAgentStatuses] = useState<Record<string, string>>({
    estimator: "active",
    followup: "active",
    scheduler: "active",
    invoicing: "paused",
  });

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

  const toggleAgentStatus = (agentId: string) => {
    setAgentStatuses(prev => ({
      ...prev,
      [agentId]: prev[agentId] === "active" ? "paused" : "active"
    }));
    toast.success(`Agent ${agentId === "active" ? "pausé" : "activé"}`);
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  // Stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === "nouveau").length;
  const won = leads.filter(l => l.status === "gagne").length;
  const totalEstimate = leads
    .filter(l => l.status === "gagne" && l.estimate_mid)
    .reduce((sum, l) => sum + (l.estimate_mid || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

  const tabs = [
    { id: "overview" as TabType, label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "pipeline" as TabType, label: "Pipeline", icon: ClipboardList },
    { id: "agents" as TabType, label: "Agents IA", icon: Bot },
    { id: "team" as TabType, label: "Équipe", icon: Users },
    { id: "analytics" as TabType, label: "Analytiques", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Centre de Contrôle
              </h1>
              <p className="text-muted-foreground">
                Écosystème Chevalier • Gestion intelligente
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">3 Agents actifs</span>
              </div>
              <Button variant="outline" onClick={fetchLeads} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{totalLeads}</p>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-card rounded-xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{newLeads}</p>
                  <p className="text-sm text-muted-foreground">À traiter</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{won}</p>
                  <p className="text-sm text-muted-foreground">Gagnés</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-card rounded-xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{conversionRate}%</p>
                  <p className="text-sm text-muted-foreground">Conversion</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalEstimate.toLocaleString('fr-CA')}$
                  </p>
                  <p className="text-sm text-muted-foreground">Revenus</p>
                </motion.div>
              </div>

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* AI Agents Status */}
                <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Bot className="h-5 w-5 text-purple-500" />
                      Agents IA
                    </h2>
                    <span className="text-xs text-muted-foreground">Automatisation 24/7</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {aiAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`p-4 rounded-lg border ${agent.bgColor} border-opacity-50`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                              <agent.icon className={`h-5 w-5 ${agent.color}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm">{agent.name}</h3>
                              <p className="text-xs text-muted-foreground">{agent.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleAgentStatus(agent.id)}
                            className={`p-1.5 rounded-full transition-colors ${
                              agentStatuses[agent.id] === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {agentStatuses[agent.id] === "active" ? (
                              <Play className="h-3 w-3" />
                            ) : (
                              <Pause className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {agent.tasksToday} tâches aujourd'hui
                          </span>
                          <span className="font-medium text-green-600">
                            {agent.successRate}% succès
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Activité récente
                  </h2>

                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                        <div className="p-1.5 bg-muted rounded-lg">
                          <activity.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-2">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Overview */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Truck className="h-5 w-5 text-amber-500" />
                    Équipe sur le terrain
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {teamMembers.filter(m => m.status === "on_job").length} en chantier
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        member.status === "available" ? "bg-green-500" : "bg-amber-500"
                      }`} title={member.status === "available" ? "Disponible" : "En chantier"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pipeline Tab */}
          {activeTab === "pipeline" && (
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Pipeline des Ventes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
                {kanbanColumns.map((status) => {
                  const config = statusConfig[status];
                  const columnLeads = getLeadsByStatus(status);

                  return (
                    <div key={status} className="min-w-[280px]">
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
                              {status !== "gagne" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextStatus = kanbanColumns[kanbanColumns.indexOf(status) + 1];
                                    if (nextStatus) updateLeadStatus(lead.id, nextStatus);
                                  }}
                                  className="p-1 hover:bg-muted rounded"
                                >
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                </button>
                              )}
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
          )}

          {/* Agents Tab */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              {/* Header Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                  <Bot className="h-8 w-8 mb-3 opacity-80" />
                  <p className="text-3xl font-bold">4</p>
                  <p className="text-purple-100">Agents configurés</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                  <Zap className="h-8 w-8 mb-3 opacity-80" />
                  <p className="text-3xl font-bold">51</p>
                  <p className="text-green-100">Tâches aujourd'hui</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                  <Clock className="h-8 w-8 mb-3 opacity-80" />
                  <p className="text-3xl font-bold">10h+</p>
                  <p className="text-blue-100">Temps économisé/sem</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
                  <TrendingUp className="h-8 w-8 mb-3 opacity-80" />
                  <p className="text-3xl font-bold">97%</p>
                  <p className="text-amber-100">Taux de succès</p>
                </div>
              </div>

              {/* Agent Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {aiAgents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
                  >
                    <div className={`p-4 ${agent.bgColor} border-b border-border`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white rounded-xl shadow-sm">
                            <agent.icon className={`h-6 w-6 ${agent.color}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{agent.name}</h3>
                            <p className="text-sm text-muted-foreground">{agent.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleAgentStatus(agent.id)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            agentStatuses[agent.id] === "active"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {agentStatuses[agent.id] === "active" ? "Actif" : "Pausé"}
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{agent.tasksToday}</p>
                          <p className="text-xs text-muted-foreground">Tâches aujourd'hui</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{agent.successRate}%</p>
                          <p className="text-xs text-muted-foreground">Taux de succès</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">24/7</p>
                          <p className="text-xs text-muted-foreground">Disponibilité</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Dernière exécution</span>
                          <span className="text-foreground font-medium">Il y a 3 min</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Value Proposition */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      De 90 minutes à 3 minutes par soumission
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Vos agents IA travaillent 24/7 pour capturer les leads, générer des estimations,
                      envoyer des suivis automatiques et optimiser votre planning. Une infrastructure
                      qui travaille pendant que vous dormez.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>+150 000$/an revenus additionnels</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>100% propriété des données</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
                  <UserCheck className="h-6 w-6 text-green-500 mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {teamMembers.filter(m => m.status === "available").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Disponibles</p>
                </div>
                <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
                  <Truck className="h-6 w-6 text-amber-500 mb-2" />
                  <p className="text-3xl font-bold text-foreground">
                    {teamMembers.filter(m => m.status === "on_job").length}
                  </p>
                  <p className="text-sm text-muted-foreground">En chantier</p>
                </div>
                <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
                  <Calendar className="h-6 w-6 text-blue-500 mb-2" />
                  <p className="text-3xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">Projets actifs</p>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-bold text-foreground">Membres de l'équipe</h2>
                </div>
                <div className="divide-y divide-border">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{member.jobs} projet(s)</p>
                          <p className="text-xs text-muted-foreground">assigné(s)</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {member.status === "available" ? "Disponible" : "En chantier"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-500" />
                    Répartition par statut
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(statusConfig).slice(0, 4).map(([status, config]) => {
                      const count = getLeadsByStatus(status).length;
                      const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${config.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`} />
                          <span className="text-sm text-foreground flex-1">{config.label}</span>
                          <span className="text-sm font-mono text-muted-foreground">{count}</span>
                          <span className="text-sm font-medium text-foreground w-12 text-right">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Impact financier estimé
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700 mb-1">Revenus additionnels (An 1)</p>
                      <p className="text-2xl font-bold text-green-700">+150 000$</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 mb-1">Temps économisé par semaine</p>
                      <p className="text-2xl font-bold text-blue-700">10h+</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-700 mb-1">Coût d'opportunité évité</p>
                      <p className="text-2xl font-bold text-purple-700">614 000$/an</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                      <X className="h-5 w-5" />
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

                  {/* Estimation */}
                  {selectedLead.estimate_mid && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <label className="text-sm font-medium text-muted-foreground mb-3 block flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        Estimation IA
                      </label>
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
                        Courriel
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
