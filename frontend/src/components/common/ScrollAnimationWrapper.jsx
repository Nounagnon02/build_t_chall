import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ScrollAnimationWrapper({ children, className = '' }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [40, 0, 0, -40]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}
