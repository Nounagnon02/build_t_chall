import { useRef, useCallback } from 'react';

export default function useParallaxHover(intensity = 0.05) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const children = ref.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const depth = parseFloat(child.dataset?.depth || '1');
      child.style.transform = `translate(${x * 20 * depth}px, ${y * 20 * depth}px)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    Array.from(ref.current.children).forEach((child) => {
      child.style.transform = '';
    });
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
