import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Search } from 'lucide-react';
import { faqAPI } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import SectionTitle from '../components/common/SectionTitle';
import LoadingScreen from '../components/common/LoadingScreen';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    faqAPI.list(params).then((res) => {
      setFaqs(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [search, category]);

  if (loading) return <LoadingScreen />;

  return (
    <PageTransition>
      <Helmet><title>FAQ — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory pt-32 min-h-screen">
        <div className="section-container max-w-3xl">
          <SectionTitle title="Questions Fréquentes" subtitle="Tout ce que vous devez savoir avant de nous confier votre projet." />

          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charbon/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une question..." className="input-elegant w-full pl-12" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="bg-white border border-perle rounded-sm overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-ivory/50 transition-colors"
                >
                  <span className="font-medium text-sm text-charbon pr-4">{faq.question}</span>
                  <ChevronDown size={18} className={`text-champagne shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-charbon/60 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {faqs.length === 0 && <p className="text-center text-charbon/40 py-12">Aucune question trouvée.</p>}
        </div>
      </section>
    </PageTransition>
  );
}
