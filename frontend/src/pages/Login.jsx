import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/common/PageTransition';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Connexion réussie !');
      navigate('/client');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Helmet><title>Connexion — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen flex items-center">
        <div className="section-container max-w-md w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-sm shadow-card">
            <h1 className="font-serif text-2xl text-charbon text-center mb-2">Connexion</h1>
            <p className="text-xs text-charbon/50 text-center mb-8">Accédez à votre espace client</p>

            <form onSubmit={submit} className="space-y-5">
              <input className="input-elegant w-full" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <input className="input-elegant w-full" type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <p className="text-xs text-charbon/50 text-center mt-6">
              Pas encore de compte ? <Link to="/inscription" className="text-champagne hover:underline">S'inscrire</Link>
            </p>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
