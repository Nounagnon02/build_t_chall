import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import { rdvAPI } from '../services/api';
import { normalizeApiArrayResponse } from '../utils/normalizeResponse';

export default function Appointment() {
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', notes: '' });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step === 2) {
      setLoading(true);
      rdvAPI.disponibilites().then((res) => {
        setSlots(normalizeApiArrayResponse(res.data));
      }).catch(() => { setSlots([]); }).finally(() => setLoading(false));
    }
  }, [step]);

  const book = async () => {
    if (!selectedSlot) return;
    try {
      await rdvAPI.reserver({ slot_id: selectedSlot.id, ...form });
      setDone(true);
      toast.success('Rendez-vous confirmé ! ✨');
    } catch {
      toast.error('Erreur lors de la réservation.');
    }
  };

  return (
    <PageTransition>
      <Helmet><title>Prendre Rendez-vous — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-3xl">
          <SectionTitle title="Prendre Rendez-vous" subtitle="Rencontrez-nous pour discuter de votre projet. Gratuit et sans engagement." />

          {done ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white p-12 rounded-sm shadow-card">
              <CheckCircle size={48} className="mx-auto text-champagne mb-4" />
              <h2 className="font-serif text-2xl text-charbon mb-2">Rendez-vous confirmé !</h2>
              <p className="text-charbon/60 mb-6">Nous vous enverrons un email de confirmation avec les détails.</p>
              <a href="/" className="btn-primary">Retour à l'accueil</a>
            </motion.div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-card">
              <div className="flex gap-2 mb-8">
                {[1, 2].map((s) => (
                  <div key={s} className={`flex-1 h-1 rounded transition-colors ${s <= step ? 'bg-champagne' : 'bg-perle'}`} />
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="font-serif text-xl text-charbon mb-4">Vos coordonnées</h3>
                  <input className="input-elegant w-full" placeholder="Prénom *" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                  <input className="input-elegant w-full" placeholder="Nom *" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
                  <input className="input-elegant w-full" type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input className="input-elegant w-full" type="tel" placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <textarea className="input-elegant w-full min-h-[100px]" placeholder="Parlez-nous de votre projet..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  <button onClick={() => setStep(2)} disabled={!form.first_name || !form.email} className="btn-primary w-full disabled:opacity-40">Voir les disponibilités</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="font-serif text-xl text-charbon mb-4">Choisissez un créneau</h3>
                  {loading ? (
                    <p className="text-charbon/40 text-center py-8">Chargement des disponibilités...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-charbon/40 text-center py-8">Aucun créneau disponible pour le moment.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      {slots.map((slot) => (
                        <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                          className={`p-4 rounded-sm border text-center transition-all ${
                            selectedSlot?.id === slot.id ? 'border-champagne bg-champagne/5' : 'border-perle hover:border-champagne/50'
                          }`}
                        >
                          <Calendar size={16} className="mx-auto mb-1 text-champagne" />
                          <p className="text-xs text-charbon/70">{new Date(slot.start_time).toLocaleDateString('fr-FR')}</p>
                          <p className="text-xs text-charbon/50">{new Date(slot.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Retour</button>
                    <button onClick={book} disabled={!selectedSlot} className="btn-primary flex-1 disabled:opacity-40">Confirmer le rendez-vous</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
