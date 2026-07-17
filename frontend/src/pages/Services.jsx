import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import SectionTitle from '../components/common/SectionTitle';
import ServiceCard from '../components/common/ServiceCard';
import PageTransition from '../components/common/PageTransition';
import LoadingScreen from '../components/common/LoadingScreen';
import NotFound from './NotFound';

export default function Services() {
  const { slug } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalizeServices = (data) => {
      if (Array.isArray(data)) return data;
      if (data?.items && Array.isArray(data.items)) return data.items;
      if (data?.data && Array.isArray(data.data)) return data.data;
      return [];
    };

    servicesAPI.list().then((res) => {
      setServices(normalizeServices(res.data));
    }).catch(() => {
      setServices([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  if (slug) {
    const service = Array.isArray(services) ? services.find((s) => s.slug === slug) : undefined;
    if (!service) return <NotFound />;
    return <ServiceDetail service={service} />;
  }

  const servicesList = Array.isArray(services) ? services : [];

  return (
    <PageTransition>
      <Helmet>
        <title>Nos Services — Ever After Events</title>
        <meta name="description" content="Découvrez nos prestations de wedding planning : coordination complète, organisation partielle, décoration, sur-mesure." />
      </Helmet>
      <section className="section-padding bg-ivory pt-32">
        <div className="section-container">
          <SectionTitle title="Nos Services" subtitle="Des prestations sur-mesure pour un mariage à votre image." />
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" animate="visible">
            {services.map((s, i) => (
              <motion.div key={s.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <ServiceCard service={s} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}

function ServiceDetail({ service }) {
  return (
    <PageTransition>
      <section className="section-padding pt-32">
        <div className="section-container max-w-4xl">
          <h1 className="font-serif text-4xl text-charbon mb-4">{service.title}</h1>
          <p className="text-charbon/60 leading-relaxed">{service.description}</p>
          {service.price_from && <p className="text-champagne font-medium text-xl mt-4">À partir de {service.price_from}€</p>}
        </div>
      </section>
    </PageTransition>
  );
}
