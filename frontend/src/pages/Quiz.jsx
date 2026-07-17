import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sparkles, ArrowRight, RotateCcw, Heart } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import { QUIZ_STEPS } from '../utils/constants';

const results = {
  romantique: { title: 'Romantique & Intemporel', desc: 'Vous êtes une âme romantique. Dentelle, blush et lumières tamisées... votre mariage sera un conte de fées moderne.', palette: ['#E8C4C4', '#C9A96E', '#FAF6F1'] },
  boheme: { title: 'Bohème & Naturel', desc: 'Libre et authentique. Vous privilégiez les matières naturelles, les fleurs sauvages et une ambiance décontractée chic.', palette: ['#7D9B76', '#D4A574', '#F5ECE0'] },
  luxe: { title: 'Luxe & Prestige', desc: 'Vous aimez le raffinement extrême. Dorures, cristaux et lieux d\'exception sont faits pour vous.', palette: ['#C9A96E', '#1A1A2E', '#FAF6F1'] },
  moderne: { title: 'Moderne & Design', desc: 'Lignes épurées, design contemporain et originalité. Votre mariage sera une expérience artistique unique.', palette: ['#1A1A2E', '#C9A96E', '#FFFFFF'] },
  champetre: { title: 'Champêtre & Authentique', desc: 'Vous rêvez d\'un mariage en plein air, rustique et chaleureux. La nature sera votre plus belle décoration.', palette: ['#7D9B76', '#D4A574', '#E8D5C4'] },
};

const STORAGE_KEY = 'eae_quiz';

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function Quiz() {
  const saved = loadSaved();
  const [step, setStep] = useState(saved?.step ?? 0);
  const [answers, setAnswers] = useState(saved?.answers ?? {});
  const [result, setResult] = useState(null);

  // Persist progress to localStorage
  useEffect(() => {
    if (!result) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
    }
  }, [step, answers, result]);

  const select = (value) => {
    const newAnswers = { ...answers, [QUIZ_STEPS[step].key]: value };
    setAnswers(newAnswers);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Compute result
      const counts = {};
      Object.values(newAnswers).forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
      const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      setResult(results[top] || results.romantique);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setResult(null); localStorage.removeItem(STORAGE_KEY); };

  if (result) {
    return (
      <PageTransition>
        <Helmet><title>Résultat Quiz Style — Ever After Events</title></Helmet>
        <section className="section-padding bg-ivory pt-32 min-h-screen flex items-center">
          <div className="section-container max-w-2xl text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-champagne/20 flex items-center justify-center">
              <Heart size={36} className="text-champagne" />
            </motion.div>
            <h1 className="font-serif text-4xl text-charbon mb-4">Votre style : {result.title}</h1>
            <p className="text-charbon/60 leading-relaxed mb-8">{result.desc}</p>
            <div className="flex justify-center gap-3 mb-8">
              {result.palette.map((c, i) => <div key={i} className="w-12 h-12 rounded-full border-2 border-white shadow" style={{ backgroundColor: c }} />)}
            </div>
            <div className="flex gap-4 justify-center">
              <a href="/rendez-vous" className="btn-primary">Prendre rendez-vous</a>
              <button onClick={reset} className="btn-secondary flex items-center gap-2"><RotateCcw size={16} /> Refaire le quiz</button>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  const q = QUIZ_STEPS[step];

  return (
    <PageTransition>
      <Helmet><title>Quiz Style de Mariage — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen flex items-center">
        <div className="section-container max-w-3xl">
          <div className="text-center mb-8">
            <Sparkles className="inline-block text-champagne mb-2" size={28} />
            <SectionTitle title="Quel est votre style ?" subtitle="Répondez à quelques questions pour découvrir le style de mariage qui vous correspond." />
          </div>

          <div className="flex justify-center gap-2 mb-12">
            {QUIZ_STEPS.map((_, i) => (
              <div key={i} className={`w-10 h-1 rounded transition-colors ${i <= step ? 'bg-champagne' : 'bg-perle'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
              <h3 className="font-serif text-2xl text-charbon mb-8">{q.question}</h3>
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {q.options.map((opt) => (
                  <motion.button key={opt.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => select(opt.value)}
                    className="p-6 bg-white rounded-sm shadow-card hover:shadow-card-hover transition-shadow text-center group"
                  >
                    <span className="text-4xl mb-3 block">{opt.emoji || '💍'}</span>
                    <span className="text-sm text-charbon/70 group-hover:text-champagne transition-colors">{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="text-center mt-8">
            <button onClick={() => step > 0 && setStep(step - 1)} className="text-sm text-charbon/50 hover:text-charbon transition-colors">← Question précédente</button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
