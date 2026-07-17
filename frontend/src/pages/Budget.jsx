import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calculator, Users, MapPin, RefreshCw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import { BUDGET_REGIONS, SERVICE_OPTIONS } from '../utils/constants';

const breakdownCategories = [
  { key: 'venue', label: 'Lieu & Traiteur', defaultPct: 30 },
  { key: 'decoration', label: 'Décoration & Fleurs', defaultPct: 15 },
  { key: 'photo', label: 'Photographie & Vidéo', defaultPct: 10 },
  { key: 'dress', label: 'Robe & Costume', defaultPct: 8 },
  { key: 'music', label: 'Musique & Animation', defaultPct: 10 },
  { key: 'beauty', label: 'Beauté & Bien-être', defaultPct: 5 },
  { key: 'stationery', label: 'Alliances & Papeterie', defaultPct: 4 },
  { key: 'transport', label: 'Transport & Hébergement', defaultPct: 5 },
  { key: 'gifts', label: 'Cadeaux invités', defaultPct: 3 },
  { key: 'buffer', label: 'Imprévus & Buffer', defaultPct: 10 },
];

const STORAGE_KEY = 'eae_budget';

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function Budget() {
  const saved = loadSaved();
  const [totalBudget, setTotalBudget] = useState(saved?.totalBudget ?? 8000000);
  const [guestCount, setGuestCount] = useState(saved?.guestCount ?? 100);
  const [region, setRegion] = useState(saved?.region ?? 'cotonou');
  const [serviceType, setServiceType] = useState(saved?.serviceType ?? 'coordination_complete');

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalBudget, guestCount, region, serviceType }));
  }, [totalBudget, guestCount, region, serviceType]);

  const breakdown = breakdownCategories.map((cat) => ({
    ...cat,
    amount: Math.round(totalBudget * (cat.defaultPct / 100)),
  }));

  const regionLabel = BUDGET_REGIONS.find((r) => r.value === region)?.label || 'Bénin';
  const serviceLabel = SERVICE_OPTIONS.find((s) => s.value === serviceType)?.label || '';

  const formatFcfa = (amount) =>
    amount.toLocaleString('fr-FR') + ' FCFA';

  return (
    <PageTransition>
      <Helmet><title>Simulateur de Budget — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-4xl">
          <SectionTitle
            title="Simulateur de Budget"
            subtitle="Estimez votre budget mariage au Bénin et visualisez sa répartition."
          />

          {/* Infos générales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-white p-4 md:p-5 rounded-sm shadow-card">
              <label className="flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-charbon/50 mb-3">
                <Users size={14} /> Nombre d'invités
              </label>
              <input
                type="number"
                min={10}
                max={2000}
                step={10}
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(10, Number(e.target.value)))}
                className="input-elegant w-full text-center text-lg font-serif py-2"
              />
            </div>
            <div className="bg-white p-4 md:p-5 rounded-sm shadow-card">
              <label className="flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-charbon/50 mb-3">
                <MapPin size={14} /> Région
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="input-elegant w-full text-center text-sm py-2"
              >
                {BUDGET_REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="bg-white p-4 md:p-5 rounded-sm shadow-card">
              <label className="flex items-center justify-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-charbon/50 mb-3">
                <Calculator size={14} /> Type de service
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="input-elegant w-full text-center text-sm py-2"
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Slider budget */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-sm shadow-card mb-8">
            <label className="block text-sm text-charbon/60 mb-3">Budget total estimé</label>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <input
                type="range"
                min={500000}
                max={50000000}
                step={500000}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full md:flex-1 accent-champagne"
              />
              <span className="font-serif text-lg sm:text-xl md:text-2xl text-champagne break-words text-left md:text-right md:min-w-[140px]">
                {formatFcfa(totalBudget)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] md:text-xs text-charbon/30 mt-2">
              <span>500 000 FCFA</span>
              <span>50 000 000 FCFA</span>
            </div>
          </div>

          {/* Répartition */}
          <h3 className="font-serif text-base md:text-lg text-charbon mb-4">Répartition estimée</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
            {breakdown.map((item) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 md:p-5 rounded-sm border border-perle"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-xs md:text-sm text-charbon/70">{item.label}</span>
                  <span className="text-xs md:text-sm font-medium text-charbon">{formatFcfa(item.amount)}</span>
                </div>
                <div className="h-2 bg-perle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-champagne rounded-full transition-all duration-500"
                    style={{ width: `${item.defaultPct}%` }}
                  />
                </div>
                <span className="text-[10px] md:text-xs text-charbon/40 mt-1 block">{item.defaultPct}%</span>
              </motion.div>
            ))}
          </div>

          {/* Résumé */}
          <div className="bg-charbon p-4 sm:p-6 md:p-8 rounded-sm text-white text-center">
            <p className="text-xs md:text-sm text-white/60 mb-1">Budget total estimé</p>
            <p className="font-serif text-xl sm:text-2xl md:text-4xl text-champagne mb-2 break-words">{formatFcfa(totalBudget)}</p>
            <p className="text-[10px] md:text-xs text-white/40 leading-relaxed">
              Pour {guestCount} invités · {regionLabel} · {serviceLabel}
            </p>
          </div>

          <p className="text-xs text-charbon/30 text-center mt-6 flex items-center justify-center gap-1">
            <RefreshCw size={12} /> Les données sont sauvegardées automatiquement dans votre navigateur.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
