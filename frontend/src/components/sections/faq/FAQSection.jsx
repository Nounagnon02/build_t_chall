import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import Button from '../../common/Button';

const faqs = [
  { q: 'Combien coûte un wedding planner en moyenne ?', a: 'Le tarif varie selon le type de prestation. Pour une coordination complète, comptez entre 8 000€ et 15 000€. Nous proposons également des prestations partielles à partir de 4 000€.' },
  { q: 'Quand faut-il réserver son wedding planner ?', a: 'Idéalement 12 à 18 mois avant la date prévue. Pour les projets plus urgents, nous pouvons intervenir dans un délai de 3 mois.' },
  { q: 'Comment se déroule le premier rendez-vous ?', a: 'Le premier rendez-vous est gratuit et sans engagement. Nous écoutons votre projet, discutons de vos envies et de votre budget, et vous présentons notre méthode de travail.' },
  { q: 'Travaillez-vous avec des prestataires spécifiques ?', a: 'Nous avons un réseau de 35+ prestataires partenaires sélectionnés pour leur excellence. Nous pouvons aussi travailler avec vos prestataires si vous le souhaitez.' },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section-padding bg-white">
      <div className="section-container max-w-3xl">
        <SectionTitle
          title="Questions Fréquentes"
          subtitle="Tout ce que vous devez savoir avant de nous confier votre projet."
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-perle rounded-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-ivory/50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-sm text-charbon pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-champagne shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-charbon/60 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-charbon/50 mb-4">Vous avez une autre question ?</p>
          <Button href="/faq" variant="secondary">
            Voir toutes les FAQ
          </Button>
        </div>
      </div>
    </section>
  );
}
