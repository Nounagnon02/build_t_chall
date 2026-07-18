import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Plus, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';

const STORAGE_KEY = 'eae_moodboard';

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function Moodboard() {
  const saved = loadSaved();
  const [images, setImages] = useState(saved ?? []);
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }, [images]);

  const addImage = () => {
    if (!url) return;
    setImages([...images, { id: Date.now(), url, caption, category: 'inspiration' }]);
    setUrl('');
    setCaption('');
  };

  const removeImage = (id) => setImages(images.filter((img) => img.id !== id));

  const clearAll = () => {
    setImages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PageTransition>
      <Helmet><title>Moodboard — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-6xl">
          <SectionTitle title="Moodboard" subtitle="Créez votre tableau d'inspiration pour votre mariage." />

          <div className="bg-white p-4 sm:p-6 rounded-sm shadow-card mb-8">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-charbon/50 mb-1">URL de l'image</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="input-elegant w-full" />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs text-charbon/50 mb-1">Légende</label>
                <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optionnel" className="input-elegant w-full" />
              </div>
              <button onClick={addImage} className="btn-primary w-full sm:w-auto flex items-center gap-2"><Plus size={16} /> Ajouter</button>
            </div>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon size={48} className="mx-auto text-charbon/20 mb-4" />
              <p className="text-charbon/40">Ajoutez des images pour créer votre moodboard</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button onClick={clearAll} className="text-xs text-charbon/30 hover:text-red-400 transition-colors flex items-center gap-1">
                  <Trash2 size={12} /> Tout supprimer
                </button>
              </div>
              <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4">
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="break-inside-avoid mb-4 relative group"
                    >
                      <img src={img.url} alt={img.caption} className="w-full rounded-sm" />
                      <div className="absolute inset-0 bg-charbon/0 group-hover:bg-charbon/40 transition-colors rounded-sm flex items-center justify-center gap-3">
                        <button onClick={() => removeImage(img.id)} aria-label="Supprimer l’image" className="absolute right-2 top-2 rounded-full bg-charbon/70 p-2 text-white opacity-100 transition-opacity sm:static sm:bg-transparent sm:opacity-0 sm:group-hover:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {img.caption && <p className="text-xs text-charbon/50 mt-1">{img.caption}</p>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              <p className="text-xs text-charbon/30 text-center mt-6 flex items-center justify-center gap-1">
                <RefreshCw size={12} /> {images.length} image{images.length > 1 ? 's' : ''} · Sauvegardé automatiquement
              </p>
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
