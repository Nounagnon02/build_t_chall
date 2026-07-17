import { motion } from 'framer-motion';
import { MessageCircle, Palette, Calendar, Heart, Sparkles } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { fadeInUp } from '../../../utils/animations';

const steps = [
  { icon: MessageCircle, title: 'Découverte', subtitle: 'Premier rendez-vous', desc: 'Nous écoutons votre histoire, vos envies et vos besoins pour comprendre votre vision.' },
  { icon: Palette, title: 'Conception', subtitle: 'Proposition sur-mesure', desc: 'Nous élaborons une proposition détaillée avec moodboard, budget et planning.' },
  { icon: Calendar, title: 'Coordination', subtitle: 'Gestion complète', desc: 'Nous coordonnons l\'ensemble des prestataires et suivons chaque détail.' },
  { icon: Heart, title: 'Le Grand Jour', subtitle: 'Présence totale', desc: 'Nous assurons la direction artistique et la coordination en temps réel.' },
  { icon: Sparkles, title: 'Après', subtitle: 'Souvenirs éternels', desc: 'Album photo, rapport détaillé et retour d\'expérience personnalisé.' },
];

export default function ProcessSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <SectionTitle
          title="Notre Méthode"
          subtitle="Un processus en 5 étapes pour un mariage parfaitement orchestré."
          variant="script"
          scriptPrefix="Le processus"
        />

        {/* Zigzag vertical timeline */}
        <div ref={ref} className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-perle hidden md:block" aria-hidden="true" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeInUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: i * 0.15 }}
              className={`relative flex items-start gap-8 mb-16 md:mb-24
                ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Card side */}
              <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                <h3 className="font-serif text-lg text-charbon mb-1">{step.title}</h3>
                <p className="text-xs uppercase tracking-widest text-champagne font-medium mb-3">{step.subtitle}</p>
                <p className="text-sm text-charbon/60 leading-relaxed">{step.desc}</p>
              </div>

              {/* Center dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-ivory border-2 border-champagne items-center justify-center z-10">
                <step.icon size={18} className="text-champagne" />
              </div>

              {/* Spacer on other side */}
              <div className="flex-1 hidden md:block" />

              {/* Mobile connector line */}
              {i < steps.length - 1 && (
                <div className="md:hidden absolute left-5 top-14 bottom-0 w-px bg-perle" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
