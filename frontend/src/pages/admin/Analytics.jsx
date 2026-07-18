import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BarChart3, Users, TrendingUp, Calendar, Eye } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';
import { normalizeApiObjectResponse } from '../../utils/normalizeResponse';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.analytics.overview().then((res) => {
      setAnalytics(normalizeApiObjectResponse(res.data));
    }).catch(() => { setAnalytics({}); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const metrics = [
    { label: 'Utilisateurs totaux', value: analytics.total_users || 0, icon: Users },
    { label: 'Mariages', value: analytics.total_weddings || 0, icon: Calendar },
    { label: 'Messages contact', value: analytics.total_contacts || 0, icon: Eye },
    { label: 'Taux de conversion', value: `${analytics.conversion_rate || 0}%`, icon: TrendingUp },
  ];

  return (
    <>
      <Helmet><title>Statistiques — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-5xl">
          <h1 className="font-serif text-2xl text-charbon mb-2">Statistiques</h1>
          <p className="text-sm text-charbon/50 mb-8">Indicateurs clés de la plateforme.</p>

          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((m) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-sm shadow-card"
              >
                <m.icon size={20} className="text-champagne mb-2" />
                <p className="font-serif text-3xl text-charbon">{m.value}</p>
                <p className="text-xs text-charbon/50">{m.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-sm shadow-card">
            <h2 className="font-medium text-charbon mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-champagne" /> Aperçu</h2>
            <p className="text-sm text-charbon/40">Les graphiques détaillés (Recharts) seront intégrés ici avec les données historiques.</p>
          </div>
        </div>
      </section>
    </>
  );
}
