import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { blogAPI } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import LoadingScreen from '../components/common/LoadingScreen';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = category ? { category } : {};
    blogAPI.list(params).then((res) => {
      setPosts(res.data?.items || res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [category]);

  if (loading) return <LoadingScreen />;

  return (
    <PageTransition>
      <Helmet><title>Blog Mariage — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-5xl">
          <SectionTitle title="Le Blog" subtitle="Conseils, inspirations et tendances pour préparer votre mariage." />

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {['', 'conseils', 'inspiration', 'tendances', 'temoignage'].map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-5 py-2 text-sm rounded-full transition-all ${
                  category === c ? 'bg-champagne text-white' : 'bg-white text-charbon/60 hover:bg-perle'
                }`}
              >{c || 'Tous'}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-sm shadow-card overflow-hidden group hover:shadow-card-hover transition-all"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/9] overflow-hidden bg-perle/40">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charbon/40 text-sm">Image indisponible</div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-widest text-champagne font-medium">{post.category}</span>
                    <h2 className="font-serif text-lg text-charbon mt-2 mb-2 group-hover:text-champagne transition-colors">{post.title}</h2>
                    <p className="text-sm text-charbon/50 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-charbon/40">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR')}</span>
                      {post.reading_time_minutes && <span className="flex items-center gap-1"><Clock size={12} /> {post.reading_time_minutes} min</span>}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-center text-charbon/40 py-12">Aucun article pour le moment.</p>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
