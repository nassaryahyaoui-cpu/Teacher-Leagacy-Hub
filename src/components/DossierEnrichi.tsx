import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PenTool, 
  Volume2, 
  Check, 
  RefreshCw, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Trash2, 
  Save, 
  ArrowRight, 
  Plus, 
  Minus, 
  Edit2, 
  AlertCircle, 
  HelpCircle, 
  VolumeX, 
  BookMarked,
  Layers,
  CheckCircle2,
  FileText,
  MessageSquare
} from 'lucide-react';

interface DossierEnrichiProps {
  dossierAnswers: Record<string, string>;
  setDossierAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isOnline: boolean;
  showMascotMsg: (text: string) => void;
  currentUser: { name: string; username: string; type: string };
  selectedFont: string;
  setSelectedFont: (font: string) => void;
}

// ----------------------------------------------------
// THEMATIC CONTENT & DATA DEFINITIONS REPRESENTING 
// THE UPLOADED CURRICULUM DOCS
// ----------------------------------------------------

interface ThemeContent {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  primaryColor: string;
  defaultText: string;
  
  // Lecture-Compréhension Questions
  comprehension: {
    barreFaux: { text: string; isCorrect: boolean }[];
    matching: { question: string; answer: string; options: string[] }[];
    synonyms: { question: string; sentence: string; correct: string; placeholder: string }[];
    explanation: { text: string; question: string; options: string[]; correctAns: string };
    questionsEcrits: { id: string; label: string; placeholder: string; originalAnswerText: string }[];
    textChangeProof: { question: string; placeholder: string; originalText: string };
  };

  // Fiches de Langue (Grammaire, Conjugaison, Orthographe, Vocabulaire)
  langue: {
    grammaire: {
      instruction: string;
      items: { phrase: string; targetGns: string }[];
    };
    conjugaison: {
      instruction: string;
      items: { textPre: string; verb: string; textPost: string; correct: string }[];
    };
    orthographe: {
      instruction: string;
      items: { singular: string; pluralCorrect: string }[];
    };
    vocabulaireWordList: {
      list: string[];
      textPattern: string;
      words: string[];
      instruction: string;
    };
  };

  // Dictée Options
  dictee: {
    fullText: string;
    words: string[];
    gapText: string;
  };

  // Rédaction Subject Context
  redaction: {
    title: string;
    description: string;
    type: 'images' | 'guided' | 'dialogue';
    steps?: { id: number; label: string; details: string }[];
    prompts?: { id: string; text: string; placeholder: string; prefix?: string }[];
  };
}

const THEME_DATA: Record<string, ThemeContent> = {
  carnaval: {
    id: 'carnaval',
    title: "Le Carnaval du Village",
    subtitle: "Évaluation Trimestrielle • Thème Fête & Déguisements",
    icon: "🎉",
    colorClass: "border-purple-300 bg-purple-50/50 text-purple-900",
    primaryColor: "#8B5CF6",
    defaultText: `Le jour de la grande fête du village approche. La municipalité commence à nettoyer les rues et à décorer l’avenue principale où va défiler le carnaval. Tout le monde se prépare avec joie car les fêtes sont rares chez nous.
Mes camarades et moi parlons de nos déguisements.
– Je serai une reine, dit Jeanne. Je porterai une longue robe blanche et indigo, des chaussures argentées et j’aurai une belle couronne en diamants.
– Moi, Je voudrais porter le costume de Zorro. Je porterai un masque et une cape noire et j’aurai un fouet à la main, ajoute Marc.
– Et toi, Julien, as-tu réfléchi à ton déguisement, demande Jeanne.
– Hun...! J’hésite encore entre un costume de clown et celui d’un agent de police, répond le garçon.
– Un clown est beaucoup plus amusant, remarque Marc. Il est toujours gai et son habit est tout en couleur.
Le jour du carnaval, notre village est devenu méconnaissable. Toutes les rues sont joliment décorées et brillent de mille éclats. Tous les habitants, petits et grands, assistent au défilé, dégustent de succulents plats et boivent des boissons à tous les goûts. Le jour du carnaval est une journée inoubliable pour tous les villageois.`,
    
    comprehension: {
      barreFaux: [
        { text: "Tout le village se prépare pour le carnaval.", isCorrect: true }, // Vrai
        { text: "Les enfants ne participent pas au carnaval.", isCorrect: false }, // Faux, les enfants participent
        { text: "Le carnaval défile dans l’avenue principale.", isCorrect: true } // Vrai
      ],
      matching: [
        { question: "Jeanne", answer: "As-tu réfléchi à ton déguisement ?", options: ["As-tu réfléchi à ton déguisement ?", "Un clown est beaucoup plus amusant", "J'hésite encore"] },
        { question: "Marc", answer: "Un clown est beaucoup plus amusant", options: ["As-tu réfléchi à ton déguisement ?", "Un clown est beaucoup plus amusant", "J'hésite encore"] },
        { question: "Julien", answer: "J'hésite encore", options: ["As-tu réfléchi à ton déguisement ?", "Un clown est beaucoup plus amusant", "J'hésite encore"] }
      ],
      synonyms: [
        { question: "habitants du village", sentence: "Les habitants du village se régalent de savoureux plats.", correct: "villageois", placeholder: "Les ... de l'histoire" },
        { question: "se régalent de", sentence: "Les habitants du village se régalent de savoureux plats.", correct: "dégustent", placeholder: "Ils ... de bons plats" },
        { question: "savoureux", sentence: "Les habitants du village se régalent de savoureux plats.", correct: "succulents", placeholder: "Des plats ... et délicieux" }
      ],
      explanation: {
        text: "Le carnaval est inoubliable",
        question: "Entoure la bonne explication. 'Le carnaval est inoubliable' veut dire :",
        options: [
          "Le carnaval est fatigant",
          "Le carnaval est vite oublié",
          "Le carnaval ne sera pas oublié"
        ],
        correctAns: "Le carnaval ne sera pas oublié"
      },
      questionsEcrits: [
        { id: 'julien_choix', label: "Est-ce que Julien a déjà choisi son costume ?", placeholder: "Rédige une phrase complète du texte...", originalAnswerText: "Non, Julien n'a pas encore choisi. Il hésite encore entre un costume de clown et celui d’un agent de police." },
        { id: 'fetes_rares', label: "Est-ce que les villageois font toujours des fêtes ?", placeholder: "Régide une phrase complète du texte...", originalAnswerText: "Non, les villageois ne font pas toujours des fêtes car les fêtes sont rares chez eux." }
      ],
      textChangeProof: {
        question: "« Le jour du carnaval, le village a beaucoup changé ». Écris la phrase du texte qui le montre :",
        placeholder: "Récris précisément la phrase magique du texte...",
        originalText: "Le jour du carnaval, notre village est devenu méconnaissable."
      }
    },

    langue: {
      grammaire: {
        instruction: "Trouve et récris le Groupe Nominal Sujet (GNS) de chaque phrase :",
        items: [
          { phrase: "Le jour de la grande fête du village approche.", targetGns: "Le jour de la grande fête du village" },
          { phrase: "La municipalité commence à nettoyer les rues.", targetGns: "La municipalité" },
          { phrase: "Mes camarades et moi parlons de nos déguisements.", targetGns: "Mes camarades et moi" }
        ]
      },
      conjugaison: {
        instruction: "Conjugue les verbes entre parenthèses au présent de l'indicatif :",
        items: [
          { textPre: "Tous les habitants ", verb: "assister", textPost: " au magnifique défilé.", correct: "assistent" },
          { textPre: "Nous ", verb: "déguster", textPost: " de succulents gâteaux.", correct: "dégustons" },
          { textPre: "Jeanne ", verb: "choisir", textPost: " une belle robe blanche.", correct: "choisit" },
          { textPre: "Tu ", verb: "réfléchir", textPost: " à ton déguisement de fête.", correct: "réfléchis" }
        ]
      },
      orthographe: {
        instruction: "Mets les expressions au pluriel :",
        items: [
          { singular: "un costume rouge", pluralCorrect: "des costumes rouges" },
          { singular: "une longue robe blanche", pluralCorrect: "des longues robes blanches" },
          { singular: "la rue décorée", pluralCorrect: "les rues décorées" },
          { singular: "un succulent plat", pluralCorrect: "des succulents plats" }
        ]
      },
      vocabulaireWordList: {
        instruction: "Le texte magique à trous de Juliette. Complète le paragraphe avec les mots appropriés :",
        list: ["repas", "assiettes", "verres", "fleurs", "parents"],
        textPattern: "Juliette prépare la table pour le [1] . Elle pose soigneusement les assiettes, les [2] et les couteaux. Ensuite, elle décore magnifiquement le milieu de la table avec de jolies [3] . La fillette et ses [4] partagent leur repas en famille dans la joie.",
        words: ["repas", "verres", "fleurs", "parents"]
      }
    },

    dictee: {
      fullText: "Tout le monde se prépare avec joie pour le carnaval. Les rues sont joliment décorées et les enfants portent des déguisements magnifiques. Quelle journée inoubliable !",
      words: ["joie", "carnaval", "décorées", "enfants", "déguisements", "inoubliable"],
      gapText: "Tout le monde se prépare avec __ pour le __. Les rues sont joliment __ et les __ portent des __ magnifiques. Quelle journée __ !"
    },

    redaction: {
      title: "Récit à partir d'images : Le Parc des Attractions",
      description: "Sujet 1 : Ce sont les vacances de printemps. La famille Duval décide de passer la journée au parc d'attractions. Regarde les étapes ci-dessous et écris un récit structuré d'au moins 4 à 6 phrases. Intègre de jolis éléments descriptifs (les rires, les ballons, les couleurs). Écris proprement sur le cahier Seyès !",
      type: 'images',
      steps: [
        { id: 1, label: "Étape 1 : L'Arrivée", details: "Arrivée de la famille au grand parc d'attractions et découverte des manèges." },
        { id: 2, label: "Étape 2 : Les Voitures", details: "Les petits enfants montent tout joyeux à bord des petites voitures." },
        { id: 3, label: "Étape 3 : Sensations", details: "Les rires, les cris et les sensations fortes dans les manèges qui tournent." },
        { id: 4, label: "Étape 4 : Douceur", details: "La maman attentionnée offre des ballons colorés et des barbes à papa roses." }
      ]
    }
  },

  chat_botte: {
    id: 'chat_botte',
    title: "Le Chat Botté",
    subtitle: "Inspiré des Contes de Charles Perrault • Lecture Suivie",
    icon: "🐈",
    colorClass: "border-amber-305 bg-amber-50/50 text-amber-900",
    primaryColor: "#EBB305",
    defaultText: `Il était une fois un meunier qui avait trois fils. À sa mort, l'aîné reçoit le moulin, le deuxième reçoit un âne, et le plus jeune reçoit seulement un chat. Le jeune homme est triste mais le chat lui dit : « Donne-moi des bottes et un sac, et tu verras ! » Le chat attrape des lapins et des perdrix qu'il offre au roi en disant : « De la part du marquis de Carabas ! »
Un jour, le roi passe près de la rivière. Le chat crie : « Au secours ! Le marquis de Carabas se noie ! » Le roi sauve le jeune homme et lui prête de beaux habits. Le chat court devant et menace les paysans : « Dites que ces terres appartiennent au marquis de Carabas ! » Le roi est impressionné et donne sa fille en mariage au marquis. Le chat devient un grand seigneur et il ne chasse plus que pour s'amuser.`,
    
    comprehension: {
      barreFaux: [
        { text: "Le fils aîné hérite d'un magnifique château.", isCorrect: false },
        { text: "Le plus jeune fils hérite seulement d'un chat.", isCorrect: true },
        { text: "Le roi donne sa fille en mariage au marquis.", isCorrect: true }
      ],
      matching: [
        { question: "Le fils aîné", answer: "Reçoit le moulin", options: ["Reçoit le moulin", "Reçoit un âne", "Reçoit seulement un chat"] },
        { question: "Le deuxième fils", answer: "Reçoit un âne", options: ["Reçoit le moulin", "Reçoit un âne", "Reçoit seulement un chat"] },
        { question: "Le fils cadet", answer: "Reçoit seulement un chat", options: ["Reçoit le moulin", "Reçoit un âne", "Reçoit seulement un chat"] }
      ],
      synonyms: [
        { question: "meunier", sentence: "L'homme travaille au moulin.", correct: "meunier", placeholder: "Le métier du père..." },
        { question: "roi", sentence: "Le chef suprême du royaume passe en carrosse.", correct: "roi", placeholder: "Le chef majestueux..." },
        { question: "habits", sentence: "Le chat enfile de très vêtements.", correct: "bottes", placeholder: "Pour marcher, il chausse ses..." }
      ],
      explanation: {
        text: "Le marquis de Carabas",
        question: "Qui est le marquis de Carabas inventé par le chat ?",
        options: [
          "Un grand empereur venu d'Afrique",
          "Le jeune fils héritier du chat",
          "Un faux titre de noblesse pour son maître"
        ],
        correctAns: "Un faux titre de noblesse pour son maître"
      },
      questionsEcrits: [
        { id: 'cadet_herit', label: "Que reçoit le fils cadet du meunier ?", placeholder: "Rédige d'après le conte...", originalAnswerText: "Le fils cadet du meunier reçoit seulement un chat." },
        { id: 'chat_demat', label: "Que demande le chat à son maître pour l'aider ?", placeholder: "Écris la formule exacte...", originalAnswerText: "Le chat demande à son maître des bottes et un sac." }
      ],
      textChangeProof: {
        question: "Quel titre de noblesse le chat invente-t-il fictivement pour son maître ?",
        placeholder: "Récris le titre inventé...",
        originalText: "Le marquis de Carabas"
      }
    },

    langue: {
      grammaire: {
        instruction: "Retrouve le Groupe Nominal Sujet (GNS) de chaque phrase :",
        items: [
          { phrase: "Le chat attrape des lapins.", targetGns: "Le chat" },
          { phrase: "Le jeune homme est triste.", targetGns: "Le jeune homme" },
          { phrase: "Les paysans travaillent la terre.", targetGns: "Les paysans" }
        ]
      },
      conjugaison: {
        instruction: "Conjugue les verbes du conte au présent de l'indicatif :",
        items: [
          { textPre: "Le chat (attraper) ", verb: "attraper", textPost: " des bêtes sauvages.", correct: "attrape" },
          { textPre: "Le gentil roi (donner) ", verb: "donner", textPost: " de beaux habits chauds.", correct: "donne" },
          { textPre: "Les paysans (dire) ", verb: "dire", textPost: " la vérité au roi.", correct: "disent" }
        ]
      },
      orthographe: {
        instruction: "Écris ces expressions au pluriel (fais bien attention aux adjectifs !) :",
        items: [
          { singular: "un chat", pluralCorrect: "des chats" },
          { singular: "un beau habit", pluralCorrect: "de beaux habits" },
          { singular: "le lapin sauvage", pluralCorrect: "les lapins sauvages" }
        ]
      },
      vocabulaireWordList: {
        instruction: "Complète le texte résumé avec les mots correspondants de la boîte :",
        list: ["meunier", "bottes", "roi", "marquis", "terres"],
        textPattern: "Le [1] a trois fils. Le chat rusé demande des [2] et un vieux sac. Il offre de succulents lapins au [3] . Il invente ensuite le magnifique titre de [4] de Carabas. Et il ordonne de déclarer que toutes les [5] lui appartiennent.",
        words: ["meunier", "bottes", "roi", "marquis", "terres"]
      }
    },

    dictee: {
      fullText: "Le meunier laisse un chat à son fils cadet. L'animal enfile ses bottes noires et court offrir des lapins au roi du royaume.",
      words: ["meunier", "chat", "cadet", "bottes", "offrir", "roi"],
      gapText: "Le __ laisse un __ à son fils __. L'animal enfile ses __ noires et court __ des lapins au __."
    },

    redaction: {
      title: "Récit ordonné : L'Ascension du Chat Botté",
      description: "Sujet : Remets les mots et phrases de l'histoire du Chat Botté dans le bon ordre chronologique. Puis rédige un petit texte romancé décrivant comment le chat a sauvé son maître en faisant croire qu'il se noyait dans la rivière !",
      type: 'dialogue' // we can let them write creative dialogue or order-and-write inside space
    }
  },

  pinocchio: {
    id: 'pinocchio',
    title: "Le Pantin Pinocchio",
    subtitle: "D'après les Aventures de Carlo Collodi • Conte d'Éveil",
    icon: "🪵",
    colorClass: "border-sky-300 bg-sky-50/50 text-sky-900",
    primaryColor: "#0EA5E9",
    defaultText: `Il était une fois un vieux menuisier nommé Geppetto. Il fabrique une marionnette en bois qu'il appelle Pinocchio. Le soir, une fée bleue apparaît et donne vie à la marionnette. La fée dit : « Si tu es sage et que tu vas à l'école, tu deviendras un vrai garçon. » Pinocchio promet d'être sage.
Mais sur le chemin de l'école, il rencontre un renard et un chat qui le convainquent d'aller au théâtre de marionnettes. Là, il gagne cinq pièces d'or. En rentrant, Pinocchio rencontre un cocher qui l'emmène au Pays des Jouets. Il s'amuse beaucoup mais un jour, il se réveille avec de longues oreilles d'âne ! Pinocchio s'enfuit et retourne chez Geppetto. Il promet d'être sage. La fée bleue revient et le transforme en vrai garçon. Geppetto est très heureux.`,
    
    comprehension: {
      barreFaux: [
        { text: "Geppetto est un sculpteur sur marbre.", isCorrect: false },
        { text: "La fée bleue donne vie au pantin de bois.", isCorrect: true },
        { text: "Pinocchio s'amuse tellement qu'il finit par avoir des oreilles d'ours.", isCorrect: false }
      ],
      matching: [
        { question: "Geppetto", answer: "Le vieux menuisier", options: ["Le vieux menuisier", "La fée magique", "Le pantin de bois"] },
        { question: "Pinocchio", answer: "Le pantin de bois", options: ["Le vieux menuisier", "La fée magique", "Le pantin de bois"] },
        { question: "La fée bleue", answer: "La fée magique", options: ["Le vieux menuisier", "La fée magique", "Le pantin de bois"] }
      ],
      synonyms: [
        { question: "Geppetto", sentence: "Le menuisier façonne le bois tendre.", correct: "Geppetto", placeholder: "Le prénom du père..." },
        { question: "Fée bleue", sentence: "La magicienne bienveillante apparaît la nuit.", correct: "fée", placeholder: "Une gentille ..." },
        { question: "marionnette", sentence: "Il fabrique un merveilleux pantin.", correct: "marionnette", placeholder: "Le pantin ou ..." }
      ],
      explanation: {
        text: "La promesse de la fée",
        question: "Que promet la fée bleue à Pinocchio s'il est très sage ?",
        options: [
          "De gagne de nombreux coffrets d'or",
          "De devenir un vrai petit garçon",
          "De rester une poupée de bois pour toujours"
        ],
        correctAns: "De devenir un vrai petit garçon"
      },
      questionsEcrits: [
        { id: 'fabricant_pin', label: "Qui fabrique Pinocchio ?", placeholder: "Rédige d'après le livre...", originalAnswerText: "C'est Geppetto, le vieux menuisier, qui fabrique Pinocchio." },
        { id: 'gain_theatre', label: "Que gagne Pinocchio au théâtre de marionnettes ?", placeholder: "Spécifie la somme reçue...", originalAnswerText: "Pinocchio gagne cinq pièces d'or au théâtre de marionnettes." }
      ],
      textChangeProof: {
        question: "En quoi Pinocchio est-il transformé à la fin de son aventure ?",
        placeholder: "Récris le dénouement...",
        originalText: "en vrai garçon"
      }
    },

    langue: {
      grammaire: {
        instruction: "Retrouve le Groupe Nominal Sujet (GNS) du texte :",
        items: [
          { phrase: "Geppetto fabrique une marionnette.", targetGns: "Geppetto" },
          { phrase: "Une fée bleue apparaît le soir.", targetGns: "Une fée bleue" },
          { phrase: "Ils promettent d'être de braves élèves.", targetGns: "Ils" }
        ]
      },
      conjugaison: {
        instruction: "Conjugue les verbes du passage au présent de l'indicatif :",
        items: [
          { textPre: "Le pantin (fabriquer) ", verb: "fabriquer", textPost: " des bêtises.", correct: "fabrique" },
          { textPre: "La fée (donner) ", verb: "donner", textPost: " de précieux conseils.", correct: "donne" },
          { textPre: "Les enfants (promettre) ", verb: "promettre", textPost: " d'étudier dur.", correct: "promettent" }
        ]
      },
      orthographe: {
        instruction: "Transforme ces groupes nominaux au pluriel :",
        items: [
          { singular: "un vrai garçon", pluralCorrect: "des vrais garçons" },
          { singular: "une marionnette", pluralCorrect: "des marionnettes" },
          { singular: "une longue oreille", pluralCorrect: "des longues oreilles" }
        ]
      },
      vocabulaireWordList: {
        instruction: "Remplis chaque trou par le bon mot de vocabulaire de Pinocchio :",
        list: ["fée", "bois", "école", "pièces", "oreilles"],
        textPattern: "Geppetto fabrique Pinocchio en [1] robuste. La [2] bleue apparaît le soir et lui donne vie. Pour grandir, il doit aller à l' [3] . Mais il s'enfuit et gagne cinq [4] d'or au spectacle. Plus tard, il se réveille avec des longues [5] d'âne !",
        words: ["bois", "fée", "école", "pièces", "oreilles"]
      }
    },

    dictee: {
      fullText: "Une fée bleue ordonne à Pinocchio d'aller sagement à l'école pour devenir un vrai garçon. Mais le pantin préfère jouer.",
      words: ["fée", "bleue", "sagement", "école", "garçon", "pantin"],
      gapText: "Une __ __ ordonne à Pinocchio d'aller __ à l'__ pour devenir un vrai __. Mais le __ préfère jouer."
    },

    redaction: {
      title: "Récit guidé / Dialogue : La Visite chez le Médecin & Dialogue du Requin",
      description: "Sujet 2 : Marc a passé une très mauvaise nuit. Une douleur de gorge et de fortes brûlures à la poitrine l'empêchent de fermer l'œil. Raconte sa journée chez le médecin en complétant les étapes ci-dessous. Rédige ton texte en écriture cursive scolaire sur ta feuille Seyès !",
      type: 'guided',
      prompts: [
        { id: 'medecin_lieu', text: "1. Où va Marc le lendemain matin ?", placeholder: "Le lendemain matin, Marc se rend...", prefix: "Le lendemain, " },
        { id: 'medecin_examen', text: "2. Que fait d'abord le médecin pour l'ausculter ?", placeholder: "D'abord, le médecin...", prefix: "D'abord, " },
        { id: 'medecin_gorge', text: "3. Que regarde-t-il ensuite ?", placeholder: "Ensuite, il examine sa gorge...", prefix: "Puis, " },
        { id: 'medecin_ordonnance', text: "4. Qu'écrit-il enfin ?", placeholder: "Enfin, le médecin rédige...", prefix: "Enfin, " },
        { id: 'medecin_pharmacie', text: "5. Où se rend Marc en sortant du cabinet ?", placeholder: "En sortant, Marc va à...", prefix: "Après la consultation, " }
      ]
    }
  }
};

export default function DossierEnrichi({
  dossierAnswers,
  setDossierAnswers,
  isOnline,
  showMascotMsg,
  currentUser,
  selectedFont,
  setSelectedFont
}: DossierEnrichiProps) {
  
  // Tab within the enriched space
  const [activeTheme, setActiveTheme] = useState<'carnaval' | 'chat_botte' | 'pinocchio'>('carnaval');
  const [activeCategory, setActiveCategory] = useState<'lecture' | 'langue' | 'dictee' | 'redaction'>('lecture');
  
  const currentContent = useMemo(() => THEME_DATA[activeTheme], [activeTheme]);
  const primaryColor = currentContent.primaryColor;

  const [manualShuffleSeed, setManualShuffleSeed] = useState(0);

  const shuffledVocabList = useMemo(() => {
    const original = currentContent.langue.vocabulaireWordList.list;
    let list = [...original];
    
    // Fisher-Yates
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    
    // Ensure it is not in the exact same order if length > 1
    let isSame = true;
    if (list.length > 1) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] !== original[i]) {
          isSame = false;
          break;
        }
      }
      if (isSame) {
        list.reverse();
      }
    }
    return list;
  }, [activeTheme, currentContent, manualShuffleSeed]);

  // Custom user texts override (personalized text)
  const [customTexts, setCustomTexts] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('jugurtha_custom_dossier_texts');
    return saved ? JSON.parse(saved) : {};
  });

  const [isEditingText, setIsEditingText] = useState(false);
  const [editingValue, setEditingValue] = useState('');

  // When changing theme or opening edit, sync value
  useEffect(() => {
    setEditingValue(customTexts[activeTheme] !== undefined ? customTexts[activeTheme] : currentContent.defaultText);
    setIsEditingText(false);
  }, [activeTheme, customTexts, currentContent]);

  const saveCustomText = () => {
    const updated = { ...customTexts, [activeTheme]: editingValue };
    setCustomTexts(updated);
    localStorage.setItem('jugurtha_custom_dossier_texts', JSON.stringify(updated));
    setIsEditingText(false);
    showMascotMsg("Parfait ! Le texte de lecture a été personnalisé d'après ton imagination ! ✏️📖");
  };

  const resetCustomText = () => {
    const updated = { ...customTexts };
    delete updated[activeTheme];
    setCustomTexts(updated);
    localStorage.setItem('jugurtha_custom_dossier_texts', JSON.stringify(updated));
    setEditingValue(currentContent.defaultText);
    setIsEditingText(false);
    showMascotMsg("Le texte de lecture a été réinitialisé d'après l'évaluation d'origine. 🔄");
  };

  const displayedText = customTexts[activeTheme] !== undefined ? customTexts[activeTheme] : currentContent.defaultText;

  // Reading Options
  const [fontSize, setFontSize] = useState(16);
  const [ttsSpeed, setTtsSpeed] = useState<0.6 | 0.8 | 1>(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Dictation attempts trackers
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [dictationValues, setDictationValues] = useState<Record<string, string>>({});
  const [showDictationCheck, setShowDictationCheck] = useState<Record<string, boolean>>({});

  // Grammar & Synonym answers
  const [evaluationFeedback, setEvaluationFeedback] = useState<Record<string, { isCorrect?: boolean; checked: boolean }>>({});

  // Reset TTS speaking
  const stopTts = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const playTts = (text: string) => {
    if (!window.speechSynthesis) return;
    stopTts();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = ttsSpeed;
    
    // Select a friendly, natural French narrator voice if available
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

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      stopTts();
    };
  }, []);

  const handleSpeechWord = (word: string) => {
    playTts(word);
  };

  // Answer state modifiers
  const updateAnswer = (key: string, val: string) => {
    setDossierAnswers(prev => ({
      ...prev,
      [`enrichi_${activeTheme}_${key}`]: val
    }));
  };

  const getAnswerValue = (key: string) => {
    return dossierAnswers[`enrichi_${activeTheme}_${key}`] || '';
  };

  // Vocab cloze check
  const checkVocabTrous = () => {
    const listCount = currentContent.langue.vocabulaireWordList.words.length;
    let errors = 0;
    for (let i = 0; i < listCount; i++) {
      const correct = currentContent.langue.vocabulaireWordList.words[i];
      const val = getAnswerValue(`vocab_trou_${i}`).trim().toLowerCase();
      if (val !== correct.toLowerCase()) {
        errors++;
      }
    }
    if (errors === 0) {
      showMascotMsg("FÉLICITATIONS ! Ton exercice de vocabulaire de Juliette est 100% correct ! 🏆✨");
    } else {
      showMascotMsg(`Il y a ${errors} erreur(s) dans ton texte à trous. Relis bien et aide-toi de la boîte à mots ! 🧐`);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Theme Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.values(THEME_DATA).map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => {
                setActiveTheme(theme.id as any);
                stopTts();
                showMascotMsg(`Travaillons sur la thématique : ${theme.title} ! ${theme.icon}`);
              }}
              style={{ borderColor: isActive ? theme.primaryColor : undefined }}
              className={`p-5 rounded-[24px] border-4 text-left transition-all relative overflow-hidden flex items-center gap-4 ${
                isActive 
                  ? 'bg-white shadow-xl scale-102 font-black' 
                  : 'bg-stone-50/70 hover:bg-white border-stone-200 text-stone-600'
              }`}
            >
              <div 
                style={{ backgroundColor: isActive ? `${theme.primaryColor}15` : undefined }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-stone-100"
              >
                {theme.icon}
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-widest leading-none">Cahier thématique</span>
                <h4 className="font-baloo text-sm font-black text-stone-800 truncate leading-tight mt-0.5">{theme.title}</h4>
                <p className="text-[10px] text-stone-500 truncate leading-none">{theme.subtitle}</p>
              </div>
              {isActive && (
                <div 
                  style={{ backgroundColor: theme.primaryColor }}
                  className="absolute bottom-0 left-0 right-0 h-1.5"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Menu sub-categories inside the theme */}
      <div className="flex flex-wrap gap-2.5 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200">
        {[
          { key: 'lecture', label: "📖 Lecture & Compréhension", color: "from-purple-500 to-indigo-600 text-purple-600" },
          { key: 'langue', label: "🛠️ Fiches de Langue", color: "from-sky-500 to-blue-600 text-sky-600" },
          { key: 'dictee', label: "🎙️ Dictée d'École", color: "from-amber-500 to-orange-600 text-amber-600" },
          { key: 'redaction', label: "✍️ Rédaction Seyès", color: "from-emerald-500 to-teal-600 text-emerald-600" }
        ].map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key as any);
                stopTts();
                showMascotMsg(`Section ouverte : ${cat.label} ! ✨`);
              }}
              style={{
                backgroundColor: isActive ? primaryColor : undefined,
                color: isActive ? '#fff' : undefined,
              }}
              className={`flex-1 min-w-[140px] py-3.5 px-5 rounded-xl font-baloo text-xs font-black uppercase tracking-wider text-center transition-all ${
                isActive 
                  ? 'text-white shadow-md shadow-indigo-500/10 scale-102' 
                  : 'text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 shadow-sm border border-stone-150'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Render Area with AnimatePresence */}
      <div className="bg-white rounded-[32px] border-2 border-stone-200 p-6 md:p-10 shadow-sm min-h-[460px] relative overflow-hidden">
        
        {/* Accent strip */}
        <div style={{ backgroundColor: primaryColor }} className="absolute top-0 left-0 right-0 h-2" />

        <AnimatePresence mode="wait">
          {activeCategory === 'lecture' && (
            <motion.div 
              key="lecture" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="font-baloo text-2xl font-black text-stone-800">📖 L'Atelier de Lecture Active</h3>
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-0.5">Français 4ème • Écoute, personnalisation & compréhension</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopTts();
                      } else {
                        playTts(displayedText);
                      }
                    }}
                    style={{ backgroundColor: isSpeaking ? '#EF4444' : primaryColor }}
                    className="flex items-center gap-2 px-4 py-2 text-white font-baloo font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all active:scale-95 hover:brightness-110"
                  >
                    {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    {isSpeaking ? "Arrêter l'audition" : "Auditionner le récit"}
                  </button>

                  <button
                    onClick={() => setIsEditingText(!isEditingText)}
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-stone-250 hover:bg-stone-50 text-stone-600 font-baloo font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    <Edit2 size={14} />
                    {customTexts[activeTheme] !== undefined ? "Modifier mon texte personnalisé" : "Personnaliser le texte de base"}
                  </button>
                </div>
              </div>

              {/* Edit text drawer */}
              {isEditingText && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl p-4 space-y-3"
                >
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">✍️ Saisis ton texte personnalisé pour remplacer le texte d'origine :</label>
                  <textarea
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    rows={8}
                    className="w-full bg-white p-4 border border-stone-200 rounded-xl outline-none focus:border-stone-400 font-serif text-sm leading-relaxed"
                  />
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={saveCustomText}
                      className="px-4 py-2 bg-green-600 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Enregistrer mon récit 💾
                    </button>
                    {customTexts[activeTheme] !== undefined && (
                      <button
                        onClick={resetCustomText}
                        className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-stone-300 transition-colors"
                      >
                        Restaurer l'original d'évaluation 🔄
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Story box */}
              <div className="relative">
                {/* Page paper structure */}
                <div className="bg-[#FAF7F2] p-8 md:p-12 rounded-[28px] border-2 border-stone-300/60 shadow-inner relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-20 h-20 bg-stone-300/10 rounded-bl-full pointer-events-none" />
                  
                  {/* Reading Controls */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-500 font-bold">
                    <span>Vitesse :</span>
                    <button onClick={() => setTtsSpeed(0.6)} className={`px-1.5 rounded ${ttsSpeed === 0.6 ? 'bg-stone-800 text-white' : 'hover:bg-stone-100'}`}>Lent</button>
                    <button onClick={() => setTtsSpeed(0.8)} className={`px-1.5 rounded ${ttsSpeed === 0.8 ? 'bg-stone-800 text-white' : 'hover:bg-stone-100'}`}>Moyen</button>
                    <button onClick={() => setTtsSpeed(1)} className={`px-1.5 rounded ${ttsSpeed === 1 ? 'bg-stone-800 text-white' : 'hover:bg-stone-100'}`}>Rapide</button>
                  </div>

                  <div 
                    className="font-serif italic text-lg md:text-xl text-stone-800 leading-[2.1] text-justify space-y-3 whitespace-pre-line"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {displayedText}
                  </div>
                </div>

                {/* Font adjustments */}
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setFontSize(Math.max(14, fontSize - 1))} className="p-1 px-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-black text-stone-500 hover:text-stone-700">- A</button>
                  <button onClick={() => setFontSize(Math.min(26, fontSize + 1))} className="p-1 px-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs font-black text-stone-500 hover:text-stone-700">+ A</button>
                </div>
              </div>

              {/* Comprehension Questions Card */}
              <div className="space-y-6 pt-6 border-t border-stone-150">
                <h4 className="font-baloo text-xl font-black text-stone-800 flex items-center gap-2">
                  <HelpCircle size={20} className="text-stone-500" />
                  🧠 Exercices d'Analyse Littéraire & Compréhension
                </h4>

                {/* Question 1: Barre ce qui est faux / True/False */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                  <p className="text-xs font-black uppercase text-stone-400 tracking-wider leading-none">Exercice 1 : Je coche l'évaluation correcte (Vrai ou Faux)</p>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-stone-700 flex-1">Coche UNIQUEMENT les phrases qui sont conformes au texte de l'évaluation :</p>
                    <button
                      type="button"
                      onClick={() => playTts("Coche uniquement les phrases qui sont conformes au texte de l'évaluation.")}
                      className="p-1 px-2.5 bg-white text-stone-500 hover:text-stone-850 rounded-lg shadow-sm border border-stone-205 text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                      title="Écouter la consigne 🔊"
                    >
                      🔊 Consigne
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {currentContent.comprehension.barreFaux.map((item, idx) => {
                      const ansKey = `barre_faux_${idx}`;
                      const isChecked = getAnswerValue(ansKey) === 'true';
                      return (
                        <div key={idx} className="relative flex flex-col pt-1">
                          <button
                            role="checkbox"
                            aria-checked={isChecked}
                            onClick={() => {
                              const nextVal = isChecked ? 'false' : 'true';
                              updateAnswer(ansKey, nextVal);
                              if (item.isCorrect && nextVal === 'true') {
                                showMascotMsg("Exact ! Cette affirmation est bien exacte et tirée du texte. 👍🔍");
                              } else if (!item.isCorrect && nextVal === 'true') {
                                showMascotMsg("Attention ! C'est une fausse affirmation, n'oublie pas de la laisser décochée ! ⚠️");
                              }
                            }}
                            className={`p-4 rounded-xl border-2 text-left transition-all h-full ${
                              isChecked
                                ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm'
                                : 'bg-white border-stone-200 hover:border-stone-350 text-stone-600'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? 'bg-blue-500 border-blue-500 text-white' : 'border-stone-300'}`}>
                                {isChecked && <Check size={14} />}
                              </div>
                              <span className="text-xs font-bold leading-tight flex-1">{item.text}</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); playTts(item.text); }}
                            className="absolute bottom-2 right-2 text-stone-400 hover:text-stone-600 cursor-pointer p-1 text-[10px]"
                            title="Écouter la phrase 🔊"
                          >
                            🔊
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question 2: Link Character to Speech */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                  <p className="text-xs font-black uppercase text-stone-400 tracking-wider leading-none">Exercice 2 : Je relie le personnage à ce qu'il dit</p>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-stone-700 flex-1">Sélectionne la bonne réplique pour chaque personnage :</p>
                    <button
                      type="button"
                      onClick={() => playTts("Sélectionne la bonne réplique pour chaque personnage.")}
                      className="p-1 px-2.5 bg-white text-stone-500 hover:text-stone-850 rounded-lg shadow-sm border border-stone-205 text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                      title="Écouter la consigne 🔊"
                    >
                      🔊 Consigne
                    </button>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    {currentContent.comprehension.matching.map((match, idx) => {
                      const userSel = getAnswerValue(`matching_${idx}`);
                      const isCorrect = userSel === match.answer;
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded-xl">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <span className="font-baloo font-black text-sm text-[var(--purple)]">{match.question} dit :</span>
                            <button
                              type="button"
                              onClick={() => playTts(`${match.question} dit. Quelles sont les options ?`)}
                              className="text-stone-400 hover:text-stone-600 cursor-pointer"
                              title="Écouter"
                            >
                              🔊
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 flex-1 justify-end">
                            {match.options.map((opt) => {
                              const isOptionSelected = userSel === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    updateAnswer(`matching_${idx}`, opt);
                                    if (opt === match.answer) {
                                      showMascotMsg(`Génial ! ${match.question} est bien le personnage qui a prononcé cette réplique. 🎙️👏`);
                                    } else {
                                      showMascotMsg("Ce n'est pas tout à fait ce qu'il a dit, aide-toi du texte pour retrouver ! 🔄");
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                                    isOptionSelected
                                      ? isCorrect 
                                        ? 'bg-green-500 text-white border border-green-500 shadow-sm'
                                        : 'bg-red-500 text-white border border-red-500 shadow-sm'
                                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <span
                                    onClick={(e) => { e.stopPropagation(); playTts(opt); }}
                                    className="p-0.5 hover:bg-black/10 rounded"
                                    title="Écouter l'option"
                                  >
                                    🔊
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question 3: Vocabulary & Synonyms replacement */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                  <p className="text-xs font-black uppercase text-stone-400 tracking-wider leading-none">Exercice 3 : Je remplace par des mots de même sens</p>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-stone-500 italic flex-1">Exemple tiré du texte d'origine. Écris en minuscules :</p>
                    <button
                      type="button"
                      onClick={() => playTts("Remplace par des mots de même sens d'après le texte.")}
                      className="p-1 px-2.5 bg-white text-stone-500 hover:text-stone-850 rounded-lg shadow-sm border border-stone-205 text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                      title="Écouter la consigne 🔊"
                    >
                      🔊 Consigne
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentContent.comprehension.synonyms.map((syn, idx) => {
                      const userVal = getAnswerValue(`synonym_${idx}`);
                      const isCorrect = userVal.trim().toLowerCase() === syn.correct.toLowerCase();
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-xl border border-stone-150">
                          <div className="flex items-center gap-2 flex-1">
                            <p className="text-xs font-bold text-stone-600">
                              Remplacer <strong className="underline font-mono text-purple-700">« {syn.question} »</strong> par son synonyme exact écrit dans le texte :
                            </p>
                            <button
                              type="button"
                              onClick={() => playTts(`Remplacer le mot ${syn.question} par son synonyme.`)}
                              className="text-stone-400 hover:text-stone-650 cursor-pointer"
                              title="Écouter"
                            >
                              🔊
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={userVal}
                              onChange={(e) => updateAnswer(`synonym_${idx}`, e.target.value)}
                              placeholder={syn.placeholder}
                              className={`p-2 border border-stone-300 rounded-lg text-xs font-bold outline-none text-center w-36 ${
                                userVal ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700') : ''
                              }`}
                            />
                            {userVal && isCorrect && <span className="text-green-500 font-bold text-sm">✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question 4: Explanation interpreting */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                  <p className="text-xs font-black uppercase text-stone-400 tracking-wider leading-none">Exercice 4 : J'entoure la bonne explication</p>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-stone-700 flex-1">{currentContent.comprehension.explanation.question}</p>
                    <button
                      type="button"
                      onClick={() => playTts(currentContent.comprehension.explanation.question)}
                      className="p-1 px-2.5 bg-white text-stone-500 hover:text-stone-850 rounded-lg shadow-sm border border-stone-205 text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                      title="Écouter la consigne 🔊"
                    >
                      🔊 Consigne
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {currentContent.comprehension.explanation.options.map((opt) => {
                      const isSelected = getAnswerValue('explanation') === opt;
                      const isCorrect = opt === currentContent.comprehension.explanation.correctAns;
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            updateAnswer('explanation', opt);
                            if (isCorrect) {
                              showMascotMsg("Exactement ! Quelque chose d'inoubliable reste inscrit à jamais dans les cœurs. 💖");
                            } else {
                              showMascotMsg("Non, ce n'est pas le sens de inoubliable. Réessaie ! 🤔");
                            }
                          }}
                          className={`p-3 px-5 rounded-xl border-2 text-xs font-bold flex-1 text-center min-w-[150px] transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? isCorrect
                                ? 'bg-green-500 border-green-600 text-white font-black'
                                : 'bg-red-500 border-red-600 text-white'
                              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            onClick={(e) => { e.stopPropagation(); playTts(opt); }}
                            className="p-0.5 hover:bg-black/10 rounded cursor-pointer"
                            title="Écouter l'option"
                          >
                            🔊
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 5: Written responses */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                  <p className="text-xs font-black uppercase text-stone-400 tracking-wider leading-none">Exercice 5 : Je réponds par des phrases du texte</p>
                  
                  <div className="space-y-4">
                    {currentContent.comprehension.questionsEcrits.map((item) => {
                      const userVal = getAnswerValue(`written_ans_${item.id}`);
                      return (
                        <div key={item.id} className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-stone-150">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-stone-700 block flex-1">{item.label}</label>
                            <button
                              type="button"
                              onClick={() => playTts(item.label)}
                              className="text-stone-400 hover:text-stone-650 cursor-pointer text-xs shrink-0"
                              title="Écouter la question 🔊"
                            >
                              🔊 Écouter
                            </button>
                          </div>
                          <textarea
                            value={userVal}
                            onChange={(e) => updateAnswer(`written_ans_${item.id}`, e.target.value)}
                            placeholder={item.placeholder}
                            rows={2}
                            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:border-stone-400 outline-none placeholder:text-stone-300"
                          />
                          <button
                            onClick={() => {
                              showMascotMsg(`Astuce de correction de l'enseignant : « ${item.originalAnswerText} » 👍`);
                            }}
                            className="text-[10px] text-[var(--purple)] hover:underline font-bold"
                          >
                            Afficher une proposition de réponse 💡
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question 6: Village text proof */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                  <p className="text-xs font-black uppercase text-stone-400 tracking-wider leading-none">Exercice 6 : Repérer la preuve textuelle du changement</p>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-stone-700 block flex-1">{currentContent.comprehension.textChangeProof.question}</label>
                    <button
                      type="button"
                      onClick={() => playTts(currentContent.comprehension.textChangeProof.question)}
                      className="text-stone-400 hover:text-stone-655 cursor-pointer text-xs shrink-0"
                      title="Écouter la question 🔊"
                    >
                      🔊 Écouter
                    </button>
                  </div>
                  
                  <textarea
                    value={getAnswerValue('text_proof')}
                    onChange={(e) => updateAnswer('text_proof', e.target.value)}
                    placeholder={currentContent.comprehension.textChangeProof.placeholder}
                    rows={2}
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:border-stone-400 outline-none"
                  />
                  <button
                    onClick={() => {
                      showMascotMsg(`Copie cette phrase exacte : « ${currentContent.comprehension.textChangeProof.originalText} » ✏️`);
                    }}
                    className="text-[10px] text-[var(--purple)] hover:underline font-bold"
                  >
                    Voir l'orthographe stricte à recopier 💡
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* FICHES DE LANGUE */}
          {activeCategory === 'langue' && (
            <motion.div 
              key="langue" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-baloo text-2xl font-black text-stone-800">🛠️ Fiches de Langue Synthétiques</h3>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-0.5">Sujets consolidés du trimestre • Grammaire • Conjugaison • Orthographe • Vocabulaire</p>
              </div>

              {/* A. Grammaire */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
                <span className="py-1 px-3 bg-blue-100 text-blue-800 rounded-full font-black text-[9px] uppercase tracking-wider">01 • Grammaire (GNS)</span>
                
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-700 flex-1">{currentContent.langue.grammaire.instruction}</p>
                  <button
                    type="button"
                    onClick={() => playTts(currentContent.langue.grammaire.instruction)}
                    className="p-1 px-2.5 bg-white text-stone-500 hover:text-stone-800 rounded-lg shadow-sm border border-stone-200 text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                    title="Écouter la consigne 🔊"
                  >
                    🔊 Consigne
                  </button>
                </div>
                
                <div className="space-y-3 pt-2">
                  {currentContent.langue.grammaire.items.map((item, idx) => {
                    const ansKey = `gns_q_${idx}`;
                    const userVal = getAnswerValue(ansKey);
                    const isCorrect = userVal.trim().toLowerCase() === item.targetGns.toLowerCase();
                    return (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-stone-150 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-stone-500 italic">Phrase n°{idx+1} :</p>
                          <button
                            type="button"
                            onClick={() => playTts(item.phrase)}
                            className="p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer text-xs"
                            title="Écouter la phrase 🔊"
                          >
                            🔊 Écouter
                          </button>
                        </div>
                        <p className="text-sm font-bold text-stone-800">« {item.phrase} »</p>
                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => updateAnswer(ansKey, e.target.value)}
                            placeholder="Récris le Groupe Nominal Sujet (GNS)..."
                            className={`p-2 px-3 border border-stone-300 rounded-xl text-xs font-semibold outline-none flex-1 focus:border-blue-400 ${
                              userVal ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700') : ''
                            }`}
                          />
                          {userVal && isCorrect && <span className="text-green-500 font-bold">Excellent ✓</span>}
                          {userVal && !isCorrect && (
                            <button
                              onClick={() => {
                                showMascotMsg(`Le GNS exact est : « ${item.targetGns} » ! 😉`);
                              }}
                              className="text-[10px] text-blue-500 hover:underline font-bold"
                            >
                              Correction ?
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* B. Conjugaison */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
                <span className="py-1 px-3 bg-indigo-100 text-indigo-800 rounded-full font-black text-[9px] uppercase tracking-wider">02 • Conjugaison (Présent)</span>
                
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-700 flex-1">{currentContent.langue.conjugaison.instruction}</p>
                  <button
                    type="button"
                    onClick={() => playTts(currentContent.langue.conjugaison.instruction)}
                    className="p-1 px-2.5 bg-white text-stone-500 hover:text-stone-800 rounded-lg shadow-sm border border-stone-200 text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                    title="Écouter la consigne 🔊"
                  >
                    🔊 Consigne
                  </button>
                </div>
                
                <div className="space-y-3 pt-2">
                  {currentContent.langue.conjugaison.items.map((item, idx) => {
                    const ansKey = `conj_q_${idx}`;
                    const userVal = getAnswerValue(ansKey);
                    const isCorrect = userVal.trim().toLowerCase() === item.correct.toLowerCase();
                    return (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-stone-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1">
                          <p className="text-xs font-bold text-stone-700">
                            {item.textPre}
                            <strong className="text-indigo-600">({item.verb})</strong>
                            {item.textPost}
                          </p>
                          <button
                            type="button"
                            onClick={() => playTts(`${item.textPre} [silence] ${item.verb} [silence] ${item.textPost}`.replace(/\(\)/g, '').replace(/\[silence\]/g, ' '))}
                            className="p-1 text-stone-400 hover:text-indigo-600 transition-colors cursor-pointer text-xs"
                            title="Écouter l'exercice"
                          >
                            🔊
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => updateAnswer(ansKey, e.target.value)}
                            placeholder="Tape le verbe conjugué..."
                            className={`p-2 border border-stone-300 rounded-lg text-xs font-bold outline-none text-center w-36 ${
                              userVal ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700') : ''
                            }`}
                          />
                          {userVal && isCorrect && <span className="text-green-500 font-bold text-xs">✓</span>}
                          {userVal && !isCorrect && (
                            <button
                              onClick={() => showMascotMsg(`Pour « ${item.verb} », on conjugue : « ${item.correct} » ! ✨`)}
                              className="p-1 px-2 border rounded text-[10px] text-stone-500 bg-stone-50"
                            >
                              Aide 💡
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* C. Orthographe Pluriels */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
                <span className="py-1 px-3 bg-amber-100 text-amber-800 rounded-full font-black text-[9px] uppercase tracking-wider">03 • Orthographe (Accords au Pluriel)</span>
                
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-700 flex-1">{currentContent.langue.orthographe.instruction}</p>
                  <button
                    type="button"
                    onClick={() => playTts(currentContent.langue.orthographe.instruction)}
                    className="p-1 px-2.5 bg-white text-stone-500 hover:text-stone-800 rounded-lg shadow-sm border border-stone-200 text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                    title="Écouter la consigne 🔊"
                  >
                    🔊 Consigne
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {currentContent.langue.orthographe.items.map((item, idx) => {
                    const ansKey = `ortho_q_${idx}`;
                    const userVal = getAnswerValue(ansKey);
                    const isCorrect = userVal.trim().toLowerCase().replace(/\s+/g, ' ') === item.pluralCorrect.toLowerCase().replace(/\s+/g, ' ');
                    return (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-stone-150 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-500">Singulier :</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">{item.singular}</span>
                            <button
                              type="button"
                              onClick={() => playTts(item.singular)}
                              className="text-stone-400 hover:text-amber-600 cursor-pointer text-xs"
                              title="Écouter"
                            >
                              🔊
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-stone-400">Écris au Pluriel :</label>
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => updateAnswer(ansKey, e.target.value)}
                            placeholder="Écris la forme plurielle..."
                            className={`w-full p-2.5 border border-stone-300 rounded-xl text-xs font-bold outline-none ${
                              userVal ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700 animate-pulse-once' : 'bg-red-50 border-red-500 text-red-700') : ''
                            }`}
                          />
                        </div>
                        {userVal && !isCorrect && (
                          <button
                            onClick={() => {
                              showMascotMsg(`La réponse est : « ${item.pluralCorrect} » !`);
                            }}
                            className="text-[10px] text-amber-600 hover:underline font-bold"
                          >
                            Voir la réponse 💡
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* D. Vocabulaire Text complet */}
              <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
                <span className="py-1 px-3 bg-emerald-100 text-emerald-800 rounded-full font-black text-[9px] uppercase tracking-wider">04 • Vocabulaire (Complétion Interactive Juliette)</span>
                
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-700 flex-1">{currentContent.langue.vocabulaireWordList.instruction}</p>
                  <button
                    type="button"
                    onClick={() => playTts(currentContent.langue.vocabulaireWordList.instruction)}
                    className="p-1.5 bg-white text-stone-500 hover:text-stone-800 rounded-lg shadow-sm border border-stone-200"
                    title="Écouter la consigne 🔊"
                  >
                    🔊 Consigne
                  </button>
                </div>
                
                <div className="p-4 bg-white border border-stone-200 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">🏷️ Malette d'étiquettes de rechange :</p>
                    <button
                      type="button"
                      onClick={() => {
                        setManualShuffleSeed(p => p + 1);
                        showMascotMsg("Les étiquettes d'écriture ont été mélangées ! À toi de jouer ! 🌪️");
                      }}
                      className="p-1 px-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-xl font-baloo font-bold text-[10px] uppercase transition-all select-none flex items-center gap-1 active:scale-95 cursor-pointer shadow-sm"
                      title="Mélanger les mots"
                    >
                      🌪️ Mélanger
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {shuffledVocabList.map((word) => (
                      <div key={word} className="inline-flex items-center gap-1 bg-emerald-50 rounded-xl border border-emerald-100 p-0.5">
                        <button
                          key={word}
                          onClick={() => {
                            // Find first empty input and fill it
                            const slotsCount = currentContent.langue.vocabulaireWordList.words.length;
                            for (let i = 0; i < slotsCount; i++) {
                              const val = getAnswerValue(`vocab_trou_${i}`);
                              if (!val) {
                                updateAnswer(`vocab_trou_${i}`, word);
                                handleSpeechWord(word);
                                return;
                              }
                            }
                            showMascotMsg("Tous les trous sont déjà remplis ! Efface pour changer.");
                          }}
                          className="p-1 px-2.5 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg font-black text-[10px] uppercase transition-all select-none cursor-pointer"
                        >
                          {word} 🏷️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpeechWord(word)}
                          className="p-1 hover:bg-emerald-100 rounded text-stone-500 cursor-pointer text-xs"
                          title="Écouter le mot"
                        >
                          🔊
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text render code */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 leading-[3] font-serif text-base italic md:text-lg">
                  {currentContent.langue.vocabulaireWordList.textPattern.split(/\[\d+\]/).map((part, i, arr) => {
                    const ansKey = `vocab_trou_${i}`;
                    const val = getAnswerValue(ansKey);
                    const isCorrect = val.toLowerCase().trim() === (currentContent.langue.vocabulaireWordList.words[i] || '').toLowerCase().trim();
                    return (
                      <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < arr.length - 1 && (
                          <span className="inline-flex items-center gap-1 select-none">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => updateAnswer(ansKey, e.target.value)}
                              className={`mx-1 w-28 border-b-2 text-center font-black outline-none bg-transparent transition-all ${
                                !val ? 'border-emerald-500' :
                                isCorrect ? 'text-green-600 border-green-500 bg-green-50' : 'text-red-600 border-red-500 bg-red-50'
                              }`}
                              placeholder={`(?) Trou ${i+1}`}
                            />
                            {val && (
                              <button onClick={() => updateAnswer(ansKey, '')} className="p-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500">
                                ✗
                              </button>
                            )}
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Read aloud completed story */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-between items-center bg-stone-100/50 p-3 rounded-2xl border border-stone-250">
                  <span className="text-[10px] uppercase font-black tracking-wider text-stone-400">🎙️ Lecteur audio d'accompagnement :</span>
                  <button
                    type="button"
                    onClick={() => {
                      let spokenText = currentContent.langue.vocabulaireWordList.textPattern;
                      currentContent.langue.vocabulaireWordList.words.forEach((w, i) => {
                        const userVal = getAnswerValue(`vocab_trou_${i}`);
                        spokenText = spokenText.replace(`[${i+1}]`, userVal || `[trou vide]`);
                      });
                      playTts(spokenText);
                    }}
                    className="p-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-baloo font-bold text-xs uppercase flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-emerald-500/10 cursor-pointer"
                    title="Écouter le récit avec mes réponses"
                  >
                    🔊 Écouter l'histoire complétée
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      const len = currentContent.langue.vocabulaireWordList.words.length;
                      for (let i = 0; i < len; i++) {
                        updateAnswer(`vocab_trou_${i}`, '');
                      }
                      showMascotMsg("L'exercice de vocabulaire de Juliette a été effacé ! 🔄");
                    }}
                    className="px-5 py-2.5 bg-stone-100 font-baloo hover:bg-stone-200 text-stone-500 rounded-xl text-xs font-black uppercase transition-all"
                  >
                    Effacer mes réponses
                  </button>

                  <button
                    onClick={checkVocabTrous}
                    className="px-6 py-2.5 bg-emerald-600 font-baloo hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase transition-all shadow-md shadow-emerald-500/10"
                  >
                    Vérifier l'exercice de Juliette
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* ECOLE DICTATION */}
          {activeCategory === 'dictee' && (
            <motion.div 
              key="dictee" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-baloo text-2xl font-black text-stone-800">🎙️ La Dictée Magique du Trimestre</h3>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-0.5">Synthèse audio à vitesse ajustable • Teste ton orthographe</p>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 relative overflow-hidden">
                <div className="space-y-2">
                  <p className="font-baloo text-amber-800 font-bold text-sm flex items-center gap-2">
                    <Volume2 size={16} /> Consignes de la Dictée :
                  </p>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed max-w-2xl">
                    Écoute bien chaque mot en cliquant sur le haut-parleur rouge situé à côté du trou. Rédige l'orthographe correcte du mot dans la zone. Tu as 3 tentatives de correction globale !
                  </p>
                </div>
              </div>

              {/* Dictation interactive box */}
              <div className="bg-white p-8 md:p-10 border-4 border-amber-200/50 rounded-[36px] shadow-sm relative space-y-6">
                
                {/* Text with gaps */}
                <div className="font-serif leading-[2.8] text-justify text-lg md:text-xl italic p-4 bg-stone-50/50 rounded-2xl border border-stone-100">
                  {currentContent.dictee.gapText.split('__').map((part, i, arr) => {
                    const correctWord = currentContent.dictee.words[i] || '';
                    const ansKey = `dic_word_${i}`;
                    const userVal = dictationValues[ansKey] || '';
                    const isFicheChecked = showDictationCheck[activeTheme] || false;
                    const isCorrect = userVal.toLowerCase().trim() === correctWord.toLowerCase().trim();
                    const attemptNum = attempts[activeTheme] || 0;
                    return (
                      <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < arr.length - 1 && (
                          <span className="inline-flex items-center gap-1.5 align-middle select-none">
                            <input
                              type="text"
                              value={userVal}
                              onChange={(e) => {
                                setDictationValues(p => ({ ...p, [ansKey]: e.target.value }));
                              }}
                              disabled={isFicheChecked && isCorrect}
                              onFocus={() => {
                                handleSpeechWord(correctWord);
                                showMascotMsg(`Rédige le mot caché nº${i+1} : « ${correctWord} » ! 🎧`);
                              }}
                              placeholder="???"
                              className={`w-32 py-1 bg-white border-b-2 text-center font-black outline-none transition-all ${
                                !userVal ? 'border-amber-400' :
                                isFicheChecked 
                                  ? isCorrect ? 'text-green-600 border-green-600 bg-green-50 rounded px-2' : 'text-red-600 border-red-600 bg-red-50 rounded px-2'
                                  : 'text-amber-700 border-amber-500 bg-amber-50/10 rounded px-2'
                              }`}
                            />
                            
                            <button
                              onClick={() => handleSpeechWord(correctWord)}
                              className="p-1 px-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs"
                              title="Répéter la prononciation du mot"
                            >
                              🎧
                            </button>

                            {isFicheChecked && !isCorrect && attemptNum >= 3 && (
                              <span className="text-[10px] bg-red-100 text-red-800 border border-red-200 font-bold px-1.5 py-0.5 rounded">
                                Corr : {correctWord}
                              </span>
                            )}
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Control attempts panel */}
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-stone-150">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playTts(currentContent.dictee.fullText)}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-baloo rounded-xl text-xs font-black uppercase transition-all shadow-md shadow-amber-500/10"
                    >
                      Écouter le texte complet de dictée 🎙️
                    </button>
                    
                    <button
                      onClick={() => {
                        // Reset
                        setDictationValues({});
                        setAttempts(p => ({ ...p, [activeTheme]: 0 }));
                        setShowDictationCheck(p => ({ ...p, [activeTheme]: false }));
                        showMascotMsg("La feuille a été épurée ! Bon nouvel essai. 🔄🎧");
                      }}
                      className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-baloo rounded-xl text-xs font-black uppercase transition-all"
                    >
                      Remettre à zéro
                    </button>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="flex gap-1 justify-center">
                      {[1, 2, 3].map((st) => (
                        <div key={st} className={`w-3.5 h-3.5 rounded-full ${st <= (attempts[activeTheme] || 0) ? 'bg-red-400' : 'bg-green-400'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-stone-400">
                      Nombre de validations de dictée : {attempts[activeTheme] || 0} / 3
                    </p>
                  </div>

                  {/* Validate answers trigger */}
                  {!(attempts[activeTheme] >= 3) && (
                    <button
                      onClick={() => {
                        const len = currentContent.dictee.words.length;
                        let allCorrect = true;
                        for (let i = 0; i < len; i++) {
                          const userVal = (dictationValues[`dic_word_${i}`] || '').trim().toLowerCase();
                          const correct = currentContent.dictee.words[i].trim().toLowerCase();
                          if (userVal !== correct) {
                            allCorrect = false;
                          }
                        }

                        // increment attempts
                        const currentAttempts = (attempts[activeTheme] || 0) + 1;
                        setAttempts(p => ({ ...p, [activeTheme]: currentAttempts }));
                        setShowDictationCheck(p => ({ ...p, [activeTheme]: true }));

                        if (allCorrect) {
                          showMascotMsg("PARFAIT ! ZÉRO FAUTES ! Tu as complété la dictée sans aucune erreur. Quel excellent élève ! 🏆🥇🌟");
                        } else {
                          if (currentAttempts >= 3) {
                            showMascotMsg("C'est terminé ! Tu as épuisé tes 3 tentatives de dictée. Regarde les corrections en rouge sous chaque trou ! 🛠️");
                          } else {
                            showMascotMsg("Ce n'est pas tout à fait juste. Observe tes erreurs et réessaie d'ajuster l'orthographe ! 💪");
                          }
                        }
                      }}
                      className="px-10 py-4.5 bg-yellow-500 hover:bg-yellow-600 text-stone-900 shadow-lg shadow-yellow-500/20 font-baloo rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all active:scale-95"
                    >
                      Valider et Vérifier mon écriture ✔️
                    </button>
                  )}

                </div>

              </div>

            </motion.div>
          )}

          {/* SEYES CURSIVE REDACTION */}
          {activeCategory === 'redaction' && (
            <motion.div 
              key="redaction" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-baloo text-2xl font-black text-stone-800">✍️ Le Grand Cahier de Rédaction Seyès</h3>
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-0.5">Lignes d'interlignes scolaires réalistes • Calligraphie d'apprentissage</p>
              </div>

              {/* Subject Description Card */}
              <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-250 flex flex-col md:flex-row gap-5 items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl shrink-0">
                  📓
                </div>
                <div className="space-y-3 flex-1">
                  <h4 className="font-baloo text-emerald-900 font-black text-[15px]">{currentContent.redaction.title}</h4>
                  <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                    {currentContent.redaction.description}
                  </p>

                  {/* Show Steps if it's Parks pictures layout */}
                  {currentContent.redaction.steps && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {currentContent.redaction.steps.map((step) => (
                        <div key={step.id} className="bg-white p-3 rounded-xl border border-emerald-100 shadow-xs flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {step.id}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold text-emerald-600 block leading-none">{step.label}</span>
                            <p className="text-[10px] text-stone-600 leading-tight mt-0.5 font-medium">{step.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Seyes paper canvas layout */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-400">Calligraphie d'école :</span>
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="p-1 px-3 border border-stone-250 rounded-lg text-xs font-bold bg-white text-stone-700 outline-none"
                    >
                      <option value="Playwrite FR Trad">Écolier Script Trad</option>
                      <option value="Playwrite FR Moderne">Écolier Moderne Mod</option>
                      <option value="Playwrite DE Grund">Écolier Basique</option>
                      <option value="Cedarville Cursive">Cursive Élégante</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      updateAnswer('redaction_texte', '');
                      showMascotMsg("La copie Seyès a été gommée ! Prêt pour un nouveau jet. 🧹");
                    }}
                    className="flex items-center gap-1.5 p-1 px-3 border border-stone-250 hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-bold text-stone-500 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Gommer la page
                  </button>
                </div>

                {/* Real Seyes rulings background container */}
                <div className="relative">
                  
                  {/* The seyes ruled box */}
                  <div className="seyes-paper !min-h-[460px] p-8 pb-12 shadow-md relative group">
                    
                    {/* Writing space */}
                    {currentContent.redaction.type === 'guided' && currentContent.redaction.prompts ? (
                      <div className="space-y-6 relative z-10 text-left pt-6 max-w-3xl mx-auto font-medium">
                        {currentContent.redaction.prompts.map((p) => {
                          const ansSubKey = `redaction_prompt_${p.id}`;
                          const subVal = getAnswerValue(ansSubKey);
                          return (
                            <div key={p.id} className="space-y-2">
                              <label style={{ fontFamily: selectedFont }} className="text-emerald-900 font-bold block text-base pr-4">
                                {p.text}
                              </label>
                              
                              <div className="flex items-baseline gap-2 pl-4">
                                {p.prefix && (
                                  <span style={{ fontFamily: selectedFont }} className="text-stone-700 font-bold text-base shrink-0 select-none">
                                    {p.prefix}
                                  </span>
                                )}
                                <input
                                  type="text"
                                  value={subVal}
                                  onChange={(e) => updateAnswer(ansSubKey, e.target.value)}
                                  placeholder={p.placeholder}
                                  style={{ fontFamily: selectedFont }}
                                  className="flex-1 bg-transparent border-b border-indigo-200 outline-none text-base font-bold text-blue-900 pb-1"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <textarea
                        value={getAnswerValue('redaction_texte')}
                        onChange={(e) => updateAnswer('redaction_texte', e.target.value)}
                        placeholder="Écris ton récit ou dialogue ici en soignant tes lettres. (Double-clique sur n'importe quel mot pour voir sa définition IA !)..."
                        style={{ 
                          fontFamily: selectedFont,
                          fontSize: '18px',
                          lineHeight: '32px'
                        }}
                        className="seyes-textarea w-full cursor-help relative z-10"
                      />
                    )}

                  </div>

                </div>

                {/* Save message button */}
                <div className="flex justify-between items-center bg-stone-50 p-4 rounded-ful rounded-[24px] border border-stone-200">
                  <p className="text-[10px] text-stone-500 font-bold leading-none uppercase">Prends bien ton temps et trace chaque interligne correctement !</p>
                  
                  <button
                    onClick={() => {
                      showMascotMsg("FÉLICITATIONS ! Ton devoir de rédaction cursive a été enregistré avec succès dans ton cahier d'écolier ! 💾💖");
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-baloo rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-green-500/10"
                  >
                    Sauvegarder ma copie 💾
                  </button>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
}
