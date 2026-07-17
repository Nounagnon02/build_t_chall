import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options.offset || ['start 0.85', 'start 0.3'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return { ref, style: { opacity, y, scale } };
}
