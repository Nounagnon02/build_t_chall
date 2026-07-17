import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

export default function SectionTitle({ title, subtitle, gold = false, centered = true, variant = 'default', scriptPrefix }) {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

  if (variant === 'display') {
    return (
      <motion.div
        ref={ref}
        variants={fadeInUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className={`mb-8 sm:mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}
      >
        <h2 className={`font-display text-[2rem] sm:text-[2.5rem] md:text-display-lg gold-text-gradient mb-3 sm:mb-4 ${centered ? 'text-center' : ''}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="section-subtitle max-w-2xl mx-auto">{subtitle}</p>
        )}
      </motion.div>
    );
  }

  if (variant === 'script') {
    return (
      <motion.div
        ref={ref}
        variants={fadeInUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}
      >
        {scriptPrefix && (
          <span className="font-script text-4xl text-champagne block mb-2">{scriptPrefix}</span>
        )}
        <h2 className={`section-title ${gold ? 'gold-text' : ''} ${centered ? 'text-center' : ''}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="section-subtitle max-w-2xl mx-auto">{subtitle}</p>
        )}
        <div className="w-12 sm:w-16 h-0.5 bg-champagne mt-4 sm:mt-6 mx-auto" />
      </motion.div>
    );
  }

  if (variant === 'asymmetric') {
    return (
      <motion.div
        ref={ref}
        variants={fadeInUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mb-8 sm:mb-12 md:mb-16"
      >
        <div className="grid md:grid-cols-2 gap-8 items-end">
          <div>
            <h2 className="section-title">{title}</h2>
          </div>
          <div>
            {subtitle && (
              <p className="font-elegant text-lg text-charbon/60 italic">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="w-12 sm:w-16 h-0.5 bg-champagne mt-4 sm:mt-6" />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}
    >
      <h2 className={`section-title ${gold ? 'gold-text' : ''} ${centered ? 'text-center' : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`section-subtitle ${centered ? 'text-center' : ''} max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      <div className={`w-12 sm:w-16 h-0.5 bg-champagne mt-4 sm:mt-6 ${centered ? 'mx-auto' : ''}`} />
    </motion.div>
  );
}
