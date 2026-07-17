import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/common/PageTransition';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ first_name: '', email: '', password: '', confirm_password: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await register({ first_name: form.first_name, email: form.email, password: form.password });
      toast.success('Inscription réussie !');
      navigate('/client');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Erreur lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Helmet><title>Inscription — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen flex items-center">
        <div className="section-container max-w-md w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-sm shadow-card">
            <h1 className="font-serif text-2xl text-charbon text-center mb-2">Inscription</h1>
            <p className="text-xs text-charbon/50 text-center mb-8">Créez votre espace client Ever After Events</p>

            <form onSubmit={submit} className="space-y-5">
              <input className="input-elegant w-full" placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              <input className="input-elegant w-full" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input className="input-elegant w-full" type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
              <input className="input-elegant w-full" type="password" placeholder="Confirmer le mot de passe" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} required />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                {loading ? 'Inscription...' : 'Créer mon compte'}
              </button>
            </form>

            <p className="text-xs text-charbon/50 text-center mt-6">
              Déjà un compte ? <Link to="/login" className="text-champagne hover:underline">Se connecter</Link>
            </p>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
