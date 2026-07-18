import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useParallaxHover from '../../hooks/useParallaxHover';

export default function ServiceCard({ service }) {
  const IconComponent = service.icon;
  const { ref, handleMouseMove, handleMouseLeave } = useParallaxHover(0.08);

  return (
    <Link to={`/services/${service.slug}`} className="block group">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -4 }}
        className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all h-full flex flex-col border border-perle/50"
      >
        <div data-depth="2" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-champagne/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-champagne/20 transition-colors">
          {IconComponent ? (
            <IconComponent size={18} className="sm:w-[22px] sm:h-[22px] text-champagne" />
          ) : (
            <span className="text-champagne text-lg sm:text-xl font-serif">✦</span>
          )}
        </div>
        <h3 data-depth="1" className="font-serif text-base sm:text-lg text-charbon mb-2 sm:mb-3 group-hover:text-champagne transition-colors">
          {service.title}
        </h3>
        <p data-depth="0.5" className="text-sm text-charbon/55 leading-relaxed flex-1">
          {service.subtitle || service.description}
        </p>
        {(service.price_from || service.price) && (
          <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-perle/70">
            <span className="font-serif text-sm sm:text-base text-champagne font-bold leading-tight">
              {service.price_from ? `À partir de ${Number(service.price_from).toLocaleString('fr-FR')} FCFA` : service.price}
            </span>
            <ArrowRight size={15} className="text-charbon/20 group-hover:text-champagne group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        )}
      </motion.div>
    </Link>
  );
}
