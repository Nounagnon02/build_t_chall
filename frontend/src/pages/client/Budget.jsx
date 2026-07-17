import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CreditCard, TrendingUp } from 'lucide-react';
import { clientAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';
import { normalizeApiArrayResponse } from '../../utils/normalizeResponse';

export default function ClientBudget() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientAPI.payments.list().then((res) => {
      setPayments(normalizeApiArrayResponse(res.data));
    }).catch(() => { setPayments([]); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const totalPaid = payments.filter((p) => p.is_paid).reduce((sum, p) => sum + Number(p.amount), 0);
  const totalDue = payments.filter((p) => !p.is_paid).reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <>
      <Helmet><title>Budget Mariage — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-5xl">
          <h1 className="font-serif text-2xl text-charbon mb-2">Budget</h1>
          <p className="text-sm text-charbon/50 mb-8">Suivez vos dépenses et paiements.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-6 rounded-sm shadow-card">
              <CreditCard size={20} className="text-sauge mb-2" />
              <p className="font-serif text-2xl text-charbon">{totalPaid.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-charbon/50">Payé</p>
            </div>
            <div className="bg-white p-6 rounded-sm shadow-card">
              <TrendingUp size={20} className="text-blush mb-2" />
              <p className="font-serif text-2xl text-charbon">{totalDue.toLocaleString('fr-FR')}€</p>
              <p className="text-xs text-charbon/50">Restant dû</p>
            </div>
          </div>

          <div className="space-y-3">
            {payments.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white p-5 rounded-sm shadow-card flex items-center justify-between ${p.is_paid ? 'border-l-4 border-sauge' : 'border-l-4 border-perle'}`}
              >
                <div>
                  <p className="text-sm text-charbon font-medium">{p.label}</p>
                  <p className="text-xs text-charbon/40">{p.category} — {p.due_date ? new Date(p.due_date).toLocaleDateString('fr-FR') : ''}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${p.is_paid ? 'text-sauge' : 'text-charbon'}`}>{Number(p.amount).toLocaleString('fr-FR')}€</p>
                  <p className={`text-[10px] uppercase ${p.is_paid ? 'text-sauge' : 'text-charbon/30'}`}>{p.is_paid ? 'Payé' : 'En attente'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
