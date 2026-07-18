import { ArrowUpRight, CalendarDays, MapPin, UserCheck } from 'lucide-react';

const demoUrl = import.meta.env.VITE_INVITATION_DEMO_URL || '#contact';

export default function DigitalInvitationSection() {
  return (
    <section className="relative overflow-hidden bg-ivory py-20 sm:py-24 lg:py-32">
      <div className="absolute -right-20 top-20 h-52 w-52 rounded-full bg-[#8f2942]/[0.06] blur-3xl" aria-hidden="true" />
      <div className="section-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="aspect-[16/11] overflow-hidden bg-perle">
            <img src="/images/editorial/digital-invitation.webp" alt="Exemple d’invitation digitale élégante sur smartphone" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -right-3 hidden bg-[#8f2942] px-7 py-5 text-white sm:block">
            <span className="font-script text-3xl">Votre histoire</span>
            <span className="block text-[9px] uppercase tracking-[0.28em] text-white/70">dans chaque invitation</span>
          </div>
        </div>

        <div>
          <p className="eyebrow text-[#8f2942]">L’invitation réinventée</p>
          <h2 className="editorial-title">Un lien chic. Une première émotion.</h2>
          <p className="editorial-lead">Offrez à chaque invité une expérience personnalisée avant même le jour J : votre univers, toutes les informations utiles et une confirmation simple, dans une page conçue à votre image.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              [CalendarDays, 'Programme & compte à rebours'],
              [MapPin, 'Lieu, itinéraire & hébergement'],
              [UserCheck, 'RSVP & préférences invités'],
            ].map(([Icon, label]) => (
              <div key={label} className="border-t border-[#8f2942]/25 pt-4">
                <Icon size={18} className="mb-3 text-[#8f2942]" strokeWidth={1.5} />
                <p className="text-xs leading-relaxed text-charbon/65">{label}</p>
              </div>
            ))}
          </div>
          <a href={demoUrl} target={demoUrl.startsWith('http') ? '_blank' : undefined} rel={demoUrl.startsWith('http') ? 'noreferrer' : undefined} className="mt-9 inline-flex items-center gap-2 bg-charbon px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#8f2942]">
            Voir le prototype <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
