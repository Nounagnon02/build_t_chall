import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import ContactForm from '../components/common/ContactForm';
import { CONTACT_INFO } from '../utils/constants';

export default function Contact() {
  return (
    <PageTransition>
      <Helmet><title>Contact &mdash; Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-5xl">
          <SectionTitle title="Contactez-Nous" subtitle="Parlons de votre projet. Reponse sous 24h maximum." />

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <ContactForm variant="flat" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-charbon p-8 rounded-sm text-white">
                <h3 className="font-serif text-xl mb-6">Nos coordonnees</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <MapPin size={18} className="text-champagne mt-1 shrink-0" />
                    <p className="text-sm text-white/80">{CONTACT_INFO.address}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone size={18} className="text-champagne shrink-0" />
                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-sm text-white/80 hover:text-champagne">{CONTACT_INFO.phone}</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail size={18} className="text-champagne shrink-0" />
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-white/80 hover:text-champagne">{CONTACT_INFO.email}</a>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock size={18} className="text-champagne mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-white/80">{CONTACT_INFO.hours}</p>
                      <p className="text-xs text-white/40">Reponse sous 24h</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
