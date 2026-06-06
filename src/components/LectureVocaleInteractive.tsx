import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Mic, Volume2, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

// ==========================================
// 1. CONFIGURATION DES VOIX ET DES THÈMES
// ==========================================
const CONFIG_VOIX_THEMES: Record<string, { fr: string[]; en: string[]; pitch: number; rate: number }> = {
  'theme-default': {
    fr: ['hortense', 'google unissund', 'microsoft julie'],
    en: ['google us english', 'microsoft david', 'siri'],
    pitch: 1.0,
    rate: 0.95 
  },
  'theme-pink': {
    fr: ['amelie', 'amélie', 'google femme', 'clara'], 
    en: ['google uk english female', 'microsoft zira'],
    pitch: 1.05, 
    rate: 0.9 // Rythme plus posé pour l'univers Panthère Rose
  },
  'theme-hp': {
    fr: ['thomas', 'google homme', 'microsoft paul'],
    en: ['microsoft hazel', 'google uk english male'], // Immersion avec l'accent britannique !
    pitch: 0.9, 
    rate: 0.95
  },
  'theme-bikini': {
    fr: ['google unissund', 'paul'],
    en: ['google us english', 'microsoft david'],
    pitch: 1.15, // Ton plus enjoué pour Bikini Bottom
    rate: 1.0
  },
  'theme-hotel': {
    fr: ['stefan', 'google homme', 'microsoft paul'],
    en: ['google uk english male', 'microsoft david'],
    pitch: 0.85, // Gravité mystérieuse pour l'Hôtel Transylvanie
    rate: 0.9
  }
};

// ==========================================
// 2. LOGIQUE DE LECTURE MODÈLE (TEXT-TO-SPEECH)
// ==========================================
const lancerLectureVocale = (texte: string, langue: 'fr' | 'en', themeActuel: string) => {
  window.speechSynthesis.cancel(); // Stoppe toute lecture en cours

  const config = CONFIG_VOIX_THEMES[themeActuel] || CONFIG_VOIX_THEMES['theme-default'];
  const motsCles = langue === 'fr' ? config.fr : config.en;

  const utterance = new SpeechSynthesisUtterance(texte);
  utterance.lang = langue === 'fr' ? 'fr-FR' : 'en-US';
  utterance.pitch = config.pitch;
  utterance.rate = config.rate;

  const toutesLesVoix = window.speechSynthesis.getVoices();
  const voixLangue = toutesLesVoix.filter(v => v.lang.toLowerCase().startsWith(langue));

  let voixTrouvee = null;

  // Priorité 1 : Chercher une voix Premium/Natural correspondant aux mots-clés du thème
  const voixPremium = voixLangue.filter(v => 
    v.name.toLowerCase().includes('premium') || v.name.toLowerCase().includes('natural')
  );
  if (voixPremium.length > 0) {
    voixTrouvee = voixPremium.find(v => motsCles.some(mot => v.name.toLowerCase().includes(mot))) || voixPremium[0];
  }

  // Priorité 2 : Chercher dans les voix standards via les mots-clés du thème
  if (!voixTrouvee) {
    voixTrouvee = voixLangue.find(v => motsCles.some(mot => v.name.toLowerCase().includes(mot)));
  }

  if (voixTrouvee) utterance.voice = voixTrouvee;
  else if (voixLangue.length > 0) utterance.voice = voixLangue[0];

  window.speechSynthesis.speak(utterance);
};

// ==========================================
// 3. COMPOSANT PRINCIPAL INTERACTIF
// ==========================================
interface LectureVocaleProps {
  texteExemple?: string;
  lang?: 'fr' | 'en';
  currentTheme?: string;
  onEvaluationComplete?: (scoreMots: number, scoreSyllabes: number) => void;
}

export default function LectureVocaleInteractive({
  texteExemple = "Ce soir, la salle est sombre. Charlot porte un chapeau noir. Il marche comiquement et mange un gros gâteau.",
  lang = "fr",
  currentTheme = "theme-default",
  onEvaluationComplete
}: LectureVocaleProps) {
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [motsLus, setMotsLus] = useState(0);
  const [syllabesLues, setSyllabesLues] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  // Calculs des totaux cibles du texte d'origine
  const motsDuTexte = texteExemple.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()«»]/g, "").trim().split(/\s+/);
  const totalMots = motsDuTexte.length;

  const estimerTotalSyllabes = () => {
    return motsDuTexte.reduce((acc, mot) => {
      const voyelles = mot.match(/[aeiouyéèàùûâîôûëïü]+/g);
      return acc + (voyelles ? voyelles.length : 1);
    }, 0);
  };
  const totalSyllabes = estimerTotalSyllabes();

  // Écoute des résultats de la reconnaissance vocale pour mettre à jour les widgets
  useEffect(() => {
    if (transcript) {
      const motsPrononces = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()«»]/g, "").trim().split(/\s+/);
      
      // Calcul du score des mots reconnus
      let compteurMots = 0;
      motsDuTexte.forEach(mot => {
        if (motsPrononces.includes(mot)) compteurMots++;
      });
      
      setMotsLus(compteurMots);

      // Calcul au prorata pour les syllabes articulées
      const ratioSyllabes = totalSyllabes / totalMots;
      const calculSyllabes = Math.min(totalSyllabes, Math.round(compteurMots * ratioSyllabes));
      setSyllabesLues(calculSyllabes);

      // Callback optionnel pour remonter les notes au système de notation (ex: C1 / C5)
      if (onEvaluationComplete) {
        onEvaluationComplete(compteurMots, calculSyllabes);
      }
    }
  }, [transcript]);

  // Actions de l'enregistreur vocal
  const alternerEnregistrement = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      if (!SpeechRecognition) {
        alert("La reconnaissance vocale n'est pas supportée par votre navigateur. Veuillez utiliser Google Chrome ou Microsoft Edge.");
        return;
      }
      
      const rec = new SpeechRecognition();
      rec.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
      rec.continuous = true;
      rec.interimResults = false;

      rec.onstart = () => setIsRecording(true);
      rec.onend = () => setIsRecording(false);
      rec.onerror = () => setIsRecording(false);
      
      rec.onresult = (event: any) => {
        const resultatText = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTranscript(resultatText);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  const reinitialiserSession = () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setTranscript('');
    setMotsLus(0);
    setSyllabesLues(0);
    setIsRecording(false);
  };

  return (
    <div className="border-2 border-[var(--primary,##4f46e5)] rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-md space-y-6 max-w-2xl mx-auto transition-all">
      
      {/* En-tête Critères d'Évaluation */}
      <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-black uppercase text-[var(--primary,##4f46e5)] tracking-wide flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-rose-500 animate-pulse" /> 
          LECTURE VOCALE (Niveau Moyen)
        </h3>
        <div className="flex gap-2">
          <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-xl border border-indigo-200 shadow-sm">C1 / 5 PTS</span>
          <span className="text-[10px] font-black bg-teal-50 text-teal-700 px-2.5 py-1 rounded-xl border border-teal-200 shadow-sm">C5 / 3 PTS</span>
        </div>
      </div>

      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
        CONSIGNE : LIS CE TEXTE À HAUTE VOIX EN ENREGISTRANT TA VOIX.
      </p>

      {/* Barre d'Écoute du Modèle Thématique */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <span className="text-xs font-black text-slate-500 flex items-center gap-1.5">
          🎧 ENTRAÎNEMENT MODÈLE : 
          <span className="text-rose-500 uppercase font-black">{currentTheme.replace('theme-', '')}</span>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => lancerLectureVocale(texteExemple, lang, currentTheme)}
            className="w-9 h-9 flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white rounded-xl hover:scale-105 transition-transform shadow-md"
            title="Écouter la voix thématique"
          >
            <Play className="w-4 h-4 fill-white" />
          </button>
          <button
            onClick={() => window.speechSynthesis.cancel()}
            className="w-9 h-9 flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white rounded-xl hover:scale-105 transition-transform"
            title="Arrêter"
          >
            <Square className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Widgets de Scores Synchronisés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Widget Mots Lus */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm">
          <span className="text-2xl bg-white dark:bg-slate-800 p-2 rounded-xl shadow-inner">📄</span>
          <div>
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Mots Lus</h5>
            <p className="text-sm font-black text-slate-700 dark:text-white">
              <span className="text-indigo-600 dark:text-indigo-400 text-lg font-black">{motsLus}</span> / {totalMots}
            </p>
          </div>
        </div>

        {/* Widget Syllabes */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm">
          <span className="text-2xl bg-white dark:bg-slate-800 p-2 rounded-xl shadow-inner">〰️</span>
          <div>
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Syllabes</h5>
            <p className="text-sm font-black text-slate-700 dark:text-white">
              <span className="text-teal-600 dark:text-teal-400 text-lg font-black">{syllabesLues}</span> / {totalSyllabes}
            </p>
          </div>
        </div>

        {/* Étoiles ou Statut Dynamique */}
        <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-center text-xs font-bold">
          {isRecording ? (
            <span className="text-rose-500 font-black animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              ÉCOUTE ACTIVE...
            </span>
          ) : transcript ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> ANALYSE FAITE !
            </span>
          ) : (
            <span className="text-slate-400 italic flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> En attente...
            </span>
          )}
        </div>
      </div>

      {/* Cadre du Texte Modèle à lire */}
      <div className="p-6 bg-slate-50/70 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-center shadow-inner">
        <p className="font-serif italic text-xl tracking-wide text-slate-800 dark:text-slate-100 leading-relaxed selection:bg-rose-200">
          « {texteExemple} »
        </p>
      </div>

      {/* Zone d'Enregistrement Impulsionnelle et Reset */}
      <div className="flex flex-col items-center justify-center pt-2 space-y-3">
        <div className="flex items-center gap-4">
          <button
            onClick={alternerEnregistrement}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg ${
              isRecording 
                ? 'bg-slate-800 dark:bg-slate-700 ring-4 ring-rose-500/30' 
                : 'bg-rose-500 hover:bg-rose-600'
            }`}
          >
            {isRecording ? <Square className="w-6 h-6 fill-white" /> : <Mic className="w-6 h-6" />}
          </button>

          {transcript && (
            <button
              onClick={reinitialiserSession}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-transform hover:rotate-180 duration-500"
              title="Recommencer l'exercice"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {isRecording ? "Appuie sur le carré noir pour finir" : "Appuie sur le micro pour lire"}
        </span>
      </div>

    </div>
  );
}
