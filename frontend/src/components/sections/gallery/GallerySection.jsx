import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import Button from '../../common/Button';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { staggerContainer, staggerItem } from '../../../utils/animations';
import { GALLERY_FILTERS } from '../../../utils/constants';

const galleryPhotos = [
  { id: '1', title: 'Château de Vaux', style: 'romantique', src: '/images/photo-1519741497674-611481863552.webp', span: 'row-span-2' },
  { id: '2', title: 'Domaine Provençal', style: 'boheme', src: '/images/photo-1511795409834-ef04bbd61622.webp', span: '' },
  { id: '3', title: 'Réception Luxe', style: 'luxe', src: '/images/photo-1505236858219-8359eb29e329.webp', span: '' },
  { id: '4', title: 'Arche florale', style: 'boheme', src: '/images/photo-1529636798458-92182e662485.webp', span: '' },
  { id: '5', title: 'Élégance Moderne', style: 'moderne', src: '/images/photo-1501281668745-f7f57925c3b4.webp', span: 'row-span-2' },
  { id: '6', title: 'Cérémonie Champêtre', style: 'champetre', src: '/images/photo-1519225421980-715cb0215aed.webp', span: '' },
  { id: '7', title: 'Dîner au bord de l’eau', style: 'oriental', src: '/images/photo-1530023367847-a683933f4172.webp', span: '' },
  { id: '8', title: 'Luxueuse Soirée', style: 'luxe', src: '/images/photo-1519167758481-83f550bb49b3.webp', span: '' },
];

export default function GallerySection() {
  const [filter, setFilter] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const filtered = filter
    ? galleryPhotos.filter((p) => p.style === filter)
    : galleryPhotos;

  return (
    <section id="galerie" className="section-padding bg-ivory">
      <div className="section-container">
        <SectionTitle
          title="Notre Galerie"
          subtitle="Chaque photo raconte une histoire d'amour unique."
          variant="display"
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" ref={ref}>
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f.value || 'all'}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-medium transition-all duration-300 ${
                filter === f.value
                  ? 'bg-charbon text-white'
                  : 'bg-white text-charbon/60 hover:text-charbon border border-perle'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gallery grid — true masonry via CSS columns */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="gallery-masonry"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                style={{ perspective: 800 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  e.currentTarget.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.transition = 'transform 0.3s ease';
                  setTimeout(() => { e.currentTarget.style.transition = ''; }, 300);
                }}
                className="relative group cursor-pointer overflow-hidden rounded-sm"
                onClick={() => setLightbox(photo)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-charbon/70 via-transparent to-transparent p-4 transition-all duration-300 sm:items-center sm:justify-center sm:bg-charbon/0 sm:p-0 sm:group-hover:bg-charbon/50">
                  <div className="transition-all duration-300 sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                    <ZoomIn className="text-white w-8 h-8" />
                    <p className="text-white text-xs mt-2 uppercase tracking-wider">{photo.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button href="/galerie" variant="primary">
            Voir tous nos projets
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charbon/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={28} />
            </button>

            <motion.img
              key={lightbox.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox.src}
              alt={lightbox.title}
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm">
              {lightbox.title}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
