import { motion } from 'framer-motion';

const dividers = {
  curveUp: {
    viewBox: '0 0 600 100',
    d: 'M0,40 C120,100 200,0 300,40 C400,80 500,0 600,40 L600,0 L0,0 Z',
  },
  curveDown: {
    viewBox: '0 0 600 100',
    d: 'M0,60 C120,0 200,100 300,60 C400,20 500,100 600,60 L600,0 L0,0 Z',
  },
  wave: {
    viewBox: '0 0 600 80',
    d: 'M0,40 Q75,80 150,40 Q225,0 300,40 Q375,80 450,40 Q525,0 600,40 L600,0 L0,0 Z',
  },
  angle: {
    viewBox: '0 0 600 100',
    d: 'M0,100 L300,0 L600,100 L600,0 L0,0 Z',
  },
  stepped: {
    viewBox: '0 0 600 60',
    d: 'M0,60 L150,60 L150,30 L300,30 L300,0 L600,0 L600,60 L0,60 Z',
  },
};

export default function SectionDivider({ variant = 'curveUp', color = 'fill-ivory', className = '' }) {
  const config = dividers[variant] || dividers.curveUp;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.8 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      className={`relative w-full h-16 md:h-24 -mb-1 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={config.viewBox}
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={config.d} className={color} />
      </svg>
    </motion.div>
  );
}
