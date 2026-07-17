import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../../components/common/PageTransition';

export default function ClientSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { authAPI } = await import('../../services/api');
      await authAPI.updateProfile(form);
      toast.success('Paramètres mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Helmet><title>Paramètres — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-2xl">
          <h1 className="font-serif text-2xl text-charbon mb-2">Paramètres</h1>
          <p className="text-sm text-charbon/50 mb-8">Gérez vos informations personnelles.</p>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={save} className="bg-white p-8 rounded-sm shadow-card space-y-5"
          >
            <div className="flex items-center gap-4 pb-6 border-b border-perle mb-2">
              <div className="w-16 h-16 rounded-full bg-champagne/20 flex items-center justify-center">
                <User size={28} className="text-champagne" />
              </div>
              <div>
                <p className="font-medium text-charbon">{user?.email}</p>
                <p className="text-xs text-charbon/40">Client</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input className="input-elegant w-full" placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              <input className="input-elegant w-full" placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <input className="input-elegant w-full" type="tel" placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input-elegant w-full opacity-50" type="email" placeholder="Email" value={user?.email || ''} disabled />

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-40">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Enregistrer
            </button>
          </motion.form>
        </div>
      </section>
    </PageTransition>
  );
}
