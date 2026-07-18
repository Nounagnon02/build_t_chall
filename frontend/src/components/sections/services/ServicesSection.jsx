import { Link } from 'react-router-dom';
import { ArrowUpRight, Camera, CarFront, Flower2, Music2, UtensilsCrossed } from 'lucide-react';

const experiences = [
  { icon: Flower2, title: 'Décors & art floral', text: 'Scénographie, fleurs, lumière et installations qui transforment entièrement le lieu.' },
  { icon: UtensilsCrossed, title: 'Art de recevoir', text: 'Mobilier, linge, porcelaine, verrerie et gastronomie réunis dans une même vision.' },
  { icon: CarFront, title: 'Arrivées remarquables', text: 'Voitures de prestige, véhicules de collection, calèches et transferts VIP.' },
  { icon: Camera, title: 'Image & cinéma', text: 'Photographie, film, drone et retransmission pour ne laisser échapper aucune émotion.' },
  { icon: Music2, title: 'Scène & célébration', text: 'Artistes, musiciens, DJ et performances coordonnés selon vos envies et les disponibilités.' },
];

export default function ServicesSection() {
  return (
    <section id="experiences" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="mb-12 max-w-4xl md:mb-16">
          <p className="eyebrow">Ce que nous rendons possible</p>
          <h2 className="editorial-title">Votre mariage ne devrait ressembler à aucun autre.</h2>
          <p className="editorial-lead">Nous ne proposons pas une simple coordination. Nous imaginons un monde, puis nous réunissons les talents, les objets et la précision nécessaires pour le rendre réel.</p>
        </div>

        <div className="grid overflow-hidden border border-perle/80 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[470px] lg:min-h-[680px]">
            <img src="/images/editorial/luxury-tablescape.webp" alt="Table de réception avec roses, bougies et verrerie" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charbon/75 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-xl p-7 text-white sm:p-10">
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-champagne-200">La beauté vit dans les détails</p>
              <h3 className="font-display text-3xl leading-tight sm:text-5xl">Une table dont vos invités se souviendront.</h3>
            </div>
          </div>

          <div className="divide-y divide-perle/80 bg-ivory">
            {experiences.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="group grid grid-cols-[42px_1fr] gap-4 p-6 transition-colors hover:bg-white sm:p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne/40 text-champagne">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="mb-1 block text-[9px] uppercase tracking-[0.3em] text-charbon/35">0{index + 1}</span>
                  <h3 className="font-display text-xl text-charbon">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charbon/60">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link to="/services" className="inline-flex items-center gap-2 border-b border-charbon pb-1 text-xs font-medium uppercase tracking-[0.22em] text-charbon">
            Explorer tout notre savoir-faire <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
