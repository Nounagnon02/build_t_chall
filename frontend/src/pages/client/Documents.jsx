import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientAPI } from '../../services/api';
import LoadingScreen from '../../components/common/LoadingScreen';

export default function ClientDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = () => clientAPI.documents.list().then((res) => setDocs(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Fichier trop volumineux (max 10MB)'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      await clientAPI.uploadDocument(fd);
      toast.success('Document uploadé');
      load();
    } catch { toast.error('Erreur lors de l\'upload'); }
    finally { setUploading(false); }
  };

  const remove = async (id) => {
    try { await clientAPI.deleteDocument(id); toast.success('Document supprimé'); load(); }
    catch { toast.error('Erreur'); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Helmet><title>Documents — Ever After Events</title></Helmet>
      <section className="section-padding bg-ivory min-h-screen pt-28">
        <div className="section-container max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl text-charbon mb-2">Documents</h1>
              <p className="text-sm text-charbon/50">Gérez vos documents et contrats.</p>
            </div>
            <label className="btn-primary cursor-pointer flex items-center gap-2">
              <Upload size={16} />
              {uploading ? 'Upload...' : 'Uploader'}
              <input type="file" className="hidden" onChange={upload} disabled={uploading} />
            </label>
          </div>

          <div className="space-y-3">
            {docs.map((doc) => (
              <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white p-5 rounded-sm shadow-card flex items-center gap-4"
              >
                <FileText size={20} className="text-champagne shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-charbon">{doc.title}</p>
                  <p className="text-xs text-charbon/40">{doc.category} · {doc.file_type}</p>
                </div>
                <div className="flex gap-2">
                  {doc.file_url && <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-perle rounded-full"><Download size={16} className="text-charbon/40" /></a>}
                  <button onClick={() => remove(doc.id)} className="p-2 hover:bg-red-50 rounded-full"><Trash2 size={16} className="text-charbon/20 hover:text-red-400" /></button>
                </div>
              </motion.div>
            ))}
          </div>

          {docs.length === 0 && <p className="text-center text-charbon/40 py-12">Aucun document pour le moment.</p>}
        </div>
      </section>
    </>
  );
}
