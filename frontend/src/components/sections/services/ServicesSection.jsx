import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Settings, Palette, Building2, Star } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import ServiceCard from '../../common/ServiceCard';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { staggerContainer, staggerItem } from '../../../utils/animations';

const services = [
  {
    title: 'Coordination Complète',
    subtitle: 'Prise en charge totale de A à Z',
    price: 'À partir de 8 990€',
    icon: Star,
    slug: 'coordination-complete',
    color: 'from-champagne/20 to-champagne/5',
  },
  {
    title: 'Organisation Partielle',
    subtitle: 'Accompagnement ciblé',
    price: 'À partir de 4 990€',
    icon: Settings,
    slug: 'organisation-partielle',
    color: 'from-blush/20 to-blush/5',
  },
  {
    title: 'Décoration & Ambiance',
    subtitle: 'Direction artistique complète',
    price: 'À partir de 3 990€',
    icon: Palette,
    slug: 'decoration',
    color: 'from-sauge/20 to-sauge/5',
  },
  {
    title: 'Événements Entreprise',
    subtitle: 'Séminaires, galas, team-buildings',
    price: 'À partir de 5 990€',
    icon: Building2,
    slug: 'evenements-entreprise',
    color: 'from-charbon/10 to-charbon/5',
  },
  {
    title: 'Sur-Mesure',
    subtitle: 'Offre entièrement personnalisée',
    price: 'Devis personnalisé',
    icon: Sparkles,
    slug: 'sur-mesure',
    color: 'from-champagne/30 to-champagne/10',
  },
];

export default function ServicesSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="services" className="section-padding bg-ivory">
      <div className="section-container">
        <SectionTitle
          title="Nos Services"
          subtitle="Des formules adaptées à chaque projet, de l'accompagnement global à la prestation ciblée."
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
              className={
                index === 0 ? 'md:col-span-2 lg:col-span-2' :
                index === 4 ? 'md:row-span-2 lg:row-span-2 flex flex-col justify-center bg-champagne/5 border border-champagne/20 rounded-sm' :
                ''
              }
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

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/simulateur-budget"
            className="btn-primary inline-flex items-center gap-2"
          >
            Estimer mon budget <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
