import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { chatAPI } from '../../services/api';

const INITIAL_MESSAGES = [
  { id: '0', role: 'assistant', content: '✨ Bonjour ! Je suis Eva, l\'assistante virtuelle d\'Ever After Events. Comment puis-je vous aider à préparer votre mariage ?' },
];

// Fallback si le backend n'est pas disponible
const FAQ_FALLBACK = [
  { keywords: ['prix', 'tarif', 'coût', 'budget', 'combien'], response: 'Nos prestations démarrent à 1 200 000 FCFA pour une organisation partielle et 2 500 000 FCFA pour une coordination complète. Chaque devis est personnalisé — souhaitez-vous un rendez-vous gratuit ?' },
  { keywords: ['délai', 'quand', 'réserver', 'quand'], response: 'Idéalement, réservez 12 à 18 mois avant la date. Mais nous pouvons aussi intervenir dans des délais plus courts !' },
  { keywords: ['rendez-vous', 'rdv', 'rencontrer'], response: 'Le premier rendez-vous est gratuit et sans engagement ! Réservez ici : /rendez-vous' },
  { keywords: ['service', 'prestation', 'offre', 'formule'], response: 'Nous proposons 8 prestations : Coordination Complète, Organisation Partielle, Décoration & Scénographie, Jour J, Conciergerie, Destination & Évasion, Animation Musicale, Design Graphique. Découvrez-les sur /services' },
  { keywords: ['contact', 'téléphone', 'email', 'appeler'], response: 'Contactez-nous par email à contact@everafterevents.com, par téléphone au +229 01 23 45 67, ou via /contact' },
  { keywords: ['cotonou', 'bénin', 'benin', 'localisation', 'où'], response: 'Nous sommes basés à Cotonou, Bénin, et intervenons dans toute la sous-région (Togo, Côte d\'Ivoire, Sénégal).' },
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
  const [backendActive, setBackendActive] = useState(true);
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
      if (backendActive) {
        try {
          const history = messages.map((m) => ({ role: m.role, content: m.content }));
          const res = await chatAPI.ask({ message: text, history });
          response = res.data?.response;
          if (!response) throw new Error('Réponse vide');
        } catch {
          // Fallback to local FAQ if backend fails
          setBackendActive(false);
          await new Promise((r) => setTimeout(r, 600));
          response = fallbackResponse(text);
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
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
                  <span className={`w-1.5 h-1.5 rounded-full ${backendActive ? 'bg-sauge' : 'bg-charbon/40'} inline-block`} />
                  {backendActive ? 'Propulsée par Gemini' : 'Mode hors-ligne'}
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
                {typing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
