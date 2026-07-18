import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Check, ChevronDown, Clock3, ExternalLink, Heart, MapPin, Music2, Shirt, Sparkles, Wine } from 'lucide-react';

const EVENT_DATE = new Date('2027-08-21T16:00:00+01:00');

const schedule = [
  ['16:00', 'Cérémonie', 'Jardin des Palmiers'],
  ['18:00', 'Cocktail au coucher du soleil', 'Terrasse Océane'],
  ['20:00', 'Dîner & célébration', 'Grand Salon'],
  ['23:00', 'Live, DJ & soirée', 'Sous les étoiles'],
];

function getCountdown() {
  const distance = Math.max(0, EVENT_DATE.getTime() - Date.now());
  return {
    jours: Math.floor(distance / 86400000),
    heures: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
  };
}

export default function InvitationDemo() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-[#12283a]">
      <Helmet>
        <title>Aïcha & Kévin — Invitation</title>
        <meta name="description" content="Démonstration d’une invitation digitale premium Ever After Events." />
      </Helmet>

      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#12283a] pt-16 sm:pt-20">
        <img src="/images/editorial/hero-wedding-coast.webp" alt="Aïcha et Kévin lors de leur cérémonie" className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07131d]/85 via-[#07131d]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131d]/85 via-transparent to-[#07131d]/20" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8 sm:pb-20">
          <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.34em] text-white/75 sm:text-[11px]">Vous êtes convié à célébrer</p>
          <h1 className="font-display text-[clamp(3.3rem,13vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.04em] text-white">
            Aïcha <span className="font-script font-normal text-[#d9a3a8]">&</span> Kévin
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-white/80 sm:text-sm">
            <span className="flex items-center gap-2"><CalendarDays size={16} /> 21 août 2027</span>
            <span className="flex items-center gap-2"><MapPin size={16} /> Cotonou, Bénin</span>
          </div>
          <a href="#invitation" className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white" aria-label="Découvrir l’invitation">
            <ChevronDown size={19} />
          </a>
        </div>
      </section>

      <main id="invitation">
        <section className="px-5 py-20 text-center sm:px-8 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <Sparkles size={20} className="mx-auto mb-6 text-[#9a4054]" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#9a4054]">Avec la bénédiction de nos familles</p>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">Deux histoires deviennent une.</h2>
            <p className="mx-auto mt-6 max-w-xl font-elegant text-lg leading-relaxed text-[#12283a]/65 sm:text-xl">
              Nous serions profondément heureux de vous compter parmi nous pour célébrer ce nouveau chapitre, face à l’océan.
            </p>

            <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 border-y border-[#9a4054]/20 py-7">
              {Object.entries(countdown).map(([label, value]) => (
                <div key={label} className="border-r border-[#9a4054]/15 last:border-r-0">
                  <span className="block font-display text-3xl sm:text-5xl">{value}</span>
                  <span className="mt-1 block text-[8px] uppercase tracking-[0.24em] text-[#12283a]/45 sm:text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#9a4054]">Le déroulé de la journée</p>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl">Chaque instant compte.</h2>
            </div>
            <div className="divide-y divide-[#12283a]/10 border-y border-[#12283a]/10">
              {schedule.map(([time, title, place], index) => (
                <div key={time} className="grid gap-2 py-6 sm:grid-cols-[90px_1fr_1fr] sm:items-center sm:gap-8 sm:py-8">
                  <span className="font-display text-2xl text-[#9a4054]">{time}</span>
                  <div className="flex items-center gap-3">
                    {index === 0 ? <Heart size={17} /> : index === 1 ? <Wine size={17} /> : index === 2 ? <Clock3 size={17} /> : <Music2 size={17} />}
                    <h3 className="font-display text-xl sm:text-2xl">{title}</h3>
                  </div>
                  <p className="text-sm text-[#12283a]/50 sm:text-right">{place}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2">
          <div className="min-h-[420px] lg:min-h-[680px]">
            <img src="/images/editorial/luxury-tablescape.webp" alt="Dîner de mariage aux chandelles" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center bg-[#12283a] px-6 py-16 text-white sm:px-12 lg:px-20">
            <div className="max-w-xl">
              <Shirt size={24} className="mb-7 text-[#d9a3a8]" />
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#d9a3a8]">Dress code</p>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl">Élégance solaire.</h2>
              <p className="mt-6 font-elegant text-lg leading-relaxed text-white/65">Tenue de soirée. Nous vous invitons à composer autour de l’ivoire, du champagne, du bleu nuit et d’une touche de vieux rose.</p>
              <div className="mt-8 flex gap-3" aria-label="Palette de couleurs">
                {['#f7f1e8', '#d4a843', '#12283a', '#9a4054'].map((color) => <span key={color} className="h-10 w-10 rounded-full border border-white/20" style={{ backgroundColor: color }} />)}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f1e8] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#9a4054]">Informations pratiques</p>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl">Retrouvez-nous face à l’océan.</h2>
              <div className="mt-8 space-y-5 text-sm text-[#12283a]/65">
                <p className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-[#9a4054]" /> Jardin des Palmiers, Route des Pêches, Cotonou</p>
                <p className="flex items-start gap-3"><Clock3 size={18} className="mt-0.5 shrink-0 text-[#9a4054]" /> Accueil des invités à partir de 15 h 30</p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 border-b border-[#12283a] pb-1 text-xs uppercase tracking-[0.2em]">Voir l’itinéraire <ExternalLink size={14} /></a>
            </div>

            <div className="bg-white p-6 shadow-[0_20px_70px_rgba(18,40,58,0.08)] sm:p-10">
              {submitted ? (
                <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9a4054]/10 text-[#9a4054]"><Check size={25} /></span>
                  <h3 className="mt-5 font-display text-3xl">Merci pour votre réponse.</h3>
                  <p className="mt-3 text-sm text-[#12283a]/55">Les mariés ont hâte de célébrer avec vous.</p>
                </div>
              ) : (
                <form onSubmit={(event) => { event.preventDefault(); if (response) setSubmitted(true); }}>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#9a4054]">RSVP</p>
                  <h3 className="mt-3 font-display text-3xl">Serez-vous des nôtres ?</h3>
                  <p className="mt-3 text-sm text-[#12283a]/50">Merci de confirmer avant le 21 juin 2027.</p>
                  <input required aria-label="Nom complet" placeholder="Votre nom complet" className="mt-8 w-full border-b border-[#12283a]/20 bg-transparent py-3 outline-none focus:border-[#9a4054]" />
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {['Avec grand plaisir', 'Malheureusement non'].map((option) => (
                      <button key={option} type="button" onClick={() => setResponse(option)} className={`min-h-12 border px-4 text-sm transition-colors ${response === option ? 'border-[#9a4054] bg-[#9a4054] text-white' : 'border-[#12283a]/15'}`}>{option}</button>
                    ))}
                  </div>
                  <select aria-label="Préférence de repas" className="mt-5 w-full border-b border-[#12283a]/20 bg-transparent py-3 text-sm outline-none focus:border-[#9a4054]">
                    <option>Préférence de repas</option><option>Menu classique</option><option>Menu végétarien</option>
                  </select>
                  <button type="submit" disabled={!response} className="mt-8 w-full bg-[#12283a] px-6 py-4 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-35">Envoyer ma réponse</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0b1b28] px-5 py-10 text-center text-white/45">
        <p className="font-script text-3xl text-[#d9a3a8]">Aïcha & Kévin</p>
        <p className="mt-3 text-[9px] uppercase tracking-[0.28em]">Une invitation imaginée par Ever After Events</p>
      </footer>
    </div>
  );
}
