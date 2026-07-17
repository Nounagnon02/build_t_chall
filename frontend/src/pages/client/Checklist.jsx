import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';
import { normalizeApiArrayResponse } from '../../utils/normalizeResponse';

export default function ClientChecklist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');

  const load = () => clientAPI.checklist.list().then((res) => setItems(normalizeApiArrayResponse(res.data))).catch(() => { setItems([]); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newTitle.trim()) return;
    try {
      await clientAPI.createChecklistItem({ title: newTitle });
      setNewTitle('');
      toast.success('Tâche ajoutée');
      load();
    } catch { toast.error('Erreur'); }
  };

  const toggle = async (id, completed) => {
    try { await clientAPI.updateChecklistItem(id, { is_completed: !completed }); load(); }
    catch { toast.error('Erreur'); }
  };

  const remove = async (id) => {
    try { await clientAPI.deleteChecklistItem(id); load(); }
    catch { toast.error('Erreur'); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet><title>Checklist Mariage — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-3xl">
          <h1 className="font-serif text-2xl text-charbon mb-2">Checklist</h1>
          <p className="text-sm text-charbon/50 mb-8">Suivez l'avancement de la préparation de votre mariage.</p>

          <div className="flex gap-3 mb-8">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ajouter une tâche..." className="input-elegant flex-1" onKeyDown={(e) => e.key === 'Enter' && add()} />
            <button onClick={add} disabled={!newTitle.trim()} className="btn-primary !py-2"><Plus size={18} /></button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  className={`bg-white p-4 rounded-sm shadow-card flex items-center gap-4 ${item.is_completed ? 'opacity-60' : ''}`}
                >
                  <button onClick={() => toggle(item.id, item.is_completed)} className="shrink-0">
                    {item.is_completed ? <CheckCircle2 size={20} className="text-champagne" /> : <Circle size={20} className="text-perle hover:text-champagne/50" />}
                  </button>
                  <p className={`flex-1 text-sm ${item.is_completed ? 'line-through text-charbon/40' : 'text-charbon'}`}>{item.title}</p>
                  <button onClick={() => remove(item.id)} className="text-charbon/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {items.length === 0 && <p className="text-center text-charbon/40 py-12">Aucune tâche pour le moment.</p>}
        </div>
      </section>
    </>
  );
}
