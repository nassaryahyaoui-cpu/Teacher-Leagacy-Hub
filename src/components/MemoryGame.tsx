import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Timer, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Volume2, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  Heart, 
  Zap, 
  ExternalLink,
  BookMarked
} from 'lucide-react';

interface PersonalWord {
  word: string;
  definition: string;
  example: string;
}

interface MemoryGameProps {
  personalLexicon: PersonalWord[];
  currentFicheWords: string[];
  vocabOptions?: Record<string, string[]>;
  showMascotMsg: (text: string) => void;
  speakWord: (word: string) => void;
  currentFicheTitle: string;
}

interface CardItem {
  id: string; // "w-index" for words, "d-index" for definitions
  type: 'word' | 'definition';
  pairId: string; // The word itself
  content: string; // The text to display
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame({
  personalLexicon,
  currentFicheWords,
  vocabOptions = {},
  showMascotMsg,
  speakWord,
  currentFicheTitle
}: MemoryGameProps) {
  // Gameplay States
  const [gameSource, setGameSource] = useState<'lexicon' | 'fiche'>(
    personalLexicon.length >= 4 ? 'lexicon' : 'fiche'
  );
  const [difficulty, setDifficulty] = useState<number>(4); // 4, 6, or 8 pairs
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'victory' | 'gameover'>('idle');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // indexes in `cards` array
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('jugurtha_memory_highscore') || '0');
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play audio synthesize chime
  const playChime = (type: 'match' | 'mismatch' | 'victory' | 'countdown' | 'tick' | 'click') => {
    if (!window.AudioContext && !(window as any).webkitAudioContext) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'match') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'mismatch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'victory') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(587.33, ctx.currentTime + 0.1); // D5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.4); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      } else if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch (_) {
      // Audio failures suppressed silently
    }
  };

  // Speaks using WebSpeech API for French pronunciation
  const speakStatement = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95; // Slightly slower for better readability
    
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

  // Get current active selectable pairs
  const availablePairs = useMemo(() => {
    const list: { word: string; definition: string }[] = [];

    if (gameSource === 'lexicon') {
      personalLexicon.forEach(item => {
        if (item.word && item.definition) {
          list.push({ word: item.word, definition: item.definition });
        }
      });
    } else {
      currentFicheWords.forEach(word => {
        const correctDef = vocabOptions[word]?.[0];
        if (correctDef) {
          list.push({ word, definition: correctDef });
        }
      });
    }

    return list;
  }, [gameSource, personalLexicon, currentFicheWords, vocabOptions]);

  // Handle start game
  const startGame = () => {
    if (availablePairs.length < 2) {
      showMascotMsg("⚠️ Il te faut au moins 2 mots enregistrés ou valides pour commencer à jouer !");
      return;
    }

    // Select random words up to difficulty limit
    const shuffledPairs = [...availablePairs].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffledPairs.slice(0, Math.min(difficulty, shuffledPairs.length));

    // Construct Cards
    const list: CardItem[] = [];
    selectedPairs.forEach((pair, idx) => {
      // Word Card
      list.push({
        id: `w-${idx}`,
        type: 'word',
        pairId: pair.word,
        content: pair.word,
        isFlipped: false,
        isMatched: false
      });
      // Definition Card
      list.push({
        id: `d-${idx}`,
        type: 'definition',
        pairId: pair.word,
        content: pair.definition,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle final deck
    const shuffledDeck = list.sort(() => Math.random() - 0.5);

    // Dynamic initial timer allocated depending on difficulty
    const gameDuration = selectedPairs.length * 15; // 15 seconds per pair

    setCards(shuffledDeck);
    setSelectedCards([]);
    setSecondsLeft(gameDuration);
    setScore(0);
    setAttempts(0);
    setCombo(0);
    setGameState('playing');
    playChime('victory');
    showMascotMsg(`🎮 Le jeu commence ! Tu as ${gameDuration} secondes pour associer les ${selectedPairs.length} paires ! ⚡🏽`);
  };

  // Timer loop effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState('gameover');
            playChime('mismatch');
            showMascotMsg("🔴 Mince, le temps s'est écoulé ! Ne te décourage pas, essaie encore une fois pour t'améliorer ! 💪");
            return 0;
          }
          if (prev <= 10) {
            playChime('tick');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Card click handler
  const handleCardClick = (index: number) => {
    if (gameState !== 'playing') return;
    if (selectedCards.length >= 2) return; // Wait during comparison
    if (cards[index].isFlipped || cards[index].isMatched) return;

    playChime('click');
    
    // Pronounce word if it's the word card
    if (cards[index].type === 'word') {
      speakWord(cards[index].content);
    }

    // Flip the clicked card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelection = [...selectedCards, index];
    setSelectedCards(newSelection);

    // If two cards are now flipped
    if (newSelection.length === 2) {
      const idx1 = newSelection[0];
      const idx2 = newSelection[1];
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      setAttempts(prev => prev + 1);

      // Check if they match: same pairId but different card types
      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // Matched!
        setTimeout(() => {
          const matchedDeck = cards.map((c, i) => {
            if (i === idx1 || i === idx2) {
              return { ...c, isMatched: true, isFlipped: true };
            }
            return c;
          });

          setCards(matchedDeck);
          setSelectedCards([]);

          // Sound effect + points
          playChime('match');
          const currentCombo = combo + 1;
          setCombo(currentCombo);
          
          // Points formula: 10 points * current combo
          const addedPoints = 10 * currentCombo;
          setScore(prev => prev + addedPoints);

          showMascotMsg(`🎉 Bravo ! Tu as associé "${card1.pairId}" à sa définition ! Combo x${currentCombo} (+${addedPoints} pts) ! 🔥`);

          // Check for victory
          const allMatched = matchedDeck.every(c => c.isMatched);
          if (allMatched) {
            clearInterval(timerRef.current!);
            
            // Score bonus for time remaining
            const timeBonus = secondsLeft * 2;
            const finalScore = score + addedPoints + timeBonus;
            setScore(finalScore);

            setGameState('victory');
            playChime('victory');

            // Save highscore
            if (finalScore > highScore) {
              setHighScore(finalScore);
              localStorage.setItem('jugurtha_memory_highscore', finalScore.toString());
            }

            speakStatement(`Excellent ! Tu as complété le jeu avec un score de ${finalScore} points. Félicitations !`);
            showMascotMsg(`🏆 INCROYABLE ! Tu as résolu le Memory avec succès ! Score final : ${finalScore} pts (avec un bonus temps de +${timeBonus} pts) ! 😍🏽`);
          }

        }, 600);

      } else {
        // Mismatch
        setTimeout(() => {
          const resetDeck = cards.map((c, i) => {
            if (i === idx1 || i === idx2) {
              return { ...c, isFlipped: false };
            }
            return c;
          });

          setCards(resetDeck);
          setSelectedCards([]);
          setCombo(0); // Reset combo
          playChime('mismatch');
        }, 1200);
      }
    }
  };

  return (
    <div id="lexicon-memory-game" className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-[40px] border-4 border-indigo-400 p-6 md:p-8 shadow-xl max-w-5xl mx-auto space-y-6 relative overflow-hidden">
      
      {/* Background aesthetics decoration */}
      <div className="absolute right-0 top-0 w-36 h-36 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-36 h-36 bg-purple-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-indigo-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Brain size={26} className="animate-pulse" />
          </div>
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block">
              ⏳ Mode de Jeu Chronométré
            </span>
            <h3 className="font-baloo font-black text-2xl text-indigo-950 flex items-center gap-1">
              🎮 L'Arène du Lexique : Mémoire ⚡
            </h3>
          </div>
        </div>

        {/* Highscore & Active Game Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-center shadow-sm">
            <span className="text-[8px] font-black uppercase text-amber-600 block leading-tight">Meilleur Score</span>
            <span className="font-baloo text-sm font-extrabold text-amber-700">{highScore} pts</span>
          </div>

          {gameState === 'playing' && (
            <div className="flex items-center gap-2">
              {/* Timer indicator */}
              <div className={`px-4 py-1.5 rounded-xl border font-baloo font-extrabold flex items-center gap-2 text-sm shadow-sm transition-colors ${
                secondsLeft <= 10 
                  ? 'bg-red-100 border-red-300 text-red-600 animate-[pulse_1s_infinite]' 
                  : 'bg-indigo-900 border-indigo-900 text-white'
              }`}>
                <Timer size={16} className={secondsLeft <= 10 ? "animate-spin" : ""} />
                <span>{secondsLeft}s</span>
              </div>

              {/* Real-time score indicator */}
              <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl font-baloo font-extrabold text-sm shadow-sm">
                Score: {score}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render Main Idle UI (Setup Screen) */}
      <AnimatePresence mode="wait">
        {gameState === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Explanatory intro */}
            <div className="p-5 rounded-3xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
              <Info className="text-indigo-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-950">
                  Règles du jeu :
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Le plateau contient des cartes de mots mélangées à des cartes de définitions. Retourne deux cartes d'affilée pour assembler un mot avec sa définition correcte. Réalise des associations rapides pour faire monter ton multiplicateur de <strong>Combo</strong> et termine avant la fin du sablier !
                </p>
              </div>
            </div>

            {/* Custom Configuration Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Setup column 1: Source Selection */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200/60 shadow-sm space-y-4">
                <h4 className="font-baloo font-black text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <BookMarked size={16} className="text-purple-600" /> 1. Sélectionne tes mots
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Option 1: Personal Lexicon */}
                  <button
                    type="button"
                    onClick={() => setGameSource('lexicon')}
                    disabled={personalLexicon.length < 2}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      gameSource === 'lexicon'
                        ? 'bg-purple-50/80 border-purple-500 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 cursor-pointer'
                    } ${personalLexicon.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-baloo font-extrabold text-sm text-purple-950 block">✨ Mes Mots Persos</span>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        {personalLexicon.length} mot(s)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-snug">
                      Joue avec les termes personnalisés que tu as collectés au fil des cours.
                    </span>
                    {personalLexicon.length < 2 && (
                      <span className="text-[9px] text-red-500 font-bold block mt-1">
                        ⚠️ Ajoute au moins 2 mots à ton lexique pour jouer dans ce mode !
                      </span>
                    )}
                  </button>

                  {/* Option 2: Current Fiche Words */}
                  <button
                    type="button"
                    onClick={() => setGameSource('fiche')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      gameSource === 'fiche'
                        ? 'bg-indigo-50/85 border-indigo-500 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-baloo font-extrabold text-sm text-indigo-950 block">📖 Mots de la Fiche Active</span>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                        {currentFicheWords.length} mot(s)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-snug">
                      Révisons le dictionnaire de la fiche active : <strong>"{currentFicheTitle}"</strong>.
                    </span>
                  </button>
                </div>
              </div>

              {/* Setup column 2: Difficulty Selection */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200/60 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="font-baloo font-black text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
                    <Award size={16} className="text-amber-500" /> 2. Difficulté (Paires de cartes)
                  </h4>

                  <div className="flex gap-2">
                    {[4, 6, 8].map(count => {
                      const isDisabled = count > availablePairs.length;
                      return (
                        <button
                          key={count}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setDifficulty(count)}
                          className={`flex-1 py-3 text-center font-baloo font-bold text-xs rounded-xl border-2 transition-all cursor-pointer ${
                            difficulty === count
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {count === 4 ? 'Facile' : count === 6 ? 'Moyen' : 'Difficile'}
                          <span className="text-[10px] font-black block mt-0.5">({count} paires)</span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-slate-400 font-bold italic">
                    {availablePairs.length < difficulty 
                      ? `⚠️ Tu n'as que ${availablePairs.length} mots disponibles pour ce mode. Difficulté réduite automatiquement.`
                      : `Prêt à associer les mots ? Tu devras trouver ${difficulty} paires parmi un choix varié !`
                    }
                  </p>
                </div>

                {/* Confirm/Play Button */}
                <button
                  type="button"
                  onClick={startGame}
                  disabled={availablePairs.length < 2}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-baloo font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all hover:scale-102 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Play size={18} fill="currentColor" />
                  <span>C'est parti ! 🚀</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* Victory Screen */}
        {gameState === 'victory' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-6 py-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 shadow-xl text-4xl animate-bounce">
              👑
            </div>

            <div className="space-y-2">
              <span className="font-extrabold text-xs text-amber-600 uppercase tracking-widest animate-pulse block">Excellent Score Académique !</span>
              <h3 className="font-baloo text-3.5xl font-black text-indigo-950">
                🎉 VICTOIRE ÉBLOUISSANTE !
              </h3>
              <p className="text-xs text-slate-500 font-bold max-w-lg mx-auto">
                Tu as déniché toutes les définitions correspondantes en un temps record ! M. Yahyaoui est fier de ton sens d'observation et de ta maîtrise du vocabulaire.
              </p>
            </div>

            {/* Score statistics panel */}
            <div className="bg-white max-w-md mx-auto p-6 rounded-3xl border-4 border-indigo-200 shadow-md divide-y divide-slate-100">
              <div className="pb-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-extrabold uppercase">Tentatives de jumelage</span>
                <span className="font-baloo font-black text-indigo-950">{attempts} essais</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-extrabold uppercase">Temps restant</span>
                <span className="font-baloo font-black text-indigo-950">{secondsLeft} secondes</span>
              </div>
              <div className="pt-3 flex justify-between items-center">
                <span className="text-xs font-black text-amber-600 uppercase">SCORE OBTENU</span>
                <span className="font-baloo text-2.5xl font-black text-amber-600">{score} pts</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto justify-center">
              <button
                type="button"
                onClick={() => setGameState('idle')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-baloo font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Recommencer 🔄
              </button>
              <button
                type="button"
                onClick={() => {
                  setGameState('idle');
                  showMascotMsg("Ravi de ton score ! Continue d'explorer de nouvelles fiches pour plus de défis ! 📚");
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-baloo font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Retour au Lexique
              </button>
            </div>
          </motion.div>
        )}

        {/* GameOver Screen */}
        {gameState === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-6 py-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 shadow-lg text-4xl">
              ⏰
            </div>

            <div className="space-y-1">
              <h3 className="font-baloo text-2.5xl font-black text-indigo-950">
                💔 TEMPS ÉCOULÉ !
              </h3>
              <p className="text-xs text-slate-500 font-bold max-w-md mx-auto leading-relaxed">
                Le temps est passé trop vite ! Mais chaque essai te permet d'ancrer de nouveaux mots de lexique dans ta mémoire. Tu feras encore mieux le coup d'après !
              </p>
            </div>

            {/* Score feedback */}
            <div className="bg-slate-50 max-w-xs mx-auto p-4 rounded-2xl border border-slate-200 text-center">
              <span className="text-[9px] uppercase font-black text-slate-400 block">Paires trouvées</span>
              <span className="font-baloo text-lg font-black text-slate-700">
                {cards.filter(c => c.isMatched && c.type === 'word').length} / {difficulty} paires
              </span>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={startGame}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-baloo font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer transition-all active:scale-95"
              >
                Réessayer 🔄
              </button>
              <button
                type="button"
                onClick={() => setGameState('idle')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-baloo font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-95"
              >
                Changer de mode
              </button>
            </div>
          </motion.div>
        )}

        {/* Interactive Gaming Board */}
        {gameState === 'playing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Real-time statistics bars */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span>🎯 Essais : <strong className="text-slate-900">{attempts}</strong></span>
                <span className="flex items-center gap-1">
                  🔥 Combo : 
                  <strong className={`transition-all text-xs font-black uppercase text-amber-600 ${combo > 1 ? 'scale-110 animate-bounce' : ''}`}>
                    x{combo}
                  </strong>
                </span>
                <span>
                  📂 Mode : 
                  <strong className="text-indigo-800 uppercase text-[10px] ml-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {gameSource === 'lexicon' ? 'Mots Personnels' : 'Fiche Actuelle'}
                  </strong>
                </span>
              </div>

              {/* Progress Tracker */}
              <div className="flex items-center gap-2 shrink-0 text-[10px] font-black uppercase text-indigo-950">
                <span>Progression :</span>
                <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden border">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-305"
                    style={{ 
                      width: `${(cards.filter(c => c.isMatched).length / cards.length) * 100}%` 
                    }}
                  />
                </div>
                <span>
                  {cards.filter(c => c.isMatched && c.type === 'word').length}/{difficulty}
                </span>
              </div>
            </div>

            {/* Word matching 2D Grid Cards */}
            <div className={`grid gap-4 ${
              difficulty === 4 
                ? 'grid-cols-2 sm:grid-cols-4' 
                : difficulty === 6 
                  ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6' 
                  : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-8'
            }`}>
              {cards.map((card, idx) => {
                const isSelected = selectedCards.includes(idx);
                const flipped = card.isFlipped || card.isMatched || isSelected;

                return (
                  <div
                    key={card.id + idx}
                    onClick={() => handleCardClick(idx)}
                    className="relative h-44 select-none cursor-pointer"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      className="w-full h-full relative"
                      animate={{ rotateY: flipped ? 180 : 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Side 1: Card Back (Hidden/Unflipped) */}
                      <div 
                        className={`absolute inset-0 w-full h-full rounded-2xl border-4 flex flex-col items-center justify-center p-3 text-center transition-all bg-gradient-to-br shadow-md ${
                          card.type === 'word'
                            ? 'from-indigo-600 to-indigo-800 border-indigo-400 hover:scale-103 text-white'
                            : 'from-purple-600 to-purple-800 border-purple-400 hover:scale-103 text-white'
                        }`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <span className="text-3xl filter drop-shadow animate-pulse-subtle">🧠</span>
                        <span className="text-[9px] font-black uppercase tracking-widest mt-2">
                          {card.type === 'word' ? 'Mot' : 'Sens'}
                        </span>
                      </div>

                      {/* Side 2: Card Front (Flipped/Visible) */}
                      <div 
                        className={`absolute inset-0 w-full h-full rounded-2xl border-4 flex flex-col items-center justify-center p-3 text-center shadow-lg transition-transform ${
                          card.isMatched 
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-extrabold' 
                            : isSelected 
                              ? 'bg-amber-50 border-amber-400 text-amber-900 font-extrabold ring-4 ring-amber-300/40'
                              : 'bg-white text-slate-800 font-bold border-slate-200'
                        }`}
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {/* Word Cards Display */}
                        {card.type === 'word' ? (
                          <div className="space-y-1">
                            <span className="text-lg font-baloo font-black uppercase block tracking-tight line-clamp-2">
                              {card.content}
                            </span>
                            <span className="bg-indigo-100 text-indigo-800 text-[8px] font-bold uppercase px-2 py-0.5 rounded-full inline-block">
                              MOT 🏷️
                            </span>
                          </div>
                        ) : (
                          /* Definition Cards Display with scaled text adjustments fitting standard grids */
                          <div className="h-full flex flex-col justify-between py-1.5 w-full">
                            <div className="flex-1 flex items-center justify-center">
                              <p className={`font-semibold leading-snug tracking-tight text-center text-slate-700 line-clamp-4 ${
                                card.content.length > 55 ? 'text-[9px]' : 'text-[10px]'
                              }`}>
                                {card.content}
                              </p>
                            </div>
                            <span className="bg-purple-100 text-purple-800 text-[8px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-1 w-fit mx-auto self-center select-none">
                              DÉFINITION 💡
                            </span>
                          </div>
                        )}

                        {/* Speech Speaker trigger on front */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (card.type === 'word') {
                              speakWord(card.content);
                            } else {
                              speakStatement(card.content);
                            }
                          }}
                          className="absolute bottom-1 right-1 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 cursor-pointer"
                          title="Écouter la prononciation 🔊"
                        >
                          <Volume2 size={11} />
                        </button>
                      </div>

                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Quick Abort gameplay option */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  clearInterval(timerRef.current!);
                  setGameState('idle');
                  showMascotMsg("Tu as quitté la partie en cours. N'hésite pas à réformer une partie quand tu te sentiras d'attaque ! 💪");
                }}
                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-baloo font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                🏳️ Abandonner la partie en cours
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
