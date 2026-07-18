import { motion } from 'framer-motion';
import SectionTitle from '../../common/SectionTitle';

const partners = [
  { name: 'Champagne Ruinart', specialty: 'Maison de champagne prestige' },
  { name: 'Domaine Carneros', specialty: 'Vins & dégustations raffinées' },
  { name: 'Maison Goutard', specialty: 'Fleurs & décoration haut de gamme' },
  { name: 'Hôtel du Cap-Eden-Roc', specialty: 'Lieux de réception exceptionnels' },
  { name: 'Rolls-Royce Paris', specialty: 'Mobilité luxe & transfert VIP' },
  { name: 'Maison Margiela', specialty: 'Création d’ambiance & style' },
  { name: 'Chef Éric Frechon', specialty: 'Culinary experiences premium' },
  { name: 'Studio 54', specialty: 'Photographie & direction artistique' },
];

export default function PartnersSection() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="section-container mb-10">
        <SectionTitle
          title="Des partenaires qui donnent envie"
          subtitle="Nous travaillons avec des références de prestige pour créer des expériences mémorables."
          variant="display"
        />
      </div>

      <div className="relative min-h-[280px]">
        <motion.div
          className="flex gap-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ width: 'fit-content' }}
        >
          {[...partners, ...partners].map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex-shrink-0 w-56 h-44 rounded-sm border border-perle/70 bg-ivory p-6 flex flex-col justify-between shadow-card">
              <div>
                <p className="font-script text-2xl text-champagne">{p.name.split(' ')[0]}</p>
                <p className="font-medium text-sm text-charbon/80 mt-2">{p.name}</p>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-charbon/45">{p.specialty}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
