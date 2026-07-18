import { motion } from 'framer-motion';
import { Heart, Star, Users } from 'lucide-react';
import useAnimatedCounter from '../../../hooks/useAnimatedCounter';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { staggerContainer, staggerItem } from '../../../utils/animations';

const stats = [
  { label: 'Célébrations orchestrées', target: 156, suffix: '+', icon: Heart },
  { label: 'Années de savoir-faire', target: 15, suffix: '+', icon: Star },
  { label: 'Clients satisfaits', target: 98, suffix: '%', icon: Users },
];

function StatItem({ target, label, suffix, icon: Icon }) {
  const { ref, count } = useAnimatedCounter(target, 2200, '', suffix);
  return (
    <motion.div variants={staggerItem} className="text-center">
      <Icon size={21} strokeWidth={1.25} className="mx-auto mb-5 text-champagne" />
      <span ref={ref} className="block font-display text-5xl text-white sm:text-6xl">{count}</span>
      <span className="mt-3 block text-[10px] font-medium uppercase tracking-[0.25em] text-white/55">{label}</span>
    </motion.div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  return (
    <section className="relative flex min-h-[540px] items-center overflow-hidden bg-charbon py-24">
      <div className="absolute inset-0 pattern-diagonal opacity-20" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-champagne/[0.06] blur-3xl" aria-hidden="true" />
      <div className="section-container relative z-10 w-full">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-champagne">La confiance, en quelques chiffres</p>
          <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">L’exigence se mesure aussi dans la durée.</h2>
        </div>
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="grid grid-cols-1 gap-14 sm:grid-cols-3 md:gap-16">
          {stats.map((stat) => <StatItem key={stat.label} {...stat} />)}
        </motion.div>
      </div>
    </section>
  );
}
