import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function ClientMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const load = () => clientAPI.messages.list().then((res) => setMessages(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!content.trim()) return;
    setSending(true);
    try {
      await clientAPI.sendMessage({ content });
      setContent('');
      toast.success('Message envoyé');
      load();
    } catch { toast.error('Erreur'); }
    finally { setSending(false); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet><title>Messagerie — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-3xl">
          <h1 className="font-serif text-2xl text-charbon mb-2">Messagerie</h1>
          <p className="text-sm text-charbon/50 mb-8">Échangez avec votre wedding planner.</p>

          <div className="bg-white rounded-sm shadow-card">
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.is_from_admin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-sm ${msg.is_from_admin ? 'bg-perle text-charbon' : 'bg-champagne text-white'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-[10px] mt-1 opacity-60">{new Date(msg.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-perle p-4 flex gap-3">
              <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Votre message..." className="input-elegant flex-1"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())} />
              <button onClick={send} disabled={sending || !content.trim()} className="btn-primary !py-2 disabled:opacity-40">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
