import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '../../common/Button';
import { staggerContainer, staggerItem } from '../../../utils/animations';

const HERO_IMAGE = '/images/editorial/hero-wedding-coast.webp';

export default function HeroSection() {
  return (
    <section className="relative min-h-[620px] h-[100svh] max-h-[900px] flex items-end overflow-hidden bg-charbon pt-16 sm:min-h-[700px] sm:pt-20">
      <img
        src={HERO_IMAGE}
        alt="Cérémonie de mariage élégante face à l’océan"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[71%_center] sm:object-[68%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charbon/85 via-charbon/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-charbon/70 via-transparent to-charbon/10" />

      <div className="section-container relative z-10 w-full pb-10 min-[380px]:pb-14 sm:pb-24 md:pb-28">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-left"
        >
          <motion.p variants={staggerItem} className="mb-4 text-[9px] font-medium uppercase tracking-[0.24em] text-white/80 sm:mb-5 sm:text-[11px] sm:tracking-[0.34em]">
            Cotonou · Afrique de l’Ouest · Destination weddings
          </motion.p>
          <motion.h1 variants={staggerItem} className="font-display text-[clamp(2.65rem,13vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.035em] text-white">
            Imaginez.
            <span className="block text-champagne-300">Nous orchestrons</span>
            <span className="block">l’exception.</span>
          </motion.h1>
          <motion.p variants={staggerItem} className="mt-4 max-w-xl font-elegant text-base leading-relaxed text-white/85 sm:mt-6 sm:text-xl">
            Des célébrations profondément personnelles, pensées du premier frisson au dernier souvenir.
          </motion.p>
          <motion.div variants={staggerItem} className="mt-6 flex flex-col items-start gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <Button href="/rendez-vous" variant="primary" className="w-full min-w-0 sm:w-auto sm:min-w-[220px]">
              <span className="flex items-center gap-2">Imaginer mon mariage <ArrowRight size={16} /></span>
            </Button>
            <Button href="#experiences" variant="light" className="w-full min-w-0 sm:w-auto sm:min-w-[220px]">Découvrir nos expériences</Button>
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        aria-label="Découvrir la suite"
        onClick={() => document.querySelector('#experiences')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-7 right-7 z-10 hidden items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/70 md:flex"
      >
        Explorer <ChevronDown size={18} />
      </button>
    </section>
  );
}
