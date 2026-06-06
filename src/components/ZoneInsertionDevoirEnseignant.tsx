import React, { useState } from 'react';

export const ZoneInsertionDevoirEnseignant = ({ onSauvegarder }: { onSauvegarder: (data: any) => void }) => {
  const [titreTask, setTitreTask] = useState('');
  const [texteSupport, setTexteSupport] = useState('');
  const [lienMedia, setLienMedia] = useState('');
  const [groupeCible, setGroupeCible] = useState<'soutien' | 'standard' | 'defi'>('standard');

  const handlePublish = () => {
    if (!titreTask || !texteSupport) return;
    onSauvegarder({ titreTask, texteSupport, lienMedia, groupeCible });
    // Reset inputs
    setTitreTask('');
    setTexteSupport('');
    setLienMedia('');
  };

  return (
    <div className="w-full bg-white border-2 border-pink-200 rounded-3xl p-6 shadow-xl shadow-pink-100/40 text-left space-y-4 animate-fadeIn">
      {/* En-tête du Panneau */}
      <div className="flex justify-between items-center border-b border-pink-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
            Espace Concepteur : Insérer un Devoir ou une Consigne
          </h3>
        </div>
        {/* Sélecteur de niveau APC */}
        <select 
          value={groupeCible} 
          onChange={(e) => setGroupeCible(e.target.value as any)}
          className="text-[11px] font-black uppercase bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1 rounded-xl focus:outline-none"
        >
          <option value="soutien">🆘 Niveau Soutien / Aide</option>
          <option value="standard">📘 Niveau Standard</option>
          <option value="defi">🚀 Niveau Défi / Avancé</option>
        </select>
      </div>

      {/* Formulaire Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonne Gauche : Textes */}
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Titre du devoir ou de la révision</label>
            <input 
              type="text"
              value={titreTask}
              onChange={(e) => setTitreTask(e.target.value)}
              placeholder="Ex : Exercice d'orthographe - Les accords"
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Insérer un texte (Facultatif / Support d'évaluation)</label>
            <textarea 
              rows={4}
              value={texteSupport}
              onChange={(e) => setTexteSupport(e.target.value)}
              placeholder="Écris ici les questions à poser aux élèves ou le texte littéraire d'appui..."
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Colonne Droite : Médias & Liens externes */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Lien du document joint (Image, PDF, Capsule Audio)</label>
            <div className="mt-1 flex gap-2">
              <span className="bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-500 flex items-center">🔗</span>
              <input 
                type="text"
                value={lienMedia}
                onChange={(e) => setLienMedia(e.target.value)}
                placeholder="https://mon-stockage-ecole.tn/fiche1.png"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-pink-500"
              />
            </div>
            <p className="text-[9px] text-slate-400 mt-1 italic">Vous pouvez coller le lien d'une image d'appui pour étayer le niveau Soutien.</p>
          </div>

          {/* Aperçu Dynamique de la fiche insérée */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-[10px] font-mono h-24 overflow-hidden flex flex-col justify-center items-center">
            {lienMedia ? (
              <p className="text-emerald-400 font-bold">🟢 Média lié détecté et prêt à être diffusé</p>
            ) : (
              <p className="text-center">📷 Aucun document visuel lié<br/><span className="text-[9px] text-slate-600">(Affichage texte seul)</span></p>
            )}
          </div>

          {/* Bouton de déploiement instantané */}
          <button
            onClick={handlePublish}
            className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-transform active:scale-98"
          >
            🚀 Déployer la fiche sur les tablettes élèves
          </button>
        </div>
      </div>
    </div>
  );
};
