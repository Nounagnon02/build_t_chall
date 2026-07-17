import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Users, TrendingUp, Calendar, MessageSquare, Star, Activity, ClipboardList, ArrowRight } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.analytics.overview().then((res) => {
      setAnalytics(res.data || {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const cards = [
    { label: 'Utilisateurs', value: analytics.total_users || 0, icon: Users, color: 'text-champagne' },
    { label: 'Mariages', value: analytics.total_weddings || 0, icon: HeartIcon, color: 'text-blush' },
    { label: 'Messages contact', value: analytics.total_contacts || 0, icon: MessageSquare, color: 'text-charbon/60' },
    { label: 'Conversion', value: `${analytics.conversion_rate || 0}%`, icon: TrendingUp, color: 'text-sauge' },
    { label: 'Nouveaux leads', value: analytics.new_project_leads || 0, icon: ClipboardList, color: 'text-champagne', link: '/admin/leads' },
    { label: 'RDV en attente', value: analytics.pending_rdv || 0, icon: Calendar, color: 'text-blush' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-charbon">Administration</h1>
              <p className="text-sm text-charbon/50">Tableau de bord</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map((card) => {
              const inner = (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-sm shadow-card"
                >
                  <card.icon size={20} className={`${card.color} mb-2`} />
                  <p className="font-serif text-3xl text-charbon">{card.value}</p>
                  <p className="text-xs text-charbon/50">{card.label}</p>
                </motion.div>
              );
              return card.link ? <Link key={card.label} to={card.link}>{inner}</Link> : inner;
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-sm shadow-card">
              <h2 className="font-medium text-charbon mb-4 flex items-center gap-2">
                <Activity size={16} className="text-champagne" /> Activité récente
              </h2>
              <p className="text-sm text-charbon/40">Chargez les données depuis l'API pour voir l'activité.</p>
            </div>
            <Link to="/admin/leads" className="bg-white p-6 rounded-sm shadow-card hover:shadow-card-hover transition-shadow group">
              <h2 className="font-medium text-charbon mb-4 flex items-center gap-2">
                <ClipboardList size={16} className="text-champagne" /> Projets reçus
              </h2>
              {analytics.new_project_leads > 0 ? (
                <div>
                  <p className="font-serif text-2xl text-champagne">{analytics.new_project_leads}</p>
                  <p className="text-xs text-charbon/50">nouveaux projets à consulter</p>
                  <p className="text-xs text-champagne mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir les projets <ArrowRight size={12} />
                  </p>
                </div>
              ) : (
                <p className="text-sm text-charbon/40">Aucun nouveau projet pour le moment.</p>
              )}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function HeartIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
