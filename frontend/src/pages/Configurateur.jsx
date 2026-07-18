import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Settings, Palette, Layout, Heart, Check, RefreshCw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import { WEDDING_STYLES } from '../utils/constants';

const configSteps = [
  { key: 'style', title: 'Style', icon: Palette },
  { key: 'colors', title: 'Couleurs', icon: Heart },
  { key: 'ambiance', title: 'Ambiance', icon: Layout },
];

const STORAGE_KEY = 'eae_configurateur';

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function Configurateur() {
  const saved = loadSaved();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState(
    saved ?? { style: '', colors: [], ambiance: '', venue: '', guests: '' }
  );

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const update = (k, v) => setConfig((c) => ({ ...c, [k]: v }));

  const reset = () => {
    setConfig({ style: '', colors: [], ambiance: '', venue: '', guests: '' });
    setStep(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasConfig = config.style || config.colors.length > 0 || config.ambiance;

  return (
    <PageTransition>
      <Helmet><title>Configurateur de Mariage — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-4xl">
          <SectionTitle title="Configurateur" subtitle="Créez l'univers de votre mariage étape par étape." />

          <div className="flex justify-start gap-2 overflow-x-auto pb-2 mb-8 sm:justify-center sm:gap-4 sm:mb-12 scrollbar-hide">
            {configSteps.map((s, i) => (
              <button key={s.key} onClick={() => setStep(i)}
                className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                  i === step ? 'bg-champagne text-white' : i < step ? 'bg-champagne/20 text-champagne' : 'bg-white text-charbon/40'
                }`}
              >{i < step ? <Check size={14} /> : <s.icon size={14} />} {s.title}</button>
            ))}
          </div>

          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 sm:p-8 md:p-12 rounded-sm shadow-card">
            {step === 0 && (
              <div>
                <h3 className="font-serif text-xl text-charbon mb-6">Choisissez votre style</h3>
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {WEDDING_STYLES.map((s) => (
                    <motion.button key={s.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => update('style', s.value)}
                      className={`min-h-16 p-4 sm:p-6 rounded-sm border text-center transition-all ${
                        config.style === s.value ? 'border-champagne bg-champagne/5' : 'border-perle hover:border-champagne/50'
                      }`}
                    ><span className="font-serif text-charbon">{s.label}</span></motion.button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h3 className="font-serif text-xl text-charbon mb-6">Votre palette</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {['#C9A96E','#1A1A2E','#FAF6F1','#E8C4C4','#7D9B76','#D4A574','#B76E79','#2C5F2D','#6B4E71','#E8D5C4'].map((c) => (
                    <button key={c} onClick={() => {
                      const colors = config.colors.includes(c) ? config.colors.filter((x) => x !== c) : [...config.colors, c];
                      update('colors', colors);
                    }}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${config.colors.includes(c) ? 'border-charbon scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 className="font-serif text-xl text-charbon mb-6">Ambiance recherchée</h3>
                <div className="space-y-4">
                  {[{ v: 'intime', label: 'Intime & Cosy' }, { v: 'grandiose', label: 'Grandiose & Spectaculaire' }, { v: 'detendu', label: 'Décontracté & Festif' }, { v: 'religieux', label: 'Solennel & Traditionnel' }].map((a) => (
                    <button key={a.v} onClick={() => update('ambiance', a.v)}
                      className={`w-full p-4 rounded-sm border text-left transition-all ${
                        config.ambiance === a.v ? 'border-champagne bg-champagne/5' : 'border-perle hover:border-champagne/50'
                      }`}
                    ><span className="font-medium text-charbon">{a.label}</span></button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex justify-between max-w-md w-full">
              <button disabled={step === 0} onClick={() => setStep(step - 1)} className="btn-secondary disabled:opacity-30">← Retour</button>
              {step < configSteps.length - 1 ? (
                <button onClick={() => setStep(step + 1)} className="btn-primary">Suivant →</button>
              ) : (
                <a href="/rendez-vous" className="btn-primary">Prendre rendez-vous</a>
              )}
            </div>
            {hasConfig && (
              <button onClick={reset} className="text-xs text-charbon/40 hover:text-charbon/60 transition-colors flex items-center gap-1">
                <RefreshCw size={12} /> Réinitialiser
              </button>
            )}
          </div>

          <p className="text-xs text-charbon/30 text-center mt-8 flex items-center justify-center gap-1">
            <RefreshCw size={12} /> Vos choix sont sauvegardés automatiquement.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
