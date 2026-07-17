import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FileText, Plus, Image, MessageCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('services');

  const tabs = [
    { key: 'services', label: 'Services', icon: FileText },
    { key: 'gallery', label: 'Galerie', icon: Image },
    { key: 'blog', label: 'Blog', icon: MessageCircle },
  ];

  return (
    <>
      <Helmet><title>Gestion Contenu — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-5xl">
          <h1 className="font-serif text-2xl text-charbon mb-8">Gestion du contenu</h1>

          <div className="flex gap-2 mb-8">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm rounded-sm transition-all ${
                  activeTab === tab.key ? 'bg-champagne text-white' : 'bg-white text-charbon/50 hover:bg-perle'
                }`}
              ><tab.icon size={16} /> {tab.label}</button>
            ))}
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-sm shadow-card">
            <p className="text-sm text-charbon/40">Interface de gestion {activeTab}. Les fonctionnalités CRUD complètes sont disponibles via l'API.</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
