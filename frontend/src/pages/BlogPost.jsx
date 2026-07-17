import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { blogAPI } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import LoadingScreen from '../components/common/LoadingScreen';
import NotFound from './NotFound';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.get(slug).then((res) => {
      setPost(res.data || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (!post) return <NotFound />;

  return (
    <PageTransition>
      <Helmet>
        <title>{post.meta_title || post.title} — Ever After Events</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
      </Helmet>
      <article className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-charbon/50 hover:text-charbon transition-colors mb-8">
            <ArrowLeft size={16} /> Retour au blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[10px] uppercase tracking-widest text-champagne font-medium">{post.category}</span>
            <h1 className="font-serif text-3xl md:text-4xl text-charbon mt-2 mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-xs text-charbon/40 mb-8">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.published_at || post.created_at).toLocaleDateString('fr-FR')}</span>
              {post.reading_time_minutes && <span className="flex items-center gap-1"><Clock size={14} /> {post.reading_time_minutes} min de lecture</span>}
              {post.author && <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>}
            </div>

            <div className="w-full aspect-video overflow-hidden rounded-sm mb-8 bg-perle/40">
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charbon/40 text-sm">Image indisponible</div>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-charbon/70 leading-relaxed space-y-4">
              {post.content?.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
            </div>
          </motion.div>
        </div>
      </article>
    </PageTransition>
  );
}
