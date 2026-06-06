import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Star, Sparkles, Check, X, Award, RefreshCw, Layers, BookCheck, MessageSquare } from 'lucide-react';

interface LanguageExercisesProps {
  currentFicheId: number;
  currentFicheTitle: string;
  currentFicheTheme: string;
  speakWord: (word: string) => void;
  showMascotMsg: (msg: string) => void;
}

interface QuestionItem {
  id: number;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export default function LanguageExercises({
  currentFicheId,
  currentFicheTitle,
  currentFicheTheme,
  speakWord,
  showMascotMsg
}: LanguageExercisesProps) {
  const [level, setLevel] = useState<'4eme' | '5eme' | '6eme'>('4eme');
  const [discipline, setDiscipline] = useState<'grammaire' | 'orthographe' | 'conjugaison'>('grammaire');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'practice' | 'summary'>('practice');

  // Dynamic Generator of 5 Moroccan/Tunisian level items depending on the Theme and Level
  const getQuestions = (): QuestionItem[] => {
    // Normalise Theme
    const t = (currentFicheTheme || '').toLowerCase();
    const isHealthPlan = t.includes('santé') || t.includes('hygiène') || t.includes('maladie') || t.includes('médecin');
    const isNaturePlan = t.includes('loisir') || t.includes('zoo') || t.includes('campagne') || t.includes('pique-nique') || t.includes('nature') || t.includes('environnement') || t.includes('amitié');
    const isSchoolPlan = t.includes('école') || t.includes('scolaire') || t.includes('savoir') || t.includes('science') || t.includes('classe') || t.includes('recette') || t.includes('alimentation');
    
    // Group keywords to theme context
    let contextNoun = "l'élève";
    let contextVerb = "étudie";
    let contextSubject = "une belle leçon";
    let contextPlace = "dans la classe";

    if (isHealthPlan) {
      contextNoun = "le médecin";
      contextVerb = "soigne";
      contextSubject = "le malade rigolo";
      contextPlace = "à la pharmacie";
    } else if (isNaturePlan) {
      contextNoun = "le lion";
      contextVerb = "court";
      contextSubject = "le petit lapin blanc";
      contextPlace = "dans la forêt verte";
    } else if (isSchoolPlan) {
      contextNoun = "le maître";
      contextVerb = "écrit";
      contextSubject = "une phrase correcte";
      contextPlace = "sur le tableau";
    }

    // 4ème Année Questions
    if (level === '4eme') {
      if (discipline === 'grammaire') {
        return [
          {
            id: 1,
            question: `Accorde l'adjectif qualificatif : "Une (joli) ... histoire ${currentFicheTheme ? 'sur ' + currentFicheTheme : ''}."`,
            choices: ["joli", "jolie", "jolis", "jolies"],
            answer: "jolie",
            explanation: "L'adjectif 'joli' s'accorde en genre (féminin) et en nombre (singulier) avec le nom féminin 'histoire'."
          },
          {
            id: 2,
            question: `Identifie le Groupe Nominal Sujet (GNS) dans : "${contextNoun.substring(0,1).toUpperCase() + contextNoun.substring(1)} ${contextVerb} sagement."`,
            choices: [contextNoun, contextVerb, "sagement"],
            answer: contextNoun,
            explanation: "Le GNS est l'auteur de l'action, c'est celui qui fait l'action."
          },
          {
            id: 3,
            question: `Choisis le déterminant correct : "... chèvres de la ferme broutent l'herbe."`,
            choices: ["Le", "La", "Les", "Un"],
            answer: "Les",
            explanation: "'Chèvres' est au pluriel, on emploie donc le déterminant pluriel 'Les'."
          },
          {
            id: 4,
            question: `Complète la phrase par l'indicateur de lieu logique : "${contextNoun.substring(0,1).toUpperCase() + contextNoun.substring(1)} se trouve ..."`,
            choices: [contextPlace, "demain matin", "très fort", "parce qu'il pleut"],
            answer: contextPlace,
            explanation: `"${contextPlace}" exprime un lieu répondant à la question 'Où ?'.`
          },
          {
            id: 5,
            question: `Quelle ponctuation termine une phrase exclamative comme : "Quelle magnifique aventure !"`,
            choices: [".", "?", "!", ";"],
            answer: "!",
            explanation: "On utilise le point d'exclamation (!) pour exprimer une forte émotion ou surprise."
          }
        ];
      } else if (discipline === 'orthographe') {
        return [
          {
            id: 1,
            question: `Choisis entre "a" (verbe avoir) et "à" (préposition) : "L'enfant ... bien grandi."`,
            choices: ["a", "à"],
            answer: "a",
            explanation: "On écrit 'a' sans accent car c'est le verbe avoir conjugué (on peut dire 'avait bien grandi')."
          },
          {
            id: 2,
            question: `Complète par "est" ou "et" : "Le médecin ... très gentil."`,
            choices: ["est", "et"],
            answer: "est",
            explanation: "On utilise 'est' car c'est le verbe être (on peut dire 'était très gentil')."
          },
          {
            id: 3,
            question: `Quel est le pluriel correct de "un hibou" ? (Habilité tunisienne essentielle)`,
            choices: ["des hibous", "des hiboux", "des hiboes"],
            answer: "des hiboux",
            explanation: "Hibou fait partie des sept exceptions en -ou qui prennent un -x au pluriel."
          },
          {
            id: 4,
            question: `Complète par "s" ou "ss" pour obtenir le son [s] : "La récréation e...t amusante."`,
            choices: ["s", "ss"],
            answer: "s",
            explanation: "La récréation \"est\" (verbe être) s'écrit avec un s simple, mais pour un son [s] entre voyelles (comme dans classe) on doublerait."
          },
          {
            id: 5,
            question: `Complète avec "on" ou "ont" : "Dans mon village, ... aime beaucoup l'entraide."`,
            choices: ["on", "ont"],
            answer: "on",
            explanation: "On utilise 'on' (pronom personnel sujet) car il précède le verbe 'aime'. On peut le remplacer par 'il'."
          }
        ];
      } else { // conjugaison
        return [
          {
            id: 1,
            question: `Conjugue le verbe être au présent : "Nous ... très fiers de notre travail."`,
            choices: ["suis", "es", "sommes", "êtes"],
            answer: "sommes",
            explanation: "Le verbe être au présent avec la première personne du pluriel (Nous) est 'sommes'."
          },
          {
            id: 2,
            question: `Conjugue le verbe avoir au présent : "Tu ... une jolie ardoise."`,
            choices: ["ai", "as", "a", "avez"],
            answer: "as",
            explanation: "Avec 'tu', avoir au présent s'écrit 'as'."
          },
          {
            id: 3,
            question: `Trouve la terminaison avec "Ils / Elles" au présent pour les verbes en -er : "Ils (chanter) ..."`,
            choices: ["chante", "chantes", "chantons", "chantent"],
            answer: "chantent",
            explanation: "Le sujet pluriel 'Ils' commande la terminaison '-ent' au présent."
          },
          {
            id: 4,
            question: `Trouve la forme correcte de "ranger" : "Nous ... nos affaires d'école."`,
            choices: ["rangons", "rangeons", "ranges", "rangent"],
            answer: "rangeons",
            explanation: "On ajoute un 'e' après le 'g' devant 'o' pour maintenir le son doux [j] : 'rangeons'."
          },
          {
            id: 5,
            question: `Choisis le bon pronom : "... préparez une bonne recette."`,
            choices: ["Je", "Tu", "Vous", "Ils"],
            answer: "Vous",
            explanation: "La désinence verbale '-ez' correspond à la deuxième personne du pluriel 'Vous'."
          }
        ];
      }
    }

    // 5ème Année Questions
    if (level === '5eme') {
      if (discipline === 'grammaire') {
        return [
          {
            id: 1,
            question: `Identifie le Complément d'Objet Direct (COD) de la phrase : "Le fermier rassemble son troupeau."`,
            choices: ["Le fermier", "rassemble", "son troupeau"],
            answer: "son troupeau",
            explanation: "Le COD répond à la question : Le fermier rassemble quoi ? -> 'son troupeau'."
          },
          {
            id: 2,
            question: `Choisis l'adjectif démonstratif approprié : "... animal magique vit dans le désert."`,
            choices: ["ce", "cet", "cette", "ces"],
            answer: "cet",
            explanation: "On utilise 'cet' devant un nom masculin singulier commençant par une voyelle ou un h muet."
          },
          {
            id: 3,
            question: `Trouve l'indicateur de temps (CCT) dans : "Hier soir, la tempête a soufflé fort."`,
            choices: ["Hier soir", "la tempête", "fort", "a soufflé"],
            answer: "Hier soir",
            explanation: "'Hier soir' indique le moment où se déroule l'action, c'est un Complément Circonstanciel de Temps."
          },
          {
            id: 4,
            question: `Choisis l'adjectif possessif : "Sami prête son livre à ... sœur."`,
            choices: ["sa", "son", "ses", "leur"],
            answer: "sa",
            explanation: "'Sœur' étant féminin singulier, on accorde l'adjectif possessif au féminin : 'sa'."
          },
          {
            id: 5,
            question: `Transforme la phrase à la forme négative : "Le malade mange encore."`,
            choices: ["Le malade ne mange pas.", "Le malade ne mange plus.", "Le malade ne mange jamais."],
            answer: "Le malade ne mange plus.",
            explanation: "Le contraire de 'encore' est 'ne... plus' pour marquer l'arrêt de l'action."
          }
        ];
      } else if (discipline === 'orthographe') {
        return [
          {
            id: 1,
            question: `Complète par "son" ou "sont" : "Le père et ... fils partent à la campagne."`,
            choices: ["son", "sont"],
            answer: "son",
            explanation: "C'est l'adjectif possessif 'son' (on peut dire 'mon', 'ton')."
          },
          {
            id: 2,
            question: `Quel est le pluriel du mot "journal" ?`,
            choices: ["des journals", "des journaux", "des journauxes"],
            answer: "des journaux",
            explanation: "La plupart des noms en -al font leur pluriel en -aux (journal -> journaux)."
          },
          {
            id: 3,
            question: `Complète par "ou" (choix) ou "où" (lieu) : "C'est la ville ... j'habite."`,
            choices: ["ou", "où"],
            answer: "où",
            explanation: "'Où' avec accent sert à indiquer le lieu où l'on réside."
          },
          {
            id: 4,
            question: `Accorde le nom : "Ces (gâteau) ... sont savoureux."`,
            choices: ["gâteaus", "gâteau", "gâteaux"],
            answer: "gâteaux",
            explanation: "Les mots se terminant par -eau prennent un -x au pluriel."
          },
          {
            id: 5,
            question: `Trouve l'accord convenable : "Les fillettes sont ... d'être là."`,
            choices: ["content", "contente", "contents", "contentes"],
            answer: "contentes",
            explanation: "Le participe/adjectif s'accorde en genre (féminin) et nombre (pluriel) avec 'les fillettes'."
          }
        ];
      } else { // conjugaison
        return [
          {
            id: 1,
            question: `Conjugue au présent le verbe finir (2ème groupe) : "Tu ... tes devoirs."`,
            choices: ["finis", "finit", "finissons", "finissent"],
            answer: "finis",
            explanation: "Avec 'tu', les verbes en -ir du second groupe se terminent par '-is'."
          },
          {
            id: 2,
            question: `Conjugue au présent le verbe faire (3ème groupe) : "Nous ... un exposé."`,
            choices: ["faisons", "faisez", "font", "fais"],
            answer: "faisons",
            explanation: "Le verbe faire au présent avec 'nous' s'écrit 'faisons'."
          },
          {
            id: 3,
            question: `Conjugue au futur simple : "Demain, je (manger) ... des crêpes."`,
            choices: ["mangerai", "mangeras", "mangera", "mangerait"],
            answer: "mangerai",
            explanation: "La terminaison de la 1ère personne du singulier au futur simple est '-ai' après l'infinitif."
          },
          {
            id: 4,
            question: `Trouve le futur du verbe aller avec "ils" : "Ils ... à Tunis."`,
            choices: ["allent", "iront", "allent", "alleront"],
            answer: "iront",
            explanation: "Le verbe 'aller' a un radical irrégulier (ir-) au futur (ils iront)."
          },
          {
            id: 5,
            question: `Conjugue au présent : "Vous (choisir) ... une chèvre."`,
            choices: ["choisissez", "choisissez", "choisis"],
            answer: "choisissez",
            explanation: "Avec 'vous', la terminaison des verbes du 2e groupe au présent est '-issez'."
          }
        ];
      }
    }

    // 6ème Année Questions
    if (discipline === 'grammaire') {
      return [
        {
          id: 1,
          question: `Identifie l'expression de cause dans la phrase : "Il reste couché car il a de la fièvre."`,
          choices: ["Il reste couché", "car il a de la fièvre", "car", "de la fièvre"],
          answer: "car",
          explanation: "La conjonction 'car' introduit une proposition coordonnée exprimant la cause."
        },
        {
          id: 2,
          question: `Remplace par un pronom COD : "Le maître félicite les élèves." -> "Le maître ... félicite."`,
          choices: ["les", "la", "leur", "l'"],
          answer: "les",
          explanation: "'Les élèves' est un COD pluriel, il est donc remplacé par le pronom personnel 'les'."
        },
        {
          id: 3,
          question: `Quelle phrase est à la voix passive ?`,
          choices: [
            "Le vétérinaire vaccine le chien.",
            "Le chien est vacciné par le vétérinaire.",
            "Le chien aboie joyeusement."
          ],
          answer: "Le chien est vacciné par le vétérinaire.",
          explanation: "Le sujet 'Le chien' subit l'action faite par l'agent 'le vétérinaire'."
        },
        {
          id: 4,
          question: `Trouve le pronom relatif correct : "Voici le livre ... j'ai lu hier."`,
          choices: ["qui", "que", "dont", "où"],
          answer: "que",
          explanation: "On utilise 'que' car le pronom remplace un complément d'objet direct (j'ai lu le livre)."
        },
        {
          id: 5,
          question: `Forme l'adverbe à partir de l'adjectif 'intelligent' :`,
          choices: ["intelligentement", "intelligemment", "intelligement"],
          answer: "intelligemment",
          explanation: "Les adjectifs en -ent forment leurs adverbes en -emment (prononcé [amã])."
        }
      ];
    } else if (discipline === 'orthographe') {
      return [
        {
          id: 1,
          question: `Complète par "ses" (possessif) ou "ces" (démonstratif) : "Regarde ... belles montagnes là-bas !"`,
          choices: ["ses", "ces"],
          answer: "ces",
          explanation: "On emploie 'ces' pour montrer quelque chose à distance (démonstratif)."
        },
        {
          id: 2,
          question: `Complète : "Les enfants mangent ... goûter."`,
          choices: ["leur", "leurs"],
          answer: "leur",
          explanation: "On écrit 'leur' au singulier car chaque enfant a un seul goûter."
        },
        {
          id: 3,
          question: `Quelle est la forme plurielle de "un sourd-muet" ?`,
          choices: ["des sourds-muet", "des sourd-muets", "des sourds-muets"],
          answer: "des sourds-muets",
          explanation: "Dans les noms composés adjectif+adjectif, les deux mots s'accordent au pluriel."
        },
        {
          id: 4,
          question: `Accorde le participe passé : "Elles sont (partir) ... de bonne heure."`,
          choices: ["parti", "partie", "partis", "parties"],
          answer: "parties",
          explanation: "Avec l'auxiliaire 'être', le participe passé s'accorde toujours avec le sujet (féminin pluriel)."
        },
        {
          id: 5,
          question: `Complète par "ce" ou "se" : "Sami ... lève de bonne heure."`,
          choices: ["ce", "se"],
          answer: "se",
          explanation: "On utilise le pronom personnel réfléchi 'se' devant un verbe pronominal (se lever)."
        }
      ];
    } else { // conjugaison
      return [
        {
          id: 1,
          question: `Conjugue le verbe au passé composé : "Elles ... (arriver) très en retard."`,
          choices: ["ont arrivé", "sont arrivées", "sont arrivés", "ont arrivées"],
          answer: "sont arrivées",
          explanation: "Le verbe 'arriver' se conjugue avec l'auxiliaire être, et s'accorde au féminin pluriel."
        },
        {
          id: 2,
          question: `Conjugue à l'imparfait : "Quand j'étais petit, je (jouer) ... beaucoup."`,
          choices: ["jouais", "jouait", "jouai", "jouais"],
          answer: "jouais",
          explanation: "La terminaison à la première personne du singulier de l'imparfait est '-ais'."
        },
        {
          id: 3,
          question: `Conjugue au passé composé : "Nous (finir) ... notre projet."`,
          choices: ["finissions", "avons fini", "sommes finis", "ont fini"],
          answer: "avons fini",
          explanation: "Finir se conjugue avec l'auxiliaire avoir, donnant 'avons fini'."
        },
        {
          id: 4,
          question: `Trouve la forme correcte à l'imparfait pour le verbe 'prendre' : "Vous (prendre) ... le train."`,
          choices: ["prendrez", "preniez", "preniez", "preneriez"],
          answer: "preniez",
          explanation: "À l'imparfait avec 'vous', la terminaison est '-iez' attachée au radical 'pren-'."
        },
        {
          id: 5,
          question: `Choisis l'indicatif futur correct : "Quand vous viendrez, nous (faire) ... la fete."`,
          choices: ["ferons", "ferions", "faisons", "faisions"],
          answer: "ferons",
          explanation: "Dans une subordonnée temporelle introduite par 'quand' au futur, la principale s'écrit au futur (nous ferons)."
        }
      ];
    }
  };

  const currentQuestions = getQuestions();

  const handleAnswerChange = (qId: number, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId.toString()]: option }));
  };

  const checkResults = () => {
    if (submitted) return;
    let correctCount = 0;
    currentQuestions.forEach(q => {
      if (answers[q.id.toString()] === q.answer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / currentQuestions.length) * 20; // scale out of 20
    const key = `${level}_${discipline}_${currentFicheId}`;
    setScores(prev => ({ ...prev, [key]: finalScore }));
    setSubmitted(true);
    setActiveTab('summary');

    if (finalScore >= 16) {
      showMascotMsg(`Fantastique ! Tu as obtenu ${finalScore}/20 aux exercices de ${discipline} ! Tu es un génie ! 🏆🌟`);
    } else if (finalScore >= 10) {
      showMascotMsg(`Moyenne décrochée : ${finalScore}/20 ! C'est bien, continue de t'entraîner ! 💪📖`);
    } else {
      showMascotMsg(`Travail courageux ! ${finalScore}/20. Lis bien les explications pour progresser ! 💡🍀`);
    }
  };

  const resetExercises = () => {
    setAnswers({});
    setSubmitted(false);
    setActiveTab('practice');
  };

  useEffect(() => {
    resetExercises();
  }, [level, discipline, currentFicheId]);

  return (
    <div id="language-exercises-section" className="bg-white rounded-[40px] border-4 border-[var(--primary)] shadow-2xl overflow-hidden">
      {/* Upper banner */}
      <div className="bg-[var(--primary)] text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <BookOpen size={120} />
        </div>
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase bg-white/20 px-3 py-1.5 rounded-full tracking-widest text-[#0c4a6e] font-mono">
            🇹🇳 Programme National Tunisien • Consolidation active
          </span>
          <h2 className="font-baloo text-3xl font-black mt-3 flex items-center gap-2">
            📝 Exercices de Langue
          </h2>
          <p className="text-sm font-bold opacity-90 mt-1 max-w-2xl bg-[#0c4a6e]/15 p-2 rounded-xl mt-3">
            S'entraîner en <span className="underline">grammaire</span>, <span className="underline">orthographe</span>, et <span className="underline">conjugaison</span> adapté au thème : {" "}
            <span className="text-yellow-200 uppercase font-black">"{currentFicheTheme || 'Amitié'}"</span>
          </p>
        </div>
      </div>

      {/* Control panel & Selection */}
      <div className="p-6 bg-slate-50 border-b-2 border-slate-100 flex flex-col lg:flex-row justify-between gap-4 items-center">
        {/* Class Level selection */}
        <div className="flex gap-2 p-1 bg-white border border-slate-200. shadow-sm rounded-2xl">
          {[
            { key: '4eme', label: '🎓 4ème Année' },
            { key: '5eme', label: '🎓 5ème Année' },
            { key: '6eme', label: '🎓 6ème Année' }
          ].map(lvlOpt => (
            <button
              key={lvlOpt.key}
              onClick={() => setLevel(lvlOpt.key as any)}
              className={`px-4 py-2 font-black text-xs uppercase tracking-tight rounded-xl transition-all ${level === lvlOpt.key ? 'bg-[var(--primary)] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {lvlOpt.label}
            </button>
          ))}
        </div>

        {/* Discipline toggles */}
        <div className="flex gap-2 p-1 bg-white border border-slate-200. shadow-sm rounded-2xl">
          {[
            { key: 'grammaire', label: '📐 Grammaire' },
            { key: 'orthographe', label: '✏️ Orthographe' },
            { key: 'conjugaison', label: '⏳ Conjugaison' }
          ].map(dispOpt => (
            <button
              key={dispOpt.key}
              onClick={() => setDiscipline(dispOpt.key as any)}
              className={`px-4 py-2 font-black text-xs uppercase tracking-tight rounded-xl transition-all ${discipline === dispOpt.key ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {dispOpt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab bar for practice or result analysis */}
      {submitted && (
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider border-b-4 transition-colors ${activeTab === 'practice' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-slate-400'}`}
          >
            📋 Mes Réponses
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider border-b-4 transition-colors ${activeTab === 'summary' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}
          >
            🏆 Résultats & Explications
          </button>
        </div>
      )}

      {/* Main interactive area */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'practice' ? (
            <motion.div
              key="practice-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {currentQuestions.map((q, qIdx) => {
                const studentVal = answers[q.id.toString()];
                return (
                  <div key={q.id} className="p-6 bg-white rounded-3xl border-2 border-[#e2e8f0] shadow-sm hover:border-[var(--primary)]/30 transition-all text-left">
                    <div className="flex items-start gap-4">
                      {/* Circle Number */}
                      <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {String(qIdx + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-4 flex-1">
                        <p className="font-serif text-base text-slate-800 font-bold leading-relaxed">
                          {q.question}
                        </p>

                        {/* Interactive Multiple Choices */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.choices.map((choice, cIdx) => {
                            const isChosen = studentVal === choice;
                            let btnStyle = "border-[#e2e8f0] bg-white text-slate-700 hover:bg-slate-50";
                            
                            if (isChosen) {
                              if (submitted) {
                                btnStyle = choice === q.answer 
                                  ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20" 
                                  : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20";
                              } else {
                                btnStyle = "bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20";
                              }
                            } else if (submitted && choice === q.answer) {
                              // Highlighting correct answer if submitted
                              btnStyle = "bg-green-50 border-2 border-green-400 text-green-700";
                            }

                            return (
                              <button
                                key={cIdx}
                                disabled={submitted}
                                onClick={() => handleAnswerChange(q.id, choice)}
                                className={`px-4 py-3 rounded-2xl border-2 font-bold text-xs transition-all flex items-center justify-between text-left ${btnStyle}`}
                              >
                                <span>{choice}</span>
                                {isChosen && (
                                  submitted ? (
                                    choice === q.answer ? <Check size={14} /> : <X size={14} />
                                  ) : (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                  )
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-center">
                <span className="text-[11px] font-bold text-slate-400">
                  ⚠️ Répondre à toutes les questions pour valider ton score !
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={resetExercises}
                    className="px-6 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-600 bg-white rounded-2xl text-xs uppercase font-black tracking-widest flex items-center gap-1 transition-all"
                  >
                    <RefreshCw size={14} /> Réinitialiser
                  </button>
                  
                  <button
                    onClick={checkResults}
                    disabled={Object.keys(answers).length < currentQuestions.length || submitted}
                    className={`px-8 py-3 bg-[var(--primary)] hover:scale-105 active:scale-95 text-white rounded-2xl text-xs uppercase font-black tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-[var(--primary)]/20 ${Object.keys(answers).length < currentQuestions.length || submitted ? 'opacity-50 cursor-not-allowed scale-100' : ''}`}
                  >
                    <BookCheck size={15} /> Corriger mes exercices
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="summary-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8 space-y-8"
            >
              {/* Score Display Ring */}
              <div className="relative inline-block">
                <div className="w-48 h-48 rounded-full border-8 border-slate-100 flex flex-col justify-center items-center bg-white shadow-inner">
                  <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">Note Finale</span>
                  <p className="text-4xl font-black text-slate-800 font-sans mt-1">
                    {scores[`${level}_${discipline}_${currentFicheId}`] ?? 0}
                    <span className="text-2xl text-slate-400">/20</span>
                  </p>
                  <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full uppercase mt-2 tracking-wide">
                    {discipline.toUpperCase()}
                  </span>
                </div>
                {/* Floating star badges */}
                <div className="absolute -top-1 -right-1 p-2 bg-gradient-to-br from-yellow-300 to-amber-500 text-white rounded-full shadow-lg border-2 border-white transform rotate-12">
                  <Star size={16} fill="currentColor" />
                </div>
              </div>

              {/* High School Board feedback */}
              <div className="max-w-xl mx-auto space-y-4">
                <h3 className="font-baloo text-2xl font-black text-slate-800">
                  {((scores[`${level}_${discipline}_${currentFicheId}`] ?? 0) >= 16) && "✨ Travail Exceptionnel ! Tu es un champion ! ✨"}
                  {((scores[`${level}_${discipline}_${currentFicheId}`] ?? 0) >= 10 && (scores[`${level}_${discipline}_${currentFicheId}`] ?? 0) < 16) && "👍 Bon travail ! Tu as la moyenne ! 👍"}
                  {((scores[`${level}_${discipline}_${currentFicheId}`] ?? 0) < 10) && "📚 Continue d'apprendre ! Tu vas y arriver ! 📚"}
                </h3>
                <p className="text-xs font-bold text-slate-500 max-w-lg mx-auto">
                  Vérifie ci-dessous les explications didactiques étape par étape pour t'améliorer ou revoir les règles de grammaire.
                </p>
              </div>

              {/* Explanations Accordions */}
              <div className="space-y-4 text-left max-w-3xl mx-auto">
                {currentQuestions.map((q, idx) => {
                  const selectVal = answers[q.id.toString()];
                  const correctness = selectVal === q.answer;

                  return (
                    <div key={q.id} className={`p-5 rounded-3xl border ${correctness ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/20'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-serif font-black text-[10px] ${correctness ? 'bg-green-500' : 'bg-red-500'}`}>
                          {correctness ? '✓' : '✗'}
                        </span>
                        <div className="space-y-1.5">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Question {idx + 1}</p>
                          <p className="text-sm font-bold text-slate-800">{q.question}</p>
                          <p className="text-xs text-slate-600">
                            <strong>Ta réponse :</strong> <span className={correctness ? 'text-green-600' : 'text-red-500 font-extrabold'}>{selectVal || "(Aucune)"}</span>
                          </p>
                          {!correctness && (
                            <p className="text-xs text-green-700">
                              <strong>Réponse attendue :</strong> {q.answer}
                            </p>
                          )}
                          <div className="pt-2 border-t border-dashed border-slate-200 mt-2 text-xs italic text-slate-500">
                            <strong>Règle de langue :</strong> {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    resetExercises();
                  }}
                  className="px-8 py-3 bg-[var(--primary)] hover:scale-105 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all"
                >
                  🔄 Essayer à nouveau
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
