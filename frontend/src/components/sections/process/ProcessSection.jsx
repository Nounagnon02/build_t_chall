import { motion } from 'framer-motion';
import { CalendarCheck, MessageCircle, PenTool, Radio, Sparkles } from 'lucide-react';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { fadeInUp } from '../../../utils/animations';

const steps = [
  [MessageCircle, 'La rencontre', 'Nous écoutons votre histoire, vos envies, votre budget et ce que vous refusez de sacrifier.'],
  [PenTool, 'La direction créative', 'Nous dessinons l’univers : lieu, palette, matières, fleurs, lumière, table et expérience invités.'],
  [CalendarCheck, 'La production', 'Nous sélectionnons les maisons et talents, négocions, planifions et contrôlons chaque détail.'],
  [Radio, 'L’orchestration', 'Le jour J, notre équipe en uniforme dirige prestataires, timing, invités et imprévus en toute discrétion.'],
  [Sparkles, 'Le souvenir', 'Vous vivez pleinement. La photographie, le film et l’album prolongent ce qui ne se vit qu’une fois.'],
];

export default function ProcessSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="mb-14 max-w-3xl">
          <p className="eyebrow">Notre manière de faire</p>
          <h2 className="editorial-title">Vous rêvez. Nous tenons chaque fil.</h2>
        </div>
        <div ref={ref} className="relative">
          <div className="absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-perle lg:block" aria-hidden="true" />
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {steps.map(([Icon, title, text], index) => (
              <motion.article key={title} variants={fadeInUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} transition={{ delay: index * 0.1 }} className="relative">
                <div className="relative z-10 mb-7 flex h-10 w-10 items-center justify-center rounded-full border border-champagne bg-white text-champagne">
                  <Icon size={17} strokeWidth={1.4} />
                </div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-charbon/35">Étape 0{index + 1}</span>
                <h3 className="mt-2 font-display text-2xl text-charbon">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charbon/60">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
