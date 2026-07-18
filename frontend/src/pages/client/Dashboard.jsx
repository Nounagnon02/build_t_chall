import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckSquare, Users, MessageSquare, CreditCard, FileText } from 'lucide-react';
import { clientAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';
import { normalizeApiObjectResponse } from '../../utils/normalizeResponse';

export default function ClientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientAPI.dashboard().then((res) => {
      setData(normalizeApiObjectResponse(res.data));
    }).catch(() => { setData({}); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const cards = [
    { label: 'Tâches complétées', value: `${data.checklist_progress || 0}%`, icon: CheckSquare, link: '/client/checklist', color: 'text-sauge' },
    { label: 'Invités', value: data.guest_count || 0, icon: Users, link: '/client/invites', color: 'text-blush' },
    { label: 'Messages', value: data.unread_messages || 0, icon: MessageSquare, link: '/client/messagerie', color: 'text-champagne' },
    { label: 'Documents', value: data.document_count || 0, icon: FileText, link: '/client/documents', color: 'text-charbon/60' },
  ];

  const daysLeft = data.days_until_wedding;

  return (
    <>
      <Helmet><title>Tableau de bord — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-charbon">Mon Tableau de Bord</h1>
              <p className="text-sm text-charbon/50">Bienvenue sur votre espace client</p>
            </div>
            {daysLeft !== undefined && daysLeft > 0 && (
              <div className="bg-champagne/10 px-5 py-3 rounded-sm text-center">
                <p className="text-[10px] uppercase tracking-widest text-champagne font-medium">J-{daysLeft}</p>
                <p className="text-xs text-charbon/50">avant le mariage</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
              <Link key={card.label} to={card.link}>
                <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-sm shadow-card">
                  <card.icon size={20} className={`${card.color} mb-2`} />
                  <p className="font-serif text-2xl text-charbon">{card.value}</p>
                  <p className="text-xs text-charbon/50">{card.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-sm shadow-card">
              <h2 className="font-medium text-charbon mb-4 flex items-center gap-2"><CheckSquare size={16} className="text-champagne" /> Progression</h2>
              <div className="h-3 bg-perle rounded-full overflow-hidden">
                <div className="h-full bg-champagne rounded-full transition-all duration-1000" style={{ width: `${data.checklist_progress || 0}%` }} />
              </div>
              <p className="text-xs text-charbon/40 mt-2">{data.completed_tasks || 0}/{data.total_tasks || 0} tâches</p>
            </div>

            <div className="bg-white p-6 rounded-sm shadow-card">
              <h2 className="font-medium text-charbon mb-4 flex items-center gap-2"><CreditCard size={16} className="text-champagne" /> Budget</h2>
              {data.total_budget ? (
                <div>
                  <div className="h-3 bg-perle rounded-full overflow-hidden">
                    <div className="h-full bg-champagne rounded-full" style={{ width: `${Math.min((data.spent_budget / data.total_budget) * 100, 100)}%` }} />
                  </div>
                  <p className="text-xs text-charbon/40 mt-2">{data.spent_budget?.toLocaleString('fr-FR')}€ / {data.total_budget?.toLocaleString('fr-FR')}€</p>
                </div>
              ) : (
                <p className="text-xs text-charbon/40">Aucun budget défini</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
