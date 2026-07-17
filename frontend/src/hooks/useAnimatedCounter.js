import { useEffect, useState, useRef } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

export default function useAnimatedCounter(target, duration = 2000, prefix = '', suffix = '') {
  const [count, setCount] = useState(0);
  const { ref, inView } = useIntersectionObserver({ threshold: 0.3, triggerOnce: true });
  const frameRef = useRef();

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [inView, target, duration]);

  return { ref, count: `${prefix}${count.toLocaleString()}${suffix}` };
}
