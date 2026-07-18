import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { contactAPI } from '../../services/api';

const INITIAL_FORM = {
  first_name: '',
  email: '',
  phone: '',
  event_type: '',
  guest_count: '',
  event_date: '',
  budget_range: '',
  service_type: '',
  message: '',
  source: '',
  venue: '',
};

export default function ContactForm({ variant = 'flat', step = 1, onStepChange }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...INITIAL_FORM });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const resetForm = () => {
    setForm({ ...INITIAL_FORM });
    if (onStepChange) onStepChange(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success('Message envoye ! Nous vous repondrons sous 24h ✨');
      resetForm();
    } catch {
      toast.error('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 1) return form.first_name && form.email;
    if (step === 2) return form.event_type;
    return true;
  };

  /* ---- Step content ---- */

  const StepInfo = () => (
    <div className="space-y-5">
      <h3 className="font-serif text-xl text-charbon mb-2">Vos informations</h3>
      <input className="input-elegant" placeholder="Prenom *" value={form.first_name}
        onChange={(e) => update('first_name', e.target.value)} required />
      <input className="input-elegant" type="email" placeholder="Email *" value={form.email}
        onChange={(e) => update('email', e.target.value)} required />
      <input className="input-elegant" type="tel" placeholder="Telephone" value={form.phone}
        onChange={(e) => update('phone', e.target.value)} />
      <select className="input-elegant" value={form.source || ''}
        onChange={(e) => update('source', e.target.value)}>
        <option value="">Comment nous avez-vous trouves ?</option>
        <option value="google">Google</option>
        <option value="instagram">Instagram</option>
        <option value="pinterest">Pinterest</option>
        <option value="bouche_a_oreille">Bouche-a-oreille</option>
        <option value="autre">Autre</option>
      </select>
    </div>
  );

  const StepEvent = () => (
    <div className="space-y-5">
      <h3 className="font-serif text-xl text-charbon mb-2">Votre projet</h3>
      <select className="input-elegant" value={form.event_type}
        onChange={(e) => update('event_type', e.target.value)} required>
        <option value="">Type d&apos;evenement *</option>
        <option value="mariage">Mariage</option>
        <option value="pacs">PACS</option>
        <option value="anniversaire">Anniversaire</option>
        <option value="entreprise">Evenement d&apos;entreprise</option>
        <option value="autre">Autre</option>
      </select>
      <input className="input-elegant" type="number" placeholder="Nombre d&apos;invites"
        value={form.guest_count} onChange={(e) => update('guest_count', e.target.value)} />
      <input className="input-elegant" type="text" placeholder="Lieu souhaite"
        value={form.venue || ''} onChange={(e) => update('venue', e.target.value)} />
    </div>
  );

  const StepDateBudget = () => (
    <div className="space-y-5">
      <h3 className="font-serif text-xl text-charbon mb-2">Date &amp; Budget</h3>
      <input className="input-elegant" type="date" placeholder="Date du mariage"
        value={form.event_date} onChange={(e) => update('event_date', e.target.value)} />
      <select className="input-elegant" value={form.budget_range}
        onChange={(e) => update('budget_range', e.target.value)}>
        <option value="">Budget indicatif</option>
        <option value="-10000">Moins de 10 000EUR</option>
        <option value="10000-20000">10 000EUR - 20 000EUR</option>
        <option value="20000-35000">20 000EUR - 35 000EUR</option>
        <option value="35000-50000">35 000EUR - 50 000EUR</option>
        <option value="50000+">Plus de 50 000EUR</option>
      </select>
      <select className="input-elegant" value={form.service_type}
        onChange={(e) => update('service_type', e.target.value)}>
        <option value="">Service souhaite</option>
        <option value="coordination_complete">Coordination Complete</option>
        <option value="organization_partielle">Organisation Partielle</option>
        <option value="decoration">Decoration &amp; Ambiance</option>
        <option value="sur_mesure">Sur-Mesure</option>
      </select>
    </div>
  );

  const StepMessage = () => (
    <div className="space-y-5">
      <h3 className="font-serif text-xl text-charbon mb-2">Votre message</h3>
      <textarea className="input-elegant min-h-[150px]" placeholder="Parlez-nous de votre projet, de vos envies, de vos reves..."
        value={form.message} onChange={(e) => update('message', e.target.value)} />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return <StepInfo />;
      case 2: return <StepEvent />;
      case 3: return <StepDateBudget />;
      case 4: return <StepMessage />;
      default: return null;
    }
  };

  /* ---- Wizard mode ---- */

  if (variant === 'wizard') {
    return (
      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 md:p-12 rounded-sm shadow-card">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s}
              className={`flex-1 h-1 rounded transition-colors ${s <= step ? 'bg-champagne' : 'bg-perle'}`}
            />
          ))}
        </div>

        {renderStep()}

        <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-perle">
          {step > 1 ? (
            <button type="button" onClick={() => onStepChange(step - 1)}
              className="text-sm text-charbon/50 hover:text-charbon transition-colors">
              &larr; Retour
            </button>
          ) : <div />}
          {step < 4 ? (
            <button type="button" onClick={() => onStepChange(step + 1)} disabled={!canNext()}
              className="btn-primary text-sm !py-3 disabled:opacity-40">
              Suivant &rarr;
            </button>
          ) : (
            <button type="submit" disabled={loading}
              className="btn-primary text-sm !py-3 flex items-center gap-2 disabled:opacity-40">
              {loading ? 'Envoi...' : <><Send size={16} /> Envoyer</>}
            </button>
          )}
        </div>
      </form>
    );
  }

  /* ---- Flat mode ---- */

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 rounded-sm shadow-card space-y-5">
      <input className="input-elegant w-full" placeholder="Prenom *" value={form.first_name}
        onChange={(e) => update('first_name', e.target.value)} required />
      <input className="input-elegant w-full" type="email" placeholder="Email *" value={form.email}
        onChange={(e) => update('email', e.target.value)} required />
      <input className="input-elegant w-full" type="tel" placeholder="Telephone" value={form.phone}
        onChange={(e) => update('phone', e.target.value)} />
      <select className="input-elegant w-full" value={form.event_type}
        onChange={(e) => update('event_type', e.target.value)}>
        <option value="">Type d&apos;evenement</option>
        <option value="mariage">Mariage</option>
        <option value="pacs">PACS</option>
        <option value="anniversaire">Anniversaire</option>
        <option value="entreprise">Evenement d&apos;entreprise</option>
      </select>
      <textarea className="input-elegant w-full min-h-[150px]" placeholder="Parlez-nous de votre projet..."
        value={form.message} onChange={(e) => update('message', e.target.value)} />
      <button type="submit" disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {loading ? 'Envoi...' : 'Envoyer le message'}
      </button>
    </form>
  );
}
