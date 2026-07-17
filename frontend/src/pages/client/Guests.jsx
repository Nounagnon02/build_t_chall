import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Plus, User, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function ClientGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', group_name: '' });

  const load = () => clientAPI.guests.list().then((res) => setGuests(normalizeApiArrayResponse(res.data))).catch(() => { setGuests([]); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await clientAPI.createGuest(form);
      toast.success('Invité ajouté');
      setForm({ first_name: '', last_name: '', email: '', group_name: '' });
      setShowForm(false);
      load();
    } catch { toast.error('Erreur'); }
  };

  const updateStatus = async (id, attending) => {
    try { await clientAPI.updateGuest(id, { is_attending: attending }); load(); }
    catch { toast.error('Erreur'); }
  };

  if (loading) return <LoadingScreen />;

  const confirmed = guests.filter((g) => g.is_attending).length;
  const declined = guests.filter((g) => g.is_attending === false).length;
  const pending = guests.filter((g) => g.is_attending === null).length;

  return (
    <>
      <Helmet><title>Liste d'Invites — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-charbon mb-2">Invités</h1>
              <p className="text-sm text-charbon/50">{guests.length} invités — {confirmed} confirmés · {declined} déclinés · {pending} en attente</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Ajouter</button>
          </div>

          {showForm && (
            <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={add}
              className="bg-white p-6 rounded-sm shadow-card mb-6 flex flex-wrap gap-4 items-end"
            >
              <input className="input-elegant flex-1 min-w-[150px]" placeholder="Prénom *" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              <input className="input-elegant flex-1 min-w-[150px]" placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              <input className="input-elegant flex-1 min-w-[150px]" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <select className="input-elegant flex-1 min-w-[120px]" value={form.group_name} onChange={(e) => setForm({ ...form, group_name: e.target.value })}>
                <option value="">Groupe</option>
                <option value="famille">Famille</option>
                <option value="amis">Amis</option>
                <option value="collegues">Collègues</option>
              </select>
              <button type="submit" className="btn-primary">Ajouter</button>
            </motion.form>
          )}

          <div className="space-y-2">
            {guests.map((g) => (
              <motion.div key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white p-4 rounded-sm shadow-card flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-perle flex items-center justify-center shrink-0">
                  <User size={16} className="text-charbon/40" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-charbon">{g.first_name} {g.last_name}</p>
                  <p className="text-xs text-charbon/40">{g.group_name} {g.email ? `· ${g.email}` : ''}</p>
                </div>
                <div className="flex gap-2">
                  {g.is_attending === null && (
                    <>
                      <button onClick={() => updateStatus(g.id, true)} className="p-2 rounded-full hover:bg-sauge/10 text-sauge"><Check size={16} /></button>
                      <button onClick={() => updateStatus(g.id, false)} className="p-2 rounded-full hover:bg-red-50 text-red-300"><X size={16} /></button>
                    </>
                  )}
                  {g.is_attending === true && <span className="text-xs text-sauge px-3 py-1 bg-sauge/10 rounded-full">✓ Confirmé</span>}
                  {g.is_attending === false && <span className="text-xs text-red-300 px-3 py-1 bg-red-50 rounded-full">Décliné</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
