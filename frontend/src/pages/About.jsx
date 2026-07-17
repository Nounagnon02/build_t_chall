import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Heart, Sparkles, Shield, Target, Eye, Award, ArrowRight } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import Button from '../components/common/Button';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import { SITE_NAME } from '../utils/constants';

const stats = [
  { label: "Mariages organisés", value: "400+", icon: Heart },
  { label: "Années d'expertise", value: "15+", icon: Sparkles },
  { label: "Clients satisfaits", value: "98%", icon: Shield },
  { label: "Prestataires partenaires", value: "35+", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Passion",
    desc: "Chaque mariage est une histoire d'amour unique que nous mettons en scène avec toute notre passion et notre dévouement.",
  },
  {
    icon: Sparkles,
    title: "Élégance",
    desc: "Du choix des fleurs à la disposition des couverts, chaque détail compte pour créer un événement d'exception.",
  },
  {
    icon: Shield,
    title: "Excellence",
    desc: "Une rigueur absolue dans l'organisation, des partenaires triés sur le volet, pour un résultat sans faille.",
  },
  {
    icon: Target,
    title: "Sur-Mesure",
    desc: "Aucun mariage ne se ressemble. Nous concevons une expérience unique qui reflète votre personnalité et votre histoire.",
  },
  {
    icon: Eye,
    title: "Vision",
    desc: "Nous anticipons chaque besoin, chaque imprévu, pour que vous viviez votre journée en toute sérénité.",
  },
  {
    icon: Award,
    title: "Engagement",
    desc: "De la première rencontre au dernier verre, nous sommes à vos côtés, engagés pour faire de ce jour le plus beau.",
  },
];

const timeline = [
  { year: "2010", title: "Fondation", desc: "Claire Fontaine fonde Ever After Events après 10 ans d'expérience dans l'événementiel de luxe à Paris." },
  { year: "2013", title: "Premier Cap", desc: "L'agence organise son 50ème mariage et s'installe dans ses propres locaux au cœur de Cotonou, Bénin." },
  { year: "2016", title: "Équipe Étoffée", desc: "Une équipe de 8 talents rejoint l'aventure : designers, chefs de projet et coordinateurs." },
  { year: "2019", title: "Reconnaissance", desc: "Lauréate du prix 'Meilleure Agence de Mariages' aux Africa Events Awards." },
  { year: "2022", title: "Expansion", desc: "Ouverture d'un bureau dédié à la destination wedding et aux événements corporate." },
  { year: "2025", title: "400 Mariages", desc: "Cap des 400 mariages organisés franchi. Lancement de la plateforme digitale interactive." },
];

export default function About() {
  const { ref: missionRef, inView: missionInView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const { ref: valuesRef, inView: valuesInView } = useIntersectionObserver({ threshold: 0.05, triggerOnce: true });
  const { ref: timelineRef, inView: timelineInView } = useIntersectionObserver({ threshold: 0.05, triggerOnce: true });

  return (
    <>
      <Helmet>
        <title>À Propos — {SITE_NAME}</title>
        <meta name="description" content="Découvrez Ever After Events, l'agence de wedding planning premium. Notre histoire, notre équipe, nos valeurs et notre engagement pour faire de votre mariage un moment inoubliable." />
        <meta property="og:title" content={`À Propos — ${SITE_NAME}`} />
        <meta property="og:description" content="Découvrez Ever After Events, l'agence de wedding planning premium au Bénin." />
      </Helmet>

      {/* === Hero Section === */}
      <section className="relative min-h-[50vh] bg-charbon flex items-center overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 pattern-diagonal opacity-20" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-radial from-champagne/[0.04] via-transparent to-transparent" aria-hidden="true" />

        <div className="section-container relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="font-script text-4xl text-champagne block mb-4">Notre Histoire</span>
            <h1 className="font-display text-display-md md:text-display-lg text-white leading-[0.9] mb-6">
              L'amour du beau,<br />
              <span className="gold-text-gradient">la passion du détail</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed">
              Depuis plus de 15 ans, nous transformons les rêves de nos couples en réalité.
              Chaque mariage est une œuvre d'art, chaque détail une promesse d'émotion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* === Mission & Vision === */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div ref={missionRef} className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={missionInView ? 'visible' : 'hidden'}
            >
              <div className="flex items-center gap-3 mb-4">
                <Target size={20} className="text-champagne" />
                <h2 className="text-xs uppercase tracking-widest text-champagne font-medium">Notre Mission</h2>
              </div>
              <p className="font-elegant text-2xl italic text-charbon/60 leading-relaxed mb-6">
                "Offrir à chaque couple une expérience unique, où l'excellence rencontre l'émotion,
                et où chaque instant devient un souvenir précieux."
              </p>
              <p className="text-charbon/70 leading-relaxed">
                Chez Ever After Events, nous croyons que le plus beau jour de votre vie mérite
                une attention absolue. Notre mission est de vous libérer de tout stress pour que
                vous puissiez vivre pleinement chaque instant, entourés de vos proches.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate={missionInView ? 'visible' : 'hidden'}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye size={20} className="text-champagne" />
                <h2 className="text-xs uppercase tracking-widest text-champagne font-medium">Notre Vision</h2>
              </div>
              <p className="font-elegant text-2xl italic text-charbon/60 leading-relaxed mb-6">
                "Devenir la référence africaine du wedding planning d'exception,
                en alliant traditions locales et innovations contemporaines."
              </p>
              <p className="text-charbon/70 leading-relaxed">
                Nous puisons notre inspiration dans la richesse culturelle du Bénin et de l'Afrique,
                que nous marions avec les tendances internationales pour créer des célébrations
                à la fois authentiques et résolument modernes.
              </p>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-perle"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-champagne/10 flex items-center justify-center group-hover:bg-champagne/20 transition-colors">
                  <stat.icon size={20} className="text-champagne" />
                </div>
                <span className="block font-display text-4xl gold-text-gradient font-black mb-1">{stat.value}</span>
                <span className="text-xs text-charbon/50 uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === Valeurs === */}
      <section className="section-padding bg-ivory">
        <div className="section-container">
          <SectionTitle
            title="Nos Valeurs"
            subtitle="Ce qui nous anime chaque jour pour faire de votre mariage un moment d'exception."
            variant="script"
            scriptPrefix="Le cœur de notre métier"
          />

          <motion.div
            ref={valuesRef}
            variants={staggerContainer}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={staggerItem}
                className="bg-white p-8 rounded-sm shadow-card hover:shadow-card-hover transition-all duration-500 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-champagne/10 flex items-center justify-center mb-6 group-hover:bg-champagne/20 transition-colors">
                  <v.icon size={24} className="text-champagne" />
                </div>
                <h3 className="font-serif text-xl text-charbon mb-3">{v.title}</h3>
                <p className="text-sm text-charbon/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === Timeline / Histoire === */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <SectionTitle
            title="Notre Parcours"
            subtitle="15 ans d'excellence au service de vos plus beaux jours."
            variant="asymmetric"
          />

          <div ref={timelineRef} className="relative max-w-4xl mx-auto">
            {/* Center line (desktop) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-perle hidden md:block" aria-hidden="true" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                variants={fadeInUp}
                initial="hidden"
                animate={timelineInView ? 'visible' : 'hidden'}
                transition={{ delay: i * 0.12 }}
                className={`relative flex items-start gap-8 mb-12 md:mb-16
                  ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content side */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                  <span className="font-display text-4xl md:text-5xl gold-text-gradient font-black block mb-1">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-lg text-charbon mb-2">{item.title}</h3>
                  <p className="text-sm text-charbon/60 leading-relaxed">{item.desc}</p>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-ivory border-2 border-champagne items-center justify-center z-10">
                  <div className="w-3 h-3 rounded-full bg-champagne" />
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-20 bg-charbon relative overflow-hidden">
        <div className="absolute inset-0 pattern-diagonal opacity-20" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-radial from-champagne/[0.05] via-transparent to-transparent" aria-hidden="true" />

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-script text-4xl text-champagne block mb-4">Prêts à écrire votre histoire ?</span>
            <h2 className="font-display text-display-md text-white mb-6">
              Faites de votre mariage<br />
              <span className="gold-text-gradient">un chef-d'œuvre</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Rencontrons-nous pour parler de votre projet, sans engagement.
              Votre histoire mérite d'être racontée avec passion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="primary">
                Nous Contacter <ArrowRight size={16} className="inline ml-1" />
              </Button>
              <Button href="/services" variant="secondary">
                Découvrir nos Services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
