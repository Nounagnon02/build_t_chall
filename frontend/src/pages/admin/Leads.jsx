import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ClipboardList, Mail, Phone, MessageSquare, Calendar, CheckCircle, XCircle, ExternalLink, Sparkles, Image as ImageIcon, Settings, Calculator } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';
import { toast } from 'sonner';

const STATUSES = [
  { value: 'new', label: 'Nouveau', color: 'bg-champagne/20 text-champagne' },
  { value: 'contacted', label: 'Contacté', color: 'bg-blue-100 text-blue-600' },
  { value: 'closed', label: 'Fermé', color: 'bg-charbon/10 text-charbon/40' },
];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchLeads = () => {
    setLoading(true);
    adminAPI.projectLeads.list().then((res) => {
      setLeads(res.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await adminAPI.projectLeads.updateStatus(id, { status });
      toast.success(`Statut mis à jour : ${status === 'contacted' ? 'Contacté' : status === 'closed' ? 'Fermé' : 'Nouveau'}`);
      fetchLeads();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet><title>Projets reçus — Administration</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-charbon">Projets reçus</h1>
              <p className="text-sm text-charbon/50">Tous les leads issus du parcours « Mon Projet »</p>
            </div>
            <button onClick={fetchLeads} className="text-xs text-charbon/40 hover:text-charbon transition-colors">
              Actualiser
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-sm shadow-card">
              <ClipboardList size={40} className="mx-auto text-charbon/20 mb-4" />
              <p className="text-lg text-charbon/40">Aucun projet reçu pour le moment.</p>
              <p className="text-sm text-charbon/30">Les projets apparaîtront ici quand des clients rempliront le parcours « Mon Projet ».</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* List */}
              <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {leads.map((lead) => (
                  <motion.button key={lead.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelected(lead)}
                    className={`w-full text-left p-4 rounded-sm border transition-all ${
                      selected?.id === lead.id ? 'border-champagne bg-champagne/5' : 'border-perle bg-white hover:border-champagne/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm text-charbon">{lead.first_name} {lead.last_name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUSES.find(s => s.value === lead.status)?.color}`}>
                        {STATUSES.find(s => s.value === lead.status)?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charbon/40 mb-1">
                      <span className="flex items-center gap-1"><Mail size={10} /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>
                    </div>
                    <p className="text-[10px] text-charbon/30">{new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </motion.button>
                ))}
              </div>

              {/* Detail */}
              <div className="lg:col-span-2 bg-white rounded-sm shadow-card p-6 min-h-[400px]">
                {selected ? (
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="font-serif text-xl text-charbon">{selected.first_name} {selected.last_name}</h2>
                        <p className="text-xs text-charbon/40">{new Date(selected.created_at).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
                      </div>
                      <div className="flex gap-2">
                        {STATUSES.map((s) => (
                          <button key={s.value} onClick={() => updateStatus(selected.id, s.value)}
                            disabled={updating || selected.status === s.value}
                            className={`text-xs px-3 py-1.5 rounded-sm border transition-all ${
                              selected.status === s.value
                                ? s.color + ' border-current'
                                : 'border-perle text-charbon/30 hover:border-charbon/30'
                            }`}
                          >{s.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex gap-4 mb-6">
                      <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-xs text-charbon/50 hover:text-champagne transition-colors">
                        <Mail size={14} /> {selected.email}
                      </a>
                      <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-charbon/50 hover:text-champagne transition-colors">
                        <Phone size={14} /> {selected.phone} <ExternalLink size={10} />
                      </a>
                    </div>

                    {selected.notes && (
                      <div className="mb-6 bg-ivory p-4 rounded-sm">
                        <p className="text-xs text-charbon/50 mb-1">Message du client :</p>
                        <p className="text-sm text-charbon">{selected.notes}</p>
                      </div>
                    )}

                    {/* Data sections */}
                    <div className="grid grid-cols-2 gap-4">
                      {selected.quiz_style && (
                        <div className="bg-ivory/50 p-4 rounded-sm">
                          <h4 className="flex items-center gap-2 text-sm font-medium text-charbon mb-2">
                            <Sparkles size={14} className="text-champagne" /> Quiz
                          </h4>
                          <p className="text-xs text-champagne mb-1">Style : <span className="font-medium">{selected.quiz_style}</span></p>
                          {selected.quiz_answers && (
                            <div className="text-[10px] text-charbon/40 space-y-0.5">
                              {Object.entries(selected.quiz_answers).map(([k, v]) => (
                                <p key={k}>{k} : {v}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {selected.moodboard_images?.length > 0 && (
                        <div className="bg-ivory/50 p-4 rounded-sm">
                          <h4 className="flex items-center gap-2 text-sm font-medium text-charbon mb-2">
                            <ImageIcon size={14} className="text-champagne" /> Moodboard
                          </h4>
                          <div className="grid grid-cols-3 gap-1">
                            {selected.moodboard_images.map((img, i) => (
                              <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                                <img src={img.url} alt={img.caption || ''} className="w-full aspect-square object-cover rounded-sm" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {selected.configurateur_config && (
                        <div className="bg-ivory/50 p-4 rounded-sm">
                          <h4 className="flex items-center gap-2 text-sm font-medium text-charbon mb-2">
                            <Settings size={14} className="text-champagne" /> Configuration
                          </h4>
                          <div className="text-xs text-charbon/60 space-y-1">
                            {selected.configurateur_config.style && <p>Style : {selected.configurateur_config.style}</p>}
                            {selected.configurateur_config.ambiance && <p>Ambiance : {selected.configurateur_config.ambiance}</p>}
                            {selected.configurateur_config.colors?.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {selected.configurateur_config.colors.map((c, i) => (
                                  <div key={i} className="w-5 h-5 rounded-full border" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {selected.budget_data && (
                        <div className="bg-ivory/50 p-4 rounded-sm">
                          <h4 className="flex items-center gap-2 text-sm font-medium text-charbon mb-2">
                            <Calculator size={14} className="text-champagne" /> Budget
                          </h4>
                          <div className="text-xs text-charbon/60 space-y-1">
                            <p>Budget : {selected.budget_data.total?.toLocaleString('fr-FR')} FCFA</p>
                            <p>Invités : {selected.budget_data.guests}</p>
                            <p>Région : {selected.budget_data.region}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {!selected.quiz_style && !selected.moodboard_images?.length && !selected.configurateur_config && !selected.budget_data && (
                      <div className="text-center py-8">
                        <p className="text-sm text-charbon/30">Ce client a ignoré toutes les étapes.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <ClipboardList size={36} className="text-charbon/20 mb-3" />
                    <p className="text-sm text-charbon/40">Sélectionnez un projet pour voir les détails.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
