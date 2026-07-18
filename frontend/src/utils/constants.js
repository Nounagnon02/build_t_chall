// Ever After Events — Application Constants

export const SITE_NAME = 'Ever After Events';
export const SITE_TAGLINE = 'L\'agence qui transforme vos rêves en réalité';
export const SITE_DESCRIPTION = 'Agence de Mariages & Événements Premium';

export const CONTACT_INFO = {
  address: 'Boulevard de la Marina, Cotonou, Bénin',
  phone: '+229 97 12 34 56',
  email: 'hello@everafterevents.bj',
  hours: 'Lun-Ven: 8h00-18h00 | Sam: 9h00-13h00',
  whatsapp: '+22997123456',
};

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/everafterevents',
  pinterest: 'https://pinterest.com/everafterevents',
  facebook: 'https://facebook.com/everafterevents',
  linkedin: 'https://linkedin.com/company/everafterevents',
};

export const NAV_LINKS = [
  { label: 'Accueil', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Galerie', path: '/galerie' },
  {
    label: 'Outils',
    path: null,
    children: [
      { label: 'Simulateur Budget', path: '/simulateur-budget' },
      { label: 'Quiz de Style', path: '/quiz-style' },
      { label: 'Configurateur', path: '/configurateur' },
      { label: 'Moodboard', path: '/moodboard' },
    ],
  },
  { label: 'Mon Projet', path: '/mon-projet' },
  { label: 'Blog', path: '/blog' },
  { label: 'À Propos', path: '/a-propos' },
  { label: 'Contact', path: '/contact' },
];

export const GALLERY_FILTERS = [
  { label: 'Tous', value: null },
  { label: 'Romantique', value: 'romantique' },
  { label: 'Bohème', value: 'boheme' },
  { label: 'Luxe', value: 'luxe' },
  { label: 'Champêtre', value: 'champetre' },
  { label: 'Moderne', value: 'moderne' },
  { label: 'Oriental', value: 'oriental' },
];

export const QUIZ_STEPS = [
  {
    key: 'palette',
    question: 'Quelle palette de couleurs vous inspire le plus ?',
    options: [
      { label: 'Rose poudré & Blanc', value: 'romantique', icon: 'Palette', image: 'https://placehold.co/200x150/E8C4C4/1A1A2E?text=Rose+Blanc' },
      { label: 'Pastel & Naturel', value: 'boheme', icon: 'Leaf', image: 'https://placehold.co/200x150/7D9B76/FFFFFF?text=Pastel' },
      { label: 'Or & Nuit', value: 'luxe', icon: 'Star', image: 'https://placehold.co/200x150/C9A96E/FFFFFF?text=Or+Nuit' },
      { label: 'Vert & Blanc', value: 'champetre', icon: 'Sun', image: 'https://placehold.co/200x150/8B9E8A/FFFFFF?text=Vert+Blanc' },
    ],
  },
  {
    key: 'lieu',
    question: 'Quel lieu rêvez-vous pour votre mariage ?',
    options: [
      { label: 'Château historique', value: 'romantique', icon: 'Castle' },
      { label: 'Domaine champêtre', value: 'champetre', icon: 'TreePine' },
      { label: 'Plage paradisiaque', value: 'boheme', icon: 'Umbrella' },
      { label: 'Loft urbain', value: 'moderne', icon: 'Building2' },
    ],
  },
  {
    key: 'musique',
    question: 'Quelle ambiance musicale préférez-vous ?',
    options: [
      { label: 'Orchestre classique', value: 'luxe', icon: 'Music' },
      { label: 'Jazz intimiste', value: 'romantique', icon: 'Music3' },
      { label: 'DJ & Dancefloor', value: 'moderne', icon: 'Headphones' },
      { label: 'Acoustique folk', value: 'boheme', icon: 'Music4' },
    ],
  },
  {
    key: 'dress_code',
    question: 'Quel est votre dress code idéal ?',
    options: [
      { label: 'Élégance classique', value: 'luxe', icon: 'Shirt' },
      { label: 'Romantique & fluide', value: 'romantique', icon: 'Heart' },
      { label: 'Décontracté chic', value: 'boheme', icon: 'Sunset' },
      { label: 'Moderne & audacieux', value: 'moderne', icon: 'Footprints' },
    ],
  },
  {
    key: 'priorite',
    question: 'Quelle est votre priorité absolue ?',
    options: [
      { label: 'Des photos à couper le souffle', value: 'romantique', icon: 'Camera' },
      { label: 'Une décoration spectaculaire', value: 'luxe', icon: 'Flower2' },
      { label: 'Une gastronomie exceptionnelle', value: 'moderne', icon: 'UtensilsCrossed' },
      { label: 'Une ambiance inoubliable', value: 'boheme', icon: 'PartyPopper' },
    ],
  },
];

export const BUDGET_REGIONS = [
  { label: 'Cotonou', value: 'cotonou' },
  { label: 'Grand-Popo / Côte', value: 'grand_popo' },
  { label: 'Ouidah', value: 'ouidah' },
  { label: 'Porto-Novo', value: 'porto_novo' },
  { label: 'Parakou / Nord', value: 'parakou' },
  { label: 'Ganvié / Lac', value: 'ganvie' },
  { label: 'Autre région', value: 'other' },
];

export const SERVICE_OPTIONS = [
  { label: 'Coordination Complète', value: 'coordination_complete' },
  { label: 'Organisation Partielle', value: 'organization_partielle' },
  { label: 'Décoration & Ambiance', value: 'decoration' },
  { label: 'Événement d\'Entreprise', value: 'evenement' },
];

export const CHECKLIST_CATEGORIES = [
  { label: 'Lieu', value: 'venue', icon: 'MapPin' },
  { label: 'Traiteur', value: 'catering', icon: 'UtensilsCrossed' },
  { label: 'Photographie', value: 'photography', icon: 'Camera' },
  { label: 'Décoration', value: 'decoration', icon: 'Palette' },
  { label: 'Musique', value: 'music', icon: 'Music' },
  { label: 'Robe & Costume', value: 'dress', icon: 'Sparkles' },
  { label: 'Invités', value: 'guests', icon: 'Users' },
  { label: 'Administration', value: 'administration', icon: 'FileText' },
  { label: 'Autre', value: 'other', icon: 'MoreHorizontal' },
];

export const WEDDING_STYLES = [
  { label: 'Romantique', value: 'romantique', description: 'Rose, dentelle, bougies, ambiance douce et intime' },
  { label: 'Bohème', value: 'boheme', description: 'Liberté, nature, couleurs pastel, esprit voyageur' },
  { label: 'Luxe', value: 'luxe', description: 'Or, cristal, raffinement, prestige absolu' },
  { label: 'Champêtre', value: 'champetre', description: 'Nature, bois, fleurs des champs, authenticité' },
  { label: 'Moderne', value: 'moderne', description: 'Design, lignes épurées, contemporain, audacieux' },
];
