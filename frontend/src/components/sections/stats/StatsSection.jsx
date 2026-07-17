import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Users, MapPin } from 'lucide-react';
import useAnimatedCounter from '../../../hooks/useAnimatedCounter';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { staggerContainer, staggerItem } from '../../../utils/animations';

const statDecorations = [
  { icon: Heart, color: 'text-rose-400/60' },
  { icon: Star, color: 'text-champagne/60' },
  { icon: Sparkles, color: 'text-blue-300/60' },
  { icon: Users, color: 'text-sauge/60' },
  { icon: MapPin, color: 'text-champagne/60' },
];

const stats = [
  { label: 'Mariages organisés', target: 400, suffix: '+' },
  { label: 'Années d\'expertise', target: 15, suffix: '+', prefix: '' },
  { label: 'Clients satisfaits', target: 98, suffix: '%' },
  { label: 'Prestataires partenaires', target: 35, suffix: '+' },
  { label: 'Régions couvertes', target: 12, suffix: '' },
];

function StatItem({ target, label, suffix, prefix = '', icon: Icon, iconColor }) {
  const { ref, count } = useAnimatedCounter(target, 2500, prefix, suffix);

  return (
    <motion.div variants={staggerItem} className="text-center">
      {Icon && (
        <Icon size={24} className={`${iconColor} mb-2 mx-auto`} />
      )}
      <span
        ref={ref}
        className="block font-display font-black text-4xl md:text-5xl gold-text mb-2"
      >
        {count}
      </span>
      <span className="text-xs md:text-sm text-white/60 uppercase tracking-wider font-medium">
        {label}
      </span>
    </motion.div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="py-20 bg-charbon relative overflow-hidden">
      {/* Texture layer 1: diagonal champagne lines */}
      <div className="absolute inset-0 pattern-diagonal opacity-30" aria-hidden="true" />

      {/* Texture layer 2: subtle gradient sweep */}
      <div className="absolute inset-0 bg-gradient-radial from-champagne/[0.03] via-transparent to-transparent" aria-hidden="true" />

      {/* Texture layer 3: horizontal light sweep animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-champagne/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12"
        >
          {stats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} icon={statDecorations[i].icon} iconColor={statDecorations[i].color} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
