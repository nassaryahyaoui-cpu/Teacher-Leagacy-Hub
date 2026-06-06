import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, Trophy, Clock, Sparkles, Gamepad2, User, Users, 
  CheckCircle2, XCircle, ArrowRight, RefreshCw, LogOut, Loader2,
  Award, Lock, Shield
} from 'lucide-react';

interface CompetitionArenaProps {
  currentFicheId: number;
  currentFiche: {
    id: number;
    title: string;
    vocab: string[];
    vocabOptions?: Record<string, string[]>;
    evaluation: any[];
  };
  currentUser: {
    id?: string;
    name: string;
    type: 'student' | 'prof';
  } | null;
  showMascotMsg: (msg: string) => void;
  scores?: Record<string, any>;
  badges?: string[];
  onAddBadge?: (badgeName: string) => void;
  isOnline?: boolean;
}

const ARENA_BADGES = [
  { id: "木", name: "Recrue en Herbe 🪵", threshold: 10, icon: "🌱", color: "from-green-50 to-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "銅", name: "Gladiateur de Bronze 🥉", threshold: 30, icon: "🥉", color: "from-amber-50 to-amber-100 text-amber-800 border-amber-305" },
  { id: "鉄", name: "Soldat de Fer ⚔️", threshold: 60, icon: "⚔️", color: "from-slate-50 to-slate-200 text-slate-800 border-slate-300" },
  { id: "銀", name: "Paladin d'Argent 🛡️", threshold: 100, icon: "🛡️", color: "from-gray-50 to-gray-200 text-gray-800 border-gray-300" },
  { id: "金", name: "Centurion d'Or 🎖️", threshold: 165, icon: "🥇", color: "from-yellow-50 to-yellow-150 text-amber-900 border-yellow-350" },
  { id: "翠", name: "Souverain Céleste 💎", threshold: 240, icon: "💎", color: "from-indigo-50 to-indigo-150 text-indigo-900 border-indigo-300" },
  { id: "皇", name: "Empereur Légendaire 👑", threshold: 320, icon: "👑", color: "from-purple-50 to-purple-150 text-purple-900 border-purple-300" }
];

const MASCOTS = [
  { char: "🦖", label: "Dino" },
  { char: "🐯", label: "Tigre" },
  { char: "🦊", label: "Renard" },
  { char: "🦉", label: "Hibou" },
  { char: "🐼", label: "Panda" },
  { char: "🧙", label: "Mage" },
  { char: "🚀", label: "Fusée" },
  { char: "🐙", label: "Poulpe" },
];

export default function CompetitionArena({
  currentFicheId,
  currentFiche,
  currentUser,
  showMascotMsg,
  scores = {},
  badges = [],
  onAddBadge,
  isOnline = true
}: CompetitionArenaProps) {
  const [playerName, setPlayerName] = useState(currentUser?.name || "");
  const [selectedMascot, setSelectedMascot] = useState("🦖");
  const [activeTab, setActiveTab] = useState<'setup' | 'queue' | 'playing' | 'finished'>('setup');
  
  // Local persistent stats for the arena
  const localStatsKey = `jugurtha_competition_stats_${currentUser?.id || 'guest'}`;
  const [compStats, setCompStats] = useState(() => {
    const saved = localStorage.getItem(localStatsKey);
    return saved ? JSON.parse(saved) : { wins: 0, ties: 0, played: 0 };
  });

  const hasRecordedResultRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(localStatsKey, JSON.stringify(compStats));
  }, [compStats, localStatsKey]);

  // Points calculation
  const generalPoints = Object.values(scores || {}).reduce((sum, item: any) => sum + (item.total || 0), 0);
  const competitionPoints = compStats.wins * 15 + compStats.ties * 10 + (compStats.played - compStats.wins - compStats.ties) * 5;
  const totalScore = generalPoints + competitionPoints;

  // Track & trigger dynamic badge unlocking
  useEffect(() => {
    ARENA_BADGES.forEach(badge => {
      if (totalScore >= badge.threshold) {
        if (!badges.includes(badge.name)) {
          onAddBadge?.(badge.name);
          showMascotMsg(`🎊 Sensationnel ! Tu as franchi un cap de ${badge.threshold} pts et débloqué le badge : ${badge.name}! 🏅🏆`);
        }
      }
    });
  }, [totalScore, badges, onAddBadge, showMascotMsg]);

  const getCurrentBadgeTitle = (scoreVal: number) => {
    const reversed = [...ARENA_BADGES].reverse();
    const found = reversed.find(b => scoreVal >= b.threshold);
    return found ? { name: found.name, icon: found.icon } : { name: "Novice 🪵", icon: "🪵" };
  };

  // Game states
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [isPlayer1, setIsPlayer1] = useState<boolean>(true);
  const [opponent, setOpponent] = useState<{ name: string; avatar: string } | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isChoiceCorrect, setIsChoiceCorrect] = useState<boolean | null>(null);
  const [canClick, setCanClick] = useState(true);
  
  // Real-time peer tracking
  const [oppQuestionIdx, setOppQuestionIdx] = useState(-1);
  const [oppScore, setOppScore] = useState(0);
  const [oppFinished, setOppFinished] = useState(false);
  const [oppTime, setOppTime] = useState<number | null>(null);
  
  // Final summary states
  const [gameWinnerName, setGameWinnerName] = useState<string | null>(null);
  const [finalResults, setFinalResults] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Stop vocal speech syntheses during page navigate
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Sync user name if it loads
  useEffect(() => {
    if (currentUser?.name && !playerName) {
      setPlayerName(currentUser.name);
    }
  }, [currentUser]);

  // Connect to the Live Queue
  const joinCompetitionQueue = () => {
    if (!playerName.trim()) {
      showMascotMsg("⚠️ Choisis un pseudo ou écris ton nom pour défier tes amis !");
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Build socket URL matching protocol dynamically
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const socketUrl = `${protocol}//${host}`;
    
    showMascotMsg("Connexion au serveur de l'arène de duel... 🏟️");
    
    const ws = new WebSocket(socketUrl);
    setSocket(ws);
    setActiveTab('queue');

    ws.onopen = () => {
      // Send join message
      const joinMsg = {
        type: "join_queue",
        ficheId: currentFicheId,
        playerName: playerName.trim(),
        avatar: selectedMascot,
        // Send relevant fiche data to automatically compile a smart 5-question match deck
        ficheData: {
          vocab: currentFiche.vocab,
          vocabOptions: currentFiche.vocabOptions || {},
          evaluation: currentFiche.evaluation || [],
        }
      };
      ws.send(JSON.stringify(joinMsg));
      showMascotMsg("Recherche d'un autre élève pour un duel en direct... ⚔️");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case "queue_joined":
            console.log("Joined queue successfully");
            break;
            
          case "game_start": {
            // Unpack dual game
            setRoomId(data.roomId);
            setQuestions(data.questions);
            setOpponent(data.opponent);
            setIsPlayer1(data.isPlayer1);
            
            // Reset state
            setCurrentQuestionIdx(0);
            setScore(0);
            setOppScore(0);
            setOppQuestionIdx(-1);
            setOppFinished(false);
            setOppTime(null);
            setGameWinnerName(null);
            setFinalResults(null);
            hasRecordedResultRef.current = false;
            
            // Transition screen
            setActiveTab('playing');
            showMascotMsg(`⚔️ Dual trouvé ! Tu affrontes ${data.opponent.name} sur la Fiche ${currentFicheId} ! Sois rapide et juste !`);
            
            // Start clock timer
            setTimer(0);
            startTimeRef.current = Date.now();
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              setTimer(prev => prev + 1);
            }, 1000);
            break;
          }
          
          case "opponent_progress": {
            setOppQuestionIdx(data.questionIndex);
            setOppScore(data.score);
            break;
          }
          
          case "opponent_finished": {
            setOppFinished(true);
            setOppScore(data.opponentScore);
            setOppTime(data.opponentTime);
            break;
          }
          
          case "opponent_disconnected": {
            // Adversary left early
            if (timerRef.current) clearInterval(timerRef.current);
            setGameWinnerName(playerName);
            setFinalResults({
              player1: { name: playerName, score, timeSpent: timer },
              player2: { name: opponent?.name || "Adversaire", score: oppScore, timeSpent: 9999, disconnected: true }
            });
            setActiveTab('finished');
            showMascotMsg("🏆 Victoire par forfait ! Ton opposant s'est déconnecté.");

            if (!hasRecordedResultRef.current) {
              hasRecordedResultRef.current = true;
              setCompStats(prev => ({
                wins: prev.wins + 1,
                ties: prev.ties,
                played: prev.played + 1
              }));
            }
            break;
          }
          
          case "game_over": {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameWinnerName(data.winner);
            setFinalResults(data.results);
            setActiveTab('finished');
            if (data.winner === playerName) {
              showMascotMsg("⭐ FÉLICITATIONS ! Tu as remporté le duel haut la main ! 🏆");
              speakVictory("Bravo ! Tu as gagné le duel ! Tu es le champion !");
            } else if (data.winner === "Egalité") {
              showMascotMsg("🤝 Égalité parfaite ! Vous êtes tous les deux d'excellents élèves !");
              speakVictory("Égalité parfaite ! Beau travail !");
            } else {
              showMascotMsg(`😔 Presque ! ${data.winner} a été plus rapide ou plus précis cette fois-ci. Entraîne-toi et prends ta revanche !`);
              speakVictory("Bel effort ! Continue de t'entraîner !");
            }

            if (!hasRecordedResultRef.current) {
              hasRecordedResultRef.current = true;
              const isWin = data.winner === playerName;
              const isTie = data.winner === "Egalité";
              setCompStats(prev => ({
                wins: prev.wins + (isWin ? 1 : 0),
                ties: prev.ties + (isTie ? 1 : 0),
                played: prev.played + 1
              }));
            }
            break;
          }
        }
      } catch (err) {
        console.error("Socket error handling msg", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  };

  const speakVictory = (msgRef: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msgRef);
    u.lang = 'fr-FR';
    u.rate = 0.85;
    
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
        u.voice = friendlyVoice;
      }
    }

    window.speechSynthesis.speak(u);
  };

  // Safe quit function
  const leaveArena = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "leave_competition" }));
      socket.close();
      setSocket(null);
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveTab('setup');
    showMascotMsg("Reviens quand tu veux pour disputer une autre compétition ! 🎮✨");
  };

  // Submit response
  const handleAnswerSubmit = (choice: string) => {
    if (!canClick) return;
    setCanClick(false);
    setSelectedChoice(choice);
    
    const currQ = questions[currentQuestionIdx];
    const isCorrect = choice === currQ.answer;
    setIsChoiceCorrect(isCorrect);

    let newScore = score;
    if (isCorrect) {
      newScore += 1;
      setScore(newScore);
    }

    // Report answer progress to match server
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "submit_answer",
        roomId,
        questionIndex: currentQuestionIdx,
        isCorrect,
        score: isCorrect ? 1 : 0
      }));
    }

    // Mini flash on mascot/audio
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const sUtter = new SpeechSynthesisUtterance(isCorrect ? "Correct !" : "Oups ! Recommence.");
      sUtter.lang = 'fr-FR';
      sUtter.rate = 1.0;
      
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
          sUtter.voice = friendlyVoice;
        }
      }

      window.speechSynthesis.speak(sUtter);
    }

    setTimeout(() => {
      setSelectedChoice(null);
      setIsChoiceCorrect(null);
      setCanClick(true);

      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx < questions.length) {
        setCurrentQuestionIdx(nextIdx);
      } else {
        // Complete the race !
        const endTime = (Date.now() - startTimeRef.current) / 1000;
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Notify finish
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "player_finished",
            roomId,
            timeSpent: endTime
          }));
        }
        
        // Block and wait for calculations from websocket
        showMascotMsg("Tu as fini ! En attente de ton adversaire pour le verdict final... ⏳");
      }
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 py-10 px-4 md:px-8 rounded-[40px] border-4 border-indigo-200 shadow-2xl relative overflow-hidden">
      
      {/* Background visual graphics */}
      <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 select-none font-black">
        🎮
      </div>
      <div className="absolute bottom-0 left-0 p-8 text-8xl opacity-10 select-none font-black">
        ⚔️
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-indigo-200 tracking-wider">
            Mode Compétition Multijoueur en temps réel
          </span>
          <h2 className="font-baloo text-4xl font-black text-indigo-900 mt-2 flex items-center justify-center gap-2">
            <Trophy className="text-amber-500 animate-[bounce_1.5s_infinite]" size={36} /> ARÈNE DE COMBAT 1v1
          </h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
            Fiche active : {currentFiche.title}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* TAB 1: Setup Profile & Select Mascot */}
          {activeTab === 'setup' && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-[36px] border-4 border-indigo-200 shadow-xl space-y-8"
              id="competition-setup-card"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nickname selection */}
                <div className="space-y-4">
                  <h3 className="font-baloo text-xl font-black text-slate-800 flex items-center gap-2">
                    <User className="text-indigo-500" /> 1. Entre ton prénom
                  </h3>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Écris ton prénom..."
                    className="w-full bg-slate-50 border-4 border-slate-200 focus:border-indigo-500 rounded-2xl px-5 py-4 text-lg font-black outline-none transition-all shadow-inner text-slate-800"
                    maxLength={16}
                  />
                  <p className="text-xs font-bold text-slate-400">
                    Ce prénom sera affiché en temps réel à ton adversaire pendant la compétition.
                  </p>
                </div>

                {/* Avatar selection */}
                <div className="space-y-4">
                  <h3 className="font-baloo text-xl font-black text-slate-800 flex items-center gap-2">
                    <Sparkles className="text-amber-500 animate-pulse" /> 2. Choisis ta mascotte
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {MASCOTS.map((m) => (
                      <button
                        key={m.char}
                        type="button"
                        onClick={() => setSelectedMascot(m.char)}
                        className={`p-3 text-3xl rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 ${
                          selectedMascot === m.char 
                            ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-md' 
                            : 'border-slate-100 bg-white'
                        }`}
                      >
                        <span>{m.char}</span>
                        <span className="text-[10px] font-black uppercase text-slate-400 mt-1">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* BRAND NEW: Dynamic Progression Badges Panel */}
              <div className="pt-6 border-t-2 border-dashed border-indigo-100 space-y-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-baloo text-xl font-black text-indigo-950 flex items-center gap-2">
                      <Award className="text-amber-500 animate-[pulse_2s_infinite]" size={24} /> 🎖️ Badges et Titres de l'Arène
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Franchis des caps avec tes scores cumulés pour débloquer des insignes légendaires !
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-100 px-4 py-2 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center gap-2.5 shrink-0">
                    <Trophy className="text-amber-600 animate-[bounce_2s_infinite]" size={20} />
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-700 block leading-none">Score Total de Combat</span>
                      <span className="font-baloo text-lg font-black text-amber-900 leading-none">{totalScore.toFixed(0)} pts</span>
                    </div>
                  </div>
                </div>

                {/* Micro level bar */}
                <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Current Active Rank Card */}
                  <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border-2 border-indigo-200/50 shadow-sm shrink-0 w-full md:w-auto">
                    <span className="text-4xl">{getCurrentBadgeTitle(totalScore).icon}</span>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block leading-none">Ton Titre Actuel</span>
                      <span className="font-baloo text-sm font-black text-indigo-700 uppercase tracking-tight">{getCurrentBadgeTitle(totalScore).name}</span>
                    </div>
                  </div>

                  {/* Progressive Bar Slider */}
                  <div className="flex-1 w-full space-y-1.5">
                    {(() => {
                      const nextBadge = ARENA_BADGES.find(b => totalScore < b.threshold);
                      const currentRank = [...ARENA_BADGES].reverse().find(b => totalScore >= b.threshold) || { threshold: 0 };
                      const progressPercent = nextBadge 
                        ? Math.min(100, Math.max(0, ((totalScore - currentRank.threshold) / (nextBadge.threshold - currentRank.threshold)) * 100))
                        : 100;

                      return (
                        <>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                            <span>Niveau de Combat</span>
                            <span>{nextBadge ? `Plus que ${(nextBadge.threshold - totalScore).toFixed(0)} pts pour ${nextBadge.name}` : "Niveau Maximal Atteint ! 👑"}</span>
                          </div>
                          <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative border shadow-inner">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${progressPercent}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ duration: 1 }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white mix-blend-difference">
                              {progressPercent.toFixed(0)}% vers le prochain cap
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Grid list of badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {ARENA_BADGES.map((b) => {
                    const isUnlocked = totalScore >= b.threshold;
                    return (
                      <div 
                        key={b.id}
                        className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all relative overflow-hidden group hover:scale-[1.03] ${
                          isUnlocked 
                            ? `bg-gradient-to-b ${b.color} shadow-md` 
                            : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-70'
                        }`}
                      >
                        {/* Status label mark */}
                        <div className="absolute top-1 right-2">
                          {isUnlocked ? (
                            <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">Acquis</span>
                          ) : (
                            <Lock size={10} className="text-slate-400" />
                          )}
                        </div>

                        {/* Huge badge graphic */}
                        <span className={`text-3.5xl block my-1 ${isUnlocked ? 'animate-[pulse_4s_infinite]' : 'filter grayscale'}`}>
                          {b.icon}
                        </span>

                        <h4 className="font-baloo text-xs font-black text-slate-800 tracking-tight leading-tight uppercase line-clamp-2">
                          {b.name.replace(/\s\S+$/, "")}
                        </h4>
                        
                        <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">
                          {isUnlocked ? `✓ Débloqué` : `Cap: ${b.threshold} pts`}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Quick stats ribbon */}
                <div className="bg-indigo-50/50 px-4 py-2.5 rounded-2xl border border-indigo-100 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    📖 Exercices résolus : <strong className="text-indigo-700">{Math.round(generalPoints)} pts</strong>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    ⚔️ Victoires compétition : <strong className="text-indigo-700">{compStats.wins} matches ({compStats.played} joués)</strong>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    🏅 Titre suprême : <strong className="text-indigo-700">{getCurrentBadgeTitle(totalScore).name}</strong>
                  </span>
                </div>
              </div>

              {/* Action trigger button */}
              <div className="pt-4 border-t-2 border-dashed border-slate-100 flex justify-center">
                {isOnline ? (
                  <button
                    type="button"
                    onClick={joinCompetitionQueue}
                    className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white font-black rounded-3xl text-lg uppercase tracking-wider inline-flex items-center gap-3 transition-all shadow-lg shadow-indigo-500/30 cursor-pointer"
                    id="search-pairing-btn"
                  >
                    <Gamepad2 size={24} /> Lancer la compétition ⚔️
                  </button>
                ) : (
                  <div className="w-full max-w-md bg-amber-50 border-4 border-dashed border-amber-300 rounded-[28px] p-5 text-center space-y-3 shadow-md">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                      <Shield size={22} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-baloo text-md font-black text-amber-900 uppercase leading-none">Duel en Temps Réel Hors-ligne Indisponible</h4>
                      <p className="text-xs text-amber-700 font-bold mt-1.5 leading-relaxed">
                        Le mode compétition multijoueur nécessite une connexion Internet active pour affronter tes camarades de classe en synchrone.
                      </p>
                    </div>
                    <p className="text-[10px] font-black text-amber-600/80 uppercase tracking-wider">🔌 Rebranche ton Wi-Fi pour t'opposer en duel !</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Matchmaking / Queueing */}
          {activeTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-12 rounded-[36px] border-4 border-indigo-200 shadow-xl text-center space-y-8 relative overflow-hidden"
              id="competition-queue-card"
            >
              {/* Spinner animation */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <span className="absolute text-5xl animate-[pulse_1s_infinite]">{selectedMascot}</span>
                <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-indigo-400 opacity-20"></span>
                <RefreshCw size={80} className="text-indigo-500 animate-spin opacity-40 duration-3000" />
              </div>

              <div className="space-y-2">
                <h3 className="font-baloo text-2xl font-black text-indigo-900 uppercase">Recherche d'un adversaire libre...</h3>
                <p className="text-sm font-bold text-slate-500 leading-normal max-w-lg mx-auto">
                  Nous cherchons un autre élève en direct de sa classe pour s'affronter sur les exercices de la fiche <strong>"{currentFiche.title}"</strong>.
                </p>
              </div>

              <div className="flex justify-center gap-2 items-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 max-w-sm mx-auto">
                <Users size={16} className="text-indigo-600 animate-pulse" />
                <span className="text-xs font-black text-indigo-700 uppercase">Appariement en temps réel activé</span>
              </div>

              {/* Stop / Cancel button */}
              <div className="pt-4 border-t-2 border-dashed border-slate-100">
                <button
                  type="button"
                  onClick={leaveArena}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-bold rounded-xl text-xs uppercase transition-all tracking-wider inline-flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <LogOut size={14} /> Annuler la recherche
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Active Live Battle Arena */}
          {activeTab === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
              id="competition-game-card"
            >
              {/* Live Status Header Scoreboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Player side */}
                <div className="bg-indigo-600 text-white p-5 rounded-[24px] border-4 border-indigo-700 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedMascot}</span>
                    <div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="font-baloo font-bold text-sm tracking-tight truncate max-w-[120px] uppercase">
                          {playerName}
                        </span>
                        <span className="px-1.5 py-0.5 bg-indigo-500 rounded text-[8px] font-black tracking-wide border border-indigo-400 shrink-0 uppercase">
                          {getCurrentBadgeTitle(totalScore).icon} Toi
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-indigo-250 uppercase tracking-wide mt-1 leading-none">
                        Titre : {getCurrentBadgeTitle(totalScore).name}
                      </p>
                      {/* Interactive Progress bar */}
                      <p className="text-[9px] font-bold text-indigo-200 uppercase mt-1">
                        Question {currentQuestionIdx + 1} / 5
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Score</span>
                    <h3 className="font-baloo text-3xl font-black text-amber-300 leading-none">{score} pt</h3>
                  </div>
                </div>

                {/* Opponent side */}
                <div className="bg-slate-800 text-white p-5 rounded-[24px] border-4 border-slate-700 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{opponent?.avatar || "🦉"}</span>
                    <div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="font-baloo font-bold text-sm tracking-tight truncate max-w-[120px] uppercase text-slate-100">
                          {opponent?.name || "Adversaire"}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-700 rounded text-[8px] font-black tracking-wide border border-slate-600 shrink-0 uppercase">
                          🛡️ Adversaire
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide mt-1 leading-none">
                        Titre : {getCurrentBadgeTitle(65).name}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                        {oppFinished 
                          ? "Terminé ! ✨" 
                          : `Question ${oppQuestionIdx === -1 ? 1 : Math.min(oppQuestionIdx + 2, 5)} / 5`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Score</span>
                    <h3 className="font-baloo text-3xl font-black text-emerald-400 leading-none">{oppScore} pt</h3>
                  </div>
                </div>
              </div>

              {/* Progress Duel Bar Graphics visual tracker */}
              <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-inner space-y-4">
                <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 flex items-center gap-1 select-none">
                  <Clock size={10} className="text-indigo-500" /> Chronomètre duel en direct : <span className="text-indigo-600 font-extrabold">{timer} secondes</span>
                </span>
                
                {/* Visual Race track! */}
                <div className="space-y-3 pt-1">
                  {/* Player row */}
                  <div className="relative">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                      <span>{playerName}</span>
                      <span>{currentQuestionIdx} / 5</span>
                    </div>
                    <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${(currentQuestionIdx / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Opponent row */}
                  <div className="relative">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                      <span>{opponent?.name}</span>
                      <span>{oppFinished ? 5 : Math.max(0, oppQuestionIdx + 1)} / 5</span>
                    </div>
                    <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${(oppFinished ? 5 : Math.max(0, oppQuestionIdx + 1)) / 5 * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Quiz Card */}
              {currentQuestionIdx < questions.length && (
                <div 
                  className="bg-white p-8 rounded-[36px] border-4 border-indigo-400 shadow-xl space-y-6 relative"
                  id={`competition-question-container-${currentQuestionIdx}`}
                >
                  <div className="flex items-center justify-between border-b-2 border-dashed border-slate-100 pb-3">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                      EXERCICE DE RAPIDITÉ • Nº{currentQuestionIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Reste juste et obtiens le meilleur chrono ! ⏱️
                    </span>
                  </div>

                  <h3 className="font-baloo text-2xl font-black text-slate-950 text-center py-4 leading-normal">
                    {questions[currentQuestionIdx].title}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestionIdx].choices.map((choice: string) => {
                      const isSelected = selectedChoice === choice;
                      const isWinningOpt = choice === questions[currentQuestionIdx].answer;
                      
                      let btnColorClass = "bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-white";
                      if (selectedChoice) {
                        if (isWinningOpt) {
                          btnColorClass = "bg-green-500 text-white border-green-600 scale-[1.01] shadow-md";
                        } else if (isSelected && !isWinningOpt) {
                          btnColorClass = "bg-red-500 text-white border-red-600 scale-[0.99]";
                        } else {
                          btnColorClass = "bg-slate-50 text-slate-400 border-slate-100 opacity-60";
                        }
                      }
                      
                      return (
                        <button
                          key={choice}
                          type="button"
                          disabled={!canClick}
                          onClick={() => handleAnswerSubmit(choice)}
                          className={`w-full p-4 text-left font-bold rounded-2xl border-4 text-xs md:text-sm tracking-wide transition-all uppercase outline-none flex items-center justify-between cursor-pointer ${btnColorClass}`}
                        >
                          <span>{choice}</span>
                          {selectedChoice && isWinningOpt && <CheckCircle2 size={18} className="text-white flex-shrink-0" />}
                          {selectedChoice && isSelected && !isWinningOpt && <XCircle size={18} className="text-white flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Final Duel Results */}
          {activeTab === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white p-8 rounded-[36px] border-4 border-indigo-200 shadow-xl space-y-8 relative overflow-hidden text-center"
              id="competition-finished-card"
            >
              {/* Giant crown or congrats insignia */}
              <div className="relative">
                <span className="text-7xl block animate-bounce">
                  {gameWinnerName === playerName ? "🏆" : gameWinnerName === "Egalité" ? "🤝" : "🥈"}
                </span>
                {gameWinnerName === playerName && (
                  <span className="absolute -top-1 right-1/2 translate-x-12 shrink-0 animate-pulse text-2xl">✨</span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-baloo text-3xl font-black text-slate-800 uppercase tracking-tight">
                  {gameWinnerName === playerName ? (
                    <span className="text-indigo-600">VICTOIRE MAGNIFIQUE !</span>
                  ) : gameWinnerName === "Egalité" ? (
                    <span className="text-amber-500">ÉGALITÉ PARFAITE !</span>
                  ) : (
                    <span className="text-slate-600">BEL EFFORT !</span>
                  )}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Le duel de rapidité s'est achevé sur la Fiche {currentFicheId} !
                </p>
              </div>

              {/* Display duel results details */}
              {finalResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {/* Player card */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-indigo-100 relative">
                    <span className="text-3xl block mb-2">{selectedMascot}</span>
                    <h5 className="font-black text-xs uppercase text-slate-700 truncate">{finalResults.player1.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Toi</p>
                    <div className="mt-1.5 flex items-center justify-center gap-1 bg-indigo-50 px-2 py-1 rounded-xl border border-indigo-100/50">
                      <span className="text-sm">{getCurrentBadgeTitle(totalScore).icon}</span>
                      <span className="text-[9px] font-black uppercase text-indigo-800 tracking-wide">{getCurrentBadgeTitle(totalScore).name}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-around">
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Score</span>
                        <span className="font-baloo text-lg font-black text-indigo-600">{finalResults.player1.score} / 5</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-slate-400 font-bold block">Temps</span>
                        <span className="font-baloo text-lg font-black text-indigo-600">{(finalResults.player1.timeSpent || 0).toFixed(1)}s</span>
                      </div>
                    </div>
                  </div>

                  {/* Opponent card */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 relative">
                    <span className="text-3xl block mb-2">{opponent?.avatar || "🦉"}</span>
                    <h5 className="font-black text-xs uppercase text-slate-700 truncate">{finalResults.player2.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Adversaire</p>
                    {finalResults.player2.disconnected ? (
                      <div className="mt-3 text-red-500 font-black uppercase text-[10px] bg-red-50 py-1 rounded">
                        Déconnecté ⚠️
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-around">
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Score</span>
                          <span className="font-baloo text-lg font-black text-slate-700">{finalResults.player2.score} / 5</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 font-bold block">Temps</span>
                          <span className="font-baloo text-lg font-black text-slate-700">{(finalResults.player2.timeSpent || 0).toFixed(1)}s</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-4 border-t-2 border-dashed border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={joinCompetitionQueue}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RefreshCw size={14} className="animate-pulse" /> Rejouer un match !
                </button>
                <button
                  type="button"
                  onClick={leaveArena}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-black rounded-2xl text-xs uppercase tracking-widest transition-all inline-flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <LogOut size={14} /> Retour à l'accueil
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
