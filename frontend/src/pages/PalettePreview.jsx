import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Check, Eye, Star, Heart, ArrowRight } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

// ── 4 palettes proposées ──────────────────────────────────────────────
const PALETTES = [
  {
    id: 'obsidienne',
    name: 'Obsidienne & Cuivre',
    tagline: 'Luxe feutré, bohème chic',
    colors: {
      dark: '#0F0F1A',
      dark2: '#1A1A2E',
      primary: '#D48C5B',
      primaryLight: '#E8A87C',
      secondary: '#E8D5C0',
      accent1: '#8B4513',
      accent2: '#2D1B00',
      light: '#F5F0EB',
      white: '#FAF6F1',
      muted: 'rgba(15,15,26,0.6)',
    },
    description: 'Noir profond, cuivre brûlé, ivoire chaud. Une ambiance à la fois mystérieuse et raffinée, comme un dîner aux chandelles dans un loft new-yorkais.',
  },
  {
    id: 'lilas',
    name: 'Lilas & Ardoise',
    tagline: 'Artistique, audacieux',
    colors: {
      dark: '#1E1E2E',
      dark2: '#2A2A3E',
      primary: '#A78BFA',
      primaryLight: '#C4B0FA',
      secondary: '#F5F0F7',
      accent1: '#D4A5A5',
      accent2: '#4A3F6B',
      light: '#F7F4FA',
      white: '#FCFAFD',
      muted: 'rgba(30,30,46,0.6)',
    },
    description: 'Lilas doux et ardoise profonde. Une signature visuelle ultra-moderne qui tranche avec tous les autres wedding planners.',
  },
  {
    id: 'saphir',
    name: 'Saphir & Laiton',
    tagline: 'Royal, intemporel',
    colors: {
      dark: '#0F2A3F',
      dark2: '#1A3A52',
      primary: '#D4A843',
      primaryLight: '#E4BE6A',
      secondary: '#F4F0E6',
      accent1: '#8B7355',
      accent2: '#1B5A5A',
      light: '#F0EDE4',
      white: '#FAF7F0',
      muted: 'rgba(15,42,63,0.6)',
    },
    description: 'Bleu nuit profond, or chaud riche, touches de sarcelle. Prestige et élégance intemporelle — un mariage au château.',
  },
  {
    id: 'noirRose',
    name: 'Noir & Or Rose',
    tagline: 'Mode, contemporain',
    colors: {
      dark: '#0D0D0D',
      dark2: '#1A1A1A',
      primary: '#B76E79',
      primaryLight: '#D4949D',
      secondary: '#FAF6F1',
      accent1: '#2C2C2C',
      accent2: '#E8C4C4',
      light: '#F8F4F0',
      white: '#FCFAF8',
      muted: 'rgba(13,13,13,0.6)',
    },
    description: 'Noir absolu, or rose délicat. L\'alliance du minimalisme et de la douceur — une esthétique de éditorial de mode.',
  },
];

function PaletteCard({ palette, isActive, onSelect }) {
  const c = palette.colors;

  return (
    <motion.div
      layout
      className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
        isActive ? 'border-[#C9A96E] shadow-2xl scale-[1.02]' : 'border-transparent shadow-lg hover:shadow-xl'
      }`}
      style={{ background: c.white }}
      onClick={onSelect}
    >
      {/* Color swatches */}
      <div className="p-5 pb-3">
        <div className="flex gap-1.5 mb-4">
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ background: c.dark }} title="Dark" />
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ background: c.primary }} title="Primary" />
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ background: c.primaryLight }} title="Primary Light" />
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ background: c.accent1 }} title="Accent 1" />
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ background: c.accent2 }} title="Accent 2" />
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ background: c.secondary }} title="Secondary" />
        </div>

        <h3 className="font-bold text-lg mb-0.5" style={{ color: c.dark }}>{palette.name}</h3>
        <p className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: c.primary }}>{palette.tagline}</p>
        <p className="text-xs leading-relaxed" style={{ color: c.muted }}>{palette.description}</p>
      </div>

      {/* Preview components */}
      <div className="px-5 pb-5 space-y-3">
        {/* Button */}
        <button className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all" style={{ background: c.primary }}>
          <span className="flex items-center justify-center gap-2">
            Commencer mon projet <ArrowRight size={14} />
          </span>
        </button>

        {/* Light button */}
        <button className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all" style={{ background: c.light, color: c.dark, border: `1px solid ${c.dark}10` }}>
          Voir nos réalisations
        </button>

        {/* Card preview */}
        <div className="p-4 rounded-lg" style={{ background: c.light, border: `1px solid ${c.dark}08` }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${c.primary}15` }}>
              <Star size={14} style={{ color: c.primary }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: c.dark }}>Coordination Complète</p>
              <p className="text-[10px]" style={{ color: c.muted }}>À partir de 8 990€</p>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: c.muted }}>
            Une prise en charge totale de A à Z pour un mariage sans le moindre stress.
          </p>
        </div>

        {/* Section heading preview */}
        <div className="text-center py-3">
          <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: c.primary }}>Ever After Events</p>
          <p className="text-lg font-bold" style={{ color: c.dark }}>Chaque mariage<br/>est une <span style={{ color: c.primary }}>œuvre d'art</span></p>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="py-2 text-center text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5" style={{ background: c.dark, color: c.primary }}>
          <Check size={12} /> Palette active
        </div>
      )}
    </motion.div>
  );
}

function DetailView({ palette }) {
  const c = palette.colors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 rounded-xl overflow-hidden"
      style={{ background: c.white, border: `1px solid ${c.dark}10` }}
    >
      {/* Header */}
      <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, ${c.dark} 0%, ${c.dark2 || c.dark} 100%)` }}>
        <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: c.primary }}>Aperçu détaillé</p>
        <h2 className="text-2xl font-bold text-white">{palette.name}</h2>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-8">
        {/* Real component previews */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.dark }}>🎨 Palette</h3>

          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'Fond', color: c.dark },
              { label: 'Primaire', color: c.primary },
              { label: 'Secondaire', color: c.secondary },
              { label: 'Accent 1', color: c.accent1 },
              { label: 'Accent 2', color: c.accent2 },
            ].map((swatch) => (
              <div key={swatch.label} className="text-center">
                <div className="w-full aspect-square rounded-lg mb-1.5 shadow-inner" style={{ background: swatch.color }} />
                <p className="text-[10px] font-medium" style={{ color: c.muted }}>{swatch.label}</p>
                <p className="text-[9px] font-mono" style={{ color: c.muted }}>{swatch.color}</p>
              </div>
            ))}
          </div>

          {/* Typography preview */}
          <h3 className="text-sm font-bold uppercase tracking-wider pt-3" style={{ color: c.dark }}>✍️ Typographie</h3>
          <div>
            <p className="text-2xl font-bold mb-2" style={{ color: c.dark }}>Playfair Display</p>
            <p className="text-lg italic mb-2" style={{ color: c.primary }}>Cormorant Garamond</p>
            <p className="text-sm" style={{ color: c.muted }}>Montserrat — Le corps de texte. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: c.dark }}>🖼 Composants réels</h3>

          {/* Hero-like block */}
          <div className="rounded-xl p-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.dark} 0%, ${c.dark2 || c.dark} 100%)` }}>
            <div className="relative z-10">
              <p className="text-lg font-bold text-white mb-2">L'agence qui<br/>transforme vos rêves</p>
              <button className="text-xs font-semibold py-2 px-5 rounded-lg inline-flex items-center gap-1.5" style={{ background: c.primary, color: 'white' }}>
                Découvrir <Eye size={12} />
              </button>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-xl p-5" style={{ background: c.light, border: `1px solid ${c.dark}08` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.primary}15` }}>
                <Heart size={18} style={{ color: c.primary }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: c.dark }}>Sophie & Thomas</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} style={{ color: c.primary, fill: c.primary }} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed italic" style={{ color: c.muted }}>
              "Ever After Events a transformé notre mariage en un conte de fées. Chaque détail était parfait."
            </p>
          </div>

          {/* Badge */}
          <div className="flex gap-2">
            <span className="text-[10px] font-medium px-3 py-1.5 rounded-full" style={{ background: `${c.primary}12`, color: c.primary, border: `1px solid ${c.primary}30` }}>
              ✓ Personnalisé
            </span>
            <span className="text-[10px] font-medium px-3 py-1.5 rounded-full" style={{ background: `${c.dark}08`, color: c.muted }}>
              +420 couples
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PalettePreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const palette = PALETTES[activeIndex];

  const prev = () => setActiveIndex((i) => (i === 0 ? PALETTES.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === PALETTES.length - 1 ? 0 : i + 1));

  return (
    <PageTransition>
      <Helmet><title>Palettes — Ever After Events</title></Helmet>
      <section className="min-h-screen bg-ivory pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.15em] text-champagne font-medium mb-2">Comparateur</p>
            <h1 className="font-serif text-3xl md:text-4xl text-charbon font-bold mb-3">
              Choisissez votre palette
            </h1>
            <p className="text-sm text-charbon/50 max-w-xl mx-auto">
              Testez chaque palette sur de vrais composants. Cliquez sur celle qui vous parle, explorez les détails, et prenez votre décision.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-charbon/5 transition-colors" style={{ color: palette.colors.primary }}>
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {PALETTES.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(i)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: i === activeIndex ? palette.colors.primary : `${palette.colors.dark}08`,
                    color: i === activeIndex ? '#fff' : palette.colors.muted,
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.colors.primary }} />
                  {p.name}
                </button>
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-charbon/5 transition-colors" style={{ color: palette.colors.primary }}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PALETTES.map((p, i) => (
              <PaletteCard
                key={p.id}
                palette={p}
                isActive={i === activeIndex}
                onSelect={() => setActiveIndex(i)}
              />
            ))}
          </div>

          {/* Detail view */}
          <DetailView palette={palette} />

          {/* Hex values table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl overflow-hidden"
            style={{ background: palette.colors.white, border: `1px solid ${palette.colors.dark}10` }}
          >
            <div className="p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: palette.colors.dark }}>
                📋 Valeurs hex — {palette.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { role: 'Fond principal', hex: palette.colors.dark },
                  { role: 'Fond secondaire', hex: palette.colors.dark2 || palette.colors.dark },
                  { role: 'Couleur primaire', hex: palette.colors.primary },
                  { role: 'Primaire clair', hex: palette.colors.primaryLight },
                  { role: 'Accent 1', hex: palette.colors.accent1 },
                  { role: 'Accent 2', hex: palette.colors.accent2 },
                  { role: 'Arrière-plan', hex: palette.colors.light },
                  { role: 'Blanc', hex: palette.colors.white },
                ].map((item) => (
                  <div key={item.role} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: `${palette.colors.dark}04` }}>
                    <div className="w-8 h-8 rounded-md shadow-inner shrink-0" style={{ background: item.hex }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold truncate" style={{ color: palette.colors.dark }}>{item.role}</p>
                      <p className="text-[9px] font-mono" style={{ color: palette.colors.muted }}>{item.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
