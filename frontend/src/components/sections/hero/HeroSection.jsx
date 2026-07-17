import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Star, Shield, Heart } from 'lucide-react';
import Button from '../../common/Button';
import { staggerContainer, staggerItem } from '../../../utils/animations';
import useAnimatedCounter from '../../../hooks/useAnimatedCounter';

const HERO_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85";
const HERO_IMAGE_MOBILE = "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75";

export default function HeroSection() {
  const { ref: counterRef, count: weddingCount } = useAnimatedCounter(420, 2500);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll-linked parallax
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <motion.section
      style={{ opacity: heroOpacity }}
      className="relative min-h-[640px] sm:min-h-[700px] h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Cinema image stack */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blur atmosphere layer */}
        <img
          src={isMobile ? HERO_IMAGE_MOBILE : HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm brightness-[0.35] transition-opacity duration-1000"
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {/* Sharp focal layer */}
        <img
          src={isMobile ? HERO_IMAGE_MOBILE : HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55] transition-opacity duration-1000"
          style={{
            opacity: imageLoaded ? 1 : 0,
            clipPath: 'inset(8%)',
          }}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Cinematic vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(15,42,63,0.7) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Animated particles overlay */}
      <ParticlesCanvas />

      {/* Sculptural background text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        aria-hidden="true"
      >
        <span className="text-outline-white text-[clamp(6rem,20vw,20rem)] font-display font-black leading-none tracking-[-0.04em] opacity-10">
          EVER AFTER
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ scale: heroScale, y: heroY }}
        className="relative z-10 section-container text-center px-4 sm:px-6"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Main heading — sculptural Roslindale DisplayUltra */}
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-[clamp(2.35rem,7vw,8rem)] sm:text-[clamp(3rem,8vw,8rem)] leading-[0.9] text-white tracking-[-0.02em]"
          >
            <span className="block">Chaque mariage</span>
            <span className="block">est une</span>
            <span className="gold-text block">œuvre d'art</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={staggerItem}
            className="font-elegant text-base sm:text-lg md:text-xl text-white/70 italic max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            Ever After Events — L'agence qui transforme vos rêves en réalité
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button href="/rendez-vous" variant="primary" className="w-full sm:min-w-[220px] max-w-[280px] shadow-lg shadow-champagne/20">
              <span className="flex items-center gap-2">
                Demander un devis <ArrowRight size={16} />
              </span>
            </Button>
            <Button href="/galerie" variant="light" className="w-full sm:min-w-[220px] max-w-[280px]">
              Voir nos réalisations
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={staggerItem}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10 sm:mt-14"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-champagne" />
              <span className="text-white/50 text-xs tracking-wide">Totalement personnalisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-champagne" />
              <span className="text-white/50 text-xs tracking-wide">+{weddingCount} couples accompagnés</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-champagne" />
              <span className="text-white/50 text-xs tracking-wide">Note moyenne 4.9/5</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ChevronDown className="text-white/40 w-6 h-6 hover:text-champagne transition-colors" />
      </motion.div>
    </motion.section>
  );
}

// Enhanced canvas particles with 3 types and connections
function ParticlesCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    // Create particles — 3 types for richness
    const PARTICLE_COUNT = 80;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const type = i < 40 ? 'dot' : i < 65 ? 'ring' : 'sparkle';
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === 'dot' ? Math.random() * 1.5 + 0.5
             : type === 'ring' ? Math.random() * 3 + 2
             : Math.random() * 2 + 1.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1,
        type,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p, idx) => {
        // Movement
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse attraction (within 200px)
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * 0.02;
          p.x += dx * force;
          p.y += dy * force;
        }

        // Draw based on type
        ctx.beginPath();
        if (p.type === 'dot') {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 168, 67, ${p.opacity})`;
          ctx.fill();
        } else if (p.type === 'ring') {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(228, 190, 106, ${p.opacity * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else if (p.type === 'sparkle') {
          // Diamond shape
          const s = p.size;
          ctx.moveTo(p.x, p.y - s);
          ctx.lineTo(p.x + s * 0.5, p.y);
          ctx.lineTo(p.x, p.y + s);
          ctx.lineTo(p.x - s * 0.5, p.y);
          ctx.closePath();
          ctx.fillStyle = `rgba(212, 168, 67, ${p.opacity * 0.7})`;
          ctx.fill();
        }

        // Connection lines between nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const other = particles[j];
          const cdx = p.x - other.x;
          const cdy = p.y - other.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(212, 168, 67, ${0.06 * (1 - cdist / 120)})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
