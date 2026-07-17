import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { galleryAPI } from '../services/api';
import SectionTitle from '../components/common/SectionTitle';
import PageTransition from '../components/common/PageTransition';
import LoadingScreen from '../components/common/LoadingScreen';
import { GALLERY_FILTERS } from '../utils/constants';
import { staggerContainer, staggerItem } from '../utils/animations';
import { normalizeApiArrayResponse } from '../utils/normalizeResponse';

export default function Gallery() {
  const { style } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(style || 'Tous');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = activeFilter !== 'Tous' ? { style: activeFilter.toLowerCase() } : {};
    galleryAPI.list(params).then((res) => {
      setPhotos(normalizeApiArrayResponse(res.data));
    }).catch(() => { setPhotos([]); }).finally(() => setLoading(false));
  }, [activeFilter]);

  if (loading) return <LoadingScreen />;

  return (
    <PageTransition>
      <Helmet>
        <title>Galerie — Ever After Events</title>
        <meta name="description" content="Découvrez nos réalisations : mariages romantiques, bohèmes, luxe, champêtres, modernes et orientaux." />
      </Helmet>
      <section className="section-padding bg-ivory pt-32">
        <div className="section-container">
          <SectionTitle title="Notre Galerie" subtitle="Chaque mariage raconte une histoire unique à travers nos images." />

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {GALLERY_FILTERS.map((f) => (
              <button key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-full transition-all ${
                  activeFilter === f.label ? 'bg-champagne text-white shadow-sm' : 'bg-white text-charbon/60 hover:bg-perle'
                }`}
              >{f.label}</button>
            ))}
          </div>

          {/* Grid */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {photos.map((photo, i) => {
              const imageSrc = photo.image_url || photo.thumbnail_url || photo.src || '';
              const isFeatured = i === 0;
              return (
                <motion.div key={photo.id} variants={staggerItem}
                  className={`relative overflow-hidden rounded-xl cursor-pointer group bg-gradient-to-br from-perle via-white to-perle/60 min-h-[220px] shadow-sm ${isFeatured ? 'sm:col-span-2 sm:row-span-2 min-h-[320px]' : ''}`}
                  onClick={() => setLightbox(photo)}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={photo.title || 'Photo de mariage'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-charbon/40 px-4 text-center">
                      <div className="text-lg font-serif text-charbon/70 mb-1">Image indisponible</div>
                      <div className="text-xs uppercase tracking-[0.2em]">À venir</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charbon/70 via-charbon/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium">{photo.title || 'Réalisation'}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-charbon/95 flex items-center justify-center p-3 sm:p-6 md:p-8" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white text-xl" onClick={() => setLightbox(null)}>✕</button>
            <img
              src={lightbox.image_url || lightbox.thumbnail_url || lightbox.src}
              alt={lightbox.title}
              className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-sm"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80';
              }}
            />
          </div>
        )}
      </section>
    </PageTransition>
  );
}
