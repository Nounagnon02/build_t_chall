import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Globe, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS, SITE_NAME } from '../../utils/constants';

const footerLinks = {
  agence: [
    { label: 'Accueil', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Galerie', path: '/galerie' },
    { label: 'Blog', path: '/blog' },
    { label: 'FAQ', path: '/faq' },
  ],
  outils: [
    { label: 'Simulateur de budget', path: '/simulateur-budget' },
    { label: 'Quiz de style', path: '/quiz-style' },
    { label: 'Configurateur', path: '/configurateur' },
    { label: 'Moodboard', path: '/moodboard' },
    { label: 'Rendez-vous', path: '/rendez-vous' },
  ],
  legal: [
    { label: 'Mentions légales', path: '/mentions-legales' },
    { label: 'Politique de confidentialité', path: '/mentions-legales#confidentialite' },
    { label: 'CGU', path: '/mentions-legales#cgu' },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charbon text-white">
      {/* Main footer */}
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="font-serif text-2xl text-white">Ever</span>
              <span className="font-serif text-2xl text-champagne">After</span>
              <span className="font-serif text-2xl text-white">Events</span>
            </Link>
            <p className="text-white/60 font-elegant italic text-lg mb-6">
              L'agence qui transforme vos rêves en réalité.
            </p>
            <div className="flex gap-4">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-champagne hover:border-champagne transition-all"
                 aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-champagne hover:border-champagne transition-all"
                 aria-label="Pinterest">
                <Globe size={18} />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-champagne hover:border-champagne transition-all"
                 aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-champagne hover:border-champagne transition-all"
                 aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-champagne font-medium mb-6">L'agence</h4>
            <ul className="space-y-3">
              {footerLinks.agence.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/60 hover:text-champagne transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-champagne font-medium mb-6">Outils</h4>
            <ul className="space-y-3">
              {footerLinks.outils.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/60 hover:text-champagne transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-champagne font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-champagne mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-champagne shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-white/60 hover:text-champagne transition-colors text-sm">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-champagne shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-white/60 hover:text-champagne transition-colors text-sm">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
            <p className="text-white/40 text-xs mt-4">{CONTACT_INFO.hours}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.path} to={link.path} className="text-white/40 hover:text-champagne transition-colors text-xs">
                {link.label}
              </Link>
            ))}
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-champagne hover:border-champagne transition-all"
              aria-label="Retour en haut"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
