import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Image as ImageIcon, Settings, Calculator, Calendar, CheckCircle, Phone, ArrowRight, RotateCcw, Plus, Trash2, RefreshCw, Heart } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '../components/common/PageTransition';
import { QUIZ_STEPS, WEDDING_STYLES, BUDGET_REGIONS, SITE_NAME } from '../utils/constants';
import { rdvAPI, projectAPI } from '../services/api';

const STORAGE_KEY = 'eae_flow';

const STEPS = [
  { key: 'quiz', label: 'Style', icon: Sparkles },
  { key: 'moodboard', label: 'Inspiration', icon: ImageIcon },
  { key: 'config', label: 'Configuration', icon: Settings },
  { key: 'budget', label: 'Budget', icon: Calculator },
  { key: 'booking', label: 'Réservation', icon: Calendar },
];

// ---------- Quiz results ----------
const QUIZ_RESULTS = {
  romantique: { title: 'Romantique & Intemporel', desc: 'Vous êtes une âme romantique.', palette: ['#E8C4C4', '#C9A96E', '#FAF6F1'] },
  boheme: { title: 'Bohème & Naturel', desc: 'Libre et authentique.', palette: ['#7D9B76', '#D4A574', '#F5ECE0'] },
  luxe: { title: 'Luxe & Prestige', desc: 'Raffinement extrême.', palette: ['#C9A96E', '#1A1A2E', '#FAF6F1'] },
  moderne: { title: 'Moderne & Design', desc: 'Lignes épurées.', palette: ['#1A1A2E', '#C9A96E', '#FFFFFF'] },
  champetre: { title: 'Champêtre & Authentique', desc: 'Nature et authenticité.', palette: ['#7D9B76', '#D4A574', '#E8D5C4'] },
};

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

// ==============================
// Quiz Step
// ==============================
function QuizStep({ data, onUpdate, onSkip }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(data?.quiz?.answers ?? {});
  const [done, setDone] = useState(!!data?.quiz?.style);

  if (done && data?.quiz?.style) {
    const res = QUIZ_RESULTS[data.quiz.style];
    return (
      <div className="text-center py-8">
        <Heart size={40} className="mx-auto text-champagne mb-3" />
        <p className="font-serif text-xl text-charbon mb-1">Style trouvé : <span className="text-champagne">{res?.title || data.quiz.style}</span></p>
        <div className="flex justify-center gap-2 mt-3 mb-4">
          {res?.palette.map((c, i) => <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: c }} />)}
        </div>
        <button onClick={() => { setStep(0); setAnswers({}); setDone(false); onUpdate({ quiz: null }); }}
          className="text-xs text-charbon/40 hover:text-charbon transition-colors flex items-center gap-1 mx-auto">
          <RotateCcw size={12} /> Refaire le quiz
        </button>
      </div>
    );
  }

  const q = QUIZ_STEPS[step];

  const select = (value) => {
    const newAnswers = { ...answers, [q.key]: value };
    setAnswers(newAnswers);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Compute result
      const counts = {};
      Object.values(newAnswers).forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
      const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      const style = top || 'romantique';
      onUpdate({ quiz: { style, answers: newAnswers } });
      setDone(true);
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-1.5 mb-6">
        {QUIZ_STEPS.map((_, i) => (
          <div key={i} className={`w-8 h-1 rounded transition-colors ${i <= step ? 'bg-champagne' : 'bg-perle'}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="text-center">
          <h3 className="font-serif text-xl text-charbon mb-6">{q.question}</h3>
          <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
            {q.options.map((opt) => (
              <motion.button key={opt.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => select(opt.value)}
                className="p-4 bg-white rounded-sm shadow-card hover:shadow-card-hover transition-shadow text-center group"
              >
                <span className="text-3xl mb-2 block">{opt.emoji || '💍'}</span>
                <span className="text-xs text-charbon/70 group-hover:text-champagne transition-colors">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between mt-6 max-w-xs mx-auto">
        <button onClick={() => step > 0 && setStep(step - 1)} className="text-xs text-charbon/40 hover:text-charbon transition-colors">← Retour</button>
        <button onClick={onSkip} className="text-xs text-charbon/40 hover:text-champagne transition-colors">Ignorer →</button>
      </div>
    </div>
  );
}

// ==============================
// Moodboard Step
// ==============================
function MoodboardStep({ data, onUpdate, onSkip }) {
  const images = data?.moodboard?.images ?? [];
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const addImage = () => {
    if (!url) return;
    const newImages = [...images, { id: Date.now(), url, caption }];
    onUpdate({ moodboard: { images: newImages } });
    setUrl(''); setCaption('');
  };

  const removeImage = (id) => {
    onUpdate({ moodboard: { images: images.filter((i) => i.id !== id) } });
  };

  return (
    <div>
      <div className="flex gap-3 items-end mb-6">
        <div className="flex-1">
          <label className="block text-xs text-charbon/40 mb-1">URL de l'image</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="input-elegant w-full text-sm" />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-charbon/40 mb-1">Légende</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optionnel" className="input-elegant w-full text-sm" />
        </div>
        <button onClick={addImage} className="btn-primary text-sm px-4 py-2 flex items-center gap-1"><Plus size={14} /> Ajouter</button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon size={36} className="mx-auto text-charbon/20 mb-3" />
          <p className="text-sm text-charbon/40">Ajoutez des images d'inspiration</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover rounded-sm" />
              <button onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-charbon/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={12} />
              </button>
              {img.caption && <p className="text-xs text-charbon/50 mt-1 truncate">{img.caption}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <button onClick={onSkip} className="text-xs text-charbon/40 hover:text-champagne transition-colors">Ignorer cette étape →</button>
      </div>
    </div>
  );
}

// ==============================
// Configurateur Step
// ==============================
function ConfigStep({ data, onUpdate, onSkip }) {
  const config = data?.config ?? { style: '', colors: [], ambiance: '' };

  const update = (k, v) => onUpdate({ config: { ...config, [k]: v } });

  const toggleColor = (c) => {
    const colors = config.colors.includes(c) ? config.colors.filter((x) => x !== c) : [...config.colors, c];
    update('colors', colors);
  };

  return (
    <div className="space-y-8">
      {/* Style */}
      <div>
        <h4 className="font-serif text-lg text-charbon mb-3">Style de mariage</h4>
        <div className="grid grid-cols-3 gap-3">
          {WEDDING_STYLES.map((s) => (
            <button key={s.value} onClick={() => update('style', s.value)}
              className={`p-3 rounded-sm border text-center transition-all text-sm ${
                config.style === s.value ? 'border-champagne bg-champagne/5' : 'border-perle hover:border-champagne/50'
              }`}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* Couleurs */}
      <div>
        <h4 className="font-serif text-lg text-charbon mb-3">Palette de couleurs</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {['#C9A96E','#1A1A2E','#FAF6F1','#E8C4C4','#7D9B76','#D4A574','#B76E79','#2C5F2D','#6B4E71','#E8D5C4'].map((c) => (
            <button key={c} onClick={() => toggleColor(c)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${config.colors.includes(c) ? 'border-charbon scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Ambiance */}
      <div>
        <h4 className="font-serif text-lg text-charbon mb-3">Ambiance</h4>
        <div className="grid grid-cols-2 gap-3">
          {[{ v: 'intime', label: 'Intime & Cosy' }, { v: 'grandiose', label: 'Grandiose' }, { v: 'detendu', label: 'Décontracté' }, { v: 'religieux', label: 'Solennel' }].map((a) => (
            <button key={a.v} onClick={() => update('ambiance', a.v)}
              className={`p-3 rounded-sm border text-center transition-all text-sm ${
                config.ambiance === a.v ? 'border-champagne bg-champagne/5' : 'border-perle hover:border-champagne/50'
              }`}
            >{a.label}</button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button onClick={onSkip} className="text-xs text-charbon/40 hover:text-champagne transition-colors">Ignorer cette étape →</button>
      </div>
    </div>
  );
}

// ==============================
// Budget Step
// ==============================
function BudgetStep({ data, onUpdate, onSkip }) {
  const budget = data?.budget ?? { total: 8000000, guests: 100, region: 'cotonou' };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-sm border border-perle">
        <label className="block text-xs text-charbon/50 mb-2">Budget total estimé</label>
        <div className="flex items-center gap-4">
          <input type="range" min={500000} max={50000000} step={500000} value={budget.total}
            onChange={(e) => onUpdate({ budget: { ...budget, total: Number(e.target.value) } })}
            className="flex-1 accent-champagne" />
          <span className="font-serif text-xl text-champagne min-w-[140px] text-right whitespace-nowrap">
            {budget.total.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-sm border border-perle">
          <label className="block text-xs text-charbon/50 mb-1">Invités</label>
          <input type="number" min={10} max={2000} step={10} value={budget.guests}
            onChange={(e) => onUpdate({ budget: { ...budget, guests: Math.max(10, Number(e.target.value)) } })}
            className="input-elegant w-full text-center" />
        </div>
        <div className="bg-white p-4 rounded-sm border border-perle">
          <label className="block text-xs text-charbon/50 mb-1">Région</label>
          <select value={budget.region} onChange={(e) => onUpdate({ budget: { ...budget, region: e.target.value } })}
            className="input-elegant w-full text-sm">
            {BUDGET_REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onSkip} className="text-xs text-charbon/40 hover:text-champagne transition-colors">Ignorer cette étape →</button>
      </div>
    </div>
  );
}

// ==============================
// Booking Step (Final)
// ==============================
function BookingStep({ data, onUpdate, onSubmit }) {
  const booking = data?.booking ?? { first_name: '', last_name: '', email: '', phone: '', notes: '' };
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    setLoading(true);
    rdvAPI.disponibilites().then((res) => {
      setSlots(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (k, v) => {
    const newBooking = { ...booking, [k]: v };
    onUpdate({ booking: newBooking });
  };

  const submit = () => {
    if (!booking.first_name || !booking.email || !booking.phone || !selectedSlot) return;
    onSubmit({ ...booking, slot_id: selectedSlot.id });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-charbon/50 mb-1">Prénom *</label>
          <input value={booking.first_name} onChange={(e) => update('first_name', e.target.value)}
            className="input-elegant w-full" placeholder="Votre prénom" />
        </div>
        <div>
          <label className="block text-xs text-charbon/50 mb-1">Nom *</label>
          <input value={booking.last_name} onChange={(e) => update('last_name', e.target.value)}
            className="input-elegant w-full" placeholder="Votre nom" />
        </div>
      </div>

      <div>
        <label className="block text-xs text-charbon/50 mb-1">Email *</label>
        <input type="email" value={booking.email} onChange={(e) => update('email', e.target.value)}
          className="input-elegant w-full" placeholder="vous@exemple.com" />
      </div>

      <div>
        <label className="block text-xs text-charbon/50 mb-1 flex items-center gap-1">
          <Phone size={12} /> Numéro WhatsApp *
        </label>
        <input type="tel" value={booking.phone} onChange={(e) => update('phone', e.target.value)}
          className="input-elegant w-full" placeholder="+229 97 XX XX XX" />
        <p className="text-xs text-charbon/30 mt-1">C'est par WhatsApp que nous vous contacterons.</p>
      </div>

      <div>
        <label className="block text-xs text-charbon/50 mb-1">Message (optionnel)</label>
        <textarea value={booking.notes} onChange={(e) => update('notes', e.target.value)}
          className="input-elegant w-full min-h-[80px]" placeholder="Parlez-nous de votre projet..." />
      </div>

      {/* Slots */}
      <div>
        <h4 className="font-serif text-base text-charbon mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-champagne" /> Choisissez un créneau *
        </h4>
        {loading ? (
          <p className="text-sm text-charbon/40 text-center py-4">Chargement...</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-charbon/40 text-center py-4">Aucun créneau disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                className={`p-3 rounded-sm border text-center transition-all text-sm ${
                  selectedSlot?.id === slot.id ? 'border-champagne bg-champagne/5' : 'border-perle hover:border-champagne/50'
                }`}
              >
                <Calendar size={14} className="mx-auto mb-1 text-champagne" />
                <p className="text-xs">{new Date(slot.start_time).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                <p className="text-xs text-charbon/50">{new Date(slot.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={submit}
        disabled={!booking.first_name || !booking.email || !booking.phone || !selectedSlot}
        className="btn-primary w-full py-3 disabled:opacity-40 text-sm">
        Confirmer ma réservation
      </button>
    </div>
  );
}

// ==============================
// Main BookingFlow Component
// ==============================
export default function BookingFlow() {
  const saved = loadSaved();
  const [step, setStep] = useState(0);
  const [flowData, setFlowData] = useState(saved ?? {});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    if (!confirmed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flowData));
    }
  }, [flowData, confirmed]);

  const updateFlowData = (section) => {
    setFlowData((prev) => ({ ...prev, ...section }));
  };

  const goToStep = (s) => setStep(s);

  const skip = () => {
    if (step < STEPS.length - 1) goToStep(step + 1);
  };

  const handleSubmit = async (bookingInfo) => {
    setSubmitting(true);
    try {
      // 1. Book the RDV slot
      await rdvAPI.reserver({ slot_id: bookingInfo.slot_id, ...bookingInfo });

      // 2. Submit project data
      await projectAPI.submit({
        first_name: bookingInfo.first_name,
        last_name: bookingInfo.last_name,
        email: bookingInfo.email,
        phone: bookingInfo.phone,
        notes: bookingInfo.notes || '',
        quiz_style: flowData.quiz?.style || null,
        quiz_answers: flowData.quiz?.answers || null,
        moodboard_images: flowData.moodboard?.images?.map((i) => ({ url: i.url, caption: i.caption })) || null,
        configurateur_config: flowData.config || null,
        budget_data: flowData.budget || null,
      });

      setConfirmed(true);
      localStorage.removeItem(STORAGE_KEY);
      toast.success('Rendez-vous confirmé ! ✨');
    } catch (err) {
      toast.error('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmation screen
  if (confirmed) {
    return (
      <PageTransition>
        <Helmet><title>Projet envoyé — {SITE_NAME}</title></Helmet>
        <section className="section-padding bg-ivory pt-32 min-h-screen flex items-center">
          <div className="section-container max-w-lg text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-champagne/20 flex items-center justify-center">
              <CheckCircle size={40} className="text-champagne" />
            </motion.div>
            <h1 className="font-serif text-3xl text-charbon mb-4">Votre projet a été envoyé !</h1>
            <p className="text-charbon/60 mb-2">Nous avons bien reçu votre demande.</p>
            <p className="text-charbon/60 mb-8">Nous vous contacterons par <strong>WhatsApp</strong> sous 24h pour échanger sur votre projet.</p>
            <div className="bg-charbon p-6 rounded-sm mb-8">
              <p className="text-white/60 text-sm mb-2">Vous pouvez aussi nous écrire directement :</p>
              <a href="https://wa.me/22997123456" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-champagne text-charbon px-6 py-3 rounded-sm font-medium hover:bg-champagne/90 transition-colors">
                <Phone size={18} /> Nous contacter sur WhatsApp
              </a>
            </div>
            <a href="/" className="text-sm text-charbon/40 hover:text-charbon transition-colors">← Retour à l'accueil</a>
          </div>
        </section>
      </PageTransition>
    );
  }

  const currentStep = STEPS[step];

  return (
    <PageTransition>
      <Helmet><title>Mon Projet — {SITE_NAME}</title></Helmet>
      <section className="section-padding bg-ivory pt-28 min-h-screen">
        <div className="section-container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl text-charbon mb-2">Créez votre projet</h1>
            <p className="text-sm text-charbon/50">Répondez aux étapes pour nous aider à comprendre vos envies.</p>
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center mb-8 bg-white rounded-sm shadow-card p-3">
            {STEPS.map((s, i) => (
              <button key={s.key} onClick={() => i <= step ? goToStep(i) : null}
                className={`flex flex-col items-center gap-1 transition-all ${
                  i === step ? 'text-champagne' : i < step ? 'text-charbon/50' : 'text-charbon/20 cursor-default'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  i === step ? 'bg-champagne text-white' : i < step ? 'bg-champagne/20 text-champagne' : 'bg-perle text-charbon/20'
                }`}>
                  <s.icon size={14} />
                </div>
                <span className="text-[10px] uppercase tracking-wider hidden sm:block">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-card min-h-[300px]">
            {step === 0 && <QuizStep data={flowData} onUpdate={updateFlowData} onSkip={skip} />}
            {step === 1 && <MoodboardStep data={flowData} onUpdate={updateFlowData} onSkip={skip} />}
            {step === 2 && <ConfigStep data={flowData} onUpdate={updateFlowData} onSkip={skip} />}
            {step === 3 && <BudgetStep data={flowData} onUpdate={updateFlowData} onSkip={skip} />}
            {step === 4 && (
              <BookingStep data={flowData} onUpdate={updateFlowData} onSubmit={handleSubmit} />
            )}
          </div>

          {/* Navigation buttons (for steps without internal nav) */}
          {step < 4 && step > 0 && (
            <div className="flex justify-between mt-4">
              <button onClick={() => goToStep(step - 1)} className="text-xs text-charbon/40 hover:text-charbon transition-colors">
                ← Étape précédente
              </button>
            </div>
          )}

          {submitting && (
            <div className="text-center mt-4 text-sm text-champagne">
              Réservation en cours...
            </div>
          )}

          <p className="text-xs text-charbon/20 text-center mt-6">
            <RefreshCw size={10} className="inline mr-1" /> Vos réponses sont sauvegardées automatiquement.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
