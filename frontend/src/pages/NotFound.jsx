import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <Helmet><title>Page non trouvée — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen flex items-center">
        <div className="section-container max-w-lg text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <span className="font-serif text-[120px] leading-none text-champagne/20 select-none">404</span>
          </motion.div>
          <h1 className="font-serif text-3xl text-charbon mt-2 mb-4">Page non trouvée</h1>
          <p className="text-charbon/60 mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
          <div className="flex justify-center gap-4">
            <Link to="/" className="btn-primary flex items-center gap-2"><Home size={16} /> Accueil</Link>
            <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2"><ArrowLeft size={16} /> Retour</button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
