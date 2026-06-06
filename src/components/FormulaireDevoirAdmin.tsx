import React, { useState } from 'react';

export const FormulaireDevoirAdmin = ({ onPublierDevoir }: { onPublierDevoir: (devoir: any) => void }) => {
  const [titre, setTitre] = useState('');
  const [consigne, setConsigne] = useState('');
  const [niveau, setNiveau] = useState<'soutien' | 'standard' | 'defi'>('standard');
  const [documentLink, setDocumentLink] = useState('');

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !consigne) return;

    const nouveauDevoir = {
      id: `dev-${Date.now()}`,
      titre,
      consigne,
      typeObjectif: niveau,
      documentUrl: documentLink || undefined,
      datePublication: new Date().toLocaleDateString('fr-FR'),
    };

    onPublierDevoir(nouveauDevoir);
    // Réinitialisation
    setTitre('');
    setConsigne('');
    setDocumentLink('');
  };

  return (
    <form onSubmit={soumettre} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 max-w-xl mx-auto my-6 text-left">
      <h3 className="text-sm font-black text-white uppercase tracking-wider text-center border-b border-slate-800 pb-3">
        📢 Déployer un Devoir Différencié
      </h3>

      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase">Titre de l'activité</label>
        <input 
          type="text" value={titre} onChange={e => setTitre(e.target.value)}
          placeholder="Ex: Dictée de syllabes / Production écrite : La tempête"
          className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* 🎯 LE FILTRE DE DIFFÉRENCIATION */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase">Groupe d'élèves visé (Pédagogie APC)</label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <button
            type="button" onClick={() => setNiveau('soutien')}
            className={`py-2 text-[11px] font-black uppercase rounded-xl border transition-all ${niveau === 'soutien' ? 'bg-rose-950 text-rose-400 border-rose-700 shadow-lg' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            🆘 Soutien & Consolidation
          </button>
          <button
            type="button" onClick={() => setNiveau('standard')}
            className={`py-2 text-[11px] font-black uppercase rounded-xl border transition-all ${niveau === 'standard' ? 'bg-indigo-950 text-indigo-400 border-indigo-700 shadow-lg' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            📘 Niveau Standard
          </button>
          <button
            type="button" onClick={() => setNiveau('defi')}
            className={`py-2 text-[11px] font-black uppercase rounded-xl border transition-all ${niveau === 'defi' ? 'bg-amber-950 text-amber-400 border-amber-700 shadow-lg' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
          >
            🚀 Lever un Défi (Avancé)
          </button>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase">Consignes de travail</label>
        <textarea 
          rows={3} value={consigne} onChange={e => setConsigne(e.target.value)}
          placeholder="Rédigez les instructions claires ici..."
          className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase">Lien du document ou de l'image (Optionnel)</label>
        <input 
          type="text" value={documentLink} onChange={e => setDocumentLink(e.target.value)}
          placeholder="URL de l'exercice ou de l'illustration"
          className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-emerald-950/20">
        🚀 Envoyer aux élèves concernés
      </button>
    </form>
  );
};
