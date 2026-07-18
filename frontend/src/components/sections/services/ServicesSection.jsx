import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Settings, Palette, Building2, Star } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import ServiceCard from '../../common/ServiceCard';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { staggerContainer } from '../../../utils/animations';

const services = [
  {
    title: 'Direction de mariage de luxe',
    subtitle: 'Nous orchestrons chaque moment avec raffinement, fluidité et précision.',
    price: 'À partir de 5 900 000 FCFA',
    icon: Star,
    slug: 'coordination-complete',
  },
  {
    title: 'Invitation digitale & expérience VIP',
    subtitle: 'Des liens chic, élégants et personnalisés pour chaque invité.',
    price: 'À partir de 1 200 000 FCFA',
    icon: Sparkles,
    slug: 'invitation-digitale',
  },
  {
    title: 'Décoration, mobilier & ambiance',
    subtitle: 'Verrerie, chariots, luminaires, fleurs et mise en scène de prestige.',
    price: 'À partir de 1 900 000 FCFA',
    icon: Palette,
    slug: 'decoration',
  },
  {
    title: 'Cérémonie, image & captation',
    subtitle: 'Drone, lumière, musique et mise en valeur de chaque instant marquant.',
    price: 'À partir de 3 500 000 FCFA',
    icon: Building2,
    slug: 'ceremonie-image',
  },
  {
    title: 'Accompagnement sur mesure',
    subtitle: 'Une offre entièrement pensée autour de votre vision, de votre lieu et de votre budget.',
    price: 'Devis personnalisé',
    icon: Settings,
    slug: 'sur-mesure',
  },
];

const luxuryHighlights = [
  'Mobilier de prestige, verrerie et assiettes raffinées',
  'Aménagement d’espaces avec chariots, détails de scène et lumière',
  'Fleurs, décoration et ambiance sur mesure',
  'Mise en valeur de la cérémonie avec drone, sonorisation et image',
  'Invitation digitale élégante et expérience VIP pour chaque invité',
];

export default function ServicesSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="services" className="section-padding bg-ivory">
      <div className="section-container">
        <SectionTitle
          title="Nos services, pensée luxe"
          subtitle="Des prestations premium qui donnent de la valeur à chaque moment, de l'organisation à la mise en scène."
          variant="display"
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <div
              key={service.slug}
              className={index === 0 ? 'md:col-span-2 lg:col-span-2' : index === 4 ? 'md:row-span-2 lg:row-span-2 flex flex-col justify-center bg-champagne/5 border border-champagne/20 rounded-sm' : ''}
            >
              {index === 4 ? (
                <div className="p-8 h-full flex flex-col justify-center">
                  <ServiceCard service={service} />
                </div>
              ) : (
                <ServiceCard service={service} />
              )}
            </div>
          ))}
        </motion.div>

        <div className="mt-12 rounded-sm border border-perle/70 bg-white p-6 md:p-8 shadow-card">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-champagne mb-3">Ce que nous pouvons créer</p>
              <h3 className="font-serif text-2xl text-charbon mb-4">Une expérience de luxe, du décor à l’image de votre cérémonie</h3>
              <p className="text-sm leading-relaxed text-charbon/70">
                Nous ne nous contentons pas d’organiser : nous sculptons une ambiance, mettons en valeur chaque instant et proposons des détails qui font toute la différence.
              </p>
            </div>
            <div className="rounded-sm bg-ivory border border-perle/60 p-5">
              <ul className="space-y-3 text-sm text-charbon/70">
                {luxuryHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-champagne shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/simulateur-budget" className="btn-primary inline-flex items-center gap-2">
            Obtenir un devis personnalisé <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
