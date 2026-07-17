import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { fadeInUp, staggerContainer } from '../../../utils/animations';

const testimonials = [
  {
    id: 1,
    names: 'Sophie & Thomas',
    date: 'Juin 2026',
    venue: 'Château de Vaux-le-Vicomte',
    rating: 5,
    content: 'Ever After Events a transformé notre mariage en un conte de fées. Chaque détail était parfait, chaque moment magique. Claire et son équipe ont été extraordinaires du début à la fin.',
    image: 'https://images.unsplash.com/photo-1583939423570-9b7f2b0c2a0f?w=100&q=80',
  },
  {
    id: 2,
    names: 'Amina & Karim',
    date: 'Mai 2026',
    venue: 'Domaine de la Reine',
    rating: 5,
    content: 'Notre mariage franco-marocain était un défi logistique. L\'équipe a su mêler nos deux cultures avec une élégance et un professionnalisme incroyables. Un grand merci !',
    image: 'https://images.unsplash.com/photo-1589156280159-27698b4d9f4e?w=100&q=80',
  },
  {
    id: 3,
    names: 'Marie & Alexandre',
    date: 'Avril 2026',
    venue: 'Château de Chambord',
    rating: 5,
    content: 'Une organisation irréprochable. Du premier rendez-vous au jour J, tout a été parfaitement orchestré. Nos invités en parlent encore ! Nous recommandons les yeux fermés.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
  },
  {
    id: 4,
    names: 'Camille & Julien',
    date: 'Mars 2026',
    venue: 'Bastide en Provence',
    rating: 5,
    content: 'Le stress du mariage a complètement disparu grâce à leur accompagnement. L\'équipe est professionnelle, bienveillante et incroyablement talentueuse. Merci pour tout !',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-champagne fill-champagne' : 'text-perle fill-perle'}
      />
    ))}
  </div>
);

export default function TestimonialsSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <SectionTitle
          title="Témoignages"
          subtitle="La confiance de nos couples est notre plus belle récompense."
          variant="asymmetric"
        />

        {/* Global rating */}
        <div className="text-center mb-10">
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-champagne fill-champagne" />
            ))}
          </div>
          <p className="font-serif text-2xl text-charbon">4.9/5</p>
          <p className="text-sm text-charbon/50">— 156 couples nous ont fait confiance —</p>
        </div>

        {/* Stacked offset cards */}
        <div ref={ref} className="relative max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              variants={fadeInUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: i * 0.15 }}
              className={`
                relative p-8 md:p-12 rounded-sm transition-all duration-500 mb-6
                ${i % 2 === 0 ? 'md:ml-0 md:mr-20' : 'md:ml-20 md:mr-0'}
                ${i % 2 === 0 ? 'bg-ivory' : 'bg-white border border-perle'}
              `}
              style={{ zIndex: testimonials.length - i }}
            >
              <Quote size={32} className="text-champagne/30 mb-4" />
              <p className="text-charbon/70 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-perle shrink-0">
                  <img src={t.image} alt={t.names} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-sm text-charbon">{t.names}</p>
                  <p className="text-xs text-charbon/50">{t.venue}</p>
                  <StarRating rating={t.rating} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="/temoignages"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Voir tous les témoignages
          </a>
        </div>
      </div>
    </section>
  );
}
