import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Tu es Eva, l'assistante virtuelle d'Ever After Events, une agence de mariages et événements premium basée en France.

Ton rôle :
- Répondre aux questions sur les services, tarifs, processus et disponibilités
- Guider les couples dans la préparation de leur mariage
- Proposer des rendez-vous gratuits et sans engagement
- Rester chaleureuse, élégante et professionnelle

Informations clés :
- Prestations : Coordination Complète (dès 8 000€), Organisation Partielle (dès 4 000€), Décoration & Ambiance, Événements d'Entreprise, Sur-Mesure
- Premier RDV : gratuit et sans engagement, réservable sur /rendez-vous
- Contact : contact@everafterevents.com | 01 23 45 67 89
- Délai idéal : réserver 12 à 18 mois avant la date
- Galerie disponible sur /galerie
- FAQ sur /faq

Réponds toujours en français, de façon concise (max 3 phrases), chaleureuse et élégante. Si tu ne sais pas, oriente vers le contact ou le RDV.`;

const INITIAL_MESSAGES = [
  { id: '0', role: 'assistant', content: '✨ Bonjour ! Je suis Eva, l\'assistante virtuelle d\'Ever After Events. Comment puis-je vous aider à préparer votre mariage ?' },
];

async function askGemini(history, userMessage) {
  const contents = [
    ...history.filter((m) => m.role !== 'system').map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { maxOutputTokens: 256, temperature: 0.7 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Je suis désolée, je n\'ai pas pu traiter votre demande.';
}

// Fallback si pas de clé Gemini
const FAQ_FALLBACK = [
  { keywords: ['prix', 'tarif', 'coût', 'budget', 'combien'], response: 'Nos prestations démarrent à 4 000€ pour une organisation partielle et 8 000€ pour une coordination complète. Chaque devis est personnalisé — souhaitez-vous un rendez-vous gratuit ?' },
  { keywords: ['délai', 'quand', 'réserver'], response: 'Idéalement, réservez 12 à 18 mois avant la date. Mais nous pouvons aussi intervenir dans des délais plus courts !' },
  { keywords: ['rendez-vous', 'rdv', 'rencontrer'], response: 'Le premier rendez-vous est gratuit et sans engagement ! Réservez ici : /rendez-vous' },
  { keywords: ['service', 'prestation', 'offre'], response: 'Nous proposons 5 prestations : Coordination Complète, Organisation Partielle, Décoration & Ambiance, Événements d\'Entreprise, et Sur-Mesure. Découvrez-les sur /services' },
  { keywords: ['contact', 'téléphone', 'email'], response: 'Contactez-nous par email à contact@everafterevents.com, par téléphone au 01 23 45 67 89, ou via /contact' },
];

function fallbackResponse(input) {
  const lower = input.toLowerCase();
  for (const faq of FAQ_FALLBACK) {
    if (faq.keywords.some((kw) => lower.includes(kw))) return faq.response;
  }
  return 'Je suis là pour vous aider ! Pour toute question précise, consultez notre FAQ (/faq) ou contactez-nous directement. 😊';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      let response;
      if (GEMINI_API_KEY) {
        response = await askGemini(messages, text);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        response = fallbackResponse(text);
      }
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolée, une erreur est survenue. Contactez-nous directement à contact@everafterevents.com 🙏',
      }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-champagne text-white shadow-gold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Ouvrir le chat"
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={24} /></motion.span>
            : <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={24} /></motion.span>
          }
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-sm shadow-card-hover overflow-hidden flex flex-col"
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-charbon p-4 text-white flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-champagne/20 flex items-center justify-center">
                <Sparkles size={18} className="text-champagne" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Eva — Assistante IA</p>
                <p className="text-[10px] text-white/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sauge inline-block" />
                  {GEMINI_API_KEY ? 'Propulsée par Gemini' : 'Mode hors-ligne'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-sm text-sm leading-relaxed ${
                    msg.role === 'user' ? 'bg-champagne text-white' : 'bg-perle text-charbon'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-perle p-3 rounded-sm flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-charbon/30"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-perle p-4 flex gap-3 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="input-elegant flex-1 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                disabled={typing}
              />
              <button onClick={send} disabled={!input.trim() || typing} className="btn-primary !p-2 disabled:opacity-40">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
