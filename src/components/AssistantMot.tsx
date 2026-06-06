import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Volume2, Bookmark, BookmarkCheck, Brain, Loader2, BookOpen } from 'lucide-react';
import { findComplexWordInfoLocal } from '../data/complexWordsData';

export interface AssistantWordData {
  word: string;
  definition: string;
  example: string;
  synonyms?: string[];
}

interface AssistantMotProps {
  isOpen: boolean;
  onClose: () => void;
  word: string | null;
  wordInfo: AssistantWordData | null;
  isLoading: boolean;
  onAddWordToLexicon: (word: string, definition: string, example: string) => void;
  isSavedInLexicon: boolean;
  onLookUpWord: (word: string) => void;
}

export const AssistantMot: React.FC<AssistantMotProps> = ({
  isOpen,
  onClose,
  word,
  wordInfo,
  isLoading,
  onAddWordToLexicon,
  isSavedInLexicon,
  onLookUpWord,
}) => {

  const handlePronounce = () => {
    if (!word) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "fr-FR";
      utterance.rate = 0.85; // Slightly slower for clear dictation/comprehension
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-[100] no-print"
          />

          {/* Sliding Right Sheet Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            id="assistant_mot_panel"
            className="fixed top-0 right-0 h-full w-[360px] sm:w-[410px] w-full bg-white shadow-2xl border-l border-indigo-100 z-[101] flex flex-col font-sans text-slate-800 no-print"
          >
            {/* Top Sheet Header */}
            <div className="p-4 border-b border-indigo-50 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Brain size={18} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-baloo text-base font-black text-indigo-700 tracking-wide">Assistant Mot</h3>
                  <p className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Ton dictionnaire complice 🚀</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-indigo-100/50 rounded-xl transition-all duration-200 text-indigo-550 shadow-sm border border-indigo-100 bg-white hover:scale-105"
                title="Fermer l'assistant"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content Shell */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoading ? (
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="font-baloo text-xs font-bold text-indigo-500 animate-pulse uppercase tracking-wider">
                    Recherche magique en cours... ✨
                  </p>
                </div>
              ) : wordInfo ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Word title and TTS control */}
                  <div className="bg-gradient-to-r from-purple-50/20 via-indigo-50/10 to-transparent p-4 rounded-3xl border border-indigo-50/50 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-baloo font-black text-indigo-900 tracking-tight lowercase first-letter:uppercase">
                        {wordInfo.word}
                      </h2>
                      <span className="inline-block mt-1 text-[9px] font-black uppercase bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        Mot complexe 📚
                      </span>
                    </div>

                    {/* Speech Vocal Trigger */}
                    <button
                      onClick={handlePronounce}
                      className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all shadow-md active:scale-95 group focus:outline-none"
                      title="Écouter la prononciation"
                    >
                      <Volume2 size={18} className="group-hover:scale-115 transition-transform" />
                    </button>
                  </div>

                  {/* Definition Block */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500 tracking-widest font-mono">
                      <Sparkles size={12} className="text-indigo-500" />
                      Signification
                    </div>
                    <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-3xl text-xs sm:text-sm font-medium leading-relaxed text-slate-700 font-serif">
                      {wordInfo.definition}
                    </div>
                  </div>

                  {/* Illustrative Example Block */}
                  {wordInfo.example && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500 tracking-widest font-mono">
                        <BookOpen size={12} className="text-pink-500" />
                        Exemple d'utilisation
                      </div>
                      <div className="bg-pink-50/25 border border-pink-100/50 p-4 rounded-3xl text-xs sm:text-sm italic text-pink-900/90 leading-relaxed pl-5 relative before:content-['«'] before:absolute before:left-2 before:top-2 before:text-2xl before:text-pink-300 before:font-serif">
                        {wordInfo.example}
                      </div>
                    </div>
                  )}

                  {/* Clickable Synonyms Pill Container */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-purple-600 tracking-widest font-mono">
                      <Sparkles size={12} className="text-purple-600" />
                      Synonymes (mots équivalents)
                    </div>
                    {wordInfo.synonyms && wordInfo.synonyms.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {wordInfo.synonyms.map((syn, idx) => (
                          <button
                            key={idx}
                            onClick={() => onLookUpWord(syn)}
                            className="px-3.5 py-2 text-xs font-black rounded-2xl bg-purple-50 text-purple-700 border border-purple-150 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all active:scale-95 text-left capitalize shadow-sm flex items-center gap-1.5 font-baloo cursor-pointer"
                          >
                            <span>🌀</span> {syn}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-bold italic p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        Aucun synonyme préenregistré. Mais tu peux explorer d'autres mots insolites ! 😊
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-3xl mb-2">💡</span>
                  <p className="text-xs font-bold text-slate-400 leading-normal">
                    Survole n'importe quel mot survolé en violet pour voir son sens s'afficher ici magiquement !
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Panel Actions Bar */}
            {wordInfo && !isLoading && (
              <div className="p-4 border-t border-indigo-50 bg-slate-50 flex items-center justify-between shrink-0">
                {isSavedInLexicon ? (
                  <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-baloo font-bold text-xs select-none">
                    <BookmarkCheck size={16} className="text-emerald-600" />
                    Ajouté au Lexique Perso ! 🌟
                  </div>
                ) : (
                  <button
                    onClick={() => onAddWordToLexicon(wordInfo.word, wordInfo.definition, wordInfo.example)}
                    className="w-full py-3 px-4 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 bg-indigo-600 hover:bg-indigo-700 text-white font-baloo font-black text-xs uppercase tracking-widest rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Bookmark size={15} />
                    Ajouter à mes mots persos ⭐
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
