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
          title="Notre Histoire"
          subtitle="L'amour du beau, la passion du détail, l'exigence de la perfection."
          variant="asymmetric"
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Image side — spans 7 columns, offset right */}
          <div className="lg:col-span-7 relative group">
            <div className="aspect-[4/5] bg-perle rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 pattern-dots z-10 mix-blend-overlay pointer-events-none" aria-hidden="true" />
              <div className="w-full h-full bg-gradient-to-br from-perle to-champagne/20 flex items-center justify-center">
                <span className="font-script text-4xl text-champagne/50">Ever After</span>
              </div>

              {/* Glass badge overlay on hover */}
              <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <p className="text-xs text-charbon/60 italic">Fondée en 2010</p>
              </div>
            </div>
            {/* Decorative frame overlaps image */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-champagne/30 rounded-sm" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-champagne/20 rounded-sm -z-10" />
          </div>

          {/* Text side — narrower, pushed right */}
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-elegant text-2xl italic text-charbon/60 mb-6 leading-relaxed">
              "Chaque mariage raconte une histoire d'amour unique. Notre mission est de la mettre en scène avec élégance et authenticité."
            </p>

            <div className="space-y-4 text-charbon/70 mb-10">
              <p>
                Fondée par Claire Fontaine, passionnée d'événementiel depuis toujours,
                Ever After Events est née d'une conviction : un mariage n'est pas une simple
                réception, c'est l'un des plus beaux jours de votre vie.
              </p>
              <p>
                Avec une équipe de talents réunissant des experts en organisation,
                décoration, coordination et relations prestataires, nous faisons de
                chaque mariage un moment unique.
              </p>
              <p>
                Notre approche ? Une écoute attentive, une créativité sans limite,
                et une exigence de perfection à chaque étape.
              </p>
            </div>

            {/* Values */}
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

            {/* Stats */}
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
