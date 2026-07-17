import { useRef, useCallback } from 'react';

export default function useMagneticEffect(strength = 0.3) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * strength;
    const y = (e.clientY - top - height / 2) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
    ref.current.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = '';
    }, 300);
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
