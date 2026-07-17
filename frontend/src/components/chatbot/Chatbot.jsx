import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

const initialMessages = [
  { id: '0', role: 'assistant', content: '✨ Bonjour ! Je suis Eva, l\'assistante virtuelle d\'Ever After Events. Comment puis-je vous aider à préparer votre mariage ?' },
];

const faqResponses = [
  { keywords: ['prix', 'tarif', 'coût', 'budget', 'combien'], response: 'Nos prestations commencent à partir de 4 000€ pour une organisation partielle et de 8 000€ pour une coordination complète. Chaque devis est personnalisé selon vos besoins. Souhaitez-vous planifier un rendez-vous gratuit pour en discuter ?' },
  { keywords: ['délai', 'quand', 'réserver', 'quand'], response: 'Idéalement, réservez votre wedding planner 12 à 18 mois avant la date. Mais ne vous inquiétez pas, nous pouvons aussi intervenir dans des délais plus courts !' },
  { keywords: ['rendez-vous', 'rencontrer', 'rdv', 'premier'], response: 'Le premier rendez-vous est gratuit et sans engagement ! Vous pouvez réserver directement ici : /rendez-vous' },
  { keywords: ['service', 'prestation', 'offre', 'proposez'], response: 'Nous proposons 5 types de prestations : Coordination Complète, Organisation Partielle, Décoration & Ambiance, Événements d\'Entreprise, et Sur-Mesure. Découvrez-les ici : /services' },
  { keywords: ['galerie', 'photo', 'mariage', 'réalisation'], response: 'Notre galerie regroupe des centaines de photos de mariages organisés par notre équipe. Visitez-la ici : /galerie' },
  { keywords: ['contact', 'joindre', 'téléphone', 'email'], response: 'Vous pouvez nous contacter par email à contact@everafterevents.com, par téléphone au 01 23 45 67 89, ou via notre formulaire : /contact' },
];

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const faq of faqResponses) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.response;
    }
  }
  return 'Je suis là pour vous aider ! Pour toute question précise, n\'hésitez pas à nous contacter directement ou à consulter notre FAQ : /faq. Sinon, puis-je vous aider avec autre chose ? 😊';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = getResponse(input);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
      setTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return (
    <>
      {/* Toggle button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-champagne text-white shadow-gold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Ouvrir le chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-sm shadow-card-hover overflow-hidden"
          >
            {/* Header */}
            <div className="bg-charbon p-4 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-champagne/20 flex items-center justify-center">
                <Sparkles size={18} className="text-champagne" />
              </div>
              <div>
                <p className="text-sm font-medium">Eva — Assistant</p>
                <p className="text-[10px] text-white/50">Réponse instantanée</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-sm text-sm ${
                    msg.role === 'user' ? 'bg-champagne text-white' : 'bg-perle text-charbon'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-perle p-3 rounded-sm">
                    <Loader2 size={16} className="animate-spin text-charbon/40" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-perle p-4 flex gap-3">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="input-elegant flex-1 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button onClick={send} disabled={!input.trim()} className="btn-primary !p-2 disabled:opacity-40">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
