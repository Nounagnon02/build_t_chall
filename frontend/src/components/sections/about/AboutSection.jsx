import { motion } from 'framer-motion';
import { Sparkles, Shield, Heart } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import useAnimatedCounter from '../../../hooks/useAnimatedCounter';
import { fadeInLeft, fadeInRight } from '../../../utils/animations';

const values = [
  { icon: Sparkles, title: 'Élégance', desc: 'Chaque détail compte pour créer un événement d\'exception.' },
  { icon: Shield, title: 'Perfection', desc: 'Une rigueur absolue dans l\'organisation pour un résultat sans faille.' },
  { icon: Heart, title: 'Émotion', desc: 'Des moments authentiques qui resteront gravés à jamais.' },
];

export default function AboutSection() {
  const { ref: sectionRef, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const { ref: expRef, count: expCount } = useAnimatedCounter(15, 2000, '', '+ ans');
  const { ref: mariageRef, count: mariageCount } = useAnimatedCounter(400, 2500, '', '+');
  const { ref: satisRef, count: satisCount } = useAnimatedCounter(99, 2000, '', '%');

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="section-padding bg-white"
    >
      <div className="section-container">
        <SectionTitle
          title="Pourquoi nous faisons la différence"
          subtitle="Parce que chaque mariage mérite une mise en scène élégante, fluide et parfaitement pensée."
          variant="display"
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 relative group">
            <div className="aspect-[4/5] rounded-sm overflow-hidden relative shadow-card">
              <img
                src="/images/photo-1519225421980-715cb0215aed.jpg"
                alt="Décoration élégante d'un mariage premium"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charbon/70 via-charbon/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-sm border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-champagne">Luxe à chaque détail</p>
                <p className="text-sm text-white/90 mt-1">Des espaces raffinés, des prestations pensées jusqu'au moindre détail.</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-champagne/30 rounded-sm" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-champagne/20 rounded-sm -z-10" />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-elegant text-2xl italic text-charbon/60 mb-6 leading-relaxed">
              "Chaque mariage raconte une histoire unique. Nous la mettons en scène avec élégance, maîtrise et émotion."
            </p>

            <div className="space-y-4 text-charbon/70 mb-10">
              <p>
                Fondée sur une conviction forte : un mariage n'est pas seulement un événement, c'est une expérience à vivre avec fluidité, beauté et assurance.
              </p>
              <p>
                Notre équipe réunit créativité, organisation fine et réseau de prestataires premium pour créer un jour qui ressemble à votre histoire.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {values.map((v) => (
                <div key={v.title} className="text-center group cursor-default">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-champagne/10 flex items-center justify-center group-hover:bg-champagne/20 transition-colors">
                    <v.icon size={20} className="text-champagne" />
                  </div>
                  <h4 className="text-xs uppercase tracking-widest font-medium text-charbon">{v.title}</h4>
                  <p className="text-xs text-charbon/50 mt-1 hidden md:block">{v.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 border-t border-perle pt-8">
              <div className="text-center">
                <span ref={expRef} className="block font-serif text-3xl gold-text font-bold">{expCount}</span>
                <span className="text-xs text-charbon/50 uppercase tracking-wider">d'expérience</span>
              </div>
              <div className="text-center">
                <span ref={mariageRef} className="block font-serif text-3xl gold-text font-bold">{mariageCount}</span>
                <span className="text-xs text-charbon/50 uppercase tracking-wider">mariages</span>
              </div>
              <div className="text-center">
                <span ref={satisRef} className="block font-serif text-3xl gold-text font-bold">{satisCount}</span>
                <span className="text-xs text-charbon/50 uppercase tracking-wider">satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
