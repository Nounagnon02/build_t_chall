import { motion } from 'framer-motion';
import SectionTitle from '../../common/SectionTitle';

const partners = [
  { name: 'Château de Versailles', tier: 'gold', specialty: 'Lieux de réception' },
  { name: 'Le Meurice', tier: 'gold', specialty: 'Hôtels & Palaces' },
  { name: 'Pierre Gagnaire', tier: 'gold', specialty: 'Traiteurs' },
  { name: 'Maison Blanche', tier: 'silver', specialty: 'Fleuristes' },
  { name: 'Studio Harcourt', tier: 'silver', specialty: 'Photographie' },
  { name: 'Yann Tiersen', tier: 'partner', specialty: 'Musique' },
  { name: 'Olivier Theyskens', tier: 'partner', specialty: 'Robes' },
  { name: 'Cire Trudon', tier: 'partner', specialty: 'Décoration' },
];

export default function PartnersSection() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="section-container mb-12">
        <SectionTitle
          title="Nos Partenaires"
          subtitle="Un réseau de prestataires d'exception sélectionnés pour leur excellence."
        />
      </div>

      {/* Marquee auto-scroll — seamless infinite */}
      <div className="relative">
        <motion.div
          className="flex gap-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ width: 'fit-content' }}
        >
          {[...partners, ...partners].map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="flex-shrink-0 w-48 p-6 rounded-sm border border-perle bg-ivory/50 text-center hover:shadow-card transition-shadow"
            >
              <span className="font-script text-2xl text-champagne block mb-2">
                {p.name.split(' ')[0]}
              </span>
              <p className="font-medium text-sm text-charbon/70">{p.name}</p>
              <p className="text-xs text-charbon/40 mt-1">{p.specialty}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
