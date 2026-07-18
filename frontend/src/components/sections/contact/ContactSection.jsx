import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import ContactForm from '../../common/ContactForm';
import { CONTACT_INFO } from '../../../utils/constants';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { fadeInLeft, fadeInRight } from '../../../utils/animations';

export default function ContactSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [step, setStep] = useState(1);

  return (
    <section id="contact" className="section-padding bg-ivory">
      <div className="section-container">
        <SectionTitle
          title="Contactez-Nous"
          subtitle="Parlons de votre projet. Reponse sous 24h maximum."
        />

        <div ref={ref} className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-3"
          >
            <ContactForm variant="wizard" step={step} onStepChange={setStep} />
          </motion.div>

          {/* Info sidebar */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-dark p-8 rounded-sm">
              <h3 className="font-serif text-xl mb-6 text-white">Nos coordonnees</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-champagne mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-white/80">{CONTACT_INFO.address}</p>
                    <p className="text-xs text-white/40">Cotonou, Bénin</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={18} className="text-champagne shrink-0" />
                  <a href={`tel:${CONTACT_INFO.phone}`} className="text-sm text-white/80 hover:text-champagne transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={18} className="text-champagne shrink-0" />
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-white/80 hover:text-champagne transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-champagne mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-white/80">{CONTACT_INFO.hours}</p>
                    <p className="text-xs text-white/40">Nous repondons en moins de 24h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial widget */}
            <div className="bg-white p-6 rounded-sm border border-perle">
              <p className="font-elegant text-lg italic text-charbon/70 leading-relaxed">
                &ldquo;L&apos;equipe a ete d&apos;un professionnalisme exceptionnel. Notre mariage a depasse toutes nos attentes.&rdquo;
              </p>
              <p className="text-xs text-charbon/40 mt-4">&mdash; Sophie &amp; Thomas, mariage Juin 2026</p>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3">
              <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Bonjour Ever After Events, je souhaite parler de mon projet de mariage.')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] py-3 text-center text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#1fb95a]">
                <MessageCircle size={17} fill="currentColor" /> WhatsApp
              </a>
              <a href="/simulateur-budget"
                className="flex-1 text-center py-3 bg-champagne text-white text-xs uppercase tracking-wider font-medium hover:bg-champagne-500 transition-colors">
                Estimer mon budget
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
