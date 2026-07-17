import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Disable on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-[100] w-[400px] h-[400px] rounded-full opacity-[0.04] bg-champagne blur-[120px]"
      style={{ left: pos.x - 200, top: pos.y - 200 }}
      aria-hidden="true"
    />
  );
}
