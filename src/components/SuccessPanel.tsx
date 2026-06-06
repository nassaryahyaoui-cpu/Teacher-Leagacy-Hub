import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Award, 
  BookOpen, 
  PenTool, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Sparkles, 
  Star, 
  Bookmark, 
  Volume2, 
  Info,
  Medal,
  Activity,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';

// Static Fiches reference structure or types to compute against.
interface Fiche {
  id: number;
  title: string;
  theme: string;
  vocab: string[];
  vocabOptions?: Record<string, string[]>;
  dictation?: {
    text: string;
    words: string[];
  };
}

interface SuccessPanelProps {
  scores: Record<string, { total: number; date: string }>;
  vocabAnswers: Record<string, string>;
  dictationAnswers: Record<string, string>;
  badges: string[];
  onAddBadge?: (badgeName: string) => void;
  showMascotMsg: (text: string) => void;
  fiches: Record<number, Fiche>;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: 'lecture' | 'dictee' | 'global';
  threshold: number;
  icon: string;
  color: string;
}

export const BADGE_STANDARDS: BadgeDefinition[] = [
  {
    id: 'lecteur_bronze',
    name: 'Plume de Bronze 🥉',
    description: 'Atteindre un total de 25 points en activités de Lecture et Vocabulaire.',
    category: 'lecture',
    threshold: 25,
    icon: '🥉',
    color: 'from-amber-100 to-amber-200 border-amber-300 text-amber-900'
  },
  {
    id: 'lecteur_argent',
    name: 'Plume d\'Argent 🥈',
    description: 'Atteindre un total de 75 points en activités de Lecture et Vocabulaire.',
    category: 'lecture',
    threshold: 75,
    icon: '🥈',
    color: 'from-slate-150 to-slate-300 border-slate-350 text-slate-800'
  },
  {
    id: 'lecteur_or',
    name: 'Plume d\'Or 🥇',
    description: 'Atteindre un total de 150 points en activités de Lecture et Vocabulaire.',
    category: 'lecture',
    threshold: 150,
    icon: '🥇',
    color: 'from-yellow-100 to-amber-250 border-yellow-350 text-amber-950 shadow-yellow-200/50'
  },
  {
    id: 'lecteur_legendaire',
    name: 'Sage de l\'Odyssée 👑',
    description: 'Atteindre 300 points de Lecture. Le maître absolu des textes de l\'école Kef.',
    category: 'lecture',
    threshold: 300,
    icon: '👑',
    color: 'from-purple-100 to-indigo-200 border-purple-350 text-indigo-950'
  },
  {
    id: 'dictee_bronze',
    name: 'Scribe Agile ✍️',
    description: 'Marquer 20 points de Dictée grâce à tes mots correctement orthographiés.',
    category: 'dictee',
    threshold: 20,
    icon: '✍️',
    color: 'from-orange-50 to-orange-100 border-orange-250 text-orange-950'
  },
  {
    id: 'dictee_argent',
    name: 'Ligueur des Lettres 📜',
    description: 'Parvenir à 60 points de Dictée accumulés. Quelle écriture soignée !',
    category: 'dictee',
    threshold: 60,
    icon: '📜',
    color: 'from-pink-50 to-rose-100 border-pink-250 text-pink-900'
  },
  {
    id: 'dictee_or',
    name: 'Virtuose de l\'Encre ✒️',
    description: 'Parvenir à 120 points de Dictée. Plus aucun piège phonétique ne t\'arrête !',
    category: 'dictee',
    threshold: 120,
    icon: '✒️',
    color: 'from-teal-50 to-emerald-100 border-teal-250 text-teal-900'
  },
  {
    id: 'dictee_legendaire',
    name: 'Orthographe Suprême 🏆',
    description: 'Parvenir à 250 points de Dictée. Tu écris comme un véritable écrivain de légende !',
    category: 'dictee',
    threshold: 250,
    icon: '🏆',
    color: 'from-yellow-200 via-amber-200 to-orange-200 border-amber-400 text-stone-900 shadow-md shadow-amber-300/30'
  },
  {
    id: 'odyssee_explorateur',
    name: 'Étoile de Jugurtha ✨',
    description: 'Avoir un score combiné (Lecture + Dictée) supérieur à 100 points.',
    category: 'global',
    threshold: 100,
    icon: '✨',
    color: 'from-blue-50 to-indigo-150 border-blue-250 text-indigo-950'
  },
  {
    id: 'odyssee_grandmaitre',
    name: 'Monarque des Mots 👑💎',
    description: 'Avoir un score combiné supérieur à 400 points dans toute l\'Odyssée.',
    category: 'global',
    threshold: 400,
    icon: '💎',
    color: 'from-violet-100 via-indigo-100 to-fuchsia-100 border-violet-300 text-purple-950 shadow-pink-200/50'
  }
];

export default function SuccessPanel({
  scores,
  vocabAnswers,
  dictationAnswers,
  badges,
  onAddBadge,
  showMascotMsg,
  fiches
}: SuccessPanelProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);

  // Calculate lecture score
  const lectureScoreData = useMemo(() => {
    let evaluationPoints = 0;
    let evalCount = 0;
    // 1) Evaluate scores stored
    Object.entries(scores).forEach(([_, s]) => {
      evaluationPoints += s.total || 0;
      evalCount++;
    });

    // 2) Vocab matches correct - each is worth 5 pts
    let vocabCorrectCount = 0;
    let vocabAttempted = 0;
    Object.values(fiches).forEach(f => {
      if (f.vocab && f.vocabOptions) {
        f.vocab.forEach(word => {
          const ansKey = `fiche_${f.id}_vocab_${word}`;
          const userVal = vocabAnswers[ansKey];
          if (userVal) {
            vocabAttempted++;
            if (userVal === f.vocabOptions?.[word]?.[0]) {
              vocabCorrectCount++;
            }
          }
        });
      }
    });

    const vocabPoints = vocabCorrectCount * 3; // 3 pts per correct vocabulary match
    const totalLecturePoints = evaluationPoints + vocabPoints;

    return {
      evalPoints: evaluationPoints,
      evalCount,
      vocabPoints,
      vocabCorrectCount,
      vocabAttempted,
      totalLecturePoints
    };
  }, [scores, vocabAnswers, fiches]);

  // Calculate dictée score
  const dicteeScoreData = useMemo(() => {
    let dictationCorrectCount = 0;
    let dictationTotalWords = 0;
    let completePerfectDictations = 0;
    let dictationsAttemptedCount = 0;

    Object.values(fiches).forEach(f => {
      if (f.dictation && f.dictation.words) {
        const words = f.dictation.words;
        const hasSubmitted = dictationAnswers[`submitted_${f.id}`] === 'true';
        if (hasSubmitted) {
          dictationsAttemptedCount++;
          let fichePerfect = true;
          let ficheCorrectWords = 0;

          words.forEach((correctWord, idx) => {
            const userVal = dictationAnswers[`fiche_${f.id}_dictation_${idx}`] || '';
            const isCorrect = userVal.toLowerCase().trim() === correctWord.toLowerCase().trim();
            if (isCorrect) {
              dictationCorrectCount++;
              ficheCorrectWords++;
            } else {
              fichePerfect = false;
            }
            dictationTotalWords++;
          });

          if (fichePerfect && words.length > 0) {
            completePerfectDictations++;
          }
        }
      }
    });

    // Scoring: 5 points per correct word, plus a 20 points bonus per perfect dictation completed
    const wordPoints = dictationCorrectCount * 5;
    const bonusPoints = completePerfectDictations * 20;
    const totalDicteePoints = wordPoints + bonusPoints;

    return {
      dictationCorrectCount,
      dictationTotalWords,
      completePerfectDictations,
      dictationsAttemptedCount,
      wordPoints,
      bonusPoints,
      totalDicteePoints
    };
  }, [dictationAnswers, fiches]);

  const globalTotalPoints = lectureScoreData.totalLecturePoints + dicteeScoreData.totalDicteePoints;

  // Track and auto-award badges to parent states on load or point change
  useEffect(() => {
    if (!onAddBadge) return;
    BADGE_STANDARDS.forEach(badge => {
      let isEligible = false;
      if (badge.category === 'lecture' && lectureScoreData.totalLecturePoints >= badge.threshold) {
        isEligible = true;
      } else if (badge.category === 'dictee' && dicteeScoreData.totalDicteePoints >= badge.threshold) {
        isEligible = true;
      } else if (badge.category === 'global' && globalTotalPoints >= badge.threshold) {
        isEligible = true;
      }

      if (isEligible && !badges.includes(badge.id)) {
        onAddBadge(badge.id);
        // Delight the student with the mascot notice
        showMascotMsg(`🎉 INCROYABLE ! Tu as débloqué un nouvel insigne légendaire : ${badge.name} ! Va voir ton armoire à trophées ! 🏆🚀`);
      }
    });
  }, [
    lectureScoreData.totalLecturePoints,
    dicteeScoreData.totalDicteePoints,
    globalTotalPoints,
    badges,
    onAddBadge,
    showMascotMsg
  ]);

  // Audio speech trigger for badge click
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    
    // Select friendly, natural French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoices = voices.filter(v => v.lang.toLowerCase().startsWith('fr'));
    if (frVoices.length > 0) {
      const friendlyVoice = frVoices.find(v => v.name.toLowerCase().includes('google') && v.lang.toLowerCase() === 'fr-fr') ||
                            frVoices.find(v => v.name.toLowerCase().includes('hortense')) ||
                            frVoices.find(v => v.name.toLowerCase().includes('thomas') || v.name.toLowerCase().includes('amelie') || v.name.toLowerCase().includes('siri')) ||
                            frVoices.find(v => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('premium')) ||
                            frVoices.find(v => v.name.toLowerCase().includes('google')) ||
                            frVoices.find(v => v.lang.toLowerCase() === 'fr-fr') ||
                            frVoices[0];
      if (friendlyVoice) {
        utterance.voice = friendlyVoice;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="success-badges-panel" className="space-y-8 select-none">
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 border-4 border-indigo-400 p-8 rounded-[36px] text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-indigo-950 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1.5 shadow-sm">
              <Trophy size={11} className="animate-spin-slow" /> Palmarès Académique
            </span>
            <h2 className="font-baloo text-3xl md:text-4.5xl font-black tracking-tight leading-tight">
              🏆 LE PANNEAU DES SUCCÈS
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-bold max-w-2xl leading-relaxed">
              Cumule tes points d'apprentissage en lisant attentivement les récits, en trouvant les termes insolites, et en dénichant tous les pièges d'orthographe dans tes dictées synchrone !
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shadow-inner flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg text-amber-950">
              <Trophy size={28} className="animate-[bounce_2s_infinite]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-300 block leading-tight">Score Cumulé Global</span>
              <span className="font-baloo text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200 block drop-shadow-sm mt-0.5">
                {globalTotalPoints} pts
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">
                {badges.filter(b => b !== 'Expert-1').length} insigne(s) acquis
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Primary stats boards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lecture & Vocab Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white border-4 border-indigo-200 p-6 rounded-[32px] shadow-lg flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3 border-indigo-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-baloo font-black text-indigo-950 text-lg leading-tight">Points de Lecture</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compréhension & Mots</p>
                </div>
              </div>
              <div className="bg-indigo-50 text-indigo-950 font-black text-lg px-3.5 py-1.5 rounded-2xl border border-indigo-100/50">
                {lectureScoreData.totalLecturePoints} <span className="text-[10px] text-indigo-500 font-bold uppercase">pts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Évaluations</span>
                <span className="font-baloo text-base font-black text-slate-800 block mt-0.5">
                  {lectureScoreData.evalCount} fiches résolues
                </span>
                <span className="text-[9px] font-bold text-indigo-500 uppercase mt-1 block">
                  ({lectureScoreData.evalPoints} pts académiques)
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Vocabulaire IA</span>
                <span className="font-baloo text-base font-black text-slate-800 block mt-0.5">
                  {lectureScoreData.vocabCorrectCount} synonymes trouvés
                </span>
                <span className="text-[9px] font-bold text-indigo-500 uppercase mt-1 block">
                  ({lectureScoreData.vocabPoints} pts de lexique)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
              <span>Niveau de Lecture</span>
              <span>{Math.min(100, Math.round((lectureScoreData.totalLecturePoints / 300) * 100))}% exploré</span>
            </div>
            <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (lectureScoreData.totalLecturePoints / 300) * 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-[9px] text-slate-400 font-bold italic">
              ✓ Atteins les caps de 25, 75, 150 et 300 pts pour débloquer les d’oratoires !
            </p>
          </div>
        </motion.div>

        {/* Dictée & Orthographe Card */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white border-4 border-amber-200 p-6 rounded-[32px] shadow-lg flex flex-col justify-between space-y-5"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3 border-amber-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <PenTool size={20} />
                </div>
                <div>
                  <h3 className="font-baloo font-black text-amber-950 text-lg leading-tight">Points de Dictée</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Écriture sans erreur</p>
                </div>
              </div>
              <div className="bg-amber-50 text-amber-950 font-black text-lg px-3.5 py-1.5 rounded-2xl border border-amber-100/50">
                {dicteeScoreData.totalDicteePoints} <span className="text-[10px] text-amber-600 font-bold uppercase">pts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Dictées terminées</span>
                <span className="font-baloo text-base font-black text-slate-800 block mt-0.5">
                  {dicteeScoreData.dictationsAttemptedCount} résolues
                </span>
                <span className="text-[9px] font-bold text-amber-600 uppercase mt-1 block">
                  ({dicteeScoreData.dictationCorrectCount} mots corrects)
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Bonus Dictée Parfaite</span>
                <span className="font-baloo text-base font-black text-slate-800 block mt-0.5">
                  {dicteeScoreData.completePerfectDictations} sans faute
                </span>
                <span className="text-[9px] font-bold text-amber-600 uppercase mt-1 block">
                  (+{dicteeScoreData.bonusPoints} bonus accumulés)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
              <span>Niveau de Dictée</span>
              <span>{Math.min(100, Math.round((dicteeScoreData.totalDicteePoints / 250) * 100))}% acquis</span>
            </div>
            <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (dicteeScoreData.totalDicteePoints / 250) * 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-[9px] text-slate-400 font-bold italic">
              ✓ Débloque de l’or en atteignant 20, 60, 120 et 250 points d'orthographe !
            </p>
          </div>
        </motion.div>

      </div>

      {/* Grid of unlockable Achievements */}
      <div className="space-y-4">
        <div>
          <h3 className="font-baloo text-2.5xl font-black text-indigo-950 flex items-center gap-2">
            🏅 ARMOIRE PERSONNELLE DES INSIGNES
          </h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
            Clique sur n’importe quel insigne pour entendre les encouragements de M. YAHYAOUI ou lire l’explication !
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {BADGE_STANDARDS.map((badge, idx) => {
            // Check if earned
            let currentPoints = 0;
            let targetPoints = badge.threshold;
            let isUnlocked = false;

            if (badge.category === 'lecture') {
              currentPoints = lectureScoreData.totalLecturePoints;
              isUnlocked = currentPoints >= targetPoints;
            } else if (badge.category === 'dictee') {
              currentPoints = dicteeScoreData.totalDicteePoints;
              isUnlocked = currentPoints >= targetPoints;
            } else {
              currentPoints = globalTotalPoints;
              isUnlocked = currentPoints >= targetPoints;
            }

            const isAcquired = isUnlocked || badges.includes(badge.id);
            const progressPercent = Math.min(100, Math.round((currentPoints / targetPoints) * 100));

            return (
              <motion.button
                key={badge.id}
                onClick={() => {
                  setSelectedBadge(badge);
                  const statusMsg = isAcquired 
                    ? `Félicitations, tu as débloqué l'insigne ${badge.name}! Un travail de titan !`
                    : `Cet insigne ${badge.name} est verrouillé. Tu as accumulé ${currentPoints} sur ${targetPoints} points nécessaires pour l'obtenir.`;
                  
                  speakText(statusMsg);
                  showMascotMsg(statusMsg);
                }}
                className={`p-5 rounded-3xl border-4 flex flex-col items-center justify-between text-center transition-all cursor-pointer relative overflow-hidden h-60 hover:shadow-lg hover:scale-102 ${
                  isAcquired 
                    ? `bg-gradient-to-b ${badge.color}` 
                    : 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60'
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Ribbon label */}
                <div className="absolute top-2.5 right-3 text-[9px] font-black uppercase">
                  {isAcquired ? (
                    <span className="text-emerald-700 bg-emerald-100/75 py-0.5 px-2 rounded-full border border-emerald-300">Débloqué</span>
                  ) : (
                    <span className="text-slate-500 bg-slate-200/50 p-1 rounded-full"><Lock size={10} /></span>
                  )}
                </div>

                {/* Big emoji emblem */}
                <div className="flex items-center justify-center pt-4">
                  <span className={`text-[4.5rem] select-none ${isAcquired ? 'animate-[pulse_4s_infinite]' : 'filter grayscale opacity-40'}`}>
                    {badge.icon}
                  </span>
                </div>

                {/* Info and thresholds */}
                <div className="w-full space-y-1">
                  <h4 className="font-baloo text-xs font-black text-slate-800 uppercase tracking-tight line-clamp-2">
                    {badge.name}
                  </h4>
                  
                  {/* Miniature progress bar */}
                  <div className="w-full bg-slate-100/80 h-1.5 rounded-full overflow-hidden border border-slate-200/40 mt-1">
                    <div 
                      className={`h-full ${isAcquired ? 'bg-emerald-500' : 'bg-indigo-300'}`} 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase px-0.5 pt-0.5 leading-none">
                    <span>{badge.category}</span>
                    <span>{currentPoints.toFixed(0)}/{targetPoints} pts</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Interactive Selected Badge Modal Detail */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] border-4 border-indigo-950 p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>

              <div className="text-7xl select-none animate-bounce pt-2">
                {selectedBadge.icon}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-55 px-3 py-1 rounded-full border border-indigo-200 inline-block">
                  Catégorie : {selectedBadge.category}
                </span>
                <h3 className="font-baloo text-2.5xl font-black text-slate-900 leading-tight">
                  {selectedBadge.name}
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed px-2">
                  {selectedBadge.description}
                </p>
              </div>

              {/* Dynamic stats within modal */}
              <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-100 text-left">
                <span className="text-[9px] font-black uppercase text-slate-400 block tracking-widest leading-none">Condition de déblocage</span>
                <p className="text-xs font-bold text-slate-700 mt-1">
                  Atteindre <strong className="text-indigo-600">{selectedBadge.threshold} points</strong> cumulés dans les activités scolaires de type <strong className="uppercase">{selectedBadge.category}</strong>.
                </p>
                
                {/* Score actual status */}
                <div className="mt-3 pt-3 border-t border-dashed border-slate-250 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black uppercase text-slate-400 block">Ton Statut Actuel</span>
                    <span className="font-baloo text-sm font-black text-slate-800">
                      {selectedBadge.category === 'lecture' 
                        ? `${lectureScoreData.totalLecturePoints} pts de lecture` 
                        : selectedBadge.category === 'dictee' 
                          ? `${dicteeScoreData.totalDicteePoints} pts de dictée`
                          : `${globalTotalPoints} points combinés`
                      }
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    (selectedBadge.category === 'lecture' && lectureScoreData.totalLecturePoints >= selectedBadge.threshold) ||
                    (selectedBadge.category === 'dictee' && dicteeScoreData.totalDicteePoints >= selectedBadge.threshold) ||
                    (selectedBadge.category === 'global' && globalTotalPoints >= selectedBadge.threshold) ||
                    badges.includes(selectedBadge.id)
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                  }`}>
                    {(selectedBadge.category === 'lecture' && lectureScoreData.totalLecturePoints >= selectedBadge.threshold) ||
                    (selectedBadge.category === 'dictee' && dicteeScoreData.totalDicteePoints >= selectedBadge.threshold) ||
                    (selectedBadge.category === 'global' && globalTotalPoints >= selectedBadge.threshold) ||
                    badges.includes(selectedBadge.id)
                      ? '✓ Acquis'
                      : '🔒 En cours'
                    }
                  </span>
                </div>
              </div>

              {/* Speak button option */}
              <button 
                onClick={() => speakText(selectedBadge.description)}
                className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 font-black text-xs text-indigo-900 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer border border-indigo-200/50"
              >
                <Volume2 size={16} /> Écouter les exigences de l'expert 🎧
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick visual encouragement checklist */}
      <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-baloo text-lg font-black text-slate-800 flex items-center gap-1.5 leading-none">
            💡 Astuce de Réussite de Nabil
          </h4>
          <p className="text-[11px] text-slate-500 font-bold max-w-xl leading-relaxed">
            Pour débloquer rapidement les insignes légendaires d'orthographe et de lecture, pense à réviser quotidiennement tes fiches d'étude, à consulter le dictionnaire de synonymes IA, et à t'entraîner sur les dictées interactives sans chrono ! Chaque mot juste s'additionne au tableau.
          </p>
        </div>

        <button 
          onClick={() => {
            setSelectedBadge(null);
            speakText("Révise sérieusement, complète tes dictées et tes evaluations académiques pour amasser un maximum de points et garnir ton armoire à symboles d'honneur ! M. YAHYAOUI veille sur ton progrès !");
            showMascotMsg("Révise tous les jours pour décrocher la fameuse Plume d'Or ! 🥇");
          }}
          className="px-6 py-3 bg-[var(--primary)] text-white hover:bg-indigo-700 flex items-center gap-2 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all outline-none shrink-0 shadow-md shadow-[var(--primary)]/20"
        >
          <Volume2 size={15} /> Consignes Vocales de M. YAHYAOUI 🎧
        </button>
      </div>

    </div>
  );
}
