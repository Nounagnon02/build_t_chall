import { useEffect, useRef, useState } from 'react';

export default function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!options.triggerOnce === false) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce) {
          setInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.triggerOnce]);

  return { ref, inView };
}
