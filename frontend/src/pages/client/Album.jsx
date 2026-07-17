import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { galleryAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function ClientAlbum() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    galleryAPI.list({ featured: true }).then((res) => {
      setPhotos(res.data?.items || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet><title>Album — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-6xl">
          <h1 className="font-serif text-2xl text-charbon mb-2">Album</h1>
          <p className="text-sm text-charbon/50 mb-8">Les plus beaux moments de notre travail.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <motion.div key={photo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="aspect-[3/4] overflow-hidden rounded-sm cursor-pointer group relative"
                onClick={() => setLightbox(photo)}
              >
                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-charbon/0 group-hover:bg-charbon/40 transition-colors" />
              </motion.div>
            ))}
          </div>

          {lightbox && (
            <div className="fixed inset-0 z-50 bg-charbon/95 flex items-center justify-center p-8" onClick={() => setLightbox(null)}>
              <button aria-label="Fermer" className="absolute top-6 right-6 text-white text-xl" onClick={() => setLightbox(null)}>✕</button>
              <img src={lightbox.image_url} alt={lightbox.title} className="max-w-full max-h-[90vh] object-contain" />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
