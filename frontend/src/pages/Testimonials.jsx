import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Quote } from 'lucide-react';
import { testimonialsAPI } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import LoadingScreen from '../components/common/LoadingScreen';
import { normalizeApiArrayResponse } from '../utils/normalizeResponse';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params = filter ? { style: filter } : {};
    testimonialsAPI.list(params).then((res) => {
      setTestimonials(normalizeApiArrayResponse(res.data));
    }).catch(() => { setTestimonials([]); }).finally(() => setLoading(false));
  }, [filter]);

  if (loading) return <LoadingScreen />;

  return (
    <PageTransition>
      <Helmet><title>Témoignages — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-5xl">
          <SectionTitle title="Témoignages" subtitle="Ce que disent nos mariés de leur expérience." />

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-card">
              <Star size={20} className="text-champagne fill-current" />
              <span className="font-serif text-xl text-charbon">4.9 / 5</span>
              <span className="text-xs text-charbon/40">— Plus de 400 mariages</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white p-8 rounded-sm shadow-card relative"
              >
                <Quote size={24} className="text-champagne/20 absolute top-6 right-6" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={14} className={s < t.rating ? 'text-champagne fill-current' : 'text-perle'} />
                  ))}
                </div>
                <p className="text-sm text-charbon/70 leading-relaxed mb-6 italic">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  {t.photo_url && <img src={t.photo_url} alt={t.couple_names} className="w-12 h-12 rounded-full object-cover" />}
                  <div>
                    <p className="font-medium text-sm text-charbon">{t.couple_names}</p>
                    <p className="text-xs text-charbon/40">{t.venue} — {new Date(t.wedding_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
