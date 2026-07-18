import { Camera, CarFront, ChefHat, Flower2, Hotel, Wine } from 'lucide-react';

const expertise = [
  [Wine, 'Champagne & vins', 'Maisons et sommeliers sélectionnés'],
  [Flower2, 'Art floral', 'Fleuristes et scénographes'],
  [Hotel, 'Lieux d’exception', 'Domaines, hôtels et villas privées'],
  [CarFront, 'Mobilité prestige', 'Berlines, collections et calèches'],
  [ChefHat, 'Haute gastronomie', 'Chefs, traiteurs et pâtissiers'],
  [Camera, 'Image & cinéma', 'Photographes, réalisateurs et drones'],
];

export default function PartnersSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Notre cercle de confiance</p>
            <h2 className="editorial-title">Les bonnes maisons font les grandes célébrations.</h2>
            <p className="editorial-lead">Nous composons pour chaque projet une équipe sur mesure, choisie pour son excellence, sa fiabilité et sa capacité à servir votre vision.</p>
            <p className="mt-6 text-xs italic leading-relaxed text-charbon/45">Les prestataires définitifs sont proposés selon le lieu, le budget, les disponibilités et vos préférences.</p>
          </div>
          <div className="grid sm:grid-cols-2">
            {expertise.map(([Icon, title, text], index) => (
              <div key={title} className={`min-h-[210px] border-perle/80 p-7 ${index % 2 === 0 ? 'sm:border-r' : ''} ${index < 4 ? 'border-b' : ''}`}>
                <Icon size={25} strokeWidth={1.25} className="mb-8 text-champagne" />
                <h3 className="font-display text-2xl text-charbon">{title}</h3>
                <p className="mt-2 text-sm text-charbon/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
