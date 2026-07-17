import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, User, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function AdminClients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => adminAPI.users.list({ search }).then((res) => setUsers(res.data?.items || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [search]);

  const toggleStatus = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      toast.success('Statut mis à jour');
      load();
    } catch { toast.error('Erreur'); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet><title>Clients — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-5xl">
          <h1 className="font-serif text-2xl text-charbon mb-8">Clients</h1>

          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charbon/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client..." className="input-elegant w-full pl-12" />
          </div>

          <div className="bg-white rounded-sm shadow-card overflow-hidden">
            {users.map((u, i) => (
              <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-4 p-5 ${i < users.length - 1 ? 'border-b border-perle' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-perle flex items-center justify-center">
                  <User size={16} className="text-charbon/40" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-charbon">{u.first_name} {u.last_name}</p>
                  <p className="text-xs text-charbon/40">{u.email} · {u.role}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${u.is_active ? 'bg-sauge/10 text-sauge' : 'bg-red-50 text-red-300'}`}>
                  {u.is_active ? 'Actif' : 'Inactif'}
                </span>
                <button onClick={() => toggleStatus(u.id)} className="p-2 hover:bg-perle rounded-full transition-colors">
                  {u.is_active ? <X size={14} className="text-red-300" /> : <Check size={14} className="text-sauge" />}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
