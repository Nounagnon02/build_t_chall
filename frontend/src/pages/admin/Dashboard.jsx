import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Users, TrendingUp, Calendar, MessageSquare, Heart,
  ClipboardList, ArrowUpRight, ArrowDownRight, Star,
  DollarSign, Activity, Eye, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { adminAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

const COLORS = ['#C9A96E', '#E8C4A0', '#8B9E7A', '#D4B8A0', '#6B7280'];

const CARD_CONFIGS = [
  { key: 'total_users',       label: 'Utilisateurs',     icon: Users,         color: 'from-champagne/20 to-champagne/5',   text: 'text-champagne',  trend: 'new_clients_30d', trendLabel: 'ce mois' },
  { key: 'total_weddings',    label: 'Mariages',          icon: Heart,         color: 'from-blush/30 to-blush/5',           text: 'text-blush',      trend: 'signed_weddings', trendLabel: 'signés' },
  { key: 'total_contacts',    label: 'Messages',          icon: MessageSquare, color: 'from-sauge/20 to-sauge/5',           text: 'text-sauge',      trend: 'unread_contacts', trendLabel: 'non lus' },
  { key: 'conversion_rate',   label: 'Conversion',        icon: TrendingUp,    color: 'from-charbon/10 to-charbon/5',       text: 'text-charbon',    suffix: '%' },
  { key: 'total_project_leads', label: 'Projets reçus',  icon: ClipboardList, color: 'from-champagne/20 to-champagne/5',   text: 'text-champagne',  trend: 'new_project_leads', trendLabel: 'nouveaux', link: '/admin/leads' },
  { key: 'total_rdv',         label: 'Rendez-vous',       icon: Calendar,      color: 'from-blush/30 to-blush/5',           text: 'text-blush',      trend: 'pending_rdv', trendLabel: 'confirmés' },
  { key: 'total_testimonials',label: 'Témoignages',       icon: Star,          color: 'from-sauge/20 to-sauge/5',           text: 'text-sauge' },
  { key: 'estimated_revenue', label: 'CA estimé',         icon: DollarSign,    color: 'from-champagne/20 to-champagne/5',   text: 'text-champagne',  prefix: '€', format: 'currency' },
];

function fmt(value, config) {
  if (config.format === 'currency') return new Intl.NumberFormat('fr-FR').format(value);
  return value;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-charbon text-white text-xs p-3 rounded-sm shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name} : {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.analytics.overview(),
      adminAPI.analytics.charts(),
    ]).then(([ovRes, chRes]) => {
      setAnalytics(ovRes.data || {});
      setCharts(chRes.data || {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const statusColors = { New: '#C9A96E', Prospect: '#E8C4A0', 'In Progress': '#8B9E7A', Completed: '#6B7280', Cancelled: '#D1D5DB' };

  return (
    <>
      <Helmet><title>Admin Dashboard — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-7xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl text-charbon">Tableau de bord</h1>
              <p className="text-sm text-charbon/50 mt-1">Vue d'ensemble de votre activité</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-charbon/40">
              <Activity size={14} className="text-sauge" />
              <span>Données en temps réel</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {CARD_CONFIGS.map((cfg, i) => {
              const value = analytics?.[cfg.key] ?? 0;
              const trendVal = cfg.trend ? (analytics?.[cfg.trend] ?? 0) : null;
              const card = (
                <motion.div
                  key={cfg.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-gradient-to-br ${cfg.color} border border-white/60 p-5 rounded-sm shadow-card hover:shadow-card-hover transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <cfg.icon size={18} className={cfg.text} />
                    {trendVal !== null && (
                      <span className="text-[10px] bg-white/60 text-charbon/60 px-2 py-0.5 rounded-full">
                        +{trendVal} {cfg.trendLabel}
                      </span>
                    )}
                  </div>
                  <p className={`font-serif text-3xl ${cfg.text} leading-none`}>
                    {cfg.prefix}{fmt(value, cfg)}{cfg.suffix}
                  </p>
                  <p className="text-xs text-charbon/50 mt-1">{cfg.label}</p>
                </motion.div>
              );
              return cfg.link ? <Link key={cfg.key} to={cfg.link}>{card}</Link> : card;
            })}
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* Area chart — tendances mensuelles */}
            <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-card">
              <h2 className="font-medium text-charbon mb-1 text-sm">Tendances mensuelles</h2>
              <p className="text-xs text-charbon/40 mb-4">Leads, mariages et RDV sur 6 mois</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={charts?.monthly_trends || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gMariages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B9E7A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B9E7A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="leads" name="Leads" stroke="#C9A96E" strokeWidth={2} fill="url(#gLeads)" dot={{ r: 3, fill: '#C9A96E' }} />
                  <Area type="monotone" dataKey="mariages" name="Mariages" stroke="#8B9E7A" strokeWidth={2} fill="url(#gMariages)" dot={{ r: 3, fill: '#8B9E7A' }} />
                  <Area type="monotone" dataKey="rdv" name="RDV" stroke="#E8C4A0" strokeWidth={2} fill="none" dot={{ r: 3, fill: '#E8C4A0' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart — statut mariages */}
            <div className="bg-white p-6 rounded-sm shadow-card">
              <h2 className="font-medium text-charbon mb-1 text-sm">Statut des mariages</h2>
              <p className="text-xs text-charbon/40 mb-4">Répartition par état</p>
              {charts?.wedding_status?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={charts.wedding_status} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      dataKey="value" nameKey="name" paddingAngle={3}
                    >
                      {charts.wedding_status.map((entry, i) => (
                        <Cell key={i} fill={statusColors[entry.name] || COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-charbon/30 text-sm">
                  Aucune donnée
                </div>
              )}
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Bar chart — leads par mois */}
            <div className="bg-white p-6 rounded-sm shadow-card">
              <h2 className="font-medium text-charbon mb-1 text-sm">Leads par mois</h2>
              <p className="text-xs text-charbon/40 mb-4">Nouveaux projets reçus</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={charts?.monthly_trends || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="leads" name="Leads" fill="#C9A96E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* KPI secondaires */}
            <div className="bg-white p-6 rounded-sm shadow-card">
              <h2 className="font-medium text-charbon mb-4 text-sm flex items-center gap-2">
                <Activity size={14} className="text-champagne" /> Indicateurs clés
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Taux de conversion', value: `${analytics?.conversion_rate || 0}%`, max: 100, color: 'bg-champagne' },
                  { label: 'Mariages signés / total', value: `${analytics?.signed_weddings || 0} / ${analytics?.total_weddings || 0}`, max: analytics?.total_weddings || 1, current: analytics?.signed_weddings || 0, color: 'bg-sauge' },
                  { label: 'Messages non lus', value: `${analytics?.unread_contacts || 0} / ${analytics?.total_contacts || 0}`, max: analytics?.total_contacts || 1, current: analytics?.unread_contacts || 0, color: 'bg-blush' },
                  { label: 'Nouveaux clients (30j)', value: analytics?.new_clients_30d || 0, max: analytics?.total_clients || 1, current: analytics?.new_clients_30d || 0, color: 'bg-champagne' },
                ].map((kpi) => (
                  <div key={kpi.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-charbon/60">{kpi.label}</span>
                      <span className="font-medium text-charbon">{kpi.value}</span>
                    </div>
                    <div className="h-1.5 bg-perle rounded-full overflow-hidden">
                      <div
                        className={`h-full ${kpi.color} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.min(100, ((kpi.current ?? parseFloat(kpi.value)) / kpi.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent leads table */}
          <div className="bg-white rounded-sm shadow-card overflow-hidden">
            <div className="p-6 border-b border-perle flex items-center justify-between">
              <h2 className="font-medium text-charbon text-sm flex items-center gap-2">
                <ClipboardList size={14} className="text-champagne" /> Derniers projets reçus
              </h2>
              <Link to="/admin/leads" className="text-xs text-champagne hover:underline flex items-center gap-1">
                Voir tout <ArrowUpRight size={12} />
              </Link>
            </div>
            {charts?.recent_leads?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ivory text-charbon/50 text-xs">
                      <th className="text-left px-6 py-3 font-medium">Nom</th>
                      <th className="text-left px-6 py-3 font-medium">Email</th>
                      <th className="text-left px-6 py-3 font-medium">Budget</th>
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                      <th className="text-left px-6 py-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.recent_leads.map((lead, i) => (
                      <tr key={lead.id} className={`border-t border-perle hover:bg-ivory/50 transition-colors ${i % 2 === 0 ? '' : 'bg-ivory/30'}`}>
                        <td className="px-6 py-3 font-medium text-charbon">{lead.name}</td>
                        <td className="px-6 py-3 text-charbon/60">{lead.email}</td>
                        <td className="px-6 py-3 text-charbon/60">{lead.budget}</td>
                        <td className="px-6 py-3 text-charbon/60">{lead.date}</td>
                        <td className="px-6 py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="p-6 text-sm text-charbon/40">Aucun projet reçu pour le moment.</p>
            )}
          </div>

        </div>
      </section>
    </>
  );
}

function StatusBadge({ status }) {
  const map = {
    new:         { label: 'Nouveau',     cls: 'bg-champagne/20 text-champagne',  icon: AlertCircle },
    contacted:   { label: 'Contacté',    cls: 'bg-sauge/20 text-sauge',          icon: Clock },
    qualified:   { label: 'Qualifié',    cls: 'bg-blush/30 text-charbon',        icon: Eye },
    proposal:    { label: 'Proposition', cls: 'bg-charbon/10 text-charbon',      icon: ClipboardList },
    won:         { label: 'Gagné',       cls: 'bg-sauge/30 text-sauge',          icon: CheckCircle },
    lost:        { label: 'Perdu',       cls: 'bg-red-100 text-red-500',         icon: ArrowDownRight },
  };
  const cfg = map[status] || { label: status, cls: 'bg-perle text-charbon/60', icon: Activity };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.cls}`}>
      <cfg.icon size={10} />
      {cfg.label}
    </span>
  );
}
