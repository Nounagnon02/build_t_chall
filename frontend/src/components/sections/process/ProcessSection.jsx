import { motion } from 'framer-motion';
import { Compass, Crown, Gem, Sparkles, ShieldCheck } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { fadeInUp } from '../../../utils/animations';

const steps = [
  { icon: Compass, title: 'Écoute & stratégie', subtitle: 'Une vision claire dès le départ', desc: 'Nous définissons le ton, le budget et les priorités pour que chaque détail soit pensé avec cohérence.' },
  { icon: Crown, title: 'Design & expérience', subtitle: 'Un univers raffiné', desc: 'Moodboards, ambiance, mobilier, verrerie et mise en scène : tout est pensé pour créer un impact instantané.' },
  { icon: Gem, title: 'Prestataires & logistique', subtitle: 'Une coordination sans friction', desc: 'Nous sélectionnons les meilleurs partenaires et pilotons chaque étape comme un événement de prestige.' },
  { icon: ShieldCheck, title: 'Jour J & direction', subtitle: 'Une présence discrète et efficace', desc: 'Nous coordonnons l’ensemble du programme, des invités aux dernières minutes, avec élégance.' },
  { icon: Sparkles, title: 'Souvenirs mémorables', subtitle: 'Une expérience qui reste', desc: 'Des moments filmés, une ambiance maîtrisée et une fin de journée qui reste gravée dans la mémoire.' },
];

export default function ProcessSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <SectionTitle
          title="Comment nous créons l’exception"
          subtitle="Une orchestration raffinée, du premier échange au dernier souvenir."
          variant="display"
        />

        <div ref={ref} className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeInUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: i * 0.12 }}
              className="rounded-sm border border-perle/70 bg-ivory p-6 shadow-card"
            >
              <div className="w-12 h-12 rounded-full bg-champagne/10 flex items-center justify-center mb-4">
                <step.icon size={20} className="text-champagne" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne mb-2">Étape {i + 1}</p>
              <h3 className="font-serif text-lg text-charbon mb-2">{step.title}</h3>
              <p className="text-xs uppercase tracking-[0.25em] text-charbon/55 mb-3">{step.subtitle}</p>
              <p className="text-sm leading-relaxed text-charbon/65">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
