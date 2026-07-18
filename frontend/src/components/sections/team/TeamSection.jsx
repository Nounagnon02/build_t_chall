import { motion } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';
import SectionTitle from '../../common/SectionTitle';
import Button from '../../common/Button';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { staggerContainer, staggerItem } from '../../../utils/animations';

const team = [
  {
    name: 'Mélissa Gbèdji',
    role: 'Fondatrice & Directrice',
    specialty: 'Vision créative & Coordination',
    quote: 'Chaque mariage est une histoire unique qui mérite d\'être racontée avec passion.',
    image: '/images/photo-1563132337-f159f484226c.webp',
    social: {
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    name: 'Judicaël Dossou',
    role: 'Wedding Planner Senior',
    specialty: 'Organisation & Logistique',
    quote: 'Mon plus grand bonheur ? Voir le sourire des mariés le jour J.',
    image: '/images/photo-1616805765352-beedbad46b2a.webp',
    social: {
      linkedin: '#',
    },
  },
  {
    name: 'Pélagie Sossou',
    role: 'Directrice Artistique',
    specialty: 'Décoration & Ambiance',
    quote: 'La beauté est dans les détails. Chaque fleur, chaque lumière compte.',
    image: '/images/photo-1602009786436-96b827675d32.webp',
    social: {
      instagram: '#',
    },
  },
  {
    name: 'Emma Renard',
    role: 'Chef de Projet Europe',
    specialty: 'Relation clients & Prestataires internationaux',
    quote: 'Un mariage réussi est un mariage où tout semble naturel... grâce à des mois de préparation.',
    image: '/images/photo-1438761681033-6461ffad8d80.webp',
    social: {
      linkedin: '#',
    },
  },
];

export default function TeamSection() {
  const { ref, inView } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="section-padding bg-ivory">
      <div className="section-container">
        <SectionTitle
          title="Notre Équipe"
          subtitle="Des passionnées au service de votre plus beau jour."
          variant="display"
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              variants={staggerItem}
              className={`group perspective cursor-default ${
                i === 0 ? 'lg:translate-y-8' : i === 2 ? 'lg:-translate-y-8' : ''
              }`}
            >
              <div className="relative overflow-hidden rounded-sm bg-white shadow-card transition-all duration-500 group-hover:shadow-card-hover group-hover:-translate-y-2">
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-charbon/80 via-charbon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white/90 text-sm italic leading-relaxed">
                    "{member.quote}"
                  </p>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-serif text-lg text-charbon mb-1">{member.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-champagne font-medium mb-1">{member.role}</p>
                  <p className="text-xs text-charbon/50">{member.specialty}</p>

                  {/* Social links on hover */}
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.social?.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center hover:bg-champagne/20 transition-colors"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin size={14} className="text-champagne" />
                      </a>
                    )}
                    {member.social?.instagram && (
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-champagne/10 flex items-center justify-center hover:bg-champagne/20 transition-colors"
                        aria-label={`Instagram de ${member.name}`}
                      >
                        <Instagram size={14} className="text-champagne" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
