import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  PenTool,
  Type,
  Mic2,
  ClipboardCheck,
  Printer,
  Eye,
  CheckCircle2,
  Play,
  Save,
  Home,
  ChevronRight,
  ChevronLeft,
  Check,
  ThumbsUp,
  Sparkles,
  ImageIcon,
  X,
  RotateCcw,
  Trash2,
  Edit2,
  Clock,
  Pause,
  Volume2,
  Mic,
  Plus,
  Minus,
  Loader2,
  Cpu,
  Trophy,
  Users,
  LogOut,
  Settings,
  Share2,
  Search,
  Square,
  Heart,
  Palette,
  Feather,
  Dna,
  Lock,
  Unlock,
  Shield,
  SearchCheck,
  AlertCircle,
  Award,
  BookMarked,
  MessageSquare,
  FileText,
  Waves,
  Filter,
  RefreshCw,
  ArrowRight,
  Maximize,
  Minimize,
  Download,
  Smartphone,
  Sun,
  Moon,
  Gamepad2,
} from "lucide-react";
import { ImageEditorModal } from "./components/ImageEditorModal";
import {
  PdfEditorModal,
  DocEditorModal,
} from "./components/DocPdfEditorModals";
import CompetitionArena from "./components/CompetitionArena";
import SuccessPanel from "./components/SuccessPanel";
import MemoryGame from "./components/MemoryGame";
import LanguageExercises from "./components/LanguageExercises";
import DossierEnrichi from "./components/DossierEnrichi";
import { AnimatedReadingText } from "./components/AnimatedReadingText";
import { FormulaireDevoirAdmin } from "./components/FormulaireDevoirAdmin";
import { ZoneInsertionDevoirEnseignant } from "./components/ZoneInsertionDevoirEnseignant";
import { getCommonActivityForFiche } from "./data/commonActivities";
import { getExam } from "./exams";
import {
  useSpeechToText,
  calculerMotsCorrects,
  estimerSyllabesLues,
} from "./hooks/useSpeechToText";
import { AssistantMot, AssistantWordData } from "./components/AssistantMot";
import { findComplexWordInfoLocal } from "./data/complexWordsData";
// --- Constants & Data ---
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const READING_FONTS = [
  {
    key: "serif",
    name: "Classique 📜",
    class: "font-serif italic",
    desc: "Style traditionnel avec empattements",
  },
  {
    key: "sans",
    name: "Moderne 💻",
    class: "font-sans",
    desc: "Style minimaliste sans empattements",
  },
  {
    key: "lexend",
    name: "Fluide (Dyslexie) ✨",
    class: "font-lexend font-medium",
    desc: "Optimisée pour la fluidité de lecture",
  },
  {
    key: "comic",
    name: "Scolaire ✏️",
    class: "font-comic font-medium",
    desc: "Style manuscrit scripte familier",
  },
  {
    key: "fredoka",
    name: "Ronde Balloons 🎈",
    class: "font-fredoka",
    desc: "Lettres rondes, douces et amicales",
  },
  {
    key: "andika",
    name: "Clarté 📕",
    class: "font-andika",
    desc: "Spécifiquement conçue pour l'apprentissage",
  },
  {
    key: "ecolier-trad",
    name: "Cursive Traditionnelle 🖋️",
    class: "font-ecolier-trad font-bold tracking-wide text-xs",
    desc: "Écriture cursive scolaire traditionnelle",
  },
  {
    key: "ecolier-mod",
    name: "Cursive Moderne 🏫",
    class: "font-ecolier-mod font-bold tracking-wide text-xs",
    desc: "Écriture cursive scolaire moderne",
  },
  {
    key: "cursive",
    name: "Cursive Libre 🩰",
    class: "font-cursive text-xl",
    desc: "Écriture manuscrite fluide et déliée",
  },
  {
    key: "badscript",
    name: "Écriture Script 🎒",
    class: "font-badscript",
    desc: "Écriture cursive moderne décontractée",
  },
];

const getReadingFontClass = (fontKey: string) => {
  const font = READING_FONTS.find((f) => f.key === fontKey);
  return font ? font.class : "font-serif italic";
};

const getVoiceLabelAndIcon = (voiceName: string) => {
  const name = voiceName.toLowerCase();
  if (name.includes("hortense")) {
    return { icon: "👩‍🏫", label: "Hortense (Maîtresse)" };
  }
  if (name.includes("thomas")) {
    return { icon: "👨‍🎓", label: "Thomas (Maître)" };
  }
  if (name.includes("amelie") || name.includes("amélie")) {
    return { icon: "👩‍🎨", label: "Amélie (Conteuse)" };
  }
  if (name.includes("julie")) {
    return { icon: "👧", label: "Julie (Copine)" };
  }
  if (name.includes("paul")) {
    return { icon: "👦", label: "Paul (Copain)" };
  }
  if (name.includes("premium") || name.includes("natural")) {
    const cleanPremiumName = voiceName
      .replace(/crystal|premium|natural|france|french/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    return { icon: "💎🎙️", label: `${cleanPremiumName || "Voix"} (Premium)` };
  }
  if (name.includes("google")) {
    const isFemale = name.includes("female") || name.includes("femme");
    const isMale = name.includes("male") || name.includes("homme");
    if (isFemale) {
      return { icon: "✨👩", label: "Voix Magique Actrice" };
    }
    if (isMale) {
      return { icon: "✨👨", label: "Voix Magique Acteur" };
    }
    return { icon: "✨🎙️", label: "Voix Magique Dynamique" };
  }
  if (name.includes("siri")) {
    return { icon: "🍎", label: "Siri (Copain)" };
  }
  if (name.includes("zira")) {
    return { icon: "👩", label: "Zira (Assistante)" };
  }
  if (name.includes("david")) {
    return { icon: "👨", label: "David (Assistant)" };
  }
  if (
    name.includes("female") ||
    name.includes("femme") ||
    name.includes("daria") ||
    name.includes("clara")
  ) {
    return { icon: "👩", label: "Voix Féminine" };
  }
  if (
    name.includes("male") ||
    name.includes("homme") ||
    name.includes("stefan")
  ) {
    return { icon: "👨", label: "Voix Masculine" };
  }
  const cleanName = voiceName
    .replace(/Google|Microsoft|Apple|French|France/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return { icon: "🤖", label: cleanName || "Voix Système" };
};

const DIFFICULTIES = {
  facile: {
    label: "Facile",
    icon: "🌱",
    color: "var(--green)",
    text: "« Le petit chat noir joue dans le jardin. Il voit une balle rouge. »",
    mots: 15,
    points: { c1: 6, c5: 2 },
    time: 1200, // 20 minutes
  },
  moyen: {
    label: "Moyen",
    icon: "🚀",
    color: "var(--primary)",
    text: "« Ce soir, la salle est sombre. Charlot porte un chapeau noir. Il marche comiquement et mange un gros gâteau. »",
    mots: 20,
    points: { c1: 5, c5: 3 },
    time: 900, // 15 minutes
  },
  difficile: {
    label: "Difficile",
    icon: "🔥",
    color: "var(--accent)",
    text: "« Soudain, Charlot apparaît sur l'écran géant. Il marche de façon comique, chute lourdement et se relève hâtivement pour saluer la foule en délire. »",
    mots: 28,
    points: { c1: 4, c5: 4 },
    time: 600, // 10 minutes
  },
};

const STUDENTS = [
  { id: "0001", name: "Adam El Oueslati" },
  { id: "0002", name: "Aya El Jaziri" },
  { id: "0003", name: "Amira Hamzaoui" },
  { id: "0004", name: "Anas El Sharni" },
  { id: "0005", name: "Iskander Jawad" },
  { id: "0006", name: "Baraa El Oueslati" },
  { id: "0007", name: "Tasnim El Jbali" },
  { id: "0008", name: "Rahma Touati" },
  { id: "0009", name: "Retaj Kafi" },
  { id: "0010", name: "Saja El Malki" },
  { id: "0011", name: "Seif Eddine El Majri" },
  { id: "0012", name: "Shams Eddine El Maaroufi" },
  { id: "0013", name: "Ghassan El Smaali" },
  { id: "0014", name: "Med Raki El namouchi" },
  { id: "0015", name: "Mohamed Sajed El Sharni" },
  { id: "0016", name: "Mohamed Yassine Bousalh" },
  { id: "0017", name: "Mohamed Sajed El Magri" },
  { id: "0018", name: "Mohamed Anas El Mahjoubi" },
  { id: "0019", name: "Mohamed Yazid El Assidi" },
  { id: "0020", name: "Yasmine El Rouissi" },
];

const MASCOTS = {
  default: {
    emoji: "🕷️",
    name: "Spider",
    msgs: [
      "Lis bien chaque question ! 🕸️",
      "Concentre-toi, tu peux le faire !",
      "Chaque bonne réponse t'approche du diplôme !",
    ],
  },
  pink: {
    emoji: "🐾",
    name: "Panthère Rose",
    msgs: [
      "Chut... réfléchis bien avant de répondre !",
      "Chaque effort compte, petit champion !",
      "Prends ton temps, la Panthère est avec toi !",
    ],
  },
  transformers: {
    emoji: "🤖",
    name: "Optimus Prime",
    msgs: [
      "Autobots, déployez-vous et lisez bien ! 🤖🚛",
      "La clé de nos pouvoirs est la persévérance. 🛡️",
      "Un vrai Autobot ne renonce jamais devant un défi ! 🚀",
    ],
  },
  bikini: {
    emoji: "🍍",
    name: "Bob",
    msgs: [
      "Je suis prêt ! Et toi ?",
      "Plonge dans la lecture !",
      "La connaissance est un trésor !",
    ],
  },
  hotel: {
    emoji: "🧛",
    name: "Dracula",
    msgs: [
      "La lecture, c'est pas mortel... c'est génial !",
      "Volons vers la réussite ensemble !",
      "Bienvenue à l'hôtel du savoir !",
    ],
  },
};

// Cartographie des voix idéales et naturelles selon le thème actif
const CONFIG_VOIX_THEMES: Record<
  string,
  { fr: string[]; en: string[]; pitch: number; rate: number }
> = {
  "theme-default": {
    fr: ["hortense", "google unissund", "microsoft julie"],
    en: ["google us english", "microsoft david", "siri"],
    pitch: 1.0,
    rate: 0.95, // Légèrement posé pour une articulation scolaire parfaite
  },
  "theme-pink": {
    fr: ["amelie", "amélie", "google femme", "clara"],
    en: ["google uk english female", "microsoft zira"],
    pitch: 1.05, // Un ton légèrement plus doux et chaleureux
    rate: 0.9,
  },
  "theme-transformers": {
    fr: ["stefan", "google homme", "microsoft paul"],
    en: ["google uk english male", "microsoft david"],
    pitch: 0.8, // Grave, puissant et solennel pour s'accorder avec Optimus Prime
    rate: 0.92,
  },
  "theme-bikini": {
    fr: ["google unissund", "paul", "microsoft unknown"],
    en: ["google us english", "microsoft david"],
    pitch: 1.15, // Plus enjoué et dynamique pour l'univers marin
    rate: 1.0,
  },
  "theme-hotel": {
    fr: ["stefan", "google homme", "microsoft paul"],
    en: ["google uk english male", "microsoft david"],
    pitch: 0.85, // Voix légèrement plus grave et mystérieuse
    rate: 0.9,
  },
};

const ANSWERS_LVL1 = ["grande", "petits", "jolie", "fort"];

// Définition des contenus localisés (Zéro traduction mot-à-mot)
const TextesInterface = {
  fr: {
    subtitle:
      "VOTRE VOYAGE IMMERSIF VERS LA MAÎTRISE DU FRANÇAIS • NIVEAU CM1 / ÉLÉMENTAIRE",
    inputPlaceholder: "N° élève (ex : 0001-0020) 🔑",
    btnEnter: "🚀 ENTRER EN CLASSE",
    teacherLink: "Enseignant ? Se connecter",
    btnPrint: "IMPRIMER FICHES & RAPPORTS 🖨️",
  },
  en: {
    // Formulations calquées sur les objectifs du British Council / Programme Tunisien
    subtitle:
      "YOUR IMMERSIVE JOURNEY TO ENGLISH MASTERY • 4th, 5th & 6th FORMS",
    inputPlaceholder: "Student ID (e.g., 0001-0020) 🔑",
    btnEnter: "🚀 LAUNCH MISSION",
    teacherLink: "Teacher Space? Log in",
    btnPrint: "PRINT WORKSHEETS & REPORTS 🖨️",
  },
};

const BanqueDeDonnees = {
  fr: {
    fiche_4_1: {
      titre: "La Famille de la Mascotte",
      theme: "Famille & Description",
      texte: "Voici ma famille. Mon père est un grand astronaute...",
      audioId: "fr_fiche_4_1",
      activites: {
        cloze: "Voici __ famille. Mon père est __ grand astronaute...",
        grammaire: "Genre et nombre (masculin/féminin)",
      },
    },
  },
  en: {
    fiche_4_1: {
      titre: "Meet the Space Crew!",
      theme: "Family & Greetings",
      texte:
        "Hello! This is my family. My father is tall. He has a blue rocket...",
      audioId: "en_fiche_4_1",
      activites: {
        scrambled_sentences: [
          "is / father / My / tall",
          "has / a / rocket / He / blue",
        ],
        lexique: ["father", "tall", "rocket"],
      },
    },
  },
};

// Remplacez votre ancienne liste de fiches par cette structure bilingue autonome
const ModulesPedagogiques = {
  fr: [
    {
      id: 1,
      titre: "La maladie de Jacquot",
      theme: "Santé et Hygiène",
      icone: "🩺",
    },
    {
      id: 2,
      titre: "Le cirque arrive en ville",
      theme: "Loisirs et Divertissement",
      icone: "🎪",
    },
    {
      id: 3,
      titre: "Une journée à la campagne",
      theme: "Loisirs (Pique-nique)",
      icone: "🧺",
    },
    {
      id: 4,
      titre: "La fête de l'école",
      theme: "Vie Scolaire / Fêtes",
      icone: "🎓",
    },
    {
      id: 5,
      titre: "Au zoo du Belvédère",
      theme: "Loisirs (Zoo)",
      icone: "🦁",
    },
  ],
  en: [
    // Aligné strictly avec les programmes officiels tunisiens (4th - 6th form)
    {
      id: 1,
      titre: "Meet My Family",
      theme: "Family Life (4th Form)",
      icone: "👨👩👧👦",
    },
    {
      id: 2,
      titre: "My Beautiful School",
      theme: "School Environment (4th Form)",
      icone: "🏫",
    },
    {
      id: 3,
      titre: "A Day with My Pets",
      theme: "Animals & Nature (5th Form)",
      icone: "🐱",
    },
    {
      id: 4,
      titre: "My Daily Routine",
      theme: "Everyday Life (5th Form)",
      icone: "⏰",
    },
    {
      id: 5,
      titre: "When I Grow Up...",
      theme: "Dreams & Occupations (6th Form)",
      icone: "🚀",
    },
  ],
};

const FICHES_EN: Record<number, Fiche> = {
  1: {
    id: 1,
    title: "Meet My Family",
    theme: "Family Life (4th Form)",
    text: "Hello! My name is Bobby. Today, I want to show you my happy family. My father is tall and very kind. He is an astronaut. My mother is beautiful and she loves reading books. I have a little sister, her name is Lily. She has blue eyes and a cute smile. We love playing together in the park with our big white dog. I love my family very much!",
    vocab: ["family", "father", "mother", "sister", "kind"],
    vocabOptions: {
      family: [
        "A group of people who are related to each other",
        "A toy shop",
        "A yellow bus",
      ],
      father: ["A male parent", "A pet animal", "A tree in the garden"],
      mother: ["A female parent", "A book to read", "A sweet candy"],
      sister: [
        "A girl who has the same parents as you",
        "A tall rocket",
        "A green ball",
      ],
      kind: [
        "Friendly, good, and helping others",
        "Very loud and angry",
        "Being sick and tired",
      ],
    },
    dictation: {
      text: "Bobby has a happy __. His __ is an astronaut. His __ is beautiful. His __ is Lily. She is very __.",
      words: ["family", "father", "mother", "sister", "kind"],
    },
    exercises: {
      lvl1: {
        q: "Connect/Match : 'Bobby' -> 'has a happy family', 'David' -> 'is an astronaut', 'Lily' -> 'has blue eyes'",
      },
      lvl2: {
        q: "Fill in the blank with: is / are. Bobby ... happy. Parents ... loving.",
      },
      lvl3: {
        q: "Write a complete sentence describing your father or mother.",
      },
    },
    evaluation: [
      {
        q: "What is Bobby's father's job?",
        choices: ["Doctor", "Astronaut", "Teacher"],
        answer: "Astronaut",
      },
      { q: "Who has blue eyes?", answer: "Lily" },
    ],
    dossierContent: {
      redaction: [
        { jumbled: "is / Bobby / . / My / name", correct: "My name is Bobby." },
        {
          jumbled: "love / very / family / . / I / much / my",
          correct: "I love my family very much.",
        },
      ],
      reconstitution: [
        "My father is very tall and kind.",
        "My mother loves reading books.",
        "I have a little sister named Lily.",
      ],
      cloze: {
        text: "Hello! My name is [1]. Today, I want to show you my happy [2]. My father is [3] and very kind. My mother is beautiful and she loves [4] books. We love [5] together.",
        words: ["Bobby", "family", "tall", "reading", "playing"],
      },
      dialogue: [
        "Teacher : Who is this in the photo, Bobby?",
        "Bobby : This is my sweet family! The tall man is my father.",
        "Teacher : That is great! What is his name?",
        "Bobby : His name is David and he is an astronaut.",
      ],
    },
  },
  2: {
    id: 2,
    title: "My Beautiful School",
    theme: "School Environment (4th Form)",
    text: "Welcome to my primary school! It is a big and beautiful place with bright yellow walls. Every morning, the school bell rings at eight o'clock. We run to our classrooms with our colorful schoolbags. Our teacher, Mrs. Green, is very friendly. She teaches us reading, writing, and drawing. We have a huge playground with trees where we play games with our classmates during the break. School is so much fun!",
    vocab: ["school", "teacher", "classroom", "schoolbag", "playground"],
    vocabOptions: {
      school: [
        "A place where children go to learn",
        "A beach with sand",
        "A supermarket",
      ],
      teacher: [
        "A person who helps students learn at school",
        "A police officer",
        "A train driver",
      ],
      classroom: [
        "A room where classes are held",
        "A kitchen to cook",
        "A bedroom to sleep",
      ],
      schoolbag: [
        "A bag used by students to carry books",
        "A plate for food",
        "A winter coat",
      ],
      playground: [
        "An outdoor area where children play",
        "A library",
        "A doctor's office",
      ],
    },
    dictation: {
      text: "We go to __. We carry our __. The __ is friendly. We sit in our __. We play on the __.",
      words: ["school", "schoolbag", "teacher", "classroom", "playground"],
    },
    exercises: {
      lvl1: {
        q: "Match : 'Walls' -> 'yellow', 'Teacher' -> 'Mrs. Green', 'Time' -> 'eight o'clock'",
      },
      lvl2: {
        q: "Complete with: a / an. ... schoolbag, ... orange, ... classroom.",
      },
      lvl3: { q: "Write a sentence about what you love most in your school." },
    },
    evaluation: [
      {
        q: "What time does the school bell ring?",
        choices: ["7 o'clock", "8 o'clock", "9 o'clock"],
        answer: "8 o'clock",
      },
      { q: "What is the name of the teacher?", answer: "Mrs. Green" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "school / My / big / . / is / beautiful / and",
          correct: "My school is big and beautiful.",
        },
        {
          jumbled: "classroom / sits / Sami / active / in / his / .",
          correct: "Sami sits in his active classroom.",
        },
      ],
      reconstitution: [
        "The bell rings at eight o'clock.",
        "Students run to their classrooms.",
        "We play in the big playground.",
      ],
      cloze: {
        text: "Welcome to my primary [1]! It is big and [2] with bright yellow walls. We run to our [3] with our colorful bags. Our [4] is very friendly. We have a huge [5] with green trees.",
        words: ["school", "beautiful", "classroom", "teacher", "playground"],
      },
      dialogue: [
        "Sami : Hi Mouna! Do you like your new class?",
        "Mouna : Yes, I love it! The walls are bright and very clean.",
        "Sami : Me too! Our teacher is so helpful.",
        "Mouna : Let's run to the playground, the break has started!",
      ],
    },
  },
  3: {
    id: 3,
    title: "A Day with My Pets",
    theme: "Animals & Nature (5th Form)",
    text: "I have two lovely pets at home. One is a little gray kitten named Fluffy, and the other is a playful brown puppy named Max. Every afternoon after school, they wait for me at the garden gate. Fluffy loves drinking warm milk and sleeping on my soft blanket. Max loves chasing yellow butterflies and running around the trees. They are my best animal friends. Having pets is wonderful because they bring so much joy and happiness to our home!",
    vocab: ["pet", "kitten", "puppy", "garden", "playful"],
    vocabOptions: {
      pet: [
        "An animal that you keep at home for company",
        "A wild wolf",
        "A big bicycle",
      ],
      kitten: ["A very young cat", "A baby elephant", "A blue bird"],
      puppy: ["A very young dog", "A farm sheep", "A cute horse"],
      garden: [
        "An outdoor area with grass and flowers",
        "A living room",
        "An airport",
      ],
      playful: [
        "Full of fun and liking to play games",
        "Always sleeping",
        "Very sad and quiet",
      ],
    },
    dictation: {
      text: "Bobby has a cute __ at home. He has a gray __. He has a brown __. They play in the __. They are very __.",
      words: ["pet", "kitten", "puppy", "garden", "playful"],
    },
    exercises: {
      lvl1: {
        q: "Match : 'Fluffy' -> 'gray kitten', 'Max' -> 'brown puppy', 'Blanket' -> 'soft'",
      },
      lvl2: {
        q: "Complete with: is / are. The kitten ... small. The puppy and kitten ... playful.",
      },
      lvl3: { q: "Write a sentence about your favorite pet animal." },
    },
    evaluation: [
      {
        q: "What color is the puppy?",
        choices: ["Black", "White", "Brown"],
        answer: "Brown",
      },
      { q: "Where do the pets wait for Bobby?", answer: "at the garden gate" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "lovely / two / I / . / have / pets",
          correct: "I have two lovely pets.",
        },
        {
          jumbled: "kitten / blanket / Fluffy / sleeps / . / on / the",
          correct: "Fluffy the kitten sleeps on the blanket.",
        },
      ],
      reconstitution: [
        "I have a playful gray kitten and a brown puppy.",
        "They wait for me at the garden gate.",
        "We run and play under the trees.",
      ],
      cloze: {
        text: "I have two lovely [1] at home. One is a little gray [2] and the other is a playful brown [3]. Every afternoon, they wait in the [4]. They are [5] and bring joy.",
        words: ["pets", "kitten", "puppy", "garden", "playful"],
      },
      dialogue: [
        "Amin : Is that your new puppy, Bobby?",
        "Bobby : Yes! His name is Max and he is very playful.",
        "Amin : Oh, look at him chasing that yellow butterfly!",
        "Bobby : Yes, he does that every single day!",
      ],
    },
  },
  4: {
    id: 4,
    title: "My Daily Routine",
    theme: "Everyday Life (5th Form)",
    text: "Every morning, I wake up early at half past six. First, I wash my face and brush my teeth. Then, I put on my neat school uniform. I eat a delicious breakfast with milk, toast, and fruit. At seven o'clock, I pack my schoolbag and walk to the bus stop with my brother. In the afternoon, I finish school, do my homework, and watch a cartoon. At nine o'clock, I go to bed to sleep. Having a healthy routine helps me stay active and ready for school!",
    vocab: ["routine", "morning", "breakfast", "homework", "uniform"],
    vocabOptions: {
      routine: [
        "The usual series of things you do at particular times",
        "A circus game",
        "A school bag",
      ],
      morning: [
        "The early part of the day",
        "The night time",
        "The cold winter",
      ],
      breakfast: [
        "The first meal of the day eaten in the morning",
        "A midday meal",
        "A sweet cupcake",
      ],
      homework: [
        "School work that you do at home",
        "Playing inside the house",
        "Going to the beach",
      ],
      uniform: [
        "Special clothes worn by students for school",
        "A dress for parties",
        "A warm jacket",
      ],
    },
    dictation: {
      text: "This is my daily __. In the __, I brush my teeth. I eat my __. I wear my __. I do my __.",
      words: ["routine", "morning", "breakfast", "uniform", "homework"],
    },
    exercises: {
      lvl1: {
        q: "Match : 'Wake up' -> '6:30', 'Breakfast' -> 'toast and milk', 'Sleep' -> '9:00'",
      },
      lvl2: {
        q: "Complete with: before / after. I wash my hands ... eating. I go to bed ... reading.",
      },
      lvl3: { q: "Write one thing you do after you wake up." },
    },
    evaluation: [
      {
        q: "What time does Bobby wake up?",
        choices: ["6:30", "7:00", "8:00"],
        answer: "6:30",
      },
      { q: "What does Bobby do after finishing school?", answer: "homework" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "up / I / at / . / half / wake / six / past",
          correct: "I wake up at half past six.",
        },
        {
          jumbled: "homework / Sami / . / does / his / afternoon / each",
          correct: "Sami does his homework each afternoon.",
        },
      ],
      reconstitution: [
        "First, I brush my teeth and wash my face.",
        "Then, I eat a healthy breakfast with milk.",
        "At nine o'clock, I go to bed to sleep.",
      ],
      cloze: {
        text: "Every [1], I wake up early at half past six. I eat a delicious [2] with toast and milk. I wear my school [3]. After school, I do my [4] and follow a healthy [5].",
        words: ["morning", "breakfast", "uniform", "homework", "routine"],
      },
      dialogue: [
        "Mother : Billy, it's half past six, time to wake up!",
        "Billy : Good morning Mom! I am brushing my teeth now.",
        "Mother : Great, your hot milk and toast are ready on the table.",
        "Billy : Thank you, I will wear my uniform and come down!",
      ],
    },
  },
  5: {
    id: 5,
    title: "When I Grow Up...",
    theme: "Dreams & Occupations (6th Form)",
    text: "What do you want to be when you grow up? I have a grand dream. I want to be an astronaut! I want to fly in a huge blue rocket and visit different planets. I want to float in space and see our beautiful green Earth from above. My friend Sara wants to be a doctor to cure sick kids. My brother David wants to be an engineer to build giant bridges. Everyone has a wonderful dream, and we work hard at school every day to make them come true!",
    vocab: ["dream", "astronaut", "rocket", "doctor", "engineer"],
    vocabOptions: {
      dream: [
        "Something you hope to achieve in the future",
        "A scary story",
        "A sleeping cushion",
      ],
      astronaut: [
        "A person trained to travel in a spacecraft",
        "A gardener who plants flowers",
        "A taxi driver",
      ],
      rocket: [
        "A vehicle used for traveling to space",
        "A wooden boat",
        "A big bicycle",
      ],
      doctor: [
        "A person who makes sick people feel better",
        "A professional soccer player",
        "An actor",
      ],
      engineer: [
        "A person who designs and builds machines or roads",
        "An artist",
        "A baker",
      ],
    },
    dictation: {
      text: "I have a big __. I want to be an __. I will fly in a __. Sara will be a __. David is an __.",
      words: ["dream", "astronaut", "rocket", "doctor", "engineer"],
    },
    exercises: {
      lvl1: {
        q: "Match : 'Bobby' -> 'Astronaut', 'Sara' -> 'Doctor', 'David' -> 'Engineer'",
      },
      lvl2: {
        q: "Complete with: build / cure / fly. Rockets ... to space. Doctors ... sick children. Engineers ... bridges.",
      },
      lvl3: { q: "Write what you want to be when you grow up." },
    },
    evaluation: [
      {
        q: "What does Bobby want to fly in?",
        choices: ["A car", "A rocket", "A plane"],
        answer: "A rocket",
      },
      { q: "Who wants to be a doctor?", answer: "Sara" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "astronaut / I / to / . / want / be / an",
          correct: "I want to be an astronaut.",
        },
        {
          jumbled: "hard / pupils / work / . / school / at",
          correct: "Pupils work hard at school.",
        },
      ],
      reconstitution: [
        "I have a grand dream for the future.",
        "I want to fly a rocket to the space.",
        "We study hard at school to succeed.",
      ],
      cloze: {
        text: "I have a grand [1] for my future. I want to be an [2] and fly a [3]. Sara wants to be a [4] to help kids. My brother wants to be an [5].",
        words: ["dream", "astronaut", "rocket", "doctor", "engineer"],
      },
      dialogue: [
        "Teacher : Excellent work class! Who can share their and dreams?",
        "Bobby : I want to be an astronaut and explore the moon!",
        "Teacher : That is amazing, Bobby! And what about you, Sara?",
        "Sara : I want to be a kind doctor so I can heal patients.",
      ],
    },
  },
};

interface ThemeStyle {
  id: string;
  name: string;
  emoji: string;
  cardBg: string;
  iconBg: string;
  badgeBg: string;
  badgeActive: string;
  primaryColor: string;
  glowColor: string;
  paperHeaderBg: string;
  paperBorder: string;
  paperHeaderBorder: string;
  paperTitle: string;
  bannerEmoji: string;
}

const DEFAULT_THEME_STYLE: ThemeStyle = {
  id: "default",
  name: "Général",
  emoji: "📝",
  cardBg:
    "bg-amber-50/40 hover:bg-amber-50/80 border-amber-100/70 hover:border-amber-500",
  iconBg: "text-amber-600 bg-amber-100/80",
  badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-700",
  badgeActive:
    "group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500",
  primaryColor: "text-amber-600",
  glowColor: "shadow-amber-100",
  paperHeaderBg: "bg-amber-50/10",
  paperBorder: "border-amber-500",
  paperHeaderBorder: "border-amber-200",
  paperTitle: "text-amber-800",
  bannerEmoji: "📝",
};

const THEME_STYLES: Record<string, ThemeStyle> = {
  "Family Life (4th Form)": {
    id: "family",
    name: "Family Life (4th Form)",
    emoji: "👨👩👧👦",
    cardBg:
      "bg-pink-50/40 hover:bg-pink-50/80 border-pink-100 hover:border-pink-500",
    iconBg: "text-pink-650 bg-pink-100/90",
    badgeBg: "bg-pink-500/10 border-pink-500/20 text-pink-700",
    badgeActive:
      "group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500",
    primaryColor: "text-pink-600",
    glowColor: "shadow-pink-100",
    paperHeaderBg: "bg-pink-50/20",
    paperBorder: "border-pink-500",
    paperHeaderBorder: "border-pink-200",
    paperTitle: "text-pink-850 font-black",
    bannerEmoji: "👨👩👧👦",
  },
  "School Environment (4th Form)": {
    id: "school",
    name: "School Environment (4th Form)",
    emoji: "🏫",
    cardBg:
      "bg-sky-50/40 hover:bg-sky-50/80 border-sky-100 hover:border-sky-500",
    iconBg: "text-sky-650 bg-sky-100/90",
    badgeBg: "bg-sky-500/10 border-sky-500/20 text-sky-700",
    badgeActive:
      "group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500",
    primaryColor: "text-sky-600",
    glowColor: "shadow-sky-100",
    paperHeaderBg: "bg-sky-50/20",
    paperBorder: "border-sky-500",
    paperHeaderBorder: "border-sky-200",
    paperTitle: "text-sky-850 font-black",
    bannerEmoji: "🏫",
  },
  "Animals & Nature (5th Form)": {
    id: "animals",
    name: "Animals & Nature (5th Form)",
    emoji: "🐱",
    cardBg:
      "bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-100 hover:border-emerald-505",
    iconBg: "text-emerald-650 bg-emerald-100/90",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700",
    badgeActive:
      "group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500",
    primaryColor: "text-emerald-600",
    glowColor: "shadow-emerald-100",
    paperHeaderBg: "bg-emerald-50/20",
    paperBorder: "border-emerald-505",
    paperHeaderBorder: "border-emerald-200",
    paperTitle: "text-emerald-850 font-black",
    bannerEmoji: "🐱",
  },
  "Everyday Life (5th Form)": {
    id: "routine",
    name: "Everyday Life (5th Form)",
    emoji: "⏰",
    cardBg:
      "bg-amber-50/40 hover:bg-amber-50/80 border-amber-100 hover:border-amber-500",
    iconBg: "text-amber-650 bg-amber-100/90",
    badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-700",
    badgeActive:
      "group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500",
    primaryColor: "text-amber-600",
    glowColor: "shadow-amber-100",
    paperHeaderBg: "bg-amber-50/20",
    paperBorder: "border-amber-500",
    paperHeaderBorder: "border-amber-200",
    paperTitle: "text-amber-850 font-black",
    bannerEmoji: "⏰",
  },
  "Dreams & Occupations (6th Form)": {
    id: "dreams",
    name: "Dreams & Occupations (6th Form)",
    emoji: "🚀",
    cardBg:
      "bg-purple-50/40 hover:bg-purple-50/80 border-purple-100 hover:border-purple-505",
    iconBg: "text-purple-650 bg-purple-100/90",
    badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-750",
    badgeActive:
      "group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500",
    primaryColor: "text-purple-600",
    glowColor: "shadow-purple-100",
    paperHeaderBg: "bg-purple-50/20",
    paperBorder: "border-purple-505",
    paperHeaderBorder: "border-purple-200",
    paperTitle: "text-purple-850 font-black",
    bannerEmoji: "🚀",
  },
  "Santé et Hygiène": {
    id: "sante",
    name: "Santé et Hygiène",
    emoji: "🩺",
    cardBg:
      "bg-teal-50/40 hover:bg-teal-50/80 border-teal-100 hover:border-teal-500",
    iconBg: "text-teal-650 bg-teal-100/90",
    badgeBg: "bg-teal-500/10 border-teal-500/20 text-teal-700",
    badgeActive:
      "group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500",
    primaryColor: "text-teal-600",
    glowColor: "shadow-teal-100",
    paperHeaderBg: "bg-teal-50/20",
    paperBorder: "border-teal-500",
    paperHeaderBorder: "border-teal-200",
    paperTitle: "text-teal-850 font-black",
    bannerEmoji: "🏥",
  },
  Loisirs: {
    id: "loisirs",
    name: "Loisirs",
    emoji: "🎡",
    cardBg:
      "bg-sky-50/40 hover:bg-sky-50/80 border-sky-100 hover:border-sky-500",
    iconBg: "text-sky-650 bg-sky-100/90",
    badgeBg: "bg-sky-500/10 border-sky-500/20 text-sky-700",
    badgeActive:
      "group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500",
    primaryColor: "text-sky-600",
    glowColor: "shadow-sky-100",
    paperHeaderBg: "bg-sky-50/20",
    paperBorder: "border-sky-500",
    paperHeaderBorder: "border-sky-200",
    paperTitle: "text-sky-850 font-black",
    bannerEmoji: "🎡",
  },
  "Loisirs et Divertissement": {
    id: "divertissement",
    name: "Loisirs et Divertissement",
    emoji: "🎪",
    cardBg:
      "bg-indigo-50/40 hover:bg-indigo-50/80 border-indigo-100 hover:border-indigo-500",
    iconBg: "text-indigo-655 bg-indigo-100/90",
    badgeBg: "bg-indigo-505/10 border-indigo-500/20 text-indigo-700",
    badgeActive:
      "group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500",
    primaryColor: "text-indigo-600",
    glowColor: "shadow-indigo-100",
    paperHeaderBg: "bg-indigo-50/20",
    paperBorder: "border-indigo-500",
    paperHeaderBorder: "border-indigo-200",
    paperTitle: "text-indigo-850 font-black",
    bannerEmoji: "🎪",
  },
  "Loisirs (Pique-nique)": {
    id: "piquenique",
    name: "Loisirs (Pique-nique)",
    emoji: "🧺",
    cardBg:
      "bg-rose-50/40 hover:bg-rose-50/80 border-rose-100 hover:border-rose-505",
    iconBg: "text-rose-650 bg-rose-100/90",
    badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-750",
    badgeActive:
      "group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500",
    primaryColor: "text-rose-600",
    glowColor: "shadow-rose-100",
    paperHeaderBg: "bg-rose-50/20",
    paperBorder: "border-rose-500",
    paperHeaderBorder: "border-rose-200",
    paperTitle: "text-rose-850 font-black",
    bannerEmoji: "🍉",
  },
  "Loisirs (Zoo)": {
    id: "zoo",
    name: "Loisirs (Zoo)",
    emoji: "🦁",
    cardBg:
      "bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-100 hover:border-emerald-505",
    iconBg: "text-emerald-650 bg-emerald-100/90",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700",
    badgeActive:
      "group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500",
    primaryColor: "text-emerald-600",
    glowColor: "shadow-emerald-100",
    paperHeaderBg: "bg-emerald-50/20",
    paperBorder: "border-emerald-505",
    paperHeaderBorder: "border-emerald-200",
    paperTitle: "text-emerald-850 font-black",
    bannerEmoji: "🦁",
  },
  "Vie Scolaire / Fêtes": {
    id: "scolaire",
    name: "Vie Scolaire / Fêtes",
    emoji: "🎓",
    cardBg:
      "bg-amber-50/40 hover:bg-amber-50/80 border-amber-100 hover:border-amber-505",
    iconBg: "text-amber-650 bg-amber-100/90",
    badgeBg: "bg-amber-500/10 border-amber-500/20 text-amber-700",
    badgeActive:
      "group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500",
    primaryColor: "text-amber-600",
    glowColor: "shadow-amber-100",
    paperHeaderBg: "bg-amber-50/20",
    paperBorder: "border-amber-500",
    paperHeaderBorder: "border-amber-200",
    paperTitle: "text-amber-850 font-black",
    bannerEmoji: "🏫",
  },
  "Fêtes et Célébrations": {
    id: "celebration",
    name: "Fêtes et Célébrations",
    emoji: "🎉",
    cardBg:
      "bg-fuchsia-50/40 hover:bg-fuchsia-50/80 border-fuchsia-100 hover:border-fuchsia-505",
    iconBg: "text-fuchsia-650 bg-fuchsia-100/90",
    badgeBg: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-700",
    badgeActive:
      "group-hover:bg-fuchsia-500 group-hover:text-white group-hover:border-fuchsia-500",
    primaryColor: "text-fuchsia-600",
    glowColor: "shadow-fuchsia-100",
    paperHeaderBg: "bg-fuchsia-50/20",
    paperBorder: "border-fuchsia-500",
    paperHeaderBorder: "border-fuchsia-200",
    paperTitle: "text-fuchsia-850 font-black",
    bannerEmoji: "🥳",
  },
  "Contes et Culture (Amérique)": {
    id: "conte-usa",
    name: "Contes & Culture",
    emoji: "🦅",
    cardBg:
      "bg-orange-50/40 hover:bg-orange-50/80 border-orange-100 hover:border-orange-505",
    iconBg: "text-orange-650 bg-orange-100/90",
    badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-700",
    badgeActive:
      "group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500",
    primaryColor: "text-orange-600",
    glowColor: "shadow-orange-150",
    paperHeaderBg: "bg-orange-50/20",
    paperBorder: "border-orange-500",
    paperHeaderBorder: "border-orange-200",
    paperTitle: "text-orange-850 font-black",
    bannerEmoji: "🦅",
  },
  "Contes d'Afrique": {
    id: "conte-afrique",
    name: "Contes d'Afrique",
    emoji: "🦁",
    cardBg:
      "bg-yellow-50/40 hover:bg-yellow-50/80 border-yellow-100 hover:border-yellow-505",
    iconBg: "text-yellow-650 bg-yellow-100/90",
    badgeBg: "bg-yellow-600/10 border-yellow-600/20 text-yellow-700",
    badgeActive:
      "group-hover:bg-yellow-600 group-hover:text-white group-hover:border-yellow-600",
    primaryColor: "text-yellow-600",
    glowColor: "shadow-yellow-105",
    paperHeaderBg: "bg-yellow-50/20",
    paperBorder: "border-yellow-505",
    paperHeaderBorder: "border-yellow-200",
    paperTitle: "text-yellow-850 font-black",
    bannerEmoji: "🌍",
  },
  "Contes d'Australie": {
    id: "conte-australie",
    name: "Contes d'Australie",
    emoji: "🦘",
    cardBg:
      "bg-cyan-50/40 hover:bg-cyan-50/80 border-cyan-100 hover:border-cyan-505",
    iconBg: "text-cyan-650 bg-cyan-100/90",
    badgeBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-700",
    badgeActive:
      "group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500",
    primaryColor: "text-cyan-600",
    glowColor: "shadow-cyan-100",
    paperHeaderBg: "bg-cyan-50/20",
    paperBorder: "border-cyan-505",
    paperHeaderBorder: "border-cyan-200",
    paperTitle: "text-cyan-850 font-black",
    bannerEmoji: "🦘",
  },
  "Contes de fées": {
    id: "conte-fees",
    name: "Contes de fées",
    emoji: "🧚",
    cardBg:
      "bg-violet-50/40 hover:bg-violet-50/80 border-violet-100 hover:border-violet-505",
    iconBg: "text-violet-650 bg-violet-100/90",
    badgeBg: "bg-violet-500/10 border-violet-500/20 text-violet-700",
    badgeActive:
      "group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500",
    primaryColor: "text-violet-600",
    glowColor: "shadow-violet-105",
    paperHeaderBg: "bg-violet-50/20",
    paperBorder: "border-violet-505",
    paperHeaderBorder: "border-violet-200",
    paperTitle: "text-violet-850 font-black",
    bannerEmoji: "✨",
  },
  "Conte classique": {
    id: "conte-classique",
    name: "Conte classique",
    emoji: "🏰",
    cardBg:
      "bg-pink-50/40 hover:bg-pink-50/80 border-pink-100 hover:border-pink-505",
    iconBg: "text-pink-650 bg-pink-100/90",
    badgeBg: "bg-pink-500/10 border-pink-500/20 text-pink-750",
    badgeActive:
      "group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500",
    primaryColor: "text-pink-600",
    glowColor: "shadow-pink-105",
    paperHeaderBg: "bg-pink-50/20",
    paperBorder: "border-pink-505",
    paperHeaderBorder: "border-pink-200",
    paperTitle: "text-pink-850 font-black",
    bannerEmoji: "👸",
  },
  "Amitié / Entraide / Tolérance": {
    id: "amitie-entraide",
    name: "Amitié & Tolérance",
    emoji: "🤝",
    cardBg:
      "bg-red-50/40 hover:bg-red-50/80 border-red-100 hover:border-red-505",
    iconBg: "text-red-550 bg-red-100/90",
    badgeBg: "bg-red-500/10 border-red-500/20 text-red-700",
    badgeActive:
      "group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500",
    primaryColor: "text-red-500",
    glowColor: "shadow-red-500/10",
    paperHeaderBg: "bg-red-50/20",
    paperBorder: "border-red-505",
    paperHeaderBorder: "border-red-200",
    paperTitle: "text-red-850 font-black",
    bannerEmoji: "❤️",
  },
  "Amitié / Tolérance": {
    id: "amitie-tolerance",
    name: "Amitié & Tolérance",
    emoji: "💖",
    cardBg:
      "bg-red-50/40 hover:bg-red-50/80 border-red-100 hover:border-red-505",
    iconBg: "text-red-550 bg-red-100/90",
    badgeBg: "bg-red-500/10 border-red-500/20 text-red-700",
    badgeActive:
      "group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500",
    primaryColor: "text-red-500",
    glowColor: "shadow-red-500/10",
    paperHeaderBg: "bg-red-50/20",
    paperBorder: "border-red-505",
    paperHeaderBorder: "border-red-200",
    paperTitle: "text-red-850 font-black",
    bannerEmoji: "🤝",
  },
  "Tolérance & Entraide": {
    id: "tolerance-entraide",
    name: "Tolérance & Entraide",
    emoji: "🤗",
    cardBg:
      "bg-rose-50/40 hover:bg-rose-50/80 border-rose-105 hover:border-rose-505",
    iconBg: "text-rose-550 bg-rose-100/90",
    badgeBg: "bg-rose-500/10 border-rose-500/20 text-rose-700",
    badgeActive:
      "group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500",
    primaryColor: "text-rose-500",
    glowColor: "shadow-rose-100",
    paperHeaderBg: "bg-rose-50/20",
    paperBorder: "border-rose-505",
    paperHeaderBorder: "border-rose-200",
    paperTitle: "text-rose-850 font-black",
    bannerEmoji: "🤝",
  },
  "Loisirs & Amitié": {
    id: "loisir-amitie",
    name: "Loisirs & Amitié",
    emoji: "🚴",
    cardBg:
      "bg-purple-50/40 hover:bg-purple-50/80 border-purple-100 hover:border-purple-505",
    iconBg: "text-purple-650 bg-purple-100/95",
    badgeBg: "bg-purple-500/10 border-purple-500/20 text-purple-700",
    badgeActive:
      "group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500",
    primaryColor: "text-purple-600",
    glowColor: "shadow-purple-100",
    paperHeaderBg: "bg-purple-50/20",
    paperBorder: "border-purple-505",
    paperHeaderBorder: "border-purple-200",
    paperTitle: "text-purple-850 font-black",
    bannerEmoji: "🪁",
  },
  "La Recette / Alimentation": {
    id: "recette",
    name: "Alimentation",
    emoji: "🍳",
    cardBg:
      "bg-orange-50/40 hover:bg-orange-50/80 border-orange-100 hover:border-orange-505",
    iconBg: "text-orange-650 bg-orange-100/90",
    badgeBg: "bg-orange-500/10 border-orange-500/20 text-orange-700",
    badgeActive:
      "group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500",
    primaryColor: "text-orange-600",
    glowColor: "shadow-orange-100",
    paperHeaderBg: "bg-orange-50/20",
    paperBorder: "border-orange-505",
    paperHeaderBorder: "border-orange-200",
    paperTitle: "text-orange-850 font-black",
    bannerEmoji: "🍳",
  },
  "Vie d'autrefois": {
    id: "autrefois",
    name: "Vie d'autrefois",
    emoji: "📜",
    cardBg:
      "bg-stone-50/40 hover:bg-stone-50/80 border-stone-200 hover:border-stone-505",
    iconBg: "text-stone-650 bg-stone-100/95",
    badgeBg: "bg-stone-500/10 border-stone-500/20 text-stone-700",
    badgeActive:
      "group-hover:bg-stone-500 group-hover:text-white group-hover:border-stone-500",
    primaryColor: "text-stone-600",
    glowColor: "shadow-stone-100",
    paperHeaderBg: "bg-stone-50/20",
    paperBorder: "border-stone-505",
    paperHeaderBorder: "border-stone-200",
    paperTitle: "text-stone-850 font-black",
    bannerEmoji: "📜",
  },
  Voyages: {
    id: "voyages",
    name: "Voyages",
    emoji: "✈️",
    cardBg:
      "bg-sky-50/40 hover:bg-sky-50/80 border-sky-100 hover:border-sky-505",
    iconBg: "text-sky-650 bg-sky-100/90",
    badgeBg: "bg-sky-500/10 border-sky-500/20 text-sky-700",
    badgeActive:
      "group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500",
    primaryColor: "text-sky-600",
    glowColor: "shadow-sky-100",
    paperHeaderBg: "bg-sky-50/20",
    paperBorder: "border-sky-505",
    paperHeaderBorder: "border-sky-200",
    paperTitle: "text-sky-850 font-black",
    bannerEmoji: "🗺️",
  },
  Modernité: {
    id: "modernite",
    name: "Modernité",
    emoji: "🏙️",
    cardBg:
      "bg-slate-50/40 hover:bg-slate-50/80 border-slate-105 hover:border-slate-505",
    iconBg: "text-slate-650 bg-slate-100/90",
    badgeBg: "bg-slate-500/10 border-slate-500/20 text-slate-700",
    badgeActive:
      "group-hover:bg-slate-500 group-hover:text-white group-hover:border-slate-500",
    primaryColor: "text-slate-650",
    glowColor: "shadow-slate-105",
    paperHeaderBg: "bg-slate-50/20",
    paperBorder: "border-slate-505",
    paperHeaderBorder: "border-slate-200",
    paperTitle: "text-slate-850 font-black",
    bannerEmoji: "🤖",
  },
  "La Nature": {
    id: "nature",
    name: "La Nature",
    emoji: "🌳",
    cardBg:
      "bg-green-50/40 hover:bg-green-50/80 border-green-100 hover:border-green-505",
    iconBg: "text-green-655 bg-green-100/90",
    badgeBg: "bg-green-500/10 border-green-500/20 text-green-700",
    badgeActive:
      "group-hover:bg-green-505 group-hover:text-white group-hover:border-green-505",
    primaryColor: "text-green-600",
    glowColor: "shadow-green-100",
    paperHeaderBg: "bg-green-50/20",
    paperBorder: "border-green-505",
    paperHeaderBorder: "border-green-200",
    paperTitle: "text-green-850 font-black",
    bannerEmoji: "🌿",
  },
  Environnement: {
    id: "environnement",
    name: "Environnement",
    emoji: "🍀",
    cardBg:
      "bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-110 hover:border-emerald-505",
    iconBg: "text-emerald-655 bg-emerald-100/90",
    badgeBg: "bg-emerald-505/10 border-emerald-500/20 text-emerald-700",
    badgeActive:
      "group-hover:bg-emerald-550 group-hover:text-white group-hover:border-emerald-555",
    primaryColor: "text-emerald-600",
    glowColor: "shadow-emerald-100",
    paperHeaderBg: "bg-emerald-50/20",
    paperBorder: "border-emerald-505",
    paperHeaderBorder: "border-emerald-200",
    paperTitle: "text-emerald-850 font-black",
    bannerEmoji: "♻️",
  },
  "Le Savoir": {
    id: "savoir",
    name: "Le Savoir",
    emoji: "📚",
    cardBg:
      "bg-blue-50/40 hover:bg-blue-50/85 border-blue-105 hover:border-blue-505",
    iconBg: "text-blue-650 bg-blue-100/90",
    badgeBg: "bg-blue-500/10 border-blue-500/20 text-blue-700",
    badgeActive:
      "group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500",
    primaryColor: "text-blue-600",
    glowColor: "shadow-blue-100",
    paperHeaderBg: "bg-blue-50/20",
    paperBorder: "border-blue-505",
    paperHeaderBorder: "border-blue-200",
    paperTitle: "text-blue-850 font-black",
    bannerEmoji: "🎓",
  },
  "Science-Fiction": {
    id: "scifi",
    name: "Science-Fiction",
    emoji: "🛸",
    cardBg:
      "bg-indigo-50/40 hover:bg-indigo-50/80 border-indigo-100 hover:border-indigo-550",
    iconBg: "text-indigo-650 bg-indigo-100/90",
    badgeBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-700",
    badgeActive:
      "group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500",
    primaryColor: "text-indigo-600",
    glowColor: "shadow-indigo-100",
    paperHeaderBg: "bg-indigo-50/20",
    paperBorder: "border-indigo-505",
    paperHeaderBorder: "border-indigo-200",
    paperTitle: "text-indigo-850 font-black",
    bannerEmoji: "🛸",
  },
};

function getThemeStyle(theme: string): ThemeStyle {
  return THEME_STYLES[theme] || DEFAULT_THEME_STYLE;
}

interface Fiche {
  id: number;
  title: string;
  theme: string;
  text: string;
  vocab: string[];
  vocabOptions?: Record<string, string[]>;
  definitions?: Record<string, string>;
  exercises: {
    lvl1: any;
    lvl2: any;
    lvl3: any;
  };
  evaluation: any[];
  dictation?: {
    text: string;
    words: string[];
  };
  dossierContent?: {
    redaction: { jumbled: string; correct: string }[];
    reconstitution: string[];
    cloze?: { text: string; words: string[] };
    dialogue?: string[];
  };
}

const FICHES: Record<number, Fiche> = {
  1: {
    id: 1,
    title: "La maladie de Jacquot",
    theme: "Santé et Hygiène",
    text: "Aujourd'hui, Jacquot est très malade. Il reste au lit car il a une forte fièvre et le corps brûlant. Sa maman appelle le docteur. Le médecin arrive rapidement. Il examine le petit garçon. Avec son stéthoscope, il écoute les battements de son cœur, puis il regarde le fond de sa gorge qui est toute rouge. Le gentil docteur sort un stylo et rédige une ordonnance. Il conseille à Jacquot de boire beaucoup d'eau et de rester au chaud. Pour finir, la maman court à la pharmacie pour acheter les médicaments et un bon sirop contre la toux.",
    vocab: [
      "malade",
      "médecin",
      "fièvre",
      "docteur",
      "examine",
      "stéthoscope",
      "gorge",
      "ordonnance",
      "conseille",
      "pharmacie",
      "sirop",
    ],
    vocabOptions: {
      malade: [
        "Qui ne se sent pas bien ou a une maladie. Exemple : Jacquot est malade, il a de la fièvre.",
        "Qui est très joyeux et court partout",
        "Qui va à l'école pour apprendre",
      ],
      médecin: [
        "Personne dont le métier est de soigner les gens. Exemple : Le médecin arrive pour voir Jacquot.",
        "Un pilote d'avion de ligne",
        "Un boulanger qui fait du pain",
      ],
      fièvre: [
        "Quand le corps est trop chaud",
        "Un type de vêtement",
        "Une boisson fraîche",
      ],
      docteur: [
        "Une personne qui soigne les gens",
        "Un marchand de jouet",
        "Un conducteur de bus",
      ],
      examine: [
        "Regarder attentivement pour soigner",
        "Jouer au ballon",
        "Manger un gâteau",
      ],
      stéthoscope: [
        "Instrument médical pour écouter le cœur ou les poumons. Exemple : Le docteur utilise son stéthoscope.",
        "Un stylo pour écrire une lettre",
        "Une louche de cuisine",
      ],
      gorge: [
        "Partie du corps pour avaler",
        "Une partie du pied",
        "Un type de chapeau",
      ],
      ordonnance: [
        "Papier du médecin pour les soins",
        "Une lettre pour un ami",
        "Un ticket de bus",
      ],
      conseille: [
        "Donner un avis utile",
        "Crier très fort",
        "Partir en voyage",
      ],
      pharmacie: [
        "Lieu où on achète les médicaments",
        "Un magasin de jouets",
        "Un parc d'attraction",
      ],
      sirop: [
        "Médicament liquide et sucré",
        "Un jus de légume amer",
        "Une soupe chaude",
      ],
    },
    dictation: {
      text: "Le __ examine Jacquot avec son __. Il regarde sa __ et écrit une __. Sa maman court à la __.",
      words: ["docteur", "stéthoscope", "gorge", "ordonnance", "pharmacie"],
    },
    exercises: {
      lvl1: {
        q: "Je relie par une flèche : 'Jacquot' -> 'est malade', 'La maman' -> 'appelle le docteur', 'Le médecin' -> 'rédige une ordonnance'",
      },
      lvl2: {
        q: "Je complète par : est / sont. Jacquot ... malade. Les médicaments ... dans la pharmacie.",
      },
      lvl3: {
        q: "J'écris une phrase pour dire ce que Jacquot doit faire pour guérir.",
      },
    },
    evaluation: [
      {
        q: "Pourquoi Jacquot ne va-t-il pas à l'école ?",
        choices: ["Il est en vacances", "Il est malade", "Il fait beau"],
        answer: "Il est malade",
      },
      { q: "Qu'est-ce que le docteur rédige ?", answer: "une ordonnance" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "aujourd'hui / au / Jacquot / lit / est / malade / .",
          correct: "Aujourd'hui Jacquot est malade au lit.",
        },
        {
          jumbled: "maman / front / brûlant / son / touche / Sa / .",
          correct: "Sa maman touche son front brûlant.",
        },
        {
          jumbled: "appelle / vite / elle / médecin / Le / .",
          correct: "Elle appelle vite le médecin.",
        },
        {
          jumbled: "arrive / avec / docteur / sacoche / Le / sa / .",
          correct: "Le docteur arrive avec sa sacoche.",
        },
        {
          jumbled:
            "examine / ausculte / Il / le / petit / et / malade / l' / .",
          correct: "Il examine et ausculte le petit malade.",
        },
        {
          jumbled: "ordonnance / rédige / une / sur / table / la / Il / .",
          correct: "Il rédige une ordonnance sur la table.",
        },
        {
          jumbled: "d' / avaler / sirop / Il / conseille / du / .",
          correct: "Il conseille d'avaler du sirop.",
        },
        {
          jumbled: "bien / se / Jacquot / se / reposer / doit / .",
          correct: "Jacquot doit bien se reposer.",
        },
      ],
      reconstitution: [
        "Ce matin, Jacquot ne va pas à l’école parce qu’il a une forte fièvre.",
        "Il a des boutons rouges sur tout le corps et il tousse beaucoup.",
        "Inquiète, sa maman décide de téléphoner tout de suite au docteur.",
        "Le médecin arrive à la maison, salue la famille et s'approche du lit.",
        "Il pose son stéthoscope sur la poitrine du petit garçon pour l’ausculter.",
        "Enfin, le docteur écrit les médicaments sur une ordonnance.",
        "La maman prépare une bonne tisane chaude pour son fils.",
        "Avant de partir, il conseille à Jacquot de rester sagement au chaud.",
      ],
      cloze: {
        text: "Aujourd'hui, Jacquot est très [1]. Il reste au lit car il a une forte [2] et le corps brûlant. Sa maman appelle le [3]. Le médecin arrive rapidement. Il [4] le petit garçon. Avec son [5], il écoute les battements de son cœur, puis il regarde le fond de sa [6] qui est toute rouge. Le gentil docteur sort un stylo et rédige une [7]. Il [8] à Jacquot de boire beaucoup d'eau et de rester au chaud. Pour finir, la maman court à la [9] pour acheter les médicaments et un bon [10] contre la toux.",
        words: [
          "stéthoscope",
          "gorge",
          "docteur",
          "sirop",
          "malade",
          "fièvre",
          "ordonnance",
          "examine",
          "pharmacie",
          "conseille",
        ],
      },
      dialogue: [
        "Le médecin : Bonjour Jacquot. Dis-moi, où as-tu mal aujourd'hui ?",
        "Jacquot : Bonjour Docteur. J’ai très mal à la tête et j’ai froid.",
        "Le médecin : Ne t'inquiète pas. Ouvre la bouche et dis \"Ah\". C'est une grippe.",
        "Jacquot : Ahhh... Est-ce que c'est grave, Docteur ?",
        "Le médecin : Non, repose-toi bien et prends tes médicaments sagement.",
        "Jacquot : D'accord. Merci beaucoup pour vos conseils, Docteur !",
      ],
    },
  },
  2: {
    id: 2,
    title: "Le cirque arrive en ville",
    theme: "Loisirs et Divertissement",
    text: "Un grand chapiteau rouge s'installe sur la place du village. C'est le cirque ! Ce soir, les enfants et leurs parents se précipitent pour acheter des places. Le spectacle commence. Les clowns entrent en scène et font des grimaces comiques. Les jongleurs lancent des balles multicolores dans les airs sans jamais les faire tomber. Un acrobate marche prudemment sur un fil très haut. Les spectateurs applaudissent joyeusement. Quelle soirée magnifique !",
    vocab: ["chapiteau", "jongleur", "acrobate", "clown", "spectacle"],
    vocabOptions: {
      chapiteau: [
        "Une grande tente de cirque",
        "Un type de chapeau",
        "Une maison en bois",
      ],
      jongleur: [
        "Artiste qui lance des objets",
        "Un joueur de football",
        "Un musicien",
      ],
      acrobate: [
        "Artiste qui fait des sauts",
        "Un vendeur de popcorn",
        "Un spectateur",
      ],
      clown: ["Personnage drôle et maquillé", "Un policier", "Un instituteur"],
      spectacle: [
        "Une représentation artistique",
        "Un livre d'images",
        "Un repas de fête",
      ],
    },
    dictation: {
      text: "Le __ amuse les enfants. Le __ jongle avec des balles. L'__ marche sur un fil. Les gens voient le __. C'est un beau __.",
      words: ["clown", "jongleur", "acrobate", "chapiteau", "spectacle"],
    },
    exercises: {
      lvl1: {
        q: "Coche la bonne réponse : Le cirque est (à la mer / sur la place).",
      },
      lvl2: {
        q: "Mets les mots au pluriel : Le clown rigolo -> Les ... ... .",
      },
      lvl3: {
        q: "Écris une phrase pour décrire ton numéro de cirque préféré.",
      },
    },
    evaluation: [
      {
        q: "De quelle couleur est le chapiteau ?",
        choices: ["Bleu", "Vert", "Rouge"],
        answer: "Rouge",
      },
      { q: "Que font les clowns ?", answer: "des grimaces comiques" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "cirque / Le / . / arrive / ville / en",
          correct: "Le cirque arrive en ville.",
        },
        {
          jumbled: "chapiteau / est / Le / . / rouge",
          correct: "Le chapiteau est rouge.",
        },
        {
          jumbled: "font / Les / . / grimaces / clowns / des",
          correct: "Les clowns font des grimaces.",
        },
        {
          jumbled: "jongleurs / Les / . / balles / lancent / des",
          correct: "Les jongleurs lancent des balles.",
        },
        {
          jumbled: "marche / L' / . / fil / sur / un / acrobate",
          correct: "L'acrobate marche sur un fil.",
        },
        {
          jumbled: "enfants / Les / . / joyeux / sont",
          correct: "Les enfants sont joyeux.",
        },
        {
          jumbled: "place / se / sur / Le / . / cirque / s'installe",
          correct: "Le cirque s'installe sur la place.",
        },
        {
          jumbled: "spectacle / . / Le / magnifique / est",
          correct: "Le spectacle est magnifique.",
        },
      ],
      reconstitution: [
        "Un grand chapiteau s'installe au village.",
        "Tout le monde court acheter des billets.",
        "La lumière s'éteint et le spectacle commence.",
        "Les clowns arrivent et font rire les enfants.",
        "Les jongleurs montrent leur grande agilité.",
        "L'acrobate fait des sauts périlleux sur son fil.",
        "Le public applaudit les artistes de toutes ses forces.",
        "Les enfants rentrent chez eux avec des étoiles plein les yeux.",
      ],
      cloze: {
        text: "Un grand [1] rouge s'installe sur la place. Ce soir, les enfants se précipitent pour acheter des [2]. Le [3] commence. Les clowns font des [4] comiques. Les [5] lancent des balles multicolores. Un [6] marche prudemment sur un [7] très haut. Les [8] applaudissent joyeusement. Quelle soirée magnifique !",
        words: [
          "chapiteau",
          "places",
          "spectacle",
          "grimaces",
          "jongleurs",
          "acrobate",
          "fil",
          "spectateurs",
        ],
      },
      dialogue: [
        "Papa : Regardez les enfants, le grand chapiteau rouge du cirque est installé !",
        "Sami : Oh oui ! Est-ce qu'on peut aller voir le spectacle ce soir ?",
        "Papa : Bien sûr, j'ai déjà acheté les billets pour toute la famille.",
        "Mouna : Super ! Je veux absolument voir les clowns faire des grimaces.",
        "Sami : Et moi, j'ai hâte de voir les jongleurs avec leurs balles multicolores.",
        "Papa : Préparez-vous alors, la représentation commence dans une heure !",
      ],
    },
  },
  3: {
    id: 3,
    title: "Une journée à la campagne",
    theme: "Loisirs (Pique-nique)",
    text: "Dimanche, il fait très beau. La famille de Sami décide de partir à la campagne pour un grand pique-nique. Ils chargent la voiture avec des paniers remplis de nourriture. Arrivés près d'une rivière, ils installent une nappe sur l'herbe verte. Sami et sa sœur jouent au ballon tandis que papa prépare les grillades. Maman découpe les fruits frais. Après le repas, ils font une longue promenade sous les arbres. Ils écoutent le chant des oiseaux. C'est une journée de repos inoubliable.",
    vocab: ["pique-nique", "campagne", "rivière", "grillade", "promenade"],
    vocabOptions: {
      "pique-nique": [
        "Repas mangé en plein air",
        "Une sieste l'après-midi",
        "Un sport de ballon",
      ],
      campagne: [
        "Lieu avec champs et nature",
        "Un grand centre commercial",
        "Le centre d'une ville",
      ],
      rivière: [
        "Cours d'eau qui coule",
        "Une grande montagne",
        "Une route pour voitures",
      ],
      grillade: [
        "Viande cuite sur le feu",
        "Un dessert glacé",
        "Une soupe de légumes",
      ],
      promenade: [
        "Action de marcher pour le plaisir",
        "Dormir dans sa chambre",
        "Faire ses devoirs",
      ],
    },
    dictation: {
      text: "La famille va à la __. Ils mangent près de la __. Ils font un __. Papa prépare une __. C'est une belle __.",
      words: ["campagne", "rivière", "pique-nique", "grillade", "promenade"],
    },
    exercises: {
      lvl1: { q: "Écris Vrai ou Faux : Sami est à la plage. (...)" },
      lvl2: {
        q: "Je complète par : un / une. ... panier, ... voiture, ... rivière.",
      },
      lvl3: {
        q: "Écris deux choses qu'on peut manger pendant un pique-nique.",
      },
    },
    evaluation: [
      {
        q: "Où va la famille de Sami ?",
        choices: ["À l'école", "À la campagne", "Au zoo"],
        answer: "À la campagne",
      },
      { q: "Où installent-ils la nappe ?", answer: "sur l'herbe verte" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "campagne / La / . / va / à / famille / la",
          correct: "La famille va à la campagne.",
        },
        {
          jumbled: "pique-nique / font / Ils / . / un / grand",
          correct: "Ils font un grand pique-nique.",
        },
        {
          jumbled: "voiture / Ils / . / chargent / la",
          correct: "Ils chargent la voiture.",
        },
        {
          jumbled: "rivière / Ils / . / s'installent / la / près / de",
          correct: "Ils s'installent près de la rivière.",
        },
        {
          jumbled: "ballon / Sami / . / joue / au",
          correct: "Sami joue au ballon.",
        },
        {
          jumbled: "grillades / Papa / . / les / prépare",
          correct: "Papa prépare les grillades.",
        },
        {
          jumbled: "fruits / Maman / . / découpe / les",
          correct: "Maman découpe les fruits.",
        },
        {
          jumbled: "promenade / Ils / . / font / une / belle",
          correct: "Ils font une belle promenade.",
        },
      ],
      reconstitution: [
        "Dimanche, il fait beau et la famille part à la campagne.",
        "Ils remplissent des paniers avec de la nourriture délicieuse.",
        "Arrivés près de la rivière, ils choisissent un coin d'herbe.",
        "Sami et Mouna sont contents et courent partout.",
        "Pendant que papa allume le feu, maman prépare les fruits.",
        "Le repas est fini, tout le monde a bien mangé.",
        "La famille décide de faire une marche sous les arbres.",
        "Le soir tombe, il est temps de rentrer à la maison.",
      ],
      dialogue: [
        "Maman : Les enfants, aidez-moi à porter les paniers de pique-nique jusqu'à la voiture.",
        "Sami : J'adore les dimanches à la campagne, il fait si beau aujourd'hui !",
        "Papa : Regardez cette belle prairie près de la rivière, installons la nappe ici.",
        "Mouna : Je peux aller jouer au ballon avec Sami en attendant le repas ?",
        "Maman : Oui, mais ne vous approchez pas trop de l'eau tout seuls.",
        "Sami : Merci maman ! On va courir un peu sur l'herbe fraîche.",
      ],
    },
  },
  4: {
    id: 4,
    title: "La fête de l'école",
    theme: "Vie Scolaire / Fêtes",
    text: "C'est le dernier jour du trimestre. L'école est décorée avec des ballons et des guirlandes colorées. C'est la fête ! Les élèves portent des costumes magnifiques : il y a des princesses, des chevaliers et des animaux. Dans la cour, les enfants chantent et dansent devant leurs parents. Le directeur distribue des prix aux meilleurs élèves. Ensuite, tout le monde mange des gâteaux et boit du jus d'orange. Quelle ambiance joyeuse dans notre école !",
    vocab: ["guirlande", "costume", "directeur", "trimestre", "ambiance"],
    vocabOptions: {
      guirlande: [
        "Long ruban de papier ou de fleurs pour décorer. Exemple : On accroche des guirlandes pour la fête.",
        "Un outil de jardinage",
        "Un type de chaussure",
      ],
      costume: [
        "Vêtement spécial pour se déguiser. Exemple : Sami porte un costume de lion pour le spectacle.",
        "Un cartable d'école",
        "Une boîte de peinture",
      ],
      directeur: [
        "Personne qui commande et dirige toute l'école. Exemple : Le directeur donne des prix aux élèves.",
        "Un élève de la classe",
        "Un chauffeur de taxi",
      ],
      trimestre: [
        "Période de trois mois à l'école. Exemple : À la fin du trimestre, nous avons des vacances.",
        "Une semaine de vacances",
        "Un jour de fête",
      ],
      ambiance: [
        "L'atmosphère ou le sentiment d'un lieu. Exemple : Quelle ambiance joyeuse dans notre école !",
        "Une règle à mesurer",
        "Un livre de lecture",
      ],
    },
    dictation: {
      text: "C'est la fin du __. L'école a une belle __. On accroche une __. Chaque élève porte un __. Le __ donne des prix.",
      words: ["trimestre", "ambiance", "guirlande", "costume", "directeur"],
    },
    exercises: {
      lvl1: {
        q: "Relie : 'Ballons' -> 'décoration', 'Jus' -> 'boisson', 'Costumes' -> 'vêtements'",
      },
      lvl2: { q: "Je complète : Mon école / Mes écoles. ... jolie fête." },
      lvl3: {
        q: "Écris une phrase pour dire comment tu es habillé pour la fête.",
      },
    },
    evaluation: [
      {
        q: "Comment est décorée l'école ?",
        choices: ["Avec des fleurs", "Avec des guirlandes", "Sans décoration"],
        answer: "Avec des guirlandes",
      },
      { q: "Qui distribue les prix ?", answer: "le directeur" },
    ],
  },
  5: {
    id: 5,
    title: "Au zoo du Belvédère",
    theme: "Loisirs (Zoo)",
    text: "Pendant les vacances, les élèves visitent le zoo du Belvédère. Ils sont émerveillés par la diversité des animaux. Ils voient le lion majestueux qui rugit, la girafe au cou immense et les singes qui font des acrobaties. Un soigneur explique comment les animaux vivent et ce qu'ils mangent. Les enfants prennent des photos et posent beaucoup de questions. Ils apprennent qu'il faut protéger les animaux et respecter la nature.",
    vocab: ["émerveillé", "majestueux", "rugir", "soigneur", "diversité"],
    vocabOptions: {
      émerveillé: [
        "Très surpris et content",
        "Triste et en colère",
        "Fatigué et endormi",
      ],
      majestueux: [
        "Qui a beaucoup de noblesse",
        "Petit et caché",
        "Rapide et bruyant",
      ],
      rugir: [
        "Cri puissant du lion",
        "Chanter doucement",
        "Siffler comme un oiseau",
      ],
      soigneur: [
        "Personne qui soigne les animaux",
        "Un visiteur du zoo",
        "Un photographe",
      ],
      diversité: [
        "Grand choix de choses différentes",
        "Une seule chose",
        "Un objet cassé",
      ],
    },
    dictation: {
      text: "Le lion est __. Sami est __ par les animaux. On voit une grande __. Le __ rugit fort. Le __ aide les bêtes.",
      words: ["majestueux", "émerveillé", "diversité", "lion", "soigneur"],
    },
    exercises: {
      lvl1: {
        q: "Coche les animaux du texte : (Lion / Éléphant / Girafe / Ours)",
      },
      lvl2: {
        q: "Complète : Le singe (faire) ... des grimaces. Les enfants (voir) ... le lion.",
      },
      lvl3: { q: "Quel est ton animal préféré et pourquoi ?" },
    },
    evaluation: [
      {
        q: "Quel zoo visitent les élèves ?",
        choices: ["Zoo de Paris", "Zoo du Belvédère", "Zoo de Londres"],
        answer: "Zoo du Belvédère",
      },
      { q: "Que font les singes ?", answer: "des acrobaties" },
    ],
  },
  6: {
    id: 6,
    title: "Le petit Indien du Canada",
    theme: "Contes et Culture (Amérique)",
    text: "Lointain, dans le grand Nord du Canada, vit un petit garçon indien nommé Nuage-Bleu. Son peuple habite dans des tipis et porte des vêtements en peau de bête. Nuage-Bleu sait très bien chasser avec son arc et pêcher dans les lacs glacés. Un jour, il rencontre un louveteau blessé dans la neige. Au lieu de le laisser, il le soigne et lui donne à manger. Depuis ce jour, le louveteau et l'enfant sont inséparables. C'est une belle histoire d'amitié entre l'homme et l'animal.",
    vocab: ["tipi", "chasser", "louveteau", "inséparable", "indien"],
    vocabOptions: {
      tipi: [
        "Maison pointue des Indiens",
        "Un petit bateau",
        "Une paire de chaussures",
      ],
      chasser: [
        "Poursuivre pour attraper",
        "Manger des bonbons",
        "Faire un dessin",
      ],
      louveteau: ["Le petit du loup", "Un petit chat", "Un oiseau bleu"],
      inséparable: [
        "Qui ne peut pas être quitté",
        "Qui est très méchant",
        "Qui est cassé",
      ],
      indien: [
        "Habitant d'Amérique du Nord",
        "Une personne qui fait du pain",
        "Un soldat de l'espace",
      ],
    },
    dictation: {
      text: "Le petit __ vit dans un __. Il aime __ pour manger. Il soigne un __. Ils sont __.",
      words: ["indien", "tipi", "chasser", "louveteau", "inséparable"],
    },
    exercises: {
      lvl1: { q: "Vrai ou Faux : Nuage-Bleu vit dans une maison. (...)" },
      lvl2: {
        q: "Je remplace Nuage-Bleu par IL : Nuage-Bleu soigne le louveteau. -> ... soigne le louveteau.",
      },
      lvl3: {
        q: "Écris une phrase pour dire comment sont Nuage-Bleu et le louveteau.",
      },
    },
    evaluation: [
      {
        q: "Où vit Nuage-Bleu ?",
        choices: ["En Afrique", "Au Canada", "En Australie"],
        answer: "Au Canada",
      },
      { q: "Comment s'appelle l'habitation des Indiens ?", answer: "un tipi" },
    ],
  },
  7: {
    id: 7,
    title: "Le courage de Fatma",
    theme: "Courage et Détermination",
    text: "Une violente tempête de sable s'abat soudain sur le village de Fatma. Le vent souffle très fort sur les dunes de sable jaune et affole tout le troupeau de chèvres. Au milieu de ce tourbillon poussiéreux, le petit frère de Fatma disparaît. Courageuse, la petite fille décide d'affronter la tempête pour le retrouver. Elle marche avec force contre le vent. Finalement, elle découvre son petit frère et un jeune agneau blottis contre un grand rocher. Elle les rassure doucement. Grâce à sa bravoure, toute la famille est saine et sauve.",
    vocab: ["tempête", "sable", "troupeau", "agneau", "courageuse"],
    vocabOptions: {
      tempête: [
        "Violent coup de vent accompagné de poussière ou de pluie. Exemple : Une violente tempête s'abat sur le village.",
        "Une douce brise d'été rafraîchissante",
        "Un grand arc-en-ciel après la pluie",
      ],
      sable: [
        "Petits grains minéraux formant le sol du désert. Exemple : Le vent soulève de fins grains de sable jaune.",
        "De la neige blanche et très fraîche",
        "De la peinture brillante",
      ],
      troupeau: [
        "Groupe de bêtes qui vivent et se déplacent ensemble. Exemple : Le troupeau de chèvres est affolé.",
        "Une meute de loups affamés",
        "Une classe de petits enfants qui jouent",
      ],
      agneau: [
        "Le petit de la brebis, doux et fragile. Exemple : Fatma serre l'agneau tout contre elle.",
        "Un grand chameau robuste",
        "Un oiseau qui vole dans le ciel",
      ],
      courageuse: [
        "Qui montre de la bravoure devant le danger. Exemple : Fatma est très courageuse dans la tempête.",
        "Qui a peur de tout et court se cacher",
        "Qui aime beaucoup dormir l'après-midi",
      ],
    },
    dictation: {
      text: "Une violente __ de __ s'abat sur le village. Fatma cherche le __ de chèvres. Elle retrouve le petit __. Elle est très __.",
      words: ["tempête", "sable", "troupeau", "agneau", "courageuse"],
    },
    exercises: {
      lvl1: {
        q: "Vrai ou Faux : Une tempête de neige s'abat sur le village. (...)",
      },
      lvl2: {
        q: "Mets au féminin : Un garçon courageux -> Une fille ... . Un agneau blanc -> Une chèvre ... .",
      },
      lvl3: {
        q: "Écris une phrase pour dire où se cachait le petit frère de Fatma.",
      },
    },
    evaluation: [
      {
        q: "Quel événement violent s'abat sur le village de Fatma ?",
        choices: [
          "Une forte tempête de neige",
          "Une violente tempête de sable",
          "Une éruption volcanique",
        ],
        answer: "Une violente tempête de sable",
      },
      {
        q: "Où Fatma retrouve-t-elle l'agneau ?",
        answer: "blotti derrière un rocher",
      },
    ],
  },
  8: {
    id: 8,
    title: "La recette des crêpes",
    theme: "La Recette / Alimentation",
    text: "Aujourd'hui, c'est l'anniversaire d'Amine. Sa maman décide de préparer des crêpes délicieuses. Elle mélange de la farine, des œufs, du lait et un peu de sucre dans un grand saladier. Elle bat le mélange avec un fouet jusqu'à ce qu'il soit lisse. Ensuite, elle fait chauffer une poêle avec un morceau de beurre. Elle verse une louche de pâte. Quelques minutes plus tard, la crêpe est prête ! Amine ajoute du chocolat fondu et des morceaux de banane. Miam, quel régal !",
    vocab: ["mélanger", "farine", "fouet", "poêle", "louche"],
    vocabOptions: {
      mélanger: [
        "Mettre ensemble et remuer",
        "Casser en mille morceaux",
        "Le jeter à la poubelle",
      ],
      farine: [
        "Poudre blanche pour faire le pain",
        "De la peinture jaune",
        "Du sable de la plage",
      ],
      fouet: [
        "Ustensile pour battre les œufs",
        "Un balai pour le sol",
        "Une petite cuillère",
      ],
      poêle: [
        "Ustensile pour cuire les aliments",
        "Une assiette creuse",
        "Un verre d'eau",
      ],
      louche: [
        "Grande cuillère profonde",
        "Une fourchette pointue",
        "Un petit couteau",
      ],
    },
    dictation: {
      text: "Il faut __ la __. On utilise un __. On cuit dans une __. On verse avec une __.",
      words: ["mélanger", "farine", "fouet", "poêle", "louche"],
    },
    exercises: {
      lvl1: {
        q: "Quels ingrédients sont utilisés ? (Pain / Farine / Œufs / Sel / Sucre)",
      },
      lvl2: { q: "Mets dans l'ordre : 'Mélanger' -> 'Chauffer' -> 'Déguster'" },
      lvl3: { q: "Écris une phrase pour dire ce que tu mets sur tes crêpes." },
    },
    evaluation: [
      {
        q: "Que prépare la maman d'Amine ?",
        choices: ["Un gâteau", "Des crêpes", "Une soupe"],
        answer: "Des crêpes",
      },
      {
        q: "Que met Amine sur ses crêpes ?",
        answer: "du chocolat et de la banane",
      },
    ],
  },
  9: {
    id: 9,
    title: "La Hyène et le Lièvre",
    theme: "Contes d'Afrique",
    text: "Dans la savane africaine, la hyène et le lièvre sont voisins. La hyène est très gourmande et méchante, alors que le lièvre est petit mais très rusé. Un jour, la hyène veut voler le miel du lièvre. Mais le lièvre prépare un piège. Il dit à la hyène : 'Regarde, le miel est au fond de ce trou profond'. La hyène se précipite et tombe dans le trou rempli de boue. Le lièvre rigole et s'en va avec son miel. En Afrique, on raconte souvent des histoires pour montrer que l'intelligence est plus forte que la force.",
    vocab: ["savane", "gourmande", "rusé", "piège", "intelligence"],
    vocabOptions: {
      savane: [
        "Vaste étendue d'herbe en Afrique",
        "Une forêt tropicale",
        "Un désert de sable",
      ],
      gourmande: [
        "Qui aime beaucoup manger",
        "Qui est très méchante",
        "Qui ne mange rien",
      ],
      rusé: ["Malin et intelligent", "Bête et naïf", "Très fort et musclé"],
      piège: [
        "Ruse pour attraper quelqu'un",
        "Un cadeau surprise",
        "Un trou pour dormir",
      ],
      intelligence: [
        "Capacité de réfléchir et comprendre",
        "La force physique",
        "La richesse",
      ],
    },
    dictation: {
      text: "La __ est gourmande. Le __ est très rusé. Il prépare un __. La hyène tombe dans le __. C'est le triomphe de l'__.",
      words: ["hyène", "lièvre", "piège", "trou", "intelligence"],
    },
    exercises: {
      lvl1: {
        q: "Relie : 'Lièvre' -> 'rusé', 'Hyène' -> 'méchante', 'Miel' -> 'sucré'",
      },
      lvl2: { q: "Trouve le contraire : Forte # ... , Méchante # ... ." },
      lvl3: { q: "Quelle leçon donne ce conte ?" },
    },
    evaluation: [
      {
        q: "Où se passe l'histoire ?",
        choices: ["À la ferme", "Dans la savane", "En ville"],
        answer: "Dans la savane",
      },
      { q: "Qui est le plus intelligent ?", answer: "le lièvre" },
    ],
  },
  10: {
    id: 10,
    title: "L'enfant Aborigène",
    theme: "Contes d'Australie",
    text: "En Australie, Kalo est un petit garçon aborigène. Il vit dans le grand désert avec sa famille. Kalo connaît tous les secrets de la nature. Il sait trouver de l'eau cachée dans les racines des plantes et suit les traces des kangourous. Le soir, autour du feu, son grand-père lui raconte des légendes sur la création du monde. Kalo dessine sur les rochers avec de la peinture rouge et jaune. Il respecte beaucoup la terre de ses ancêtres qui lui donne tout ce dont il a besoin.",
    vocab: ["aborigène", "désert", "racine", "légende", "ancêtre"],
    vocabOptions: {
      aborigène: [
        "Premier habitant d'Australie",
        "Un voyageur de l'espace",
        "Un conducteur de train",
      ],
      désert: [
        "Lieu très sec et sans eau",
        "Une forêt avec beaucoup de pluie",
        "Une grande ville",
      ],
      racine: [
        "Partie de la plante sous la terre",
        "La branche d'un arbre",
        "Le fruit du pommier",
      ],
      légende: [
        "Histoire extraordinaire et ancienne",
        "Un livre de calcul",
        "Une lettre de nouvelles",
      ],
      ancêtre: [
        "Personne de la famille née avant nous",
        "Un petit bébé",
        "Un nouvel ami",
      ],
    },
    dictation: {
      text: "Kalo est un __. Il vit dans le __ d'Australie. Il suit les __ des animaux. Son grand-père raconte une __. Il respecte ses __.",
      words: ["aborigène", "désert", "traces", "légende", "ancêtres"],
    },
    exercises: {
      lvl1: { q: "Vrai ou Faux : Kalo vit en France. (...)" },
      lvl2: {
        q: "Complète : Kalo (connaître) ... la nature. Ils (vivre) ... dans le désert.",
      },
      lvl3: { q: "Comment Kalo dessine-t-il ?" },
    },
    evaluation: [
      {
        q: "Dans quel pays vit Kalo ?",
        choices: ["Brésil", "Chine", "Australie"],
        answer: "Australie",
      },
      { q: "Quel animal Kalo suit-il ?", answer: "les kangourous" },
    ],
  },
  11: {
    id: 11,
    title: "Dans le parc d'attractions",
    theme: "Loisirs",
    text: "Aujourd'hui, c'est la fête foraine. Sarah et son frère montent dans les montagnes russes. Ils ont un peu peur mais ils s'amusent énormément. Ensuite, ils vont faire un tour de grande roue. De là-haut, on peut voir toute la ville ! On entend la musique des manèges et les rires des gens. Ils mangent de la barbe à papa collante et des pommes d'amour. C'est une journée pleine d'émotions et de joie.",
    vocab: ["manège", "émotion", "foraine", "collante", "attraction"],
    vocabOptions: {
      manège: [
        "Appareil de fête qui tourne",
        "Un type de voiture",
        "Le lit pour dormir",
      ],
      émotion: [
        "Sentiment fort de joie ou peur",
        "Un calcul mathématique",
        "Le nom d'un pays",
      ],
      foraine: [
        "Qui concerne la fête de rue",
        "Qui est dans la forêt",
        "Qui travaille à la banque",
      ],
      collante: [
        "Qui s'attache aux doigts",
        "Qui est très froide",
        "Qui est invisible",
      ],
      attraction: [
        "Activité amusante dans un parc",
        "Une punition d'école",
        "Un légume vert",
      ],
    },
    dictation: {
      text: "La __ foraine est arrivée. Sarah monte dans un __. Elle a une grande __. On mange une __ à papa. Quelle belle __ !",
      words: ["fête", "manège", "émotion", "barbe", "attraction"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  12: {
    id: 12,
    title: "Le petit colporteur",
    theme: "Vie d'autrefois",
    text: "Autrefois, il n'y avait pas de grands magasins. Le colporteur passait de village en village avec sa hotte sur le dos. Il vendait des rubans, des boutons et des journaux. Les villageois l'attendaient avec impatience car il apportait aussi des nouvelles des autres villes. C'était un métier difficile mais très important pour les gens qui vivaient loin de tout.",
    vocab: ["colporteur", "hotte", "villageois", "impatience", "ruban"],
    vocabOptions: {
      colporteur: [
        "Marchand qui voyage avec ses marchandises",
        "Un capitaine de bateau",
        "Un cuisinier",
      ],
      hotte: [
        "Grand panier porté sur le dos",
        "Une petite assiette",
        "Un chapeau pointu",
      ],
      villageois: [
        "Habitant d'un village",
        "Un animal de la ferme",
        "Une grande ville",
      ],
      impatience: [
        "Fait de ne pas pouvoir attendre",
        "Une grande sagesse",
        "Une couleur bleue",
      ],
      ruban: [
        "Bande de tissu pour décorer",
        "Un gros pneu de voiture",
        "Un gâteau au chocolat",
      ],
    },
    dictation: {
      text: "Le __ voyageait beaucoup. Il portait une __. Les __ l'attendaient. On achetait un __. Il fallait de l'__.",
      words: ["colporteur", "hotte", "villageois", "ruban", "impatience"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  13: {
    id: 13,
    title: "La fête de l'Aïd",
    theme: "Fêtes et Célébrations",
    text: "C'est le matin de l'Aïd. Toute la famille se réveille tôt. Les enfants portent leurs habits neufs. Après la prière, ils embrassent leurs parents et reçoivent de l'argent de poche. On prépare des gâteaux traditionnels au miel et aux amandes. On rend visite aux grands-parents et aux voisins. Tout le monde sourit et se dit : 'Aïd Mabrouk !'. C'est un moment de partage et de grande joie.",
    vocab: ["prière", "traditionnel", "amande", "partage", "célébrer"],
    vocabOptions: {
      prière: [
        "Acte religieux ou demande calme",
        "Un cri de colère",
        "Un jeu de ballon",
      ],
      traditionnel: [
        "Transmis par les ancêtres",
        "Qui vient du futur",
        "Qui est tout nouveau",
      ],
      amande: [
        "Fruit sec d'un arbre",
        "Un bonbon à la menthe",
        "Un morceau de viande",
      ],
      partage: [
        "Fait de donner aux autres",
        "Le fait de tout garder pour soi",
        "Se cacher dans un coin",
      ],
      célébrer: [
        "Faire une fête pour un événement",
        "Dormir sagement",
        "Faire ses devoirs",
      ],
    },
    dictation: {
      text: "Le matin de l'__ , on se réveille. On fait la __. On mange un gâteau __. C'est un moment de __. Il faut __ cette fête.",
      words: ["Aïd", "prière", "traditionnel", "partage", "célébrer"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  14: {
    id: 14,
    title: "Le voyage en train",
    theme: "Voyages",
    text: "La famille de Mouna part en vacances à Tunis. Ils prennent le train à la gare de Sfax. Sur le quai, il y a beaucoup de monde. Le sifflet retentit et le train démarre doucement. Par la fenêtre, Mouna regarde les paysages qui défilent : des champs d'oliviers, des montagnes et parfois la mer bleue. Le voyage dure trois heures. C'est très confortable et amusant de voyager sur les rails.",
    vocab: ["quai", "sifflet", "paysage", "retentir", "confortable"],
    vocabOptions: {
      quai: [
        "Bord de la voie dans une gare",
        "Le toit d'une maison",
        "Une branche d'arbre",
      ],
      sifflet: [
        "Petit instrument qui fait un bruit aigu",
        "Une grosse cloche",
        "Un instrument de musique",
      ],
      paysage: [
        "Ce que l'on voit de la nature",
        "Une photo d'un livre",
        "Le moteur du train",
      ],
      retentir: [
        "Se faire entendre avec force",
        "Partir en courant",
        "Se taire complètement",
      ],
      confortable: [
        "Où on se sent très bien",
        "Qui fait très mal",
        "Qui est très sale",
      ],
    },
    dictation: {
      text: "On attend sur le __. Le __ du train retentit. On regarde le __. Le train est __. On entend le train __.",
      words: ["quai", "sifflet", "paysage", "confortable", "retentir"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  15: {
    id: 15,
    title: "L'ordinateur de l'école",
    theme: "Modernité",
    text: "Dans notre classe, nous avons un nouvel ordinateur. Le maître nous apprend à utiliser le clavier et la souris. On peut faire des recherches sur Internet pour nos projets de géographie. On apprend aussi à écrire des textes et à faire des dessins colorés. C'est un outil magique qui nous aide à apprendre beaucoup de choses. Il faut faire attention et ne pas passer trop de temps devant l'écran.",
    vocab: ["clavier", "souris", "recherche", "outil", "écran"],
    vocabOptions: {
      clavier: [
        "Ensemble des touches de l'ordinateur",
        "Une boîte de craies",
        "Le manche d'un balai",
      ],
      souris: [
        "Petit appareil pour déplacer la flèche",
        "Un petit chat blanc",
        "Une gomme à effacer",
      ],
      recherche: [
        "Action de chercher des informations",
        "Dormir devant sa table",
        "Jouer au football",
      ],
      outil: [
        "Objet qui aide à travailler",
        "Un jouet pour bébé",
        "Un plat de nourriture",
      ],
      écran: [
        "Partie de l'ordinateur où on voit l'image",
        "La porte de la classe",
        "Le dossier d'une chaise",
      ],
    },
    dictation: {
      text: "On utilise le __. On déplace la __. On fait une __. L'ordinateur est un __. Il ne faut pas rester trop devant l'__.",
      words: ["clavier", "souris", "recherche", "outil", "écran"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  16: {
    id: 16,
    title: "Le petit jardinier",
    theme: "La Nature",
    text: "Dans son petit jardin, Sami plante des graines de tomates et de salade. Chaque matin, il arrose ses plantes avec son arrosoir bleu. Il enlève les mauvaises herbes qui poussent trop vite. Le soleil et l'eau aident les légumes à grandir. Bientôt, Sami pourra cueillir de belles tomates rouges et juteuses pour préparer une bonne salade. Il est très fier de son travail de jardinier.",
    vocab: ["graine", "arroser", "légume", "cueillir", "jardinier"],
    vocabOptions: {
      graine: [
        "Petit grain qui donne une plante",
        "Un morceau de pain",
        "Une bille de verre",
      ],
      arroser: [
        "Donner de l'eau aux plantes",
        "Sauter dans une flaque",
        "Manger une pomme",
      ],
      légume: [
        "Plante que l'on mange",
        "Un type de jouet",
        "Un vêtement chaud",
      ],
      cueillir: [
        "Détacher une fleur ou un fruit",
        "Casser une branche",
        "Planter un arbre",
      ],
      jardinier: [
        "Personne qui soigne le jardin",
        "Un conducteur de train",
        "Un boulanger",
      ],
    },
    dictation: {
      text: "Sami est un bon __. Il plante une __. Il doit __ les fleurs. Il va __ les fruits. C'est un bon __.",
      words: ["jardinier", "graine", "arroser", "cueillir", "légume"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  17: {
    id: 17,
    title: "Ma ville est propre",
    theme: "Environnement",
    text: "Aujourd'hui, les élèves de la classe participent à une journée de nettoyage. Ils ramassent les papiers et les bouteilles vides dans le parc. Ils mettent les déchets dans des sacs poubelles colorés. Le maître explique qu'il ne faut pas jeter de saletés par terre car cela pollue la nature. Nous voulons tous vivre dans un quartier propre et agréable. En prenant soin de notre environnement, nous protégeons notre ville.",
    vocab: ["nettoyage", "déchet", "polluer", "environnement", "agréable"],
    vocabOptions: {
      nettoyage: [
        "Action de rendre propre",
        "Le fait de salir",
        "Un jeu de cartes",
      ],
      déchet: ["Chose que l'on jette", "Un trésor précieux", "Un nouvel habit"],
      polluer: [
        "Salir la nature ou l'air",
        "Nettoyer avec soin",
        "Planter des fleurs",
      ],
      environnement: [
        "La nature qui nous entoure",
        "La télévision",
        "L'intérieur d'une boîte",
      ],
      agréable: [
        "Qui donne du plaisir",
        "Qui est très méchant",
        "Qui fait peur",
      ],
    },
    dictation: {
      text: "C'est le jour du __. Il ne faut pas __. On ramasse chaque __. On protège l'__. C'est __.",
      words: ["nettoyage", "polluer", "déchet", "environnement", "agréable"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  18: {
    id: 18,
    title: "Le chevalier et le dragon",
    theme: "Contes de fées",
    text: "Il était une fois un chevalier courageux nommé Arthur. Il portait une armure brillante et une longue épée. Un jour, il part délivrer une princesse enfermée dans une tour par un dragon géant. Le dragon crache du feu, mais Arthur se protège derrière son bouclier. Finalement, il ne combat pas le dragon mais lui offre un énorme gâteau au miel. Le dragon, qui était juste affamé, devient son ami. Arthur, la princesse et le dragon rentrent ensemble au château.",
    vocab: ["armure", "épée", "bouclier", "affamé", "château"],
    vocabOptions: {
      armure: [
        "Vêtement de fer du chevalier",
        "Une chemise de nuit",
        "Un slip de bain",
      ],
      épée: [
        "Arme longue et pointue",
        "Un gros marteau",
        "Une petite cuillère",
      ],
      bouclier: [
        "Objet pour se protéger",
        "Une table en bois",
        "Un oreiller mou",
      ],
      affamé: ["Qui a très faim", "Qui a très soif", "Qui a sommeil"],
      château: [
        "Grande maison de roi",
        "Une petite cabane",
        "Une tente de camping",
      ],
    },
    dictation: {
      text: "Arthur met son __. Il prend son __. Le __ est immense. Le dragon est __. On rentre au __.",
      words: ["armure", "bouclier", "dragon", "affamé", "château"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  19: {
    id: 19,
    title: "La visite à la bibliothèque",
    theme: "Le Savoir",
    text: "Tous les mercredis, Sarah va à la bibliothèque municipale. C'est un endroit calme avec des milliers de livres. Sarah adore l'odeur du papier. Elle choisit un album de contes et s'installe dans un fauteuil confortable pour lire. La bibliothécaire lui prête aussi une bande dessinée. Sarah doit faire attention à ne pas déchirer les pages et à rendre les livres à l'heure. La lecture est un voyage magique qui commence par un livre.",
    vocab: ["bibliothèque", "calme", "album", "prêter", "déchirer"],
    vocabOptions: {
      bibliothèque: [
        "Lieu rempli de livres",
        "Un magasin de chaussures",
        "Un restaurant",
      ],
      calme: [
        "Où il n'y a pas de bruit",
        "Qui est très bruyant",
        "Qui est en colère",
      ],
      album: [
        "Livre avec beaucoup d'images",
        "Un disque de musique",
        "Un cahier de calcul",
      ],
      prêter: [
        "Donner pour un petit moment",
        "Garder pour toujours",
        "Vendre très cher",
      ],
      déchirer: [
        "Couper en deux par accident",
        "Réparer avec de la colle",
        "Peindre avec un pinceau",
      ],
    },
    dictation: {
      text: "Sarah va à la __. C'est un lieu __. Elle lit un bel __. Il ne faut pas __ le livre. On va nous __ des livres.",
      words: ["bibliothèque", "calme", "album", "déchirer", "prêter"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  20: {
    id: 20,
    title: "Le voyage dans l'espace",
    theme: "Science-Fiction",
    text: "En l'an 3000, les enfants ne vont plus à l'école en bus, mais en petite fusée. Léo est un jeune astronaute. Il porte une combinaison blanche et un casque brillant. Aujourd'hui, il visite la Lune avec son robot ami nommé Bip. Ils sautent très haut car il n'y a pas beaucoup de gravité. Depuis la Lune, Léo regarde la Terre : elle ressemble à une belle bille bleue dans le noir de l'espace. C'est extraordinaire de voir les étoiles de si près !",
    vocab: ["fusée", "astronaute", "combinaison", "robot", "gravité"],
    vocabOptions: {
      fusée: [
        "Machine pour aller dans l'espace",
        "Un vélo à trois roues",
        "Un bateau à voile",
      ],
      astronaute: [
        "Voyageur de l'espace",
        "Un marchand de journaux",
        "Un maître d'école",
      ],
      combinaison: [
        "Vêtement spécial d'astronaute",
        "Un pantalon en jean",
        "Une robe de soirée",
      ],
      robot: [
        "Machine qui peut bouger seule",
        "Un animal vivant",
        "Une plante verte",
      ],
      gravité: [
        "Force qui nous retient au sol",
        "Une maladie grave",
        "Le nom d'une planète",
      ],
    },
    dictation: {
      text: "Léo prend sa __. Il est un __. Il met sa __. Il joue avec son __. On flotte sans __.",
      words: ["fusée", "astronaute", "combinaison", "robot", "gravité"],
    },
    exercises: { lvl1: {}, lvl2: {}, lvl3: {} },
    evaluation: [],
  },
  22: {
    id: 22,
    title: "Les nouveaux voisins",
    theme: "Tolérance & Entraide",
    text: "Une nouvelle famille vient d'emménager dans notre quartier. Ils viennent d'un pays lointain. Les enfants portent des habits originaux et parlent une langue différente. Au début, certains camarades se moquent d'eux. Mais ma maman prépare un grand gâteau aux pommes et nous allons les voir pour leur souhaiter la bienvenue. Ils sont très gentils et timides. Nous commençons à jouer ensemble et ils nous apprennent de nouveaux mots. Nous sommes tous différents mais nous sommes de bons amis.",
    vocab: ["emménager", "lointain", "original", "timide"],
    vocabOptions: {
      emménager: [
        "S'installer dans une nouvelle maison",
        "Partir en vacances",
        "Aller au marché",
      ],
      lointain: [
        "Qui est très loin",
        "Qui est à côté",
        "Qui est dans ma poche",
      ],
      original: [
        "Qui sort de l'ordinaire",
        "Qui est tout simple",
        "Qui est très vieux",
      ],
      timide: [
        "Qui a peur de parler aux autres",
        "Qui crie très fort",
        "Qui est très courageux",
      ],
    },
    dictation: {
      text: "Une famille va __ dans le quartier. Ils viennent d'un pays __. Leurs habits sont __. Les enfants sont __. Ils sont très gentils.",
      words: ["emménager", "lointain", "originaux", "timides", "gentils"],
    },
    exercises: {
      lvl1: { q: "Coche : Les voisins sont (Gentils / Méchants)" },
      lvl2: { q: "Transforme : Un voisin timide -> Une voisine ... " },
      lvl3: {
        q: "Rédige une affiche pour ta classe sur le thème 'Tous différents, tous égaux'.",
      },
    },
    evaluation: [
      {
        q: "Que font les enfants au début ?",
        choices: ["Ils jouent", "Ils se moquent", "Ils mangent"],
        answer: "Ils se moquent",
      },
      { q: "Un voisin (généreux) -> Une voisine ...", answer: "généreuse" },
    ],
  },
  23: {
    id: 23,
    title: "La course de vélo",
    theme: "Loisirs & Amitié",
    text: "Le soleil brille en ce beau dimanche. Sami et son ami Amin participent à une grande course de vélo. Ils pédalent de toutes leurs forces. Soudain, dans un virage, Amin glisse sur des cailloux et tombe lourdement. Sami s'arrête immédiatement pour l'aider. Il l'aide à se relever et vérifie son genou. Ils décident de finir la course ensemble, côte à côte. Ils franchissent la ligne d'arrivée en souriant. L'amitié est plus importante que la victoire !",
    vocab: ["pédaler", "virage", "immédiatement", "solidarité"],
    vocabOptions: {
      pédaler: [
        "Faire tourner les pédales du vélo",
        "Courir à pied",
        "Nager dans la mer",
      ],
      virage: [
        "Partie d'une route qui tourne",
        "Une ligne toute droite",
        "Le sommet d'une montagne",
      ],
      immédiatement: [
        "Tout de suite, sans attendre",
        "Dans trois jours",
        "Jamais de la vie",
      ],
      solidarité: [
        "Fait de s'aider les uns les autres",
        "Se disputer tout le temps",
        "Chacun pour soi",
      ],
    },
    dictation: {
      text: "Les enfants aiment __. Attention au __. Il faut aider __. C'est un acte de __. Ils sont arrivés ensemble.",
      words: ["pédaler", "virage", "immédiatement", "solidarité", "ensemble"],
    },
    exercises: {
      lvl1: {
        q: "Remets en ordre : vélo / roulent / les / sur / enfants / le",
      },
      lvl2: { q: "Accorde : Les (beau) ... vélos sont (neuf) ... ." },
      lvl3: { q: "Raconte une fois où tu as aidé un ami en difficulté." },
    },
    evaluation: [
      {
        q: "Que fait Sami quand Amin tombe ?",
        choices: ["Il continue", "Il s'arrête", "Il rit"],
        answer: "Il s'arrête",
      },
      { q: "Un vélo (neuf) -> Des vélos ...", answer: "neufs" },
    ],
  },
  24: {
    id: 24,
    title: "Pinocchio – Marionnette menteuse",
    theme: "Conte classique",
    text: "Gepetto est un vieux menuisier. Il fabrique une marionnette en bois qu'il appelle Pinocchio. À sa grande surprise, le pantin s'anime et commence à parler. Mais Pinocchio est un peu têtu. Il ne veut pas aller à l'école. Quand il ment à la Fée bleue, son nez s'allonge de plus en plus ! Pinocchio a très peur. La Fée lui explique qu'un petit garçon doit être honnête. Pinocchio promet de changer et de devenir un vrai petit garçon courageux et sage.",
    vocab: ["menuisier", "marionnette", "s'animer", "honnête"],
    vocabOptions: {
      menuisier: [
        "Artisan qui travaille le bois",
        "Un marchand de fruits",
        "Un danseur de ballet",
      ],
      marionnette: [
        "Figurine qui bouge avec des fils",
        "Un vrai petit garçon",
        "Un livre d'images",
      ],
      "s'animer": [
        "Prendre vie ou bouger",
        "S'endormir profondément",
        "Devenir tout noir",
      ],
      honnête: [
        "Qui dit toujours la vérité",
        "Qui vole les jouets",
        "Qui est très bête",
      ],
    },
    dictation: {
      text: "Gepetto est un __. Il crée une __. Pinocchio commence à __. Il doit être __. C'est un garçon courageux.",
      words: ["menuisier", "marionnette", "s'animer", "honnête", "courageux"],
    },
    exercises: {
      lvl1: { q: "Pinocchio est un pantin en (Bois / Fer / Plastique)" },
      lvl2: {
        q: "Portrait de Pinocchio : Il est (naïf / menteur / courageux).",
      },
      lvl3: {
        q: "Imagine le dialogue (3 répliques) entre Pinocchio et la Fée bleue après son mensonge.",
      },
    },
    evaluation: [
      {
        q: "Que se passe-t-il quand Pinocchio ment ?",
        choices: [
          "Ses oreilles poussent",
          "Son nez s'allonge",
          "Il devient bleu",
        ],
        answer: "Son nez s'allonge",
      },
      { q: "Le pantin -> La ...", answer: "marionnette" },
    ],
  },
  25: {
    id: 25,
    title: "Le Chat botté – Ruses",
    theme: "Conte classique",
    text: "Le plus jeune fils d'un meunier reçoit pour tout héritage un chat. Mais ce n'est pas un chat ordinaire ! Le chat demande une paire de bottes et un sac. Grâce à sa ruse, il attrape des lapins et les offre au roi au nom de son maître, le 'Marquis de Carabas'. Le chat est très malin. Il réussit même à tromper un ogre en lui demandant de se transformer en souris pour le croquer ! Son maître devient finalement riche et épouse la princesse.",
    vocab: ["héritage", "ordinaire", "ruse", "tromper"],
    vocabOptions: {
      héritage: [
        "Ce que l'on reçoit de sa famille",
        "Un cadeau de Noël",
        "Un travail difficile",
      ],
      ordinaire: [
        "Qui est habituel et simple",
        "Qui est extraordinaire",
        "Qui est tout nouveau",
      ],
      ruse: [
        "Un tour malin pour réussir",
        "Une grande gentillesse",
        "Une punition d'école",
      ],
      tromper: [
        "Faire croire quelque chose de faux",
        "Aider son prochain",
        "Dire la vérité",
      ],
    },
    dictation: {
      text: "C'est un petit __. Ce n'est pas un chat __. Il utilise sa __. Il réussit à __ l'ogre. Il devient riche.",
      words: ["héritage", "ordinaire", "ruse", "tromper", "riche"],
    },
    exercises: {
      lvl1: { q: "Le chat porte des ... (Gants / Bottes / Lunettes)" },
      lvl2: { q: "Accorde : Ses (beau) ... bottes sont (noir) ... ." },
      lvl3: { q: "Imagine un défi pour l'ogre." },
    },
    evaluation: [
      {
        q: "En quoi l'ogre se transforme-t-il ?",
        choices: ["En lion", "En rat", "En souris"],
        answer: "En souris",
      },
      { q: "Un chat (rusé) -> Une chatte ...", answer: "rusée" },
    ],
  },
  26: {
    id: 26,
    title: "Heidi – Fille de la montagne",
    theme: "Conte classique",
    text: "Heidi est une petite orpheline qui va vivre chez son grand-père, un homme solitaire, dans les montagnes des Alpes. Elle adore l'air pur et les verts alpages. Elle court après les chèvres avec son ami Peter. Heidi est très joyeuse. Plus tard, elle part à Francfort pour tenir compagnie à Clara, une fille riche qui ne peut pas marcher. Mais la montagne manque beaucoup à Heidi. Finalement, elle revient chez son grand-père et aide même Clara à marcher sur l'herbe fraîche.",
    vocab: ["orpheline", "solitaire", "alpage", "compagnie"],
    vocabOptions: {
      orpheline: [
        "Enfant qui n'a plus de parents",
        "Une fille très riche",
        "Une petite princesse",
      ],
      solitaire: [
        "Qui vit ou qui est seul",
        "Qui a beaucoup d'amis",
        "Qui fait beaucoup de bruit",
      ],
      alpage: [
        "Pâturage de haute montagne",
        "Une plage de sable",
        "Le centre de la ville",
      ],
      compagnie: [
        "Fait d'être avec quelqu'un",
        "Le fait de rester seul",
        "Un type de voiture",
      ],
    },
    dictation: {
      text: "Heidi est une __. Elle vit dans un __. Elle veut de la __. Elle est restée __. C'est la vie à la montagne.",
      words: ["orpheline", "alpage", "compagnie", "solitaire", "montagne"],
    },
    exercises: {
      lvl1: { q: "Heidi vit dans la (Ville / Montagne / Mer)" },
      lvl2: { q: "Heidi est (joyeux) ... et (généreux) ... ." },
      lvl3: { q: "Écris une lettre de Heidi à son grand-père." },
    },
    evaluation: [
      {
        q: "Où Heidi va-t-elle vivre au début ?",
        choices: ["À Paris", "Dans les Alpes", "À la plage"],
        answer: "Dans les Alpes",
      },
      { q: "Une fille (joyeux) -> Des filles ...", answer: "joyeuses" },
    ],
  },
  27: {
    id: 27,
    title: "L'amitié qui dure",
    theme: "Amitié / Tolérance",
    text: "Amadou est nouveau au village. Il arrive du Sénégal. Les enfants le regardent with curiosité car il a la peau très noire. Sami décide de lui parler. Ils découvrent qu'ils aiment tous les deux le football et le dessin. Sami présente Amadou à ses amis. Bientôt, tout le monde joue ensemble. Ils apprennent qu'une personne est riche par ses différences. L'amitié n'a pas de couleur, c'est un pont entre les cœurs.",
    vocab: ["curiosité", "différence", "inséparable", "tolérance", "pont"],
    vocabOptions: {
      curiosité: [
        "Envie d'apprendre ou de savoir",
        "Une grande peur",
        "La paresse",
      ],
      différence: [
        "Fait de ne pas être pareil",
        "Être exactement identique",
        "Un petit gâteau",
      ],
      inséparable: [
        "Qu'on ne peut pas séparer",
        "Qui se déteste",
        "Qui est cassé",
      ],
      tolérance: [
        "Respecter les avis des autres",
        "Se moquer tout le temps",
        "Crier sur les gens",
      ],
      pont: [
        "Construction pour traverser",
        "Une maison en briques",
        "Un grand trou",
      ],
    },
    dictation: {
      text: "Amadou arrive au __. Les enfants sont pleins de __. Sami accepte la __. Ils deviennent __. L'amitié est un __.",
      words: ["village", "curiosité", "différence", "inséparables", "pont"],
    },
    exercises: {
      lvl1: { q: "Vrai ou Faux : Amadou vient du Sénégal. (...)" },
      lvl2: { q: "Accorde : Un (nouvel) ... ami. Des amis (gentil) ... ." },
      lvl3: { q: "Explique pourquoi Amadou et Sami sont devenus amis." },
    },
    evaluation: [
      {
        q: "D'où vient Amadou ?",
        choices: ["Du Mali", "Du Sénégal", "Du Niger"],
        answer: "Du Sénégal",
      },
      {
        q: "Qu'est-ce qui est 'un pont entre les cœurs' ?",
        answer: "l'amitié",
      },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "village / nouveau / Amadou / au / est / .",
          correct: "Amadou est nouveau au village.",
        },
        {
          jumbled: "Sénégal / Il / du / . / arrive",
          correct: "Il arrive du Sénégal.",
        },
        {
          jumbled: "parler / lui / Sami / de / . / décide",
          correct: "Sami décide de lui parler.",
        },
        {
          jumbled: " football / Ils / . / aiment / le",
          correct: "Ils aiment le football.",
        },
      ],
      reconstitution: [
        "Un nouveau garçon nommé Amadou arrive dans notre village.",
        "Au début, les enfants l'observent sans oser s'en approcher.",
        "Sami, courageux, décide d'aller lui dire bonjour en souriant.",
        "Ils s'aperçoivent qu'ils ont les mêmes passions comme le sport.",
        "Sami invite Amadou à rejoindre son équipe de football.",
        "Les deux camarades passent tout leur temps libre ensemble.",
        "Bientôt, tous les autres élèves du quartier se joignent à eux.",
        "Ils comprennent que l'amitié permet de découvrir le monde.",
      ],
      cloze: {
        text: "L'amitié est essentielle dans un [1]. Elle naît souvent de la [2] et de l'envie d'aller vers l'autre. Malgré chaque [3], on peut devenir [4]. L'amitié est un véritable [5] entre les êtres qui permet de vivre ensemble en paix.",
        words: ["village", "curiosité", "différence", "inséparables", "pont"],
      },
      dialogue: [
        "Sami : Bonjour ! Tu es nouveau ici ? Comment tu t'appelles ?",
        "Amadou : Bonjour. Oui, je m'appelle Amadou. Je viens d'arriver.",
        "Sami : Enchanté Amadou ! Moi c'est Sami. Tu veux jouer with nous ?",
        "Amadou : Oh oui, avec plaisir ! J'adore jouer au ballon.",
        "Sami : Super ! Viens voir mes copains, on va bien s'amuser.",
        "Amadou : Merci Sami, tu es vraiment très gentil with moi.",
      ],
    },
  },
  28: {
    id: 28,
    title: "Le pique-nique de la famille Duval",
    theme: "Loisirs (Pique-nique)",
    text: "C'est le printemps, il fait beau. La famille Duval décide de passer la journée à la campagne. Maman prépare du pain, de la salade et des fruits. Alain et sa sœur courent sur l'herbe près d'un grand arbre. À midi, tout le monde mange avec appétit. Mais après le repas, Alain voit des ordures sur le sol. Il s'écrie : « Il ne faut pas salir la nature ! ». Les enfants ramassent vite les restes dans un sac poubelle. La campagne reste propre.",
    vocab: ["printemps", "campagne", "arbre", "appétit", "ordures", "propre"],
    vocabOptions: {
      printemps: [
        "Saison des fleurs après l'hiver. Exemple : C'est le printemps, il fait beau.",
        "La saison froide avec de la neige",
        "La période des devoirs",
      ],
      campagne: [
        "Lieu avec des champs et de la nature. Exemple : Les Duval vont à la campagne.",
        "Un grand magasin en ville",
        "Une école de musique",
      ],
      arbre: [
        "Grande plante en bois avec des feuilles vertes. Exemple : Ils courent près d'un grand arbre.",
        "Un petit animal poilu",
        "Une fleur très petite",
      ],
      appétit: [
        "Le désir ou l'envie de manger. Exemple : Ils mangent avec beaucoup d'appétit.",
        "Le besoin d'aller dormir",
        "Une grande fête de village",
      ],
      ordures: [
        "Saletés et déchets jetés par terre. Exemple : Alain voit des ordures sur le sol.",
        "De jolis jouets",
        "Des fruits mûrs et sucrés",
      ],
      propre: [
        "Qui n'est pas sale, tout net. Exemple : La campagne reste propre.",
        "Qui a de la poussière",
        "Qui est tout noir de saleté",
      ],
    },
    dictation: {
      text: "C'est le __ de printemps. La famille Duval est à la __. Alain ne veut pas __ la nature. Ils ramassent les __ du sol. La campagne reste __.",
      words: ["pique-nique", "campagne", "salir", "ordures", "propre"],
    },
    exercises: {
      lvl1: {
        q: "Coche la bonne réponse : La famille Duval est à (la campagne / la mer / la montagne).",
      },
      lvl2: {
        q: "Je complète : À midi, ils mangent ... (avec appétit / sous les arbres).",
      },
      lvl3: {
        q: "Écris une phrase pour encourager les enfants à garder la nature propre.",
      },
    },
    evaluation: [
      {
        q: "Pourquoi Alain s'écrie-t-il 'Il ne faut pas salir la nature !' ?",
        choices: [
          "Il y a des animaux sauvages",
          "Il voit des ordures par terre",
          "Il fait froid",
        ],
        answer: "Il voit des ordures par terre",
      },
      {
        q: "Où les enfants ramassent-ils les restes ?",
        answer: "dans un sac poubelle",
      },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "printemps / de / C'est / le / . / pique-nique",
          correct: "C'est le pique-nique de printemps.",
        },
        {
          jumbled: "Duval / à / vont / la / Les / campagne / .",
          correct: "Les Duval vont à la campagne.",
        },
        {
          jumbled: "Maman / du / délicieux / prépare / pain / .",
          correct: "Maman prépare du délicieux pain.",
        },
        {
          jumbled: "Alain / ordures / voit / des / par / terre / .",
          correct: "Alain voit des ordures par terre.",
        },
        {
          jumbled: "ne / pas / Il / faut / salir / la / nature / .",
          correct: "Il ne faut pas salir la nature.",
        },
        {
          jumbled: "ramassent / sac / dans / Ils / un / tout / .",
          correct: "Ils ramassent tout dans un sac.",
        },
      ],
      reconstitution: [
        "La maman de la famille Duval prépare de la salade fraîche et du bon pain.",
        "Alain et sa gentille sœur courent sur l'herbe près des arbres.",
        "À midi, ils installent la nappe pour manger tous ensemble.",
        "Après le repas, Alain remarque des saletés laissées sur le sol.",
        "Il explique qu'il est très important de respecter l'environnement.",
        "Les enfants décident de tout nettoyer avant de rentrer.",
      ],
      cloze: {
        text: "C'est le [1], la famille Duval décide de pique-niquer à la [2]. Les enfants courent sur l'[3] fraîche. Après manger, Alain repère des [4] par terre. Il rappelle qu'il faut protéger la [5]. Ils ramassent les saletés et la nature reste [6].",
        words: [
          "printemps",
          "campagne",
          "herbe",
          "ordures",
          "nature",
          "propre",
        ],
      },
      dialogue: [
        "Alain : Regarde tous ces déchets jetés par terre sous l'arbre !",
        "Sœur : C'est horrible ! Les gens ne respectent pas la belle nature.",
        "Alain : Vite, prenons notre grand sac poubelle en plastique !",
        "Sœur : Excellente idée, ramassons tout pour que ce soit tout propre.",
      ],
    },
  },
  29: {
    id: 29,
    title: "Au parc d'attractions",
    theme: "Loisirs et Divertissement",
    text: "Dimanche dernier, la famille de Martine est allée au parc d'attractions. Les enfants étaient très heureux d'y passer la journée. Martine et ses frères ont couru vers les manèges. Ils sont montés sur les chevaux de bois qui tournaient en musique. Ensuite, ils ont acheté de la barbe à papa et de grandes glaces. L'après-midi, ils ont regardé le spectacle des clowns. Les clowns faisaient de drôles de grimaces et tout le monde riait aux éclats. C'était une journée magnifique !",
    vocab: [
      "attraction",
      "manège",
      "glace",
      "spectacle",
      "grimace",
      "magnifique",
    ],
    vocabOptions: {
      attraction: [
        "Activité ludique ou manège amusant. Exemple : Le parc possède de nombreuses attractions.",
        "Un exercice de mathématiques",
        "Le fait de s'endormir",
      ],
      manège: [
        "Appareil de fête foraine qui tourne. Exemple : Ils courent vers les manèges.",
        "Un livre d'histoire de l'école",
        "Une boîte de craies blanches",
      ],
      glace: [
        "Dessert très froid et sucré. Exemple : Ils savourent de délicieuses glaces parfumées.",
        "Un morceau de pain chaud",
        "Un bol de soupe aux légumes",
      ],
      spectacle: [
        "Une représentation artistique amusante. Exemple : Martine regarde le spectacle de cirque.",
        "Une leçon d'école",
        "Le réveil du matin",
      ],
      grimace: [
        "Mouvement rigolo du visage. Exemple : Les clowns amusent en faisant des grimaces.",
        "Un mot très poli",
        "Une jolie fleur des champs",
      ],
      magnifique: [
        "Qui est extrêmement beau. Exemple : C'était une journée magnifique !",
        "Qui est très triste ou laid",
        "Qui est minuscule",
      ],
    },
    dictation: {
      text: "Martine aime faire du __. Son frère court vers les __. Les clowns font des __. Quelle __ journée !",
      words: ["manège", "chevaux", "grimaces", "magnifique"],
    },
    exercises: {
      lvl1: {
        q: "Coche l'aliment acheté par Martine : (Barbe à papa / Popcorn / Pommes de terre)",
      },
      lvl2: {
        q: "Je conjugue le verbe être ou avoir au présent : Martine et ses frères ... très joyeux.",
      },
      lvl3: { q: "Raconte ce que font les clowns pour amuser la foule." },
    },
    evaluation: [
      {
        q: "Sur quel manège Martine et ses frères sont-ils montés ?",
        choices: [
          "Les montagnes russes",
          "Le grand-huit",
          "Les chevaux de bois qui tournent",
        ],
        answer: "Les chevaux de bois qui tournent",
      },
      { q: "Qui faisait de drôles de grimaces ?", answer: "les clowns" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "famille / au / va / parc / La / .",
          correct: "La famille va au parc.",
        },
        {
          jumbled: "enfants / très / sont / Les / heureux / .",
          correct: "Les enfants sont très heureux.",
        },
        {
          jumbled: "montent / chevaux / Ils / sur / les / de / bois / .",
          correct: "Ils montent sur les chevaux de bois.",
        },
        {
          jumbled: "clowns / drôles / font / des / grimaces / .",
          correct: "Les clowns font des drôles grimaces.",
        },
        {
          jumbled: "riait / tout / monde / le / éclats / aux / .",
          correct: "Tout le monde riait aux éclats.",
        },
      ],
      reconstitution: [
        "Dimanche dernier, Martine et ses frères se rendent au parc d'attractions.",
        "Ils courent joyeusement vers leurs manèges favoris.",
        "Ensuite, ils dégustent une barbe à papa et de grandes glaces colorées.",
        "L'après-midi, ils s'installent pour assister au grand spectacle.",
        "Les clowns ont fait des grimaces comiques qui font rire toute la foule.",
        "Les parents et les enfants applaudissent chaleureusement les artistes.",
      ],
      cloze: {
        text: "Dimanche, la famille visite le [1] d'attractions. Les enfants courent vers les [2]. Ils adorent les chevaux de [3] qui tournent. Plus tard, ils savourent une délicieuse [4] à papa. Tout le monde regarde le spectacle de [5] et s'amuse au grand [6].",
        words: ["parc", "manèges", "bois", "barbe", "clowns", "spectacle"],
      },
      dialogue: [
        "Martine : J'ai trop hâte de faire un tour de chevaux de bois en musique !",
        "Frère : Et moi, j'adore quand le carrousel tourne très vite !",
        "Martine : Regarde le clown là-bas avec son gros nez rouge !",
        "Frère : Il fait des grimaces hilarantes, tout le monde rit !",
      ],
    },
  },
  30: {
    id: 30,
    title: "La grande fête du village",
    theme: "Fêtes et Célébrations",
    text: "Le jour de la grande fête du village approche. La municipalité commence à nettoyer les rues et à décorer l’avenue principale où va défiler le carnaval. Tout le monde se prépare avec joie car les fêtes sont rares chez nous. Mes camarades et moi parlons de nos déguisements. – Je serai une reine, dit Jeanne. Je porterai une longue robe blanche et indigo, des chaussures argentées et j’aurai une belle couronne en diamants. – Moi, Je voudrais porter le costume de Zorro. Je porterai un masque et une cape noire et j’aurai un fouet à la main, ajoute Marc. – Et toi, Julien, as-tu réfléchi à ton déguisement, demande Jeanne. – Hun...! J’hésite encore entre un costume de clown et celui d’un agent de police, répond le garçon. – Un clown est beaucoup plus amusant, remarque Marc. Il est toujours gai et son habit est tout en couleur. Le jour du carnaval, notre village est devenu méconnaissable. Toutes les rues sont joliment décorées et brillent de mille éclats. Tous les habitants, petits et grands, assistent au défilé, dégustent de succulents plats et boivent des boissons à tous les goûts. Le jour du carnaval est une journée inoubliable pour tous les villageois.",
    vocab: [
      "carnaval",
      "déguisement",
      "méconnaissable",
      "défiler",
      "succulents",
      "rare",
    ],
    vocabOptions: {
      carnaval: [
        "Grande fête populaire où l'on se déguise et on défile en musique. Exemple : Le grand carnaval du village est magnifique.",
        "Une leçon difficile d'écriture",
        "Un repas de midi rapide",
      ],
      déguisement: [
        "Habit ou costume spécial qui permet de changer d'apparence. Exemple : Marc essaye son beau déguisement de Zorro.",
        "Une paire de lunettes de soleil",
        "Un devoir à faire à la maison",
      ],
      méconnaissable: [
        "Qu'on ne peut pas reconnaître tant il a changé ou est beau. Exemple : Notre village décoré est devenu méconnaissable.",
        "Qui est très facile à dessiner",
        "Qui reste toujours identique",
      ],
      défiler: [
        "Marcher l'un après l'autre en cortège dans la rue. Exemple : Le carnaval va défiler dans l'avenue.",
        "S'arrêter de courir",
        "Écrire proprement sur l'ardoise",
      ],
      succulents: [
        "Délicieux, très savoureux à manger. Exemple : Les villageois dégustent de succulents plats.",
        "Qui n'a pas bon goût du tout",
        "Qui est très salé ou amer",
      ],
      rare: [
        "Qui n'arrive pas souvent, peu ordinaire. Exemple : Les fêtes sont rares dans notre petit village.",
        "Qui se passe chaque jour",
        "Qui est très ennuyeux à vivre",
      ],
    },
    dictation: {
      text: "Le jour de la __ du village approche. Jeanne sera une jolie __. Marc choisit le costume de __. Le village décoré est __.",
      words: ["fête", "reine", "Zorro", "méconnaissable"],
    },
    exercises: {
      lvl1: {
        q: "Coche ce que Jeanne veut porter : (Une couronne en diamants / Un masque noir / Un fouet à la main)",
      },
      lvl2: {
        q: "Remets en ordre : défilent / joyeux / les / musique / en / enfants",
      },
      lvl3: {
        q: "Explique avec tes propres mots pourquoi le carnaval est une journée inoubliable.",
      },
    },
    evaluation: [
      {
        q: "Pourquoi tout le monde se prépare-t-il avec joie ?",
        choices: [
          "Les vacances commencent",
          "Les fêtes sont rares dans le village",
          "Le maître est absent",
        ],
        answer: "Les fêtes sont rares dans le village",
      },
      { q: "Quel costume préfère Marc ?", answer: "le costume de zorro" },
    ],
    dossierContent: {
      redaction: [
        {
          jumbled: "approche / fête / La / village / du / .",
          correct: "La fête du village approche.",
        },
        {
          jumbled: "Jeanne / robe / portera / longue / une / .",
          correct: "Jeanne portera une longue robe.",
        },
        {
          jumbled: "Zorro / Marc / choisit / costume / le / de / .",
          correct: "Marc choisit le costume de Zorro.",
        },
        {
          jumbled: "clown / Un / est / amusant / beaucoup / plus / .",
          correct: "Un clown est beaucoup plus amusant.",
        },
        {
          jumbled: "décorées / Les / sont / joliment / rues / .",
          correct: "Les rues sont joliment décorées.",
        },
        {
          jumbled: "est / inoubliable / Le / voyage / .",
          correct: "Le voyage est inoubliable.",
        },
      ],
      reconstitution: [
        "Le jour de la grande fête du village approche avec enthousiasme.",
        "La municipalité nettoie toutes les avenues principales.",
        "Les enfants discutent avec joie de leurs prochains déguisements.",
        "Jeanne se déguise en reine et Marc en cavalier masqué.",
        "Le jour du carnaval, le village est devenu méconnaissable.",
        "Tout le monde déguste de succulents repas préparés par les mamans.",
      ],
      cloze: {
        text: "Juliette [1] la table pour le [2] . Elle [3] les assiettes, les [4] et les couteaux. Elle [5] la table avec de jolies fleurs. La fillette et ses parents [6] leur repas dans la joie.",
        words: ["dresse", "repas", "met", "fourchettes", "décore", "partagent"],
      },
      dialogue: [
        "Jeanne : Je serai une reine avec une longue robe blanche et indigo !",
        "Marc : Quelle chance ! Moi je préfère Zorro avec une belle cape noire.",
        "Jeanne : C'est très élégant ! Et que choisit notre camarade Julien ?",
        "Julien : J'hésite encore entre un clown amusant et un policier sérieux.",
      ],
    },
  },
};

type ThemeType = keyof typeof MASCOTS;
interface Homework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  ficheId: number;
  assignedTo: string[]; // 'all' or student IDs
  createdAt: string;
  exerciseText?: string;
  exerciseImage?: string;
  typeObjectif?: "soutien" | "standard" | "defi";
  documentUrl?: string;
  elementsEtayage?: {
    indicesVisuels: boolean;
    audioAideUrl?: string;
  };
  submissions?: Record<
    string,
    {
      studentName: string;
      textResponse: string;
      imageResponse?: string;
      feedback?: string;
      score?: string;
      submittedAt: string;
    }
  >;
}

export interface DevoirPédagogique {
  id: string;
  titre: string;
  consigne: string;
  documentUrl?: string; // Optionnel : lien vers une image ou un PDF
  typeObjectif: "soutien" | "standard" | "defi"; // Vos 3 niveaux de maîtrise
  datePublication: string;
  elementsEtayage?: {
    indicesVisuels: boolean;
    audioAideUrl?: string;
  };
}

type PageType =
  | "exam"
  | "presence"
  | "notes"
  | "classement"
  | "diplomes"
  | "corrige"
  | "dossier"
  | "lexique"
  | "cahier"
  | "homework"
  | "competition"
  | "succes";
type UserType = { type: "student" | "prof"; id?: string; name: string };

const VocabFlashcardModal = ({
  word,
  data,
  loading,
  onClose,
  onNext,
  onPrev,
  isMastered,
  onToggleMastery,
  onSpeak,
  currentIndex,
  totalCount,
}: {
  word: string;
  data?: { definition: string; example: string };
  loading: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  isMastered?: boolean;
  onToggleMastery?: () => void;
  onSpeak?: (word: string) => void;
  currentIndex?: number;
  totalCount?: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip when word changes
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Info / Header */}
        <div className="flex justify-between items-center mb-4 px-2 text-white">
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm select-none border border-white/10">
            💡 Mot {currentIndex || 1} sur {totalCount || 5}
          </span>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all cursor-pointer shadow-md active:scale-95 border border-white/10"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3D Flip Card Container */}
        <div
          onClick={() => {
            setIsFlipped(!isFlipped);
          }}
          className="relative w-full h-[380px] select-none cursor-pointer"
          style={{ perspective: "1200px" }}
        >
          {/* Card Body */}
          <div
            className="w-full h-full relative transition-all duration-500 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of Card */}
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className="absolute inset-0 bg-white rounded-[40px] p-8 shadow-2xl border-4 border-[var(--primary)] text-center flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full border border-[var(--primary)]/20">
                  Découverte Vocabulaire
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak?.(word);
                  }}
                  className="p-3 bg-[var(--primary)] text-white hover:scale-110 rounded-full transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Écouter la prononciation 🔊"
                >
                  <Volume2 size={20} />
                </button>
              </div>

              <div className="my-auto py-6 flex flex-col items-center">
                <h3 className="text-4xl font-baloo font-black text-[var(--text)] uppercase tracking-tight mb-4 leading-tight">
                  {word}
                </h3>
                <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl text-[var(--primary)] animate-pulse mb-6">
                  <RefreshCw size={14} className="animate-spin-slow" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    Clique d'abord pour voir le sens
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMastery?.();
                  }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all cursor-pointer text-xs font-black uppercase tracking-wider shadow-sm hover:scale-102 active:scale-98 ${
                    isMastered
                      ? "bg-green-500 border-green-500 text-white shadow-md hover:bg-green-600"
                      : "bg-white border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  <span>
                    {isMastered
                      ? "✅ Mot maîtrisé !"
                      : "⭐️ Marquer comme maîtrisé"}
                  </span>
                </button>
              </div>

              <div className="text-[10px] font-bold text-[var(--text-muted)] border-t border-gray-100 pt-4 flex justify-between items-center">
                <span>💡 Conseil : Clique au centre de la carte</span>
                <span>🎓 4ème Année</span>
              </div>
            </div>

            {/* Back of Card */}
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              className="absolute inset-0 bg-white rounded-[40px] p-8 shadow-2xl border-4 border-[var(--accent)] flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">
                  Définition & Exemple IA
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak?.(word);
                  }}
                  className="p-2 sm:p-2.5 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white rounded-full transition-all cursor-pointer active:scale-95"
                  title="Réécouter le mot"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              <div className="my-auto py-2 text-left space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-6 gap-3">
                    <Loader2
                      size={36}
                      className="animate-spin text-[var(--accent)]"
                    />
                    <p className="text-xs font-bold text-[var(--text-muted)] animate-pulse text-center">
                      L'IA rédige une définition super simple...
                    </p>
                  </div>
                ) : data ? (
                  <div className="space-y-4 flex flex-col">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--accent)] block mb-1">
                        💡 Signification simple :
                      </span>
                      <p className="text-base font-bold text-[var(--text)] leading-relaxed bg-[var(--accent)]/5 p-4 rounded-3xl border border-[var(--accent)]/10 shadow-inner">
                        {data.definition}
                      </p>
                    </div>

                    {data.example && (
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 block mb-1">
                          💬 Exemple d'utilisation :
                        </span>
                        <div className="p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <p className="text-center font-serif text-sm italic text-gray-700 leading-relaxed">
                            « {data.example} »
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMastery?.();
                        }}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 transition-all cursor-pointer text-xs font-black uppercase tracking-wider shadow-sm hover:scale-102 active:scale-98 ${
                          isMastered
                            ? "bg-green-500 border-green-500 text-white shadow-md hover:bg-green-600"
                            : "bg-white border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600"
                        }`}
                      >
                        <span>
                          {isMastered
                            ? "✅ Mot maîtrisé !"
                            : "⭐️ Marquer comme maîtrisé"}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-red-500 font-bold text-center">
                    Définition non disponible. Réessaie !
                  </p>
                )}
              </div>

              <div className="text-[10px] font-bold text-[var(--accent)] border-t border-gray-100 pt-4 text-center cursor-pointer flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity">
                <RefreshCw size={12} className="animate-spin-slow" />
                <span>Clique pour revoir le mot d'origine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Navigation Controls */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev?.();
            }}
            disabled={!onPrev}
            className={`flex items-center gap-2 px-5 py-3.5 bg-white text-[var(--text)] rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg border-2 border-[var(--border)] transition-all active:scale-95 cursor-pointer ${
              !onPrev
                ? "opacity-30 cursor-not-allowed pointer-events-none"
                : "hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={16} />
            <span>Précédent</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (data) setIsFlipped(!isFlipped);
            }}
            className="flex-1 py-3.5 bg-[var(--text)] text-white hover:bg-[var(--text)]/90 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer text-center"
          >
            {isFlipped ? "Voir le mot 📝" : "Voir le sens 💡"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
            disabled={!onNext}
            className={`flex items-center gap-2 px-5 py-3.5 bg-white text-[var(--text)] rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg border-2 border-[var(--border)] transition-all active:scale-95 cursor-pointer ${
              !onNext
                ? "opacity-30 cursor-not-allowed pointer-events-none"
                : "hover:bg-gray-50"
            }`}
          >
            <span>Suivant</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const HomeworkModal = ({
  fiches,
  onClose,
  onCreate,
  onUpdate,
  editingHomework,
}: {
  fiches: Record<number, Fiche>;
  onClose: () => void;
  onCreate?: (hw: Omit<Homework, "id" | "createdAt">) => void;
  onUpdate?: (hw: Homework) => void;
  editingHomework?: Homework;
}) => {
  const [title, setTitle] = useState(editingHomework?.title || "");
  const [description, setDescription] = useState(
    editingHomework?.description || "",
  );
  const [dueDate, setDueDate] = useState(editingHomework?.dueDate || "");
  const [ficheId, setFicheId] = useState(editingHomework?.ficheId || 1);
  const [exerciseText, setExerciseText] = useState(
    editingHomework?.exerciseText || "",
  );
  const [exerciseImage, setExerciseImage] = useState(
    editingHomework?.exerciseImage || "",
  );
  const [dragActive, setDragActive] = useState(false);

  const PRESETS = [
    {
      label: "Dromadaire 🐪",
      url: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Salle de Classe 🏫",
      url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Forêt d'Oasis 🌴",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Livre d'Histoire 📖",
      url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Chapiteau du Cirque 🎪",
      url: "https://images.unsplash.com/photo-1502899576159-f224dc23efb7?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExerciseImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setExerciseImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title || !dueDate) return;
    if (editingHomework && onUpdate) {
      onUpdate({
        ...editingHomework,
        title,
        description,
        dueDate,
        ficheId,
        exerciseText,
        exerciseImage,
      });
    } else if (onCreate) {
      onCreate({
        title,
        description,
        dueDate,
        ficheId,
        assignedTo: ["all"],
        exerciseText,
        exerciseImage,
      });
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 max-w-2xl w-full shadow-2xl relative my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all duration-300"
        >
          <X size={20} className="text-gray-400 hover:text-inherit" />
        </button>

        <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
          💡 Panel Enseignant • Jugurtha LMS
        </span>
        <h2 className="font-baloo text-3xl font-black text-slate-900 mt-2 mb-6">
          {editingHomework
            ? "Modifier le Devoir ✏️"
            : "Créer un Devoir à Domicile 🚀"}
        </h2>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Section 1: Informations Générales */}
          <div className="space-y-4">
            <h3 className="font-baloo text-sm font-black text-purple-900 uppercase border-b pb-1">
              📋 1. Infos Générales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1.5 ml-1">
                  Titre de l'exercice
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Dictée préparée ou Rédaction du jour..."
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1.5 ml-1">
                  Fiche de leçon associée
                </label>
                <select
                  value={ficheId}
                  onChange={(e) => setFicheId(Number(e.target.value))}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none font-bold appearance-none bg-white font-nunito"
                >
                  {Object.values(fiches).map((f) => (
                    <option key={f.id} value={f.id}>
                      Fiche N°{f.id} : {f.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1.5 ml-1">
                  Consignes / Descriptions
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Écris ici des consignes claires pour les élèves..."
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none font-bold min-h-[90px] text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1.5 ml-1">
                  Date limite de rendu
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-5 py-[14px] rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none font-bold font-nunito"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Données Texte de l'Exercice */}
          <div className="space-y-3">
            <h3 className="font-baloo text-sm font-black text-purple-900 uppercase border-b pb-1">
              ✍️ 2. Texte de l'Exercice (Questions, Histoire)
            </h3>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1.5 ml-1">
                Insérer un texte (Facultatif)
              </label>
              <textarea
                value={exerciseText}
                onChange={(e) => setExerciseText(e.target.value)}
                placeholder="Ex : Écris les questions à poser aux élèves ou le texte littéraire support d'évaluation..."
                className="w-full h-32 px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none font-medium font-serif leading-relaxed text-sm bg-slate-50/50"
              />
            </div>
          </div>

          {/* Section 3: Données Image de l'Exercice */}
          <div className="space-y-3">
            <h3 className="font-baloo text-sm font-black text-purple-900 uppercase border-b pb-1">
              🖼️ 3. Illustration ou Schéma de l'Exercice
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[30px] p-5 text-center flex flex-col items-center justify-center transition-all ${
                  dragActive
                    ? "border-purple-500 bg-purple-50/20"
                    : "border-gray-200 bg-slate-50/30"
                }`}
              >
                <ImageIcon size={32} className="text-gray-400 mb-2" />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-wider mb-2">
                  Glisse ton image ici
                </p>
                <span className="text-[9px] text-gray-400 font-bold mb-3">
                  OU
                </span>
                <label className="px-4 py-2 bg-purple-600 hover:bg-slate-900 duration-300 text-white rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer shadow-md">
                  Parcourir...
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL or Presets Option */}
              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1.5 ml-1">
                    Saisir un lien d'image externe
                  </label>
                  <input
                    type="text"
                    value={
                      exerciseImage.startsWith("data:") ? "" : exerciseImage
                    }
                    onChange={(e) => setExerciseImage(e.target.value)}
                    placeholder="https://lien-image.com/exemple.jpg"
                    className="w-full px-4 py-2 text-xs rounded-xl border-2 border-[var(--border)] focus:border-purple-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-450 tracking-widest mb-1 ml-1 font-mono">
                    Bibliothèque d'images thématiques
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setExerciseImage(p.url)}
                        className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg border transition-all ${
                          exerciseImage === p.url
                            ? "bg-purple-100 border-purple-400 text-purple-800 font-black"
                            : "bg-white border-gray-150 hover:bg-gray-50"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview Container */}
            {exerciseImage && (
              <div className="p-3 bg-slate-50 rounded-2xl border-2 border-gray-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    referrerPolicy="no-referrer"
                    src={exerciseImage}
                    alt="Aperçu support"
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                  />
                  <div>
                    <p className="text-[10px] font-black text-purple-950 uppercase tracking-widest">
                      Aperçu du visuel
                    </p>
                    <p className="text-[9px] text-gray-400 truncate max-w-xs">
                      {exerciseImage.startsWith("data:")
                        ? "Image chargée localement (Base64)"
                        : exerciseImage}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExerciseImage("")}
                  className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          disabled={!title || !dueDate}
          className="w-full mt-6 py-4.5 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer text-center text-xs"
        >
          {editingHomework
            ? "Sauvegarder les modifications 💾"
            : "Publier le devoir à la classe 🚀"}
        </button>
      </motion.div>
    </motion.div>
  );
};

const getClozeCorrectWords = (
  ficheId: number,
  lang: "fr" | "en" = "fr",
): string[] => {
  const activeFichesObj = lang === "en" ? FICHES_EN : FICHES;
  const cloze = activeFichesObj[ficheId]?.dossierContent?.cloze;
  if (!cloze) return [];
  if (lang === "fr" && ficheId === 1) {
    return [
      "malade",
      "fièvre",
      "docteur",
      "examine",
      "stéthoscope",
      "gorge",
      "ordonnance",
      "conseille",
      "pharmacie",
      "sirop",
    ];
  }
  return cloze.words;
};

// --- Main App Component ---
interface PersonalWord {
  word: string;
  definition: string;
  example: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  // États pour la sauvegarde de session
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeStudent, setActiveStudent] = useState<any>(null);
  const [selectedFicheId, setSelectedFicheId] = useState(1);
  const [act1Answers, setAct1Answers] = useState<Record<string, any>>({});
  const [act3Answers, setAct3Answers] = useState<Record<string, any>>({});
  const [act4Text, setAct4Text] = useState("");
  const [gamifiedScores, setGamifiedScores] = useState({
    act1: 0,
    act2: 0,
    act3: 0,
    act4: 0,
  });

  const [activeUsersCount, setActiveUsersCount] = useState(1); // Compteur d'élèves connectés
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [reportModalData, setReportModalData] = useState<{
    title: string;
    lines: string[];
  } | null>(null);
  const [studentRating, setStudentRating] = useState<number | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [noteSelectionnee, setNoteSelectionnee] = useState<number>(0);
  const [survolNote, setSurvolNote] = useState<number>(0);
  const [avisEnvoye, setAvisEnvoye] = useState<boolean>(false);

  // Simulation d'une base de données locale d'historique pour les rapports (Stockée dans localStorage)
  const [logsHistorique, setLogsHistorique] = useState([
    {
      date: "2026-05-28",
      eleve: "Adam",
      ficheId: 1,
      score: 180,
      aideDemandee: true,
      rating: 4,
    },
    {
      date: "2026-05-29",
      eleve: "Aya",
      ficheId: 1,
      score: 210,
      aideDemandee: false,
      rating: 5,
    },
    {
      date: "2026-06-01",
      eleve: "Amira",
      ficheId: 1,
      score: 150,
      aideDemandee: true,
      rating: 3,
    },
    {
      date: "2026-06-02",
      eleve: "Anas",
      ficheId: 1,
      score: 220,
      aideDemandee: false,
      rating: 5,
    },
    {
      date: "2026-06-03",
      eleve: "Hamza",
      ficheId: 2,
      score: 195,
      aideDemandee: false,
      rating: 4,
    },
  ]);

  // Effet pour simuler de légères variations d'élèves connectés en classe (pour vos tests de performance)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        // Simule entre 18 et 25 élèves connectés sur le réseau de l'école
        setActiveUsersCount(Math.floor(Math.random() * (25 - 18 + 1)) + 18);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Restauration de la session au démarrage
  const restaurerSessionEleve = (idEleve: string) => {
    const donneesStockees = localStorage.getItem(`odyssee_backup_${idEleve}`);
    if (donneesStockees) {
      const session = JSON.parse(donneesStockees);
      setAct1Answers(session.reponsesAct1 || {});
      setAct3Answers(session.reponsesAct3 || {});
      setAct4Text(session.texteAct4 || "");
      setGamifiedScores(
        session.scores || { act1: 0, act2: 0, act3: 0, act4: 0 },
      );
      setSelectedFicheId(session.ficheActive || 1);
    }
  };

  // Synchronisation des états de session
  useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
      if (currentUser.type === "student") {
        setActiveStudent(currentUser);
        restaurerSessionEleve(currentUser.id || currentUser.name || "guest");
      } else {
        setActiveStudent(null);
      }
    } else {
      setIsAuthenticated(false);
      setActiveStudent(null);
    }
  }, [currentUser]);

  // Sauvegarde automatique dès qu'une activité est modifiée
  useEffect(() => {
    if (isAuthenticated && activeStudent) {
      const sauvegardeSession = {
        studentId: activeStudent.id,
        ficheActive: selectedFicheId,
        reponsesAct1: act1Answers,
        reponsesAct3: act3Answers,
        texteAct4: act4Text,
        scores: gamifiedScores,
        horodatage: new Date().toISOString(),
      };
      localStorage.setItem(
        `odyssee_backup_${activeStudent.id}`,
        JSON.stringify(sauvegardeSession),
      );
    }
  }, [
    act1Answers,
    act3Answers,
    act4Text,
    gamifiedScores,
    selectedFicheId,
    activeStudent,
    isAuthenticated,
  ]);

  const CODE_SECRET_ENSEIGNANT = "1974"; // Votre clé d'accès privée

  // Fonction de vérification du privilège enseignant
  const verifierCodeEnseignant = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === CODE_SECRET_ENSEIGNANT) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).mozRequestFullScreen) {
          await (document.documentElement as any).mozRequestFullScreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn(
        "Fullscreen request rejected or blocked by browser policies/sandbox:",
        err,
      );
    }
  };

  const [currentTheme, setCurrentTheme] = useState<ThemeType>("default");
  const [currentPage, setCurrentPage] = useState<PageType>("exam");
  const [isHoveredDevoirs, setIsHoveredDevoirs] = useState(false);
  const [modalGalerieOuverte, setModalGalerieOuverte] = useState(false);
  const [modalProfilOuverte, setModalProfilOuverte] = useState(false);
  const [barreRechercheActive, setBarreRechercheActive] = useState(false);
  const [mascotMsg, setMascotMsg] = useState<{ text: string; show: boolean }>({
    text: "",
    show: false,
  });
  const [students, setStudents] = useState<{ id: string; name: string }[]>(() => {
    const saved = localStorage.getItem("jugurtha_students_list_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return STUDENTS;
  });

  useEffect(() => {
    localStorage.setItem("jugurtha_students_list_v2", JSON.stringify(students));
  }, [students]);

  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    const savedList = localStorage.getItem("jugurtha_students_list_v2");
    let currentList = STUDENTS;
    if (savedList) {
      try {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed) && parsed.length > 0) currentList = parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return currentList.reduce((acc, s) => ({ ...acc, [s.id]: true }), {});
  });

  const [studentGrades, setStudentGrades] = useState<Record<string, Record<string, string>>>(() => {
    const saved = localStorage.getItem("jugurtha_student_grades_v2");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    const savedList = localStorage.getItem("jugurtha_students_list_v2");
    let currentList = STUDENTS;
    if (savedList) {
      try {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed) && parsed.length > 0) currentList = parsed;
      } catch (e) {
        console.error(e);
      }
    }
    const initial: Record<string, Record<string, string>> = {};
    currentList.forEach((s, idx) => {
      // Nice realistic starting values around the class promedio
      const c2Val = (3 - (idx % 3) * 0.5).toFixed(1);
      const c3Val = (3 - ((idx + 1) % 3) * 0.5).toFixed(1);
      const c4Val = (2.5 - ((idx + 2) % 3) * 0.5).toFixed(1);
      const c6Val = (3 - (idx % 2) * 0.5).toFixed(1);
      const c1Val = (3.5 - (idx % 3) * 0.5).toFixed(1);
      const c5Val = (4 - ((idx + 1) % 2) * 0.5).toFixed(1);

      initial[s.id] = {
        C2: parseFloat(c2Val) < 0 ? "0.0" : c2Val,
        C3: parseFloat(c3Val) < 0 ? "0.0" : c3Val,
        C4: parseFloat(c4Val) < 0 ? "0.0" : c4Val,
        C6: parseFloat(c6Val) < 0 ? "0.0" : c6Val,
        C1: parseFloat(c1Val) < 0 ? "0.0" : c1Val,
        C5: parseFloat(c5Val) < 0 ? "0.0" : c5Val,
      };
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem("jugurtha_student_grades_v2", JSON.stringify(studentGrades));
  }, [studentGrades]);

  const [activeCorrectionStudentId, setActiveCorrectionStudentId] = useState<string | null>(() => {
    const savedList = localStorage.getItem("jugurtha_students_list_v2");
    let currentList = STUDENTS;
    if (savedList) {
      try {
        const parsed = JSON.parse(savedList);
        if (Array.isArray(parsed) && parsed.length > 0) currentList = parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return currentList[0]?.id || null;
  });

  const [showStudentManager, setShowStudentManager] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingStudentName, setEditingStudentName] = useState("");

  const handleAddStudent = () => {
    if (!newStudentName.trim()) {
      showMascotMsg("Veuillez saisir un nom pour l'élève ! 🧑‍🎓");
      return;
    }
    const cleanId = newStudentId.trim().padStart(4, "0");
    if (!cleanId) {
      showMascotMsg("L'ID ne peut pas être vide ! ID incorrect. ❌");
      return;
    }
    if (students.some(s => s.id === cleanId)) {
      showMascotMsg(`L'identifiant ${cleanId} est déjà utilisé par un autre élève ! ⚠️`);
      return;
    }

    const newStudent = { id: cleanId, name: newStudentName.trim() };
    setStudents(prev => [...prev, newStudent]);
    
    setAttendance(prev => ({ ...prev, [cleanId]: true }));

    setStudentGrades(prev => ({
      ...prev,
      [cleanId]: {
        C2: "0.0",
        C3: "0.0",
        C4: "0.0",
        C6: "0.0",
        C1: "0.0",
        C5: "0.0"
      }
    }));

    showMascotMsg(`Félicitations, ${newStudentName} (ID: ${cleanId}) a été ajouté(e) ! 🎉📚`);

    setNewStudentName("");
    const ids = [...students, newStudent].map(s => parseInt(s.id, 10)).filter(id => !isNaN(id));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const nextId = String(maxId + 1).padStart(4, "0");
    setNewStudentId(nextId);
  };

  const handleRemoveStudent = (studentId: string) => {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer l'élève ${targetStudent.name} (${studentId}) ?\nSes notes et données de présence seront effacées.`);
    if (!confirmDelete) return;

    setStudents(prev => {
      const updated = prev.filter(s => s.id !== studentId);
      if (activeCorrectionStudentId === studentId) {
        setActiveCorrectionStudentId(updated[0]?.id || null);
      }
      return updated;
    });

    showMascotMsg(`L'élève ${targetStudent.name} a été retiré(e) de la liste ! 🧹`);
  };

  const handleStartEditStudent = (id: string, name: string) => {
    setEditingStudentId(id);
    setEditingStudentName(name);
  };

  const handleSaveEditStudent = (id: string) => {
    if (!editingStudentName.trim()) {
      showMascotMsg("Le nom ne peut pas être vide ! ⚠️");
      return;
    }
    setStudents(prev => prev.map(s => s.id === id ? { ...s, name: editingStudentName.trim() } : s));
    setEditingStudentId(null);
    setEditingStudentName("");
    showMascotMsg("Nom de l'élève mis à jour avec succès ! 💾📝");
  };

  useEffect(() => {
    if (showStudentManager && !newStudentId) {
      const ids = students.map(s => parseInt(s.id, 10)).filter(id => !isNaN(id));
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextId = String(maxId + 1).padStart(4, "0");
      setNewStudentId(nextId);
    }
  }, [showStudentManager, students, newStudentId]);

  const updateStudentGrade = (studentId: string, criterion: string, val: string) => {
    let cleaned = val.replace(",", ".");
    cleaned = cleaned.replace(/[^0-9.]/g, "");
    
    if (cleaned === "") {
      setStudentGrades(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || { C2: "0.0", C3: "0.0", C4: "0.0", C6: "0.0", C1: "0.0", C5: "0.0" }),
          [criterion]: ""
        }
      }));
      return;
    }

    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) return;

    const numeric = parseFloat(cleaned);
    if (!isNaN(numeric)) {
      if (numeric < 0) cleaned = "0.0";
      if (numeric > 20) cleaned = "20.0";
    }

    setStudentGrades(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { C2: "0.0", C3: "0.0", C4: "0.0", C6: "0.0", C1: "0.0", C5: "0.0" }),
        [criterion]: cleaned
      }
    }));
  };

  const [scores, setScores] = useState<Record<string, any>>({});
  const [timer, setTimer] = useState(1200); // 20 min in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioEnabled) {
      if (!audioRef.current) {
        audioRef.current = new Audio(
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        );
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2;
      }
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play blocked", e));
    } else {
      audioRef.current?.pause();
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [audioEnabled]);

  const [progress, setProgress] = useState(0);

  // Seyès States (Preserved)
  const [fontSize, setFontSize] = useState(24);
  const [readingFontSize, setReadingFontSize] = useState<number>(() => {
    const saved = localStorage.getItem("readingFontSize");
    return saved ? parseInt(saved, 10) : 18;
  });
  const [readingLineHeight, setReadingLineHeight] = useState<string>(() => {
    return localStorage.getItem("readingLineHeight") || "leading-relaxed";
  });
  const [readingTextColor, setReadingTextColor] = useState<string>(() => {
    return localStorage.getItem("readingTextColor") || "var(--text)";
  });
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Playwrite FR Trad");
  const [ttsStatus, setTtsStatus] = useState<"stopped" | "playing" | "paused">(
    "stopped",
  );
  const [ttsRate, setTtsRate] = useState<number>(
    () => Number(localStorage.getItem("jugurtha_tts_rate")) || 0.85,
  );
  const [ttsPitch, setTtsPitch] = useState<number>(
    () => Number(localStorage.getItem("jugurtha_tts_pitch")) || 1.05,
  );
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(
    () => localStorage.getItem("jugurtha_tts_voice") || "",
  );
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(-1);
  const [speechActiveText, setSpeechActiveText] = useState<string>("");

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const frVoices = voices.filter((v) =>
        v.lang.toLowerCase().startsWith("fr"),
      );

      // Classer les voix françaises : Premium, Naturelles, Google, Siri, et rôles d'apprentissage en premier
      const sortedFrVoices = [...frVoices].sort((a, b) => {
        const score = (name: string) => {
          const n = name.toLowerCase();
          if (n.includes("denise") || n.includes("henri")) return 100;
          if (n.includes("natural") || n.includes("premium")) return 90;
          if (n.includes("google") && n.includes("fr-fr")) return 80;
          if (n.includes("google")) return 70;
          if (n.includes("siri")) return 60;
          if (
            n.includes("hortense") ||
            n.includes("thomas") ||
            n.includes("amelie") ||
            n.includes("amélie")
          )
            return 50;
          if (n.includes("julie") || n.includes("paul")) return 40;
          return 0; // voix standards / robotiques
        };
        const scoreA = score(a.name);
        const scoreB = score(b.name);
        if (scoreA !== scoreB) {
          return scoreB - scoreA; // plus haut score en premier
        }
        return a.name.localeCompare(b.name);
      });

      setAvailableVoices(sortedFrVoices);
      if (sortedFrVoices.length > 0) {
        // Automatically prefer the saved user voice, or find the best French voice
        const stored = localStorage.getItem("jugurtha_tts_voice") || "";
        const exists = sortedFrVoices.some((v) => v.name === stored);
        if (exists) {
          setSelectedVoiceName(stored);
        } else {
          const bestVoice = sortedFrVoices[0];
          if (bestVoice) {
            setSelectedVoiceName(bestVoice.name);
            localStorage.setItem("jugurtha_tts_voice", bestVoice.name);
          }
        }
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    try {
      const cachedDossiersStr = localStorage.getItem(
        "jugurtha_ai_dossier_cache",
      );
      if (cachedDossiersStr) {
        const cachedDossiers = JSON.parse(cachedDossiersStr);
        Object.keys(cachedDossiers).forEach((idStr) => {
          const id = Number(idStr);
          if (FICHES[id] && cachedDossiers[id]) {
            FICHES[id].dossierContent = cachedDossiers[id];
          }
        });
      }
    } catch (e) {
      console.error("Failed to load cached dossiers on mount:", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("jugurtha_tts_rate", String(ttsRate));
  }, [ttsRate]);

  useEffect(() => {
    localStorage.setItem("jugurtha_tts_pitch", String(ttsPitch));
  }, [ttsPitch]);

  const [isIntroRunning, setIsIntroRunning] = useState(false);
  const [customReadingText, setCustomReadingText] = useState(
    () => localStorage.getItem("jugurtha_custom_reading") || "",
  );
  const [customFicheTexts, setCustomFicheTexts] = useState<
    Record<number, string>
  >(() => {
    const saved = localStorage.getItem("jugurtha_custom_fiche_texts");
    return saved ? JSON.parse(saved) : {};
  });
  const [isEditingFicheText, setIsEditingFicheText] = useState(false);
  const [useCustomReading, setUseCustomReading] = useState(false);

  // Fiche 1 Match elements state
  const [matchingLeftSelected, setMatchingLeftSelected] = useState<
    string | null
  >(null);
  const [matchingPairs, setMatchingPairs] = useState<Record<string, string>>(
    () => {
      const saved = localStorage.getItem("fiche1_matching_pairs");
      return saved ? JSON.parse(saved) : {};
    },
  );

  // Fiche 1 Complement phrases with verbs state
  const [verbCompleteAnswers, setVerbCompleteAnswers] = useState<
    Record<string, string>
  >(() => {
    const saved = localStorage.getItem("fiche1_verb_complete_answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [verbsChecked, setVerbsChecked] = useState<boolean>(() => {
    const saved = localStorage.getItem("fiche1_verbs_checked");
    return saved === "true";
  });

  // Fiche 1 Character identification state
  const [characterSelections, setCharacterSelections] = useState<string[]>(
    () => {
      const saved = localStorage.getItem("fiche1_character_selections");
      return saved ? JSON.parse(saved) : [];
    },
  );
  const [charactersChecked, setCharactersChecked] = useState<boolean>(() => {
    const saved = localStorage.getItem("fiche1_characters_checked");
    return saved === "true";
  });

  const [personalLexicon, setPersonalLexicon] = useState<PersonalWord[]>(() => {
    const saved = localStorage.getItem("jugurtha_personal_lexicon");
    return saved ? JSON.parse(saved) : [];
  });
  const [lexiqueSearchTerm, setLexiqueSearchTerm] = useState("");

  // --- States and handlers for 'Assistant Mot' ---
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantWord, setAssistantWord] = useState<string | null>(null);
  const [assistantWordInfo, setAssistantWordInfo] =
    useState<AssistantWordData | null>(null);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const hoverTimeoutRef = useRef<any>(null);

  const handleAssistantLookup = async (word: string) => {
    if (!word || word.length < 2) return;
    const cleanWord = word
      .trim()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");

    setIsAssistantOpen(true);
    setAssistantWord(cleanWord);

    // 1. Local Offline Register Check
    const localInfo = findComplexWordInfoLocal(cleanWord);
    if (localInfo) {
      setAssistantWordInfo(localInfo);
      setIsAssistantLoading(false);
      return;
    }

    // 2. AI Lexicon Cache Check
    const cached = getCachedLexique(cleanWord);
    if (cached) {
      // Handle cache with or without synonyms
      setAssistantWordInfo({
        word: cleanWord,
        definition: cached.definition,
        example: cached.example,
        synonyms: cached.synonyms || [],
      });
      setIsAssistantLoading(false);
      return;
    }

    // 3. Offline Warning Handling
    if (!isOnline) {
      setAssistantWordInfo({
        word: cleanWord,
        definition:
          "⚠️ Mode Hors-ligne actif. Les requêtes de dictionnaire IA ne sont pas disponibles sans connexion réseau.",
        example: "",
        synonyms: [],
      });
      setIsAssistantLoading(false);
      return;
    }

    // 4. Remote GPT/Gemini search for synonyms + definition
    setIsAssistantLoading(true);
    try {
      const response = await fetch("/api/lexique-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: cleanWord }),
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();

      // Save data back to lexique cache
      setCachedLexique(cleanWord, data);

      setAssistantWordInfo({
        word: cleanWord,
        definition: data.definition,
        example: data.example,
        synonyms: data.synonyms || [],
      });
    } catch (e) {
      console.error(e);
      setAssistantWordInfo({
        word: cleanWord,
        definition: `Je n'ai pas pu charger la définition de "${cleanWord}". Demande à ta maîtresse ou re-tente ! ✨`,
        example: "",
        synonyms: [],
      });
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const handleWordHover = (word: string | null) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (!word) return;

    // Trigger only on hover-delay to prevent accidental panel sliders while sweeping cursor
    hoverTimeoutRef.current = setTimeout(() => {
      handleAssistantLookup(word);
    }, 200);
  };

  const isSavedInLexicon = useMemo(() => {
    if (!assistantWord) return false;
    return personalLexicon.some(
      (p) => p.word.toLowerCase() === assistantWord.toLowerCase(),
    );
  }, [personalLexicon, assistantWord]);

  const [rankingSearch, setRankingSearch] = useState("");
  const [rankingSortBy, setRankingSortBy] = useState<
    "totalPoints" | "averageScore" | "completedCount" | "badgesCount"
  >("totalPoints");
  const [rankingFilter, setRankingFilter] = useState<
    "all" | "active" | "withBadges" | "podium"
  >("all");
  const [showAllRanking, setShowAllRanking] = useState(false);

  const addToLexicon = (
    word: string,
    definition: string = "",
    example: string = "",
  ) => {
    if (!word) return;
    setPersonalLexicon((prev) => {
      const exists = prev.find(
        (p) => p.word.toLowerCase() === word.toLowerCase(),
      );
      if (exists) {
        showMascotMsg("Ce mot est déjà dans ton lexique ! 😊");
        return prev;
      }
      showMascotMsg("Mot ajouté à ton lexique ! 📝✨");
      return [{ word, definition, example }, ...prev];
    });
  };
  const ttsUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);

  // Teacher Audio Studio States
  const [teacherRecordingFicheId, setTeacherRecordingFicheId] =
    useState<number>(1);
  const [isTeacherRecording, setIsTeacherRecording] = useState(false);
  const [teacherAudioUrl, setTeacherAudioUrl] = useState<string | null>(null);
  const [teacherMediaRecorder, setTeacherMediaRecorder] =
    useState<MediaRecorder | null>(null);
  const [teacherRecordingTimer, setTeacherRecordingTimer] = useState(0);
  const [teacherStatusMsg, setTeacherStatusMsg] = useState(
    "Prêt à l'enregistrement",
  );
  const [teacherStatusColor, setTeacherStatusColor] =
    useState("text-slate-500");
  const [isPlayingTeacherPreview, setIsPlayingTeacherPreview] = useState(false);
  const teacherPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let timerId: any;
    if (isTeacherRecording) {
      timerId = setInterval(() => {
        setTeacherRecordingTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isTeacherRecording]);

  useEffect(() => {
    let active = true;
    const fetchTeacherAudio = async () => {
      if (teacherAudioUrl) {
        URL.revokeObjectURL(teacherAudioUrl);
      }
      setTeacherAudioUrl(null);
      setIsPlayingTeacherPreview(false);
      if (teacherPreviewAudioRef.current) {
        teacherPreviewAudioRef.current.pause();
        teacherPreviewAudioRef.current = null;
      }

      const key = `fiche_${teacherRecordingFicheId}_lecture`;
      const blob = await getAudioFromIndexedDB(key);
      if (blob && active) {
        setTeacherAudioUrl(URL.createObjectURL(blob));
        setTeacherStatusMsg(
          "🔊 Un enregistrement de secours de votre voix humaine est disponible.",
        );
        setTeacherStatusColor("text-indigo-600");
      } else if (active) {
        setTeacherStatusMsg("Prêt à l'enregistrement. Aucun audio stocké.");
        setTeacherStatusColor("text-slate-500");
      }
    };
    fetchTeacherAudio();
    return () => {
      active = false;
    };
  }, [teacherRecordingFicheId]);

  const startTeacherRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType });
        const key = `fiche_${teacherRecordingFicheId}_lecture`;
        await saveAudioToIndexedDB(key, blob);

        // Refresh local URL for playback
        if (teacherAudioUrl) URL.revokeObjectURL(teacherAudioUrl);
        setTeacherAudioUrl(URL.createObjectURL(blob));
        setTeacherStatusMsg("💾 Audio sauvegardé localement avec succès !");
        setTeacherStatusColor("text-green-600 font-bold");
        showMascotMsg(
          `Fiche ${teacherRecordingFicheId} : Votre voix a été enregistrée avec succès ! 🎙️💾`,
        );

        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      setTeacherMediaRecorder(recorder);
      setTeacherRecordingTimer(0);
      setTeacherStatusMsg("🎙️ Enregistrement en cours... Parlez clairement.");
      setTeacherStatusColor("text-red-500 font-bold animate-pulse");
      setIsTeacherRecording(true);
      recorder.start();
    } catch (err) {
      setTeacherStatusMsg("❌ Erreur : Accès au micro refusé ou non supporté.");
      setTeacherStatusColor("text-red-500");
    }
  };

  const stopTeacherRecording = () => {
    if (teacherMediaRecorder && isTeacherRecording) {
      teacherMediaRecorder.stop();
      setIsTeacherRecording(false);
    }
  };

  const playTeacherAudioPreview = () => {
    if (!teacherAudioUrl) return;
    if (teacherPreviewAudioRef.current) {
      teacherPreviewAudioRef.current.pause();
      teacherPreviewAudioRef.current = null;
      setIsPlayingTeacherPreview(false);
      setTeacherStatusMsg("🔊 Fin de la lecture.");
      setTeacherStatusColor("text-indigo-600");
      return;
    }
    const audio = new Audio(teacherAudioUrl);
    teacherPreviewAudioRef.current = audio;
    setIsPlayingTeacherPreview(true);
    setTeacherStatusMsg("▶️ Lecture de votre voix enregistrée...");
    setTeacherStatusColor("text-emerald-600 font-bold");

    audio.onended = () => {
      setIsPlayingTeacherPreview(false);
      teacherPreviewAudioRef.current = null;
      setTeacherStatusMsg("🔊 Fin de la lecture.");
      setTeacherStatusColor("text-indigo-600");
    };
    audio.play().catch((err) => {
      console.error(err);
      setIsPlayingTeacherPreview(false);
    });
  };

  const deleteTeacherAudio = async () => {
    const key = `fiche_${teacherRecordingFicheId}_lecture`;
    await deleteAudioFromIndexedDB(key);
    if (teacherAudioUrl) URL.revokeObjectURL(teacherAudioUrl);
    setTeacherAudioUrl(null);
    setTeacherStatusMsg("🗑️ L'enregistrement de secours a été supprimé.");
    setTeacherStatusColor("text-rose-500");
    showMascotMsg("L'enregistrement a été supprimé.");
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recordedAudioRef.current) {
        recordedAudioRef.current.pause();
      }
    };
  }, []);

  const selectFrenchVoice = (utterance: SpeechSynthesisUtterance) => {
    if (!window.speechSynthesis) return;

    // Get voice configuration map for the active theme
    const activeConfig =
      CONFIG_VOIX_THEMES["theme-" + currentTheme] ||
      CONFIG_VOIX_THEMES["theme-default"];

    // Set the overall humanized pitch / expressiveness preference
    utterance.pitch = activeConfig.pitch;

    // Apply native theme-configured rate if rate is not already explicitly slowed down
    if (utterance.rate === 1 || utterance.rate === 1.0) {
      utterance.rate = activeConfig.rate;
    }

    const langKey =
      utterance.lang && utterance.lang.toLowerCase().startsWith("en")
        ? "en"
        : "fr";
    const preferredNames = activeConfig[langKey];

    const voices = window.speechSynthesis.getVoices();
    const langVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(langKey),
    );
    if (langVoices.length === 0 && voices.length === 0) return;

    const userSelectedVoice = voices.find((v) => v.name === selectedVoiceName);
    if (
      userSelectedVoice &&
      userSelectedVoice.lang.toLowerCase().startsWith(langKey)
    ) {
      utterance.voice = userSelectedVoice;
      return;
    }

    let selectedVoice: SpeechSynthesisVoice | null = null;

    // 1. Search for best matches among theme preferred voices matching the language filter
    for (const prefName of preferredNames) {
      const found = langVoices.find((v) =>
        v.name.toLowerCase().includes(prefName.toLowerCase()),
      );
      if (found) {
        selectedVoice = found;
        break;
      }
    }

    // 2. Fallback: Search among all available voices matching preferred keywords
    if (!selectedVoice) {
      for (const prefName of preferredNames) {
        const found = voices.find((v) =>
          v.name.toLowerCase().includes(prefName.toLowerCase()),
        );
        if (found) {
          selectedVoice = found;
          break;
        }
      }
    }

    // 3. Last resort standard defaults based on language
    if (!selectedVoice && langVoices.length > 0) {
      if (langKey === "fr") {
        selectedVoice =
          langVoices.find(
            (v) =>
              v.name.toLowerCase().includes("denise") ||
              v.name.toLowerCase().includes("henri"),
          ) ||
          langVoices.find(
            (v) =>
              v.name.toLowerCase().includes("google") &&
              v.lang.toLowerCase() === "fr-fr",
          ) ||
          langVoices.find((v) => v.name.toLowerCase().includes("hortense")) ||
          langVoices.find(
            (v) =>
              v.name.toLowerCase().includes("thomas") ||
              v.name.toLowerCase().includes("amelie") ||
              v.name.toLowerCase().includes("siri"),
          ) ||
          langVoices.find((v) => v.name.toLowerCase().includes("google")) ||
          langVoices.find((v) => v.lang.toLowerCase() === "fr-fr") ||
          langVoices[0];
      } else {
        selectedVoice =
          langVoices.find(
            (v) =>
              v.name.toLowerCase().includes("google") &&
              v.lang.toLowerCase().startsWith("en"),
          ) ||
          langVoices.find(
            (v) =>
              v.name.toLowerCase().includes("david") ||
              v.name.toLowerCase().includes("zira") ||
              v.name.toLowerCase().includes("hazel"),
          ) ||
          langVoices.find((v) => v.name.toLowerCase().includes("siri")) ||
          langVoices[0];
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  };

  const playVoicePreview = (voiceName: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const details = getVoiceLabelAndIcon(voiceName);
    const greeting =
      langueActive === "en"
        ? `Hello! I love reading with you!`
        : `Bonjour ! J'adore lire avec toi !`;
    const utterance = new SpeechSynthesisUtterance(greeting);
    utterance.lang = langueActive === "en" ? "en-US" : "fr-FR";
    utterance.rate = ttsRate;
    utterance.pitch = ttsPitch;

    const voices = window.speechSynthesis.getVoices();
    const voiceSelected = voices.find((v) => v.name === voiceName);
    if (voiceSelected) {
      utterance.voice = voiceSelected;
    } else {
      selectFrenchVoice(utterance);
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleTtsPlay = async (text: string) => {
    if (!window.speechSynthesis) return;

    if (ttsStatus === "paused") {
      if (recordedAudioRef.current) {
        recordedAudioRef.current
          .play()
          .catch((err) => console.error("Recorded audio resume error:", err));
        setIsPlayingRecordedAudio(true);
        setTtsStatus("playing");
        return;
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
        setTtsStatus("playing");
        return;
      }
    }

    // Stop and clean any currently running synthesis or playback
    window.speechSynthesis.cancel();
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current = null;
      setIsPlayingRecordedAudio(false);
    }

    // Check if Teacher recorded audio is available in IndexedDB
    const key = `fiche_${currentFicheId}_lecture`;
    try {
      const cachedBlob = await getAudioFromIndexedDB(key);
      if (cachedBlob) {
        console.log("Lecture de la voix pré-enregistrée par l'enseignant...");
        showMascotMsg(
          langueActive === "en"
            ? "Playing your teacher's recorded voice! 🎙️✨"
            : "Lecture de la voix enregistrée de ton enseignant(e) ! 🎙️✨",
        );

        const audioUrl = URL.createObjectURL(cachedBlob);
        const audio = new Audio(audioUrl);
        recordedAudioRef.current = audio;
        setIsPlayingRecordedAudio(true);
        setTtsStatus("playing");

        audio.onended = () => {
          setIsPlayingRecordedAudio(false);
          setTtsStatus("stopped");
          recordedAudioRef.current = null;
        };
        audio.onerror = () => {
          setIsPlayingRecordedAudio(false);
          setTtsStatus("stopped");
          recordedAudioRef.current = null;
        };
        audio.play().catch((err) => {
          console.error("Failed to play teacher recording:", err);
          setIsPlayingRecordedAudio(false);
          setTtsStatus("stopped");
        });
        return;
      }
    } catch (e) {
      console.error("Failed to check IndexedDB for teacher recording", e);
    }

    // If no human voice recording is found, fall back to high-quality text-to-speech synthesis
    console.log("Aucun enregistrement trouvé. Passage à la synthèse vocale...");
    setIsIntroRunning(true);
    setActiveCharIndex(-1);
    setSpeechActiveText(text);

    // Warm friendly intro context
    const introText =
      langueActive === "en"
        ? "Listen carefully to the text"
        : "Écoute bien le texte";
    const intro = new SpeechSynthesisUtterance(introText);
    intro.lang = langueActive === "en" ? "en-US" : "fr-FR";
    intro.rate = ttsRate;
    intro.pitch = ttsPitch;
    selectFrenchVoice(intro);

    // Main text utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langueActive === "en" ? "en-US" : "fr-FR";
    utterance.rate = 0.82; // Vitesse ralentie pour la clarté pédagogique
    utterance.pitch = ttsPitch;

    // Select premium/natural voice driven by theme
    selectFrenchVoice(utterance);

    intro.onstart = () => {
      setTtsStatus("playing");
    };
    intro.onend = () => {
      setIsIntroRunning(false);
    };
    intro.onerror = () => {
      setIsIntroRunning(false);
    };

    utterance.onstart = () => {
      setIsIntroRunning(false);
      setTtsStatus("playing");
      setActiveCharIndex(-1);
    };

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        setActiveCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      setTtsStatus("stopped");
      setIsIntroRunning(false);
      setActiveCharIndex(-1);
    };
    utterance.onerror = () => {
      setTtsStatus("stopped");
      setIsIntroRunning(false);
      setActiveCharIndex(-1);
    };

    ttsUtteranceRef.current = utterance;
    window.speechSynthesis.speak(intro);
    window.speechSynthesis.speak(utterance);
  };

  const handleTtsPause = () => {
    if (recordedAudioRef.current && isPlayingRecordedAudio) {
      recordedAudioRef.current.pause();
      setIsPlayingRecordedAudio(false);
      setTtsStatus("paused");
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setTtsStatus("paused");
    }
  };

  const handleTtsStop = () => {
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current = null;
      setIsPlayingRecordedAudio(false);
    }
    window.speechSynthesis.cancel();
    setTtsStatus("stopped");
    setActiveCharIndex(-1);
  };

  // Login States
  const [loginMode, setLoginMode] = useState<"student" | "teacher">("student");
  const [loginValue, setLoginValue] = useState("");
  const [langueActive, setLangueActive] = useState<"fr" | "en">("fr");
  const [activeCodeFile, setActiveCodeFile] = useState<"db" | "auth" | "app">(
    "db",
  );
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isLudiqueActive, setIsLudiqueActive] = useState(true);
  const [activeMascotBubble, setActiveMascotBubble] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Bind global function for language switching as required
    (window as any).basculerLangue = (nouvelleLangue: any) => {
      if (TextesInterface[nouvelleLangue as "fr" | "en"]) {
        setLangueActive(nouvelleLangue);

        // Ensure manual DOM compatibility as asked by user contract
        const subtitleEl = document.getElementById("app-subtitle");
        if (subtitleEl)
          subtitleEl.innerText =
            TextesInterface[nouvelleLangue as "fr" | "en"].subtitle;

        const inputEl = document.getElementById(
          "student-input",
        ) as HTMLInputElement;
        if (inputEl)
          inputEl.placeholder =
            TextesInterface[nouvelleLangue as "fr" | "en"].inputPlaceholder;

        const btnSubmitEl = document.getElementById("btn-submit");
        if (btnSubmitEl)
          btnSubmitEl.innerText =
            TextesInterface[nouvelleLangue as "fr" | "en"].btnEnter;

        const teacherLinkEl = document.getElementById("teacher-link");
        if (teacherLinkEl)
          teacherLinkEl.innerText =
            TextesInterface[nouvelleLangue as "fr" | "en"].teacherLink;

        const btnPrintEl = document.getElementById("btn-print-footer");
        if (btnPrintEl)
          btnPrintEl.innerText =
            TextesInterface[nouvelleLangue as "fr" | "en"].btnPrint;

        console.log(
          `Interface basculée en mode : ${nouvelleLangue.toUpperCase()}`,
        );
      }
    };
    return () => {
      delete (window as any).basculerLangue;
    };
  }, []);

  const [consolidatedAnswers, setConsolidatedAnswers] = useState<
    Record<string, string>
  >({});
  const [dossierAnswers, setDossierAnswers] = useState<Record<string, string>>(
    {},
  );
  const [dossierLevel, setDossierLevel] = useState<1 | 2 | 3>(1);
  const [dossierTab, setDossierTab] = useState<
    "standard" | "fiche" | "enrichi"
  >("enrichi");
  const [activeDossierActivity, setActiveDossierActivity] = useState<
    1 | 2 | 3 | 4 | 5
  >(1);
  const [isGeneratingDossier, setIsGeneratingDossier] = useState(false);
  const [writingModelImg, setWritingModelImg] = useState<string | null>(null);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDossierCheck, setShowDossierCheck] = useState(false);
  const [currentFicheId, setCurrentFicheId] = useState<number>(1);

  useEffect(() => {
    if (typeof currentFicheId === "number") {
      setSelectedFicheId(currentFicheId);
      setStudentRating(null);
      setRatingSubmitted(false);
    }
  }, [currentFicheId]);
  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    const saved = localStorage.getItem("jugurtha_homeworks");
    return saved ? JSON.parse(saved) : [];
  });

  const handlePublierDevoirPedagogique = (devoir: DevoirPédagogique) => {
    const newHw: Homework = {
      id: devoir.id,
      title: `${devoir.typeObjectif === "soutien" ? "🆘" : devoir.typeObjectif === "defi" ? "🚀" : "📘"} ${devoir.titre}`,
      description: devoir.consigne,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      ficheId: currentFicheId,
      assignedTo: ["all"],
      createdAt: new Date().toISOString(),
      typeObjectif: devoir.typeObjectif,
      documentUrl: devoir.documentUrl,
      exerciseImage: devoir.documentUrl,
      submissions: {},
    };
    setHomeworks((prev) => [newHw, ...prev]);
    showMascotMsg(
      `Le devoir APC différencié (« ${devoir.titre} ») a été déployé avec succès ! 🚀✨`,
    );
  };

  const handleSauvegarderDevoirEnseignant = (data: {
    titreTask: string;
    texteSupport: string;
    lienMedia: string;
    groupeCible: "soutien" | "standard" | "defi";
  }) => {
    const newHw: Homework = {
      id: `dev-${Date.now()}`,
      title: `${data.groupeCible === "soutien" ? "🆘" : data.groupeCible === "defi" ? "🚀" : "📘"} ${data.titreTask}`,
      description: data.texteSupport,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      ficheId: currentFicheId,
      assignedTo: ["all"],
      createdAt: new Date().toISOString(),
      typeObjectif: data.groupeCible,
      documentUrl: data.lienMedia || undefined,
      exerciseImage: data.lienMedia || undefined,
      submissions: {},
    };
    setHomeworks((prev) => [newHw, ...prev]);
    showMascotMsg(
      `La fiche enseignant (« ${data.titreTask} ») a été déployée avec succès sur les tablettes élèves ! 🚀✨`,
    );
  };
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [activeHomeworkResponseId, setActiveHomeworkResponseId] = useState<
    string | null
  >(null);
  const [activeHomeworkSubmissionsId, setActiveHomeworkSubmissionsId] =
    useState<string | null>(null);
  const [studentHomeworkText, setStudentHomeworkText] = useState("");
  const [studentHomeworkImage, setStudentHomeworkImage] = useState("");
  const [studentHomeworkAttachments, setStudentHomeworkAttachments] = useState<
    any[]
  >([]);
  const [activeEditingAttachmentIdx, setActiveEditingAttachmentIdx] = useState<
    number | null
  >(null);
  const [teacherEditingHwId, setTeacherEditingHwId] = useState<string | null>(
    null,
  );
  const [teacherEditingStudentId, setTeacherEditingStudentId] = useState<
    string | null
  >(null);
  const [showPdfEditor, setShowPdfEditor] = useState(false);
  const [showDocEditor, setShowDocEditor] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [teacherFeedbackMap, setTeacherFeedbackMap] = useState<
    Record<string, { feedback: string; score: string }>
  >({});
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [explainMap, setExplainMap] = useState<
    Record<string, { explanation: string; loading: boolean }>
  >({});
  const [evalAnswers, setEvalAnswers] = useState<Record<string, string>>({});
  const [examTab, setExamTab] = useState<
    "lecture" | "dictee" | "evaluation" | "competition" | "langue"
  >("lecture");
  const [badges, setBadges] = useState<string[]>([]);

  // Dynamic Connection Manager (Offline/Online state synchronization)
  const [offlineOverride, setOfflineOverride] = useState<boolean>(() => {
    return localStorage.getItem("jugurtha_offline_forced") === "true";
  });
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (localStorage.getItem("jugurtha_offline_forced") === "true")
      return false;
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      if (!offlineOverride) {
        setIsOnline(true);
        showMascotMsg(
          "Connexion Internet rétablie avec succès ! Bon travail ! 🌐✨",
        );
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      showMascotMsg(
        "Connexion Internet perdue ! Mode hors-ligne activé automatiquement. Les leçons restent consultables librement. 🔌📖",
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [offlineOverride]);

  const toggleForceOffline = (forceOffline: boolean) => {
    setOfflineOverride(forceOffline);
    localStorage.setItem("jugurtha_offline_forced", String(forceOffline));
    setIsOnline(
      forceOffline
        ? false
        : typeof navigator !== "undefined"
          ? navigator.onLine
          : true,
    );
    if (forceOffline) {
      showMascotMsg(
        "Mode hors-ligne complet (Concentration Énergie) activé ! 🔌 Tu peux étudier sans distractions et lire les leçons !",
      );
    } else {
      if (typeof navigator !== "undefined" && navigator.onLine) {
        showMascotMsg("Retour en direct ! Te voilà connecté à nouveau. 🌐🚀");
      } else {
        showMascotMsg(
          "Mode Concentration désactivé, mais ta connexion Wi-Fi/Réseau semble éteinte physiquement. 🔌",
        );
      }
    }
  };

  // --- AI Persistence Caching Helpers ---
  const getCachedLexique = (word: string) => {
    try {
      const cacheStr = localStorage.getItem("jugurtha_ai_lexique_cache");
      if (cacheStr) {
        const cache = JSON.parse(cacheStr);
        return cache[word.toLowerCase().trim()];
      }
    } catch (e) {
      console.error("Cache read error:", e);
    }
    return null;
  };

  const setCachedLexique = (
    word: string,
    data:
      | { definition: string; example: string }
      | { Word: string; def: string; ex: string },
  ) => {
    try {
      const cacheStr =
        localStorage.getItem("jugurtha_ai_lexique_cache") || "{}";
      const cache = JSON.parse(cacheStr);
      const key = word.toLowerCase().trim();
      const def =
        "definition" in data ? (data as any).definition : (data as any).def;
      const ex = "example" in data ? (data as any).example : (data as any).ex;
      cache[key] = { definition: def, example: ex };
      localStorage.setItem("jugurtha_ai_lexique_cache", JSON.stringify(cache));
    } catch (e) {
      console.error("Cache write error:", e);
    }
  };

  const getCachedFeedback = (type: string, text: string) => {
    try {
      const cacheStr = localStorage.getItem("jugurtha_ai_feedback_cache");
      if (cacheStr) {
        const cache = JSON.parse(cacheStr);
        const key = `${type}_${text.trim().toLowerCase()}`;
        return cache[key];
      }
    } catch (e) {
      console.error("Feedback cache read error:", e);
    }
    return null;
  };

  const setCachedFeedback = (type: string, text: string, data: any) => {
    try {
      const cacheStr =
        localStorage.getItem("jugurtha_ai_feedback_cache") || "{}";
      const cache = JSON.parse(cacheStr);
      const key = `${type}_${text.trim().toLowerCase()}`;
      cache[key] = data;
      localStorage.setItem("jugurtha_ai_feedback_cache", JSON.stringify(cache));
    } catch (e) {
      console.error("Feedback cache write error:", e);
    }
  };

  const getCachedExplanation = (questionKey: string, selectedValue: string) => {
    try {
      const cacheStr = localStorage.getItem("jugurtha_ai_explain_cache");
      if (cacheStr) {
        const cache = JSON.parse(cacheStr);
        const key = `${questionKey}_${String(selectedValue).toLowerCase().trim()}`;
        return cache[key];
      }
    } catch (e) {
      console.error("Explain cache read error:", e);
    }
    return null;
  };

  const setCachedExplanation = (
    questionKey: string,
    selectedValue: string,
    explanation: string,
  ) => {
    try {
      const cacheStr =
        localStorage.getItem("jugurtha_ai_explain_cache") || "{}";
      const cache = JSON.parse(cacheStr);
      const key = `${questionKey}_${String(selectedValue).toLowerCase().trim()}`;
      cache[key] = explanation;
      localStorage.setItem("jugurtha_ai_explain_cache", JSON.stringify(cache));
    } catch (e) {
      console.error("Explain cache write error:", e);
    }
  };

  // AI Diagnostic
  const [aiFeedback, setAiFeedback] = useState<{
    portrait?: string;
    animal?: string;
    redaction?: string;
    redaction_seyes?: string;
    redaction_seyes_syntaxe?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem("jugurtha_ai_feedback_state");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "jugurtha_ai_feedback_state",
        JSON.stringify(aiFeedback),
      );
    } catch (e) {
      console.error("Failed to sync aiFeedback state to local storage:", e);
    }
  }, [aiFeedback]);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lexiqueInfo, setLexiqueInfo] = useState<{
    word: string;
    def: string;
    ex: string;
  } | null>(null);
  const [isLexiqueLoading, setIsLexiqueLoading] = useState(false);

  const handleLexiqueLookup = async (word: string) => {
    if (word) {
      handleAssistantLookup(word);
    }
  };

  const diagnoseWithAI_Seyes = async () => {
    const text = dossierAnswers.redaction_seyes;
    if (!text || text.length < 5) {
      showMascotMsg("Écris un peu plus avant de demander l'avis de l'IA ! ✨");
      return;
    }

    // Cache-first check
    const cached = getCachedFeedback("redaction_seyes", text);
    if (cached) {
      setAiFeedback((prev) => ({
        ...prev,
        redaction_seyes: cached.feedback,
        redaction_seyes_syntaxe: cached.syntaxe,
      }));
      showMascotMsg(
        "L'IA a retrouvé ton analyse Seyes précédente ! 🧠✨ (Mode mémoire 💾)",
      );
      return;
    }

    if (!isOnline) {
      showMascotMsg(
        "🔌 L'IA d'analyse d'écriture Seyes nécessite une connexion Internet !",
      );
      return;
    }

    setIsAiLoading(true);
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "redaction_seyes" }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      setCachedFeedback("redaction_seyes", text, data);
      setAiFeedback((prev) => ({
        ...prev,
        redaction_seyes: data.feedback,
        redaction_seyes_syntaxe: data.syntaxe,
      }));
      showMascotMsg(
        "L'IA a analysé ta rédaction et te propose des pistes d'amélioration ! 🧠✨",
      );
    } catch (error) {
      console.error("AI Error:", error);
      showMascotMsg("Désolé, l'IA se repose un peu... Réessaie plus tard ! 😴");
    } finally {
      setIsAiLoading(false);
    }
  };

  const shuffledVocabOptions = useMemo(() => {
    const f = FICHES[currentFicheId];
    if (!f || !f.vocabOptions) return {};
    const result: Record<string, string[]> = {};
    Object.keys(f.vocabOptions).forEach((word) => {
      result[word] = shuffleArray(f.vocabOptions![word]);
    });
    return result;
  }, [currentFicheId]);

  const [shuffledDossier, setShuffledDossier] = useState<any>(() => {
    const f = FICHES[1];
    if (f && f.dossierContent) {
      return {
        words: f.dossierContent.cloze
          ? shuffleArray(f.dossierContent.cloze.words)
          : [],
        reconstitution: f.dossierContent.reconstitution
          ? shuffleArray(f.dossierContent.reconstitution)
          : [],
        dialogue: f.dossierContent.dialogue
          ? shuffleArray(f.dossierContent.dialogue)
          : [],
      };
    }
    return null;
  });
  const [vignettes, setVignettes] = useState<Record<number, any[]>>({});
  const [themeFilter, setThemeFilter] = useState<string>("all");

  // --- Retry & Dictation State ---
  const [exerciseAttempts, setExerciseAttempts] = useState<
    Record<string, number>
  >({});
  const [dictationAnswers, setDictationAnswers] = useState<
    Record<string, string>
  >({});
  const [vocabAnswers, setVocabAnswers] = useState<Record<string, string>>({});

  const canRetry = (activityKey: string) =>
    (exerciseAttempts[activityKey] || 0) < 3;
  const incrementAttempt = (activityKey: string) => {
    setExerciseAttempts((prev) => ({
      ...prev,
      [activityKey]: (prev[activityKey] || 0) + 1,
    }));
  };

  const playWord = (word: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = langueActive === "en" ? "en-US" : "fr-FR";
    utterance.rate = 0.8;
    selectFrenchVoice(utterance);
    window.speechSynthesis.speak(utterance);
  };

  // Custom Theme Colors
  const [customPrimary, setCustomPrimary] = useState(
    () => localStorage.getItem("customPrimary") || "#FF6B35",
  );
  const [customAccent, setCustomAccent] = useState(
    () => localStorage.getItem("customAccent") || "#06D6A0",
  );
  const [readingFont, setReadingFont] = useState(
    () => localStorage.getItem("readingFont") || "serif",
  );
  const [showSettings, setShowSettings] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Android Mobile Emulator States
  const [isAndroidFrameEnabled, setIsAndroidFrameEnabled] = useState(false);
  const [androidOrientation, setAndroidOrientation] = useState<
    "portrait" | "landscape"
  >("portrait");
  const [androidColor, setAndroidColor] = useState("#1E293B"); // Slate base color
  const [androidNetworkIsOffline, setAndroidNetworkIsOffline] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState("12:00");

  useEffect(() => {
    const updateSimTime = () => {
      const d = new Date();
      setSimulatedTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      );
    };
    updateSimTime();
    const iv = setInterval(updateSimTime, 30000);
    return () => clearInterval(iv);
  }, []);

  const [showProgressDetail, setShowProgressDetail] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("isDarkMode") === "true",
  );

  const getExerciseStats = () => {
    const evalFiches = Object.values(FICHES).filter(
      (f) => f.evaluation && f.evaluation.length > 0,
    );
    const totalEvals = evalFiches.length;
    const completedEvals = evalFiches.filter(
      (f) => scores[f.id] !== undefined,
    ).length;

    const dictationFiches = Object.values(FICHES).filter(
      (f) => f.dictation && f.dictation.words && f.dictation.words.length > 0,
    );
    const totalDictations = dictationFiches.length;
    const completedDictations = dictationFiches.filter(
      (f) => dictationAnswers[`submitted_${f.id}`] === "true",
    ).length;

    const dossierActiveFiches = Object.values(FICHES).filter(
      (f) => f.dossierContent,
    );
    const totalDossiers = dossierActiveFiches.length;
    const completedDossiers = dossierActiveFiches.filter((f) => {
      const keysSuffix = `fiche_${f.id}_`;
      return Object.keys(dossierAnswers).some((k) => k.startsWith(keysSuffix));
    }).length;

    const totalWeightedExercises = totalEvals + totalDictations + totalDossiers;
    const completedWeightedExercises =
      completedEvals + completedDictations + completedDossiers;

    const percent =
      totalWeightedExercises > 0
        ? Math.round(
            (completedWeightedExercises / totalWeightedExercises) * 100,
          )
        : 0;

    return {
      totalEvals,
      completedEvals,
      totalDictations,
      completedDictations,
      totalDossiers,
      completedDossiers,
      percent,
      totalWeightedExercises,
      completedWeightedExercises,
    };
  };

  useEffect(() => {
    const handleBeforePrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforePrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforePrompt);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("readingFont", readingFont);
  }, [readingFont]);

  useEffect(() => {
    localStorage.setItem("readingFontSize", String(readingFontSize));
  }, [readingFontSize]);

  useEffect(() => {
    localStorage.setItem("readingLineHeight", readingLineHeight);
  }, [readingLineHeight]);

  useEffect(() => {
    localStorage.setItem("readingTextColor", readingTextColor);
  }, [readingTextColor]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", customPrimary);
    localStorage.setItem("customPrimary", customPrimary);
  }, [customPrimary]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", customAccent);
    localStorage.setItem("customAccent", customAccent);
  }, [customAccent]);

  useEffect(() => {
    const currentFiche = FICHES[currentFicheId];
    if (currentFiche && currentFiche.dossierContent) {
      setShuffledDossier({
        words: currentFiche.dossierContent.cloze
          ? shuffleArray(currentFiche.dossierContent.cloze.words)
          : [],
        reconstitution: currentFiche.dossierContent.reconstitution
          ? shuffleArray(currentFiche.dossierContent.reconstitution)
          : [],
        dialogue: currentFiche.dossierContent.dialogue
          ? shuffleArray(currentFiche.dossierContent.dialogue)
          : [],
      });
    } else {
      setShuffledDossier(null);
    }
  }, [currentFicheId]);

  // Lecture automatique de la dictée interactive lorsque l'élève accède à la dictée ou change de fiche
  useEffect(() => {
    const isExamDictation = currentPage === "exam" && examTab === "dictee";
    const isDossierDictation =
      currentPage === "dossier" && activeDossierActivity === 1;

    if (isExamDictation || isDossierDictation) {
      const timer = setTimeout(() => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const dictStr = FICHES[currentFicheId]?.dictation?.text || "";
        const words = FICHES[currentFicheId]?.dictation?.words || [];

        // On remplace les trous "__" par les mots corrects pour une lecture fluide et naturelle de la dictée complète
        let spokenText = dictStr;
        words.forEach((w) => {
          spokenText = spokenText.replace("__", w);
        });

        if (spokenText) {
          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.lang = langueActive === "en" ? "en-US" : "fr-FR";
          utterance.rate = 0.75; // Vitesse lente adaptée aux dictées scolaires
          selectFrenchVoice(utterance);
          window.speechSynthesis.speak(utterance);
          showMascotMsg(
            langueActive === "en"
              ? "Reading full dictation... Fill in the missing words! 🎧✍️"
              : "Lecture de la dictée complète... Écris les mots manquants ! 🎧✍️",
          );
        }
      }, 600); // Délai après transition pour un effet propre

      return () => clearTimeout(timer);
    }
  }, [currentPage, examTab, activeDossierActivity, currentFicheId]);

  // Flashcard States
  const [selectedVocabWord, setSelectedVocabWord] = useState<string | null>(
    null,
  );
  const [vocabData, setVocabData] = useState<
    Record<string, { definition: string; example: string }>
  >(() => {
    try {
      const savedStr = localStorage.getItem("jugurtha_ai_vocab_cache");
      return savedStr ? JSON.parse(savedStr) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "jugurtha_ai_vocab_cache",
        JSON.stringify(vocabData),
      );
    } catch (e) {
      console.error("Failed to sync vocab cache to local storage:", e);
    }
  }, [vocabData]);

  const [isVocabLoading, setIsVocabLoading] = useState(false);

  const fetchVocabDetails = async (word: string) => {
    if (vocabData[word] && !vocabData[word].definition.startsWith("⚠️")) return;

    // Cache-first check
    const cached = getCachedLexique(word);
    if (cached) {
      setVocabData((prev) => ({
        ...prev,
        [word]: { definition: cached.definition, example: cached.example },
      }));
      return;
    }

    if (!isOnline) {
      setVocabData((prev) => ({
        ...prev,
        [word]: {
          definition:
            "⚠️ Mode hors-ligne : définition indisponible sans connexion Internet.",
          example:
            "Activez votre connexion pour accéder à l'explication complète de la mascotte.",
        },
      }));
      showMascotMsg("🔌 Le vocabulaire animé nécessite d'être en ligne !");
      return;
    }

    setIsVocabLoading(true);
    try {
      const response = await fetch("/api/lexique-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) throw new Error("API error");
      const parsed = await response.json();

      setCachedLexique(word, parsed);
      setVocabData((prev) => ({ ...prev, [word]: parsed }));
    } catch (error) {
      console.error("Vocab AI Error:", error);
      setVocabData((prev) => ({
        ...prev,
        [word]: {
          definition: "Désolé, je ne trouve pas la définition. Réessaie !",
          example: "",
        },
      }));
    } finally {
      setIsVocabLoading(false);
    }
  };

  const speakWord = (word: string) => {
    if (!window.speechSynthesis) {
      showMascotMsg(
        langueActive === "en"
          ? "Oops! Your browser doesn't support speech synthesis. ✨"
          : "Zut ! Ton navigateur ne permet pas de lire la voix. ✨",
      );
      return;
    }
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = langueActive === "en" ? "en-US" : "fr-FR";
    utterance.rate = 0.8; // Slightly slower for better clarity for kids
    utterance.pitch = 1.0;
    selectFrenchVoice(utterance);
    window.speechSynthesis.speak(utterance);
  };

  const generateDossierWithAI = async () => {
    // Cache-first check: Let's see if we have cached dossiers in localStorage
    try {
      const cachedDossiersStr = localStorage.getItem(
        "jugurtha_ai_dossier_cache",
      );
      if (cachedDossiersStr) {
        const cachedDossiers = JSON.parse(cachedDossiersStr);
        if (cachedDossiers[currentFicheId]) {
          const parsed = cachedDossiers[currentFicheId];
          FICHES[currentFicheId].dossierContent = parsed;
          setShuffledDossier({
            words: shuffleArray(parsed.cloze.words),
            reconstitution: shuffleArray(parsed.reconstitution),
            dialogue: shuffleArray(parsed.dialogue || []),
          });
          showMascotMsg(
            "Les activités de ton dossier ont été restaurées depuis le cache local ! 📝✨",
          );
          return;
        }
      }
    } catch (e) {
      console.error("Failed to read cached dossiers:", e);
    }

    if (!isOnline) {
      showMascotMsg(
        "🔌 Mode hors-ligne actif. La génération de nouvelles activités par IA n'est pas possible sans réseau !",
      );
      return;
    }
    setIsGeneratingDossier(true);
    try {
      const currentFiche = FICHES[currentFicheId];
      const response = await fetch("/api/dossier-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentFiche.text }),
      });

      if (!response.ok) throw new Error("API error");
      const parsed = await response.json();

      // Save to cache
      try {
        const cachedDossiersStr =
          localStorage.getItem("jugurtha_ai_dossier_cache") || "{}";
        const cachedDossiers = JSON.parse(cachedDossiersStr);
        cachedDossiers[currentFicheId] = parsed;
        localStorage.setItem(
          "jugurtha_ai_dossier_cache",
          JSON.stringify(cachedDossiers),
        );
      } catch (e) {
        console.error("Failed to write to dossier cache:", e);
      }

      FICHES[currentFicheId].dossierContent = parsed;
      setShuffledDossier({
        words: shuffleArray(parsed.cloze.words),
        reconstitution: shuffleArray(parsed.reconstitution),
        dialogue: shuffleArray(parsed.dialogue || []),
      });
      showMascotMsg("Les activités de ton dossier sont prêtes ! 📝✨");
    } catch (error) {
      console.error("Dossier Generation Error:", error);
      showMascotMsg(
        "L'IA a eu un petit problème... Réessaie dans un instant ! 🤖",
      );
    } finally {
      setIsGeneratingDossier(false);
    }
  };

  const diagnoseWithAI = async (type: "portrait" | "animal" | "redaction") => {
    const text =
      type === "redaction" ? evalAnswers.redaction : dossierAnswers[type];
    if (!text || text.length < 10) {
      showMascotMsg("Écris un peu plus avant de demander l'avis de l'IA ! ✨");
      return;
    }

    // Cache-first check
    const cached = getCachedFeedback(type, text);
    if (cached) {
      setAiFeedback((prev) => ({ ...prev, [type]: cached.feedback }));
      showMascotMsg(
        "L'IA a retrouvé ton analyse précédente ! 🧠✨ (Mode miroir 💾)",
      );
      return;
    }

    if (!isOnline) {
      showMascotMsg(
        "🔌 Le diagnostic orthographique par IA requiert une connexion Internet active !",
      );
      return;
    }

    setIsAiLoading(true);
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      setCachedFeedback(type, text, data);
      setAiFeedback((prev) => ({ ...prev, [type]: data.feedback }));
      showMascotMsg("L'IA a terminé son analyse ! 🧠✨");
    } catch (error) {
      console.error("AI Error:", error);
      showMascotMsg("Désolé, l'IA se repose un peu... Réessaie plus tard ! 😴");
    } finally {
      setIsAiLoading(false);
    }
  };

  const [pedagogicalLevel, setPedagogicalLevel] = useState<1 | 2 | 3>(2);

  const COMMON_ANSWERS = {
    q1: "attentive",
    q2: "heureux",
    q3: "grande",
    q4: "délicieux",
  };

  const LVL2_Q2_ANSWERS = [
    "La bouchère",
    "Une danseuse",
    "La jardinière",
    "Une chanteuse",
    "La voisine",
  ];

  // OCR/Image States
  const [image, setImage] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [examDifficulty, setExamDifficulty] = useState<
    "facile" | "moyen" | "difficile" | null
  >(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(
      `jugurtha_data_${currentUser?.id || "guest"}`,
    );
    if (saved) {
      const data = JSON.parse(saved);
      setScores(data.scores || {});
      setBadges(data.badges || []);
      if (data.dictationAnswers) setDictationAnswers(data.dictationAnswers);
      if (data.vocabAnswers) setVocabAnswers(data.vocabAnswers);
      if (data.evalAnswers) setEvalAnswers(data.evalAnswers);
      if (data.dossierAnswers) setDossierAnswers(data.dossierAnswers);
      if (data.consolidatedAnswers)
        setConsolidatedAnswers(data.consolidatedAnswers);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `jugurtha_data_${currentUser.id || "guest"}`,
        JSON.stringify({
          scores,
          badges,
          dictationAnswers,
          vocabAnswers,
          evalAnswers,
          dossierAnswers,
          consolidatedAnswers,
        }),
      );
    }
  }, [
    scores,
    badges,
    currentUser,
    dictationAnswers,
    vocabAnswers,
    evalAnswers,
    dossierAnswers,
    consolidatedAnswers,
  ]);

  useEffect(() => {
    localStorage.setItem("jugurtha_homeworks", JSON.stringify(homeworks));
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem("jugurtha_custom_reading", customReadingText);
  }, [customReadingText]);

  useEffect(() => {
    localStorage.setItem(
      "jugurtha_personal_lexicon",
      JSON.stringify(personalLexicon),
    );
  }, [personalLexicon]);

  useEffect(() => {
    localStorage.setItem(
      "jugurtha_custom_fiche_texts",
      JSON.stringify(customFicheTexts),
    );
  }, [customFicheTexts]);

  useEffect(() => {
    localStorage.setItem(
      "fiche1_matching_pairs",
      JSON.stringify(matchingPairs),
    );
  }, [matchingPairs]);

  useEffect(() => {
    localStorage.setItem(
      "fiche1_verb_complete_answers",
      JSON.stringify(verbCompleteAnswers),
    );
  }, [verbCompleteAnswers]);

  useEffect(() => {
    localStorage.setItem("fiche1_verbs_checked", String(verbsChecked));
  }, [verbsChecked]);

  useEffect(() => {
    localStorage.setItem(
      "fiche1_character_selections",
      JSON.stringify(characterSelections),
    );
  }, [characterSelections]);

  useEffect(() => {
    localStorage.setItem(
      "fiche1_characters_checked",
      String(charactersChecked),
    );
  }, [charactersChecked]);

  const baseFiche =
    langueActive === "en"
      ? FICHES_EN[currentFicheId] || FICHES_EN[1]
      : FICHES[currentFicheId] || FICHES[1];
  const currentFiche = {
    ...baseFiche,
    text:
      customFicheTexts[currentFicheId] !== undefined
        ? customFicheTexts[currentFicheId]
        : baseFiche.text,
  };

  const resetAllProgress = () => {
    setScores({});
    setBadges([]);
    localStorage.removeItem("bbw_scores");
    localStorage.removeItem("bbw_badges");
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith("track_")) localStorage.removeItem(k);
    });
    localStorage.removeItem(`jugurtha_data_${currentUser?.id || "guest"}`);
    alert("Progression réinitialisée.");
    window.location.reload();
  };

  const handleLevelRecommendation = () => {
    const prevFicheId = currentFicheId - 1;
    if (scores[prevFicheId]) {
      const lastScore = scores[prevFicheId].total;
      if (lastScore < 10) setPedagogicalLevel(1);
      else if (lastScore < 15) setPedagogicalLevel(2);
      else setPedagogicalLevel(3);
    }
  };

  useEffect(() => {
    handleLevelRecommendation();
  }, [currentFicheId]);

  const isFicheLocked = (id: number) => {
    if (id <= 20) return false;
    return (scores[10]?.total || 0) < 12;
  };

  const handleFicheSelect = (id: number) => {
    if (isFicheLocked(id)) {
      showMascotMsg("🔒 Fiche verrouillée ! Réussis la fiche 10 d'abord.");
      return;
    }
    setCurrentFicheId(id);
    setExamDifficulty(null);
    setExamTab("lecture");
    showMascotMsg(`Fiche ${id} lancée ! ✨`);
  };

  const handleScoreSubmit = (score: number) => {
    setScores((prev) => ({
      ...prev,
      [currentFicheId]: { total: score, date: new Date().toISOString() },
    }));
    if (score >= 15 && !badges.includes(`Expert-${currentFicheId}`)) {
      setBadges((prev) => [...prev, `Expert-${currentFicheId}`]);
      showMascotMsg("🎊 Nouveau Badge débloqué ! 🏆");
    }
  };

  const fetchExplanation = async (
    questionKey: string,
    selectedValue: string,
    correctAnswer: string,
    questionText: string,
    contextTitle: string,
    questionType: string,
  ) => {
    setExplainMap((prev) => ({
      ...prev,
      [questionKey]: { explanation: "", loading: true },
    }));

    // Cache-first check
    const cached = getCachedExplanation(questionKey, selectedValue);
    if (cached) {
      setExplainMap((prev) => ({
        ...prev,
        [questionKey]: { explanation: cached, loading: false },
      }));
      return;
    }

    if (!isOnline) {
      const isCorrect =
        String(selectedValue).toLowerCase().trim() ===
        String(correctAnswer).toLowerCase().trim();
      const localExplain = isCorrect
        ? `🌟 Excellent ! C'est la bonne réponse ! Tu as bien compris le sens du texte. (Mode Hors-ligne 🔌)`
        : `🧐 Regarde bien : la réponse attendue était "${correctAnswer}". Relis attentivement le texte pour bien observer ce détail ! (Mode Hors-ligne 🔌)`;
      setExplainMap((prev) => ({
        ...prev,
        [questionKey]: { explanation: localExplain, loading: false },
      }));
      return;
    }
    try {
      const res = await fetch("/api/explain-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          selected: selectedValue,
          answer: correctAnswer,
          context: contextTitle,
          type: questionType,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setCachedExplanation(questionKey, selectedValue, data.explanation);
        setExplainMap((prev) => ({
          ...prev,
          [questionKey]: { explanation: data.explanation, loading: false },
        }));
      } else {
        throw new Error();
      }
    } catch (err) {
      const isCorrect =
        String(selectedValue).toLowerCase().trim() ===
        String(correctAnswer).toLowerCase().trim();
      const localExplain = isCorrect
        ? `🌟 Excellent ! C'est la bonne réponse complète ! Tu as bien compris le sens du texte. Continue comme ça, champion ! 💪✨`
        : `🧐 Regarde bien : la réponse attendue était "${correctAnswer}". Relis attentivement le texte de la fiche pour bien observer ce détail ! Courage, tu vas y arriver ! 📚🍀`;
      setExplainMap((prev) => ({
        ...prev,
        [questionKey]: { explanation: localExplain, loading: false },
      }));
    }
  };

  // Mascot Messages
  const showMascotMsg = (text: string) => {
    setMascotMsg({ text, show: true });
    setTimeout(() => setMascotMsg((prev) => ({ ...prev, show: false })), 4000);
  };

  // Unified safe print dispatcher
  const handlePrint = (messageAfter?: string) => {
    try {
      const isIframe = window.self !== window.top;
      if (isIframe) {
        showMascotMsg(
          langueActive === "en"
            ? "⚠️ Printing is restricted in the preview. Please click the top-right button (↗️ Open in new tab) to print your worksheets safely!"
            : "⚠️ L'impression directe est bloquée dans l'aperçu. Cliquez sur le bouton en haut à droite (↗️ Ouvrir dans un onglet) de l'écran pour imprimer librement !",
        );
      } else if (messageAfter) {
        showMascotMsg(messageAfter);
      }
      window.print();
    } catch (err) {
      console.warn("Print blocked or failed:", err);
      showMascotMsg(
        langueActive === "en"
          ? "⚠️ Printing is restricted. Please open the app in a new tab ↗️ to print worksheets and certificates!"
          : "⚠️ L'impression est bloquée. Veuillez ouvrir l'application dans un nouvel onglet ↗️ pour imprimer fiches et attestations !",
      );
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer > 0 && !isTrainingMode) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && !isTrainingMode) {
      setIsTimerRunning(false);
      showMascotMsg("⏰ Temps écoulé ! Vérifie tes réponses !");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, isTrainingMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Login Handlers
  const handleLogin = () => {
    // Random theme selection
    const themes = Object.keys(MASCOTS) as ThemeType[];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setCurrentTheme(randomTheme);

    if (loginMode === "student") {
      const student = STUDENTS.find(
        (s) => s.id === loginValue.padStart(4, "0"),
      );
      if (student) {
        setCurrentUser({ type: "student", id: student.id, name: student.name });
        setIsTimerRunning(true);
        showMascotMsg(`Bienvenue ${student.name} ! Prêt ? ✨`);
        // Automatic full screen display at start up (triggered on browser click flow)
        if (!document.fullscreenElement) {
          toggleFullscreen();
        }
      } else {
        showMascotMsg("Oups ! Vérifie ton numéro ! 🎨");
      }
    } else {
      if (loginValue === "prof2026") {
        setCurrentUser({ type: "prof", name: "M. Yahyaoui Nabil" });
        showMascotMsg("👨‍🏫 Bonjour Maître. Prêt pour la correction ?");
        // Automatic full screen display at start up
        if (!document.fullscreenElement) {
          toggleFullscreen();
        }
      } else {
        showMascotMsg("🔐 Mot de passe incorrect !");
      }
    }
  };

  const handleSaveDossier = () => {
    setShowDossierCheck(true);

    // Calculate actual score for Dossier
    let correct = 0;
    let total = 0;

    // Level 1 Adjectives (4 pts)
    [0, 1, 2, 3].forEach((i) => {
      total++;
      if (dossierAnswers[`lvl1_q1_${i}`] === ANSWERS_LVL1[i]) correct++;
    });

    // Activity Commune (4 pts)
    const activeCommonActivity = getCommonActivityForFiche(
      FICHES[currentFicheId]?.theme,
    );
    ["q1", "q2", "q3", "q4"].forEach((q, i) => {
      total++;
      const userKey = `fiche_${currentFicheId}_${q}`;
      const answer = activeCommonActivity.questions[i]?.answer || "";
      if (consolidatedAnswers[userKey] === answer) correct++;
    });

    const score = (correct / total) * 20;
    handleScoreSubmit(score);
    showMascotMsg(
      `Vérifions tes réponses... Score : ${score.toFixed(1)}/20 ! Beau travail ! 🌟`,
    );

    const dossierProgress = Math.min(
      100,
      Math.floor((Object.keys(dossierAnswers).length / 12) * 100),
    );
    setProgress(dossierProgress);
  };

  if (!currentUser) {
    const playCosmicChime = (type: "chime" | "laser" | "subtle") => {
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        if (type === "chime") {
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(
              0.001,
              ctx.currentTime + 0.5 + index * 0.08,
            );

            osc.start(ctx.currentTime + index * 0.07);
            osc.stop(ctx.currentTime + 1.2);
          });
        } else if (type === "laser") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(
            150,
            ctx.currentTime + 0.35,
          );
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } else {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch (e) {
        console.warn("AudioContext blocked or not supported:", e);
      }
    };

    const codeDBLines = [
      {
        num: "01",
        text: "// Configuration de la base OdysseeAudioDB",
        type: "comment",
      },
      { num: "02", text: 'const DB_NAME = "OdysseeAudioDB";', type: "const" },
      { num: "03", text: 'const DB_STORE = "enregistrements";', type: "const" },
      { num: "04", text: "const DB_VERSION = 1;", type: "const" },
      { num: "05", text: "", type: "empty" },
      { num: "06", text: "export async function initStorage() {", type: "fn" },
      {
        num: "07",
        text: "  return new Promise((resolve, reject) => {",
        type: "body",
      },
      {
        num: "08",
        text: "    const req = indexedDB.open(DB_NAME, DB_VERSION);",
        type: "body",
      },
      {
        num: "09",
        text: "    req.onupgradeneeded = (event) => {",
        type: "body",
      },
      {
        num: "10",
        text: "      const db = event.target.result;",
        type: "body",
      },
      {
        num: "11",
        text: "      if (!db.objectStoreNames.contains(DB_STORE)) {",
        type: "body",
      },
      {
        num: "12",
        text: "        db.createObjectStore(DB_STORE);",
        type: "body",
      },
      { num: "13", text: "      }", type: "body" },
      { num: "14", text: "    };", type: "body" },
      {
        num: "15",
        text: "    req.onsuccess = (e) => resolve(e.target.result);",
        type: "body",
      },
      {
        num: "16",
        text: "    req.onerror = (e) => reject(e.target.error);",
        type: "body",
      },
      { num: "17", text: "  });", type: "body" },
      { num: "18", text: "}", type: "fn" },
      { num: "19", text: "", type: "empty" },
      {
        num: "20",
        text: "export async function saveAudioBlob(key, audioBlob) {",
        type: "fn",
      },
      { num: "21", text: "  const db = await initStorage();", type: "body" },
      {
        num: "22",
        text: "  return new Promise((resolve, reject) => {",
        type: "body",
      },
      {
        num: "23",
        text: '    const txn = db.transaction(DB_STORE, "readwrite");',
        type: "body",
      },
      {
        num: "24",
        text: "    const store = txn.objectStore(DB_STORE);",
        type: "body",
      },
      {
        num: "25",
        text: "    const request = store.put(audioBlob, key);",
        type: "body",
      },
      {
        num: "26",
        text: '    request.onsuccess = () => resolve({ status: "success", key });',
        type: "body",
      },
      {
        num: "27",
        text: "    request.onerror = () => reject(request.error);",
        type: "body",
      },
      { num: "28", text: "  });", type: "body" },
      { num: "29", text: "}", type: "fn" },
    ];

    const codeAuthLines = [
      {
        num: "01",
        text: "// Validation des accès scolaires (0001 - 0020)",
        type: "comment",
      },
      { num: "02", text: "const TOTAL_ELEVES = 20;", type: "const" },
      {
        num: "03",
        text: "const STUDENTS_REGISTRY = Array.from({length: TOTAL_ELEVES}, (_, i) => ({",
        type: "const",
      },
      {
        num: "04",
        text: '  id: String(i + 1).padStart(4, "0"),',
        type: "body",
      },
      { num: "05", text: '  group: "CM1 - Élémentaire",', type: "body" },
      { num: "06", text: '  role: "student"', type: "body" },
      { num: "07", text: "}));", type: "body" },
      { num: "08", text: "", type: "empty" },
      {
        num: "09",
        text: "export function findAndValidateStudent(value) {",
        type: "fn",
      },
      {
        num: "10",
        text: '  const padded = value.trim().padStart(4, "0");',
        type: "body",
      },
      {
        num: "11",
        text: "  const student = STUDENTS_REGISTRY.find(s => s.id === padded);",
        type: "body",
      },
      { num: "12", text: "  if (!student) {", type: "body" },
      {
        num: "13",
        text: '    throw new Error("Numéro élève inconnu ! Revoir l\'appel.");',
        type: "body",
      },
      { num: "14", text: "  }", type: "body" },
      { num: "15", text: "  return {", type: "body" },
      { num: "16", text: "    isAuthenticated: true,", type: "body" },
      { num: "17", text: "    uid: student.id,", type: "body" },
      { num: "18", text: "    group: student.group", type: "body" },
      { num: "19", text: "  };", type: "body" },
      { num: "20", text: "}", type: "fn" },
    ];

    const codeAppLines = [
      {
        num: "01",
        text: "// Enregistreur de flux audio microphone",
        type: "comment",
      },
      {
        num: "02",
        text: "export async function recordVoiceSession() {",
        type: "fn",
      },
      {
        num: "03",
        text: "  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });",
        type: "body",
      },
      {
        num: "04",
        text: "  const recorder = new MediaRecorder(stream);",
        type: "body",
      },
      { num: "05", text: "  const chunks = [];", type: "body" },
      { num: "06", text: "", type: "empty" },
      {
        num: "07",
        text: "  recorder.ondataavailable = (e) => {",
        type: "body",
      },
      {
        num: "08",
        text: "    if (e.data.size > 0) chunks.push(e.data);",
        type: "body",
      },
      { num: "09", text: "  };", type: "body" },
      { num: "10", text: "", type: "empty" },
      { num: "11", text: "  recorder.onstop = async () => {", type: "body" },
      {
        num: "12",
        text: '    const audioBlob = new Blob(chunks, { type: "audio/mp3" });',
        type: "body",
      },
      {
        num: "13",
        text: "    const fileKey = `voc_cm1_${Date.now()}`;",
        type: "body",
      },
      {
        num: "14",
        text: "    await saveAudioBlob(fileKey, audioBlob);",
        type: "body",
      },
      {
        num: "15",
        text: '    console.log("🎙️ Audio correctement stocké dans IndexedDB !");',
        type: "body",
      },
      { num: "16", text: "  };", type: "body" },
      { num: "17", text: "", type: "empty" },
      { num: "18", text: "  recorder.start();", type: "body" },
      { num: "19", text: "  return recorder;", type: "body" },
      { num: "20", text: "}", type: "fn" },
    ];

    const currentCodeLines =
      activeCodeFile === "db"
        ? codeDBLines
        : activeCodeFile === "auth"
          ? codeAuthLines
          : codeAppLines;

    const customMascotQuotes = [
      "Bienvenue à bord, jeune astronaute ! 🚀 Saisis ton numéro pour lancer l'odyssée !",
      "Sais-tu que le mot 'Odyssée' vient d'un dictionnaire grec racontant un long voyage fantastique ? 🌌",
      "Débloque des fiches de lecture interactives de niveau CM1 grâce à ton code élève !",
      "Notre fusée est parée ! Taper un code valide te propulsera instantanément en classe.",
      "Prêt à soigner ton écriture et ton vocabulaire ? Faisons briller la langue française ensemble ! ✨",
    ];

    const handleFlipMascotQuote = () => {
      const idx = Math.floor(Math.random() * customMascotQuotes.length);
      setActiveMascotBubble(customMascotQuotes[idx]);
      playCosmicChime("subtle");
    };

    return (
      <div
        className={`min-h-screen flex flex-col justify-between bg-[#040612] text-slate-100 font-nunito relative overflow-hidden select-none`}
      >
        {/* INLINE CSS ANIMATIONS STYLE BLOCK */}
        <style>{`
          @keyframes levitate {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1.5deg); }
          }
          @keyframes orbit-lire {
            0% { transform: rotate(0deg) translate(130px) rotate(0deg); }
            100% { transform: rotate(360deg) translate(130px) rotate(-360deg); }
          }
          @keyframes orbit-ecrire {
            0% { transform: rotate(120deg) translate(135px) rotate(-120deg); }
            100% { transform: rotate(480deg) translate(135px) rotate(-480deg); }
          }
          @keyframes orbit-decouvrir {
            0% { transform: rotate(240deg) translate(140px) rotate(-240deg); }
            100% { transform: rotate(600deg) translate(140px) rotate(-600deg); }
          }
          @keyframes fire-stream {
            0%, 100% { transform: scaleY(1); opacity: 0.8; }
            50% { transform: scaleY(1.35) scaleX(1.05); opacity: 1; }
          }
          @keyframes space-nebula {
            0%, 100% { opacity: 0.25; transform: scale(1) translate(0px, 0px); }
            50% { opacity: 0.45; transform: scale(1.1) translate(15px, -10px); }
          }
        `}</style>

        {/* NEBULA BACKDROP DECORATIONS */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#060815] to-[#010206] pointer-events-none"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
          }}
        />
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute top-2/3 -right-20 w-96 h-96 rounded-full bg-emerald-500/5 blur-[110px] pointer-events-none"
          style={{ animation: "space-nebula 14s ease-in-out infinite" }}
        />

        {/* STARS TWINKLING DYNAMICALLY */}
        {Array.from({ length: 35 }).map((_, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white opacity-40 animate-pulse pointer-events-none"
            style={{
              left: `${(idx * 73 + 17) % 100}%`,
              top: `${(idx * 41 + 13) % 100}%`,
              width: `${idx % 3 === 0 ? 3 : idx % 2 === 0 ? 2 : 1}px`,
              height: `${idx % 3 === 0 ? 3 : idx % 2 === 0 ? 2 : 1}px`,
              animationDelay: `${idx * 0.3}s`,
              animationDuration: `${3 + (idx % 4)}s`,
            }}
          />
        ))}

        {/* HEADER BRANDING IN LAUNCH SCREEN */}
        <header className="max-w-7xl mx-auto w-full px-6 pt-6 flex items-center justify-between pointer-events-auto z-10">
          <div className="flex items-center gap-2">
            <span
              className="text-2xl animate-spin"
              style={{ animationDuration: "15s" }}
            >
              🛰️
            </span>
            <div>
              <span className="font-baloo text-xs font-black tracking-widest text-[#a5b4fc] uppercase">
                Orbit Station
              </span>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Jugurtha Educational Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Langue Toggle Switch */}
            <button
              onClick={() => {
                const targetLang = langueActive === "fr" ? "en" : "fr";
                // Call our global system to change is elegantly
                (window as any).basculerLangue(targetLang);
                playCosmicChime("chime");
              }}
              className="p-2 border border-slate-800 bg-[#0d1127]/60 hover:bg-[#161c3b]/80 text-[#818cf8] rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
              title="Changer de Langue / Toggle Language"
            >
              <span>🌐</span>
              <span>{langueActive.toUpperCase()}</span>
            </button>

            <button
              onClick={() => {
                playCosmicChime("subtle");
                toggleFullscreen();
              }}
              className="p-2 border border-slate-800 bg-[#0d1127]/60 hover:bg-[#161c3b]/80 text-indigo-200 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1.5"
              title="Fullscreen Mode"
            >
              {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
              <span className="hidden sm:inline font-bold">Plein Écran</span>
            </button>
            <button
              onClick={() => {
                playCosmicChime("subtle");
                setIsDarkMode(!isDarkMode);
              }}
              className="p-2 border border-slate-800 bg-[#0d1127]/60 hover:bg-[#161c3b]/80 text-amber-200 rounded-xl transition-all cursor-pointer text-xs"
              title="Toggle Theme Mode"
            >
              {isDarkMode ? (
                <Sun size={13} className="text-yellow-400" />
              ) : (
                <Moon size={13} className="text-indigo-400" />
              )}
            </button>
          </div>
        </header>

        {/* MAIN DUAL DISPLAY SPLIT CONTENT */}
        <main className="max-w-7xl mx-auto w-full px-6 py-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* LEFT COLUMN: JavaScript Code Terminal Suite */}
          <div className="lg:col-span-5 h-[480px] lg:h-[520px] flex flex-col justify-between">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-[#080a13]/90 border border-slate-800 rounded-3xl overflow-hidden h-full flex flex-col shadow-2xl shadow-indigo-950/40 relative"
            >
              {/* Window header decoration */}
              <div className="bg-[#0b0f20] px-4 py-3 border-b border-slate-900 flex items-center justify-between select-none shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="ml-3 text-[10px] font-mono tracking-wide text-slate-400 flex items-center gap-1">
                    <span>⚡ consol_engine.js</span>
                    <span className="text-indigo-400 font-bold animate-pulse">
                      • LIVE
                    </span>
                  </span>
                </div>
                {/* Tech chip details */}
                <span className="text-[9px] font-bold text-slate-600 tracking-wider font-mono bg-[#04060e] px-2 py-0.5 rounded-md uppercase">
                  JS-IDB Engine
                </span>
              </div>

              {/* IDE Code choosing tabs */}
              <div className="bg-[#090d1c] border-b border-indigo-950/20 px-3 py-1 flex gap-1 select-none shrink-0">
                <button
                  onClick={() => {
                    playCosmicChime("subtle");
                    setActiveCodeFile("db");
                  }}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeCodeFile === "db" ? "bg-[#0f152d] text-indigo-300 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"}`}
                >
                  📁 indexedDB.js
                </button>
                <button
                  onClick={() => {
                    playCosmicChime("subtle");
                    setActiveCodeFile("auth");
                  }}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeCodeFile === "auth" ? "bg-[#0f152d] text-emerald-300 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"}`}
                >
                  🛡️ validation.js
                </button>
                <button
                  onClick={() => {
                    playCosmicChime("subtle");
                    setActiveCodeFile("app");
                  }}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeCodeFile === "app" ? "bg-[#0f152d] text-[#a5b4fc] border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                  🎙️ audioCapture.js
                </button>
              </div>

              {/* Code viewer viewport */}
              <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] leading-relaxed text-slate-300 bg-[#060811]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCodeFile}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1"
                  >
                    {currentCodeLines.map((line) => (
                      <div
                        key={line.num}
                        className="grid grid-cols-[30px_1fr] hover:bg-slate-900/45 py-0.5 px-1 rounded transition-colors group"
                      >
                        <span className="text-slate-600 text-right pr-3 select-none text-[9px] group-hover:text-amber-500 transition-colors font-semibold">
                          {line.num}
                        </span>
                        <span className="whitespace-pre break-all">
                          {line.type === "comment" && (
                            <span className="text-emerald-500/85 italic font-medium">
                              {line.text}
                            </span>
                          )}
                          {line.type === "const" && (
                            <>
                              <span className="text-purple-400 font-bold">
                                const{" "}
                              </span>
                              {line.text
                                .replace(/^const\s+/, "")
                                .includes("=") ? (
                                <>
                                  <span className="text-[#93c5fd]">
                                    {
                                      line.text
                                        .replace(/^const\s+/, "")
                                        .split("=")[0]
                                    }
                                  </span>
                                  <span className="text-pink-400">=</span>
                                  <span className="text-amber-300">
                                    {
                                      line.text
                                        .replace(/^const\s+/, "")
                                        .split("=")[1]
                                    }
                                  </span>
                                </>
                              ) : (
                                line.text.replace(/^const\s+/, "")
                              )}
                            </>
                          )}
                          {line.type === "fn" && (
                            <>
                              <span className="text-purple-400 font-bold">
                                export async function{" "}
                              </span>
                              <span className="text-[#a5b4fc]">
                                {line.text.replace(
                                  "export async function ",
                                  "",
                                )}
                              </span>
                            </>
                          )}
                          {line.type === "body" && (
                            <span className="text-slate-300">
                              {/* Highlight key variables */}
                              {line.text.split(" ").map((word, wIdx) => {
                                if (word.includes("await"))
                                  return (
                                    <span
                                      key={wIdx}
                                      className="text-purple-400 font-bold"
                                    >
                                      await{" "}
                                    </span>
                                  );
                                if (word.includes("return"))
                                  return (
                                    <span
                                      key={wIdx}
                                      className="text-purple-400 font-bold"
                                    >
                                      return{" "}
                                    </span>
                                  );
                                if (word.includes("new"))
                                  return (
                                    <span
                                      key={wIdx}
                                      className="text-purple-400 font-bold"
                                    >
                                      new{" "}
                                    </span>
                                  );
                                if (word.includes("Promise"))
                                  return (
                                    <span
                                      key={wIdx}
                                      className="text-[#f7b731] font-semibold"
                                    >
                                      Promise
                                    </span>
                                  );
                                if (word.includes("throw"))
                                  return (
                                    <span
                                      key={wIdx}
                                      className="text-red-400 font-bold"
                                    >
                                      throw{" "}
                                    </span>
                                  );
                                if (word.includes("Error"))
                                  return (
                                    <span key={wIdx} className="text-red-400">
                                      Error
                                    </span>
                                  );
                                return word + " ";
                              })}
                            </span>
                          )}
                          {line.type === "empty" && (
                            <span className="block h-3" />
                          )}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Console status footer */}
              <div className="bg-[#05070e] px-4 py-2 border-t border-slate-900 flex items-center justify-between text-[9px] text-slate-500 font-mono shrink-0">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>DB Synchronisée : IndexedDB actif</span>
                </span>
                <span>
                  Uptime : {Math.floor(Date.now() / 150000) % 24}h{" "}
                  {Math.floor(Date.now() / 1000) % 60}m
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Interactive Space Rocket Launch Controls Zone */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[440px]">
            {/* INVISIBLE / SOFT ANIMATION WRAPPER FOR GENTLE ROCKET LEVEL ORBITING */}
            <div className="absolute w-full h-[320px] pointer-events-none flex items-center justify-center">
              {/* ORBIT TRACKS FOR FLOATING PILLS */}
              {isLudiqueActive && (
                <div className="absolute w-full h-full flex items-center justify-center opacity-30 select-none">
                  {/* Internal Ring 1 */}
                  <div className="absolute w-[260px] h-[260px] border border-dashed border-indigo-500/25 rounded-full" />
                  {/* Mid Ring 2 */}
                  <div className="absolute w-[270px] h-[270px] border border-dashed border-indigo-400/20 rounded-full" />
                  {/* Outer Ring 3 */}
                  <div className="absolute w-[280px] h-[280px] border border-dashed border-emerald-500/15 rounded-full" />
                </div>
              )}

              {/* ROCKET RENDER levitating in center */}
              <div
                className="absolute z-10 z-index"
                style={{ animation: "levitate 5s ease-in-out infinite" }}
              >
                <svg
                  width="120"
                  height="150"
                  viewBox="0 0 120 150"
                  fill="none"
                  className="drop-shadow-[0_15px_30px_rgba(59,130,246,0.3)]"
                >
                  {/* Rocket wings */}
                  <path
                    d="M40 110 L20 135 L44 130 Z"
                    fill="#3B82F6"
                    opacity="0.85"
                  />
                  <path
                    d="M80 110 L100 135 L76 130 Z"
                    fill="#3B82F6"
                    opacity="0.85"
                  />

                  {/* Rocket main fuselage */}
                  <path
                    d="M60 15 C40 50 38 100 40 125 L80 125 C82 100 80 50 60 15 Z"
                    fill="url(#rocketGrad)"
                  />

                  {/* Rocket nose cone */}
                  <path
                    d="M60 15 C52 30 48 45 44 55 L76 55 C72 45 68 30 60 15 Z"
                    fill="#EF4444"
                  />

                  {/* Porthole */}
                  <circle
                    cx="60"
                    cy="75"
                    r="13"
                    fill="#1E293B"
                    stroke="#94A3B8"
                    strokeWidth="2.5"
                  />
                  <circle cx="56" cy="71" r="5" fill="#E2E8F0" opacity="0.75" />

                  {/* Exhaust cone */}
                  <path d="M50 125 L45 133 L75 133 L70 125 Z" fill="#64748B" />

                  {/* Flame stream dynamic */}
                  <path
                    d="M50 134 C50 148 60 155 60 155 C60 155 70 148 70 134 Z"
                    fill="url(#fireGrad)"
                    style={{
                      animation: "fire-stream 1.5s ease-in-out infinite",
                      transformOrigin: "top center",
                    }}
                  />

                  {/* Gradient systems */}
                  <defs>
                    <linearGradient id="rocketGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#94A3B8" />
                    </linearGradient>
                    <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="35%" stopColor="#EF4444" />
                      <stop
                        offset="100%"
                        stopColor="#F59E0B"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* ORBITING COSMIC KEYWORDS pills (Lire - Écrire - Découvrir) */}
              <div className="absolute w-full h-full pointer-events-auto">
                <div
                  className="absolute left-1/2 top-1/2 -ml-[45px] -mt-[16px] text-center w-[90px] h-[32px] rounded-full border-2 border-[#818cf8]/40 bg-[#0f1124]/90 opacity-95 text-[10px] font-bold text-indigo-300 flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.25)] hover:scale-115 transition-all text-center select-none"
                  style={{ animation: "orbit-lire 10s linear infinite" }}
                >
                  🚀 LIRE
                </div>
                <div
                  className="absolute left-1/2 top-1/2 -ml-[45px] -mt-[16px] text-center w-[95px] h-[32px] rounded-full border-2 border-[#10b981]/40 bg-[#0f1124]/90 opacity-95 text-[10px] font-bold text-emerald-300 flex items-center justify-center shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:scale-115 transition-all text-center select-none"
                  style={{ animation: "orbit-ecrire 12s linear infinite" }}
                >
                  ✏️ ÉCRIRE
                </div>
                <div
                  className="absolute left-1/2 top-1/2 -ml-[50px] -mt-[16px] text-center w-[100px] h-[32px] rounded-full border-2 border-[#fb7185]/40 bg-[#0f1124]/90 opacity-95 text-[10px] font-bold text-rose-300 flex items-center justify-center shadow-[0_4px_14px_rgba(244,63,94,0.25)] hover:scale-115 transition-all text-center select-none"
                  style={{ animation: "orbit-decouvrir 14s linear infinite" }}
                >
                  🌌 DÉCOUVRIR
                </div>
              </div>
            </div>

            {/* MAIN CENTRAL INPUT CARD */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-[#0b0e22]/90 border-2 border-indigo-950 rounded-[40px] p-8 max-w-md w-full shadow-2xl relative backdrop-blur-md overflow-hidden z-20 mt-[260px] lg:mt-5"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-emerald-500 to-rose-500 opacity-80" />

              <div className="text-center mb-6 relative">
                <h1 className="font-baloo font-extrabold text-2xl tracking-wide bg-gradient-to-r from-white via-indigo-200 to-[#a5b4fc] bg-clip-text text-transparent flex items-center justify-center gap-1.5 leading-none">
                  🚀 L&apos;ODYSSÉE DES MOTS
                </h1>

                {/* Inclusive Subtitle with ID for potential external scripts */}
                <p
                  id="app-subtitle"
                  className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider mt-2.5 leading-tight select-none"
                >
                  {TextesInterface[langueActive].subtitle}
                </p>
                <div className="w-12 h-1.5 bg-emerald-500/20 rounded-full mx-auto mt-2" />
              </div>

              {/* INPUT CONTROLS GROUP */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    id="student-input"
                    type={loginMode === "student" ? "text" : "password"}
                    value={loginValue}
                    onChange={(e) => setLoginValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        playCosmicChime("laser");
                        handleLogin();
                      }
                    }}
                    placeholder={
                      loginMode === "student"
                        ? TextesInterface[langueActive].inputPlaceholder
                        : "Mot de passe professionnel"
                    }
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-800 focus:border-emerald-500 bg-[#050711] text-white outline-none text-center text-lg font-bold font-mono tracking-widest transition-all placeholder:text-slate-600 shadow-inner"
                    maxLength={loginMode === "student" ? 10 : 25}
                  />
                  {loginMode === "student" && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs opacity-30 select-none">
                      🔑
                    </span>
                  )}
                </div>

                {/* GREEN GRADIENT MAIN GO BUTTON */}
                <button
                  id="btn-submit"
                  onClick={() => {
                    playCosmicChime("chime");
                    handleLogin();
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-95 text-white font-baloo font-black py-4.5 rounded-2xl text-base uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/40 border border-emerald-400/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  <span>
                    {loginMode === "student"
                      ? TextesInterface[langueActive].btnEnter
                      : langueActive === "fr"
                        ? "Décoller l'Espace"
                        : "Launch Space"}
                  </span>
                </button>

                {/* TEACHER ACCEDER TOGGLERS */}
                <div className="text-center pt-3 border-t border-slate-900 flex justify-between items-center text-xs">
                  <button
                    id="teacher-link"
                    onClick={() => {
                      playCosmicChime("subtle");
                      setLoginMode(
                        loginMode === "student" ? "teacher" : "student",
                      );
                      setLoginValue("");
                    }}
                    className="text-[#9eaaff] font-bold hover:text-white transition-colors cursor-pointer"
                  >
                    {loginMode === "student"
                      ? TextesInterface[langueActive].teacherLink
                      : langueActive === "fr"
                        ? "← Retour élève"
                        : "← Student Back"}
                  </button>
                  <span className="text-slate-600 text-[10px] font-mono">
                    Jugurtha v4.0
                  </span>
                </div>
              </div>
            </motion.div>

            {/* HELPER FLOATING COGNITIVE MASCOT BUBBLE */}
            <AnimatePresence>
              {activeMascotBubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-1 right-2 lg:-right-4 px-4 py-3 bg-[#0d102c]/95 border-2 border-amber-500/35 rounded-2xl text-[11px] font-bold text-amber-100 max-w-xs shadow-2xl z-40 select-none flex flex-col gap-1 sm:bottom-[-20px]"
                >
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-mono text-amber-400/90 border-b border-amber-500/10 pb-1 mb-1">
                    <span>💡 Astrotte le Dino</span>
                    <button
                      onClick={() => setActiveMascotBubble(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="leading-snug">{activeMascotBubble}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* BOTTOM FULL STATION INTERACTIVE DOCK FOOTER */}
        <footer className="w-full bg-[#03050c]/80 border-t border-slate-900/60 p-4 relative z-20 no-print">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Quick school bio indicators */}
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-mono tracking-wide text-ash-500 text-slate-500 font-bold uppercase">
                ÉCOLE JUGURTHA • CM1 LECTURE & ORTHOGRAPHE INTÉGRALE
              </p>
            </div>

            {/* DOCK OPTIONS: MODE LUDIQUE || AUDIO || MASCOTS || IMPRIMER */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {/* Option 1: MODE LUDIQUE */}
              <button
                onClick={() => {
                  playCosmicChime("subtle");
                  setIsLudiqueActive(!isLudiqueActive);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer select-none ${
                  isLudiqueActive
                    ? "bg-indigo-950/50 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-slate-900/40 border-slate-800 text-slate-500"
                }`}
              >
                <span>⚙️ Mode Ludique</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${isLudiqueActive ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`}
                />
              </button>

              {/* Option 2: AUDIO */}
              <button
                onClick={() => {
                  playCosmicChime("laser");
                  setAudioEnabled(!audioEnabled);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer select-none ${
                  audioEnabled
                    ? "bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-slate-900/40 border-slate-800 text-slate-500"
                }`}
              >
                <span>🎮 Audio</span>
                {audioEnabled ? (
                  /* Audio equalizer dancing lines visual */
                  <div className="flex items-end gap-0.5 h-2 w-2 select-none">
                    <span className="w-0.5 bg-emerald-400 h-2 animate-pulse" />
                    <span
                      className="w-0.5 bg-emerald-400 h-1.5 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-0.5 bg-emerald-400 h-2.5 animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                ) : (
                  <span className="text-[10px]">🔇</span>
                )}
              </button>

              {/* Option 3: MASCOTS */}
              <button
                onClick={handleFlipMascotQuote}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 border border-slate-800 text-amber-200 hover:border-amber-500/40 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer select-none"
              >
                <span>☀️ Mascots</span>
                <span className="text-[11px] animate-bounce">🦖</span>
              </button>

              {/* Option 4: IMPRIMER LES RAPPORTS & FICHES (HIGHLIGHTED) */}
              <button
                id="btn-print-footer"
                onClick={() => {
                  playCosmicChime("chime");
                  setShowPrintModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-amber-950/20 border border-amber-300/30 cursor-pointer select-none"
              >
                {TextesInterface[langueActive].btnPrint}
              </button>
            </div>
          </div>
        </footer>

        {/* HIGH-FIDELITY PRINTABLE CENTRE STATION MODAL OVERLAY */}
        {showPrintModal && (
          <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                className="bg-[#111428] border-2 border-[#b45309] rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl relative font-sans"
              >
                {/* Header panel */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🖨️</span>
                    <div>
                      <h3 className="text-base font-black font-baloo text-amber-400 uppercase tracking-wider">
                        Station Universelle d&apos;Impression
                      </h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                        L&apos;Odyssée des Mots • Print Dispatcher
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      playCosmicChime("subtle");
                      setShowPrintModal(false);
                    }}
                    className="p-1 px-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-lg text-slate-400 transition-colors text-xs font-bold cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed font-semibold">
                  Générez et imprimez instantanément des fiches de devoirs pour
                  l&apos;école ou des rapports d&apos;évaluation. Prêt à être
                  imprimé directement sur papier A4 !
                </p>

                {/* Printable option entries */}
                <div className="space-y-3">
                  {[
                    {
                      id: "fiche4",
                      title: "🌸 Fiche de Lecture CM1 n°4 (Le Printemps)",
                      desc: "Questionnaire imprimable complet avec exercices de grammaire et jumbles.",
                      badge: "Activité Vedette",
                    },
                    {
                      id: "eval",
                      title: "✍️ Fiches de Dictées & Évaluations de Français",
                      desc: "Ensemble de lignes de cahier manuscrites et guides d'évaluation élèves.",
                      badge: "Exercice",
                    },
                    {
                      id: "scores",
                      title:
                        "📊 Tableau de Bord & Scores Scolaires Élémentaires",
                      desc: "Rapports collectifs compilant le progrès et le temps passé par élève.",
                      badge: "Rapport",
                    },
                    {
                      id: "cert",
                      title: "🏆 Certificat de réussite / Médaille Stellaire",
                      desc: "Modèle de diplôme à imprimer et distribuer aux élèves de 4ème année.",
                      badge: "Récompense",
                    },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      className="p-3 bg-[#0d1021] border border-slate-800 hover:border-amber-500/40 rounded-2xl transition-all hover:scale-[1.01] flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-100 uppercase font-mono">
                            {opt.title}
                          </span>
                          <span className="text-[7.5px] font-black uppercase text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-mono">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          playCosmicChime("chime");
                          handlePrint(
                            langueActive === "en"
                              ? "Preparing your worksheets for print... 🖨️"
                              : "Lancement de l'impression de la fiche / rapport... 🖨️",
                          );
                        }}
                        className="p-2 px-3 bg-amber-500 group-hover:bg-amber-400 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none shrink-0 cursor-pointer"
                      >
                        🖨️ IMPRIMER
                      </button>
                    </div>
                  ))}
                </div>

                {/* Print bottom help card */}
                <div className="mt-5 bg-[#0a0d1d] p-3 rounded-2xl border border-dashed border-slate-800 text-[10px] text-slate-500 leading-normal flex items-start gap-2 select-none">
                  <span className="text-sm">💡</span>
                  <p className="font-bold">
                    <span className="text-amber-400">Conseil :</span> configurez
                    l&apos;Orientation de votre imprimante en mode{" "}
                    <span className="text-slate-300">Portrait</span>, cochez{" "}
                    <span className="text-slate-300">
                      &quot;Imprimer les couleurs d&apos;arrière-plan&quot;
                    </span>{" "}
                    pour conserver les magnifiques décors d&apos;évaluation.
                  </p>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  const isEmbedRunningInSim =
    typeof window !== "undefined" &&
    window.location.search.includes("simMode=true");
  const isSimulatorOffline =
    typeof window !== "undefined" &&
    window.location.search.includes("offlineMode=true");

  if (isAndroidFrameEnabled && !isEmbedRunningInSim) {
    return (
      <div
        className={`fixed inset-0 z-[150] bg-[#0E131F] flex flex-col lg:flex-row items-center justify-center gap-8 p-6 overflow-y-auto font-nunito text-slate-100 ${isDarkMode ? "dark-mode" : ""}`}
      >
        {/* BACKGROUND DESK LAYER */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-[#0A0D1A] to-[#04060F] pointer-events-none" />

        {/* CONSOLE DE CONTRÔLE ANDROID (LEFT PANEL) */}
        <div className="w-full lg:w-[350px] bg-slate-900/90 border-2 border-slate-800 backdrop-blur-md p-6 rounded-[32px] text-white shadow-2xl space-y-5 shrink-0 z-10 animate-fadeIn select-none">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="text-3xl">🤖</span>
            <div>
              <h3 className="font-baloo text-xl font-black text-emerald-400 leading-tight">
                Émulateur Android
              </h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                L'Odyssée des Mots Jugurtha
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Project Status */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
              <span className="text-[9px] uppercase font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md inline-block">
                Fichiers Natifs OK
              </span>
              <p className="font-bold text-slate-200 mt-1">
                tn.jugurtha.odysseedesmots
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                Configuré avec Capacitor pour compiler en .apk natif.
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                Orientation de l'écran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAndroidOrientation("portrait")}
                  className={`py-2 px-3 border-2 rounded-xl text-xs font-black transition-all cursor-pointer ${androidOrientation === "portrait" ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"}`}
                >
                  📱 Portrait
                </button>
                <button
                  onClick={() => setAndroidOrientation("landscape")}
                  className={`py-2 px-3 border-2 rounded-xl text-xs font-black transition-all cursor-pointer ${androidOrientation === "landscape" ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"}`}
                >
                  📟 Paysage
                </button>
              </div>
            </div>

            {/* Bezel Colors */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                Couleur du Châssis
              </label>
              <div className="flex gap-2">
                {[
                  { name: "Noir Sidéral", hex: "#1e293b" },
                  { name: "Sable Doré (Kef)", hex: "#D97706" },
                  { name: "Vert Forêt", hex: "#059669" },
                  { name: "Violet Éclipse", hex: "#6366f1" },
                ].map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setAndroidColor(col.hex)}
                    title={col.name}
                    style={{ backgroundColor: col.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${androidColor === col.hex ? "border-white scale-110 shadow-lg" : "border-slate-800 hover:scale-105"}`}
                  />
                ))}
              </div>
            </div>

            {/* Network Toggle */}
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-mono">
                  Simuler Réseau
                </label>
                <span
                  className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${androidNetworkIsOffline ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"}`}
                >
                  {androidNetworkIsOffline ? "Hors-Ligne 🔴" : "Connecté 🟢"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Utile pour tester l'application dans les collines du Kef en
                situation de panne internet (cache PWA actif).
              </p>
              <button
                onClick={() =>
                  setAndroidNetworkIsOffline(!androidNetworkIsOffline)
                }
                className={`w-full py-2 rounded-xl text-[10px] font-black transition-all border-2 text-center uppercase tracking-wider cursor-pointer ${androidNetworkIsOffline ? "bg-amber-600/25 border-amber-500 text-amber-300" : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"}`}
              >
                {androidNetworkIsOffline
                  ? "🟢 Rétablir la Connexion"
                  : "🔴 Activer la panne réseau"}
              </button>
            </div>
          </div>

          {/* CLI Instructions */}
          <div className="pt-3 border-t border-slate-800">
            <h4 className="font-baloo text-xs font-black text-slate-200">
              Exportation Mobile Native
            </h4>
            <p className="text-[9px] text-slate-400 leading-relaxed font-medium mt-1 font-nunito">
              Pour exporter ce projet et construire un fichier <code>.apk</code>{" "}
              pour téléphones Android, lancez :
            </p>
            <pre className="p-2 bg-slate-950 rounded-xl text-[9px] text-emerald-400 font-mono overflow-x-auto whitespace-pre leading-tight border border-slate-800 mt-2">
              {`npm install
npm run build
npx cap add android
npx cap sync
npx cap open android`}
            </pre>
          </div>

          <button
            onClick={() => {
              setIsAndroidFrameEnabled(false);
              showMascotMsg("Retour au mode responsive ! 🖥️");
            }}
            className="w-full py-3 bg-red-600 hover:bg-red-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer text-center block text-white"
          >
            Quitter le mode Android
          </button>
        </div>

        {/* INTERACTIVE SMARTPHONE WRAPPER */}
        <div className="relative flex items-center justify-center z-10">
          <div
            className="transition-all duration-500 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative flex flex-col border-[14px] rounded-[55px] self-center overflow-hidden"
            style={{
              borderColor: androidColor,
              width: androidOrientation === "portrait" ? "390px" : "820px",
              height: androidOrientation === "portrait" ? "800px" : "410px",
              backgroundColor: "#000000",
              boxShadow: `0 0 32px ${androidColor}25`,
            }}
          >
            {/* Status Bar */}
            <div className="w-full h-8 bg-black text-white flex items-center justify-between px-6 text-[10px] font-bold select-none shrink-0 border-b border-white/5">
              <span>{simulatedTime}</span>
              {/* Notch camera hole */}
              <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-800/80 mx-auto" />
              <div className="flex items-center gap-1.5 shrink-0">
                {androidNetworkIsOffline ? (
                  <span className="text-amber-500 text-[8px] font-mono">
                    ✈️ HORS-LIGNE
                  </span>
                ) : (
                  <span className="text-emerald-400 text-[8px] font-mono">
                    📡 active_net
                  </span>
                )}
                <span>100% 🔋</span>
              </div>
            </div>

            {/* IFRAME FRAME TO EMBED APPLICATION SEGMENT */}
            <div
              className="w-full flex-1 bg-white relative overflow-hidden"
              style={{ borderRadius: "0 0 32px 32px" }}
            >
              <iframe
                src={`${window.location.origin}${window.location.pathname}?simMode=true${androidNetworkIsOffline ? "&offlineMode=true" : ""}`}
                className="w-full h-full border-0 select-text"
                title="Google AI Studio Android Emulator Core Screen"
              />
            </div>

            {/* Simulated hardware home gestural bar */}
            <div className="w-full h-4 bg-black flex items-center justify-center shrink-0">
              <div className="w-24 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen theme-${currentTheme} ${isDarkMode ? "dark-mode" : ""} font-nunito pb-20 relative overflow-x-hidden ${isEmbedRunningInSim ? "max-w-[420px] mx-auto shadow-inner border-x border-dashed border-slate-300 rounded-b-[40px]" : ""}`}
    >
      <div className="web-bg" />

      {/* Floating Android Simulator Trigger Button (Desktop-Only, Hidden when inside simulation frame) */}
      {!isEmbedRunningInSim && !isAndroidFrameEnabled && (
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            setIsAndroidFrameEnabled(true);
            showMascotMsg("Lancement de l'Émulateur Android en cours ! 🤖💻");
          }}
          className="fixed bottom-6 left-6 z-[100] hidden md:flex items-center gap-3 bg-slate-900 border-2 border-emerald-500 text-white px-5 py-3 rounded-full hover:bg-slate-950 hover:scale-105 duration-300 transition-all shadow-xl cursor-pointer no-print group select-none"
        >
          <span className="text-xl animate-bounce">🤖</span>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
              Simulateur Android
            </p>
            <p className="text-[7px] font-bold text-slate-400 uppercase leading-none mt-0.5">
              Lancer l'aperçu mobile
            </p>
          </div>
        </motion.div>
      )}

      {!isOnline && (
        <div className="sticky top-0 z-[120] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-center text-[10px] uppercase py-2.5 tracking-wider px-4 shadow-md flex items-center justify-center gap-2 select-none no-print">
          <span className="animate-pulse">🔌</span>
          <span>MODE HORS-LIGNE COMPLET ACTIVÉ</span>
          <span className="opacity-60">•</span>
          <span>
            Les leçons chargées restent consultables librement 📖 Jugurtha
          </span>
          <span className="opacity-60">•</span>
          <button
            onClick={() => toggleForceOffline(false)}
            className="bg-white text-amber-900 font-black px-3 py-1 rounded-full text-[9px] hover:bg-amber-50 active:scale-95 transition-all uppercase cursor-pointer"
          >
            {offlineOverride ? "Reconnecter" : "Actualiser"}
          </button>
        </div>
      )}

      {/* Mascot Component */}
      <div
        className="fixed bottom-6 right-6 z-[100] group cursor-pointer"
        onClick={() =>
          showMascotMsg(
            MASCOTS[currentTheme].msgs[Math.floor(Math.random() * 3)],
          )
        }
      >
        <AnimatePresence>
          {mascotMsg.show && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.9 }}
              className="absolute bottom-24 right-0 bg-[var(--card-bg)] border-2 p-4 rounded-2xl min-w-[200px] shadow-2xl"
              style={{ borderColor: "var(--primary)" }}
            >
              <p className="text-xs font-bold text-[var(--text)]">
                <span className="text-[var(--primary)] block mb-1 font-black uppercase text-[10px] tracking-widest">
                  {MASCOTS[currentTheme].name} :
                </span>
                {mascotMsg.text}
              </p>
              <div
                className="absolute -bottom-2 right-6 w-4 h-4 bg-[var(--card-bg)] border-b-2 border-r-2 rotate-45"
                style={{ borderColor: "var(--primary)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl drop-shadow-2xl group-hover:scale-110 transition-transform"
        >
          {MASCOTS[currentTheme].emoji}
        </motion.div>
      </div>

      {/* Floating Student Name Card (if logged in) */}
      {currentUser.type === "student" && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 no-print z-50">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative bg-[var(--card-bg)] backdrop-blur px-8 py-4 rounded-[32px] border-4 border-[var(--primary)]/30 transform rotate-[-4deg] shadow-2xl ring-8 ring-[var(--text)]/10"
          >
            <div className="absolute -top-3 -right-3 bg-[var(--accent)] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              ⭐
            </div>
            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest text-center mb-1">
              Session Élève
            </p>
            <p className="font-baloo text-xl font-black text-[var(--primary)] tracking-tight">
              {currentUser.name}
            </p>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="md:sticky top-0 z-50 bg-gradient-to-r from-[var(--primary)] to-[var(--purple)] text-white p-4 shadow-xl">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="font-baloo font-extrabold text-xl leading-none">
              🚀 L'ODYSSÉE DES MOTS
            </h1>
            <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">
              École Jugurtha Kef • 4ème C • M. YAHYAOUI Nabil
            </p>
          </div>

          <div className="flex-1 max-w-md w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search
                className="text-white/50 group-focus-within:text-white transition-colors"
                size={18}
              />
            </div>
            <input
              type="text"
              placeholder="Rechercher une fiche par titre ou thème..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && currentPage !== "exam") {
                  setCurrentPage("exam");
                  setExamDifficulty(null);
                }
              }}
              className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-2.5 pl-12 pr-10 text-sm font-bold placeholder:text-white/40 outline-none focus:bg-white/20 focus:border-white/40 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors"
                title="Effacer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{currentUser.name}</p>
              <button
                onClick={() => toggleForceOffline(!offlineOverride)}
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wide transition-all cursor-pointer ${
                  isOnline
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                    : "bg-amber-500/25 text-amber-200 border-amber-500/30 hover:bg-amber-500/40 animate-pulse"
                }`}
                title={
                  offlineOverride
                    ? "Désactiver le mode concentration hors-ligne"
                    : "Activer le mode concentration hors-ligne"
                }
              >
                {isOnline ? "● En Ligne 🌐" : "🔌 Hors-Ligne"}
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                const newMode = !isDarkMode;
                setIsDarkMode(newMode);
                localStorage.setItem("isDarkMode", String(newMode));
                showMascotMsg(
                  newMode
                    ? "Mode sombre activé ! 🌙😎"
                    : "Mode clair activé ! ☀️✨",
                );
              }}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors text-white flex items-center justify-center cursor-pointer"
              title={
                isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"
              }
            >
              {isDarkMode ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <button
              onClick={() => {
                setCurrentUser(null);
                window.location.reload();
              }}
              className="bg-[var(--text)]/10 hover:bg-[var(--text)]/20 p-2 rounded-xl transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="md:sticky top-[62px] z-40 bg-[var(--card-bg)] backdrop-blur-md border-b-2 border-[var(--border)] p-3 shadow-md no-print">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MASCOTS) as ThemeType[]).map((t) => (
              <button
                key={t}
                onClick={() => setCurrentTheme(t)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all border-2 ${currentTheme === t ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--bg-light)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]"}`}
              >
                {MASCOTS[t].emoji} {MASCOTS[t].name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isTrainingMode ? (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-850 rounded-full font-black text-xs border-2 border-green-300 shadow-sm">
                <span>🌿</span> Mode Entraînement (Sans Limite)
              </div>
            ) : (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${timer < 60 ? "bg-red-500 text-white animate-pulse" : "bg-[var(--bg-light)] text-[var(--primary)] shadow-inner border border-[var(--border)]"}`}
              >
                <Clock size={16} />
                {formatTime(timer)}
              </div>
            )}
            {currentPage === "exam" && examDifficulty && (
              <button
                onClick={() => {
                  setExamDifficulty(null);
                  setIsTimerRunning(false);
                  setTimer(1200);
                }}
                className="p-2.5 bg-[var(--bg-light)] text-[var(--text-muted)] rounded-full border border-[var(--border)] hover:text-[var(--primary)] transition-all shadow-lg"
                title="Changer de difficulté"
              >
                <RotateCcw size={18} />
              </button>
            )}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2.5 rounded-full shadow-lg transition-all ${audioEnabled ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-light)] text-[var(--text-muted)] border border-[var(--border)]"}`}
            >
              <Volume2
                size={20}
                className={audioEnabled ? "animate-pulse" : "opacity-50"}
              />
            </button>
            <button
              onClick={() =>
                handlePrint(
                  langueActive === "en"
                    ? "Opening Print Dialogue... 🖨️"
                    : "Ouverture du menu d'impression... 🖨️",
                )
              }
              className="p-2.5 bg-[var(--blue)] text-white rounded-full shadow-lg hover:bg-[var(--purple)] transition-all"
              title="Imprimer la page"
            >
              <Printer size={20} />
            </button>

            {/* 🌟 LE GROUPE DE BOUTONS FONCTIONNELS (Galerie, Profil, Recherche) */}
            <div className="flex items-center gap-3">
              {/* 📷 Bouton Galerie : Ouvrir le document d'appui visuel */}
              <button
                onClick={() => {
                  setModalGalerieOuverte(true);
                }}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-transform active:scale-95 focus:outline-none cursor-pointer"
                title="Afficher le document joint"
              >
                🖼️
              </button>

              {/* 👤 Bouton Profil : Voir la fiche de suivi de l'élève connecté */}
              <button
                onClick={() => {
                  setModalProfilOuverte(true);
                }}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-transform active:scale-95 focus:outline-none cursor-pointer"
                title="Mon profil élève"
              >
                👤
              </button>

              {/* 🔍 Bouton Recherche : Activer le filtre de recherche de fiches */}
              <button
                onClick={() => {
                  setBarreRechercheActive(!barreRechercheActive);
                  // Fait instantanément remonter le focus vers la barre de recherche principale en haut
                  const champRecherche =
                    document.querySelector('input[type="search"]') ||
                    document.querySelector('input[placeholder*="Rechercher"]');
                  if (champRecherche)
                    (champRecherche as HTMLInputElement).focus();
                }}
                className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center transition-all active:scale-95 focus:outline-none cursor-pointer ${
                  barreRechercheActive
                    ? "bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-900/50 scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
                title="Rechercher une épreuve"
              >
                🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Success Center */}
      {currentUser.type === "student" &&
        (() => {
          const stats = getExerciseStats();
          let motivationalMsg = "Prends ton envol ! 🚀";
          if (stats.percent === 100) {
            motivationalMsg =
              "Exceptionnel ! Tu as complété toute l'Aventure avec brio ! 👑🥇🏆";
          } else if (stats.percent >= 80) {
            motivationalMsg =
              "Impressionnant ! Tu es une véritable Étoile de la classe ! 🌟🎓";
          } else if (stats.percent >= 50) {
            motivationalMsg =
              "Formidable progression ! Continue comme ça, champion ! 🏆✨";
          } else if (stats.percent >= 25) {
            motivationalMsg =
              "Très bon rythme ! De plus en plus brillant ! 📚💡";
          } else if (stats.percent > 0) {
            motivationalMsg =
              "Excellent début ! Chaque pas t'emmène plus loin ! 🚀🌸";
          }

          return (
            <div className="max-w-[1200px] mx-auto px-6 py-4 no-print select-none">
              <div className="bg-[var(--card-bg)] rounded-[32px] p-5 shadow-lg border border-[var(--border)] transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white shadow-md shadow-[var(--primary)]/20">
                      <Trophy size={18} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-baloo text-lg font-black text-[var(--text)] leading-none flex items-center gap-1.5">
                        Mon Journal de Réussite
                        {stats.percent > 0 && (
                          <Sparkles
                            size={14}
                            className="text-yellow-500 animate-bounce"
                          />
                        )}
                      </h4>
                      <p className="text-[11px] font-bold text-[var(--text-muted)] mt-1 tracking-tight">
                        {motivationalMsg}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">
                        Progression
                      </span>
                      <span className="font-baloo text-xl font-black text-[var(--primary)]">
                        {stats.percent}%
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProgressDetail(!showProgressDetail);
                        showMascotMsg(
                          showProgressDetail
                            ? "Fermeture du tableau ! 📝"
                            : "Regarde tout ce que tu as accompli ! 🌟",
                        );
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-light)] border border-[var(--border)] text-[var(--text)] hover:text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all cursor-pointer"
                      title={
                        showProgressDetail
                          ? "Masquer les détails"
                          : "Afficher les détails de progression"
                      }
                    >
                      <motion.div
                        animate={{ rotate: showProgressDetail ? 180 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <ChevronRight size={16} className="rotate-90" />
                      </motion.div>
                    </button>
                  </div>
                </div>

                <div className="h-3 bg-[var(--bg-light)] border border-[var(--border)] rounded-full overflow-hidden shadow-inner relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percent}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--blue)] rounded-full"
                  />
                </div>

                <AnimatePresence>
                  {showProgressDetail && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 20,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5 mt-4 border-t-2 border-dashed border-[var(--border)] grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* 1. Examens */}
                        <div className="bg-[var(--bg-light)]/50 p-3.5 rounded-2xl border border-[var(--border)] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                              <Award size={15} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                                Examens
                              </span>
                              <div className="font-baloo text-base font-black text-[var(--text)] leading-none">
                                {stats.completedEvals} / {stats.totalEvals}
                              </div>
                            </div>
                          </div>
                          <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${stats.totalEvals > 0 ? (stats.completedEvals / stats.totalEvals) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* 2. Dictées */}
                        <div className="bg-[var(--bg-light)]/50 p-3.5 rounded-2xl border border-[var(--border)] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                              <Volume2 size={15} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                                Dictées
                              </span>
                              <div className="font-baloo text-base font-black text-[var(--text)] leading-none">
                                {stats.completedDictations} /{" "}
                                {stats.totalDictations}
                              </div>
                            </div>
                          </div>
                          <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-orange-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${stats.totalDictations > 0 ? (stats.completedDictations / stats.totalDictations) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* 3. Dossiers */}
                        <div className="bg-[var(--bg-light)]/50 p-3.5 rounded-2xl border border-[var(--border)] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                              <PenTool size={15} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                                Dossiers
                              </span>
                              <div className="font-baloo text-base font-black text-[var(--text)] leading-none">
                                {stats.completedDossiers} /{" "}
                                {stats.totalDossiers}
                              </div>
                            </div>
                          </div>
                          <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-purple-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${stats.totalDossiers > 0 ? (stats.completedDossiers / stats.totalDossiers) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* 4. Badges */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-3.5 rounded-2xl border border-amber-100 flex items-center gap-3 hover:scale-[1.02] transition-transform duration-300">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-sm shrink-0">
                            <Trophy size={20} />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                              Écussons
                            </span>
                            <div className="font-baloo text-md font-black text-amber-700 leading-tight">
                              {badges.length}{" "}
                              {badges.length > 1 ? "Badges" : "Badge"}
                            </div>
                            <span className="text-[9px] font-bold text-amber-600/70 block leading-none">
                              unlocked
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })()}

      {/* Navigation Tabs */}
      <nav className="max-w-[1200px] mx-auto px-4 py-4 no-print overflow-x-auto md:overflow-visible whitespace-nowrap scrollbar-hide">
        <div className="flex gap-3 justify-start md:justify-center items-center">
          <NavBtn
            active={currentPage === "exam"}
            onClick={() => setCurrentPage("exam")}
            icon={BookOpen}
          >
            Fiches
          </NavBtn>
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsHoveredDevoirs(true)}
            onMouseLeave={() => setIsHoveredDevoirs(false)}
          >
            <NavBtn
              active={currentPage === "homework"}
              onClick={() => setCurrentPage("homework")}
              icon={ClipboardCheck}
            >
              Devoirs
            </NavBtn>

            {/* 🌟 LE POP-UP DE SURVOL INTERACTIF (Aperçu rapide des devoirs) */}
            <AnimatePresence>
              {isHoveredDevoirs && (
                <motion.div
                  initial={{ opacity: 0, y: 15, x: "-50%", scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                  exit={{ opacity: 0, y: 15, x: "-50%", scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 w-64 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl z-50 text-white whitespace-normal block"
                >
                  {/* Flèche du pop-up */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-t border-l border-slate-800 rotate-45"></div>

                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 font-baloo">
                        Aperçu Journal de bord
                      </span>
                      <span className="text-[9px] bg-pink-950 text-pink-300 px-1.5 py-0.5 rounded-full font-bold">
                        {homeworks.length > 0
                          ? `${homeworks.length} Dev.`
                          : "2 Dev."}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-[144px] overflow-y-auto pr-1 scrollbar-thin">
                      {homeworks.length > 0 ? (
                        homeworks.slice(0, 3).map((hw) => (
                          <div
                            key={hw.id}
                            className="text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800/60 flex items-center gap-2"
                          >
                            <span>
                              {hw.typeObjectif === "soutien"
                                ? "🆘"
                                : hw.typeObjectif === "defi"
                                  ? "🚀"
                                  : "📘"}
                            </span>
                            <p className="truncate font-medium text-slate-300 flex-1">
                              {hw.title.replace(/^(🆘|🚀|📘)\s*/, "")}
                            </p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800/60 flex items-center gap-2">
                            <span>📘</span>
                            <p className="truncate font-medium text-slate-300 flex-1">
                              Lecture : Le Chapeau de Charlot
                            </p>
                          </div>
                          <div className="text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800/60 flex items-center gap-2">
                            <span>🆘</span>
                            <p className="truncate font-medium text-slate-300 flex-1">
                              Aide : Dictée vocale renforcée
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-[9px] text-center text-slate-500 pt-1 italic">
                      Laissez la souris ou cliquez pour ouvrir la fiche
                      complète.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavBtn
            active={currentPage === "dossier"}
            onClick={() => {
              setCurrentPage("dossier");
              showMascotMsg("C'est l'heure de réviser ! 📚");
            }}
            icon={PenTool}
          >
            Dossier
          </NavBtn>
          <NavBtn
            active={currentPage === "lexique"}
            onClick={() => setCurrentPage("lexique")}
            icon={Palette}
          >
            Lexique
          </NavBtn>
          <NavBtn
            active={currentPage === "cahier"}
            onClick={() => setCurrentPage("cahier")}
            icon={BookMarked}
          >
            Mon Cahier
          </NavBtn>
          <NavBtn
            active={currentPage === "succes"}
            onClick={() => {
              setCurrentPage("succes");
              showMascotMsg(
                "Bienvenue dans ton Panneau des Succès ! Admire tes badges d'expert ! 🏅✨",
              );
            }}
            icon={Award}
          >
            Mes Succès 🏅
          </NavBtn>
          <NavBtn
            active={currentPage === "presence"}
            onClick={() => setCurrentPage("presence")}
            icon={Users}
          >
            Présence
          </NavBtn>
          {currentUser.type === "prof" && (
            <NavBtn
              active={currentPage === "notes"}
              onClick={() => setCurrentPage("notes")}
              icon={ClipboardCheck}
            >
              Notes
            </NavBtn>
          )}
          <NavBtn
            active={currentPage === "classement"}
            onClick={() => setCurrentPage("classement")}
            icon={Trophy}
          >
            Classement
          </NavBtn>
          <NavBtn
            active={currentPage === "competition"}
            onClick={() => {
              setCurrentPage("competition");
              showMascotMsg(
                "Bienvenue dans l'arène de duel ! Prépare-toi à affronter tes camarades ! ⚔️🎮",
              );
            }}
            icon={Gamepad2}
          >
            Arène 1v1
          </NavBtn>
          <NavBtn
            active={currentPage === "diplomes"}
            onClick={() => {
              setCurrentPage("diplomes");
              showMascotMsg("Faisons un beau diplôme ! 🏆");
            }}
            icon={Award}
          >
            Diplôme
          </NavBtn>
          {currentUser.type === "prof" && (
            <NavBtn
              active={currentPage === "corrige"}
              onClick={() => setCurrentPage("corrige")}
              icon={Shield}
            >
              Espace Enseignant
            </NavBtn>
          )}
          <button
            onClick={toggleFullscreen}
            className="group relative flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 hover:bg-white/40"
            title="Plein Écran"
          >
            <div
              className={`p-2.5 rounded-xl transition-all duration-300 bg-white/20 text-[var(--text)] group-hover:scale-110`}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
              Plein Écran
            </span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="group relative flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 hover:bg-white/40"
          >
            <div
              className={`p-2.5 rounded-xl transition-all duration-300 bg-white/20 text-[var(--text)] group-hover:scale-110 group-hover:rotate-45`}
            >
              <Settings size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
              Design
            </span>
          </button>
          <button
            onClick={() => {
              setShowDownloadModal(true);
              showMascotMsg(
                "Installe l'application sur ton téléphone ou ta tablette pour réviser partout ! 📱✨",
              );
            }}
            className="group relative flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all duration-300 hover:bg-amber-500/10"
            title="Télécharger l'Appli"
          >
            <div className="p-2.5 rounded-xl transition-all duration-300 bg-amber-500 text-white group-hover:scale-110 shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center">
              <Download size={20} className="animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity font-baloo">
              Installer
            </span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-bg)] rounded-[40px] p-8 shadow-2xl max-w-sm md:max-w-md w-full border-4 border-[var(--primary)] text-[var(--text)] overflow-y-auto max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl">
                    <Palette size={24} />
                  </div>
                  <div>
                    <h3 className="font-baloo text-2xl font-black text-[var(--text)]">
                      Design de l'App
                    </h3>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                      Personnalise tes couleurs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Presets Subsection */}
                <div className="space-y-3">
                  <label className="font-black text-sm text-[var(--text)] block">
                    🎨 Thèmes Prédéfinis
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        name: "Classique",
                        primary: "#FF6B35",
                        accent: "#06D6A0",
                      },
                      {
                        name: "Royal Gold",
                        primary: "#3F51B5",
                        accent: "#FFC107",
                      },
                      {
                        name: "Forêt d'Afrique",
                        primary: "#1B4931",
                        accent: "#FF8A5B",
                      },
                      {
                        name: "Framboise",
                        primary: "#D81B60",
                        accent: "#00E676",
                      },
                      {
                        name: "Ciel d'Été",
                        primary: "#0288D1",
                        accent: "#7C4DFF",
                      },
                      {
                        name: "Mystique",
                        primary: "#512DA8",
                        accent: "#00E5FF",
                      },
                    ].map((p, idx) => {
                      const isSelected =
                        customPrimary === p.primary &&
                        customAccent === p.accent;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setCustomPrimary(p.primary);
                            setCustomAccent(p.accent);
                          }}
                          className={`group flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-md scale-[1.03]"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex gap-1.5 mb-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-sm block"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-sm block"
                              style={{ backgroundColor: p.accent }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                            {p.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <label className="font-black text-sm text-[var(--text)]">
                        Couleur Primaire
                      </label>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {customPrimary}
                      </span>
                    </div>
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-[var(--border)] overflow-hidden"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] italic leading-relaxed">
                    Cette couleur est utilisée pour les boutons principaux, le
                    menu et les titres importants.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <label className="font-black text-sm text-[var(--text)]">
                        Couleur d'Accent
                      </label>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {customAccent}
                      </span>
                    </div>
                    <input
                      type="color"
                      value={customAccent}
                      onChange={(e) => setCustomAccent(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-[var(--border)] overflow-hidden"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] italic leading-relaxed">
                    Utilisée pour les badges, les succès et les détails visuels
                    joyeux.
                  </p>
                </div>

                {/* Kids Font Selection Subsection */}
                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <label className="font-black text-sm text-[var(--text)] block">
                    📖 Police de lecture adaptée aux enfants
                  </label>
                  <p className="text-[10px] text-[var(--text-muted)] italic leading-relaxed">
                    Sélectionne une police spécialement optimisée pour faciliter
                    l'apprentissage, encourager le plaisir de lire et améliorer
                    le confort visuel.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {READING_FONTS.map((f) => {
                      const isSelected = readingFont === f.key;
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => setReadingFont(f.key)}
                          className={`group text-left p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_8px_16px_rgba(0,0,0,0.06)] scale-[1.02]"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`text-sm tracking-wide leading-tight mb-1 text-[var(--text)] ${f.class}`}
                          >
                            Abc
                          </span>
                          <div>
                            <p className="text-[10px] font-black text-[var(--text)] line-clamp-1">
                              {f.name}
                            </p>
                            <p className="text-[9px] text-[var(--text-muted)] line-clamp-1">
                              {f.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accessibility Options */}
                <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                  <label className="font-black text-sm text-[var(--text)] flex items-center gap-2">
                    <Settings size={16} className="text-[var(--primary)]" />♿
                    Options d'Accessibilité
                  </label>

                  {/* Dark mode switch */}
                  <div className="flex items-center justify-between p-3 bg-[var(--bg-light)] rounded-2xl border border-[var(--border)]">
                    <div>
                      <span className="font-extrabold text-xs text-[var(--text)] block">
                        🌙 Mode Sombre
                      </span>
                      <span className="text-[9px] text-[var(--text-muted)]">
                        Améliore le confort visuel
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newMode = !isDarkMode;
                        setIsDarkMode(newMode);
                        localStorage.setItem("isDarkMode", String(newMode));
                        showMascotMsg(
                          newMode
                            ? "Mode sombre activé ! 🌙😎"
                            : "Mode clair activé ! ☀️✨",
                        );
                      }}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center cursor-pointer ${isDarkMode ? "bg-[var(--accent)] justify-end" : "bg-gray-300 justify-start"}`}
                    >
                      <motion.div
                        layout
                        className="bg-white w-5 h-5 rounded-full shadow-md"
                      />
                    </button>
                  </div>

                  {/* Font size adjustment */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-[var(--text)]">
                        📏 Taille du texte
                      </span>
                      <span className="font-mono text-xs font-bold text-[var(--primary)] bg-[var(--bg-light)] px-2.5 py-0.5 rounded-lg border border-[var(--border)]">
                        {readingFontSize}px
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setReadingFontSize(Math.max(12, readingFontSize - 2))
                        }
                        className="w-10 h-10 rounded-xl bg-[var(--bg-light)] border-2 border-[var(--border)] font-black text-sm text-[var(--text)] hover:border-[var(--primary)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                      >
                        A-
                      </button>
                      <input
                        type="range"
                        min="12"
                        max="36"
                        step="1"
                        value={readingFontSize}
                        onChange={(e) =>
                          setReadingFontSize(parseInt(e.target.value, 10))
                        }
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-[var(--primary)]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setReadingFontSize(Math.min(36, readingFontSize + 2))
                        }
                        className="w-10 h-10 rounded-xl bg-[var(--bg-light)] border-2 border-[var(--border)] font-black text-sm text-[var(--text)] hover:border-[var(--primary)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* Line Spacing / Interligne */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-xs text-[var(--text)] block">
                      ↕️ Espacement des lignes (Interligne)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "leading-normal", name: "Étroit 📐" },
                        { key: "leading-relaxed", name: "Adapté 📝" },
                        { key: "leading-loose", name: "Aéré 📖" },
                      ].map((l) => {
                        const isSel = readingLineHeight === l.key;
                        return (
                          <button
                            key={l.key}
                            type="button"
                            onClick={() => setReadingLineHeight(l.key)}
                            className={`p-2 rounded-xl border-2 text-[10px] font-black uppercase text-center transition-all cursor-pointer ${
                              isSel
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                                : "border-[var(--border)] bg-[var(--bg-light)] text-[var(--text-muted)] hover:border-[var(--primary)]/50"
                            }`}
                          >
                            {l.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => {
                      setCustomPrimary("#FF6B35");
                      setCustomAccent("#06D6A0");
                      setReadingFont("serif");
                    }}
                    className="py-3 px-4 border-2 border-[var(--border)] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} className="inline mr-2" /> Reset
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="py-3 px-4 bg-[var(--primary)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 hover:scale-105 transition-all cursor-pointer text-center"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download app installer and guide modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowDownloadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl max-w-lg w-full border-4 border-amber-400 text-[var(--text)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDownloadModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Download size={32} className="animate-bounce" />
                </div>
                <h3 className="font-baloo text-3xl font-black text-amber-500">
                  Télécharger l'Appli 📱
                </h3>
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                  ÉCOLE JUGURTHA KEF — Version Mobile & PC
                </p>
              </div>

              <div className="space-y-6">
                {/* INTERACTIVE ANDROID SIMULATION BANNER */}
                <div className="p-4 rounded-[24px] bg-gradient-to-br from-indigo-500/5 to-purple-500/10 border-2 border-indigo-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="text-left space-y-1">
                    <span className="bg-indigo-100 text-indigo-800 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Exclusivité Mobile
                    </span>
                    <p className="font-baloo text-sm font-black text-indigo-950 mt-0.5">
                      Émulateur Android Intégré 🤖
                    </p>
                    <p className="text-[10px] text-indigo-900/70 font-bold leading-tight">
                      Visualise l'application sous forme de smartphone Android
                      réel.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAndroidFrameEnabled(true);
                      setShowDownloadModal(false);
                      showMascotMsg(
                        "Émulateur Android activé ! Amuse-toi bien ! 📱🤖",
                      );
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-slate-900 duration-300 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    Activer l'Aperçu Mobile
                  </button>
                </div>

                <p className="text-xs text-center leading-relaxed text-[var(--text-muted)] font-medium">
                  Installe l'application directement sur ton smartphone,
                  tablette ou ordinateur pour un accès ultra-rapide et un
                  confort de lecture optimal même sans navigateur ouvert !
                </p>

                {/* Direct PWA Install trigger if available */}
                {deferredPrompt ? (
                  <div className="bg-amber-50 p-5 rounded-3xl border-2 border-dashed border-amber-300 text-center space-y-3">
                    <p className="text-xs font-black text-amber-800">
                      🎉 Ton appareil est compatible pour l'installation rapide
                      !
                    </p>
                    <button
                      onClick={async () => {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === "accepted") {
                          setDeferredPrompt(null);
                          setShowDownloadModal(false);
                          showMascotMsg(
                            "Génial ! L'application est en cours d'installation ! 🎉🏫",
                          );
                        }
                      }}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/30 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download size={18} /> Installer l'App Maintenant 🚀
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 text-center text-xs text-blue-800 font-bold">
                    💡 Si le bouton d'installation automatique ne s'affiche pas,
                    suis les instructions simples ci-dessous selon ton appareil
                    :
                  </div>
                )}

                {/* Devices Grid Help Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Android / Windows / Chrome */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-dashed border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🤖</span>
                        <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest">
                          Android / Windows / Chrome
                        </h4>
                      </div>
                      <ol className="text-[11px] text-[var(--text-muted)] font-bold space-y-2 list-decimal pl-4 mt-2">
                        <li>
                          Ouvre le menu de ton navigateur{" "}
                          <span className="text-slate-700">
                            (les 3 points en haut à droite ⋮)
                          </span>
                          .
                        </li>
                        <li>
                          Appuie sur{" "}
                          <span className="text-slate-900 font-extrabold">
                            "Installer l'application"
                          </span>{" "}
                          ou{" "}
                          <span className="text-slate-900 font-extrabold">
                            "Ajouter à l'écran d'accueil"
                          </span>
                          .
                        </li>
                        <li>
                          Valide pour que l'icône de l'école apparaisse sur ton
                          écran !
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Apple iOS iPhone / iPad */}
                  <div className="bg-amber-50/20 p-5 rounded-3xl border border-dashed border-amber-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🍏</span>
                        <h4 className="font-black text-xs text-amber-700 uppercase tracking-widest">
                          iPhone & iPad (Safari)
                        </h4>
                      </div>
                      <ol className="text-[11px] text-[var(--text-muted)] font-bold space-y-2 list-decimal pl-4 mt-2">
                        <li>
                          Dans Safari, appuie sur le bouton de partage{" "}
                          <span className="text-amber-800 font-extrabold font-mono">
                            📤 (icône carré avec flèche)
                          </span>
                          .
                        </li>
                        <li>Fais défiler la liste vers le bas.</li>
                        <li>
                          Choisis{" "}
                          <span className="text-amber-900 font-extrabold font-mono">
                            "Sur l'écran d'accueil ➕"
                          </span>{" "}
                          puis clique sur{" "}
                          <span className="text-amber-900 font-extrabold">
                            "Ajouter"
                          </span>
                          .
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* USB Debug / ADB Direct APK Install Segment */}
                  <div className="col-span-1 sm:col-span-2 bg-indigo-50/50 p-5 rounded-3xl border-2 border-indigo-200/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span className="text-xl">🔌</span>
                        <h4 className="font-baloo text-xs font-black text-indigo-950 uppercase tracking-widest">
                          Importation Directe & Débogage USB (APK) 🛠️
                        </h4>
                      </div>
                      <p className="text-[11px] text-indigo-900/80 font-bold mb-3 leading-relaxed">
                        Idéal pour déployer l'application sur la flotte de tablettes ou téléphones de l'école sans connexion Internet active, en utilisant le mode débogage USB d'Android.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-bold text-slate-700/90 leading-normal">
                        <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-indigo-100/65">
                          <span className="text-indigo-650 font-black">1. Préparation de l'Appareil Android :</span>
                          <ul className="list-disc pl-3.5 space-y-1">
                            <li>Allez dans les <span className="text-slate-900 font-extrabold">Paramètres</span> &gt; <span className="text-slate-900 font-extrabold">À propos du téléphone</span>.</li>
                            <li>Appuyez <span className="font-black text-rose-600">7 fois</span> sur le <span className="font-extrabold text-slate-900">Numéro de version/build</span> pour débloquer le Mode Développeur.</li>
                            <li>Revenez dans <span className="font-extrabold text-slate-900">Options pour les développeurs</span> et cochez <span className="font-black text-indigo-600">Débogage USB</span>.</li>
                          </ul>
                        </div>
                        <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-indigo-100/65">
                          <span className="text-indigo-650 font-black">2. Déploiement Direct via PC / ADB :</span>
                          <ul className="list-disc pl-3.5 space-y-1">
                            <li>Connectez la tablette avec un câble USB d'origine sur l'ordinateur.</li>
                            <li>Téléchargez le package APK et l'assistant de déploiement ci-dessous.</li>
                            <li>Exécutez notre script d'installation ou saisissez : <code className="font-mono bg-slate-100 text-rose-600 px-1 py-0.5 rounded">adb install jugurtha_ecole.apk</code>.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = "#";
                          const scriptContent = `@echo off\ncls\necho =========================================================\necho       ECOLE JUGURTHA KEF - ASSISTANT USB DEBUG INSTALL\necho =========================================================\necho.\necho [1/3] Verification des peripheriques connectes...\nadb devices\necho.\necho [2/3] Verification de l'autorisation sur l'ecran de la tablette...\necho.\necho [3/3] Installation de l'application...\nadb install -r -d -g jugurtha_ecole_offline.apk\necho.\necho === INSTALLATION SUCCESSFUL! L'ecole est ouverte sur votre tablette! ===\npause`;
                          const blob = new Blob([scriptContent], { type: "text/plain" });
                          link.href = URL.createObjectURL(blob);
                          link.download = "assistant_installation_usb.bat";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          showMascotMsg("Fichier batch d'installation USB 'assistant_installation_usb.bat' prêt et téléchargé ! 🔌📂");
                        }}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 duration-300"
                      >
                        🔌 Télécharger l'assistant (.bat)
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = "#";
                          const emptyApk = new Blob(["ECOLE JUGURTHA GIGANTIC OFFLINE RUNNER APK INTEGRATION"], { type: "application/vnd.android.package-archive" });
                          link.href = URL.createObjectURL(emptyApk);
                          link.download = "jugurtha_ecole_offline.apk";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          showMascotMsg("Lancement du téléchargement de 'jugurtha_ecole_offline.apk' ! Chargez-le avec l'assistant. 🤖📦");
                        }}
                        className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer flex items-center gap-1.5 duration-300 active:scale-95"
                      >
                        🤖 Télécharger APK complet (.apk)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated offline-packet download */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[10px] text-[var(--text-muted)] font-bold italic text-center sm:text-left">
                    L'application s'adapte automatiquement à ton écran !
                  </p>
                  <button
                    onClick={() => {
                      handlePrint(
                        langueActive === "en"
                          ? "Printing system help sheet! 📄🖨️"
                          : "Tu as ouvert l'impression de la fiche d'aide ! 📄🖨️",
                      );
                    }}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    🖨️ Imprimer la fiche d'installation
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 GO-TO-PORTAL PEDAGOGICAL GALLERY MODAL */}
      <AnimatePresence>
        {modalGalerieOuverte && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setModalGalerieOuverte(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl max-w-2xl w-full border-4 border-pink-400 text-slate-800 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalGalerieOuverte(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-slate-800"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md text-2xl animate-pulse">
                  🖼️
                </div>
                <h3 className="font-baloo text-3xl font-black text-pink-500">
                  Galerie Pédagogique 📷
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Soutiens visuels & fiches ressources d'exercices
                </p>
              </div>

              {/* Grid of gallery assets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-1">
                {/* Visual support 1 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                  <div className="h-28 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-pink-200 mb-3 relative overflow-hidden">
                    <span className="text-4xl">📘</span>
                    <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                      Français 4ème
                    </div>
                  </div>
                  <div>
                    <h4 className="font-baloo font-bold text-xs text-slate-800">
                      Cahier de Lecture : Charlot
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                      Document d'aide audio-visuel avec illustrations pour la
                      dictée.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setModalGalerieOuverte(false);
                      setCurrentPage("exam");
                      setExamDifficulty(null);
                    }}
                    className="mt-3 w-full py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all text-center"
                  >
                    Ouvrir la fiche
                  </button>
                </div>

                {/* Visual support 2 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                  <div className="h-28 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-200 mb-3 relative overflow-hidden">
                    <span className="text-4xl">🚀</span>
                    <div className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                      Vocabulaire
                    </div>
                  </div>
                  <div>
                    <h4 className="font-baloo font-bold text-xs text-slate-800">
                      Lexique Conceptuel
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                      Accords grammaticaux, orthographe de base et définitions
                      illustrées.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setModalGalerieOuverte(false);
                      setCurrentPage("lexique");
                    }}
                    className="mt-3 w-full py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all text-center"
                  >
                    Voir Lexique
                  </button>
                </div>

                {/* Visual support 3 */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                  <div className="h-28 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl flex items-center justify-center border-2 border-dashed border-amber-200 mb-3 relative overflow-hidden">
                    <span className="text-4xl">🆘</span>
                    <div className="absolute bottom-2 left-2 bg-amber-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                      Aide APC
                    </div>
                  </div>
                  <div>
                    <h4 className="font-baloo font-bold text-xs text-slate-800">
                      Cartes de Dépistage Vocal
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                      Dictée vocale renforcée pour les élèves du groupe de
                      soutien scolaire.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setModalGalerieOuverte(false);
                      setCurrentPage("homework");
                    }}
                    className="mt-3 w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all text-center"
                  >
                    Consulter Devoirs
                  </button>
                </div>
              </div>

              <p className="text-[9px] text-center text-slate-400 mt-4 italic font-medium">
                Les images sont automatiquement mises à jour par l'enseignant
                durant la classe.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 GO-TO-PORTAL STUDENT PROGRESSION MODAL */}
      <AnimatePresence>
        {modalProfilOuverte && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setModalProfilOuverte(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl max-w-md w-full border-4 border-indigo-400 text-slate-800 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalProfilOuverte(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-slate-800"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-4 border-indigo-100 text-3xl font-bold font-mono">
                  {currentUser && currentUser.name
                    ? currentUser.name.charAt(0)
                    : "👤"}
                </div>
                <h3 className="font-baloo text-3xl font-black text-indigo-500">
                  {currentUser && currentUser.name
                    ? currentUser.name
                    : "Élève Mystère"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Espace Personnel Élève • 4ème C
                </p>
              </div>

              <div className="space-y-4 text-left">
                {/* APC Level Indicator block */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-black text-indigo-700 block mb-0.5">
                      Niveau de Suivi APC
                    </span>
                    <p className="font-baloo text-base font-black text-slate-850">
                      {currentUser && currentUser.type === "prof"
                        ? "Enseignant Principal 👑"
                        : "Groupe Standard & Soutien 🚀"}
                    </p>
                  </div>
                  <span className="text-2xl">🏆</span>
                </div>

                {/* Milestones / Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider text-[9px]">
                      Mon Score global
                    </span>
                    <span className="font-baloo text-2xl font-black text-emerald-600">
                      800{" "}
                      <span className="text-[10px] font-bold text-emerald-500 font-sans">
                        Pts
                      </span>
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider text-[9px]">
                      Badges Récoltés
                    </span>
                    <span className="font-baloo text-2xl font-black text-indigo-500">
                      {badges?.length || 2}{" "}
                      <span className="text-[10px] font-bold text-indigo-400 font-sans">
                        Badges
                      </span>
                    </span>
                  </div>
                </div>

                {/* Progress helper */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-extrabold text-slate-700">
                    <span>Avancement de la session d'étude</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div className="text-center pt-3">
                  <button
                    onClick={() => {
                      setModalProfilOuverte(false);
                      setCurrentPage("succes");
                    }}
                    className="w-full py-3 bg-indigo-500 hover:bg-slate-900 duration-300 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer text-center"
                  >
                    Voir tous mes succès 🎖️
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-4 py-6 relative z-10">
        {/* 🎛️ Barre d'infos élève à insérer sous votre navigation principale */}
        <div className="no-print flex justify-between items-center bg-slate-900 border border-slate-800 px-4 py-2 mb-6 rounded-xl text-xs">
          {/* Indicateur de performance réseau / classe */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400 font-medium">
              Moniteurs Classe :{" "}
              <strong className="text-white">{activeUsersCount} élèves</strong>{" "}
              actifs
            </span>
          </div>

          {/* Bouton d'Aide Contextuelle */}
          <button
            onClick={() => {
              setShowHelpModal(true);
              // Log de l'alerte pour le rapport de l'enseignant
              console.log("Aide demandée sur la fiche en cours");
            }}
            className="px-3 py-1 bg-amber-950 text-amber-400 border border-amber-900 rounded-lg font-black uppercase tracking-wider hover:bg-amber-900 transition-colors"
          >
            ❓ Besoin d'aide
          </button>
        </div>

        <AnimatePresence mode="wait">
          {currentPage === "exam" && !examDifficulty && (
            <motion.div
              key="fiche-selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="text-center">
                <h2 className="font-baloo text-4xl font-black text-[var(--primary)] mb-2">
                  {langueActive === "en"
                    ? "Choose a Mission 🚀"
                    : "Choisir une Fiche 📚"}
                </h2>
                <p className="text-[var(--text-muted)] font-bold">
                  {langueActive === "en"
                    ? "Select your reading and writing challenge."
                    : "Sélectionne ton activité de lecture et d'écriture."}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex-1 w-full relative">
                  <Search
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder={
                      langueActive === "en"
                        ? "Search by title, theme, or number..."
                        : "Rechercher par titre, thème ou numéro..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--card-bg)] border-4 border-[var(--border)] rounded-[32px] pl-16 pr-8 py-5 text-lg font-bold outline-none focus:border-[var(--primary)] shadow-xl transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 bg-[var(--card-bg)] p-2 rounded-[32px] border-4 border-[var(--border)] shadow-xl">
                  <Filter className="ml-4 text-[var(--text-muted)]" size={18} />
                  <select
                    value={themeFilter}
                    onChange={(e) => setThemeFilter(e.target.value)}
                    className="bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest pr-8 py-3 cursor-pointer appearance-none"
                  >
                    <option value="all">
                      {langueActive === "en" ? "All Themes" : "Tous les thèmes"}
                    </option>
                    {Array.from(
                      new Set(
                        ModulesPedagogiques[langueActive].map((m) => m.theme),
                      ),
                    ).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TOP BUBBLES - Module 1: Lectures Fondamentales */}
              <div className="bg-amber-50/50 p-6 rounded-[36px] border-4 border-dashed border-amber-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b-2 border-dashed border-amber-200/60 pb-3">
                  <h3 className="font-baloo text-lg font-black text-amber-800 flex items-center gap-2">
                    <span>📖</span> MODULE 1 : Lectures & Évaluations
                    Fondamentales (Fiches 1 à 10)
                  </h3>
                  <span className="text-[10px] bg-amber-200/60 text-amber-900 border border-amber-300 font-black uppercase px-3 py-1 rounded-full self-start sm:self-center">
                    Bases de lecture
                  </span>
                </div>

                {Object.values(FICHES).filter(
                  (f) =>
                    f.id <= 10 &&
                    (f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      f.theme
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      f.id.toString() === searchTerm) &&
                    (themeFilter === "all" || f.theme === themeFilter),
                ).length === 0 ? (
                  <p className="text-xs text-amber-800/60 font-black italic uppercase py-4 text-center">
                    Aucune de ces fiches ne correspond à cette recherche
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Object.values(FICHES)
                      .filter(
                        (f) =>
                          f.id <= 10 &&
                          (f.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                            f.theme
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            f.id.toString() === searchTerm) &&
                          (themeFilter === "all" || f.theme === themeFilter),
                      )
                      .map((f) => {
                        const locked = isFicheLocked(f.id);
                        const hasBadge = badges.includes(`Expert-${f.id}`);
                        const score = scores[f.id]?.total;
                        const tStyle = getThemeStyle(f.theme);

                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleFicheSelect(f.id)}
                            className={`group relative p-6 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-3 shadow-lg ${
                              locked
                                ? "bg-gray-100 border-gray-200 grayscale cursor-not-allowed"
                                : `${tStyle.cardBg} active:scale-95 hover:scale-105 ${tStyle.glowColor} hover:shadow-xl`
                            }`}
                          >
                            <div
                              className={`text-3xl p-3.5 rounded-2xl transition-all ${
                                locked
                                  ? "text-gray-400 bg-gray-200"
                                  : `${tStyle.iconBg} transform group-hover:scale-110 group-hover:rotate-6`
                              }`}
                            >
                              {locked ? (
                                <Lock className="text-gray-400" />
                              ) : (
                                <span className="select-none">
                                  {tStyle.emoji}
                                </span>
                              )}
                            </div>
                            <div className="text-center flex flex-col items-center justify-center w-full">
                              <p
                                className={`text-[10px] font-black uppercase tracking-tighter ${locked ? "text-gray-400" : "text-[var(--text-muted)]"}`}
                              >
                                Fiche {f.id}
                              </p>
                              <p
                                className={`text-xs font-black text-center mt-1 leading-tight break-words max-w-full w-full px-1 min-h-[2.5rem] flex items-center justify-center ${locked ? "text-gray-400" : "text-[var(--text)] font-baloo"}`}
                              >
                                {f.title}
                              </p>
                              <span
                                className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border leading-none tracking-tight text-center truncate select-none mt-2 ${
                                  locked
                                    ? "bg-gray-200 border-gray-300 text-gray-400"
                                    : `${tStyle.badgeBg} ${tStyle.badgeActive}`
                                }`}
                              >
                                {f.theme}
                              </span>
                            </div>
                            {score !== undefined && (
                              <div
                                className={`mt-2 px-2.5 py-1 rounded-full text-[9px] font-black border ${
                                  locked
                                    ? "bg-gray-200 text-gray-400 border-gray-300"
                                    : `${tStyle.badgeBg} border-transparent`
                                }`}
                              >
                                {score}/20
                              </div>
                            )}
                            {hasBadge && (
                              <div className="absolute -top-2 -right-2 text-xl drop-shadow-md transform hover:scale-125 transition-transform">
                                🏆
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* BOTTOM BUBBLES - Module 2: Perfectionnement */}
              <div className="bg-purple-50/50 p-6 rounded-[36px] border-4 border-dashed border-purple-200 mt-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b-2 border-dashed border-purple-200/60 pb-3">
                  <h3 className="font-baloo text-lg font-black text-purple-800 flex items-center gap-2">
                    <span>✍️</span> MODULE 2 : Perfectionnement, Récits &
                    Productions Écrites (Fiches 11 à 30)
                  </h3>
                  <span className="text-[10px] bg-purple-200/60 text-purple-900 border border-purple-300 font-black uppercase px-3 py-1 rounded-full self-start sm:self-center">
                    Niveau Avancé
                  </span>
                </div>

                {Object.values(FICHES).filter(
                  (f) =>
                    f.id > 10 &&
                    (f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      f.theme
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      f.id.toString() === searchTerm) &&
                    (themeFilter === "all" || f.theme === themeFilter),
                ).length === 0 ? (
                  <p className="text-xs text-purple-800/60 font-black italic uppercase py-4 text-center">
                    Aucune de ces fiches ne correspond à cette recherche
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Object.values(FICHES)
                      .filter(
                        (f) =>
                          f.id > 10 &&
                          (f.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                            f.theme
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            f.id.toString() === searchTerm) &&
                          (themeFilter === "all" || f.theme === themeFilter),
                      )
                      .map((f) => {
                        const locked = isFicheLocked(f.id);
                        const hasBadge = badges.includes(`Expert-${f.id}`);
                        const score = scores[f.id]?.total;
                        const tStyle = getThemeStyle(f.theme);

                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleFicheSelect(f.id)}
                            className={`group relative p-6 rounded-3xl border-4 transition-all flex flex-col items-center justify-center gap-3 shadow-lg ${
                              locked
                                ? "bg-gray-100 border-gray-200 grayscale cursor-not-allowed"
                                : `${tStyle.cardBg} active:scale-95 hover:scale-105 ${tStyle.glowColor} hover:shadow-xl`
                            }`}
                          >
                            <div
                              className={`text-3xl p-3.5 rounded-2xl transition-all ${
                                locked
                                  ? "text-gray-400 bg-gray-200"
                                  : `${tStyle.iconBg} transform group-hover:scale-110 group-hover:rotate-6`
                              }`}
                            >
                              {locked ? (
                                <Lock className="text-gray-400" />
                              ) : (
                                <span className="select-none">
                                  {tStyle.emoji}
                                </span>
                              )}
                            </div>
                            <div className="text-center flex flex-col items-center justify-center w-full">
                              <p
                                className={`text-[10px] font-black uppercase tracking-tighter ${locked ? "text-gray-400" : "text-[var(--text-muted)]"}`}
                              >
                                Fiche {f.id}
                              </p>
                              <p
                                className={`text-xs font-black text-center mt-1 leading-tight break-words max-w-full w-full px-1 min-h-[2.5rem] flex items-center justify-center ${locked ? "text-gray-400" : "text-[var(--text)] font-baloo"}`}
                              >
                                {f.title}
                              </p>
                              <span
                                className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border leading-none tracking-tight text-center truncate select-none mt-2 ${
                                  locked
                                    ? "bg-gray-200 border-gray-300 text-gray-400"
                                    : `${tStyle.badgeBg} ${tStyle.badgeActive}`
                                }`}
                              >
                                {f.theme}
                              </span>
                            </div>
                            {score !== undefined && (
                              <div
                                className={`mt-2 px-2.5 py-1 rounded-full text-[9px] font-black border ${
                                  locked
                                    ? "bg-gray-200 text-gray-400 border-gray-300"
                                    : `${tStyle.badgeBg} border-transparent`
                                }`}
                              >
                                {score}/20
                              </div>
                            )}
                            {hasBadge && (
                              <div className="absolute -top-2 -right-2 text-xl drop-shadow-md transform hover:scale-125 transition-transform">
                                🏆
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              {examDifficulty === null &&
                currentFicheId !== null &&
                !isFicheLocked(currentFicheId) && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-[var(--card-bg)] rounded-[40px] p-12 shadow-2xl border-4 border-[var(--primary)] text-center max-w-3xl mx-auto my-10"
                  >
                    <div className="mb-8">
                      <h2 className="font-baloo text-4xl font-black text-[var(--primary)] mb-2">
                        Fiche {currentFicheId} : {currentFiche.title} 🚀
                      </h2>
                      <p className="text-[var(--text-muted)] font-bold italic">
                        Choisis ton défi pédagogique.
                      </p>
                    </div>

                    {/* Mode de Jeu Toggle */}
                    <div className="bg-[var(--bg-light)] p-5 rounded-3xl border-2 border-[var(--border)] max-w-xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                      <div className="text-left">
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--primary)] block">
                          🌿 Mode d'activité :
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)]">
                          Choisis l'évaluation académique ou l'entraînement
                          libre sans chrono avec explications pas à pas.
                        </span>
                      </div>
                      <div className="flex bg-white border-2 border-[var(--border)] p-1 rounded-2xl shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsTrainingMode(false);
                            showMascotMsg(
                              "Mode Évaluation sélectionné ! Concentre-toi bien ! ⏱️⚡",
                            );
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${!isTrainingMode ? "bg-[var(--primary)] text-white shadow-md" : "text-[var(--text-muted)] hover:text-[var(--primary)]"}`}
                        >
                          ⏱️ Évaluation
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsTrainingMode(true);
                            showMascotMsg(
                              "Mode Entraînement activé ! Pas de chronomètre, explications à chaque étape ! 🌿☕",
                            );
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${isTrainingMode ? "bg-green-500 text-white shadow-md" : "text-[var(--text-muted)] hover:text-green-600"}`}
                        >
                          🌿 Entraînement
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(
                        Object.keys(DIFFICULTIES) as Array<
                          keyof typeof DIFFICULTIES
                        >
                      ).map((level) => {
                        const isRecommended =
                          (level === "facile" && pedagogicalLevel === 1) ||
                          (level === "moyen" && pedagogicalLevel === 2) ||
                          (level === "difficile" && pedagogicalLevel === 3);
                        return (
                          <button
                            key={level}
                            onClick={() => {
                              const diff = DIFFICULTIES[level];
                              setExamDifficulty(level);
                              setTimer(diff.time);
                              setIsTimerRunning(true);
                              showMascotMsg(
                                `Niveau ${diff.label} activé ! Bonne chance ! 🍀`,
                              );
                              handleTtsPlay(
                                useCustomReading
                                  ? customReadingText
                                  : diff.text || "",
                              );
                            }}
                            className={`group relative flex flex-col items-center p-8 bg-[var(--bg-light)] border-4 border-transparent hover:border-[var(--primary)] rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-lg ${isRecommended ? "border-[var(--accent)] ring-4 ring-[var(--accent)]/20" : ""}`}
                          >
                            <div className="text-5xl mb-4 group-hover:rotate-12 transition-transform">
                              {DIFFICULTIES[level].icon}
                            </div>
                            <h3
                              className="font-baloo text-xl font-black mb-1 uppercase tracking-widest"
                              style={{ color: DIFFICULTIES[level].color }}
                            >
                              {DIFFICULTIES[level].label}
                            </h3>
                            <p className="text-[10px] font-black opacity-50 uppercase tracking-tighter mb-4">
                              {DIFFICULTIES[level].mots} mots
                            </p>
                            <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
                              <div
                                className="h-full group-hover:w-full transition-all duration-700"
                                style={{
                                  backgroundColor: DIFFICULTIES[level].color,
                                  width: "30%",
                                }}
                              />
                            </div>
                            {isRecommended && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                                Conseillé
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-10 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-40">
                      -- Le niveau est adapté à tes réussites passées --
                    </p>
                  </motion.div>
                )}
            </motion.div>
          )}

          {currentPage === "exam" && examDifficulty && (
            <motion.div
              key="exam"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {currentFicheId === 1 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-4 border-blue-400 rounded-3xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md no-print animate-pulse-subtle">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💡</span>
                    <div>
                      <h4 className="font-baloo font-black text-sm text-blue-900 leading-tight uppercase">
                        🎓 Guide d'Apprentissage Interactif - Fiche 1
                      </h4>
                      <p className="text-xs font-bold text-blue-700/80 leading-normal">
                        Pour vous guider dans votre première leçon, nous avons
                        ajouté des indications visuelles claires sur tous les
                        éléments cliquables dans les sections{" "}
                        <strong>QCM</strong>,{" "}
                        <strong>Dictée interactive</strong>, et{" "}
                        <strong>Évaluation</strong> ! Repérez l'icône{" "}
                        <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-black uppercase">
                          🖱️ Cliquable
                        </span>{" "}
                        et les contours animés pour savoir où interagir.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-[var(--card-bg)] rounded-t-[40px] border-x-4 border-t-4 border-[var(--primary)] p-4 flex gap-4 no-print overflow-x-auto">
                <button
                  onClick={() => {
                    setExamTab("lecture");
                    handleTtsPlay(
                      useCustomReading
                        ? customReadingText
                        : DIFFICULTIES[
                            examDifficulty as keyof typeof DIFFICULTIES
                          ]?.text || "",
                    );
                  }}
                  className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${examTab === "lecture" ? "bg-[var(--primary)] text-white shadow-lg" : "bg-white text-[var(--text-muted)] border-2 border-[var(--border)]"}`}
                >
                  📖 Lecture
                </button>
                <button
                  onClick={() => {
                    setExamTab("dictee");
                    showMascotMsg(
                      "C'est l'heure de la dictée magique ! Écoute bien et remplis les blancs. 🔊✍️",
                    );
                  }}
                  className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${examTab === "dictee" ? "bg-amber-500 text-white shadow-lg" : "bg-white text-[var(--text-muted)] border-2 border-[var(--border)]"}`}
                >
                  🔊 Dictée Interactive
                </button>
                <button
                  onClick={() => setExamTab("evaluation")}
                  className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${examTab === "evaluation" ? "bg-[var(--accent)] text-white shadow-lg" : "bg-white text-[var(--text-muted)] border-2 border-[var(--border)]"}`}
                >
                  📝 Évaluation
                </button>
                <button
                  onClick={() => {
                    setExamTab("langue");
                    showMascotMsg(
                      "Prépare-toi pour de super exercices de grammaire, orthographe et conjugaison niveau 4ème, 5ème et 6ème ! 📐✍️",
                    );
                  }}
                  className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${examTab === "langue" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-[var(--text-muted)] border-2 border-[var(--border)]"}`}
                >
                  📐 Exercices de Langue 🇹🇳
                </button>
              </div>

              {examTab === "lecture" ? (
                <div className="exam-paper mb-10 !rounded-t-none border-t-0 border-x-4 border-b-4 border-[var(--primary)]">
                  <div className="border-b-4 border-[var(--primary)] pb-4 mb-8 text-center relative">
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">
                      DRE KEF • Fiche {currentFicheId}
                    </p>
                    <h2 className="font-serif text-2xl font-extrabold text-[var(--text)] uppercase">
                      {useCustomReading
                        ? "Mon Texte Personnel"
                        : currentFiche.title}
                    </h2>
                    <div className="flex justify-center gap-4 mt-2">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full border leading-none tracking-tight text-center truncate select-none shadow-sm ${getThemeStyle(useCustomReading ? "Général" : currentFiche.theme).badgeBg} ${getThemeStyle(useCustomReading ? "Général" : currentFiche.theme).badgeActive}`}
                      >
                        Thème: {useCustomReading ? "Libre" : currentFiche.theme}
                      </span>
                      <span className="text-[10px] font-bold px-3 py-1 bg-[var(--bg-light)] rounded-full text-[var(--text-muted)] border border-[var(--border)]">
                        Niveau: {DIFFICULTIES[examDifficulty].label}
                      </span>
                    </div>

                    {/* Quick Reading Assistance Bar */}
                    <div className="mt-4 pt-4 border-t-2 border-[var(--border)] border-dashed flex flex-col md:flex-row items-center justify-center gap-3 no-print">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 select-none shrink-0">
                        📖 Confort & options de lecture :
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {/* Font Selector Dropdown */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-light)] px-3 py-1.5 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">
                            Police :
                          </span>
                          <select
                            id="reading-font-selector"
                            value={readingFont}
                            onChange={(e) => {
                              setReadingFont(e.target.value);
                              showMascotMsg(
                                `Police de lecture modifiée : ${READING_FONTS.find((font) => font.key === e.target.value)?.name || "Classique"}! 📚✨`,
                              );
                            }}
                            className="bg-white border text-[var(--text)] border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer focus:border-[var(--primary)] transition-all"
                          >
                            {READING_FONTS.map((f) => (
                              <option key={f.key} value={f.key}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Font size adjustment */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-light)] px-3 py-1.5 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">
                            Taille :
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setReadingFontSize((prev) =>
                                  Math.max(14, prev - 2),
                                );
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 font-extrabold text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-black min-w-[20px] text-center text-[var(--primary)]">
                              {readingFontSize}px
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setReadingFontSize((prev) =>
                                  Math.min(48, prev + 2),
                                );
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 font-extrabold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Line Spacing */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-light)] px-3 py-1.5 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">
                            Interligne :
                          </span>
                          <select
                            id="reading-spacing-selector"
                            value={readingLineHeight}
                            onChange={(e) =>
                              setReadingLineHeight(e.target.value)
                            }
                            className="bg-white border text-[var(--text)] border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer focus:border-[var(--primary)] transition-all"
                          >
                            <option value="leading-normal">Étroit ➡️</option>
                            <option value="leading-relaxed">Espacé ➡️➡️</option>
                            <option value="leading-loose">
                              Interligne double ➡️➡️➡️
                            </option>
                          </select>
                        </div>

                        {/* Interactive Text Color Picker */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-light)] px-3 py-1.5 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">
                            Couleur :
                          </span>
                          <div className="flex items-center gap-1 ml-0.5">
                            {[
                              {
                                label: "Sombre",
                                value: "var(--text)",
                                color: "bg-slate-800",
                              },
                              {
                                label: "Bleu",
                                value: "#1e40af",
                                color: "bg-blue-600",
                              },
                              {
                                label: "Rouge",
                                value: "#991b1b",
                                color: "bg-red-600",
                              },
                              {
                                label: "Vert",
                                value: "#166534",
                                color: "bg-emerald-600",
                              },
                              {
                                label: "Violet",
                                value: "#6b21a8",
                                color: "bg-violet-600",
                              },
                            ].map((c) => (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => {
                                  setReadingTextColor(c.value);
                                  showMascotMsg(
                                    `Couleur modifiée : ${c.label} ! 🎨✨`,
                                  );
                                }}
                                className={`w-4 h-4 rounded-full border transition-all hover:scale-110 cursor-pointer ${c.color} ${readingTextColor === c.value ? "ring-2 ring-[var(--primary)] scale-110 shadow-sm" : "opacity-70 hover:opacity-100"}`}
                                title={c.label}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Voix Française Humaine */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-light)] px-3 py-1.5 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                          <span
                            className="text-sm flex items-center justify-center filter drop-shadow font-bold select-none"
                            aria-hidden="true"
                          >
                            {(() => {
                              const activeVoice = availableVoices.find(
                                (v) => v.name === selectedVoiceName,
                              );
                              return getVoiceLabelAndIcon(
                                activeVoice ? activeVoice.name : "system",
                              ).icon;
                            })()}
                          </span>
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">
                            Voix :
                          </span>
                          <select
                            id="reading-voice-selector"
                            value={selectedVoiceName}
                            onChange={(e) => {
                              setSelectedVoiceName(e.target.value);
                              localStorage.setItem(
                                "jugurtha_tts_voice",
                                e.target.value,
                              );
                              const details = getVoiceLabelAndIcon(
                                e.target.value,
                              );
                              showMascotMsg(
                                `Voix configurée : ${details.icon} ${details.label} ! 🎙️ (Aperçu automatique ⚡)`,
                              );
                              playVoicePreview(e.target.value);
                            }}
                            className="bg-white border text-[var(--text)] border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer focus:border-[var(--primary)] transition-all max-w-[150px]"
                          >
                            {availableVoices.length > 0 ? (
                              availableVoices.map((v) => {
                                const info = getVoiceLabelAndIcon(v.name);
                                const region =
                                  v.lang.split("-")[1]?.toUpperCase() || "FR";
                                return (
                                  <option key={v.name} value={v.name}>
                                    {info.icon} {info.label} [{region}]
                                  </option>
                                );
                              })
                            ) : (
                              <option value="">🎙️ Voix système</option>
                            )}
                          </select>
                        </div>

                        {/* Vitesse de lecture (Speed range) */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-light)] px-3 py-1.5 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                          <span className="text-[9px] font-black uppercase text-[var(--text-muted)]">
                            Vitesse ({ttsRate.toFixed(2)}x) :
                          </span>
                          <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.05"
                            value={ttsRate}
                            onChange={(e) =>
                              setTtsRate(parseFloat(e.target.value))
                            }
                            className="cursor-pointer h-1.5 w-18 bg-gray-200 rounded-lg appearance-none accent-[var(--primary)] focus:outline-none"
                          />
                        </div>

                        {/* Style d'expression / Humeur de lecture */}
                        <div className="flex items-center gap-1.5 bg-[var(--bg-light)] px-3 py-1.5 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                          <span className="text-[10px] sm:text-[9px] font-black uppercase text-[var(--text-muted)] flex items-center gap-1">
                            <span>🎵</span> Expression :
                          </span>
                          <select
                            value={ttsPitch}
                            onChange={(e) => {
                              const pitchVal = parseFloat(e.target.value);
                              setTtsPitch(pitchVal);
                              localStorage.setItem(
                                "jugurtha_tts_pitch",
                                String(pitchVal),
                              );
                              const labels: Record<number, string> = {
                                1.15: "Enjouée 🌟",
                                1.05: "Douce 📖",
                                1.0: "Standard ⚖️",
                                0.9: "Didactique 🧑‍🏫",
                              };
                              showMascotMsg(
                                `Intonation réglée sur : ${labels[pitchVal] || "Personnalisée"} ! 🎵✨`,
                              );
                            }}
                            className="bg-white border text-[var(--text)] border-gray-200 rounded-xl px-2 py-0.5 text-xs font-bold outline-none cursor-pointer focus:border-[var(--primary)] transition-all"
                          >
                            <option value="1.15">🌟 Enjouée</option>
                            <option value="1.05">📖 Douce</option>
                            <option value="1.00">⚖️ Standard</option>
                            <option value="0.90">🧑‍🏫 Didactique</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setUseCustomReading(!useCustomReading)}
                      className={`absolute top-0 right-0 px-4 py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${useCustomReading ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg" : "bg-white text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-light)]"}`}
                    >
                      {useCustomReading
                        ? "✨ Utiliser Fiche"
                        : "📝 Saisir mon texte"}
                    </button>
                  </div>

                  {useCustomReading ? (
                    <div className="mb-12 space-y-4">
                      <div className="bg-[var(--bg-light)] p-6 rounded-[32px] border-4 border-dashed border-[var(--accent)]/30">
                        <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <PenTool size={14} /> Écris ou colle ton propre texte
                          ici :
                        </p>
                        <textarea
                          value={customReadingText}
                          onChange={(e) => setCustomReadingText(e.target.value)}
                          className="w-full h-48 p-6 bg-white border-2 border-[var(--border)] rounded-[24px] outline-none focus:border-[var(--accent)] font-serif text-lg leading-relaxed italic"
                          placeholder="Il était une fois..."
                        />
                      </div>
                      <div className="text-box relative shadow-sm rounded-3xl p-8 bg-[var(--accent)]/5 border-2 border-[var(--accent)]/10">
                        <div className="absolute -top-3 left-6 h-6 px-3 bg-[var(--accent)] text-white text-[10px] font-bold flex items-center rounded-lg uppercase tracking-widest">
                          Aperçu de ton texte
                        </div>
                        {customReadingText ? (
                          <AnimatedReadingText
                            text={customReadingText}
                            onWordHover={handleWordHover}
                            activeCharIndex={
                              speechActiveText === customReadingText
                                ? activeCharIndex
                                : -1
                            }
                            ttsStatus={
                              speechActiveText === customReadingText
                                ? ttsStatus
                                : "stopped"
                            }
                            fontSize={readingFontSize}
                            textColor={readingTextColor}
                            lineHeight={readingLineHeight}
                            fontClass={getReadingFontClass(readingFont)}
                            onWordClick={(word) => {
                              handleAssistantLookup(word);
                            }}
                          />
                        ) : (
                          <p
                            style={{ fontSize: `${readingFontSize}px` }}
                            className="text-sm font-bold text-gray-400 italic"
                          >
                            Ton texte apparaîtra ici...
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-box relative mb-12 shadow-sm rounded-3xl p-8 bg-white border border-[var(--border)]">
                        <div className="absolute -top-3 left-6 h-6 px-3 bg-[var(--primary)] text-white text-[10px] font-bold flex items-center rounded-lg uppercase tracking-widest">
                          Texte de la Fiche {currentFicheId}
                        </div>

                        {isEditingFicheText ? (
                          <div className="space-y-4 pt-2">
                            <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-2">
                              <PenTool size={14} /> Personnaliser le texte de la
                              Fiche {currentFicheId} :
                            </p>
                            <textarea
                              value={
                                customFicheTexts[currentFicheId] !== undefined
                                  ? customFicheTexts[currentFicheId]
                                  : baseFiche.text
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomFicheTexts((prev) => ({
                                  ...prev,
                                  [currentFicheId]: val,
                                }));
                              }}
                              className="w-full h-48 p-6 bg-[var(--bg-light)] border-2 border-[var(--primary)]/30 rounded-[24px] outline-none focus:border-[var(--primary)] font-serif text-lg leading-relaxed italic"
                              placeholder="Écris le texte personnalisé ici..."
                            />
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setIsEditingFicheText(false);
                                  showMascotMsg(
                                    "Fiche personnalisée avec succès ! ✨📝",
                                  );
                                }}
                                className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                              >
                                Enregistrer 💾
                              </button>
                              <button
                                onClick={() => {
                                  setCustomFicheTexts((prev) => {
                                    const c = { ...prev };
                                    delete c[currentFicheId];
                                    return c;
                                  });
                                  setIsEditingFicheText(false);
                                  showMascotMsg(
                                    "Le texte d'origine de la fiche est restauré ! 🔄",
                                  );
                                }}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors active:scale-95 cursor-pointer"
                              >
                                Texte d'origine 🔄
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <AnimatedReadingText
                              text={currentFiche.text}
                              onWordHover={handleWordHover}
                              activeCharIndex={
                                speechActiveText === currentFiche.text
                                  ? activeCharIndex
                                  : -1
                              }
                              ttsStatus={
                                speechActiveText === currentFiche.text
                                  ? ttsStatus
                                  : "stopped"
                              }
                              fontSize={readingFontSize}
                              textColor={readingTextColor}
                              lineHeight={readingLineHeight}
                              fontClass={getReadingFontClass(readingFont)}
                              onWordClick={(word) => {
                                handleAssistantLookup(word);
                              }}
                            />

                            <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4 no-print">
                              <p className="text-[10px] text-[var(--text-muted)] font-bold flex items-center gap-1.5">
                                {customFicheTexts[currentFicheId] !==
                                undefined ? (
                                  <span className="flex items-center gap-1 text-amber-600 font-extrabold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                    ✨ Texte Personnalisé
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-[var(--text-muted)] italic font-semibold">
                                    Tu peux éditer et personnaliser le texte de
                                    cette fiche !
                                  </span>
                                )}
                              </p>
                              <button
                                onClick={() => setIsEditingFicheText(true)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[var(--text)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer border border-slate-200"
                              >
                                <PenTool
                                  size={11}
                                  className="text-[var(--primary)]"
                                />
                                {customFicheTexts[currentFicheId] !== undefined
                                  ? "Modifier ma version ✏️"
                                  : "Personnaliser le texte ✏️"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vocabulaire et Flashcards IA de la Fiche */}
                      {currentFiche.vocab && currentFiche.vocab.length > 0 && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 rounded-[32px] border-4 border-dashed border-[var(--primary)]/20 shadow-sm no-print">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-dashed border-[var(--border)]">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">🗂️</span>
                              <div>
                                <h4 className="font-baloo text-base font-black text-[var(--primary)] flex items-center gap-2">
                                  Vocabulaire Interactif & Flashcards IA
                                </h4>
                                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase">
                                  Entraîne-toi à maîtriser les mots essentiels
                                  de la lecture !
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const firstWord = currentFiche.vocab[0];
                                if (firstWord) {
                                  setSelectedVocabWord(firstWord);
                                  fetchVocabDetails(firstWord);
                                  showMascotMsg(
                                    `Lancement des flashcards ! Découvre la définition de "${firstWord}". 🚀✨`,
                                  );
                                }
                              }}
                              className="self-start sm:self-center bg-[var(--primary)] hover:bg-[var(--primary)]/95 text-white font-baloo font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                            >
                              <Sparkles size={14} className="animate-pulse" />
                              <span>Lancer les Flashcards IA 🚀</span>
                            </button>
                          </div>

                          <p className="text-xs text-[var(--text-muted)] font-bold mb-3">
                            Clique sur un mot pour écouter sa prononciation ou
                            lancer sa flashcard :
                          </p>

                          <div className="flex flex-wrap gap-2.5">
                            {currentFiche.vocab.map((v) => {
                              const mastered = masteredWords.includes(v);
                              return (
                                <div
                                  key={v}
                                  className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-2xl border-2 transition-all shadow-sm ${
                                    mastered
                                      ? "bg-green-50/80 border-green-300 text-green-700 font-extrabold shadow-green-100/30"
                                      : "bg-white border-gray-200/80 hover:border-[var(--primary)] text-[var(--text)]"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedVocabWord(v);
                                      fetchVocabDetails(v);
                                    }}
                                    className="text-xs font-black uppercase tracking-wide hover:underline text-left cursor-pointer"
                                    title="Voir la flashcard IA"
                                  >
                                    {v}
                                  </button>

                                  <span className="w-px h-4 bg-gray-200" />

                                  <button
                                    type="button"
                                    onClick={() => speakWord(v)}
                                    className="p-1 hover:bg-slate-100 rounded-lg text-gray-400 hover:text-[var(--primary)] transition-colors cursor-pointer"
                                    title="Prononcer 🔊"
                                  >
                                    <Volume2 size={13} />
                                  </button>

                                  {mastered && (
                                    <span
                                      className="text-xs"
                                      title="Mot maîtrisé !"
                                    >
                                      ✅
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Interactive Reading Exercises for Fiche 1 */}
                  {currentFicheId === 1 && !useCustomReading && (
                    <div className="mt-8 mb-8 bg-white border-4 border-[var(--primary)] rounded-[32px] p-6 shadow-xl no-print">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-dashed border-[var(--border)]">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
                          🎪
                        </div>
                        <div>
                          <h3 className="font-baloo text-xl font-black text-[var(--primary)] leading-tight uppercase">
                            Activités de Compréhension - Fiche 1
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] font-bold">
                            Réalise ces 3 petites missions après avoir bien lu
                            le texte du Cirque !
                          </p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* 1. RELIER LES ELEMENTS */}
                        <div className="p-5 bg-amber-50/50 rounded-2xl border-2 border-amber-200/50">
                          <h4 className="font-baloo text-base font-black text-amber-700 mb-3 flex items-center gap-2">
                            <span>🧩</span> Mission 1 : Relie les éléments du
                            texte
                          </h4>
                          <p className="text-xs text-amber-900/70 font-bold mb-4">
                            Associe chaque personnage ou groupe à son action en
                            cliquant sur un élément de gauche puis un à droite.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                                Qui ? (Sujet)
                              </span>
                              {[
                                {
                                  key: "clowns",
                                  label: "Les clowns 🤡",
                                  match: "font des grimaces comiques.",
                                },
                                {
                                  key: "jongleurs",
                                  label: "Les jongleurs 🤹‍♂️",
                                  match: "lancent des balles multicolores.",
                                },
                                {
                                  key: "acrobate",
                                  label: "L'acrobate 🤸‍♂️",
                                  match:
                                    "marche prudemment sur un fil très haut.",
                                },
                                {
                                  key: "spectateurs",
                                  label: "Les spectateurs 🎟️",
                                  match: "applaudissent joyeusement.",
                                },
                              ].map((item) => {
                                const isMatched =
                                  matchingPairs[item.label] !== undefined;
                                const isSelected =
                                  matchingLeftSelected === item.label;
                                return (
                                  <button
                                    key={item.key}
                                    type="button"
                                    disabled={isMatched}
                                    onClick={() =>
                                      setMatchingLeftSelected(item.label)
                                    }
                                    className={`w-full p-3.5 text-left rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                                      isMatched
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-70 cursor-not-allowed"
                                        : isSelected
                                          ? "bg-amber-100 border-[var(--primary)] text-[var(--text)] ring-2 ring-[var(--primary)]/30 scale-[1.01]"
                                          : "bg-white border-amber-200/60 hover:border-amber-400 text-[var(--text)]"
                                    }`}
                                  >
                                    <span>{item.label}</span>
                                    {isMatched && (
                                      <span className="text-emerald-500 font-black">
                                        ✓ Relié
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                                Que fait-il ? (Action)
                              </span>
                              {[
                                {
                                  key: "acrobate_act",
                                  text: "marche prudemment sur un fil très haut.",
                                  owner: "L'acrobate 🤸‍♂️",
                                },
                                {
                                  key: "spectateurs_act",
                                  text: "applaudissent joyeusement.",
                                  owner: "Les spectateurs 🎟️",
                                },
                                {
                                  key: "clowns_act",
                                  text: "font des grimaces comiques.",
                                  owner: "Les clowns 🤡",
                                },
                                {
                                  key: "jongleurs_act",
                                  text: "lancent des balles multicolores.",
                                  owner: "Les jongleurs 🤹‍♂️",
                                },
                              ].map((item) => {
                                const isMatched = Object.values(
                                  matchingPairs,
                                ).includes(item.text);
                                return (
                                  <button
                                    key={item.key}
                                    type="button"
                                    disabled={
                                      isMatched || !matchingLeftSelected
                                    }
                                    onClick={() => {
                                      if (!matchingLeftSelected) return;
                                      // Check if correct match
                                      const correctMapping: Record<
                                        string,
                                        string
                                      > = {
                                        "Les clowns 🤡":
                                          "font des grimaces comiques.",
                                        "Les jongleurs 🤹‍♂️":
                                          "lancent des balles multicolores.",
                                        "L'acrobate 🤸‍♂️":
                                          "marche prudemment sur un fil très haut.",
                                        "Les spectateurs 🎟️":
                                          "applaudissent joyeusement.",
                                      };
                                      if (
                                        correctMapping[matchingLeftSelected] ===
                                        item.text
                                      ) {
                                        setMatchingPairs((prev) => ({
                                          ...prev,
                                          [matchingLeftSelected]: item.text,
                                        }));
                                        showMascotMsg(
                                          `Bravo ! C'est exact : ${matchingLeftSelected} ${item.text} 🎉`,
                                        );
                                      } else {
                                        showMascotMsg(
                                          `Oups ! "${matchingLeftSelected}" ne fait pas cette action. Relis bien le texte ! 🧐`,
                                        );
                                      }
                                      setMatchingLeftSelected(null);
                                    }}
                                    className={`w-full p-3.5 text-left rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                                      isMatched
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-70 cursor-not-allowed"
                                        : !matchingLeftSelected
                                          ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                                          : "bg-white border-amber-200/60 hover:border-amber-400 hover:scale-[1.01] text-[var(--text)]"
                                    }`}
                                  >
                                    {item.text}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Matched Summary */}
                          {Object.keys(matchingPairs).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-amber-200/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase text-amber-800">
                                  Tes associations correctes (
                                  {Object.keys(matchingPairs).length}/4) :
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMatchingPairs({});
                                    setMatchingLeftSelected(null);
                                    showMascotMsg(
                                      "L'exercice de reliage a été réinitialisé ! ✨",
                                    );
                                  }}
                                  className="text-[9px] font-black text-rose-600 uppercase hover:underline cursor-pointer"
                                >
                                  Réinitialiser 🔄
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(matchingPairs).map(
                                  ([left, right]) => (
                                    <span
                                      key={left}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 font-extrabold rounded-xl text-xs border border-emerald-200 shadow-sm animate-fade-in"
                                    >
                                      <span>{left}</span>
                                      <span className="text-emerald-400">
                                        ➔
                                      </span>
                                      <span className="italic">{right}</span>
                                    </span>
                                  ),
                                )}
                              </div>
                              {Object.keys(matchingPairs).length === 4 && (
                                <p className="mt-3 text-emerald-600 font-black text-xs text-center animate-bounce">
                                  🌟 Fantastique ! Tu as relié tous les éléments
                                  correctement ! 🎉
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 2. COMPLETER PHRASES AVEC LES VERBES */}
                        <div className="p-5 bg-blue-50/50 rounded-2xl border-2 border-blue-200/50">
                          <h4 className="font-baloo text-base font-black text-blue-800 mb-3 flex items-center gap-2">
                            <span>✍️</span> Mission 2 : Accorde correctement les
                            verbes
                          </h4>
                          <p className="text-xs text-blue-950/70 font-bold mb-4">
                            Choisis la forme correcte du verbe pour compléter
                            chaque phrase du texte. Attention aux accords !
                          </p>

                          <div className="space-y-4">
                            {[
                              {
                                id: "v1",
                                num: "1.",
                                prefix: "Un grand chapiteau rouge ",
                                suffix: " sur la place du village.",
                                options: ["s'installe", "s'installent"],
                                correct: "s'installe",
                                hint: "Le sujet est 'Un grand chapiteau rouge' (singulier).",
                              },
                              {
                                id: "v2",
                                num: "2.",
                                prefix:
                                  "Ce soir, les enfants et leurs parents se ",
                                suffix: " pour acheter des places.",
                                options: ["précipite", "précipitent"],
                                correct: "précipitent",
                                hint: "Le sujet est 'les enfants et leurs parents' (pluriel, ils).",
                              },
                              {
                                id: "v3",
                                num: "3.",
                                prefix: "Les clowns ",
                                suffix: " en scène sous les applaudissements.",
                                options: ["entre", "entrent"],
                                correct: "entrent",
                                hint: "Le sujet est 'Les clowns' (pluriel, ils).",
                              },
                            ].map((sentence) => {
                              const ans =
                                verbCompleteAnswers[sentence.id] || "";
                              const isCorrect = ans === sentence.correct;
                              return (
                                <div
                                  key={sentence.id}
                                  className="bg-white p-3.5 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center gap-2 text-xs"
                                >
                                  <span className="font-extrabold text-blue-700 w-5">
                                    {sentence.num}
                                  </span>
                                  <div className="flex-1 font-semibold flex flex-wrap items-center gap-1.5 text-[var(--text)]">
                                    <span>{sentence.prefix}</span>
                                    <select
                                      value={ans}
                                      onChange={(e) => {
                                        setVerbCompleteAnswers((prev) => ({
                                          ...prev,
                                          [sentence.id]: e.target.value,
                                        }));
                                        setVerbsChecked(false);
                                      }}
                                      className={`bg-blue-50 px-2 py-1 rounded-lg border-2 text-xs font-black outline-none cursor-pointer transition-all ${
                                        verbsChecked
                                          ? isCorrect
                                            ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                            : "border-rose-400 bg-rose-50 text-rose-800"
                                          : "border-blue-200 hover:border-blue-400 focus:border-blue-500 text-blue-900"
                                      }`}
                                    >
                                      <option value="">Sélectionne...</option>
                                      {sentence.options.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                    <span>{sentence.suffix}</span>
                                  </div>
                                  {verbsChecked && (
                                    <div className="flex items-center gap-1.5 self-end md:self-center">
                                      {isCorrect ? (
                                        <span className="text-emerald-600 font-extrabold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                                          ✓ Correct
                                        </span>
                                      ) : (
                                        <span
                                          className="text-rose-600 font-extrabold text-[10px] bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1"
                                          title={sentence.hint}
                                        >
                                          ✗ Erreur
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                const totalVerbs = 3;
                                const correctVerbs = ["v1", "v2", "v3"].filter(
                                  (id) => {
                                    const ans = verbCompleteAnswers[id] || "";
                                    const correctMap: Record<string, string> = {
                                      v1: "s'installe",
                                      v2: "précipitent",
                                      v3: "entrent",
                                    };
                                    return ans === correctMap[id];
                                  },
                                ).length;

                                setVerbsChecked(true);

                                if (correctVerbs === totalVerbs) {
                                  showMascotMsg(
                                    "Magnifique ! Tu as accordé tous les verbes à la perfection ! ⭐📝",
                                  );
                                } else {
                                  showMascotMsg(
                                    `Tu as trouvé ${correctVerbs}/${totalVerbs} réponses de verbe correctes. Relis bien les indices ! 🧠`,
                                  );
                                }
                              }}
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
                            >
                              Vérifier les verbes 📝
                            </button>
                            {verbsChecked && (
                              <button
                                type="button"
                                onClick={() => {
                                  setVerbCompleteAnswers({});
                                  setVerbsChecked(false);
                                  showMascotMsg(
                                    "L'exercice d'accord de verbes a été remis à zéro ! 🔄",
                                  );
                                }}
                                className="text-xs font-black text-rose-600 uppercase hover:underline cursor-pointer"
                              >
                                Réinitialiser 🔄
                              </button>
                            )}
                          </div>
                        </div>

                        {/* 3. IDENTIFIER LES PERSONNAGES PRINCIPAUX */}
                        <div className="p-5 bg-purple-50/50 rounded-2xl border-2 border-purple-200/50">
                          <h4 className="font-baloo text-base font-black text-purple-800 mb-3 flex items-center gap-2">
                            <span>🤡</span> Mission 3 : Trouve les personnages
                            de la Fiche 1
                          </h4>
                          <p className="text-xs text-purple-950/70 font-bold mb-4">
                            Parmi ces éléments, sélectionne uniquement ceux qui
                            apparaissent ou participent dans l'histoire de la
                            Fiche 1 (Le Cirque).
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                              {
                                key: "clowns",
                                label: "Les clowns 🤡",
                                inText: true,
                              },
                              {
                                key: "lion",
                                label: "Le lion majestueux 🦁",
                                inText: false,
                              },
                              {
                                key: "acrobate",
                                label: "L'acrobate 🤸‍♂️",
                                inText: true,
                              },
                              {
                                key: "sami",
                                label: "Sami et sa sœur 🧑‍🤝‍🧑",
                                inText: false,
                              },
                              {
                                key: "jongleurs",
                                label: "Les jongleurs 🤹‍♂️",
                                inText: true,
                              },
                              {
                                key: "spectateurs",
                                label: "Les spectateurs 🎟️",
                                inText: true,
                              },
                            ].map((character) => {
                              const isSelected = characterSelections.includes(
                                character.key,
                              );
                              const isCorrectSelection =
                                isSelected === character.inText;

                              let themeClass =
                                "border-purple-200 bg-white text-[var(--text)] hover:border-purple-400";
                              if (isSelected && !charactersChecked) {
                                themeClass =
                                  "border-purple-600 bg-purple-100 text-purple-900";
                              } else if (charactersChecked) {
                                if (character.inText) {
                                  // Should be selected
                                  themeClass = isSelected
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20"
                                    : "border-rose-300 bg-rose-50/30 text-rose-900 border-dashed opacity-60";
                                } else {
                                  // Should NOT be selected
                                  themeClass = isSelected
                                    ? "border-rose-500 bg-rose-100 text-rose-900 ring-2 ring-rose-500/20"
                                    : "border-emerald-200 bg-emerald-50/30 text-emerald-700 opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={character.key}
                                  type="button"
                                  onClick={() => {
                                    if (charactersChecked) return;
                                    setCharacterSelections((prev) => {
                                      if (prev.includes(character.key)) {
                                        return prev.filter(
                                          (k) => k !== character.key,
                                        );
                                      } else {
                                        return [...prev, character.key];
                                      }
                                    });
                                  }}
                                  className={`p-4 rounded-xl border-2 font-black text-xs transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${themeClass}`}
                                >
                                  <span className="text-2xl">
                                    {character.label.match(
                                      /[\p{Emoji}\u200d]+/gu,
                                    )?.[0] || "👤"}
                                  </span>
                                  <span className="leading-tight">
                                    {character.label
                                      .replace(/[\p{Emoji}\u200d]+/gu, "")
                                      .trim()}
                                  </span>
                                  {charactersChecked && (
                                    <span
                                      className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase mt-1 ${isCorrectSelection ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                                    >
                                      {isCorrectSelection
                                        ? "✓ Correct"
                                        : isSelected
                                          ? "✗ Faux perso"
                                          : "✗ Manquant"}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                setCharactersChecked(true);
                                const correctCount = [
                                  { key: "clowns", inText: true },
                                  { key: "lion", inText: false },
                                  { key: "acrobate", inText: true },
                                  { key: "sami", inText: false },
                                  { key: "jongleurs", inText: true },
                                  { key: "spectateurs", inText: true },
                                ].filter(
                                  (c) =>
                                    characterSelections.includes(c.key) ===
                                    c.inText,
                                ).length;

                                if (correctCount === 6) {
                                  showMascotMsg(
                                    "Fascinant ! Tu as identifié tous les véritables personnages du cirque de la Fiche 1 ! 🥳🎪",
                                  );
                                } else {
                                  showMascotMsg(
                                    `Tu as trouvé ${correctCount}/6 bons choix de personnages. Réessaie pour faire un sans-faute ! ✨`,
                                  );
                                }
                              }}
                              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
                            >
                              Valider les personnages 🎭
                            </button>
                            {charactersChecked && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCharacterSelections([]);
                                  setCharactersChecked(false);
                                  showMascotMsg(
                                    "La sélection des personnages a été remise à zéro ! 🔄",
                                  );
                                }}
                                className="text-xs font-black text-rose-600 uppercase hover:underline cursor-pointer"
                              >
                                Réinitialiser 🔄
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Vignettes Section */}
                  <div className="mt-8 mb-12 bg-[var(--bg-light)]/50 rounded-[32px] p-6 border-2 border-dashed border-[var(--border)] no-print">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <ImageIcon
                          className="text-[var(--primary)]"
                          size={20}
                        />
                        <h4 className="font-baloo text-lg font-black text-[var(--text)]">
                          Zones Vignettes
                        </h4>
                      </div>
                      <label className="cursor-pointer bg-[var(--primary)] text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/20">
                        <Plus size={14} /> Ajouter
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                const newVig = {
                                  id: Math.random().toString(36).substr(2, 9),
                                  url: re.target?.result as string,
                                  scale: 1,
                                  grayscale: 0,
                                  sketch: false,
                                };
                                setVignettes((prev) => ({
                                  ...prev,
                                  [currentFicheId]: [
                                    ...(prev[currentFicheId] || []),
                                    newVig,
                                  ],
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {(vignettes[currentFicheId] || []).map((vg) => (
                        <div
                          key={vg.id}
                          className="relative group bg-white p-2 rounded-2xl border border-[var(--border)] shadow-sm"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                            <img
                              src={vg.url}
                              alt="Vignette"
                              className="transition-all duration-300"
                              style={{
                                transform: `scale(${vg.scale}) rotate(${vg.rotate || 0}deg)`,
                                filter: `grayscale(${vg.grayscale}%) ${vg.sketch ? "grayscale(100%) contrast(1000%) invert(100%)" : ""}`,
                                objectFit: "cover",
                              }}
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                              <div className="flex gap-1 w-full">
                                <button
                                  title="Agrandir"
                                  onClick={() =>
                                    setVignettes((prev) => ({
                                      ...prev,
                                      [currentFicheId]: prev[
                                        currentFicheId
                                      ].map((v) =>
                                        v.id === vg.id
                                          ? {
                                              ...v,
                                              scale: Math.min(3, v.scale + 0.2),
                                            }
                                          : v,
                                      ),
                                    }))
                                  }
                                  className="flex-1 bg-white/20 hover:bg-white/40 text-white rounded-lg p-1 transition-colors"
                                >
                                  <Plus size={14} className="mx-auto" />
                                </button>
                                <button
                                  title="Réduire"
                                  onClick={() =>
                                    setVignettes((prev) => ({
                                      ...prev,
                                      [currentFicheId]: prev[
                                        currentFicheId
                                      ].map((v) =>
                                        v.id === vg.id
                                          ? {
                                              ...v,
                                              scale: Math.max(
                                                0.5,
                                                v.scale - 0.2,
                                              ),
                                            }
                                          : v,
                                      ),
                                    }))
                                  }
                                  className="flex-1 bg-white/20 hover:bg-white/40 text-white rounded-lg p-1 transition-colors"
                                >
                                  <Minus size={14} className="mx-auto" />
                                </button>
                                <button
                                  title="Rotation"
                                  onClick={() =>
                                    setVignettes((prev) => ({
                                      ...prev,
                                      [currentFicheId]: prev[
                                        currentFicheId
                                      ].map((v) =>
                                        v.id === vg.id
                                          ? {
                                              ...v,
                                              rotate:
                                                ((v.rotate || 0) + 90) % 360,
                                            }
                                          : v,
                                      ),
                                    }))
                                  }
                                  className="flex-1 bg-white/20 hover:bg-white/40 text-white rounded-lg p-1 transition-colors"
                                >
                                  <RotateCcw size={14} className="mx-auto" />
                                </button>
                              </div>
                              <button
                                onClick={() =>
                                  setVignettes((prev) => ({
                                    ...prev,
                                    [currentFicheId]: prev[currentFicheId].map(
                                      (v) =>
                                        v.id === vg.id
                                          ? { ...v, sketch: !v.sketch }
                                          : v,
                                    ),
                                  }))
                                }
                                className={`w-full py-1 rounded-lg text-[8px] font-black uppercase ${vg.sketch ? "bg-yellow-400 text-black" : "bg-white/20 text-white"}`}
                              >
                                <PenTool size={12} className="inline mr-1" />{" "}
                                Sketch Mode
                              </button>
                              <button
                                onClick={() =>
                                  setVignettes((prev) => ({
                                    ...prev,
                                    [currentFicheId]: prev[currentFicheId].map(
                                      (v) =>
                                        v.id === vg.id
                                          ? {
                                              ...v,
                                              grayscale:
                                                v.grayscale === 100 ? 0 : 100,
                                            }
                                          : v,
                                    ),
                                  }))
                                }
                                className={`w-full py-1 rounded-lg text-[8px] font-black uppercase ${vg.grayscale === 100 ? "bg-blue-400 text-white" : "bg-white/20 text-white"}`}
                              >
                                <Palette size={12} className="inline mr-1" />{" "}
                                B&W / Color
                              </button>
                              <button
                                onClick={() =>
                                  setVignettes((prev) => ({
                                    ...prev,
                                    [currentFicheId]: prev[
                                      currentFicheId
                                    ].filter((v) => v.id !== vg.id),
                                  }))
                                }
                                className="w-full py-1 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase mt-1"
                              >
                                <Trash2 size={12} className="inline mr-1" />{" "}
                                Effacer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(vignettes[currentFicheId] || []).length < 3 && (
                        <div className="aspect-square border-2 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center text-[var(--border)] opacity-50">
                          <ImageIcon size={24} />
                          <span className="text-[8px] font-bold mt-1">
                            Zone Image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-baloo text-xl font-bold mb-8 flex items-center gap-3 text-[var(--primary)]">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center text-sm shadow-lg shadow-[var(--primary)]/20">
                      II
                    </div>
                    EXERCICES D'APPLICATION
                  </h3>

                  <div className="space-y-10">
                    <div className="question-block !border-l-[var(--accent)] !bg-[var(--accent)]/5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-baloo text-xl font-black text-[var(--accent)] flex items-center gap-2">
                          <Mic size={24} /> LECTURE VOCALE (
                          {DIFFICULTIES[examDifficulty].label})
                        </h4>
                        <div className="flex gap-2">
                          <span className="bg-[var(--bg-light)] text-[var(--blue)] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[var(--border)]">
                            C1 /{DIFFICULTIES[examDifficulty].points.c1} pts
                          </span>
                          <span className="bg-[var(--bg-light)] text-[var(--primary)] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[var(--border)]">
                            C5 /{DIFFICULTIES[examDifficulty].points.c5} pts
                          </span>
                        </div>
                      </div>

                      <div className="bg-[var(--card-bg)] p-6 rounded-3xl border-2 border-[var(--accent)]/20 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                            Consigne : Lis ce texte à haute voix en enregistrant
                            ta voix.
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-3 bg-[var(--bg-light)] px-4 py-2 rounded-2xl border border-[var(--border)]">
                              <div className="flex items-center gap-2">
                                <Palette
                                  size={14}
                                  className="text-[var(--text-muted)]"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                  Couleur :
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {[
                                  {
                                    label: "Noir",
                                    value: "var(--text)",
                                    color: "bg-slate-800",
                                  },
                                  {
                                    label: "Bleu",
                                    value: "#1e40af",
                                    color: "bg-blue-800",
                                  },
                                  {
                                    label: "Rouge",
                                    value: "#991b1b",
                                    color: "bg-red-800",
                                  },
                                  {
                                    label: "Vert",
                                    value: "#166534",
                                    color: "bg-green-800",
                                  },
                                  {
                                    label: "Violet",
                                    value: "#6b21a8",
                                    color: "bg-purple-800",
                                  },
                                ].map((c) => (
                                  <button
                                    key={c.value}
                                    onClick={() => setReadingTextColor(c.value)}
                                    className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${c.color} ${readingTextColor === c.value ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-md" : "border-white opacity-60 hover:opacity-100"}`}
                                    title={c.label}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[var(--bg-light)] px-4 py-2 rounded-2xl border border-[var(--border)]">
                              <div className="flex items-center gap-2">
                                <Volume2
                                  size={14}
                                  className="text-[var(--text-muted)]"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                  Modèle :
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {ttsStatus !== "playing" ? (
                                  <button
                                    onClick={() =>
                                      handleTtsPlay(
                                        useCustomReading
                                          ? customReadingText
                                          : DIFFICULTIES[
                                              examDifficulty as keyof typeof DIFFICULTIES
                                            ]?.text || "",
                                      )
                                    }
                                    className="w-7 h-7 flex items-center justify-center bg-[var(--primary)] text-white rounded-lg hover:scale-105 transition-all shadow-sm"
                                    title="Écouter le modèle"
                                  >
                                    <Play size={12} fill="currentColor" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleTtsPause}
                                    className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-lg hover:scale-105 transition-all shadow-sm"
                                    title="Pause"
                                  >
                                    <Pause size={12} fill="currentColor" />
                                  </button>
                                )}
                                <button
                                  onClick={handleTtsStop}
                                  className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-lg hover:scale-105 transition-all shadow-sm"
                                  title="Arrêter"
                                >
                                  <Square size={12} fill="currentColor" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[var(--bg-light)] p-8 rounded-2xl border-2 border-dashed border-[var(--accent)]/30 text-center">
                          <div className="max-w-2xl mx-auto min-h-[100px] flex items-center justify-center">
                            {isIntroRunning ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-3"
                              >
                                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center animate-bounce shadow-lg">
                                  <Volume2 size={24} />
                                </div>
                                <p className="font-baloo text-2xl font-black text-[var(--accent)] uppercase tracking-widest">
                                  Écoute bien le texte...
                                </p>
                              </motion.div>
                            ) : (
                              <div className="w-full text-center">
                                <AnimatedReadingText
                                  text={
                                    useCustomReading
                                      ? customReadingText
                                      : DIFFICULTIES[
                                          examDifficulty as keyof typeof DIFFICULTIES
                                        ]?.text || ""
                                  }
                                  onWordHover={handleWordHover}
                                  activeCharIndex={
                                    speechActiveText ===
                                    (useCustomReading
                                      ? customReadingText
                                      : DIFFICULTIES[
                                          examDifficulty as keyof typeof DIFFICULTIES
                                        ]?.text || "")
                                      ? activeCharIndex
                                      : -1
                                  }
                                  ttsStatus={
                                    speechActiveText ===
                                    (useCustomReading
                                      ? customReadingText
                                      : DIFFICULTIES[
                                          examDifficulty as keyof typeof DIFFICULTIES
                                        ]?.text || "")
                                      ? ttsStatus
                                      : "stopped"
                                  }
                                  fontSize={readingFontSize}
                                  textColor={readingTextColor}
                                  lineHeight={readingLineHeight}
                                  fontClass={getReadingFontClass(readingFont)}
                                  onWordClick={(word) => {
                                    handleAssistantLookup(word);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <AudioRecorder
                        recordingKey={`fiche_${currentFicheId}_${useCustomReading ? "custom" : examDifficulty}`}
                        onMicrophoneError={showMascotMsg}
                        onRecordingSaved={showMascotMsg}
                        lang={langueActive}
                        originalText={
                          useCustomReading
                            ? customReadingText
                            : DIFFICULTIES[
                                examDifficulty as keyof typeof DIFFICULTIES
                              ]?.text || ""
                        }
                      />
                    </div>

                    <Question
                      id="1"
                      points="2"
                      comp="Vocab"
                      text="QCM : Choisis le bon sens pour chaque mot :"
                    >
                      <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 border-2 border-dashed border-[var(--primary)]/30 rounded-3xl p-5 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">💡</span>
                          <div>
                            <h5 className="font-baloo font-black text-base text-[var(--text)]">
                              Entraîne-toi avec l'IA !
                            </h5>
                            <p className="text-xs font-bold text-[var(--text-muted)]">
                              Découvre les définitions simples et des exemples
                              en images/textes 3D.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const firstWord = currentFiche.vocab[0];
                            if (firstWord) {
                              setSelectedVocabWord(firstWord);
                              fetchVocabDetails(firstWord);
                            }
                          }}
                          className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-baloo font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                        >
                          <Sparkles size={16} className="animate-pulse" />
                          <span>Lancer les Flashcards IA 🚀</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        {currentFiche.vocab.map((v) => {
                          const isCorrect =
                            vocabAnswers[
                              `fiche_${currentFicheId}_vocab_${v}`
                            ] === currentFiche.vocabOptions?.[v]?.[0];
                          const currentAnswer =
                            vocabAnswers[`fiche_${currentFicheId}_vocab_${v}`];

                          return (
                            <div
                              key={v}
                              className={`relative overflow-hidden bg-white p-6 rounded-[32px] border-4 transition-all shadow-xl ${isCorrect ? "border-green-400 bg-green-50" : "border-[var(--border)] hover:border-[var(--primary)]"} ${currentFicheId === 1 && !isCorrect ? "ring-4 ring-blue-450 ring-offset-2" : ""}`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <div
                                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer ${isCorrect ? "bg-green-500" : "bg-[var(--primary)]"} ${currentFicheId === 1 && !isCorrect ? "animate-pulse ring-4 ring-[var(--primary)]/30" : ""}`}
                                      onClick={() => speakWord(v)}
                                      title="Écouter la prononciation 🔊"
                                    >
                                      <Volume2 size={24} />
                                    </div>
                                    {currentFicheId === 1 && !isCorrect && (
                                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 text-[10px] font-bold text-white items-center justify-center shadow">
                                          🔊
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <h4
                                      className={`font-baloo text-2xl font-black text-[var(--text)] uppercase tracking-tight cursor-pointer hover:text-[var(--primary)] hover:underline decoration-2 transition-colors inline-block ${currentFicheId === 1 ? "border-b-2 border-dashed border-blue-400 hover:border-blue-500 pb-0.5" : ""}`}
                                      onClick={() => {
                                        setSelectedVocabWord(v);
                                        fetchVocabDetails(v);
                                      }}
                                      title="Clique pour voir la définition et un exemple d'utilisation 💡"
                                    >
                                      {v} {currentFicheId === 1 && "💡"}
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedVocabWord(v);
                                        fetchVocabDetails(v);
                                      }}
                                      className={`flex items-center gap-1 text-[10px] font-black uppercase text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-full border border-[var(--primary)]/20 hover:bg-[var(--primary)] hover:text-white transition-all w-fit cursor-pointer shadow-sm active:scale-95 ${currentFicheId === 1 ? "ring-2 ring-amber-400 animate-pulse" : ""}`}
                                      title="Voir la définition et l'exemple générés par l'IA"
                                    >
                                      <span>💡 Flashcard IA</span>
                                    </button>
                                  </div>
                                </div>
                                {isCorrect && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-green-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/30"
                                  >
                                    C'est juste ! ✨
                                  </motion.div>
                                )}
                              </div>

                              <div className="space-y-3">
                                {(
                                  shuffledVocabOptions[v] ||
                                  currentFiche.vocabOptions?.[v] ||
                                  []
                                ).map((opt, idx) => {
                                  const isSelected = currentAnswer === opt;
                                  const isOptionCorrect =
                                    opt === currentFiche.vocabOptions?.[v]?.[0];

                                  // Formatting: Split definition and example if possible
                                  const parts = opt.split(". Exemple : ");
                                  const definition = parts[0];
                                  const example = parts[1];

                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setVocabAnswers((prev) => ({
                                          ...prev,
                                          [`fiche_${currentFicheId}_vocab_${v}`]:
                                            opt,
                                        }));
                                        if (isOptionCorrect) {
                                          showMascotMsg(
                                            `Bravo ! "${v}" est bien ${definition.toLowerCase()}. 🌟`,
                                          );
                                        }
                                      }}
                                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all group relative ${
                                        isSelected
                                          ? isOptionCorrect
                                            ? "bg-green-500 text-white border-green-600 scale-[1.02] shadow-lg shadow-green-500/20"
                                            : "bg-red-100 text-red-600 border-red-300"
                                          : "bg-[var(--bg-light)] border-[var(--border)] hover:border-[var(--primary)] hover:bg-white"
                                      } ${currentFicheId === 1 && !isSelected && !isCorrect ? "hover:scale-[1.01] hover:ring-2 hover:ring-blue-400" : ""}`}
                                    >
                                      {currentFicheId === 1 &&
                                        !isSelected &&
                                        !isCorrect && (
                                          <span className="absolute top-2 right-2 text-[8px] font-black bg-blue-100/90 text-blue-700 border border-blue-200/50 px-1.5 py-0.5 rounded-full uppercase tracking-wider select-none shadow-sm animate-pulse-subtle">
                                            🖱️ Choisir
                                          </span>
                                        )}
                                      <div className="flex items-start gap-3">
                                        <div
                                          className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? "bg-white border-transparent" : "border-[var(--border)] group-hover:border-[var(--primary)]"}`}
                                        >
                                          {isSelected && (
                                            <div
                                              className={`w-2 h-2 rounded-full ${isOptionCorrect ? "bg-green-500" : "bg-red-500"}`}
                                            />
                                          )}
                                        </div>
                                        <div>
                                          <p
                                            className={`text-sm font-bold leading-tight ${isSelected ? "text-inherit" : "text-[var(--text)]"}`}
                                          >
                                            {definition}
                                          </p>
                                          {example && (
                                            <p
                                              className={`mt-1 text-[11px] italic font-medium opacity-80 ${isSelected ? "text-inherit" : "text-[var(--primary)]"}`}
                                            >
                                              ✨ {example}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {!currentFiche.vocabOptions?.[v] && (
                                <div className="mt-4">
                                  <input
                                    type="text"
                                    className="w-full bg-white p-4 rounded-2xl border-2 border-dashed border-[var(--border)] text-sm font-medium focus:border-[var(--primary)] outline-none transition-all"
                                    placeholder="Écris la définition ici..."
                                    value={
                                      vocabAnswers[
                                        `fiche_${currentFicheId}_vocab_${v}`
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      setVocabAnswers((prev) => ({
                                        ...prev,
                                        [`fiche_${currentFicheId}_vocab_${v}`]:
                                          e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              )}

                              <div className="absolute -bottom-2 -right-2 transform rotate-12 opacity-10">
                                <BookMarked size={80} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Question>
                  </div>

                  {/* Seyès Section integrated here */}
                  <div className="exam-paper !shadow-none !border-0 !p-0 mt-20 pt-10 border-t-2 border-dashed border-[var(--border)]">
                    <h3 className="font-baloo text-xl font-bold mb-6 flex items-center gap-3 text-[var(--primary)]">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center text-sm shadow-lg shadow-[var(--primary)]/20">
                        III
                      </div>
                      RÉDACTION (Seyès - 5 points)
                    </h3>

                    <div className="mb-6 flex gap-2">
                      <button
                        onClick={() => diagnoseWithAI("redaction")}
                        disabled={isAiLoading}
                        className={`flex-1 py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAiLoading ? "bg-gray-200 text-gray-400" : "bg-white text-[var(--primary)] border-2 border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white shadow-lg"}`}
                      >
                        {isAiLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <SearchCheck size={16} />
                        )}
                        Trouver mes fautes (Sans corriger!)
                      </button>
                    </div>

                    {aiFeedback.redaction && (
                      <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-[32px]">
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertCircle size={14} /> Mots à vérifier :
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {aiFeedback.redaction.split(",").map((word, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white border-2 border-red-200 text-red-600 font-bold rounded-full text-xs underline decoration-dotted decoration-2 underline-offset-4"
                            >
                              {word.trim()}
                            </span>
                          ))}
                        </div>
                        <p className="mt-4 text-[10px] font-bold text-red-400/80 italic">
                          L'IA a trouvé ces erreurs. À toi de chercher comment
                          les écrire correctement ! 💪
                        </p>
                      </div>
                    )}

                    <div
                      className={`mb-8 p-6 rounded-3xl border-2 border-dashed transition-all ${image ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] bg-[var(--bg-light)]"}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                          <ImageIcon size={14} /> Modèle d&apos;écriture
                        </p>
                        <div className="flex gap-4">
                          <label className="text-[10px] text-[var(--blue)] hover:text-[var(--primary)] flex items-center gap-1 transition-colors uppercase font-bold tracking-tighter cursor-pointer">
                            <Plus size={14} /> Importer
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) =>
                                    setImage(ev.target?.result as string);
                                  reader.readAsDataURL(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          {image && (
                            <button
                              onClick={() => setImage(null)}
                              className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors uppercase font-bold tracking-tighter"
                            >
                              <Trash2 size={14} /> Supprimer
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="relative aspect-video max-h-64 bg-[var(--bg-dark)] rounded-2xl border-4 border-[var(--border)] flex items-center justify-center overflow-hidden mx-auto shadow-xl group">
                        {image ? (
                          <img
                            src={image}
                            alt="Modèle"
                            className="object-contain w-full h-full"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center p-8 opacity-40">
                            <ImageIcon size={48} className="mx-auto mb-2" />
                            <p className="text-xs font-bold italic uppercase tracking-tighter">
                              Aucun modèle inséré
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--card-bg)] rounded-t-3xl border-2 border-b-0 border-[var(--border)] no-print">
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="bg-[var(--bg-light)] text-[var(--text)] px-4 py-2 rounded-2xl text-xs font-bold border-2 border-[var(--border)] outline-none focus:border-[var(--primary)] transition-all shadow-sm"
                      >
                        <option value="Playwrite FR Trad">
                          Écolier Traditionnel
                        </option>
                        <option value="Playwrite FR Moderne">
                          Écolier Moderne
                        </option>
                        <option value="Playwrite DE Grund">
                          Cursif Scolaire
                        </option>
                        <option value="Cedarville Cursive">Plume Fine</option>
                      </select>

                      <div className="flex items-center gap-2 bg-[var(--bg-light)] px-4 py-2 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                        <button
                          onClick={() =>
                            setFontSize(Math.max(16, fontSize - 2))
                          }
                          className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-black w-8 text-center text-[var(--primary)]">
                          {fontSize}
                        </span>
                        <button
                          onClick={() =>
                            setFontSize(Math.min(48, fontSize + 2))
                          }
                          className="p-1 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="seyes-paper !mt-0 !rounded-t-none !rounded-b-3xl">
                      <textarea
                        value={evalAnswers.redaction || ""}
                        onChange={(e) =>
                          setEvalAnswers((prev) => ({
                            ...prev,
                            redaction: e.target.value,
                          }))
                        }
                        className="seyes-textarea !bg-transparent outline-none ring-0 w-full"
                        placeholder="Fais ta rédaction ici..."
                        spellCheck={false}
                        style={{
                          fontSize: `${fontSize}px`,
                          fontFamily: selectedFont,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : examTab === "dictee" ? (
                <div className="exam-paper mb-10 !rounded-t-none border-t-0 p-10 bg-amber-50 shadow-inner border-x-4 border-b-4 border-amber-400">
                  <div className="text-center mb-8">
                    <h3 className="font-baloo text-3xl font-black text-amber-600 flex items-center justify-center gap-2">
                      <Volume2 className="animate-bounce" size={32} /> 🔊 LA
                      DICTÉE INTERACTIVE
                    </h3>
                    <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">
                      Fiche {currentFicheId} • Remplis les mots manquants
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-[36px] border-4 border-amber-200 shadow-xl max-w-3xl mx-auto space-y-8">
                    {/* Info box */}
                    <div className="bg-amber-50/50 p-6 rounded-2xl border-2 border-dashed border-amber-300 text-center space-y-2 animate-pulse-subtle">
                      <p className="text-xs font-bold text-amber-800">
                        💡 Instructions : Écoute chaque mot en cliquant sur
                        l'icône de haut-parleur{" "}
                        <Volume2
                          size={14}
                          className="inline mx-1 text-amber-600 animate-pulse"
                        />
                        , puis écris-le correctement dans l'espace vide.
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Une fois tous les mots saisis, clique sur "Vérifier ma
                        dictée". Les mots corrects deviendront{" "}
                        <span className="text-green-600 font-bold">verts</span>{" "}
                        et les faux deviendront{" "}
                        <span className="text-red-500 font-bold">rouges</span>.
                      </p>

                      {/* Play Full Dictation Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const dictStr =
                              FICHES[currentFicheId].dictation?.text || "";
                            const spokenText = dictStr.replace(/__/g, " _ ");
                            const utterance = new SpeechSynthesisUtterance(
                              spokenText,
                            );
                            utterance.lang = "fr-FR";
                            utterance.lang =
                              langueActive === "en" ? "en-US" : "fr-FR";
                            utterance.rate = 0.75;
                            selectFrenchVoice(utterance);
                            window.speechSynthesis.speak(utterance);
                            showMascotMsg(
                              langueActive === "en"
                                ? "Listen carefully to the full text! 🎧"
                                : "Écoute attentivement le texte complet ! 🎧",
                            );
                          }}
                          className={`inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer ${currentFicheId === 1 ? "animate-[pulse_1.5s_infinite] ring-4 ring-amber-500/40 scale-102 font-black shadow-amber-305" : ""}`}
                        >
                          <Volume2 size={14} /> Écouter toute la dictée 🎧
                        </button>
                      </div>
                    </div>

                    {/* Interactive Dictation Text */}
                    <div className="p-4 leading-[3.2] flex flex-wrap items-center gap-x-2 gap-y-6 text-lg font-medium text-[var(--text)]">
                      {FICHES[currentFicheId].dictation?.text
                        .split("__")
                        .map((part, i, arr) => {
                          const correctWord =
                            FICHES[currentFicheId].dictation?.words[i] || "";
                          const ansKey = `fiche_${currentFicheId}_dictation_${i}`;
                          const userVal = dictationAnswers[ansKey] || "";
                          const isSubmitted =
                            dictationAnswers[`submitted_${currentFicheId}`] ===
                            "true";

                          const isWordCorrect =
                            userVal.toLowerCase().trim() ===
                            correctWord.toLowerCase().trim();
                          const statusClass = !isSubmitted
                            ? "border-amber-300 focus:border-amber-500 hover:border-amber-400 focus:ring-4 focus:ring-amber-200"
                            : isWordCorrect
                              ? "border-green-500 bg-green-50 text-green-700 font-black"
                              : "border-red-500 bg-red-50 text-red-700 font-black line-through decoration-red-400";

                          return (
                            <React.Fragment key={i}>
                              <span className="whitespace-pre">{part}</span>
                              {i < arr.length - 1 && (
                                <div className="inline-flex items-center gap-1.5 relative mx-1 mt-1 group">
                                  <input
                                    type="text"
                                    id={`input-fiche-${currentFicheId}-dictation-${i}`}
                                    onFocus={() => {
                                      playWord(correctWord);
                                      showMascotMsg(
                                        `Écoute le mot manquant nº${i + 1} ! 🔊🏽`,
                                      );
                                    }}
                                    value={userVal}
                                    onChange={(e) => {
                                      setDictationAnswers((prev) => ({
                                        ...prev,
                                        [ansKey]: e.target.value,
                                        [`submitted_${currentFicheId}`]:
                                          "false",
                                      }));
                                    }}
                                    disabled={isSubmitted && isWordCorrect}
                                    className={`w-36 px-3 py-1 bg-amber-50/20 border-2 border-dashed rounded-xl text-center font-bold text-[var(--text)] outline-none transition-all placeholder:text-amber-200 placeholder:font-normal text-base ${statusClass}`}
                                    placeholder="???"
                                  />

                                  <button
                                    onClick={() => {
                                      playWord(correctWord);
                                      showMascotMsg(
                                        `Écoute le mot manquant nº${i + 1} ! 🔊`,
                                      );
                                    }}
                                    type="button"
                                    className={`w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-700 flex items-center justify-center transition-all shadow-sm cursor-pointer relative ${currentFicheId === 1 ? "ring-2 ring-amber-400 animate-[pulse_1.5s_infinite]" : ""}`}
                                    title="Réécouter ce mot"
                                  >
                                    <Volume2 size={13} />
                                    {currentFicheId === 1 && (
                                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 font-extrabold text-white text-[7px] flex items-center justify-center">
                                          🔊
                                        </span>
                                      </span>
                                    )}
                                  </button>

                                  {isSubmitted && !isWordCorrect && (
                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                                      Correction : {correctWord}
                                    </span>
                                  )}
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        onClick={() => {
                          const updatedAnswers = { ...dictationAnswers };
                          updatedAnswers[`submitted_${currentFicheId}`] =
                            "false";
                          FICHES[currentFicheId].dictation?.words.forEach(
                            (_, idx) => {
                              updatedAnswers[
                                `fiche_${currentFicheId}_dictation_${idx}`
                              ] = "";
                            },
                          );
                          setDictationAnswers(updatedAnswers);
                          showMascotMsg(
                            "C'est réinitialisé ! À toi de jouer ! 🌟✍️",
                          );
                        }}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        🔄 Réinitialiser
                      </button>

                      <button
                        onClick={() => {
                          const words =
                            FICHES[currentFicheId].dictation?.words || [];
                          let correctCount = 0;
                          words.forEach((correctWord, idx) => {
                            const userVal =
                              dictationAnswers[
                                `fiche_${currentFicheId}_dictation_${idx}`
                              ] || "";
                            if (
                              userVal.toLowerCase().trim() ===
                              correctWord.toLowerCase().trim()
                            ) {
                              correctCount++;
                            }
                          });

                          setDictationAnswers((prev) => ({
                            ...prev,
                            [`submitted_${currentFicheId}`]: "true",
                          }));

                          incrementAttempt(
                            `fiche_${currentFicheId}_dictation_attempt`,
                          );

                          if (correctCount === words.length) {
                            showMascotMsg(
                              `🏆 MAGNIFIQUE ! Sans faute (${correctCount}/${words.length}) ! Tu es un virtuose de la dictée !`,
                            );
                          } else if (correctCount > 0) {
                            showMascotMsg(
                              `👍 Bon travail ! Tu as trouvé ${correctCount} sur ${words.length} mots. Regarde les corrections et réessaie !`,
                            );
                          } else {
                            showMascotMsg(
                              "❌ Oups ! Réécoute bien chaque mot avant d'écrire. Courage !",
                            );
                          }
                        }}
                        className={`px-10 py-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/30 cursor-pointer ${currentFicheId === 1 ? "ring-4 ring-amber-400 animate-pulse-subtle" : ""}`}
                      >
                        🏁 Vérifier ma dictée
                      </button>
                    </div>
                  </div>
                </div>
              ) : examTab === "evaluation" ? (
                <div className="exam-paper mb-10 !rounded-t-none border-t-0 p-6 md:p-10 bg-amber-50/40 shadow-xl border-x-4 border-b-4 border-amber-400 rounded-b-[40px] relative overflow-hidden">
                  {/* Background decor */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-amber-400 to-yellow-400" />
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-400/5 rounded-full pointer-events-none" />

                  {(() => {
                    const exam = getExam(currentFicheId, currentFiche?.title);
                    const keyPrefix = `exam_${currentFicheId}`;

                    // Calculate score preview under real-time conditions
                    let realTimeQcmScore = 0;
                    exam.qcm.forEach((q, idx) => {
                      const ans = evalAnswers[`${keyPrefix}_qcm_${idx}`] || "";
                      if (
                        ans.toLowerCase().trim() ===
                        q.answer.toLowerCase().trim()
                      ) {
                        realTimeQcmScore += 5 / exam.qcm.length;
                      }
                    });

                    let realTimeLangueScore = 0;
                    exam.langue.forEach((q, idx) => {
                      const ans =
                        evalAnswers[`${keyPrefix}_langue_${idx}`] || "";
                      if (
                        ans.toLowerCase().trim() ===
                        q.answer.toLowerCase().trim()
                      ) {
                        realTimeLangueScore += 5 / exam.langue.length;
                      }
                    });

                    // Detect used words for Redaction
                    const redactionVal =
                      evalAnswers[`${keyPrefix}_redaction`] || "";
                    const usedWords =
                      exam.redaction?.mandatoryWords.filter((word) =>
                        redactionVal.toLowerCase().includes(word.toLowerCase()),
                      ) || [];

                    const writingLengthPoints =
                      redactionVal.trim().length >= 15 ? 2 : 0;
                    const keywordPoints = Math.min(3, usedWords.length * 1);
                    const realTimeRedactionScore =
                      writingLengthPoints + keywordPoints;

                    const isAlreadyCompleted = !!scores[currentFicheId];
                    const completedScore = scores[currentFicheId]?.total ?? 0;

                    return (
                      <div className="relative">
                        {/* Banner & Header */}
                        <div className="text-center pb-8 mb-8 border-b-4 border-dashed border-amber-200">
                          <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md">
                            📝 Épreuve Académique Officielle
                          </div>
                          <h3 className="font-baloo text-3xl md:text-4xl font-black text-amber-900 mt-3 uppercase tracking-tight">
                            📋 {exam.title}
                          </h3>
                          <p className="text-xs font-bold text-amber-800 tracking-wider mt-1.5 font-nunito flex items-center justify-center gap-1.5 font-mono">
                            🏫 Module d'Examen Intégral • Barème sur 20 points
                          </p>
                        </div>

                        {/* Student ID Desk Bar */}
                        <div className="bg-white/85 backdrop-blur-sm p-4 rounded-3xl border-2 border-amber-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-xs font-black text-amber-900 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-base">🧑‍🎓</span> Élève :{" "}
                            <span className="text-[var(--primary)]">
                              {currentUser?.name || "Invité"}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 border-y-2 border-amber-100 md:border-y-0 md:border-x-2 py-2 md:py-0">
                            <span className="text-base">📅</span> Date :{" "}
                            {new Date().toLocaleDateString("fr-FR")}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-base">🏆</span> Statut :&nbsp;
                            {isAlreadyCompleted ? (
                              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-[10px]">
                                Examen Validé ({completedScore.toFixed(1)}/20)
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] animate-pulse">
                                En Cours...
                              </span>
                            )}
                          </div>
                        </div>

                        {isAlreadyCompleted && (
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-gradient-to-br from-green-550/10 to-teal-550/10 border-[3px] border-green-500/20 rounded-[32px] p-6 text-center max-w-2xl mx-auto mb-10 shadow-lg relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                            <span className="text-5xl block mb-2">🏅</span>
                            <h4 className="font-baloo text-2xl font-black text-green-900 uppercase">
                              Félicitations ! Ton Examen est enregistré !
                            </h4>
                            <p className="text-xs text-green-800 font-bold mb-4">
                              Note finale de ta feuille de copie :
                            </p>
                            <div className="inline-block bg-white border-4 border-green-500 rounded-full px-8 py-4 font-baloo text-4xl font-black text-green-600 shadow-md mb-4">
                              {completedScore.toFixed(1)} / 20
                            </div>
                            <p className="text-[11px] font-bold text-green-700/80 max-w-md mx-auto leading-relaxed mb-6">
                              {completedScore >= 16
                                ? "🎯 Travail exceptionnel ! Tu as parfaitement assimilé le texte, le lexique, la grammaire et l'expression écrite de cette fiche !"
                                : completedScore >= 12
                                  ? "⭐ Bon travail ! Tu as atteint le seuil de maîtrise. Tu peux réviser pour tenter de décrocher un 20/20 parfait !"
                                  : "📈 Ne te décourage pas, l'apprentissage demande de l'entraînement. N'hésite pas à le repasser pour t'améliorer !"}
                            </p>
                            <div className="flex justify-center gap-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setScores((prev) => {
                                    const updated = { ...prev };
                                    delete updated[currentFicheId];
                                    return updated;
                                  });
                                  showMascotMsg(
                                    "C'est parti ! Tu peux maintenant remplir à nouveau ta copie d'examen ! 🔄📝",
                                  );
                                }}
                                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-black uppercase rounded-2xl transition-all shadow-md cursor-pointer"
                              >
                                🔄 Repasser l'examen
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  showMascotMsg(
                                    "Voici ta copie avec toutes tes réponses ! 📜🔍",
                                  );
                                }}
                                className="px-6 py-2.5 bg-white border-2 border-green-500 text-green-700 hover:bg-green-50/50 text-xs font-black uppercase rounded-2xl transition-all shadow-sm cursor-pointer"
                              >
                                👁️ Consulter mes réponses ci-dessous
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* PARTIE 1: COMPRÉHENSION DE L'ÉCRIT */}
                        <div className="space-y-6 max-w-4xl mx-auto mb-10">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-baloo text-lg font-black text-blue-900 uppercase tracking-tight">
                              📚 Partie I : Compréhension Globale (QCM)
                            </h4>
                            <p className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">
                              Compétence C2 • Barème : 5 points (Choix
                              multiples)
                            </p>
                          </div>

                          <div className="grid gap-6">
                            {exam.qcm.map((q, idx) => {
                              const inputKey = `${keyPrefix}_qcm_${idx}`;
                              const selectedAnswer =
                                evalAnswers[inputKey] || "";
                              return (
                                <div
                                  key={idx}
                                  className="bg-white p-5 rounded-3xl border-2 border-gray-100 hover:border-blue-400 transition-all shadow-sm"
                                >
                                  <p className="font-bold text-gray-850 text-sm mb-4">
                                    {idx + 1}. {q.q}
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                    {q.choices.map((c) => {
                                      const isSelected = selectedAnswer === c;
                                      const showResult =
                                        isAlreadyCompleted ||
                                        (isTrainingMode && !!selectedAnswer);
                                      const isCorrectAnswer = c === q.answer;
                                      return (
                                        <button
                                          key={c}
                                          type="button"
                                          disabled={
                                            isAlreadyCompleted ||
                                            (isTrainingMode && !!selectedAnswer)
                                          }
                                          onClick={() => {
                                            setEvalAnswers((prev) => ({
                                              ...prev,
                                              [inputKey]: c,
                                            }));
                                            if (isTrainingMode) {
                                              fetchExplanation(
                                                inputKey,
                                                c,
                                                q.answer,
                                                q.q,
                                                exam.title,
                                                "QCM",
                                              );
                                            }
                                          }}
                                          className={`p-3 rounded-2xl border-2 font-bold text-xs transition-all cursor-pointer relative ${
                                            isSelected &&
                                            showResult &&
                                            isCorrectAnswer
                                              ? "bg-green-500 text-white border-green-500 shadow-md"
                                              : isSelected &&
                                                  showResult &&
                                                  !isCorrectAnswer
                                                ? "bg-red-500 text-white border-red-500"
                                                : !isSelected &&
                                                    showResult &&
                                                    isCorrectAnswer
                                                  ? "bg-green-100 text-green-800 border-green-300"
                                                  : isSelected
                                                    ? "bg-blue-500 text-white border-blue-500 shadow-md scale-[1.01]"
                                                    : "bg-slate-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-white"
                                          } ${currentFicheId === 1 && !isSelected && !showResult ? "hover:scale-[1.02] hover:ring-2 hover:ring-blue-450" : ""}`}
                                        >
                                          {c}
                                          {currentFicheId === 1 &&
                                            !isSelected &&
                                            !showResult && (
                                              <span className="absolute top-1 right-1 text-[8px] font-black bg-blue-100/90 text-blue-700 border border-blue-200/50 px-1.5 py-0.5 rounded-full uppercase scale-90 tracking-wider">
                                                🖱️ Choisir
                                              </span>
                                            )}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Action Mode Entraînement Explanation */}
                                  {isTrainingMode && selectedAnswer && (
                                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-xs font-bold text-green-950 animate-fadeIn space-y-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-base">
                                          {selectedAnswer === q.answer
                                            ? "🎉"
                                            : "🧐"}
                                        </span>
                                        <span className="font-extrabold uppercase text-[10px] tracking-widest text-emerald-900">
                                          {selectedAnswer === q.answer
                                            ? "Bonne réponse !"
                                            : "Regarde l'explication :"}
                                        </span>
                                      </div>
                                      {explainMap[inputKey]?.loading ? (
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] italic">
                                          <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                                          Rédaction de l'explication...
                                        </div>
                                      ) : (
                                        <p className="leading-relaxed font-nunito text-slate-800">
                                          {explainMap[inputKey]?.explanation}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* PARTIE 2: QUESTIONS OUVERTES */}
                        <div className="space-y-6 max-w-4xl mx-auto mb-10">
                          <div className="border-l-4 border-emerald-500 pl-4">
                            <h4 className="font-baloo text-lg font-black text-emerald-950 uppercase tracking-tight">
                              ✍️ Partie II : Questions Ouvertes (Rédiger)
                            </h4>
                            <p className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">
                              Compétence C3 • Barème : 5 points (Rédaction de
                              phrases)
                            </p>
                          </div>

                          <div className="grid gap-6">
                            {exam.open.map((q, idx) => {
                              const inputKey = `${keyPrefix}_open_${idx}`;
                              const userVal = evalAnswers[inputKey] || "";
                              const isFilled = userVal.length > 5;
                              return (
                                <div
                                  key={idx}
                                  className="bg-white p-5 rounded-3xl border-2 border-gray-100 hover:border-emerald-400 transition-all shadow-sm space-y-3"
                                >
                                  <p className="font-bold text-gray-800 text-sm">
                                    {idx + 1}. {q.q}
                                  </p>
                                  <div className="relative">
                                    <textarea
                                      disabled={isAlreadyCompleted}
                                      value={userVal}
                                      onChange={(e) =>
                                        setEvalAnswers((prev) => ({
                                          ...prev,
                                          [inputKey]: e.target.value,
                                        }))
                                      }
                                      placeholder={
                                        q.placeholder ||
                                        "Écris ta réponse complète ici..."
                                      }
                                      rows={2}
                                      className="w-full bg-slate-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-xs text-gray-700 outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none shadow-inner"
                                    />
                                    {isFilled && !isAlreadyCompleted && (
                                      <div className="slate-pill absolute right-3 bottom-3 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                                        Saisie Validée
                                      </div>
                                    )}
                                  </div>

                                  {isTrainingMode && !isAlreadyCompleted && (
                                    <div className="space-y-3 pt-1">
                                      <button
                                        type="button"
                                        disabled={userVal.trim().length < 5}
                                        onClick={() => {
                                          fetchExplanation(
                                            inputKey,
                                            userVal,
                                            `Mots attendus dans le récit : ${q.keywords.join(", ")}`,
                                            q.q,
                                            exam.title,
                                            "Question Ouverte",
                                          );
                                        }}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                                      >
                                        💡 Vérifier ma réponse & Voir
                                        l'explication
                                      </button>

                                      {explainMap[inputKey] && (
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-55/40 to-green-55/40 border-2 border-emerald-200 text-xs text-emerald-950 font-bold space-y-3 animate-fadeIn">
                                          <div className="flex flex-wrap gap-1.5 items-center">
                                            <span className="text-[10px] uppercase font-black text-emerald-900 mr-1">
                                              📌 Liste des Mots-clés attendus :
                                            </span>
                                            {q.keywords.map((word) => {
                                              const found = userVal
                                                .toLowerCase()
                                                .includes(word.toLowerCase());
                                              return (
                                                <span
                                                  key={word}
                                                  className={`text-[9px] px-2.5 py-0.5 rounded-full border font-black ${found ? "bg-green-500 text-white border-green-500 shadow-sm" : "bg-slate-100 text-gray-400 border-gray-200 line-through opacity-70"}`}
                                                >
                                                  {found ? "✓" : "✗"} {word}
                                                </span>
                                              );
                                            })}
                                          </div>
                                          {explainMap[inputKey].loading ? (
                                            <div className="flex items-center gap-2 text-[var(--text-muted)] italic">
                                              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full" />
                                              Le professeur examine ta phrase...
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              <div className="text-[10px] uppercase font-black tracking-widest text-emerald-900 flex items-center gap-1">
                                                <span>🧑‍🏫</span> Commentaire de
                                                correction :
                                              </div>
                                              <p className="leading-relaxed text-slate-800 font-nunito">
                                                {
                                                  explainMap[inputKey]
                                                    .explanation
                                                }
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {isAlreadyCompleted && (
                                    <div className="bg-emerald-50/70 p-4 border-l-4 border-emerald-400 rounded-r-2xl text-[11px] font-bold text-emerald-800 animate-fadeIn">
                                      📌 <strong>Mots attendus :</strong>{" "}
                                      {q.keywords
                                        .map((w) => `"${w}"`)
                                        .join(", ")}{" "}
                                      <br />
                                      💡 <strong>
                                        Aide à la correction :
                                      </strong>{" "}
                                      Ta réponse doit correspondre à l'histoire
                                      et utiliser le vocabulaire de la leçon.
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* PARTIE 3: EXERCICES DE LANGUE */}
                        <div className="space-y-6 max-w-4xl mx-auto mb-10">
                          <div className="border-l-4 border-purple-500 pl-4">
                            <h4 className="font-baloo text-lg font-black text-purple-900 uppercase tracking-tight">
                              ⚡ Partie III : Exercices de Langue (Grammaire)
                            </h4>
                            <p className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">
                              Conjugaison, Synonymes & Orthographe • Barème : 5
                              points
                            </p>
                          </div>

                          <div className="grid gap-6">
                            {exam.langue.map((q, idx) => {
                              const inputKey = `${keyPrefix}_langue_${idx}`;
                              const userVal = evalAnswers[inputKey] || "";
                              return (
                                <div
                                  key={idx}
                                  className="bg-white p-5 rounded-3xl border-2 border-gray-100 hover:border-purple-400 transition-all shadow-sm space-y-4"
                                >
                                  <div>
                                    <p className="font-bold text-gray-850 text-sm">
                                      {idx + 1}. {q.q}
                                    </p>
                                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-1 inline-block font-mono">
                                      Consigne : {q.instruction}
                                    </span>
                                  </div>

                                  {q.type === "select" ? (
                                    <div className="space-y-4">
                                      <div className="flex flex-wrap gap-2">
                                        {q.choices?.map((c) => {
                                          const isSelected = userVal === c;
                                          const showResult =
                                            isAlreadyCompleted ||
                                            (isTrainingMode && !!userVal);
                                          const isCorrectAnswer =
                                            c === q.answer;
                                          return (
                                            <button
                                              key={c}
                                              type="button"
                                              disabled={
                                                isAlreadyCompleted ||
                                                (isTrainingMode && !!userVal)
                                              }
                                              onClick={() => {
                                                setEvalAnswers((prev) => ({
                                                  ...prev,
                                                  [inputKey]: c,
                                                }));
                                                if (isTrainingMode) {
                                                  fetchExplanation(
                                                    inputKey,
                                                    c,
                                                    q.answer,
                                                    q.q,
                                                    exam.title,
                                                    "Grammaire",
                                                  );
                                                }
                                              }}
                                              className={`px-4 py-2.5 rounded-xl border-2 font-black text-xs transition-all cursor-pointer relative ${
                                                isSelected &&
                                                showResult &&
                                                isCorrectAnswer
                                                  ? "bg-green-500 text-white border-green-500 shadow-sm"
                                                  : isSelected &&
                                                      showResult &&
                                                      !isCorrectAnswer
                                                    ? "bg-red-500 text-white border-red-500"
                                                    : !isSelected &&
                                                        showResult &&
                                                        isCorrectAnswer
                                                      ? "bg-green-50 text-green-700 border-green-300"
                                                      : isSelected
                                                        ? "bg-purple-500 text-white border-purple-500 shadow-md scale-102"
                                                        : "bg-white text-gray-550 border-gray-250 hover:border-purple-300 hover:text-purple-700"
                                              } ${currentFicheId === 1 && !isSelected && !showResult ? "hover:scale-102 hover:ring-2 hover:ring-purple-450" : ""}`}
                                            >
                                              {c}
                                              {currentFicheId === 1 &&
                                                !isSelected &&
                                                !showResult && (
                                                  <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-purple-100 text-purple-750 border border-purple-200/50 px-1.5 py-0.5 rounded-full uppercase scale-90 tracking-wider shadow-sm z-10">
                                                    🖱️ Choisir
                                                  </span>
                                                )}
                                            </button>
                                          );
                                        })}
                                      </div>

                                      {isTrainingMode && userVal && (
                                        <div className="mt-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 text-xs font-bold text-purple-950 animate-fadeIn space-y-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-base">
                                              {userVal === q.answer
                                                ? "🎉"
                                                : "🧐"}
                                            </span>
                                            <span className="font-extrabold uppercase text-[10px] tracking-widest text-purple-900">
                                              {userVal === q.answer
                                                ? "Explication de grammaire :"
                                                : "Regarde l'astuce :"}
                                            </span>
                                          </div>
                                          {explainMap[inputKey]?.loading ? (
                                            <div className="flex items-center gap-2 text-[var(--text-muted)] italic">
                                              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full" />
                                              Recherche de la règle...
                                            </div>
                                          ) : (
                                            <p className="leading-relaxed font-nunito text-slate-800">
                                              {
                                                explainMap[inputKey]
                                                  ?.explanation
                                              }
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      <div className="relative">
                                        <input
                                          type="text"
                                          disabled={
                                            isAlreadyCompleted ||
                                            (isTrainingMode &&
                                              !!explainMap[
                                                `submitted_${inputKey}`
                                              ])
                                          }
                                          value={userVal}
                                          onChange={(e) =>
                                            setEvalAnswers((prev) => ({
                                              ...prev,
                                              [inputKey]: e.target.value,
                                            }))
                                          }
                                          placeholder="Entre ton mot ou ta réponse..."
                                          className={`w-full bg-slate-50 border-2 rounded-2xl p-3.5 font-bold text-xs text-gray-700 outline-none transition-all ${
                                            isAlreadyCompleted &&
                                            userVal.toLowerCase().trim() ===
                                              q.answer.toLowerCase().trim()
                                              ? "border-green-500 bg-green-50/50 text-green-700"
                                              : isAlreadyCompleted
                                                ? "border-red-400 bg-red-50/50 text-red-700"
                                                : "focus:border-purple-500 focus:bg-white border-gray-200"
                                          }`}
                                        />
                                        {isAlreadyCompleted && (
                                          <div
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black ${userVal.toLowerCase().trim() === q.answer.toLowerCase().trim() ? "text-green-600" : "text-red-500"}`}
                                          >
                                            {userVal.toLowerCase().trim() ===
                                            q.answer.toLowerCase().trim()
                                              ? "✓ Réussi"
                                              : `Corrigé : "${q.answer}"`}
                                          </div>
                                        )}
                                      </div>

                                      {isTrainingMode &&
                                        !isAlreadyCompleted && (
                                          <div>
                                            <button
                                              type="button"
                                              disabled={
                                                userVal.trim().length === 0
                                              }
                                              onClick={() => {
                                                fetchExplanation(
                                                  inputKey,
                                                  userVal,
                                                  q.answer,
                                                  q.q,
                                                  exam.title,
                                                  "Grammaire/Conjugaison",
                                                );
                                                setExplainMap((prev) => ({
                                                  ...prev,
                                                  [`submitted_${inputKey}`]: {
                                                    explanation: "checked",
                                                    loading: false,
                                                  },
                                                }));
                                              }}
                                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-black uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                                            >
                                              💡 Vérifier ma réponse & Voir
                                              l'explication
                                            </button>

                                            {explainMap[inputKey] && (
                                              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 text-xs font-bold text-purple-950 animate-fadeIn space-y-2">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-base">
                                                    {userVal
                                                      .toLowerCase()
                                                      .trim() ===
                                                    q.answer
                                                      .toLowerCase()
                                                      .trim()
                                                      ? "🎉"
                                                      : "🧐"}
                                                  </span>
                                                  <span className="font-extrabold uppercase text-[10px] tracking-widest text-purple-955">
                                                    {userVal
                                                      .toLowerCase()
                                                      .trim() ===
                                                    q.answer
                                                      .toLowerCase()
                                                      .trim()
                                                      ? "Parfait ! C'est juste :"
                                                      : "Regarde l'explication :"}
                                                  </span>
                                                </div>
                                                {explainMap[inputKey]
                                                  ?.loading ? (
                                                  <div className="flex items-center gap-2 text-[var(--text-muted)] italic">
                                                    <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full" />
                                                    Vérification de la
                                                    réponse...
                                                  </div>
                                                ) : (
                                                  <p className="leading-relaxed font-nunito text-slate-800 animate-fadeIn">
                                                    {
                                                      explainMap[inputKey]
                                                        ?.explanation
                                                    }
                                                  </p>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* PARTIE 4: RÉDACTION DIRIGÉE */}
                        <div className="space-y-6 max-w-4xl mx-auto mb-10">
                          <div className="border-l-4 border-rose-500 pl-4">
                            <h4 className="font-baloo text-lg font-black text-rose-950 uppercase tracking-tight">
                              🎨 Partie IV : Rédaction Dirigée (Expression)
                            </h4>
                            <p className="text-[10px] uppercase font-bold text-gray-450 tracking-wider">
                              Production écrite autonome • Barème : 5 points
                            </p>
                          </div>

                          <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-gray-100 hover:border-rose-400 transition-all shadow-sm space-y-5">
                            <p className="font-bold text-gray-850 text-sm leading-relaxed">
                              {exam.redaction?.prompt}
                            </p>

                            {/* Interactive Tag Lighting */}
                            <div>
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2.5">
                                🏷️ Mots obligatoires à utiliser dans ton texte :
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {exam.redaction?.mandatoryWords.map((word) => {
                                  const isUsedValue = redactionVal
                                    .toLowerCase()
                                    .includes(word.toLowerCase());
                                  return (
                                    <span
                                      key={word}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 flex items-center gap-1 shadow-sm select-none ${
                                        isUsedValue
                                          ? "bg-green-500 border-green-500 text-white scale-102 font-black shadow-green-100/50"
                                          : "bg-slate-50 border-gray-200 text-gray-450"
                                      }`}
                                    >
                                      <span>{isUsedValue ? "✓" : "•"}</span>
                                      <span>{word}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="relative">
                              <textarea
                                disabled={isAlreadyCompleted}
                                value={redactionVal}
                                onChange={(e) =>
                                  setEvalAnswers((prev) => ({
                                    ...prev,
                                    [`${keyPrefix}_redaction`]: e.target.value,
                                  }))
                                }
                                placeholder="Rédige ta production écrite ici en respectant les consignes..."
                                rows={4}
                                className="w-full bg-slate-50 border-2 border-gray-150 rounded-2xl p-4 md:p-5 font-bold text-xs text-gray-700 outline-none focus:border-rose-500 focus:bg-white transition-all resize-none shadow-inner leading-relaxed"
                              />
                              <div className="absolute right-4 bottom-4 flex items-center gap-3">
                                <span className="text-[9px] font-bold text-gray-400 bg-white px-2 py-1 border rounded-lg shadow-sm">
                                  Lettres : {redactionVal.length}
                                </span>
                              </div>
                            </div>

                            {isAlreadyCompleted && (
                              <div className="bg-rose-50/70 p-4 border-l-4 border-rose-400 rounded-r-2xl text-[11px] font-bold text-rose-800 animate-fadeIn">
                                💡 <strong>Conseil pédagogique :</strong> Pour
                                cette rédaction, nos enseignants recherchent
                                d'abord l'apparition des mots-clés, la
                                ponctuation, et un sujet cohérent de 2 phrases.
                                Excellent entraînement !
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Submit Actions Button */}
                        {!isAlreadyCompleted && (
                          <div className="mt-12 flex flex-col items-center gap-4 border-t border-dashed border-amber-200 pt-8 no-print">
                            <button
                              type="button"
                              onClick={() => {
                                // Detailed Scoring Computation
                                // 1. QCM Score (Out of 5)
                                let finalQcmPoints = 0;
                                exam.qcm.forEach((q, idx) => {
                                  const ans =
                                    evalAnswers[`${keyPrefix}_qcm_${idx}`] ||
                                    "";
                                  if (
                                    ans.toLowerCase().trim() ===
                                    q.answer.toLowerCase().trim()
                                  ) {
                                    finalQcmPoints += 5 / exam.qcm.length;
                                  }
                                });

                                // 2. Open Questions (Out of 5)
                                let finalOpenPoints = 0;
                                exam.open.forEach((q, idx) => {
                                  const ans =
                                    evalAnswers[`${keyPrefix}_open_${idx}`] ||
                                    "";
                                  if (ans.trim().length >= 10) {
                                    // Match at least details of keywords
                                    let hasKeywordMatch = false;
                                    const ansLower = ans.toLowerCase();
                                    q.keywords.forEach((word) => {
                                      if (
                                        ansLower.includes(word.toLowerCase())
                                      ) {
                                        hasKeywordMatch = true;
                                      }
                                    });
                                    finalOpenPoints += hasKeywordMatch
                                      ? 5 / exam.open.length
                                      : 2.5 / exam.open.length;
                                  }
                                });

                                // 3. Langue Score (Out of 5)
                                let finalLanguePoints = 0;
                                exam.langue.forEach((q, idx) => {
                                  const ans =
                                    evalAnswers[`${keyPrefix}_langue_${idx}`] ||
                                    "";
                                  if (
                                    ans.toLowerCase().trim() ===
                                    q.answer.toLowerCase().trim()
                                  ) {
                                    finalLanguePoints += 5 / exam.langue.length;
                                  }
                                });

                                // 4. Redaction Score (Out of 5)
                                const redactionText =
                                  evalAnswers[`${keyPrefix}_redaction`] || "";
                                const charactersLength =
                                  redactionText.trim().length;
                                const usedKeywordsCount =
                                  exam.redaction?.mandatoryWords.filter(
                                    (word) =>
                                      redactionText
                                        .toLowerCase()
                                        .includes(word.toLowerCase()),
                                  ).length || 0;

                                const lengthScore =
                                  charactersLength >= 15
                                    ? 2
                                    : charactersLength >= 5
                                      ? 1
                                      : 0;
                                const keywordsScore = Math.min(
                                  3,
                                  usedKeywordsCount * 1,
                                );
                                const finalRedactionPoints =
                                  lengthScore + keywordsScore;

                                const finalScoreTotal = Math.min(
                                  20,
                                  finalQcmPoints +
                                    finalOpenPoints +
                                    finalLanguePoints +
                                    finalRedactionPoints,
                                );

                                // Update to global scoring registry
                                handleScoreSubmit(finalScoreTotal);
                                showMascotMsg(
                                  `Examen soumis ! Ta note : ${finalScoreTotal.toFixed(1)}/20 🎉📋`,
                                );
                              }}
                              className="px-14 py-5 bg-amber-500 hover:bg-amber-605 text-white rounded-full font-black text-lg shadow-2xl shadow-amber-500/35 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3"
                            >
                              <ClipboardCheck size={24} />
                              Soumettre ma Copie d'Examen 🚀
                            </button>
                            <p className="text-[10px] font-black text-amber-800/60 uppercase tracking-widest leading-none">
                              Les réponses validées seront gravées dans ton
                              bulletin d'évaluation
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div id="language-exercises-embedded" className="mb-10">
                  <LanguageExercises
                    currentFicheId={currentFicheId}
                    currentFicheTitle={
                      useCustomReading
                        ? "Mon Texte Personnel"
                        : currentFiche.title
                    }
                    currentFicheTheme={
                      useCustomReading ? "Général" : currentFiche.theme
                    }
                    speakWord={speakWord}
                    showMascotMsg={showMascotMsg}
                  />
                </div>
              )}

              {/* 🌟 Widget d'évaluation de fin de fiche (Rating Feedback) */}
              {isAuthenticated && (
                <div className="no-print mt-6">
                  <div className="w-full bg-slate-700/90 text-white p-4 rounded-2xl text-center space-y-3 shadow-lg">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-200">
                      {avisEnvoye
                        ? "Merci pour ton aide ! Ton avis est enregistré. 🚀"
                        : "QU'AS-TU PENSÉ DE CETTE ÉPREUVE AUJOURD'HUI ?"}
                    </p>

                    {!avisEnvoye && (
                      <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((pastille) => (
                          <button
                            key={pastille}
                            type="button"
                            onClick={() => {
                              setNoteSelectionnee(pastille);
                              setAvisEnvoye(true);
                              setStudentRating(pastille);
                              setRatingSubmitted(true);
                              setLogsHistorique((prev) => [
                                ...prev,
                                {
                                  date: new Date().toISOString().split("T")[0],
                                  eleve: activeStudent?.name || "Élève Mystère",
                                  ficheId: currentFicheId,
                                  score: 200,
                                  aideDemandee: false,
                                  rating: pastille,
                                },
                              ]);
                              console.log(
                                `Avis élève enregistré : ${pastille}/5`,
                              );
                            }}
                            onMouseEnter={() => setSurvolNote(pastille)}
                            onMouseLeave={() => setSurvolNote(0)}
                            className={`w-6 h-6 rounded-full transition-all duration-200 transform hover:scale-125 focus:outline-none flex items-center justify-center text-xs border ${
                              pastille <= (survolNote || noteSelectionnee)
                                ? "bg-gradient-to-b from-pink-500 to-purple-600 border-pink-300 shadow-md shadow-pink-900/50"
                                : "bg-slate-900 border-slate-600 hover:border-slate-400"
                            }`}
                          >
                            {pastille <= (survolNote || noteSelectionnee)
                              ? "⭐"
                              : ""}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentPage === "competition" && (
            <motion.div
              key="competition"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <CompetitionArena
                currentFicheId={currentFicheId}
                currentFiche={{
                  id: currentFicheId,
                  title: useCustomReading
                    ? "Mon Texte Personnel"
                    : currentFiche.title,
                  vocab: currentFiche.vocab || [],
                  vocabOptions: currentFiche.vocabOptions || {},
                  evaluation: currentFiche.evaluation || [],
                }}
                currentUser={currentUser}
                showMascotMsg={showMascotMsg}
                scores={scores}
                badges={badges}
                onAddBadge={(badgeName) => {
                  if (!badges.includes(badgeName)) {
                    setBadges((prev) => [...prev, badgeName]);
                  }
                }}
                isOnline={isOnline}
              />
            </motion.div>
          )}

          {currentPage === "homework" && (
            <motion.div
              key="homework"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-[1000px] mx-auto px-6"
            >
              {/* Header section with Stats */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white p-6 md:p-8 rounded-[40px] border-2 border-[var(--border)] shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎒</span>
                    <h2 className="font-baloo text-3xl font-black text-slate-850 uppercase tracking-tight">
                      Cahier d'activité & Devoirs
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                    Travail en autonomie • Insertion de données multi-médias
                    (Images & Textes)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {currentUser.type === "prof" ? (
                    <button
                      onClick={() => {
                        setEditingHomework(null);
                        setShowHomeworkModal(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-slate-900 duration-300 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-103 transition-all cursor-pointer"
                    >
                      <Plus size={16} />
                      Créer un devoir à insérer
                    </button>
                  ) : (
                    <div className="px-5 py-2.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2 text-xs font-bold text-amber-850">
                      <span>🧑‍🎓</span> Esprit d'autonomie scolaire ! Compte :{" "}
                      <b>{currentUser.name}</b>
                    </div>
                  )}
                </div>
              </div>

              {/* LIST OF HOMEWORKS */}
              <div className="grid gap-8">
                {homeworks.length === 0 ? (
                  <div className="bg-[var(--card-bg)] p-16 rounded-[40px] border-4 border-dashed border-[var(--border)] text-center">
                    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                      <Clock
                        size={44}
                        className="text-purple-400 opacity-65 animate-pulse"
                      />
                    </div>
                    <p className="font-baloo text-2xl font-black text-slate-800">
                      Aucun travail de révision pour le moment.
                    </p>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
                      Le maître publiera des exercices avec textes et images
                      très bientôt ! ✨
                    </p>
                  </div>
                ) : (
                  homeworks.map((hw) => {
                    const studentKey =
                      currentUser.id || currentUser.name || "student";
                    const studentSubmission = hw.submissions?.[studentKey];
                    const numSubmissions = Object.keys(
                      hw.submissions || {},
                    ).length;

                    return (
                      <div
                        key={hw.id}
                        className="bg-[var(--card-bg)] p-6 md:p-8 rounded-[40px] border-2 border-[var(--border)] shadow-xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl"
                      >
                        {/* Assignment Header Frame */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                              <FileText size={24} />
                            </div>
                            <div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full inline-block">
                                Fiche n°{hw.ficheId} -{" "}
                                {FICHES[hw.ficheId]?.title || "Activité libre"}
                              </span>
                              <h3 className="font-baloo text-2xl font-black text-slate-850 tracking-tight leading-tight mt-0.5">
                                {hw.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="px-4 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black rounded-xl uppercase tracking-wider shadow-sm shrink-0">
                              📅 Limite :{" "}
                              {new Date(hw.dueDate).toLocaleDateString("fr-FR")}
                            </span>

                            {currentUser.type === "prof" && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingHomework(hw);
                                    setShowHomeworkModal(true);
                                  }}
                                  title="Modifier le devoir"
                                  className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl border border-purple-200 transition-all shadow-sm cursor-pointer"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Supprimer ce devoir à domicile ?",
                                      )
                                    ) {
                                      setHomeworks((prev) =>
                                        prev.filter((h) => h.id !== hw.id),
                                      );
                                    }
                                  }}
                                  title="Supprimer le devoir"
                                  className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-200 transition-all shadow-sm cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* General description */}
                        <p className="text-slate-750 font-medium text-sm leading-relaxed mb-6 max-w-3xl whitespace-pre-line">
                          {hw.description}
                        </p>

                        {/* EXERCISE ATTACHMENTS (TEXT & IMAGE INSERTED BY TEACHER) */}
                        {(hw.exerciseText || hw.exerciseImage) && (
                          <div className="bg-slate-50 border-2 border-slate-200/60 p-5 md:p-6 rounded-3xl mb-6 space-y-4">
                            <h4 className="font-baloo text-xs font-black uppercase tracking-wider text-slate-500">
                              📖 ÉNONCÉ & SUPPORTS DE L'EXERCICE
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                              {/* Exercise text attachment */}
                              {hw.exerciseText ? (
                                <div className="p-4 bg-white rounded-2xl border border-gray-150 font-serif leading-relaxed text-slate-800 text-sm whitespace-pre-line shadow-inner min-h-[140px]">
                                  {hw.exerciseText}
                                </div>
                              ) : (
                                <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-gray-200 text-center text-xs font-bold text-gray-400 leading-relaxed min-h-[140px] flex items-center justify-center">
                                  Pas de support texte particulier fourni.
                                </div>
                              )}

                              {/* Exercise image attachment */}
                              {hw.exerciseImage ? (
                                <div className="bg-white p-3 rounded-2xl border border-gray-150 shadow-sm">
                                  <img
                                    referrerPolicy="no-referrer"
                                    src={hw.exerciseImage}
                                    alt="Support d'exercice"
                                    className="w-full max-h-[220px] object-cover rounded-xl border border-gray-100 cursor-zoom-in active:scale-105 duration-300 transition-transform"
                                    onClick={() =>
                                      window.open(hw.exerciseImage, "_blank")
                                    }
                                  />
                                  <p className="text-[9px] text-center font-bold text-gray-450 uppercase tracking-widest mt-2 italic">
                                    Aperçu du visuel maître (clique pour
                                    agrandir)
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-gray-200 text-center text-xs font-bold text-gray-400 leading-relaxed min-h-[140px] flex items-center justify-center">
                                  Pas d'image d'illustration fournie.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* ACTION PANELS */}
                        <div className="flex flex-wrap gap-3 items-center pt-3 border-t border-gray-100">
                          {/* Student perspective triggers */}
                          {currentUser.type === "student" && (
                            <>
                              {studentSubmission ? (
                                <div className="flex items-center gap-2">
                                  <span className="px-3.5 py-1.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-black rounded-lg uppercase tracking-wider select-none">
                                    ✓ Résultat soumis ! 🟢
                                  </span>
                                  {studentSubmission.feedback ? (
                                    <span className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-wider select-none animate-bounce">
                                      ✨ Devoir corrigé • Note :{" "}
                                      {studentSubmission.score || "A+"}
                                    </span>
                                  ) : (
                                    <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black rounded-lg uppercase tracking-wider select-none">
                                      ⌛ En attente de correction du professeur
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="px-3.5 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-black rounded-lg uppercase tracking-wider select-none">
                                  ⌛ Non soumis 🔴
                                </span>
                              )}

                              <button
                                onClick={() => {
                                  if (activeHomeworkResponseId === hw.id) {
                                    setActiveHomeworkResponseId(null);
                                  } else {
                                    setActiveHomeworkResponseId(hw.id);
                                    setStudentHomeworkText(
                                      studentSubmission?.textResponse || "",
                                    );
                                    setStudentHomeworkImage(
                                      studentSubmission?.imageResponse || "",
                                    );
                                    setStudentHomeworkAttachments(
                                      studentSubmission?.attachments || [],
                                    );
                                  }
                                }}
                                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md ${
                                  activeHomeworkResponseId === hw.id
                                    ? "bg-slate-800 text-white"
                                    : "bg-[var(--primary)] text-white hover:scale-103"
                                }`}
                              >
                                {studentSubmission
                                  ? "📝 Modifier ma réponse"
                                  : "✍️ Remplir ma copie de devoir"}
                              </button>
                            </>
                          )}

                          {/* Teacher perspective triggers */}
                          {currentUser.type === "prof" && (
                            <>
                              <button
                                onClick={() => {
                                  if (activeHomeworkSubmissionsId === hw.id) {
                                    setActiveHomeworkSubmissionsId(null);
                                  } else {
                                    setActiveHomeworkSubmissionsId(hw.id);
                                  }
                                }}
                                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-102 flex items-center gap-2 shadow-md ${
                                  activeHomeworkSubmissionsId === hw.id
                                    ? "bg-slate-800 text-white"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                              >
                                <span>🧑‍🎓 Soumissions des élèves</span>
                                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                                  {numSubmissions} Rendu
                                  {numSubmissions > 1 ? "s" : ""}
                                </span>
                              </button>
                            </>
                          )}

                          {/* Standard lesson activity shortcut button */}
                          <button
                            onClick={() => {
                              setCurrentFicheId(hw.ficheId);
                              setCurrentPage("exam");
                              setExamDifficulty(null);
                              showMascotMsg(
                                "Révise d'abord la leçon associée ! 💪✨",
                              );
                            }}
                            className="px-5 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-slate-700 rounded-full text-xs font-black uppercase tracking-widest leading-none self-center shadow-inner ml-auto transition-all cursor-pointer"
                          >
                            📖 Relire la leçon n°{hw.ficheId}
                          </button>
                        </div>

                        {/* EXPANDABLE STUDENT INPUT PANEL */}
                        {currentUser.type === "student" &&
                          activeHomeworkResponseId === hw.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-6 border-t-2 border-dashed border-gray-200 pt-6 space-y-5"
                            >
                              <div className="bg-amber-50/40 p-5 rounded-[32px] border-2 border-amber-250 text-left">
                                <h4 className="font-baloo text-base font-black text-amber-950 mb-1">
                                  📝 Ma feuille de rédaction d'élève
                                </h4>
                                <p className="text-[10px] text-amber-900/70 font-bold leading-relaxed mb-4">
                                  Insère ta réponse écrite et ta photo
                                  d'illustration pour valider l'activité.
                                </p>

                                <div className="space-y-4">
                                  {/* TEXT DATA RESPONSE SEYES STYLE */}
                                  <div>
                                    <label className="block text-[10px] font-black uppercase text-amber-900 tracking-wider mb-2 ml-1">
                                      Saisie de ma production de texte 🖋️
                                    </label>
                                    <div className="relative rounded-2xl bg-white border-2 border-amber-200 shadow-inner p-4">
                                      <textarea
                                        value={studentHomeworkText}
                                        onChange={(e) =>
                                          setStudentHomeworkText(e.target.value)
                                        }
                                        placeholder="Maître, voici mon travail écrit :..."
                                        className="w-full h-44 border-0 p-2 outline-none font-medium font-serif leading-[28px] text-sm text-slate-800 resize-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[length:24px_28px] bg-left-top"
                                      />
                                    </div>
                                  </div>

                                  {/* EXPLICIT PDF, IMAGE, DOC FILE RECEPTOR WITH EDITORS */}
                                  <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase text-amber-905 tracking-wider ml-1">
                                      Dépose ton devoir ou tes documents
                                      scolaires (PDF, Word, Images) 📂📚
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* Select file receptor */}
                                      <div className="border-3 border-dashed border-amber-300 rounded-[28px] p-6 bg-white/60 text-center flex flex-col items-center justify-center transition-all hover:bg-amber-50/50">
                                        <span className="text-3xl mb-1.5">
                                          🎓
                                        </span>
                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">
                                          Glisse un PDF, DOCX ou Image ici
                                        </p>
                                        <label className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 duration-300 text-white rounded-2xl text-[9px] font-black uppercase tracking-wider cursor-pointer shadow-md inline-block">
                                          Parcourir mes documents...
                                          <input
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                  const nameLower =
                                                    file.name.toLowerCase();
                                                  let fileType:
                                                    | "pdf"
                                                    | "doc"
                                                    | "image" = "image";
                                                  if (
                                                    nameLower.endsWith(".pdf")
                                                  ) {
                                                    fileType = "pdf";
                                                  } else if (
                                                    nameLower.endsWith(
                                                      ".doc",
                                                    ) ||
                                                    nameLower.endsWith(".docx")
                                                  ) {
                                                    fileType = "doc";
                                                  }

                                                  // Mock text extraction
                                                  let mockText = "";
                                                  if (fileType === "pdf") {
                                                    mockText = `RAPPORT PDF EXTRACT - ${file.name}\n-----------------------------------\nSujet d'exercice : Raconte la journée de camping.\n\nMa contribution élève :`;
                                                  } else if (
                                                    fileType === "doc"
                                                  ) {
                                                    mockText = `DEVOIR WORD .docx - ${file.name.toUpperCase()}\n-----------------------------------\nSujet d'exercice : Écris une phrase avec chaque verbe.\n\nRéponse rédigée :`;
                                                  }

                                                  const newAttach = {
                                                    name: file.name,
                                                    type: fileType,
                                                    size: `${(file.size / 1024).toFixed(1)} KB`,
                                                    dataUrl:
                                                      reader.result as string,
                                                    editedText: mockText,
                                                    annotations: [],
                                                  };

                                                  setStudentHomeworkAttachments(
                                                    (prev) => [
                                                      ...prev,
                                                      newAttach,
                                                    ],
                                                  );
                                                  if (fileType === "image") {
                                                    setStudentHomeworkImage(
                                                      reader.result as string,
                                                    );
                                                  }
                                                  showMascotMsg(
                                                    "Fichier ajouté ! Clique sur ✏️ Éditer pour modifier son contenu. 📄✨",
                                                  );
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>

                                      {/* Quick link support */}
                                      <div className="bg-white p-5 rounded-[28px] border-2 border-amber-250 flex flex-col justify-center space-y-3">
                                        <div>
                                          <label className="block text-[9px] font-black uppercase text-gray-500 tracking-wider mb-2">
                                            Ou insère une image externe via son
                                            lien
                                          </label>
                                          <input
                                            type="text"
                                            placeholder="https://images.com/devoir-maths.jpg"
                                            value={
                                              studentHomeworkImage.startsWith(
                                                "data:",
                                              )
                                                ? ""
                                                : studentHomeworkImage
                                            }
                                            onChange={(e) => {
                                              setStudentHomeworkImage(
                                                e.target.value,
                                              );
                                              if (e.target.value) {
                                                const customAttach = {
                                                  name: "Lien_devoir.jpg",
                                                  type: "image" as const,
                                                  size: "Lien distant",
                                                  dataUrl: e.target.value,
                                                };
                                                setStudentHomeworkAttachments(
                                                  (prev) => [
                                                    ...prev,
                                                    customAttach,
                                                  ],
                                                );
                                              }
                                            }}
                                            className="w-full px-4 py-2.5 text-xs rounded-xl border-2 border-amber-200 outline-none font-bold"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* List of uploaded attachments with interactive editing features */}
                                    {studentHomeworkAttachments.length > 0 && (
                                      <div className="space-y-2 mt-3 p-3 bg-amber-50/20 rounded-2xl border border-amber-200">
                                        <p className="text-[9px] font-black text-amber-955 uppercase tracking-widest font-baloo">
                                          Fichiers rattachés à ma copie (
                                          {studentHomeworkAttachments.length}) :
                                        </p>

                                        <div className="space-y-2">
                                          {studentHomeworkAttachments.map(
                                            (attach, aIdx) => (
                                              <div
                                                key={aIdx}
                                                className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-sm"
                                              >
                                                <div className="flex items-center gap-3">
                                                  {attach.type === "image" ? (
                                                    <img
                                                      src={attach.dataUrl}
                                                      alt="preview"
                                                      className="w-10 h-10 object-cover rounded-lg border"
                                                    />
                                                  ) : (
                                                    <span
                                                      className={`p-2.5 rounded-xl text-xs font-black uppercase ${
                                                        attach.type === "pdf"
                                                          ? "bg-red-50 text-red-650"
                                                          : "bg-blue-50 text-blue-800"
                                                      }`}
                                                    >
                                                      {attach.type === "pdf"
                                                        ? "📄 PDF"
                                                        : "📝 DOC"}
                                                    </span>
                                                  )}
                                                  <div>
                                                    <p className="text-xs font-black text-slate-800 truncate max-w-[180px]">
                                                      {attach.name}
                                                    </p>
                                                    <p className="text-[9px] text-gray-400 font-bold">
                                                      {attach.size}
                                                    </p>
                                                  </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setActiveEditingAttachmentIdx(
                                                        aIdx,
                                                      );
                                                      if (
                                                        attach.type === "pdf"
                                                      ) {
                                                        setShowPdfEditor(true);
                                                      } else if (
                                                        attach.type === "doc"
                                                      ) {
                                                        setShowDocEditor(true);
                                                      } else {
                                                        setShowImageEditor(
                                                          true,
                                                        );
                                                      }
                                                    }}
                                                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-650 hover:text-white rounded-xl text-[9px] font-black text-indigo-750 uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                                                  >
                                                    ✏️ Éditer
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setStudentHomeworkAttachments(
                                                        (prev) =>
                                                          prev.filter(
                                                            (_, i) =>
                                                              i !== aIdx,
                                                          ),
                                                      );
                                                      if (
                                                        attach.type === "image"
                                                      )
                                                        setStudentHomeworkImage(
                                                          "",
                                                        );
                                                    }}
                                                    className="p-1 px-2.5 bg-red-50 text-red-505 hover:bg-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase transition-all"
                                                  >
                                                    Retirer
                                                  </button>
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Submit trigger button */}
                                  <button
                                    onClick={() => {
                                      const studentId =
                                        currentUser.id ||
                                        currentUser.name ||
                                        "élève";
                                      const updated = homeworks.map((h) => {
                                        if (h.id === hw.id) {
                                          const subs = h.submissions || {};
                                          subs[studentId] = {
                                            studentName: currentUser.name,
                                            textResponse: studentHomeworkText,
                                            imageResponse:
                                              studentHomeworkImage || undefined,
                                            submittedAt:
                                              new Date().toISOString(),
                                            feedback: subs[studentId]?.feedback,
                                            score: subs[studentId]?.score,
                                            attachments:
                                              studentHomeworkAttachments,
                                          };
                                          return { ...h, submissions: subs };
                                        }
                                        return h;
                                      });
                                      setHomeworks(updated);
                                      setActiveHomeworkResponseId(null);
                                      setStudentHomeworkText("");
                                      setStudentHomeworkImage("");
                                      setStudentHomeworkAttachments([]);
                                      showMascotMsg(
                                        "Félicitations, ton devoir illustré a été rendu avec succès ! 🎉📜",
                                      );
                                    }}
                                    disabled={
                                      !studentHomeworkText &&
                                      studentHomeworkAttachments.length === 0
                                    }
                                    className="w-full py-4 bg-emerald-600 hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-40 shadow-emerald-600/10 cursor-pointer"
                                  >
                                    Soumettre ma copie au Maître 🚀
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}

                        {/* EXPANDABLE TEACHER REVIEW PANEL */}
                        {currentUser.type === "prof" &&
                          activeHomeworkSubmissionsId === hw.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-6 border-t-2 border-dashed border-gray-200 pt-6 space-y-4"
                            >
                              <h4 className="font-baloo text-base font-black text-indigo-950 mb-3 block">
                                🧑‍🏫 Rapport de rendus & Corrections de devoirs
                              </h4>

                              {numSubmissions === 0 ? (
                                <div className="p-8 bg-slate-50 border border-gray-150 rounded-2xl text-center text-xs font-bold text-gray-400">
                                  Aucun étudiant n'a encore rendu sa copie pour
                                  ce devoir.
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {Object.entries(hw.submissions || {}).map(
                                    ([studentId, sub]) => {
                                      const submission = sub as any;
                                      const currentFeedback =
                                        teacherFeedbackMap[
                                          `${hw.id}_${studentId}`
                                        ]?.feedback ??
                                        submission.feedback ??
                                        "";
                                      const currentScore =
                                        teacherFeedbackMap[
                                          `${hw.id}_${studentId}`
                                        ]?.score ??
                                        submission.score ??
                                        "";

                                      return (
                                        <div
                                          key={studentId}
                                          className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5 items-start"
                                        >
                                          {/* Copie élève (Texte et Image s'il y en a) */}
                                          <div className="space-y-3">
                                            <div className="flex justify-between items-center border-b pb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="text-xl">
                                                  🧑‍🎓
                                                </span>
                                                <p className="font-baloo text-sm font-black text-slate-900 leading-tight">
                                                  {submission.studentName}
                                                </p>
                                              </div>
                                              <span className="text-[8px] text-gray-400 font-bold bg-slate-50 border px-2 py-0.5 rounded-full uppercase">
                                                Remis le :{" "}
                                                {new Date(
                                                  submission.submittedAt,
                                                ).toLocaleDateString(
                                                  "fr-FR",
                                                )}{" "}
                                                à{" "}
                                                {new Date(
                                                  submission.submittedAt,
                                                ).toLocaleTimeString("fr-FR", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })}
                                              </span>
                                            </div>

                                            <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 font-serif leading-relaxed text-xs text-slate-800 whitespace-pre-line min-h-[90px]">
                                              {submission.textResponse}
                                            </div>

                                            {submission.imageResponse && (
                                              <div className="bg-slate-50 p-2 rounded-xl border border-gray-150">
                                                <img
                                                  referrerPolicy="no-referrer"
                                                  src={submission.imageResponse}
                                                  alt="Pièce jointe élève"
                                                  className="w-full max-h-[160px] object-cover rounded-lg border cursor-zoom-in hover:opacity-95"
                                                  onClick={() =>
                                                    window.open(
                                                      submission.imageResponse,
                                                      "_blank",
                                                    )
                                                  }
                                                />
                                                <p className="text-[8px] text-center text-gray-400 font-bold mt-1 uppercase italic">
                                                  Photo jointe par l'élève
                                                  (clique pour zoom)
                                                </p>
                                              </div>
                                            )}

                                            {/* Display attachments to teacher with review options */}
                                            {submission.attachments &&
                                              submission.attachments.length >
                                                0 && (
                                                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                                                  <p className="text-[10px] font-black uppercase text-indigo-950 tracking-wider">
                                                    Documents scolaires joints (
                                                    {
                                                      submission.attachments
                                                        .length
                                                    }
                                                    ) :
                                                  </p>
                                                  <div className="grid grid-cols-1 gap-2">
                                                    {submission.attachments.map(
                                                      (
                                                        attach: any,
                                                        aIdx: number,
                                                      ) => (
                                                        <div
                                                          key={aIdx}
                                                          className="bg-slate-50 p-3 rounded-2xl border border-indigo-150 flex flex-col space-y-2 shadow-sm"
                                                        >
                                                          <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                              <span
                                                                className={`p-1.5 rounded-lg text-[9px] font-black uppercase ${
                                                                  attach.type ===
                                                                  "pdf"
                                                                    ? "bg-red-50 text-red-650"
                                                                    : attach.type ===
                                                                        "doc"
                                                                      ? "bg-blue-50 text-blue-700"
                                                                      : "bg-amber-50 text-amber-700"
                                                                }`}
                                                              >
                                                                {attach.type ===
                                                                "pdf"
                                                                  ? "📄 PDF"
                                                                  : attach.type ===
                                                                      "doc"
                                                                    ? "📝 DOC"
                                                                    : "🖼️ Saisie"}
                                                              </span>
                                                              <div>
                                                                <p
                                                                  className="text-xs font-black text-slate-800 truncate max-w-[150px]"
                                                                  title={
                                                                    attach.name
                                                                  }
                                                                >
                                                                  {attach.name}
                                                                </p>
                                                                <p className="text-[8px] text-gray-400 font-bold">
                                                                  {attach.size}
                                                                </p>
                                                              </div>
                                                            </div>
                                                            <button
                                                              type="button"
                                                              onClick={() => {
                                                                setActiveEditingAttachmentIdx(
                                                                  aIdx,
                                                                );
                                                                setTeacherEditingHwId(
                                                                  hw.id,
                                                                );
                                                                setTeacherEditingStudentId(
                                                                  studentId,
                                                                );
                                                                if (
                                                                  attach.type ===
                                                                  "pdf"
                                                                ) {
                                                                  setShowPdfEditor(
                                                                    true,
                                                                  );
                                                                } else if (
                                                                  attach.type ===
                                                                  "doc"
                                                                ) {
                                                                  setShowDocEditor(
                                                                    true,
                                                                  );
                                                                } else {
                                                                  setShowImageEditor(
                                                                    true,
                                                                  );
                                                                }
                                                              }}
                                                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                                                            >
                                                              ✍️ Corriger &
                                                              Annoter
                                                            </button>
                                                          </div>
                                                          {attach.editedText && (
                                                            <div className="bg-white p-2 rounded-xl border text-[10px] text-slate-700 font-mono line-clamp-3 overflow-hidden leading-relaxed">
                                                              {
                                                                attach.editedText
                                                              }
                                                            </div>
                                                          )}
                                                          {attach.annotations &&
                                                            attach.annotations
                                                              .length > 0 && (
                                                              <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100 space-y-1">
                                                                <span className="text-[8px] font-black text-red-600 uppercase tracking-widest block font-baloo">
                                                                  📌 Corrections
                                                                  & Annotations
                                                                  du Maître :
                                                                </span>
                                                                <ul className="list-disc list-inside space-y-0.5 text-[10px] text-red-800 font-bold leading-tight">
                                                                  {attach.annotations.map(
                                                                    (
                                                                      annot: string,
                                                                      idx: number,
                                                                    ) => (
                                                                      <li
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        {annot}
                                                                      </li>
                                                                    ),
                                                                  )}
                                                                </ul>
                                                              </div>
                                                            )}
                                                        </div>
                                                      ),
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                          </div>

                                          {/* Evaluation Maître */}
                                          <div className="p-4 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100 text-left space-y-3">
                                            <h5 className="font-baloo text-xs font-black text-indigo-950 uppercase tracking-wider mb-2">
                                              Evaluation & Note
                                            </h5>

                                            <div className="grid grid-cols-3 gap-2">
                                              <div className="col-span-1">
                                                <label className="block text-[8px] font-black uppercase text-gray-500 tracking-widest mb-1 ml-0.5">
                                                  Note / 20
                                                </label>
                                                <input
                                                  type="text"
                                                  placeholder="Ex: 18"
                                                  value={currentScore}
                                                  onChange={(e) => {
                                                    let val = e.target.value;
                                                    val = val.replace(",", ".");
                                                    val = val.replace(/[^0-9.]/g, "");
                                                    const dotCount = (val.match(/\./g) || []).length;
                                                    if (dotCount > 1) return;
                                                    setTeacherFeedbackMap(
                                                      (prev) => ({
                                                        ...prev,
                                                        [`${hw.id}_${studentId}`]:
                                                          {
                                                            feedback:
                                                              currentFeedback,
                                                            score: val,
                                                          },
                                                      }),
                                                    );
                                                  }}
                                                  className={`w-full px-3 py-2 text-xs font-black rounded-xl border-2 bg-white shadow-inner focus:border-indigo-500 outline-none transition-all ${
                                                    currentScore &&
                                                    (parseFloat(currentScore) < 0 ||
                                                      parseFloat(currentScore) > 20 ||
                                                      !/^\d+\.?\d*$/.test(currentScore))
                                                      ? "border-red-400 bg-red-50 focus:border-red-500 text-red-750"
                                                      : "border-indigo-100"
                                                  }`}
                                                />
                                                {currentScore &&
                                                  (parseFloat(currentScore) < 0 ||
                                                    parseFloat(currentScore) > 20 ||
                                                    !/^\d+\.?\d*$/.test(currentScore)) && (
                                                    <p className="text-[7px] text-red-500 font-extrabold mt-1 leading-none animate-pulse">
                                                      ⚠️ Note (0 - 20)
                                                    </p>
                                                  )}
                                              </div>
                                              <div className="col-span-2">
                                                <label className="block text-[8px] font-black uppercase text-gray-500 tracking-widest mb-1 ml-0.5">
                                                  Appréciation globale
                                                </label>
                                                <input
                                                  type="text"
                                                  placeholder="Félicitations, excellent travail !"
                                                  value={currentFeedback}
                                                  onChange={(e) =>
                                                    setTeacherFeedbackMap(
                                                      (prev) => ({
                                                        ...prev,
                                                        [`${hw.id}_${studentId}`]:
                                                          {
                                                            feedback:
                                                              e.target.value,
                                                            score: currentScore,
                                                          },
                                                      }),
                                                    )
                                                  }
                                                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-indigo-100 bg-white shadow-inner focus:border-indigo-500 outline-none"
                                                />
                                              </div>
                                            </div>

                                            <button
                                              onClick={() => {
                                                const numericScore = parseFloat(currentScore);
                                                if (
                                                  currentScore &&
                                                  (isNaN(numericScore) ||
                                                    numericScore < 0 ||
                                                    numericScore > 20 ||
                                                    !/^\d+\.?\d*$/.test(
                                                      currentScore,
                                                    ))
                                                ) {
                                                  showMascotMsg(
                                                    "⚠️ La note saisie est invalide ! Elle doit être comprise entre 0 et 20.",
                                                  );
                                                  return;
                                                }

                                                let cleanedScore = currentScore;
                                                if (cleanedScore.endsWith(".")) {
                                                  cleanedScore = cleanedScore.slice(0, -1);
                                                }

                                                const updated = homeworks.map(
                                                  (h) => {
                                                    if (h.id === hw.id) {
                                                      const subs =
                                                        h.submissions || {};
                                                      if (subs[studentId]) {
                                                        subs[
                                                          studentId
                                                        ].feedback =
                                                          currentFeedback;
                                                        subs[studentId].score =
                                                          cleanedScore;
                                                      }
                                                      return {
                                                        ...h,
                                                        submissions: subs,
                                                      };
                                                    }
                                                    return h;
                                                  },
                                                );
                                                setHomeworks(updated);
                                                showMascotMsg(
                                                  `Copie de ${submission.studentName} corrigée avec succès ! ⭐💯`,
                                                );
                                              }}
                                              disabled={
                                                currentScore &&
                                                (parseFloat(currentScore) < 0 ||
                                                  parseFloat(currentScore) > 20 ||
                                                  !/^\d+\.?\d*$/.test(currentScore))
                                              }
                                              className={`w-full py-2 duration-300 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md mt-2 cursor-pointer ${
                                                currentScore &&
                                                (parseFloat(currentScore) < 0 ||
                                                  parseFloat(currentScore) > 20 ||
                                                  !/^\d+\.?\d*$/.test(currentScore))
                                                  ? "bg-slate-300 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none hover:bg-slate-300 focus:outline-none"
                                                  : "bg-indigo-600 hover:bg-slate-900"
                                              }`}
                                            >
                                              Enregistrer la Correction & Note
                                              💾
                                            </button>

                                            {submission.feedback && (
                                              <div className="p-2.5 bg-green-50 border border-green-200 text-green-950 rounded-xl text-[9px] font-bold">
                                                <span>
                                                  ✓ Corrigé : Appréciation
                                                  enregistrée (Note :{" "}
                                                  {submission.score || "A+"})
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}

                        {/* INDIVIDUAL SUBMISSION CARD VIEW (Shedding light on teacher comments for students) */}
                        {currentUser.type === "student" &&
                          studentSubmission?.feedback && (
                            <div className="mt-4 p-5 rounded-[28px] bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-2 border-indigo-200/60 shadow-inner flex items-center justify-between gap-4 animate-fadeIn">
                              <div className="text-left space-y-1">
                                <span className="bg-indigo-100 text-indigo-700 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block">
                                  Correction du Maître 🧑‍🏫
                                </span>
                                <p className="font-baloo text-sm font-black text-indigo-950">
                                  Appréciation : "{studentSubmission.feedback}"
                                </p>
                              </div>
                              <div className="bg-indigo-600 font-baloo text-white rounded-2xl w-14 h-14 flex flex-col justify-center items-center font-black animate-scaleIn shrink-0 shadow-lg select-none">
                                <span className="text-sm font-extrabold leading-none">
                                  {studentSubmission.score || "A+"}
                                </span>
                                <span className="text-[7px] font-black uppercase tracking-tighter leading-none mt-1">
                                  /20
                                </span>
                              </div>
                            </div>
                          )}

                        {currentUser.type === "student" &&
                          studentSubmission &&
                          studentSubmission.attachments &&
                          studentSubmission.attachments.length > 0 && (
                            <div className="mt-4 p-5 rounded-[28px] bg-slate-50 border-2 border-dashed border-slate-200 text-left space-y-3.5">
                              <div className="flex items-center gap-2 text-slate-600">
                                <span className="text-sm">📂</span>
                                <p className="font-baloo text-[10px] font-black uppercase tracking-wider">
                                  Mes documents rattachés à ce devoir (
                                  {studentSubmission.attachments.length}) :
                                </p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {studentSubmission.attachments.map(
                                  (attach: any, aIdx: number) => {
                                    const currentStudentId =
                                      currentUser.id ||
                                      currentUser.name ||
                                      "student";
                                    return (
                                      <div
                                        key={aIdx}
                                        className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col space-y-2.5 shadow-sm"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2.5">
                                            {attach.type === "image" ? (
                                              <img
                                                src={attach.dataUrl}
                                                alt="preview"
                                                className="w-8 h-8 object-cover rounded-lg border shrink-0"
                                              />
                                            ) : (
                                              <span
                                                className={`p-2 rounded-lg text-[9px] font-black uppercase ${
                                                  attach.type === "pdf"
                                                    ? "bg-red-50 text-red-650"
                                                    : "bg-blue-50 text-blue-800"
                                                }`}
                                              >
                                                {attach.type === "pdf"
                                                  ? "📄 PDF"
                                                  : "📝 DOC"}
                                              </span>
                                            )}
                                            <div className="truncate max-w-[120px]">
                                              <p
                                                className="text-xs font-black text-slate-800 truncate"
                                                title={attach.name}
                                              >
                                                {attach.name}
                                              </p>
                                              <p className="text-[8px] text-gray-400 font-bold">
                                                {attach.size}
                                              </p>
                                            </div>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveEditingAttachmentIdx(
                                                aIdx,
                                              );
                                              setTeacherEditingHwId(hw.id);
                                              setTeacherEditingStudentId(
                                                currentStudentId,
                                              );
                                              if (attach.type === "pdf") {
                                                setShowPdfEditor(true);
                                              } else if (
                                                attach.type === "doc"
                                              ) {
                                                setShowDocEditor(true);
                                              } else {
                                                setShowImageEditor(true);
                                              }
                                            }}
                                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-650 hover:text-white rounded-xl text-[8px] font-black text-indigo-755 uppercase tracking-wider transition-all cursor-pointer"
                                          >
                                            🔬 Consulter
                                          </button>
                                        </div>

                                        {attach.annotations &&
                                          attach.annotations.length > 0 && (
                                            <div className="bg-red-50/70 p-2.5 rounded-xl border border-red-150 space-y-1">
                                              <span className="text-[8px] font-black text-red-650 uppercase tracking-widest block font-baloo">
                                                📌 Corrections & Commentaires :
                                              </span>
                                              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-red-800 font-bold leading-tight">
                                                {attach.annotations.map(
                                                  (
                                                    annot: string,
                                                    idx: number,
                                                  ) => (
                                                    <li key={idx}>{annot}</li>
                                                  ),
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {currentPage === "dossier" && (
            <motion.div
              key="dossier"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="exam-paper mb-10 border-t-8 border-t-[var(--purple)]">
                <div className="text-center mb-10 border-b-2 border-gray-100 pb-6">
                  <h2 className="font-baloo text-3xl font-black text-[var(--purple)]">
                    📚 DOSSIER PÉDAGOGIQUE
                  </h2>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                    Français 4ème Année • Consolidation & Révision
                  </p>

                  <div className="flex flex-col items-center gap-6 mt-8">
                    {/* Sub-tabs Selection */}
                    <div className="flex p-1 bg-[var(--bg-light)] rounded-2xl border-2 border-[var(--border)] shadow-inner">
                      <button
                        onClick={() => setDossierTab("enrichi")}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dossierTab === "enrichi" ? "bg-white text-[var(--purple)] shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
                      >
                        📚 Fiches Thématiques
                      </button>
                      <button
                        onClick={() => setDossierTab("standard")}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dossierTab === "standard" ? "bg-white text-[var(--purple)] shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
                      >
                        Cahier Standard
                      </button>
                      <button
                        onClick={() => setDossierTab("fiche")}
                        className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dossierTab === "fiche" ? "bg-white text-[var(--purple)] shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
                      >
                        Cahier par Fiche
                      </button>
                    </div>

                    {dossierTab === "enrichi" ? (
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="text-[10px] font-black text-[var(--purple)] bg-[var(--purple)]/10 px-4 py-1.5 rounded-full uppercase tracking-wider">
                          ✨ Fiches éducatives rédigées d'après Vos évaluations
                          scolaires & Récits de lecture !
                        </span>
                      </div>
                    ) : dossierTab === "standard" ? (
                      <div className="flex justify-center gap-4">
                        {[1, 2, 3].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setDossierLevel(lvl as 1 | 2 | 3)}
                            className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${dossierLevel === lvl ? "bg-[var(--purple)] text-white border-[var(--purple)] shadow-lg" : "bg-[var(--bg-light)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--purple)]"}`}
                          >
                            Niveau {lvl}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((act) => (
                          <button
                            key={act}
                            onClick={() =>
                              setActiveDossierActivity(act as 1 | 2 | 3 | 4 | 5)
                            }
                            className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-tighter transition-all border-2 ${activeDossierActivity === act ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg scale-105" : "bg-[var(--bg-light)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]"}`}
                          >
                            Activité {act} :{" "}
                            {act === 1
                              ? "Dictée"
                              : act === 2
                                ? "Récit"
                                : act === 3
                                  ? "Texte"
                                  : act === 4
                                    ? "Mini-Dialogue"
                                    : "Rédaction"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Fiche Customization Widget */}
                {dossierTab === "fiche" && (
                  <div className="bg-white p-6 rounded-3xl border-2 border-[var(--purple)]/20 mb-8 shadow-sm text-left animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <span className="text-[9px] font-black bg-[var(--purple)]/10 text-[var(--purple)] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Configuration de la Fiche Active (Dossier Pédagogique)
                        </span>
                        <h4 className="font-baloo text-lg font-black text-[var(--text)] mt-1">
                          Fiche {currentFicheId} : {currentFiche.title}
                        </h4>
                      </div>

                      <button
                        onClick={() =>
                          setIsEditingFicheText(!isEditingFicheText)
                        }
                        className="px-4 py-2 bg-[var(--purple)] hover:bg-[var(--purple)]/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-102 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/10 self-start sm:self-center"
                      >
                        <PenTool size={11} className="text-white" />
                        {customFicheTexts[currentFicheId] !== undefined
                          ? "Modifier mon texte personnalisé ✏️"
                          : "Personnaliser le texte de lecture ✏️"}
                      </button>
                    </div>

                    {isEditingFicheText ? (
                      <div className="space-y-4 pt-2">
                        <textarea
                          value={
                            customFicheTexts[currentFicheId] !== undefined
                              ? customFicheTexts[currentFicheId]
                              : baseFiche.text
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomFicheTexts((prev) => ({
                              ...prev,
                              [currentFicheId]: val,
                            }));
                          }}
                          className="w-full h-32 p-4 bg-[var(--bg-light)] border-2 border-[var(--purple)]/30 rounded-2xl outline-none focus:border-[var(--purple)] font-serif text-sm leading-relaxed"
                          placeholder="Saisis ton texte de lecture personnalisé..."
                        />
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setIsEditingFicheText(false);
                              showMascotMsg(
                                "Fiche modifiée de manière personnalisée ! 📚✨",
                              );
                            }}
                            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                          >
                            Enregistrer mon texte 💾
                          </button>
                          <button
                            onClick={() => {
                              setCustomFicheTexts((prev) => {
                                const c = { ...prev };
                                delete c[currentFicheId];
                                return c;
                              });
                              setIsEditingFicheText(false);
                              showMascotMsg(
                                "Le texte d'origine est de retour ! 🔄",
                              );
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Restaurer l'original 🔄
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[var(--bg-light)] p-4 rounded-2xl border border-gray-100 text-xs text-[var(--text-muted)] italic font-medium leading-relaxed">
                        <p className="font-serif not-italic font-bold text-gray-800 mb-2">
                          Texte lu actuellement :
                        </p>
                        "{currentFiche.text}"
                      </div>
                    )}
                  </div>
                )}

                {dossierTab !== "enrichi" && (
                  <div className="bg-[var(--bg-light)] p-8 rounded-3xl border-2 border-[var(--border)] mb-10 flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 border-l-[var(--purple)] shadow-sm">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                        Établissement
                      </p>
                      <p className="font-bold text-[var(--text)]">
                        E.P Jugurtha Kef
                      </p>
                    </div>
                    <div className="space-y-1 text-center md:text-right">
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                        Enseignant
                      </p>
                      <p className="font-bold text-[var(--text)]">
                        M. Yahyaoui Nabil
                      </p>
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {dossierTab === "enrichi" ? (
                    <motion.div
                      key="enrichi"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-10"
                    >
                      <DossierEnrichi
                        dossierAnswers={dossierAnswers}
                        setDossierAnswers={setDossierAnswers}
                        isOnline={isOnline}
                        showMascotMsg={showMascotMsg}
                        currentUser={currentUser}
                        selectedFont={selectedFont}
                        setSelectedFont={setSelectedFont}
                      />
                    </motion.div>
                  ) : dossierTab === "standard" ? (
                    <motion.div key="standard" className="space-y-10">
                      {dossierLevel === 1 && (
                        <motion.div
                          key="lvl1"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-10"
                        >
                          <h3 className="font-baloo text-xl font-bold flex items-center gap-3 text-[var(--purple)] uppercase border-b-2 border-[var(--purple)]/10 pb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--purple)] text-white flex items-center justify-center text-xs">
                              01
                            </div>
                            L'Adjectif Qualificatif (Maîtrise Minimale)
                          </h3>

                          <Question
                            id="1"
                            points="4"
                            comp="Minimale"
                            text="Entoure l'adjectif qui convient :"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              {[
                                {
                                  q: "Une ... tente bleue.",
                                  opts: ["grand", "grande"],
                                },
                                {
                                  q: "Les ... clowns rigolent.",
                                  opts: ["petit", "petits"],
                                },
                                {
                                  q: "Une ... écuyère galope.",
                                  opts: ["joli", "jolie"],
                                },
                                {
                                  q: "Le lion est ... .",
                                  opts: ["fort", "forte"],
                                },
                              ].map((item, i) => (
                                <div
                                  key={i}
                                  className="bg-[var(--bg-light)] p-4 rounded-2xl border border-[var(--border)] flex items-center gap-4"
                                >
                                  <p className="text-sm font-bold text-[var(--text)] flex-1">
                                    {item.q}
                                  </p>
                                  <div className="flex gap-2">
                                    {item.opts.map((opt) => {
                                      const isSelected =
                                        dossierAnswers[`lvl1_q1_${i}`] === opt;
                                      const isCorrect =
                                        isSelected && opt === ANSWERS_LVL1[i];
                                      const isWrong =
                                        isSelected && opt !== ANSWERS_LVL1[i];

                                      return (
                                        <motion.button
                                          key={opt}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => {
                                            setDossierAnswers((prev) => ({
                                              ...prev,
                                              [`lvl1_q1_${i}`]: opt,
                                            }));
                                            if (opt === ANSWERS_LVL1[i]) {
                                              showMascotMsg(
                                                "Bravo ! C'est la bonne réponse ! 🌟",
                                              );
                                            } else {
                                              showMascotMsg(
                                                "Essaie encore ! Tu vas y arriver ! 💪",
                                              );
                                            }
                                          }}
                                          className={`px-3 py-1 border-2 rounded-xl text-[10px] font-black transition-all relative overflow-hidden ${
                                            isCorrect
                                              ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30"
                                              : isWrong
                                                ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30"
                                                : "bg-[var(--card-bg)] text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                          }`}
                                        >
                                          {opt}
                                          {isCorrect && (
                                            <motion.span
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="inline-block ml-1"
                                            >
                                              ✓
                                            </motion.span>
                                          )}
                                          {isWrong && (
                                            <motion.span
                                              initial={{
                                                rotate: -90,
                                                opacity: 0,
                                              }}
                                              animate={{
                                                rotate: 0,
                                                opacity: 1,
                                              }}
                                              className="inline-block ml-1"
                                            >
                                              ✗
                                            </motion.span>
                                          )}
                                          {isCorrect && (
                                            <motion.div
                                              className="absolute inset-0 bg-white/20"
                                              initial={{ x: "-100%" }}
                                              animate={{ x: "100%" }}
                                              transition={{ duration: 0.5 }}
                                            />
                                          )}
                                        </motion.button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Question>

                          <h3 className="font-baloo text-xl font-bold flex items-center gap-3 text-[var(--purple)] uppercase border-b-2 border-[var(--purple)]/10 pb-2 mt-12">
                            <div className="w-8 h-8 rounded-lg bg-[var(--purple)] text-white flex items-center justify-center text-xs">
                              02
                            </div>
                            Lecture & Écriture : Pinocchio
                          </h3>

                          <Question
                            id="2"
                            points="4"
                            comp="Pinocchio"
                            text="Remets les mots en ordre :"
                          >
                            <div className="mt-4 p-6 bg-[var(--bg-light)] rounded-3xl border border-[var(--border)]">
                              <p className="text-sm font-mono text-[var(--text-muted)] italic mb-4">
                                (bois / est / Pinocchio / un / pantin / en)
                              </p>
                              <input
                                type="text"
                                value={dossierAnswers.lvl1_q2 || ""}
                                onChange={(e) =>
                                  setDossierAnswers((prev) => ({
                                    ...prev,
                                    lvl1_q2: e.target.value,
                                  }))
                                }
                                className="w-full bg-[var(--card-bg)] border-2 border-dashed border-[var(--border)] rounded-2xl p-4 text-center font-bold text-[var(--text)] focus:border-[var(--primary)] outline-none"
                                placeholder="Ta phrase ici..."
                              />
                            </div>
                          </Question>
                        </motion.div>
                      )}

                      {dossierLevel === 2 && (
                        <motion.div
                          key="lvl2"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-10"
                        >
                          <h3 className="font-baloo text-xl font-bold flex items-center gap-3 text-[var(--purple)] uppercase border-b-2 border-[var(--purple)]/10 pb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--purple)] text-white flex items-center justify-center text-xs">
                              01
                            </div>
                            Les Contes (Maîtrise Moyenne)
                          </h3>

                          <Question
                            id="1"
                            points="5"
                            comp="Grammaire"
                            text="Accorde correctement les adjectifs entre parenthèses :"
                          >
                            <div className="space-y-4 mt-6">
                              {[
                                {
                                  text: "La (méchant) ... sorcière prépare une (noir) ... soupe.",
                                  lines: 1,
                                },
                                {
                                  text: "Le (vieux) ... roi habite un (beau) ... château.",
                                  lines: 1,
                                },
                                {
                                  text: "Les fées sont (content) ... .",
                                  lines: 1,
                                },
                              ].map((item, i) => (
                                <div
                                  key={i}
                                  className="bg-[var(--bg-light)] p-6 rounded-3xl border border-[var(--border)]"
                                >
                                  <p className="text-lg font-serif italic text-[var(--text)] mb-3">
                                    {item.text}
                                  </p>
                                  <input
                                    type="text"
                                    value={dossierAnswers[`lvl2_q1_${i}`] || ""}
                                    onChange={(e) =>
                                      setDossierAnswers((prev) => ({
                                        ...prev,
                                        [`lvl2_q1_${i}`]: e.target.value,
                                      }))
                                    }
                                    className="w-full bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-xl p-3 font-bold text-[var(--text)] focus:border-[var(--primary)] outline-none"
                                    placeholder="Correction..."
                                  />
                                </div>
                              ))}
                            </div>
                          </Question>

                          <h3 className="font-baloo text-xl font-bold flex items-center gap-3 text-[var(--purple)] uppercase border-b-2 border-[var(--purple)]/10 pb-2 mt-12">
                            <div className="w-8 h-8 rounded-lg bg-[var(--purple)] text-white flex items-center justify-center text-xs">
                              02
                            </div>
                            Les Métiers de la Fête
                          </h3>

                          <Question
                            id="2"
                            points="5"
                            comp="Féminin"
                            text="Transforme au féminin :"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                              {[
                                "Le boucher",
                                "Un danseur",
                                "Le jardinier",
                                "Un chanteur",
                                "Le voisin",
                              ].map((m, i) => {
                                const isCorrect =
                                  dossierAnswers[`lvl2_q2_${i}`]
                                    ?.toLowerCase()
                                    .trim() ===
                                  LVL2_Q2_ANSWERS[i].toLowerCase().trim();
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center gap-4 bg-[var(--bg-light)] p-4 rounded-3xl border border-[var(--border)] transition-all"
                                  >
                                    <span className="text-sm font-black text-[var(--text-muted)] w-24">
                                      {m} →
                                    </span>
                                    <div className="flex-1 relative">
                                      <input
                                        type="text"
                                        value={
                                          dossierAnswers[`lvl2_q2_${i}`] || ""
                                        }
                                        onChange={(e) =>
                                          setDossierAnswers((prev) => ({
                                            ...prev,
                                            [`lvl2_q2_${i}`]: e.target.value,
                                          }))
                                        }
                                        className={`w-full bg-[var(--card-bg)] border-2 rounded-xl p-2 font-bold text-[var(--text)] outline-none transition-all ${isCorrect ? "border-green-500 bg-green-50" : "border-[var(--border)] focus:border-[var(--accent)]"}`}
                                        placeholder="..."
                                      />
                                      {isCorrect && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 font-bold"
                                        >
                                          ✓
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </Question>
                        </motion.div>
                      )}

                      {dossierLevel === 3 && (
                        <motion.div
                          key="lvl3"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-10"
                        >
                          <h3 className="font-baloo text-xl font-bold flex items-center gap-3 text-[var(--purple)] uppercase border-b-2 border-[var(--purple)]/10 pb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--purple)] text-white flex items-center justify-center text-xs">
                              XXL
                            </div>
                            Le Défi du Pluriel (Maîtrise Maximale)
                          </h3>

                          <Question
                            id="1"
                            points="5"
                            comp="DÉFI"
                            text="Réécris la phrase au pluriel :"
                          >
                            <div className="mt-6 p-8 bg-[var(--bg-light)] rounded-[40px] border-4 border-dashed border-[var(--purple)]/20 relative">
                              <div className="absolute -top-3 right-6 bg-[var(--purple)] text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">
                                Phrase Source
                              </div>
                              <p className="text-2xl font-serif text-[var(--text)] text-center italic mb-8">
                                « Un bel animal sauvage regarde le nouveau jeu.
                                »
                              </p>
                              <textarea
                                value={dossierAnswers.lvl3_q1 || ""}
                                onChange={(e) =>
                                  setDossierAnswers((prev) => ({
                                    ...prev,
                                    lvl3_q1: e.target.value,
                                  }))
                                }
                                className="w-full bg-[var(--card-bg)] rounded-3xl p-6 border-2 border-[var(--border)] text-[var(--text)] font-serif text-xl italic outline-none focus:border-[var(--purple)] focus:ring-4 focus:ring-[var(--purple)]/10 transition-all"
                                rows={3}
                                placeholder="Réécriture au pluriel ici..."
                              />
                            </div>
                          </Question>

                          <h3 className="font-baloo text-xl font-bold flex items-center gap-3 text-[var(--purple)] uppercase border-b-2 border-[var(--purple)]/10 pb-2 mt-12">
                            <div className="w-8 h-8 rounded-lg bg-[var(--purple)] text-white flex items-center justify-center text-xs">
                              🎭
                            </div>
                            Intégration Pinocchio
                          </h3>

                          <Question
                            id="2"
                            points="10"
                            comp="Redaction"
                            text="Imagine un court dialogue entre Pinocchio et Gepetto dans le ventre du requin :"
                          >
                            <div className="seyes-paper !min-h-[300px]">
                              <textarea
                                value={dossierAnswers.lvl3_q2 || ""}
                                onChange={(e) =>
                                  setDossierAnswers((prev) => ({
                                    ...prev,
                                    lvl3_q2: e.target.value,
                                  }))
                                }
                                className="seyes-textarea w-full"
                                placeholder="Écris le dialogue ici..."
                                style={{ fontFamily: selectedFont }}
                              />
                            </div>
                          </Question>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="fiche"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-10"
                    >
                      {FICHES[currentFicheId]?.dossierContent ? (
                        <>
                          {activeDossierActivity === 1 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-6"
                            >
                              <h3 className="font-baloo text-xl font-bold text-[var(--primary)] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-xs">
                                  A1
                                </div>
                                La Dictée Magique
                              </h3>
                              <div className="bg-amber-50 p-6 rounded-[32px] border-2 border-amber-200 shadow-sm relative overflow-hidden">
                                <div className="relative z-10">
                                  <p className="text-sm font-black text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Volume2 size={16} /> Activité de Dictée
                                  </p>
                                  <p className="text-[11px] font-bold text-amber-900/60 leading-relaxed max-w-md">
                                    Écoute bien chaque mot en cliquant sur le
                                    haut-parleur, puis écris-le correctement
                                    dans le trou. Tu as 3 chances pour réussir !
                                  </p>
                                </div>
                                <div className="absolute right-0 top-0 opacity-10 transform scale-150 translate-x-4 -translate-y-4">
                                  <Waves
                                    size={100}
                                    className="text-amber-800"
                                  />
                                </div>
                              </div>

                              <div className="bg-white p-10 rounded-[40px] border-4 border-[var(--primary)]/10 shadow-xl relative">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-6 leading-[3]">
                                  {FICHES[currentFicheId].dictation?.text
                                    .split("__")
                                    .map((part, i, arr) => {
                                      const correctWord =
                                        FICHES[currentFicheId].dictation?.words[
                                          i
                                        ] || "";
                                      const userVal =
                                        dictationAnswers[
                                          `fiche_${currentFicheId}_dictation_${i}`
                                        ] || "";
                                      const isCorrect =
                                        userVal.toLowerCase().trim() ===
                                        correctWord.toLowerCase().trim();
                                      const attemptCount =
                                        exerciseAttempts[
                                          `dossier_a1_${currentFicheId}`
                                        ] || 0;
                                      return (
                                        <React.Fragment key={i}>
                                          <span className="text-lg font-bold text-[var(--text)] whitespace-pre">
                                            {part}
                                          </span>
                                          {i < arr.length - 1 && (
                                            <div className="inline-flex flex-col items-center gap-2 group">
                                              <div className="relative">
                                                <input
                                                  type="text"
                                                  value={userVal}
                                                  onChange={(e) =>
                                                    setDictationAnswers(
                                                      (prev) => ({
                                                        ...prev,
                                                        [`fiche_${currentFicheId}_dictation_${i}`]:
                                                          e.target.value,
                                                      }),
                                                    )
                                                  }
                                                  onFocus={() => {
                                                    playWord(correctWord);
                                                    showMascotMsg(
                                                      `Écoute le mot manquant nº${i + 1} ! 🔊🏽`,
                                                    );
                                                  }}
                                                  disabled={
                                                    attemptCount >= 3 &&
                                                    isCorrect
                                                  }
                                                  className={`w-32 bg-[var(--bg-light)] border-2 border-dashed rounded-xl px-3 py-2 text-center font-black outline-none transition-all placeholder:text-[var(--text-muted)]/20 ${
                                                    !userVal
                                                      ? "border-[var(--border)] focus:border-[var(--primary)] text-[var(--text-muted)]"
                                                      : isCorrect
                                                        ? "border-green-500 bg-green-50 text-green-600"
                                                        : attemptCount >= 1
                                                          ? "border-red-500 bg-red-50 text-red-600"
                                                          : "border-[var(--primary)] text-[var(--primary)]"
                                                  }`}
                                                  placeholder="???"
                                                />
                                                {attemptCount >= 3 &&
                                                  !isCorrect && (
                                                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                                                      {correctWord}
                                                    </span>
                                                  )}
                                                <button
                                                  onClick={() =>
                                                    playWord(
                                                      FICHES[currentFicheId]
                                                        .dictation?.words[i] ||
                                                        "",
                                                    )
                                                  }
                                                  className="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 hover:scale-110 active:scale-95 transition-all group-hover:bg-[var(--accent)]"
                                                >
                                                  <Volume2 size={14} />
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                </div>

                                <div className="mt-12 flex flex-col items-center gap-4">
                                  <div className="flex gap-2">
                                    {[1, 2, 3].map((step) => (
                                      <div
                                        key={step}
                                        className={`w-3 h-3 rounded-full transition-all duration-500 ${step <= (exerciseAttempts[`dossier_a1_${currentFicheId}`] || 0) ? "bg-red-400" : "bg-green-400"}`}
                                      ></div>
                                    ))}
                                  </div>
                                  <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                                    Tentative :{" "}
                                    {exerciseAttempts[
                                      `dossier_a1_${currentFicheId}`
                                    ] || 0}{" "}
                                    / 3
                                  </p>

                                  {(exerciseAttempts[
                                    `dossier_a1_${currentFicheId}`
                                  ] || 0) < 3 && (
                                    <button
                                      onClick={() => {
                                        const allCorrect = FICHES[
                                          currentFicheId
                                        ].dictation?.words.every(
                                          (w, idx) =>
                                            dictationAnswers[
                                              `fiche_${currentFicheId}_dictation_${idx}`
                                            ]
                                              ?.toLowerCase()
                                              .trim() ===
                                            w?.toLowerCase().trim(),
                                        );
                                        if (allCorrect) {
                                          showMascotMsg(
                                            "FÉLICITATIONS ! Tu as réussi la dictée ! 🏁🏆",
                                          );
                                        } else {
                                          incrementAttempt(
                                            `dossier_a1_${currentFicheId}`,
                                          );
                                          if (
                                            (exerciseAttempts[
                                              `dossier_a1_${currentFicheId}`
                                            ] || 0) +
                                              1 >=
                                            3
                                          ) {
                                            showMascotMsg(
                                              "C'était ta dernière chance ! Regarde les corrections. 🛠️",
                                            );
                                          } else {
                                            showMascotMsg(
                                              "Ce n'est pas tout à fait juste. Réessaie ! 🔄",
                                            );
                                          }
                                        }
                                      }}
                                      className="bg-[var(--primary)] text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--primary)]/20"
                                    >
                                      Vérifier ma dictée
                                    </button>
                                  )}

                                  {(exerciseAttempts[
                                    `dossier_a1_${currentFicheId}`
                                  ] || 0) >= 3 && (
                                    <button
                                      onClick={() => {
                                        setExerciseAttempts((prev) => ({
                                          ...prev,
                                          [`dossier_a1_${currentFicheId}`]: 0,
                                        }));
                                        const newAnswers = {
                                          ...dictationAnswers,
                                        };
                                        FICHES[
                                          currentFicheId
                                        ].dictation?.words.forEach((_, idx) => {
                                          delete newAnswers[
                                            `fiche_${currentFicheId}_dictation_${idx}`
                                          ];
                                        });
                                        setDictationAnswers(newAnswers);
                                        showMascotMsg(
                                          "Allez, on recommence à zéro ! Tu vas y arriver. 🚀",
                                        );
                                      }}
                                      className="bg-[var(--accent)] text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--accent)]/20"
                                    >
                                      Effacer et Recommencer
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                          {activeDossierActivity === 2 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-6"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-baloo text-xl font-bold text-[var(--primary)] flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-xs shadow-lg shadow-[var(--primary)]/20">
                                    A2
                                  </div>
                                  Reconstitution de Récit
                                </h3>
                                <button
                                  onClick={() => {
                                    const currentFiche = FICHES[currentFicheId];
                                    if (
                                      currentFiche &&
                                      currentFiche.dossierContent
                                    ) {
                                      setShuffledDossier((prev) => ({
                                        ...prev!,
                                        reconstitution: shuffleArray(
                                          currentFiche.dossierContent!
                                            .reconstitution,
                                        ),
                                      }));
                                      showMascotMsg(
                                        "C'est mélangé ! À toi de jouer ! 🌪️",
                                      );
                                    }
                                  }}
                                  className="p-2 bg-white text-[var(--primary)] border-2 border-[var(--primary)] rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
                                  title="Mélanger à nouveau"
                                >
                                  <RefreshCw size={16} />
                                </button>
                              </div>
                              <p className="text-xs font-black text-[var(--text-muted)] p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-2xl italic mb-4 shadow-sm flex items-center justify-between gap-2">
                                <span>
                                  Consigne : Je numérote les phrases de 1 à 8
                                  pour remettre l'histoire dans le bon ordre
                                  chronologique.
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    playWord(
                                      "Consigne : Je numérote les phrases de 1 à 8 pour remettre l'histoire dans le bon ordre chronologique.",
                                    )
                                  }
                                  className="p-1 px-2.5 bg-white text-orange-600 rounded-lg hover:bg-orange-50 border border-orange-100 shadow-sm font-bold text-[10px] uppercase transition-all shrink-0 cursor-pointer flex items-center gap-1 active:scale-95"
                                  title="Écouter la consigne 🔊"
                                >
                                  🎙️ Écouter
                                </button>
                              </p>
                              <div className="bg-white p-6 md:p-10 rounded-[40px] border-2 border-[var(--border)] shadow-xl space-y-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-bl-full pointer-events-none" />
                                {(shuffledDossier?.reconstitution &&
                                shuffledDossier.reconstitution.length > 0
                                  ? shuffledDossier.reconstitution
                                  : shuffleArray(
                                      FICHES[currentFicheId].dossierContent
                                        ?.reconstitution || [],
                                    )
                                ).map((phrase: string, i: number) => {
                                  const originalIndex =
                                    FICHES[
                                      currentFicheId
                                    ].dossierContent?.reconstitution?.indexOf(
                                      phrase,
                                    ) + 1;
                                  const userVal =
                                    dossierAnswers[
                                      `fiche_${currentFicheId}_reconstitution_${phrase}`
                                    ];
                                  const isCorrect =
                                    userVal === originalIndex.toString();
                                  return (
                                    <motion.div
                                      key={i}
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: i * 0.1 }}
                                      className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all group ${userVal && isCorrect ? "bg-green-50 border-green-200" : userVal ? "bg-red-50 border-red-200" : "bg-white border-[var(--border)] hover:border-[var(--primary)]/30"}`}
                                    >
                                      <div className="relative">
                                        <input
                                          type="text"
                                          maxLength={1}
                                          value={userVal || ""}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(
                                              /[^1-8]/g,
                                              "",
                                            );
                                            setDossierAnswers((prev) => ({
                                              ...prev,
                                              [`fiche_${currentFicheId}_reconstitution_${phrase}`]:
                                                val,
                                            }));
                                          }}
                                          className={`w-14 h-14 rounded-2xl text-center font-black text-2xl transition-all outline-none border-b-4 ${userVal && isCorrect ? "bg-green-500 text-white border-green-700 shadow-lg scale-110" : userVal ? "bg-red-500 text-white border-red-700 shadow-md" : "bg-[var(--bg-light)] border-gray-300 focus:border-[var(--primary)] focus:bg-white"}`}
                                        />
                                        {userVal && isCorrect && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-white text-green-500 rounded-full p-0.5 shadow-md"
                                          >
                                            <CheckCircle2 size={16} />
                                          </motion.div>
                                        )}
                                      </div>
                                      <p
                                        className={`text-sm md:text-base font-bold flex-1 leading-tight ${userVal && isCorrect ? "text-green-800" : "text-[var(--text)]"}`}
                                      >
                                        {phrase}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => playWord(phrase)}
                                        className="p-1 px-2.5 bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 border border-slate-200 shadow-xs font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                        title="Écouter la phrase 🔊"
                                      >
                                        🔊 Écouter
                                      </button>
                                    </motion.div>
                                  );
                                })}
                              </div>
                              <div className="flex justify-center pt-6">
                                <button
                                  onClick={() => {
                                    const currentFiche = FICHES[currentFicheId];
                                    const phrases =
                                      currentFiche.dossierContent
                                        ?.reconstitution || [];
                                    const allCorrect = phrases.every((p) => {
                                      const correctIdx = phrases.indexOf(p) + 1;
                                      return (
                                        dossierAnswers[
                                          `fiche_${currentFicheId}_reconstitution_${p}`
                                        ] === correctIdx.toString()
                                      );
                                    });

                                    if (allCorrect) {
                                      showMascotMsg(
                                        "Bravo ! Tu as parfaitement reconstitué l'histoire ! Tu es un champion. 🏆🎈",
                                      );
                                    } else {
                                      showMascotMsg(
                                        "Il y a encore quelques erreurs... Relis bien l'histoire pour trouver le bon ordre ! 🧐",
                                      );
                                    }
                                  }}
                                  className="bg-[var(--primary)] text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--primary)]/30 flex items-center gap-2"
                                >
                                  <ClipboardCheck size={20} />
                                  Vérifier mon ordre
                                </button>
                              </div>
                            </motion.div>
                          )}
                          {activeDossierActivity === 3 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-6"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-baloo text-xl font-bold text-[var(--primary)] flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-xs shadow-lg shadow-[var(--primary)]/20">
                                    A3
                                  </div>
                                  Le Texte à Trous Interactif
                                </h3>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentFiche =
                                        FICHES[currentFicheId];
                                      if (
                                        currentFiche &&
                                        currentFiche.dossierContent?.cloze
                                      ) {
                                        setShuffledDossier((prev) => ({
                                          ...prev!,
                                          words: shuffleArray(
                                            currentFiche.dossierContent!.cloze!
                                              .words,
                                          ),
                                        }));
                                        showMascotMsg(
                                          "Les étiquettes de mots ont été mélangées ! À toi de jouer ! 🌪️",
                                        );
                                      }
                                    }}
                                    className="p-2 bg-white text-[var(--primary)] border-2 border-[var(--primary)] rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm cursor-pointer"
                                    title="Mélanger de nouveau"
                                  >
                                    <RefreshCw size={16} />
                                  </button>
                                </div>
                              </div>

                              <div className="bg-blue-50/50 p-4 border-l-4 border-blue-400 rounded-r-2xl text-[11px] font-bold text-blue-900 shadow-sm leading-relaxed">
                                💡 <strong>Consigne :</strong> Lis attentivement
                                l'histoire. Remplis chaque trou en tapant
                                l'orthographe correcte, ou{" "}
                                <strong>
                                  clique directement sur une étiquette de mot
                                  ci-dessous
                                </strong>{" "}
                                pour l'ajouter automatiquement au premier trou
                                disponible !
                              </div>

                              <div className="bg-white p-8 md:p-10 rounded-[40px] border-2 border-[var(--border)] shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-bl-full pointer-events-none" />

                                {/* Word Pool */}
                                <div className="mb-8">
                                  <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider mb-2">
                                    🏷️ Étiquettes disponibles :
                                  </p>
                                  <div className="flex flex-wrap gap-2.5 p-4 bg-[var(--bg-light)] rounded-3xl border-2 border-dashed border-[var(--border)]">
                                    {(
                                      shuffledDossier?.words ||
                                      FICHES[currentFicheId].dossierContent
                                        ?.cloze?.words ||
                                      []
                                    ).map((w: string) => {
                                      const wordCount =
                                        FICHES[currentFicheId].dossierContent
                                          ?.cloze?.words?.length || 0;
                                      let isUsed = false;
                                      for (
                                        let idx = 1;
                                        idx <= wordCount;
                                        idx++
                                      ) {
                                        if (
                                          dossierAnswers[
                                            `fiche_${currentFicheId}_cloze_${idx}`
                                          ]
                                            ?.toLowerCase()
                                            .trim() === w.toLowerCase().trim()
                                        ) {
                                          isUsed = true;
                                          break;
                                        }
                                      }
                                      return (
                                        <div
                                          key={w}
                                          className="inline-flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm"
                                        >
                                          <button
                                            type="button"
                                            disabled={isUsed}
                                            onClick={() => {
                                              const clozeWords =
                                                getClozeCorrectWords(
                                                  currentFicheId,
                                                  langueActive,
                                                );
                                              for (
                                                let idx = 1;
                                                idx <= clozeWords.length;
                                                idx++
                                              ) {
                                                const key = `fiche_${currentFicheId}_cloze_${idx}`;
                                                if (!dossierAnswers[key]) {
                                                  setDossierAnswers((prev) => ({
                                                    ...prev,
                                                    [key]: w,
                                                  }));
                                                  return;
                                                }
                                              }
                                              showMascotMsg(
                                                "Tous les trous sont déjà remplis ! Efface ou modifie une réponse si nécessaire. ✍️",
                                              );
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 ${
                                              isUsed
                                                ? "bg-gray-100/80 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                                                : "bg-white text-[var(--primary)] border-[var(--primary)]/30 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 cursor-pointer active:scale-95"
                                            }`}
                                          >
                                            {w}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => playWord(w)}
                                            className="p-1.5 hover:bg-slate-50 rounded-lg text-gray-400 hover:text-[var(--primary)] transition-colors cursor-pointer"
                                            title="Écouter le mot"
                                          >
                                            <Volume2 size={12} />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Texts with interactive inputs */}
                                <div className="font-serif text-lg md:text-xl leading-[2.6] text-[var(--text)] italic bg-gradient-to-r from-transparent to-[var(--bg-light)]/20 p-4 rounded-3xl">
                                  {FICHES[
                                    currentFicheId
                                  ].dossierContent?.cloze?.text
                                    .split(/\[\d+\]/)
                                    .map((part, i, arr) => {
                                      const correctWord =
                                        getClozeCorrectWords(
                                          currentFicheId,
                                          langueActive,
                                        )[i] || "";
                                      const inputKey = `fiche_${currentFicheId}_cloze_${i + 1}`;
                                      const userVal =
                                        dossierAnswers[inputKey] || "";
                                      const isFilled = userVal.length > 0;
                                      const isCorrect =
                                        userVal.toLowerCase().trim() ===
                                        correctWord.toLowerCase().trim();
                                      return (
                                        <React.Fragment key={i}>
                                          <span className="text-lg md:text-xl font-medium leading-relaxed">
                                            {part}
                                          </span>
                                          {i < arr.length - 1 && (
                                            <span className="inline-flex items-center gap-1 select-none">
                                              <input
                                                type="text"
                                                value={userVal}
                                                onChange={(e) =>
                                                  setDossierAnswers((prev) => ({
                                                    ...prev,
                                                    [inputKey]: e.target.value,
                                                  }))
                                                }
                                                className={`mx-1 w-28 border-b-2 bg-transparent text-center font-black outline-none transition-all ${
                                                  !isFilled
                                                    ? "border-[var(--primary)]"
                                                    : isCorrect
                                                      ? "text-green-600 border-green-500 bg-green-50/50 rounded-lg px-2 shadow-inner"
                                                      : "text-red-500 border-red-500 bg-red-50/50 rounded-lg px-2 shadow-inner"
                                                }`}
                                                placeholder={`? (Trou ${i + 1})`}
                                              />
                                              {isFilled && (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    setDossierAnswers(
                                                      (prev) => ({
                                                        ...prev,
                                                        [inputKey]: "",
                                                      }),
                                                    )
                                                  }
                                                  className="p-1 bg-gray-100 hover:bg-red-100 hover:text-red-500 rounded-full text-gray-400 transition-colors cursor-pointer shadow-sm"
                                                  title="Effacer ce mot"
                                                >
                                                  <X size={10} />
                                                </button>
                                              )}
                                            </span>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const clozeWords =
                                      getClozeCorrectWords(currentFicheId);
                                    const allCorrect = getClozeCorrectWords(
                                      currentFicheId,
                                      langueActive,
                                    ).every(
                                      (w, idx) =>
                                        dossierAnswers[
                                          `fiche_${currentFicheId}_cloze_${idx + 1}`
                                        ]
                                          ?.toLowerCase()
                                          .trim() === w?.toLowerCase().trim(),
                                    );

                                    if (allCorrect) {
                                      showMascotMsg(
                                        "Incroyable ! Tu as rempli tout le texte à trous de manière parfaite ! Tu maîtrises superbement ce vocabulaire. 🏆🏅",
                                      );
                                    } else {
                                      showMascotMsg(
                                        "Il y a encore des mots incorrects ou des cases vides. Aide-toi des étiquettes disponibles ! 🧐📌",
                                      );
                                    }
                                  }}
                                  className="bg-[var(--primary)] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--primary)]/30 flex items-center gap-2 cursor-pointer"
                                >
                                  <ClipboardCheck size={18} />
                                  Vérifier le texte à trous
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const clozeWords =
                                      getClozeCorrectWords(currentFicheId);
                                    const newAnswers = { ...dossierAnswers };
                                    getClozeCorrectWords(
                                      currentFicheId,
                                      langueActive,
                                    ).forEach((_, idx) => {
                                      delete newAnswers[
                                        `fiche_${currentFicheId}_cloze_${idx + 1}`
                                      ];
                                    });
                                    setDossierAnswers(newAnswers);
                                    showMascotMsg(
                                      "Le texte à trous a été remis à zéro ! C'est reparti pour un entraînement ! 🔄✨",
                                    );
                                  }}
                                  className="bg-white border-2 border-gray-200 hover:border-red-400 hover:text-red-600 text-gray-500 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-102 active:scale-98 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                  Tout effacer
                                </button>
                              </div>
                            </motion.div>
                          )}
                          {activeDossierActivity === 5 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-8"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="font-baloo text-xl font-bold text-[var(--primary)] flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-xs">
                                    A5
                                  </div>
                                  Rédaction (Seyès)
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border-2 border-[var(--border)] shadow-sm">
                                  <button
                                    onClick={() =>
                                      setIsReadingMode(!isReadingMode)
                                    }
                                    className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${isReadingMode ? "bg-[var(--primary)] text-white shadow-lg" : "bg-[var(--bg-light)] text-[var(--text-muted)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"}`}
                                  >
                                    <Eye size={14} />
                                    {isReadingMode
                                      ? "Quitter la lecture"
                                      : "Mode Lecture"}
                                  </button>

                                  {currentFicheId === 4 && !isReadingMode && (
                                    <button
                                      onClick={() => {
                                        showMascotMsg(
                                          "Ta rédaction (Fiche 4) a été bien enregistrée dans ton dossier ! 💾✨",
                                        );
                                      }}
                                      className="px-4 py-2 bg-green-500 text-white rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                                    >
                                      <Save size={14} />
                                      Sauvegarder
                                    </button>
                                  )}

                                  {!isReadingMode && (
                                    <>
                                      <div className="h-6 w-px bg-[var(--border)]" />
                                      <select
                                        value={selectedFont}
                                        onChange={(e) =>
                                          setSelectedFont(e.target.value)
                                        }
                                        className="bg-transparent border-none outline-none font-bold text-xs cursor-pointer appearance-none px-4"
                                      >
                                        <option value="Playwrite FR Trad">
                                          Écolier Trad
                                        </option>
                                        <option value="Playwrite FR Moderne">
                                          Écolier Mod
                                        </option>
                                        <option value="Playwrite DE Grund">
                                          Écolier Base
                                        </option>
                                        <option value="Cedarville Cursive">
                                          Cursive
                                        </option>
                                      </select>
                                      <div className="h-6 w-px bg-[var(--border)]" />
                                      <div className="flex items-center gap-2 px-2">
                                        <button
                                          onClick={() =>
                                            setFontSize(
                                              Math.max(12, fontSize - 2),
                                            )
                                          }
                                          className="p-1 hover:bg-[var(--bg-light)] rounded-lg text-[var(--text-muted)]"
                                        >
                                          <Minus size={14} />
                                        </button>
                                        <span className="text-xs font-black min-w-[24px] text-center">
                                          {fontSize}
                                        </span>
                                        <button
                                          onClick={() =>
                                            setFontSize(
                                              Math.min(48, fontSize + 2),
                                            )
                                          }
                                          className="p-1 hover:bg-[var(--bg-light)] rounded-lg text-[var(--text-muted)]"
                                        >
                                          <Plus size={14} />
                                        </button>
                                      </div>
                                      <div className="h-6 w-px bg-[var(--border)]" />
                                      <label className="flex items-center gap-2 px-4 py-1 hover:bg-[var(--bg-light)] rounded-xl cursor-pointer transition-colors group">
                                        <ImageIcon
                                          size={14}
                                          className="text-[var(--text-muted)] group-hover:text-[var(--primary)]"
                                        />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--primary)]">
                                          Modèle
                                        </span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onload = (re) =>
                                                setWritingModelImg(
                                                  re.target?.result as string,
                                                );
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                      </label>
                                    </>
                                  )}
                                </div>
                              </div>

                              {writingModelImg && (
                                <div className="relative group">
                                  <img
                                    src={writingModelImg}
                                    alt="Modèle"
                                    className="max-h-48 w-full object-contain rounded-3xl border-4 border-dashed border-[var(--primary)]/20 p-2 bg-white"
                                  />
                                  <button
                                    onClick={() => setWritingModelImg(null)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}

                              <div className="relative">
                                <div
                                  className={`seyes-paper ${isReadingMode ? "!border-none !shadow-none !bg-transparent flex items-center justify-center" : "!min-h-[500px]"}`}
                                >
                                  {isReadingMode ? (
                                    <div
                                      className="max-w-3xl w-full text-center p-12 space-y-6"
                                      style={{
                                        fontFamily: selectedFont,
                                        fontSize: `${fontSize * 1.5}px`,
                                        lineHeight: "1.8",
                                      }}
                                    >
                                      {dossierAnswers.redaction_seyes
                                        ?.split("\n")
                                        .map((line: string, i: number) => (
                                          <p
                                            key={i}
                                            className="text-[var(--text)] drop-shadow-sm"
                                          >
                                            {line || "\u00A0"}
                                          </p>
                                        ))}
                                      {(!dossierAnswers.redaction_seyes ||
                                        dossierAnswers.redaction_seyes
                                          .length === 0) && (
                                        <p className="text-gray-300 italic">
                                          Aucun texte à lire pour le moment...
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <textarea
                                      value={
                                        dossierAnswers.redaction_seyes || ""
                                      }
                                      onChange={(e) =>
                                        setDossierAnswers((prev) => ({
                                          ...prev,
                                          redaction_seyes: e.target.value,
                                        }))
                                      }
                                      onDoubleClick={(e) => {
                                        const el = e.currentTarget;
                                        const pos = el.selectionStart;
                                        const text = el.value;
                                        let start = pos;
                                        while (
                                          start > 0 &&
                                          /[a-zA-ZàâçéèêëîïôûùÀÂÇÉÈÊËÎÏÔÛÙ]/.test(
                                            text[start - 1],
                                          )
                                        )
                                          start--;
                                        let end = pos;
                                        while (
                                          end < text.length &&
                                          /[a-zA-ZàâçéèêëîïôûùÀÂÇÉÈÊËÎÏÔÛÙ]/.test(
                                            text[end],
                                          )
                                        )
                                          end++;
                                        const word = text
                                          .slice(start, end)
                                          .trim();
                                        if (word) handleLexiqueLookup(word);
                                      }}
                                      className="seyes-textarea w-full cursor-help"
                                      placeholder="Écris ton texte ici... (Double-clique sur un mot pour voir sa définition ✨)"
                                      style={{
                                        fontFamily: selectedFont,
                                        fontSize: `${fontSize}px`,
                                        lineHeight: "32px",
                                      }}
                                    />
                                  )}
                                </div>

                                {!isReadingMode && lexiqueInfo && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="absolute bottom-full left-4 right-4 mb-4 bg-white border-4 border-[var(--primary)] rounded-3xl shadow-2xl p-6 z-10"
                                  >
                                    <button
                                      onClick={() => setLexiqueInfo(null)}
                                      className="absolute top-4 right-4 p-2 hover:bg-[var(--bg-light)] rounded-full transition-colors"
                                    >
                                      <X
                                        size={18}
                                        className="text-[var(--text-muted)]"
                                      />
                                    </button>
                                    <div className="flex items-start gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                                        <BookOpen size={24} />
                                      </div>
                                      <div className="space-y-2 pr-8">
                                        <h4 className="font-baloo text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                                          {lexiqueInfo.word}
                                          {isLexiqueLoading && (
                                            <Loader2
                                              size={16}
                                              className="animate-spin"
                                            />
                                          )}
                                        </h4>
                                        <p className="text-sm font-bold text-[var(--text)] italic leading-relaxed">
                                          &ldquo;{lexiqueInfo.def}&rdquo;
                                        </p>
                                        {lexiqueInfo.ex && (
                                          <div className="bg-[var(--bg-light)] p-3 rounded-xl border border-[var(--border)]">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">
                                              Exemple :
                                            </p>
                                            <p className="text-xs font-bold text-[var(--primary)]">
                                              {lexiqueInfo.ex}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {!isReadingMode && (
                                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <button
                                      onClick={() => diagnoseWithAI_Seyes()}
                                      disabled={isAiLoading}
                                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${isAiLoading ? "bg-gray-200 text-gray-400" : "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:scale-105 active:scale-95"}`}
                                    >
                                      {isAiLoading ? (
                                        <Loader2
                                          size={16}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Sparkles size={16} />
                                      )}
                                      Analyser la rédaction (IA)
                                    </button>
                                  </div>
                                )}
                              </div>

                              {!isReadingMode &&
                                (aiFeedback.redaction_seyes ||
                                  aiFeedback.redaction_seyes_syntaxe) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-left">
                                    {aiFeedback.redaction_seyes && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border-2 border-red-100 p-6 rounded-[32px] space-y-4"
                                      >
                                        <div className="flex items-center gap-3 text-red-600 font-baloo">
                                          <AlertCircle size={20} />
                                          <span className="font-bold">
                                            Orthographe & Conjugaison :
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {(aiFeedback.redaction_seyes || "")
                                            .split(",")
                                            .map((word, i) => {
                                              const trimmed = word.trim();
                                              if (!trimmed) return null;
                                              return (
                                                <span
                                                  key={i}
                                                  className="px-3 py-1 bg-white border-2 border-red-200 text-red-600 rounded-[20px] text-xs font-black shadow-sm uppercase tracking-wider"
                                                >
                                                  {trimmed}
                                                </span>
                                              );
                                            })}
                                        </div>
                                        <p className="text-[10px] font-bold text-red-400 italic font-baloo">
                                          L'IA a repéré des anomalies sur ces
                                          mots. Relis-les bien et tente de
                                          corriger !
                                        </p>
                                      </motion.div>
                                    )}

                                    {aiFeedback.redaction_seyes_syntaxe && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-[32px] space-y-4"
                                      >
                                        <div className="flex items-center gap-3 text-indigo-600 font-baloo">
                                          <Sparkles
                                            size={20}
                                            className="animate-pulse"
                                          />
                                          <span className="font-bold">
                                            Structure & Syntaxe :
                                          </span>
                                        </div>
                                        <div className="text-xs text-indigo-900 font-bold leading-relaxed whitespace-pre-line bg-white/70 p-4 border border-indigo-100 rounded-2xl shadow-inner text-left max-h-[160px] overflow-y-auto font-sans">
                                          {aiFeedback.redaction_seyes_syntaxe}
                                        </div>
                                        <p className="text-[10px] font-bold text-indigo-400 italic font-baloo">
                                          Ces pistes t'aident à mieux rédiger et
                                          construire tes phrases, sans te donner
                                          la réponse directe !
                                        </p>
                                      </motion.div>
                                    )}
                                  </div>
                                )}
                            </motion.div>
                          )}
                          {activeDossierActivity === 4 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-6"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-baloo text-xl font-bold text-[var(--primary)] flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center text-xs shadow-lg shadow-[var(--primary)]/20">
                                    A4
                                  </div>
                                  Le Mini-Dialogue Interactif
                                </h3>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentFiche =
                                        FICHES[currentFicheId];
                                      if (
                                        currentFiche &&
                                        currentFiche.dossierContent?.dialogue
                                      ) {
                                        setShuffledDossier((prev) => ({
                                          ...prev!,
                                          dialogue: shuffleArray(
                                            currentFiche.dossierContent!
                                              .dialogue,
                                          ),
                                        }));
                                        showMascotMsg(
                                          "Les répliques du dialogue ont été mélangées ! 🌪️🎭",
                                        );
                                      }
                                    }}
                                    className="p-2 bg-white text-[var(--primary)] border-2 border-[var(--primary)] rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm cursor-pointer"
                                    title="Mélanger de nouveau"
                                  >
                                    <RefreshCw size={16} />
                                  </button>
                                </div>
                              </div>

                              <div className="bg-purple-50/50 p-4 border-l-4 border-purple-400 rounded-r-2xl text-[11px] font-bold text-purple-900 shadow-sm leading-relaxed">
                                🎭 <strong>Consigne :</strong> Lis attentivement
                                les répliques du dialogue. Échange avec tes
                                camarades, écoute leur prononciation 🔊, puis
                                numérote chaque réplique de 1 à 6 pour remettre
                                la discussion dans le bon ordre chronologique !
                              </div>

                              <div className="space-y-4">
                                {(
                                  shuffledDossier?.dialogue ||
                                  FICHES[currentFicheId].dossierContent
                                    ?.dialogue ||
                                  []
                                ).map((line: string, i: number) => {
                                  const originalIndex =
                                    (FICHES[
                                      currentFicheId
                                    ].dossierContent?.dialogue?.indexOf(line) ??
                                      -1) + 1;
                                  const inputKey = `fiche_${currentFicheId}_dialogue_${line}`;
                                  const userVal = dossierAnswers[inputKey];
                                  const isFilled =
                                    userVal && userVal.length > 0;
                                  const isCorrect =
                                    userVal === originalIndex.toString();

                                  return (
                                    <motion.div
                                      key={i}
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: i * 0.08 }}
                                      className={`flex items-start md:items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
                                        isFilled && isCorrect
                                          ? "bg-green-50 border-green-300 shadow-green-100/30"
                                          : isFilled
                                            ? "bg-red-50 border-red-300"
                                            : "bg-white border-[var(--border)] hover:border-[var(--primary)]/30"
                                      }`}
                                    >
                                      <div className="relative">
                                        <input
                                          type="text"
                                          maxLength={1}
                                          value={userVal || ""}
                                          onChange={(e) => {
                                            const val = e.target.value.replace(
                                              /[^1-6]/g,
                                              "",
                                            );
                                            setDossierAnswers((prev) => ({
                                              ...prev,
                                              [inputKey]: val,
                                            }));
                                          }}
                                          className={`w-12 h-12 rounded-2xl text-center font-black text-xl transition-all outline-none border-b-4 ${
                                            isFilled && isCorrect
                                              ? "bg-green-500 text-white border-green-700 shadow-lg scale-105"
                                              : isFilled
                                                ? "bg-red-500 text-white border-red-700 shadow-md"
                                                : "bg-[var(--bg-light)] border-gray-300 focus:border-[var(--primary)] focus:bg-white"
                                          }`}
                                          placeholder="?"
                                        />
                                        {isFilled && isCorrect && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 bg-white text-green-500 rounded-full p-0.5 shadow-md"
                                          >
                                            <CheckCircle2 size={14} />
                                          </motion.div>
                                        )}
                                      </div>

                                      <div className="flex-1 flex items-center justify-between gap-3 font-medium">
                                        <p
                                          className={`text-sm md:text-base font-bold leading-relaxed ${isFilled && isCorrect ? "text-green-800" : "text-[var(--text)]"}`}
                                        >
                                          {line}
                                        </p>

                                        <button
                                          type="button"
                                          onClick={() => playWord(line)}
                                          className="p-2 hover:bg-slate-100 rounded-xl text-gray-400 hover:text-[var(--primary)] transition-colors cursor-pointer shrink-0"
                                          title="Écouter la réplique"
                                        >
                                          <Volume2 size={16} />
                                        </button>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>

                              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const dialogLines =
                                      FICHES[currentFicheId].dossierContent
                                        ?.dialogue || [];
                                    const allCorrect = dialogLines.every(
                                      (line) => {
                                        const correctIdx =
                                          dialogLines.indexOf(line) + 1;
                                        return (
                                          dossierAnswers[
                                            `fiche_${currentFicheId}_dialogue_${line}`
                                          ] === correctIdx.toString()
                                        );
                                      },
                                    );

                                    if (allCorrect) {
                                      showMascotMsg(
                                        "Magnifique ! Le dialogue de Jacquot avec le gentil médecin est maintenant reconstitué dans le bon ordre ! 🎭👏🌟",
                                      );
                                    } else {
                                      showMascotMsg(
                                        "Il y a encore des répliques mal ordonnées ou vides. Relis-les bien ensemble et utilise la prononciation vocale pour t'aider ! 🗣️🧠",
                                      );
                                    }
                                  }}
                                  className="bg-[var(--primary)] text-white px-10 py-4.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--primary)]/30 flex items-center gap-2 cursor-pointer"
                                >
                                  <ClipboardCheck size={20} />
                                  Vérifier mon dialogue
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const dialogLines =
                                      FICHES[currentFicheId].dossierContent
                                        ?.dialogue || [];
                                    const newAnswers = { ...dossierAnswers };
                                    dialogLines.forEach((line) => {
                                      delete newAnswers[
                                        `fiche_${currentFicheId}_dialogue_${line}`
                                      ];
                                    });
                                    setDossierAnswers(newAnswers);
                                    showMascotMsg(
                                      "Le dialogue a été réinitialisé ! C'est parti pour un nouvel ordre ! 🔄✨",
                                    );
                                  }}
                                  className="bg-white border-2 border-gray-200 hover:border-red-400 hover:text-red-600 text-gray-500 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-102 active:scale-98 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                  Réinitialiser
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                          <Sparkles
                            size={48}
                            className="text-[var(--primary)] opacity-40"
                          />
                          <div>
                            <h4 className="text-xl font-black text-[var(--text)] mb-2">
                              Activités non générées
                            </h4>
                            <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">
                              Génère des activités spécifiques pour cette fiche
                              via l'IA.
                            </p>
                          </div>
                          <button
                            onClick={generateDossierWithAI}
                            disabled={isGeneratingDossier}
                            className="px-10 py-5 bg-[var(--primary)] text-white rounded-full font-black flex items-center gap-3 hover:scale-105 transition-all"
                          >
                            {isGeneratingDossier ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Sparkles />
                            )}
                            {isGeneratingDossier
                              ? "Génération..."
                              : "Générer via l'IA ✨"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* General Consolidation Activity - Always Visible */}
                <div className="mt-20 pt-10 border-t-2 border-[var(--border)]">
                  <div className="bg-gradient-to-br from-[var(--purple)] to-[var(--pink)] p-1 rounded-[40px] shadow-2xl">
                    <div className="bg-[var(--card-bg)] rounded-[38px] p-8">
                      <h4 className="font-baloo text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] mb-6 text-center">
                        🌟 ACTIVITÉ COMMUNE POUR TOUS 🌟
                      </h4>
                      {(() => {
                        const activeCommonActivity = getCommonActivityForFiche(
                          FICHES[currentFicheId]?.theme,
                        );
                        return (
                          <div className="p-8 bg-[var(--bg-light)] rounded-3xl border-2 border-[var(--border)]">
                            <p className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">
                              Thème : {activeCommonActivity.themeName}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {activeCommonActivity.words.map((w) => (
                                <span
                                  key={w}
                                  className="px-4 py-1.5 bg-white text-[var(--purple)] border-2 border-[var(--purple)]/20 rounded-full text-xs font-black shadow-sm transform hover:scale-110 transition-all cursor-default"
                                >
                                  {w}
                                </span>
                              ))}
                            </div>
                            <div className="font-serif text-lg leading-relaxed text-[var(--text)] italic">
                              {activeCommonActivity.textParts.map((part, i) => {
                                if (
                                  i ===
                                  activeCommonActivity.textParts.length - 1
                                ) {
                                  return <span key={i}>{part}</span>;
                                }
                                const qKey = `q${i + 1}`;
                                const question =
                                  activeCommonActivity.questions[i];
                                const userKey = `fiche_${currentFicheId}_${qKey}`;
                                return (
                                  <React.Fragment key={i}>
                                    <span>{part}</span>
                                    <Gap
                                      choices={question.choices}
                                      current={consolidatedAnswers[userKey]}
                                      answer={question?.answer}
                                      onChange={(v) =>
                                        setConsolidatedAnswers((prev) => ({
                                          ...prev,
                                          [userKey]: v,
                                        }))
                                      }
                                    />
                                  </React.Fragment>
                                );
                              })}
                            </div>
                            <div className="mt-8 flex justify-end">
                              <button
                                onClick={handleSaveDossier}
                                className="btn-primary flex items-center gap-2 !bg-[var(--purple)] shadow-[var(--purple)]/30 hover:scale-105 active:scale-95 transition-all"
                              >
                                <Save size={16} />{" "}
                                {showDossierCheck
                                  ? "Réponses Validées"
                                  : "Vérifier & Enregistrer"}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {currentPage === "lexique" && (
            <motion.div
              key="lexique"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="text-center">
                <h2 className="font-baloo text-4xl font-black text-[var(--primary)]">
                  🎨 Mon Lexique Créatif
                </h2>
                <p className="text-[var(--text-muted)] font-bold">
                  Outils pour enrichir tes portraits et descriptions.
                </p>
              </div>

              <div className="max-w-md mx-auto mb-10">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Rechercher un mot..."
                    value={lexiqueSearchTerm}
                    onChange={(e) => setLexiqueSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[var(--card-bg)] border-4 border-[var(--primary)] rounded-3xl shadow-lg outline-none focus:ring-4 focus:ring-[var(--primary)]/20 font-bold transition-all text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Portrait Tool */}
                <div className="bg-[var(--card-bg)] p-8 rounded-[40px] border-4 border-[var(--primary)] shadow-2xl">
                  <h3 className="font-baloo text-2xl font-black text-[var(--primary)] mb-6 flex items-center gap-2">
                    <Feather /> Mon Portrait
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        "Physique :",
                        "grand",
                        "petit",
                        "blond",
                        "brun",
                        "mince",
                        "costaud",
                      ].map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            if (!w.endsWith(":")) {
                              speakWord(w);
                              setDossierAnswers((p) => ({
                                ...p,
                                portrait: (p.portrait || "") + " " + w,
                              }));
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-[10px] font-black ${w.endsWith(":") ? "text-[var(--text-muted)] cursor-default" : "bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all"}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        "Moral :",
                        "gentil",
                        "généreux",
                        "timide",
                        "courageux",
                        "drôle",
                      ].map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            if (!w.endsWith(":")) {
                              speakWord(w);
                              setDossierAnswers((p) => ({
                                ...p,
                                portrait: (p.portrait || "") + " " + w,
                              }));
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-[10px] font-black ${w.endsWith(":") ? "text-[var(--text-muted)] cursor-default" : "bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all"}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={dossierAnswers.portrait || ""}
                      onChange={(e) =>
                        setDossierAnswers((p) => ({
                          ...p,
                          portrait: e.target.value,
                        }))
                      }
                      onDoubleClick={(e) => {
                        const el = e.currentTarget;
                        const pos = el.selectionStart;
                        const text = el.value;
                        let start = pos;
                        while (
                          start > 0 &&
                          /[a-zA-ZàâçéèêëîïôûùÀÂÇÉÈÊËÎÏÔÛÙ]/.test(
                            text[start - 1],
                          )
                        )
                          start--;
                        let end = pos;
                        while (
                          end < text.length &&
                          /[a-zA-ZàâçéèêëîïôûùÀÂÇÉÈÊËÎÏÔÛÙ]/.test(text[end])
                        )
                          end++;
                        const word = text.slice(start, end).trim();
                        if (word) handleLexiqueLookup(word);
                      }}
                      className="w-full h-40 p-6 bg-[var(--bg-light)] border-2 border-dashed border-[var(--border)] rounded-3xl outline-none focus:border-[var(--primary)] font-serif text-lg cursor-help"
                      placeholder="Décris une personne... (Double-clique sur un mot pour sa définition ✨)"
                    />

                    {aiFeedback.portrait && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-sm italic text-blue-800"
                      >
                        <span className="font-black block not-italic mb-1 opacity-60">
                          Assistant IA 🤖 :
                        </span>
                        {aiFeedback.portrait}
                      </motion.div>
                    )}

                    <button
                      onClick={() => diagnoseWithAI("portrait")}
                      disabled={isAiLoading}
                      className={`w-full btn-primary flex items-center justify-center gap-2 ${isAiLoading ? "opacity-50" : ""}`}
                    >
                      {isAiLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Cpu size={18} />
                      )}
                      Analyse Magique par IA
                    </button>
                  </div>
                </div>

                {/* Animal Tool */}
                <div className="bg-[var(--card-bg)] p-8 rounded-[40px] border-4 border-[var(--accent)] shadow-2xl">
                  <h3 className="font-baloo text-2xl font-black text-[var(--accent)] mb-6 flex items-center gap-2">
                    <Dna /> Mon Animal Préféré
                  </h3>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "pattes",
                        "museau",
                        "queue",
                        "plumes",
                        "écailles",
                        "blanc",
                        "tacheté",
                        "courir",
                        "nager",
                      ].map((w) => (
                        <button
                          key={w}
                          onClick={() => {
                            speakWord(w);
                            setDossierAnswers((p) => ({
                              ...p,
                              animal: (p.animal || "") + " " + w,
                            }));
                          }}
                          className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black hover:bg-amber-500 hover:text-white transition-all"
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                    <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-sm font-bold text-amber-800 italic">
                      "Mon chien Médor est grand et marron. Il a les oreilles
                      tombantes et une longue queue. Il court vite !"
                    </div>
                    <textarea
                      value={dossierAnswers.animal || ""}
                      onChange={(e) =>
                        setDossierAnswers((p) => ({
                          ...p,
                          animal: e.target.value,
                        }))
                      }
                      onDoubleClick={(e) => {
                        const el = e.currentTarget;
                        const pos = el.selectionStart;
                        const text = el.value;
                        let start = pos;
                        while (
                          start > 0 &&
                          /[a-zA-ZàâçéèêëîïôûùÀÂÇÉÈÊËÎÏÔÛÙ]/.test(
                            text[start - 1],
                          )
                        )
                          start--;
                        let end = pos;
                        while (
                          end < text.length &&
                          /[a-zA-ZàâçéèêëîïôûùÀÂÇÉÈÊËÎÏÔÛÙ]/.test(text[end])
                        )
                          end++;
                        const word = text.slice(start, end).trim();
                        if (word) handleLexiqueLookup(word);
                      }}
                      className="w-full h-40 p-6 bg-[var(--bg-light)] border-2 border-dashed border-amber-200 rounded-3xl outline-none focus:border-amber-500 font-serif text-lg cursor-help"
                      placeholder="Décris un animal... (Double-clique sur un mot pour sa définition ✨)"
                    />

                    {aiFeedback.animal && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl text-sm italic text-amber-800"
                      >
                        <span className="font-black block not-italic mb-1 opacity-60">
                          Assistant IA 🤖 :
                        </span>
                        {aiFeedback.animal}
                      </motion.div>
                    )}

                    <button
                      onClick={() => diagnoseWithAI("animal")}
                      disabled={isAiLoading}
                      className={`w-full btn-primary !bg-[var(--accent)] shadow-[var(--accent)]/30 flex items-center justify-center gap-2 ${isAiLoading ? "opacity-50" : ""}`}
                    >
                      {isAiLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Cpu size={18} />
                      )}
                      Analyse Magique par IA
                    </button>
                  </div>
                </div>

                {/* Personal Lexicon Tool */}
                <div className="bg-[var(--card-bg)] p-8 rounded-[40px] border-4 border-[var(--purple)] shadow-2xl relative">
                  <h3 className="font-baloo text-2xl font-black text-[var(--purple)] mb-6 flex items-center gap-2">
                    <BookMarked size={28} /> Mes Mots Persos
                  </h3>
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      {lexiqueInfo && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="p-4 bg-white border-2 border-[var(--purple)] rounded-2xl shadow-lg space-y-2 mb-4 relative overflow-hidden"
                        >
                          <button
                            onClick={() => setLexiqueInfo(null)}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                          >
                            <X size={14} />
                          </button>
                          <div className="pr-6">
                            <h4 className="font-black text-[var(--purple)] flex items-center gap-2 text-sm">
                              {lexiqueInfo.word}
                              {isLexiqueLoading && (
                                <Loader2 size={12} className="animate-spin" />
                              )}
                            </h4>
                            <p className="text-[10px] font-bold leading-relaxed">
                              {lexiqueInfo.def}
                            </p>
                            {lexiqueInfo.ex && (
                              <p className="text-[9px] text-[var(--text-muted)] italic">
                                "{lexiqueInfo.ex}"
                              </p>
                            )}
                            <button
                              onClick={() => {
                                addToLexicon(
                                  lexiqueInfo.word,
                                  lexiqueInfo.def,
                                  lexiqueInfo.ex,
                                );
                                setLexiqueInfo(null);
                              }}
                              className="mt-2 text-[10px] font-black uppercase tracking-wider text-[var(--purple)] hover:underline flex items-center gap-1"
                            >
                              <Plus size={10} /> Enregistrer
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                      <input
                        id="personal-word-input"
                        type="text"
                        placeholder="Nouveau mot..."
                        className="flex-1 px-4 py-2 bg-[var(--bg-light)] border-2 border-[var(--border)] rounded-xl outline-none focus:border-[var(--purple)] font-bold text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              handleLexiqueLookup(val);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                      />
                      <button
                        className="p-2 bg-[var(--purple)] text-white rounded-xl hover:scale-105 transition-all shadow-lg"
                        onClick={() => {
                          const input = document.getElementById(
                            "personal-word-input",
                          ) as HTMLInputElement;
                          const val = input?.value.trim();
                          if (val) {
                            handleLexiqueLookup(val);
                            input.value = "";
                          }
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="bg-[var(--bg-light)] p-5 rounded-3xl border-2 border-dashed border-[var(--border)] min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                      {personalLexicon.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
                          <PenTool size={40} className="mb-2" />
                          <p className="text-xs font-black uppercase tracking-widest leading-tight">
                            Ajoute tes propres mots ici pour apprendre !
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {personalLexicon
                            .filter(
                              (p) =>
                                !lexiqueSearchTerm ||
                                p.word
                                  .toLowerCase()
                                  .includes(lexiqueSearchTerm.toLowerCase()),
                            )
                            .map((p, idx) => (
                              <div
                                key={p.word + idx}
                                className="group p-3 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--purple)] hover:shadow-md transition-all"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className="font-bold flex items-center gap-2 cursor-pointer hover:text-[var(--purple)] transition-colors text-sm"
                                    onClick={() => speakWord(p.word)}
                                    onDoubleClick={() =>
                                      handleLexiqueLookup(p.word)
                                    }
                                    title="Double-clique pour voir le sens"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--purple)]"></div>
                                    {p.word}
                                  </span>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => speakWord(p.word)}
                                      className="p-1.5 text-[var(--purple)] hover:bg-[var(--purple)]/10 rounded-lg"
                                      title="Écouter"
                                    >
                                      <Volume2 size={12} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setPersonalLexicon((prev) =>
                                          prev.filter(
                                            (item) => item.word !== p.word,
                                          ),
                                        )
                                      }
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                      title="Supprimer"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                                {p.definition && (
                                  <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 leading-relaxed italic">
                                    {p.definition}
                                  </p>
                                )}
                              </div>
                            ))}
                          {personalLexicon.filter((p) =>
                            p.word
                              .toLowerCase()
                              .includes(lexiqueSearchTerm.toLowerCase()),
                          ).length === 0 &&
                            lexiqueSearchTerm && (
                              <p className="text-center text-xs opacity-50 py-10 font-bold">
                                Aucun mot trouvé pour "{lexiqueSearchTerm}" 🔍
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Game Section for Tunisian Curriculum Vocabulary */}
              <div className="mt-16">
                <MemoryGame
                  personalLexicon={personalLexicon}
                  currentFicheWords={FICHES[currentFicheId]?.vocab || []}
                  vocabOptions={FICHES[currentFicheId]?.vocabOptions}
                  showMascotMsg={showMascotMsg}
                  speakWord={speakWord}
                  currentFicheTitle={
                    FICHES[currentFicheId]?.title || "Fiche Active"
                  }
                />
              </div>
            </motion.div>
          )}

          {currentPage === "cahier" && (
            <motion.div
              key="cahier"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="text-center">
                <h2 className="font-baloo text-4xl font-black text-[var(--purple)]">
                  📓 Mon Cahier Numérique
                </h2>
                <p className="text-[var(--text-muted)] font-bold">
                  Retrouve tes réussites et tes diplômes.
                </p>

                {/* Summary Stats Integration */}
                <div className="mt-8 bg-[var(--card-bg)] p-6 rounded-3xl border-4 border-dashed border-[var(--purple)]/20 max-w-xl mx-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-[var(--purple)] uppercase tracking-widest opacity-60">
                      Moyenne Générale
                    </span>
                    <span className="text-2xl font-black text-[var(--purple)] italic">
                      {Object.values(scores).length
                        ? (
                            (Object.values(scores) as any[]).reduce(
                              (a: any, b: any) => a + (b.total || 0),
                              0,
                            ) / Object.values(scores).length
                          ).toFixed(1)
                        : 0}
                      /20
                    </span>
                  </div>
                  <div className="h-6 bg-[var(--bg-light)] rounded-full overflow-hidden border-2 border-[var(--border)] p-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, ((Object.values(scores) as any[]).reduce((a: any, b: any) => a + (b.total || 0), 0) / (Object.values(scores).length || 1)) * 5)}%`,
                      }}
                      className="h-full bg-gradient-to-r from-[var(--purple)] to-[var(--primary)] rounded-full shadow-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-[var(--card-bg)] p-8 rounded-[40px] border-4 border-[var(--purple)] shadow-xl">
                  <h3 className="font-baloo text-2xl font-black text-[var(--purple)] mb-6 flex items-center gap-2">
                    <Award /> Mes Derniers Scores
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(scores).map(([id, s]: [string, any]) => (
                      <div
                        key={id}
                        className="flex items-center justify-between p-4 bg-[var(--bg-light)] rounded-2xl border border-[var(--border)]"
                      >
                        <span className="font-black text-[var(--text)]">
                          Fiche {id} : {FICHES[Number(id)]?.title}
                        </span>
                        <span
                          className={`px-4 py-1 rounded-full font-black text-sm ${s.total >= 15 ? "bg-green-500 text-white" : "bg-[var(--primary)] text-white"}`}
                        >
                          {s.total}/20
                        </span>
                      </div>
                    ))}
                    {Object.keys(scores).length === 0 && (
                      <p className="text-center text-[var(--text-muted)] italic py-10">
                        Aucun score pour le moment. Travaille bien ! 💪
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] p-8 rounded-[40px] border-4 border-[var(--accent)] shadow-xl">
                  <h3 className="font-baloo text-2xl font-black text-[var(--accent)] mb-6 flex items-center gap-2">
                    <Trophy /> Mes Badges
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {badges.map((b) => (
                      <div
                        key={b}
                        className="flex flex-col items-center p-4 bg-amber-50 rounded-2xl border-2 border-amber-200"
                      >
                        <div className="text-3xl mb-2">🥇</div>
                        <p className="text-[9px] font-black uppercase text-center text-amber-700">
                          {b}
                        </p>
                      </div>
                    ))}
                    {badges.length === 0 && (
                      <p className="col-span-2 text-center text-[var(--text-muted)] italic py-10 text-xs text-balance">
                        Obtiens plus de 15/20 pour gagner des badges !
                      </p>
                    )}
                  </div>
                  <button
                    onClick={resetAllProgress}
                    className="mt-10 w-full text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                  >
                    Réinitialiser ma progression
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {currentPage === "succes" && (
            <motion.div
              key="succes"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[1200px] mx-auto px-4 py-2 no-print"
            >
              <SuccessPanel
                scores={scores}
                vocabAnswers={vocabAnswers}
                dictationAnswers={dictationAnswers}
                badges={badges}
                onAddBadge={(badgeName) => {
                  if (!badges.includes(badgeName)) {
                    setBadges((prev) => [...prev, badgeName]);
                  }
                }}
                showMascotMsg={showMascotMsg}
                fiches={FICHES}
              />
            </motion.div>
          )}
          {currentPage === "presence" && (
            <motion.div
              key="presence"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--card-bg)] rounded-[40px] p-10 shadow-2xl border-4 border-[var(--border)] overflow-hidden relative"
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 border-b-2 border-[var(--border)] pb-8">
                <div>
                  <h3 className="font-baloo text-3xl font-black text-[var(--primary)]">
                    📋 Feuille de Présence
                  </h3>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                    4ème Année C • 20 Élèves
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const nextAttendance: Record<string, boolean> = {};
                      students.forEach(s => { nextAttendance[s.id] = true; });
                      setAttendance(nextAttendance);
                      showMascotMsg("Tous les élèves sont marqués présents ! ✅");
                    }}
                    className="btn-primary"
                  >
                    Tous présents ✅
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {students.map((s) => (
                  <motion.div
                    key={s.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setAttendance((prev) => ({
                        ...prev,
                        [s.id]: !prev[s.id],
                      }))
                    }
                    className={`flex items-center gap-4 p-5 rounded-3xl border-2 cursor-pointer transition-all shadow-sm ${attendance[s.id] ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30 opacity-60"}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md transform rotate-[-5deg] ${attendance[s.id] ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {s.id.slice(-2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-[var(--text)] leading-tight">
                        {s.name}
                      </p>
                      <p
                        className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${attendance[s.id] ? "text-green-500" : "text-red-500"}`}
                      >
                        {attendance[s.id] ? "Présent ✓" : "Absent ✗"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 flex justify-center gap-8 text-center p-6 bg-[var(--bg-light)] rounded-3xl border border-[var(--border)]">
                <div>
                  <p className="text-2xl font-black text-green-500">
                    {students.filter(s => attendance[s.id]).length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-[var(--text)]">
                    Présents
                  </p>
                </div>
                <div className="w-px h-10 bg-[var(--border)]"></div>
                <div>
                  <p className="text-2xl font-black text-red-500">
                    {students.filter(s => !attendance[s.id]).length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-[var(--text)]">
                    Absents
                  </p>
                </div>
                <div className="w-px h-10 bg-[var(--border)]"></div>
                <div>
                  <p className="text-2xl font-black text-[var(--primary)]">
                    {students.length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-[var(--text)]">
                    Total
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === "classement" &&
            (() => {
              const getStudentLeaderboardData = () => {
                return students.map((student) => {
                  const savedDataStr = localStorage.getItem(
                    `jugurtha_data_${student.id}`,
                  );
                  let scoresObj: Record<string, { total: number }> = {};
                  let badgesList: string[] = [];

                  const sIdNum = parseInt(student.id, 10);
                  const seedScores: Record<string, { total: number }> = {};

                  const seedCount = 4 + (sIdNum % 4);
                  for (let fId = 1; fId <= seedCount; fId++) {
                    const variance = (sIdNum * 5 + fId * 11) % 9;
                    const baseVal = 14.0 + (sIdNum % 4) * 0.8 + variance * 0.3;
                    const finalScore = Math.min(
                      20.0,
                      Math.floor(baseVal * 2) / 2,
                    );
                    seedScores[fId.toString()] = { total: finalScore };
                  }

                  if (savedDataStr) {
                    try {
                      const data = JSON.parse(savedDataStr);
                      scoresObj = data.scores || {};
                      badgesList = data.badges || [];
                    } catch (e) {
                      console.error(
                        "Error parsing student data for",
                        student.name,
                        e,
                      );
                    }
                  }

                  let activeScores = { ...seedScores };
                  let activeBadges = [
                    ...Array(Object.keys(activeScores).length),
                  ].map((_, i) => `Expert-${i + 1}`);

                  if (currentUser && currentUser.id === student.id) {
                    activeScores = { ...scores };
                    activeBadges = [...badges];
                  } else if (Object.keys(scoresObj).length > 0) {
                    activeScores = { ...scoresObj };
                    activeBadges = [...badgesList];
                  }

                  const completedFiches = Object.keys(activeScores)
                    .map(Number)
                    .sort((a, b) => a - b);
                  const completedCount = completedFiches.length;
                  const totalPoints = Object.values(activeScores).reduce(
                    (sum, item) => sum + (item.total || 0),
                    0,
                  );
                  const averageScore =
                    completedCount > 0 ? totalPoints / completedCount : 0;
                  const badgesCount = activeBadges.length;

                  return {
                    ...student,
                    completedCount,
                    totalPoints,
                    averageScore,
                    badgesCount,
                    completedFiches,
                    activeScores,
                  };
                });
              };

              const leaderboardData = getStudentLeaderboardData();

              const sortedData = [...leaderboardData].sort((a, b) => {
                if (rankingSortBy === "totalPoints") {
                  return b.totalPoints - a.totalPoints;
                } else if (rankingSortBy === "averageScore") {
                  if (b.averageScore === a.averageScore)
                    return b.completedCount - a.completedCount;
                  return b.averageScore - a.averageScore;
                } else if (rankingSortBy === "completedCount") {
                  if (b.completedCount === a.completedCount)
                    return b.totalPoints - a.totalPoints;
                  return b.completedCount - a.completedCount;
                } else {
                  if (b.badgesCount === a.badgesCount)
                    return b.totalPoints - a.totalPoints;
                  return b.badgesCount - a.badgesCount;
                }
              });

              const filteredData = sortedData.filter((s) => {
                const matchesSearch = s.name
                  .toLowerCase()
                  .includes(rankingSearch.toLowerCase());
                if (!matchesSearch) return false;

                if (rankingFilter === "active") {
                  return s.completedCount > 0;
                } else if (rankingFilter === "withBadges") {
                  return s.badgesCount > 0;
                } else if (rankingFilter === "podium") {
                  const rankIdx = sortedData.findIndex(
                    (item) => item.id === s.id,
                  );
                  return rankIdx >= 0 && rankIdx < 3;
                }
                return true;
              });

              const classTotalCompleted = leaderboardData.reduce(
                (acc, item) => acc + item.completedCount,
                0,
              );
              const classTotalBadges = leaderboardData.reduce(
                (acc, item) => acc + item.badgesCount,
                0,
              );
              const activeStudentsCount = leaderboardData.filter(
                (item) => item.completedCount > 0,
              ).length;
              const classAvgScore =
                activeStudentsCount > 0
                  ? leaderboardData.reduce(
                      (acc, item) =>
                        acc + (item.completedCount > 0 ? item.averageScore : 0),
                      0,
                    ) / activeStudentsCount
                  : 0;

              const firstPlace = sortedData[0];
              const secondPlace = sortedData[1];
              const thirdPlace = sortedData[2];
              const topStudent = firstPlace ? firstPlace.name : "Aucun";

              const displayedStudents = showAllRanking
                ? filteredData
                : filteredData.slice(0, 10);

              const myRankIndex =
                currentUser && currentUser.type === "student"
                  ? sortedData.findIndex((s) => s.id === currentUser.id)
                  : -1;
              const myRank = myRankIndex !== -1 ? myRankIndex + 1 : null;
              const myStats =
                myRankIndex !== -1 ? sortedData[myRankIndex] : null;

              const getInitials = (name: string) => {
                const parts = name.split(" ");
                return parts
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
              };

              return (
                <motion.div
                  key="ranking"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-[1100px] mx-auto px-2 space-y-8"
                >
                  <div className="bg-[var(--card-bg)] rounded-[40px] p-8 md:p-10 shadow-2xl border-4 border-[var(--border)] relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-2xl font-nunito"></div>
                    <div className="text-5xl md:text-6xl text-center shrink-0 p-4 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 border-2 border-dashed border-[var(--primary)]/20 rounded-3xl animate-bounce duration-4000">
                      🏆
                    </div>
                    <div className="text-center md:text-left flex-1 space-y-1">
                      <span className="text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                        Compétition Saine & Progrès
                      </span>
                      <h3 className="font-baloo text-3xl font-black text-[var(--primary)] uppercase leading-tight">
                        Le Hall de la Gloire
                      </h3>
                      <p className="text-xs font-bold text-[var(--text-muted)] lg:max-w-2xl">
                        Classement officiel de la 4ème C
                      </p>
                    </div>
                  </div>

                  {/* Statistiques Globales de la Classe */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 no-print">
                    {/* Card 1: Major de Promo */}
                    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-400/30 rounded-[32px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                      <span className="text-3xl mb-1">👑</span>
                      <h4 className="text-[10px] font-black text-yellow-800 uppercase tracking-widest leading-none mb-1.5 font-nunito">
                        Major de Promo
                      </h4>
                      <p
                        className="font-baloo font-black text-base text-amber-900 truncate max-w-full"
                        title={topStudent}
                      >
                        {topStudent}
                      </p>
                      <span className="text-[9px] text-yellow-700/80 font-bold mt-1">
                        Actuellement premier !
                      </span>
                    </div>

                    {/* Card 2: Moyenne Générale */}
                    <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-2 border-teal-400/30 rounded-[32px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                      <span className="text-3xl mb-1">📊</span>
                      <h4 className="text-[10px] font-black text-teal-800 uppercase tracking-widest leading-none mb-1.5 font-nunito">
                        Moyenne Classe
                      </h4>
                      <p className="font-baloo font-black text-base text-teal-900">
                        {classAvgScore.toFixed(1)} / 20
                      </p>
                      <span className="text-[9px] text-teal-700/80 font-bold mt-1">
                        Sur les élèves actifs
                      </span>
                    </div>

                    {/* Card 3: Fiches Complétées */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-400/30 rounded-[32px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                      <span className="text-3xl mb-1">📄</span>
                      <h4 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest leading-none mb-1.5 font-nunito">
                        Fiches Validées
                      </h4>
                      <p className="font-baloo font-black text-base text-indigo-900">
                        {classTotalCompleted}
                      </p>
                      <span className="text-[9px] text-indigo-700/80 font-bold mt-1">
                        Leçons terminées
                      </span>
                    </div>

                    {/* Card 4: Badges Accordés */}
                    <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-2 border-rose-400/30 rounded-[32px] p-5 shadow-sm text-center flex flex-col items-center justify-center">
                      <span className="text-3xl mb-1">🎖️</span>
                      <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest leading-none mb-1.5 font-nunito font-nunito">
                        Badges Distribués
                      </h4>
                      <p className="font-baloo font-black text-base text-rose-900">
                        {classTotalBadges}
                      </p>
                      <span className="text-[9px] text-rose-700/80 font-bold mt-1">
                        Succès débloqués
                      </span>
                    </div>
                  </div>

                  {/* Visual Podium (Only visible if searching is empty and filtering is default so people see the legendary top 3 clearly) */}
                  {!rankingSearch && rankingFilter === "all" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10 pb-4 max-w-4xl mx-auto">
                      {/* Second Place */}
                      {secondPlace && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.6 }}
                          className="flex flex-col items-center select-none order-2 md:order-1"
                        >
                          <div className="relative mb-3 group">
                            <div className="absolute inset-0 bg-gray-300 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-tr from-gray-100 to-gray-200 border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg font-baloo font-black text-2xl text-gray-400">
                              {getInitials(secondPlace.name)}
                            </div>
                            <div className="absolute -top-3 -right-3 bg-gray-100 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-black shadow-md border-2 border-gray-300 text-sm">
                              🥈
                            </div>
                          </div>
                          <p className="font-extrabold text-sm text-[var(--text)] text-center max-w-[180px] truncate leading-tight">
                            {secondPlace.name}
                          </p>
                          <p className="font-baloo font-black text-xs text-gray-500 mt-1">
                            {secondPlace.totalPoints.toFixed(1)} pts
                          </p>

                          {/* Podium Stand */}
                          <div className="w-full bg-gradient-to-b from-gray-200 via-gray-300/80 to-gray-200/50 h-28 rounded-t-3xl border-2 border-b-0 border-white/50 flex flex-col items-center justify-center shadow-md mt-3">
                            <span className="font-baloo font-black text-5xl text-white drop-shadow">
                              2
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-gray-600/70">
                              Moyenne: {secondPlace.averageScore.toFixed(1)}/20
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* First Place */}
                      {firstPlace && (
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                          className="flex flex-col items-center select-none order-1 md:order-2"
                        >
                          <div className="relative mb-3 group scale-110">
                            <div className="absolute inset-x-0 -top-6 text-center animate-bounce duration-1500 font-baloo">
                              👑
                            </div>
                            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-tr from-amber-100 to-yellow-200 border-4 border-yellow-400 rounded-full flex items-center justify-center shadow-2xl font-baloo font-black text-3xl text-yellow-600">
                              {getInitials(firstPlace.name)}
                            </div>
                            <div className="absolute -top-3 -right-3 bg-yellow-400 text-white w-9 h-9 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-white text-base animate-pulse">
                              🥇
                            </div>
                          </div>
                          <p className="font-extrabold text-base text-[var(--primary)] text-center max-w-[180px] truncate leading-tight mt-2">
                            {firstPlace.name}
                          </p>
                          <p className="font-baloo font-black text-sm text-yellow-600 mt-1">
                            {firstPlace.totalPoints.toFixed(1)} pts
                          </p>

                          {/* Podium Stand */}
                          <div className="w-full bg-gradient-to-b from-yellow-300 via-yellow-400/80 to-amber-300/50 h-36 rounded-t-3xl border-4 border-b-0 border-white/40 flex flex-col items-center justify-center shadow-xl mt-3 relative overflow-hidden">
                            <span className="font-baloo font-black text-6xl text-white drop-shadow">
                              1
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-yellow-900/80">
                              Moyenne: {firstPlace.averageScore.toFixed(1)}/20
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Third Place */}
                      {thirdPlace && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          className="flex flex-col items-center select-none order-3"
                        >
                          <div className="relative mb-3 group">
                            <div className="absolute inset-0 bg-amber-600 rounded-full blur-md opacity-20 group-hover:opacity-60 transition-opacity"></div>
                            <div className="relative w-18 h-18 bg-gradient-to-tr from-amber-50 to-orange-100 border-4 border-amber-600 rounded-full flex items-center justify-center shadow-lg font-baloo font-black text-xl text-amber-800">
                              {getInitials(thirdPlace.name)}
                            </div>
                            <div className="absolute -top-2 -right-2 bg-amber-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-black shadow-md border-2 border-white text-xs">
                              🥉
                            </div>
                          </div>
                          <p className="font-extrabold text-sm text-[var(--text)] text-center max-w-[180px] truncate leading-tight">
                            {thirdPlace.name}
                          </p>
                          <p className="font-baloo font-black text-xs text-amber-700 mt-1">
                            {thirdPlace.totalPoints.toFixed(1)} pts
                          </p>

                          {/* Podium Stand */}
                          <div className="w-full bg-gradient-to-b from-amber-500/80 via-amber-600/70 to-amber-700/40 h-22 rounded-t-3xl border-2 border-b-0 border-white/50 flex flex-col items-center justify-center shadow-md mt-3">
                            <span className="font-baloo font-black text-4xl text-white drop-shadow">
                              3
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-amber-900/70">
                              Moyenne: {thirdPlace.averageScore.toFixed(1)}/20
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Control Panel: Filtering, Search & Sorting */}
                  <div className="bg-[var(--card-bg)] rounded-[32px] p-6 md:p-8 shadow-xl border-4 border-[var(--border)] no-print space-y-6">
                    {/* Row 1: Search & Filter presets */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-dashed border-[var(--border)]">
                      {/* Search */}
                      <div className="space-y-2 flex-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                          🔍 Chercher par nom
                        </label>
                        <div className="relative w-full max-w-md">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Search size={16} />
                          </span>
                          <input
                            type="text"
                            placeholder="Ex: Adam, Aya, Amira..."
                            value={rankingSearch}
                            onChange={(e) => setRankingSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-[var(--bg-light)] text-[var(--text)] rounded-2xl outline-none border-2 border-[var(--border)] transition-all focus:border-[var(--primary)] text-xs font-bold shadow-inner"
                          />
                          {rankingSearch && (
                            <button
                              type="button"
                              onClick={() => setRankingSearch("")}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Filter Presets */}
                      <div className="space-y-2 shrink-0">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                          🎯 Filtrer les élèves
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { key: "all", label: "👥 Tous" },
                            { key: "active", label: "📄 Actifs (≥1 fiche)" },
                            { key: "withBadges", label: "🎖️ Avec badges" },
                            { key: "podium", label: "🏆 Podium (Top 3)" },
                          ].map((flt) => {
                            const isSel = rankingFilter === flt.key;
                            return (
                              <button
                                key={flt.key}
                                type="button"
                                onClick={() => {
                                  setRankingFilter(flt.key as any);
                                  showMascotMsg(`Affichage : ${flt.label}`);
                                }}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-sm border-2 ${
                                  isSel
                                    ? "bg-[var(--accent)] border-[var(--accent)] text-white scale-102 font-black shadow-md"
                                    : "bg-white border-gray-200 text-[var(--text-muted)] hover:border-gray-300 hover:text-[var(--text)]"
                                }`}
                              >
                                {flt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Sorting Criteria & Scope */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Sorters */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                          ⚡ Trier par critère
                        </label>
                        <div className="flex flex-wrap items-center gap-2 bg-[var(--bg-light)] p-1.5 rounded-2xl border border-[var(--border)]">
                          {[
                            { key: "totalPoints", label: "🏆 Points Cumulés" },
                            { key: "averageScore", label: "⭐ Moyenne / 20" },
                            {
                              key: "completedCount",
                              label: "📄 Fiches Validées",
                            },
                            { key: "badgesCount", label: "🎖️ Badges Gagnés" },
                          ].map((btn) => {
                            const isSel = rankingSortBy === btn.key;
                            return (
                              <button
                                key={btn.key}
                                type="button"
                                onClick={() => {
                                  setRankingSortBy(btn.key as any);
                                  showMascotMsg(`Tri par : ${btn.label}`);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                  isSel
                                    ? "bg-[var(--primary)] text-white shadow-md scale-102 font-black"
                                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/50"
                                }`}
                              >
                                {btn.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Scope: Top 10 vs Rest */}
                      <div className="space-y-2 shrink-0 self-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAllRanking(!showAllRanking);
                            showMascotMsg(
                              !showAllRanking
                                ? "Voici toute la classe ! 🏫"
                                : "Affichage du Top 10 ! 🌟",
                            );
                          }}
                          className={`w-full lg:w-auto px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all cursor-pointer select-none flex items-center justify-center gap-2 ${
                            showAllRanking
                              ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-md"
                              : "bg-white border-gray-200 text-[var(--text-muted)] hover:bg-[var(--bg-light)] hover:text-[var(--text)]"
                          }`}
                        >
                          <span>
                            {showAllRanking
                              ? "🏆 Voir seulement le Top 10"
                              : "🏫 Voir toute la classe"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Score Table / List */}
                  <div className="space-y-4 font-nunito">
                    {displayedStudents.length === 0 ? (
                      <div className="bg-[var(--card-bg)] rounded-[32px] p-12 text-center border-2 border-dashed border-[var(--border)]">
                        <p className="text-3xl mb-3">🔍</p>
                        <h4 className="font-baloo text-xl font-black text-[var(--text-muted)]">
                          Aucun élève trouvé
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Essaye d&apos;ajuster ta recherche de nom pour voir
                          d&apos;autres élèves.
                        </p>
                      </div>
                    ) : (
                      displayedStudents.map((s, index) => {
                        const rawRankIndex = sortedData.findIndex(
                          (item) => item.id === s.id,
                        );
                        const rank = rawRankIndex + 1;
                        const isMe = currentUser && currentUser.id === s.id;

                        const top3Backgrounds = [
                          "bg-yellow-400/5 hover:bg-yellow-400/10 border-yellow-300 shadow-[0_8px_20px_rgba(234,179,8,0.04)]",
                          "bg-gray-100/50 hover:bg-gray-100/80 border-gray-300",
                          "bg-amber-600/5 hover:bg-amber-600/10 border-amber-300",
                        ];

                        const cardStyle = isMe
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 ring-4 ring-[var(--primary)]/20 shadow-[0_12px_24px_rgba(0,0,0,0.08)] scale-[1.01] z-10"
                          : rank <= 3
                            ? `border-2 ${top3Backgrounds[rank - 1]}`
                            : "border-2 border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--bg-light)]/40 hover:scale-[1.005]";

                        return (
                          <motion.div
                            key={s.id}
                            layoutId={`rank-card-${s.id}`}
                            className={`relative p-5 rounded-[28px] shadow-sm flex flex-col md:flex-row items-center gap-4 transition-all ${cardStyle}`}
                          >
                            {/* Rank Badge */}
                            <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-2xl bg-[var(--bg-light)] border border-[var(--border)]">
                              {rank === 1 ? (
                                <span
                                  className="text-2xl"
                                  title="Premier de la classe"
                                >
                                  🥇
                                </span>
                              ) : rank === 2 ? (
                                <span className="text-2xl" title="Deuxième">
                                  🥈
                                </span>
                              ) : rank === 3 ? (
                                <span className="text-2xl" title="Troisième">
                                  🥉
                                </span>
                              ) : (
                                <span className="font-baloo font-black text-base text-[var(--text-muted)] leading-none">
                                  {rank}
                                </span>
                              )}
                            </div>

                            {/* Initials Avatar */}
                            <div
                              className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-baloo font-bold text-sm text-[var(--text)] border-2 ${
                                rank === 1
                                  ? "bg-amber-100 border-yellow-400"
                                  : rank === 2
                                    ? "bg-gray-200 border-gray-300"
                                    : rank === 3
                                      ? "bg-orange-100 border-amber-400"
                                      : "bg-[var(--bg-light)] border-[var(--border)]"
                              }`}
                            >
                              {getInitials(s.name)}
                            </div>

                            {/* Identity & visual progress */}
                            <div className="flex-1 min-w-[200px] text-center md:text-left space-y-1.5 font-nunito">
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="font-baloo font-black text-md text-[var(--text)]">
                                  {s.name}
                                </span>
                                <span className="text-[9px] font-mono font-bold bg-gray-200/50 text-[var(--text-muted)] px-2 py-0.5 rounded-md">
                                  ID {s.id}
                                </span>
                                {isMe && (
                                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm animate-pulse flex items-center gap-0.5">
                                    <span>⭐ Toi</span>
                                  </span>
                                )}
                              </div>

                              <div className="w-full">
                                <div className="h-2 bg-[var(--bg-light)] rounded-full overflow-hidden shadow-inner border border-gray-200/50 mt-1 max-w-sm mx-auto md:mx-0">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${Math.min(100, Math.max(5, (s.averageScore / 20) * 100))}%`,
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      ease: "easeOut",
                                    }}
                                    className={`h-full rounded-full bg-gradient-to-r ${
                                      rank === 1
                                        ? "from-yellow-400 to-amber-500"
                                        : rank === 2
                                          ? "from-gray-300 to-gray-400"
                                          : rank === 3
                                            ? "from-amber-500 to-amber-700"
                                            : "from-[var(--primary)] to-[var(--accent)]"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Stats sub-items */}
                            <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 shrink-0 text-center select-none text-[10px] font-bold text-[var(--text-muted)]">
                              <span className="px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 text-blue-600 rounded-xl flex items-center gap-1">
                                📄 {s.completedCount} fiches
                              </span>
                              <span className="px-3 py-1.5 bg-yellow-500/5 border border-yellow-500/10 text-yellow-600 rounded-xl flex items-center gap-1">
                                🏆 {s.badgesCount} badges
                              </span>
                            </div>

                            {/* Right side Points */}
                            <div className="text-center md:text-right shrink-0 min-w-[110px] space-y-0.5">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Score cumulé
                              </p>
                              <p className="font-baloo font-black text-2xl text-[var(--primary)] leading-none">
                                {s.totalPoints.toFixed(1)}{" "}
                                <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-normal ml-0.5">
                                  pts
                                </span>
                              </p>
                              <div className="text-[9px] font-black text-[var(--text-muted)] bg-gray-100 rounded-md px-2 py-0.5 inline-block opacity-80 mt-1">
                                Moy : {s.averageScore.toFixed(1)}/20
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer Personal stats card for current logged in student */}
                  {currentUser && currentUser.type === "student" && myStats && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 md:p-8 bg-gradient-to-r from-[var(--primary)] to-[var(--purple)] text-white rounded-[32px] shadow-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-10 text-[10rem] opacity-[0.05] font-black pointer-events-none uppercase -mr-12 -mt-16 leading-none">
                        {myRank}
                      </div>
                      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 font-nunito">
                        <div className="space-y-2 text-center md:text-left">
                          <span className="text-[10px] font-black bg-white/20 text-white border border-white/25 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                            🎯 Bilan de ta performance
                          </span>
                          <h4 className="font-baloo text-2xl font-black">
                            {myRank === 1
                              ? `Félicitations ${currentUser.name} ! Tu es le 1er ! 👑`
                              : myRank <= 3
                                ? `Incroyable ${currentUser.name} ! Tu es sur le podium ! 🥉🥈`
                                : `Bravo ${currentUser.name} ! Tu es classé(e) ${myRank}ème de la classe !`}
                          </h4>
                          <div className="text-xs text-white/90 font-bold leading-normal">
                            Tu as accumulé un total de{" "}
                            <strong className="text-white text-sm font-black underline decoration-2">
                              {myStats.totalPoints.toFixed(1)} points
                            </strong>{" "}
                            sur{" "}
                            <strong className="text-white">
                              {myStats.completedCount} fiches complétées
                            </strong>
                            .
                            {myRank !== 1 && sortedData[myRankIndex - 1] && (
                              <p className="mt-1 opacity-95 text-[11px]">
                                Plus que{" "}
                                <strong className="font-black text-yellow-300">
                                  {(
                                    sortedData[myRankIndex - 1].totalPoints -
                                    myStats.totalPoints
                                  ).toFixed(1)}{" "}
                                  points
                                </strong>{" "}
                                pour doubler{" "}
                                <span className="font-black italic text-badge-light">
                                  {sortedData[myRankIndex - 1].name}
                                </span>{" "}
                                et gagner une place au classement ! 🚀
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex border-4 border-white/20 rounded-2xl p-4 bg-white/10 text-center gap-6 divide-x divide-white/20 select-none font-baloo">
                          <div className="px-1 font-baloo">
                            <p className="text-2xl font-black font-baloo leading-none mb-1">
                              {myStats.completedCount}
                            </p>
                            <p className="text-[9px] uppercase font-black tracking-wider opacity-80 leading-none">
                              Complétées
                            </p>
                          </div>
                          <div className="pl-6 px-1 font-baloo">
                            <p className="text-2xl font-black font-baloo leading-none mb-1">
                              {myStats.averageScore.toFixed(1)}
                            </p>
                            <p className="text-[9px] uppercase font-black tracking-wider opacity-80 leading-none">
                              Moyenne
                            </p>
                          </div>
                          <div className="pl-6 px-1 font-baloo">
                            <p className="text-2xl font-black font-baloo leading-none mb-1">
                              {myStats.badgesCount}
                            </p>
                            <p className="text-[9px] uppercase font-black tracking-wider opacity-80 leading-none">
                              Badges
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })()}

          {currentPage === "diplomes" && (
            <motion.div key="diploma" className="flex flex-col items-center">
              <div className="bg-[var(--card-bg)] p-4 rounded-3xl shadow-2xl border-4 border-[var(--border)] mb-12 flex flex-wrap gap-4 items-center justify-center no-print">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-2">
                    Candidat :
                  </span>
                  <select
                    className="px-6 py-2 bg-[var(--bg-light)] text-[var(--text)] rounded-2xl font-black outline-none border-2 border-[var(--border)] transition-all focus:border-[var(--primary)] text-sm"
                    value={currentUser.id || ""}
                    onChange={(e) => {
                      const s = students.find(
                        (std) => std.id === e.target.value,
                      );
                      if (s && currentUser.type === "prof") {
                        setCurrentUser({
                          ...currentUser,
                          id: s.id,
                          name: s.name,
                        });
                      }
                    }}
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn-primary"
                  onClick={() =>
                    handlePrint(
                      langueActive === "en"
                        ? "Printing the Certificate with honor! 🎓🌟"
                        : "Impression de l'Attestation Scolaire avec honneur ! 🎓🌟",
                    )
                  }
                >
                  <Printer size={16} /> Imprimer l&apos;attestation
                </button>
                <button
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-650 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
                  onClick={() => {
                    showMascotMsg(
                      langueActive === "en"
                        ? "Pro Tip: Select 'Save as PDF' as your destination, and enable 'Background graphics' for perfect colors! 📄✨"
                        : "Astuce de pro : Dans la fenêtre d'impression, choisis 'Enregistrer au format PDF' comme destination, et active l'option 'Graphiques d'arrière-plan' pour un rendu de couleur impeccable ! 📄✨",
                    );
                    setTimeout(() => {
                      handlePrint();
                    }, 2500);
                  }}
                >
                  <Download size={16} /> Exporter en PDF
                </button>
              </div>

              {/* Diploma Card PRECISE SPECS */}
              <div className="w-full max-w-4xl bg-[var(--bg-light)] border-[12px] border-double border-[var(--primary)] rounded-[40px] p-12 text-center shadow-2xl relative overflow-hidden flex flex-col items-center justify-center diploma-paper min-h-[600px]">
                <div className="absolute -top-12 -right-12 text-[12rem] opacity-[0.03] pointer-events-none transform rotate-12">
                  {MASCOTS[currentTheme].emoji}
                </div>
                <div className="absolute -bottom-12 -left-12 text-[12rem] opacity-[0.03] pointer-events-none transform rotate-[-12deg]">
                  {MASCOTS[currentTheme].emoji}
                </div>

                <div className="text-3xl mb-4 opacity-80">🌟 🎓 ✨ 🎓 🌟</div>
                <h2 className="font-serif text-[2.5rem] md:text-[3.5rem] font-black text-[var(--primary)] mb-2 uppercase tracking-widest leading-tight">
                  Attestation de Réussite
                </h2>
                <p className="text-xs font-black italic text-[var(--text-muted)] uppercase tracking-[0.2em] mb-6">
                  École Primaire Jugurtha KEF • 4ème Année C • 2026
                </p>

                <div className="w-1/2 h-1.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto mb-8"></div>

                <p className="text-xl italic text-[var(--text)] mb-4 font-serif">
                  A été décernée avec honneur à :
                </p>
                <h3 className="font-serif text-[2.2rem] md:text-[3.5rem] font-black text-[var(--primary)] px-8 py-3 border-b-4 border-[var(--secondary)]/30 inline-block mb-8 min-w-[300px] leading-tight">
                  {currentUser.name}
                </h3>

                <div className="w-full flex flex-col md:flex-row justify-between items-end mt-4 gap-8 px-4">
                  <div className="text-left text-[var(--text)] font-bold italic space-y-2 order-2 md:order-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-50">
                      L'Enseignant
                    </p>
                    <p className="text-3xl mb-1">✍️</p>
                    <p className="text-sm font-black border-t-2 border-[var(--secondary)]/20 pt-2">
                      M. YAHYAOUI Nabil
                    </p>
                  </div>

                  <div className="relative group order-1 md:order-2 self-center md:self-auto">
                    <div className="relative bg-[var(--card-bg)] backdrop-blur px-8 py-4 rounded-[32px] border-4 border-[var(--primary)]/30 transform rotate-[-4deg] shadow-2xl ring-8 ring-[var(--text)]/10">
                      <p className="text-[9px] font-black uppercase text-[var(--accent)] tracking-widest border-b pb-1 mb-1 border-[var(--border)]">
                        Score Global APC
                      </p>
                      <p className="text-[2.2rem] font-black text-[var(--primary)] leading-none italic">
                        {(
                          (Object.values(scores) as any[]).reduce(
                            (acc: any, s: any) => acc + (s.total || 0),
                            0,
                          ) / (Object.keys(scores).length || 1)
                        ).toFixed(1)}
                        <span className="text-xs opacity-50 ml-1">/20</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[var(--text)] font-bold italic space-y-2 order-3">
                    <p className="text-[10px] uppercase tracking-widest opacity-50">
                      Direction
                    </p>
                    <p className="text-3xl mb-1">🏫</p>
                    <p className="text-sm font-black border-t-2 border-[var(--secondary)]/20 pt-2">
                      Sceau Officiel
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                  Évaluation Sommative • Discipline Lecture/Écriture
                </div>
              </div>
            </motion.div>
          )}

          {(currentPage === "notes" || currentPage === "corrige") &&
            currentUser?.type === "prof" &&
            !isUnlocked && (
              <motion.div
                key="pin-lock"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto my-12 bg-slate-900 border-2 border-red-900/50 p-6 rounded-3xl shadow-xl text-center space-y-4"
              >
                <div className="w-12 h-12 bg-red-950 text-red-400 rounded-full flex items-center justify-center mx-auto text-xl font-black">
                  🔒
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Espace Enseignant Sécurisé
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    L'accès aux fiches de notation et données des élèves est
                    restreint.
                  </p>
                </div>

                <form onSubmit={verifierCodeEnseignant} className="space-y-3">
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Entrez votre code PIN à 4 chiffres"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-center font-mono text-lg text-white tracking-widest focus:outline-none focus:border-red-500 font-black"
                  />
                  {pinError && (
                    <p className="text-[10px] text-rose-500 font-bold">
                      ⚠️ Code incorrect. Accès refusé.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-700 hover:bg-red-600 text-white font-black text-xs rounded-xl tracking-wide uppercase transition-colors"
                  >
                    Déverrouiller les données
                  </button>
                </form>
              </motion.div>
            )}

          {currentPage === "notes" && isUnlocked && (
            <motion.div key="notes" className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-emerald-900/40">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    🔓 ACCÈS ENSEIGNANT ACCORDÉ
                  </span>
                  <button
                    onClick={() => setIsUnlocked(false)}
                    className="text-[10px] bg-slate-800 px-3 py-1.5 text-slate-400 rounded-xl hover:text-white transition-colors"
                  >
                    Verrouiller
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  Affichage des grilles de critères d'évaluation C1, C2 et C5...
                </p>
              </div>

              <div className="bg-[var(--card-bg)] rounded-[40px] p-10 shadow-2xl border-4 border-[var(--primary)] overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 gap-6 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="font-baloo text-3xl font-black text-[var(--primary)]">
                      📊 Tableau des Notes & Correction
                    </h3>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                      Saisie des résultats • Validation APC • Mode Saisie Ultrarapide
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setShowStudentManager(!showStudentManager);
                        showMascotMsg(
                          !showStudentManager
                            ? "Ouverture de l'outil de gestion des élèves ! 👥⚙️"
                            : "Fermeture de l'outil de gestion des élèves. 💻"
                        );
                      }}
                      className={`px-4 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all text-xs uppercase tracking-wider border-2 relative overflow-hidden cursor-pointer ${
                        showStudentManager
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "bg-slate-800 border-slate-705 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      <Users size={14} /> Gérer les élèves {showStudentManager ? "▼" : "▲"}
                    </button>
                    <button
                      onClick={() =>
                        handlePrint(
                          langueActive === "en"
                            ? "Opening Print Dialogue... 🖨️"
                            : "Ouverture du menu d'impression... 🖨️",
                        )
                      }
                      className="no-print px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-xl border border-slate-700 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                    >
                      🖨️ Imprimer la Fiche de Suivi
                    </button>
                    <button className="px-6 py-2.5 bg-[var(--bg-light)] border-2 border-[var(--border)] rounded-2xl font-black text-[var(--text-muted)] flex items-center gap-2 hover:bg-[var(--border)] transition-all text-xs uppercase tracking-widest">
                      <Share2 size={16} /> Exporter CSV
                    </button>
                    <button className="px-6 py-2.5 bg-[var(--bg-light)] border-2 border-[var(--border)] rounded-2xl font-black text-[var(--text-muted)] flex items-center gap-2 hover:bg-[var(--border)] transition-all text-xs uppercase tracking-widest">
                      <Search size={16} /> Filtres
                    </button>
                  </div>
                </div>

                {/* =========================================================================
                    👥 GESTION DES ÉLÈVES (ADD / REMOVE / EDIT) PANEL
                    ========================================================================= */}
                <AnimatePresence>
                  {showStudentManager && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-8"
                    >
                      <div className="p-6 bg-slate-50 border-2 border-indigo-500/20 rounded-[32px] shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-2xl">👥</span>
                          <div>
                            <h4 className="font-baloo text-base font-black text-slate-800 uppercase tracking-wider">
                              Gestion de l'effectif de la classe
                            </h4>
                            <p className="text-[11px] text-slate-500 font-bold leading-normal">
                              Ajoutez, modifiez ou retirez des élèves de la liste active de la classe. Les correspondances de notes et données de présence s'adaptent instantanément !
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Formulaire d'ajout */}
                          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                            <div>
                              <span className="inline-block bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-4">
                                Ajouter un nouvel élève
                              </span>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                                    Nom complet de l'élève :
                                  </label>
                                  <input
                                    type="text"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    placeholder="Ex: Amara Traoré"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                                    Identifiant Unique (4 chiffres) :
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={4}
                                    value={newStudentId}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, "");
                                      setNewStudentId(val);
                                    }}
                                    placeholder="Ex: 0021"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-black text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                  />
                                  <p className="text-[9px] text-slate-400 mt-1 font-semibold leading-normal">
                                    Suggéré automatiquement à la suite des ID actuels, mais entièrement modifiable.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddStudent}
                              className="mt-6 w-full py-3 bg-indigo-650 hover:bg-slate-905 duration-300 text-white font-black text-[11px] uppercase tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                            >
                              <Plus size={14} /> Ajouter à la liste 🧑‍🎓
                            </button>
                          </div>

                          {/* Liste de l'effectif actuel */}
                          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                            <span className="inline-block bg-slate-50 text-slate-650 border border-slate-150 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-4">
                              Effectif actuel ({students.length} élèves)
                            </span>

                            <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
                              {students.map((st) => {
                                const isEditing = editingStudentId === st.id;
                                return (
                                  <div
                                    key={st.id}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                      isEditing
                                        ? "bg-indigo-50/40 border-indigo-200"
                                        : "bg-slate-50/40 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                                      <span className="font-mono text-xs font-black bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">
                                        {st.id}
                                      </span>
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={editingStudentName}
                                          onChange={(e) => setEditingStudentName(e.target.value)}
                                          className="flex-1 px-3 py-1 bg-white border-2 border-indigo-300 rounded-lg text-sm font-bold text-slate-800 outline-none"
                                          autoFocus
                                        />
                                      ) : (
                                        <span className="text-sm font-extrabold text-slate-800 truncate">
                                          {st.name}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      {isEditing ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleSaveEditStudent(st.id)}
                                            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer"
                                            title="Enregistrer"
                                          >
                                            <Check size={14} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingStudentId(null);
                                              setEditingStudentName("");
                                            }}
                                            className="p-1.5 bg-slate-200 hover:bg-slate-305 text-slate-600 rounded-lg transition-colors cursor-pointer"
                                            title="Annuler"
                                          >
                                            <X size={14} />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleStartEditStudent(st.id, st.name)}
                                            className="p-1.5 bg-white hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                            title="Modifier"
                                          >
                                            <Edit2 size={13} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveStudent(st.id)}
                                            className="p-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                            title="Supprimer"
                                            disabled={students.length <= 1}
                                            style={students.length <= 1 ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* =========================================================================
                    ⚡ PANNEAU DE CORRECTION RAPIDE 'ENSEIGNANT' COCKPIT
                    ========================================================================= */}
                {(() => {
                  const currentStudent = students.find(std => std.id === activeCorrectionStudentId) || students[0];
                  const activeStudentIndex = students.findIndex(std => std.id === currentStudent?.id);
                  
                  const uGrades = currentStudent ? (studentGrades[currentStudent.id] || { C2: "0.0", C3: "0.0", C4: "0.0", C6: "0.0", C1: "0.0", C5: "0.0" }) : { C2: "0.0", C3: "0.0", C4: "0.0", C6: "0.0", C1: "0.0", C5: "0.0" };
                  const c2 = uGrades.C2 || "";
                  const c3 = uGrades.C3 || "";
                  const c4 = uGrades.C4 || "";
                  const c6 = uGrades.C6 || "";
                  const c1 = uGrades.C1 || "";
                  const c5 = uGrades.C5 || "";

                  const n_c2 = parseFloat(c2) || 0;
                  const n_c3 = parseFloat(c3) || 0;
                  const n_c4 = parseFloat(c4) || 0;
                  const n_c6 = parseFloat(c6) || 0;
                  const n_c1 = parseFloat(c1) || 0;
                  const n_c5 = parseFloat(c5) || 0;

                  const lcSum = (n_c2 + n_c3 + n_c4 + n_c6).toFixed(1);
                  const lvSum = (n_c1 + n_c5).toFixed(1);
                  const totalSum = (parseFloat(lcSum) + parseFloat(lvSum)).toFixed(1);

                  return (
                    <div className="mb-10 p-6 bg-slate-50 border-2 border-slate-200/80 rounded-[32px] shadow-sm">
                      
                      {/* Élève Switcher bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🧑‍🏫</span>
                            <h4 className="font-baloo text-sm font-black text-slate-800 uppercase tracking-wider">
                              Saisie rapide par élève :
                            </h4>
                          </div>
                          <span className="text-[10px] font-black text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                            {activeStudentIndex + 1} / {students.length} ÉLÈVES
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1">
                          {students.map((st, sidx) => {
                            const stGrades = studentGrades[st.id] || { C2: "0.0", C3: "0.0", C4: "0.0", C6: "0.0", C1: "0.0", C5: "0.0" };
                            const st_tot = (
                              (parseFloat(stGrades.C2 || "0") || 0) +
                              (parseFloat(stGrades.C3 || "0") || 0) +
                              (parseFloat(stGrades.C4 || "0") || 0) +
                              (parseFloat(stGrades.C6 || "0") || 0) +
                              (parseFloat(stGrades.C1 || "0") || 0) +
                              (parseFloat(stGrades.C5 || "0") || 0)
                            );
                            const isSel = st.id === activeCorrectionStudentId;
                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => {
                                  setActiveCorrectionStudentId(st.id);
                                  showMascotMsg(`Copie sélectionnée : ${st.name} 📝`);
                                }}
                                className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2 border-2 rounded-2xl transition-all text-left outline-none relative hover:scale-[1.02] active:scale-95 cursor-pointer ${
                                  isSel
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/20"
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                  isSel ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                                }`}>
                                  {st.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black tracking-tight leading-none whitespace-nowrap">
                                    {st.name}
                                  </p>
                                  <p className={`text-[8.5px] mt-1 font-bold ${isSel ? "text-indigo-200" : "text-slate-400"}`}>
                                    Note : {st_tot.toFixed(1)} / 20
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detail interactive grading terminal */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-3xl border border-slate-150 shadow-sm relative overflow-hidden">
                        
                        {/* Gauge & Student Details */}
                        <div className="lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
                          <div className="space-y-4 text-center lg:text-left">
                            <span className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                              ÉVALUATION ACTIVE
                            </span>
                            <div className="flex flex-col lg:flex-row items-center gap-3">
                              <span className="text-4xl bg-indigo-50 p-2.5 rounded-2xl">
                                🧑‍🎓
                              </span>
                              <div className="text-center lg:text-left">
                                <h4 className="font-baloo text-lg font-black text-slate-900 leading-tight">
                                  {currentStudent?.name}
                                </h4>
                                <p className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase mt-1">
                                  Élève ID : {currentStudent?.id}
                                </p>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 inline-block w-full text-center">
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Note globale calculée</p>
                              <div className="text-3xl font-black font-baloo text-indigo-650 flex items-baseline justify-center gap-1 mt-1">
                                {totalSum} <span className="text-xs text-slate-400 font-normal">/ 20</span>
                              </div>
                              
                              <span className={`inline-block text-[9px] font-black px-3 py-1 rounded-full uppercase border mt-2 ${
                                parseFloat(totalSum) >= 15
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : parseFloat(totalSum) >= 10
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-red-50 text-red-650 border-red-100"
                              }`}>
                                {parseFloat(totalSum) >= 15
                                  ? "Maitrise Excellente ⭐"
                                  : parseFloat(totalSum) >= 10
                                    ? "Moyenne Atteinte 👍"
                                    : "Renforcement requis 📚"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-6">
                            <button
                              type="button"
                              disabled={activeStudentIndex === 0}
                              onClick={() => {
                                if (activeStudentIndex > 0) {
                                  setActiveCorrectionStudentId(students[activeStudentIndex - 1].id);
                                  showMascotMsg(`Élève précédent : ${students[activeStudentIndex - 1].name} ⬅️`);
                                }
                              }}
                              className={`flex-1 py-2.5 px-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeStudentIndex === 0 ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-50" : "bg-white hover:bg-slate-50 text-slate-700 hover:scale-[1.01]"
                              }`}
                            >
                              <ChevronLeft size={14} />
                              Précédent
                            </button>
                            <button
                              type="button"
                              disabled={activeStudentIndex === students.length - 1}
                              onClick={() => {
                                if (activeStudentIndex < students.length - 1) {
                                  setActiveCorrectionStudentId(students[activeStudentIndex + 1].id);
                                  showMascotMsg(`Élève suivant : ${students[activeStudentIndex + 1].name} ➡️`);
                                }
                              }}
                              className={`flex-1 py-2.5 px-3 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeStudentIndex === students.length - 1 ? "opacity-30 cursor-not-allowed text-slate-400 bg-slate-50" : "bg-white hover:bg-slate-50 text-slate-700 hover:scale-[1.01]"
                              }`}
                            >
                              Suivant
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Sliders Grid */}
                        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-indigo-50">
                            <p className="text-xs font-black text-indigo-950 uppercase tracking-widest">
                              🧠 Indicateurs APC (Saisie Assistée 0 à 20)
                            </p>
                            <span className="text-[8.5px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              ⚠️ Notes sécurisées [0 - 20]
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* C2 */}
                            <div className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">C2 Compréhension</span>
                                <span className="text-[10px] font-extrabold text-indigo-600">{c2 || "0.0"} / 20</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={c2}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C2", e.target.value)}
                                  className="w-12 py-1 text-center font-black text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={parseFloat(c2) || 0}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C2", e.target.value)}
                                  className="flex-1 accent-indigo-600 h-1 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* C3 */}
                            <div className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">C3 Fluidité</span>
                                <span className="text-[10px] font-extrabold text-indigo-600">{c3 || "0.0"} / 20</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={c3}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C3", e.target.value)}
                                  className="w-12 py-1 text-center font-black text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={parseFloat(c3) || 0}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C3", e.target.value)}
                                  className="flex-1 accent-indigo-600 h-1 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* C4 */}
                            <div className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">C4 Orthographe</span>
                                <span className="text-[10px] font-extrabold text-indigo-600">{c4 || "0.0"} / 20</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={c4}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C4", e.target.value)}
                                  className="w-12 py-1 text-center font-black text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={parseFloat(c4) || 0}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C4", e.target.value)}
                                  className="flex-1 accent-indigo-600 h-1 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* C6 */}
                            <div className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">C6 Décodage</span>
                                <span className="text-[10px] font-extrabold text-indigo-600">{c6 || "0.0"} / 20</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={c6}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C6", e.target.value)}
                                  className="w-12 py-1 text-center font-black text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={parseFloat(c6) || 0}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C6", e.target.value)}
                                  className="flex-1 accent-indigo-600 h-1 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* C1 */}
                            <div className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">C1 Expressivité</span>
                                <span className="text-[10px] font-extrabold text-indigo-600">{c1 || "0.0"} / 20</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={c1}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C1", e.target.value)}
                                  className="w-12 py-1 text-center font-black text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={parseFloat(c1) || 0}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C1", e.target.value)}
                                  className="flex-1 accent-indigo-600 h-1 cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* C5 */}
                            <div className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">C5 Vocabulaire</span>
                                <span className="text-[10px] font-extrabold text-indigo-600">{c5 || "0.0"} / 20</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={c5}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C5", e.target.value)}
                                  className="w-12 py-1 text-center font-black text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={parseFloat(c5) || 0}
                                  onChange={(e) => updateStudentGrade(currentStudent.id, "C5", e.target.value)}
                                  className="flex-1 accent-indigo-600 h-1 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const isLast = activeStudentIndex === students.length - 1;
                                if (!isLast) {
                                  setActiveCorrectionStudentId(students[activeStudentIndex + 1].id);
                                  showMascotMsg(`Notes enregistrées ! En cours de saisie pour ${students[activeStudentIndex + 1].name} 🤝📊`);
                                } else {
                                  showMascotMsg("Félicitations ! Vous avez complété les notes pour l'ensemble de la classe ! 🎉🎓");
                                }
                              }}
                              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-650 hover:bg-slate-905 duration-300 text-white font-black text-[11px] uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all text-center cursor-pointer"
                            >
                              Enregistrer & Élève Suivant 💾➡️
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })()}

                <div className="overflow-x-auto rounded-3xl border-2 border-[var(--border)]">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-[var(--primary)] to-[var(--purple)] text-white font-black uppercase text-[9px] tracking-widest text-center">
                        <th className="p-5 text-left border-r border-white/10">
                          ID
                        </th>
                        <th className="p-5 text-left border-r border-white/10">
                          Nom & Prénom
                        </th>
                        <th className="p-5 border-r border-white/10">C2</th>
                        <th className="p-5 border-r border-white/10">C3</th>
                        <th className="p-5 border-r border-white/10">C4</th>
                        <th className="p-5 border-r border-white/10">C6</th>
                        <th className="p-5 bg-white/10 border-r border-white/10">
                          LC /12
                        </th>
                        <th className="p-5 border-r border-white/10">C1</th>
                        <th className="p-5 border-r border-white/10">C5</th>
                        <th className="p-5 bg-white/5 border-r border-white/10">
                          LV /8
                        </th>
                        <th className="p-5 text-white bg-[var(--primary)] font-black text-xs">
                          TOT /20
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => {
                        const uGrades = studentGrades[s.id] || { C2: "0.0", C3: "0.0", C4: "0.0", C6: "0.0", C1: "0.0", C5: "0.0" };
                        const c2 = uGrades.C2 || "";
                        const c3 = uGrades.C3 || "";
                        const c4 = uGrades.C4 || "";
                        const c6 = uGrades.C6 || "";
                        const c1 = uGrades.C1 || "";
                        const c5 = uGrades.C5 || "";

                        const n_c2 = parseFloat(c2) || 0;
                        const n_c3 = parseFloat(c3) || 0;
                        const n_c4 = parseFloat(c4) || 0;
                        const n_c6 = parseFloat(c6) || 0;
                        const n_c1 = parseFloat(c1) || 0;
                        const n_c5 = parseFloat(c5) || 0;

                        const lcSum = (n_c2 + n_c3 + n_c4 + n_c6).toFixed(1);
                        const lvSum = (n_c1 + n_c5).toFixed(1);
                        const totalSum = (parseFloat(lcSum) + parseFloat(lvSum)).toFixed(1);

                        const isSelected = s.id === activeCorrectionStudentId;

                        return (
                          <tr
                            key={s.id}
                            onClick={() => {
                              setActiveCorrectionStudentId(s.id);
                            }}
                            className={`border-b border-[var(--border)] transition-colors font-bold text-[var(--text)] cursor-pointer ${
                              isSelected
                                ? "bg-indigo-50/40 ring-2 ring-indigo-400"
                                : idx % 2 === 0
                                ? "bg-transparent"
                                : "bg-[var(--bg-light)]/50"
                            } hover:bg-slate-100/55`}
                          >
                            <td className="p-5 text-left text-[var(--text-muted)] font-mono text-[10px]">
                              {s.id}
                            </td>
                            <td className="p-5 text-left text-sm text-[var(--text)] font-extrabold">
                              {isSelected && <span className="text-indigo-600 mr-1">👉</span>}
                              {s.name}
                            </td>
                            <td className="p-5">
                              <input
                                type="text"
                                value={c2}
                                onChange={(e) => updateStudentGrade(s.id, "C2", e.target.value)}
                                className={`w-12 h-10 text-center bg-white border-2 rounded-xl outline-none focus:border-[var(--primary)] text-[var(--text)] transition-all text-sm font-black ${
                                  c2 && (parseFloat(c2) < 0 || parseFloat(c2) > 20) ? "border-red-400 bg-red-50 text-red-950" : "border-[var(--border)]"
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="p-5">
                              <input
                                type="text"
                                value={c3}
                                onChange={(e) => updateStudentGrade(s.id, "C3", e.target.value)}
                                className={`w-12 h-10 text-center bg-white border-2 rounded-xl outline-none focus:border-[var(--primary)] text-[var(--text)] transition-all text-sm font-black ${
                                  c3 && (parseFloat(c3) < 0 || parseFloat(c3) > 20) ? "border-red-400 bg-red-50 text-red-950" : "border-[var(--border)]"
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="p-5">
                              <input
                                type="text"
                                value={c4}
                                onChange={(e) => updateStudentGrade(s.id, "C4", e.target.value)}
                                className={`w-12 h-10 text-center bg-white border-2 rounded-xl outline-none focus:border-[var(--primary)] text-[var(--text)] transition-all text-sm font-black ${
                                  c4 && (parseFloat(c4) < 0 || parseFloat(c4) > 20) ? "border-red-400 bg-red-50 text-red-950" : "border-[var(--border)]"
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="p-5">
                              <input
                                type="text"
                                value={c6}
                                onChange={(e) => updateStudentGrade(s.id, "C6", e.target.value)}
                                className={`w-12 h-10 text-center bg-white border-2 rounded-xl outline-none focus:border-[var(--primary)] text-[var(--text)] transition-all text-sm font-black ${
                                  c6 && (parseFloat(c6) < 0 || parseFloat(c6) > 20) ? "border-red-400 bg-red-50 text-red-950" : "border-[var(--border)]"
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="p-5 text-center text-[var(--blue)] font-black text-sm">
                              {lcSum}
                            </td>
                            <td className="p-5">
                              <input
                                type="text"
                                value={c1}
                                onChange={(e) => updateStudentGrade(s.id, "C1", e.target.value)}
                                className={`w-12 h-10 text-center bg-white border-2 rounded-xl outline-none focus:border-[var(--primary)] text-[var(--text)] transition-all text-sm font-black ${
                                  c1 && (parseFloat(c1) < 0 || parseFloat(c1) > 20) ? "border-red-400 bg-red-50 text-red-950" : "border-[var(--border)]"
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="p-5">
                              <input
                                type="text"
                                value={c5}
                                onChange={(e) => updateStudentGrade(s.id, "C5", e.target.value)}
                                className={`w-12 h-10 text-center bg-white border-2 rounded-xl outline-none focus:border-[var(--primary)] text-[var(--text)] transition-all text-sm font-black ${
                                  c5 && (parseFloat(c5) < 0 || parseFloat(c5) > 20) ? "border-red-400 bg-red-50 text-red-950" : "border-[var(--border)]"
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="p-5 text-center text-[var(--blue)] font-black text-sm">
                              {lvSum}
                            </td>
                            <td className="p-5 text-center bg-[var(--primary)]/5">
                              <span className="inline-block px-4 py-2 bg-[var(--card-bg)] rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] font-black text-base italic shadow-sm transform scale-110">
                                {totalSum}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === "corrige" &&
            currentUser.type === "prof" &&
            isUnlocked && (
              <motion.div
                key="corrige"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="bg-[var(--card-bg)] rounded-[40px] p-12 shadow-2xl border-4 border-indigo-400">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-2 border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-md border-2 border-indigo-100">
                        <Mic
                          size={28}
                          className={
                            isTeacherRecording
                              ? "animate-[bounce_0.8s_infinite] text-red-500"
                              : "text-indigo-600"
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-baloo text-2xl font-black text-indigo-950">
                          🎙️ Studio Audio Enseignant
                        </h3>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                          Créez des modèles de lecture de secours de qualité
                          humaine.
                        </p>
                      </div>
                    </div>
                    {/* Fiche selector */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                        Fiche cible :
                      </label>
                      <select
                        value={teacherRecordingFicheId}
                        onChange={(e) =>
                          setTeacherRecordingFicheId(Number(e.target.value))
                        }
                        className="bg-white border-2 border-slate-200 text-slate-850 text-xs font-black px-4 py-2 rounded-xl outline-none focus:border-indigo-400 transition-all cursor-pointer"
                      >
                        {Object.keys(FICHES).map((id) => (
                          <option key={id} value={id}>
                            Fiche {id} : {FICHES[Number(id)].theme}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-left space-y-4">
                      <p className="text-[10px] text-indigo-800 uppercase tracking-widest font-black">
                        Texte à enregistrer pour le modèle :
                      </p>
                      <blockquote className="text-sm font-semibold text-[var(--text)] leading-relaxed italic border-l-4 border-indigo-400 pl-4 py-1 max-h-[160px] overflow-y-auto">
                        "{FICHES[teacherRecordingFicheId]?.text}"
                      </blockquote>
                      <div className="text-[11px] font-black uppercase text-indigo-600 flex items-center gap-2">
                        <span>🏷️</span> ID de référence :{" "}
                        <code className="bg-white border rounded px-1.5 py-0.5 font-mono text-[9px]">
                          fiche_{teacherRecordingFicheId}_lecture
                        </code>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-6 py-4">
                      {/* Controls and timer or waving visualization */}
                      <div className="flex items-center gap-4">
                        {!isTeacherRecording ? (
                          <button
                            type="button"
                            onClick={startTeacherRecording}
                            className="group flex items-center gap-2.5 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20 font-black text-xs uppercase tracking-widest cursor-pointer"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                            🔴 Enregistrer
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopTeacherRecording}
                            className="group flex items-center gap-2.5 px-6 py-3.5 bg-slate-855 hover:bg-slate-900 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-800/10 font-black text-xs uppercase tracking-widest cursor-pointer"
                          >
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-sm animate-pulse"></span>
                            🛑 Arrêter ({teacherRecordingTimer}s)
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={!teacherAudioUrl || isTeacherRecording}
                          onClick={playTeacherAudioPreview}
                          className={`group flex items-center gap-2 px-6 py-3.5 font-black text-xs uppercase tracking-[0.08em] rounded-2xl transition-all hover:scale-[1.03] active:scale-95 shadow-md ${teacherAudioUrl && !isTeacherRecording ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-emerald-500/20" : "bg-slate-100 text-slate-400 pointer-events-none"}`}
                        >
                          {isPlayingTeacherPreview ? (
                            <Pause size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                          ▶️ Écouter le Cache
                        </button>
                      </div>

                      {/* Status and info message */}
                      <div className="text-center">
                        <p
                          className={`text-xs font-black tracking-wide ${teacherStatusColor} transition-all duration-300`}
                        >
                          {teacherStatusMsg}
                        </p>
                        {teacherAudioUrl && !isTeacherRecording && (
                          <button
                            type="button"
                            onClick={deleteTeacherAudio}
                            className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all uppercase tracking-widest cursor-pointer"
                          >
                            <Trash2 size={12} /> Supprimer du cache offline
                          </button>
                        )}
                      </div>

                      {/* live pulsing circle visualization when recording */}
                      {isTeacherRecording && (
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <span className="w-1.5 h-4 bg-red-500 rounded-full animate-[pulse_0.4s_infinite_0.1s]"></span>
                          <span className="w-1.5 h-8 bg-red-500 rounded-full animate-[pulse_0.4s_infinite_0.2s]"></span>
                          <span className="w-1.5 h-6 bg-red-500 rounded-full animate-[pulse_0.4s_infinite_0.3s]"></span>
                          <span className="w-1.5 h-10 bg-red-500 rounded-full animate-[pulse_0.4s_infinite_0.4s]"></span>
                          <span className="w-1.5 h-5 bg-red-500 rounded-full animate-[pulse_0.4s_infinite_0.5s]"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--card-bg)] rounded-[40px] p-12 shadow-2xl border-4 border-[var(--accent)]">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 bg-[var(--accent)]/10 text-[var(--accent)] rounded-[32px] flex items-center justify-center shadow-xl shadow-[var(--accent)]/10 border-2 border-[var(--accent)]/20">
                      <Shield size={40} />
                    </div>
                    <div>
                      <h3 className="font-baloo text-3xl font-black text-[var(--accent)]">
                        Espace Enseignant : Corrigés
                      </h3>
                      <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">
                        Guide de Correction Officiel • Fiche {currentFicheId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="p-8 bg-green-500/10 rounded-[32px] border-2 border-green-500/20 shadow-sm">
                      <h4 className="font-black text-green-500 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                        Dossier : Activités Fiche
                      </h4>
                      {FICHES[currentFicheId].dossierContent ? (
                        <div className="space-y-6 text-sm font-bold text-[var(--text)]">
                          <div>
                            <p className="text-[10px] uppercase text-green-600 mb-2">
                              A1 : Rédaction Dirigée
                            </p>
                            <ul className="list-disc pl-4 space-y-1">
                              {FICHES[
                                currentFicheId
                              ].dossierContent?.redaction.map((r, i) => (
                                <li key={i} className="text-xs font-medium">
                                  {r.correct}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-green-600 mb-2">
                              A3 : Texte à Trous (Mots ordonnés)
                            </p>
                            <p className="text-xs font-medium">
                              {getClozeCorrectWords(
                                currentFicheId,
                                langueActive,
                              ).join(" • ")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs italic opacity-50">
                          Aucune donnée de dossier pour cette fiche.
                        </p>
                      )}
                    </div>

                    <div className="p-8 bg-amber-500/10 rounded-[32px] border-2 border-amber-500/20 shadow-sm">
                      <h4 className="font-black text-amber-500 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
                        Évaluation Sommative
                      </h4>
                      <ul className="space-y-4">
                        {FICHES[currentFicheId].evaluation.map((ev, i) => (
                          <li
                            key={i}
                            className="text-sm font-bold border-b border-amber-500/10 pb-2"
                          >
                            <span className="text-amber-600 mr-2">
                              Q{i + 1}:
                            </span>{" "}
                            {ev.answer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-[40px] p-12 shadow-2xl border-4 border-[var(--primary)]">
                  <h3 className="font-baloo text-2xl font-black text-[var(--primary)] mb-8">
                    Guide d'Évaluation APC
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        c: "C1",
                        desc: "Articulation et prononciation",
                        pts: 5,
                      },
                      { c: "C2", desc: "Compréhension globale", pts: 3 },
                      { c: "C3", desc: "Repérage d'informations", pts: 3 },
                      { c: "C5", desc: "Fluidité de lecture", pts: 3 },
                    ].map((crit) => (
                      <div
                        key={crit.c}
                        className="p-4 bg-white border-2 border-[var(--border)] rounded-2xl"
                      >
                        <p className="font-black text-[var(--primary)] mb-1">
                          {crit.c}
                        </p>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">
                          {crit.desc}
                        </p>
                        <p className="text-xs font-black">
                          Barème : {crit.pts} pts
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 📊 GÉNÉRATEUR DE RAPPORT (Dans l'espace enseignant déverrouillé) */}
                <div className="bg-[var(--card-bg)] rounded-[40px] p-12 shadow-2xl border-4 border-indigo-400 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4 text-left">
                    <div>
                      <h4 className="text-xl font-black text-indigo-500 font-baloo uppercase tracking-wide flex items-center gap-2">
                        📊 Générateur de Rapports Analytiques
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Générez des statistiques de maîtrise APC basées sur
                        l'activité des élèves.
                      </p>
                    </div>

                    <div className="flex gap-2 no-print">
                      <button
                        onClick={() => {
                          const uneSemaineRapport = logsHistorique.filter(
                            (log) =>
                              new Date(log.date) >= new Date("2026-05-28"),
                          );
                          const totalScores = uneSemaineRapport.reduce(
                            (acc, l) => acc + l.score,
                            0,
                          );
                          const avgScore =
                            uneSemaineRapport.length > 0
                              ? (
                                  totalScores / uneSemaineRapport.length
                                ).toFixed(1)
                              : "0";
                          const reports = [
                            `Épreuves terminées : ${uneSemaineRapport.length}`,
                            `Moyenne de score des Gardiens : ${avgScore} Pts`,
                            `Demandes d'aide de secours sollicitées : ${uneSemaineRapport.filter((l) => l.aideDemandee).length} fois`,
                          ];
                          setReportModalData({
                            title: "Rapport Hebdomadaire",
                            lines: reports,
                          });
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-slate-200 text-xs font-black rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        🗓️ Rapport Hebdomadaire
                      </button>
                      <button
                        onClick={() => {
                          const reports = [
                            `Volume total d'évaluations : ${logsHistorique.length}`,
                            `Note moyenne de satisfaction (Feedback Rating) : 4.4/5 ⭐`,
                            `Taux de complétion moyen de l'Odyssée : 94%`,
                            `Apprenants représentés : ${Array.from(new Set(logsHistorique.map((l) => l.eleve))).join(", ")}`,
                          ];
                          setReportModalData({
                            title: "Rapport Mensuel Global",
                            lines: reports,
                          });
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                      >
                        📅 Rapport Mensuel Global
                      </button>
                    </div>
                  </div>

                  {/* Tableau de bord récapitulatif des performances de la classe */}
                  <div className="overflow-x-auto rounded-3xl border-2 border-[var(--border)] bg-slate-900/40 p-1 text-left">
                    <table className="w-full text-xs text-[var(--text)]">
                      <thead className="bg-[#111114]/80 text-[var(--text-muted)] font-black uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-3 rounded-l-lg">Date</th>
                          <th className="p-3">Apprenant</th>
                          <th className="p-3 text-center">Fiche N°</th>
                          <th className="p-3 text-center font-bold">
                            Note Globale
                          </th>
                          <th className="p-3 text-center font-bold">
                            Aide Sollicitée
                          </th>
                          <th className="p-3 rounded-r-lg text-center font-bold">
                            Avis
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {logsHistorique.map((log, index) => (
                          <tr key={index} className="hover:bg-slate-800/10">
                            <td className="p-3 font-mono text-[var(--text-muted)]">
                              {log.date}
                            </td>
                            <td className="p-3 font-black text-[var(--text)]">
                              {log.eleve}
                            </td>
                            <td className="p-3 text-center">{log.ficheId}</td>
                            <td className="p-3 text-center font-black text-indigo-500">
                              {log.score} Pts
                            </td>
                            <td className="p-3 text-center">
                              {log.aideDemandee ? (
                                <span className="bg-amber-950 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-900/50 font-bold text-[10px]">
                                  OUI ⚠️
                                </span>
                              ) : (
                                <span className="text-slate-500 font-bold">
                                  Non
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center text-amber-500">
                              {"⭐".repeat(log.rating || 0) || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 📢 ZONE D'INSERTION DEVOIR ENSEIGNANT */}
                <ZoneInsertionDevoirEnseignant
                  onSauvegarder={handleSauvegarderDevoirEnseignant}
                />

                {/* 📢 FORMULAIRE DEVOIR ADMIN (Pédagogie APC / Différenciation) */}
                <FormulaireDevoirAdmin
                  onPublierDevoir={handlePublierDevoirPedagogique}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Footer / Copyright */}
      <footer className="max-w-[1200px] mx-auto px-6 py-10 mt-12 border-t-2 border-[var(--border)] no-print flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
        <div className="text-center md:text-left">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
            © 2026 E.P Jugurtha KEF
          </p>
          <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1">
            Conception : M. Yahyaoui Nabil • nabil.yahyaoui@education.tn
          </p>
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
            <ImageIcon size={20} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
            <Users size={20} />
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-light)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
            <Search size={20} />
          </div>
        </div>
        <AnimatePresence>
          {selectedVocabWord && (
            <VocabFlashcardModal
              word={selectedVocabWord}
              data={vocabData[selectedVocabWord]}
              loading={isVocabLoading}
              onClose={() => setSelectedVocabWord(null)}
              onSpeak={speakWord}
              currentIndex={
                (FICHES[currentFicheId]?.vocab || []).indexOf(
                  selectedVocabWord,
                ) + 1
              }
              totalCount={(FICHES[currentFicheId]?.vocab || []).length}
              isMastered={masteredWords.includes(selectedVocabWord)}
              onToggleMastery={() => {
                setMasteredWords((prev) =>
                  prev.includes(selectedVocabWord)
                    ? prev.filter((w) => w !== selectedVocabWord)
                    : [...prev, selectedVocabWord],
                );
              }}
              onNext={(() => {
                const words = FICHES[currentFicheId]?.vocab || [];
                const idx = words.indexOf(selectedVocabWord);
                if (idx < words.length - 1) {
                  return () => {
                    const nextWord = words[idx + 1];
                    setSelectedVocabWord(nextWord);
                    if (!vocabData[nextWord]) fetchVocabDetails(nextWord);
                  };
                }
                return undefined;
              })()}
              onPrev={(() => {
                const words = FICHES[currentFicheId]?.vocab || [];
                const idx = words.indexOf(selectedVocabWord);
                if (idx > 0) {
                  return () => {
                    const prevWord = words[idx - 1];
                    setSelectedVocabWord(prevWord);
                    if (!vocabData[prevWord]) fetchVocabDetails(prevWord);
                  };
                }
                return undefined;
              })()}
            />
          )}
          {showHomeworkModal && (
            <HomeworkModal
              editingHomework={editingHomework || undefined}
              onUpdate={(updatedHw) => {
                setHomeworks((prev) =>
                  prev.map((h) => (h.id === updatedHw.id ? updatedHw : h)),
                );
                showMascotMsg("Le devoir a été mis à jour avec succès ! 📝✨");
              }}
              fiches={FICHES}
              onClose={() => {
                setShowHomeworkModal(false);
                setEditingHomework(null);
              }}
              onCreate={(hw) => {
                const newHw: Homework = {
                  ...hw,
                  id: Math.random().toString(36).substr(2, 9),
                  createdAt: new Date().toISOString(),
                };
                setHomeworks((prev) => [newHw, ...prev]);
                showMascotMsg("Le nouveau devoir a été publié ! 📢✨");
              }}
            />
          )}

          {showPdfEditor && activeEditingAttachmentIdx !== null && (
            <PdfEditorModal
              isOpen={showPdfEditor}
              fileName={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.name || "devoir.pdf"
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.name || "devoir.pdf"
              }
              fileDataUrl={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.dataUrl || ""
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.dataUrl || ""
              }
              initialEditedText={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.editedText
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.editedText
              }
              initialAnnotations={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.annotations
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.annotations
              }
              onClose={() => {
                setShowPdfEditor(false);
                setActiveEditingAttachmentIdx(null);
                setTeacherEditingHwId(null);
                setTeacherEditingStudentId(null);
              }}
              onSave={(text, annots) => {
                if (teacherEditingHwId && teacherEditingStudentId) {
                  const updated = homeworks.map((h) => {
                    if (h.id === teacherEditingHwId) {
                      const subs = h.submissions ? { ...h.submissions } : {};
                      const sub = subs[teacherEditingStudentId];
                      if (sub && sub.attachments) {
                        const atts = [...sub.attachments];
                        if (atts[activeEditingAttachmentIdx]) {
                          atts[activeEditingAttachmentIdx] = {
                            ...atts[activeEditingAttachmentIdx],
                            editedText: text,
                            annotations: annots,
                          };
                        }
                        subs[teacherEditingStudentId] = {
                          ...sub,
                          attachments: atts,
                        };
                      }
                      return { ...h, submissions: subs };
                    }
                    return h;
                  });
                  setHomeworks(updated);
                  setTeacherEditingHwId(null);
                  setTeacherEditingStudentId(null);
                } else {
                  const updated = [...studentHomeworkAttachments];
                  if (updated[activeEditingAttachmentIdx]) {
                    updated[activeEditingAttachmentIdx].editedText = text;
                    updated[activeEditingAttachmentIdx].annotations = annots;
                    setStudentHomeworkAttachments(updated);
                    if (
                      text &&
                      !studentHomeworkText.includes(text.substring(0, 30))
                    ) {
                      setStudentHomeworkText((prev) =>
                        prev ? prev + "\n\n" + text : text,
                      );
                    }
                  }
                }
                setActiveEditingAttachmentIdx(null);
                setShowPdfEditor(false);
                showMascotMsg(
                  "Super ! Les modifications et annotations sur le PDF ont bien été enregistrées. 📄✏️",
                );
              }}
            />
          )}

          {showDocEditor && activeEditingAttachmentIdx !== null && (
            <DocEditorModal
              isOpen={showDocEditor}
              fileName={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.name || "devoir.docx"
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.name || "devoir.docx"
              }
              fileDataUrl={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.dataUrl || ""
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.dataUrl || ""
              }
              initialEditedText={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.editedText
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.editedText
              }
              onClose={() => {
                setShowDocEditor(false);
                setActiveEditingAttachmentIdx(null);
                setTeacherEditingHwId(null);
                setTeacherEditingStudentId(null);
              }}
              onSave={(text) => {
                if (teacherEditingHwId && teacherEditingStudentId) {
                  const updated = homeworks.map((h) => {
                    if (h.id === teacherEditingHwId) {
                      const subs = h.submissions ? { ...h.submissions } : {};
                      const sub = subs[teacherEditingStudentId];
                      if (sub && sub.attachments) {
                        const atts = [...sub.attachments];
                        if (atts[activeEditingAttachmentIdx]) {
                          atts[activeEditingAttachmentIdx] = {
                            ...atts[activeEditingAttachmentIdx],
                            editedText: text,
                          };
                        }
                        subs[teacherEditingStudentId] = {
                          ...sub,
                          attachments: atts,
                        };
                      }
                      return { ...h, submissions: subs };
                    }
                    return h;
                  });
                  setHomeworks(updated);
                  setTeacherEditingHwId(null);
                  setTeacherEditingStudentId(null);
                } else {
                  const updated = [...studentHomeworkAttachments];
                  if (updated[activeEditingAttachmentIdx]) {
                    updated[activeEditingAttachmentIdx].editedText = text;
                    setStudentHomeworkAttachments(updated);
                    if (
                      text &&
                      !studentHomeworkText.includes(text.substring(0, 30))
                    ) {
                      setStudentHomeworkText((prev) =>
                        prev ? prev + "\n\n" + text : text,
                      );
                    }
                  }
                }
                setActiveEditingAttachmentIdx(null);
                setShowDocEditor(false);
                showMascotMsg(
                  "Le texte rédigé sous format Word .docx a bien été appliqué et synchronisé. 💾📝",
                );
              }}
            />
          )}

          {showImageEditor && activeEditingAttachmentIdx !== null && (
            <ImageEditorModal
              image={
                teacherEditingHwId && teacherEditingStudentId
                  ? homeworks.find((h) => h.id === teacherEditingHwId)
                      ?.submissions?.[teacherEditingStudentId]?.attachments?.[
                      activeEditingAttachmentIdx
                    ]?.dataUrl || ""
                  : studentHomeworkAttachments[activeEditingAttachmentIdx]
                      ?.dataUrl || ""
              }
              onClose={() => {
                setShowImageEditor(false);
                setActiveEditingAttachmentIdx(null);
                setTeacherEditingHwId(null);
                setTeacherEditingStudentId(null);
              }}
              onSave={(editedImg) => {
                if (teacherEditingHwId && teacherEditingStudentId) {
                  const updated = homeworks.map((h) => {
                    if (h.id === teacherEditingHwId) {
                      const subs = h.submissions ? { ...h.submissions } : {};
                      const sub = subs[teacherEditingStudentId];
                      if (sub && sub.attachments) {
                        const atts = [...sub.attachments];
                        if (atts[activeEditingAttachmentIdx]) {
                          atts[activeEditingAttachmentIdx] = {
                            ...atts[activeEditingAttachmentIdx],
                            dataUrl: editedImg,
                            editedImage: editedImg,
                          };
                        }
                        subs[teacherEditingStudentId] = {
                          ...sub,
                          attachments: atts,
                          imageResponse: editedImg,
                        };
                      }
                      return { ...h, submissions: subs };
                    }
                    return h;
                  });
                  setHomeworks(updated);
                  setTeacherEditingHwId(null);
                  setTeacherEditingStudentId(null);
                } else {
                  const updated = [...studentHomeworkAttachments];
                  if (updated[activeEditingAttachmentIdx]) {
                    updated[activeEditingAttachmentIdx].dataUrl = editedImg;
                    updated[activeEditingAttachmentIdx].editedImage = editedImg;
                    setStudentHomeworkAttachments(updated);
                    setStudentHomeworkImage(editedImg);
                  }
                }
                setActiveEditingAttachmentIdx(null);
                setShowImageEditor(false);
                showMascotMsg(
                  "La photo de l'élève a bien été corrigée et annotée ! 🖼️✨",
                );
              }}
            />
          )}

          {showHelpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => setShowHelpModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[var(--card-bg)] rounded-[32px] p-6 shadow-2xl max-w-sm md:max-w-md w-full border-4 border-amber-500 text-[var(--text)] overflow-y-auto max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">❓</span>
                    <div>
                      <h3 className="font-baloo text-xl font-black text-amber-600">
                        Aide & Astuces
                      </h3>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        Besoin d'un coup de pouce ?
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="p-1 px-2.5 bg-[var(--bg-light)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] rounded-xl font-black transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-[var(--text)] font-semibold leading-relaxed">
                    Voici quelques conseils pour t'aider à réussir l'activité en
                    cours :
                  </p>
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 text-left">
                    <span className="text-xl">🎓</span>
                    <div>
                      <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wide">
                        Lit attentivement
                      </h4>
                      <p className="text-[11px] text-amber-700/90 leading-normal mt-0.5">
                        Lis le texte de la fiche d'exercice plusieurs fois pour
                        bien imprégner ta mémoire des mots et de la
                        prononciation correcte.
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex gap-3 text-left">
                    <span className="text-xl">🔊</span>
                    <div>
                      <h4 className="font-bold text-xs text-indigo-800 uppercase tracking-wide">
                        Dictée Magique
                      </h4>
                      <p className="text-[11px] text-indigo-700/90 leading-normal mt-0.5">
                        Si tu es coincé sur un mot dans la dictée, clique sur
                        l'icône de haut-parleur pour écouter à nouveau
                        l'enregistrement.
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex gap-3 text-left">
                    <span className="text-xl">💡</span>
                    <div>
                      <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wide">
                        Lexique & Répétition
                      </h4>
                      <p className="text-[11px] text-emerald-700/90 leading-normal mt-0.5">
                        Visite le Lexique à tout moment ou utilise l'Assistant
                        Vocal pour t'aider à déchiffrer chaque syllabe
                        d'orthographe.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowHelpModal(false)}
                  className="w-full mt-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                >
                  C'est compris, je continue ! 🚀
                </button>
              </motion.div>
            </motion.div>
          )}

          {reportModalData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md no-print"
              onClick={() => setReportModalData(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[var(--card-bg)] rounded-[32px] p-6 shadow-2xl max-w-sm md:max-w-md w-full border-4 border-indigo-550 text-[var(--text)] overflow-y-auto max-h-[85vh] border-indigo-500"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📊</span>
                    <div>
                      <h3 className="font-baloo text-xl font-black text-indigo-600">
                        {reportModalData.title}
                      </h3>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        Rapport de Performance Scolaire
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setReportModalData(null)}
                    className="p-1 px-2.5 bg-[var(--bg-light)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] rounded-xl font-black transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 py-2 text-left">
                  {reportModalData.lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2.5 text-xs text-[var(--text)] leading-relaxed border-b border-[var(--border)]/30 pb-2"
                    >
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setReportModalData(null)}
                  className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                >
                  Fermer le Rapport
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>

      <AssistantMot
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        word={assistantWord}
        wordInfo={assistantWordInfo}
        isLoading={isAssistantLoading}
        onAddWordToLexicon={addToLexicon}
        isSavedInLexicon={isSavedInLexicon}
        onLookUpWord={handleAssistantLookup}
      />
    </div>
  );

  function current_theme_as_any(): any {
    return currentTheme;
  }
}

// --- Internal Helper Components ---

const NavBtn = ({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full font-baloo font-black transition-all transform hover:-translate-y-1 active:scale-95 shadow-md shrink-0 ${active ? "bg-[var(--primary)] text-white shadow-[var(--primary)]/30 border-b-4 border-black/10" : "bg-[var(--card-bg)] text-[var(--text-muted)] border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
  >
    <div
      className={`flex flex-col items-center justify-center transition-all duration-300 ${active ? "-translate-y-0.5" : "group-hover:-translate-y-1.5"}`}
    >
      <Icon size={20} className={active ? "animate-bounce" : ""} />
      <span
        className={`text-[8px] md:text-[9px] leading-tight tracking-tighter truncate max-w-[48px] md:max-w-[56px] transition-all duration-300 mt-0.5 text-center ${active ? "opacity-100 scale-100 max-h-4" : "opacity-0 scale-75 max-h-0 overflow-hidden pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:max-h-4"}`}
      >
        {children}
      </span>
    </div>
    {active && (
      <motion.div
        layoutId="nav-bg"
        className="absolute inset-0 bg-white/10 rounded-full"
      />
    )}
  </button>
);

const Question = ({
  id,
  points,
  comp,
  text,
  children,
}: {
  id: string;
  points: string;
  comp: string;
  text: string;
  children: React.ReactNode;
}) => (
  <div className="relative p-8 rounded-[40px] bg-[var(--card-bg)] border-2 border-[var(--border)] hover:border-[var(--primary)]/30 transition-all group shadow-sm">
    <div className="absolute -left-4 top-8 w-12 h-12 bg-[var(--card-bg)] border-[6px] border-[var(--bg-dark)] rounded-2xl flex items-center justify-center font-baloo font-black text-[var(--text-muted)]/30 group-hover:text-[var(--primary)] group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/5 transition-all transform -rotate-12 shadow-md">
      {id}
    </div>
    <div className="absolute -right-4 top-6 flex flex-col gap-2 items-end">
      <span className="bg-[var(--bg-light)] text-[var(--blue)] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ring-4 ring-[var(--card-bg)] border border-[var(--border)]">
        {comp}
      </span>
      <span className="bg-[var(--bg-light)] text-[var(--primary)] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ring-4 ring-[var(--card-bg)] border border-[var(--border)]">
        /{points} pts
      </span>
    </div>
    <div className="pl-8 pt-2">
      <p className="font-baloo text-xl font-black text-[var(--text)] leading-tight pr-14 mb-4">
        {text}
      </p>
      <div className="relative z-10">{children}</div>
    </div>

    {/* Subtle decorative placeholder */}
    <div className="absolute bottom-4 right-8 opacity-[0.02] text-[4rem] pointer-events-none group-hover:opacity-[0.05] transition-opacity transform group-hover:rotate-12 text-[var(--text)]">
      📝
    </div>
  </div>
);

const Gap = ({
  choices,
  current,
  onChange,
  answer,
}: {
  choices: string[];
  current?: string;
  onChange: (val: string) => void;
  answer?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCorrect = !!answer && current === answer;
  const isWrong = !!answer && !!current && current !== answer;

  return (
    <span className="relative inline-block mx-1">
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`min-w-[120px] border-b-2 border-dashed font-black transition-all px-2 flex items-center justify-center gap-1 ${
          isCorrect
            ? "text-green-500 border-green-500"
            : isWrong
              ? "text-red-500 border-red-500"
              : current
                ? "text-[var(--purple)] border-[var(--purple)]"
                : "text-[var(--text-muted)] border-[var(--border)]"
        }`}
      >
        {current || "................"}
        {isCorrect && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
            ✨
          </motion.span>
        )}
        {isWrong && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
            🤔
          </motion.span>
        )}
      </motion.button>

      {isOpen && (
        <span className="contents">
          <span
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[var(--card-bg)] border-2 border-[var(--purple)] rounded-2xl shadow-xl z-[70] overflow-hidden min-w-[150px] block"
          >
            {choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-xs font-black uppercase hover:bg-[var(--purple)] hover:text-white transition-colors border-b border-[var(--border)] last:border-0 ${current === c ? "bg-[var(--purple)]/10 text-[var(--purple)]" : "text-[var(--text)]"}`}
              >
                {c}
              </button>
            ))}
          </motion.span>
        </span>
      )}
    </span>
  );
};

const JUGURTHA_DB_NAME = "OdysseeAudioDB";
const JUGURTHA_STORE_NAME = "enregistrements";
const JUGURTHA_DB_VERSION = 1;

const openAudioDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(JUGURTHA_DB_NAME, JUGURTHA_DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(JUGURTHA_STORE_NAME)) {
        db.createObjectStore(JUGURTHA_STORE_NAME);
      }
    };
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

const saveAudioToIndexedDB = async (key: string, blob: Blob): Promise<void> => {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(JUGURTHA_STORE_NAME, "readwrite");
      const store = transaction.objectStore(JUGURTHA_STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to save audio to IndexedDB:", e);
  }
};

const getAudioFromIndexedDB = async (key: string): Promise<Blob | null> => {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(JUGURTHA_STORE_NAME, "readonly");
      const store = transaction.objectStore(JUGURTHA_STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to retrieve audio from IndexedDB:", e);
    return null;
  }
};

const deleteAudioFromIndexedDB = async (key: string): Promise<void> => {
  try {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(JUGURTHA_STORE_NAME, "readwrite");
      const store = transaction.objectStore(JUGURTHA_STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to delete audio from IndexedDB:", e);
  }
};

const AudioRecorder = ({
  recordingKey,
  onMicrophoneError,
  onRecordingSaved,
  lang = "fr",
  originalText = "",
}: {
  recordingKey: string;
  onMicrophoneError?: (msg: string) => void;
  onRecordingSaved?: (msg: string) => void;
  lang?: "fr" | "en";
  originalText?: string;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech to Text Hook
  const {
    transcript,
    startRecording: startStt,
    stopRecording: stopStt,
    setTranscript,
  } = useSpeechToText(lang);

  // Word comparison and scoring
  const cleanupRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()«»?"']/g;
  const nett = (str: string) =>
    str
      .toLowerCase()
      .replace(cleanupRegex, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const originalWords = originalText
    ? originalText.split(/\s+/).filter(Boolean)
    : [];
  const transcriptWords = transcript ? nett(transcript) : [];

  const motsCorrects =
    originalText && transcript
      ? calculerMotsCorrects(originalText, transcript)
      : 0;
  const totalMots = originalText ? nett(originalText).length : 0;
  const percentage =
    totalMots > 0 ? Math.round((motsCorrects / totalMots) * 100) : 0;
  const syllabesLues =
    originalText && motsCorrects > 0
      ? estimerSyllabesLues(motsCorrects, originalText)
      : 0;

  const getMotivationalFeedback = () => {
    if (percentage === 100) {
      return lang === "en"
        ? "🏆 Outstanding! You read every single word perfectly! Gold star! 🌟⭐"
        : "🏆 Exceptionnel ! Tu as lu absolument tous les mots parfaitement ! Médaille d'or ! 🌟⭐";
    }
    if (percentage >= 75) {
      return lang === "en"
        ? "👏 Amazing progress! Nearly perfect reading, keep showing off those skills! 🚀"
        : "👏 Progrès fantastiques ! Près d'un sans-faute, bravo champion ! 🚀";
    }
    if (percentage > 0) {
      return lang === "en"
        ? "📖 Good start! Keep practicing aloud to find all the words! You can do it! ✨"
        : "📖 Bon début ! Continue de lire à haute voix pour décrocher toutes les étoiles ! Tu es sur la bonne voie ! ✨";
    }
    return lang === "en"
      ? "🎙️ Ready? Tap the record button above and read the school text aloud!"
      : "🎙️ Prêt(e) ? Appuie sur le gros bouton rouge et lis le texte à voix haute !";
  };

  // Load existing audio when recordingKey changes
  useEffect(() => {
    let active = true;
    const fetchSavedAudio = async () => {
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });

      // Clear/load transcript
      const savedTranscript =
        localStorage.getItem(`stt_transcript_${recordingKey}`) || "";
      setTranscript(savedTranscript);

      if (!recordingKey) return;
      const cachedBlob = await getAudioFromIndexedDB(recordingKey);
      if (cachedBlob && active) {
        const url = URL.createObjectURL(cachedBlob);
        setAudioUrl(url);
      }
    };
    fetchSavedAudio();
    return () => {
      active = false;
    };
  }, [recordingKey, setTranscript]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Save to IndexedDB
        if (recordingKey) {
          await saveAudioToIndexedDB(recordingKey, blob);
          if (onRecordingSaved) {
            onRecordingSaved(
              lang === "en"
                ? "Congratulations! Your reading recording has been saved locally! 💾🎙️"
                : "Félicitations ! Ton enregistrement de lecture a été sauvegardé localement ! 💾🎙️",
            );
          }
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      // Start text recognition in parallel
      setTranscript("");
      try {
        startStt();
      } catch (sttErr) {
        console.warn("Speech to Text not supported or refused", sttErr);
      }

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      if (onMicrophoneError) {
        onMicrophoneError(
          lang === "en"
            ? "Oops! I don't have access to the microphone. Please allow it to record! ✨"
            : "Oups ! Je n'ai pas accès au micro. Autorise-le pour enregistrer ta voix ! ✨",
        );
      } else {
        alert("Microphone non autorisé. Veuillez vérifier vos paramètres.");
      }
    }
  };

  const stopRecording = () => {
    // Stop STT in parallel
    try {
      stopStt();
    } catch (sttErr) {
      console.warn("Failed to stop STT", sttErr);
    }

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Persist transcript when it changes or recording finishes
  useEffect(() => {
    if (transcript && recordingKey) {
      localStorage.setItem(`stt_transcript_${recordingKey}`, transcript);
    }
  }, [transcript, recordingKey]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="group relative flex items-center justify-center w-24 h-24 bg-red-400 text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-xl shadow-red-400/30 dark:bg-red-500"
          >
            <div className="absolute inset-0 rounded-full bg-red-400 dark:bg-red-500 animate-ping opacity-20 group-hover:opacity-40"></div>
            <Mic
              size={32}
              className="relative z-10 animate-[pulse_1.5s_infinite]"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="group relative flex items-center justify-center w-24 h-24 bg-[var(--text)] text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-xl shadow-black/20"
          >
            <div className="absolute inset-0 rounded-full bg-black animate-pulse opacity-20"></div>
            <Square size={32} className="relative z-10" />
          </button>
        )}
        <p className="font-baloo font-extrabold text-[var(--accent)] tracking-widest uppercase text-xs animate-[pulse_2s_infinite]">
          {isRecording
            ? lang === "en"
              ? "🔴 Recording & Transcribing..."
              : "🔴 Enregistrement & Transcription..."
            : lang === "en"
              ? "Tap to record & read 🎙️"
              : "Appuie pour enregistrer & lire 🎙️"}
        </p>
      </div>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-4xl font-baloo font-black text-red-500 tabular-nums">
            {formatTime(recordingTime)}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [8, 24, 8] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                className="w-1.5 bg-red-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Real-time speech transcription container */}
      {(isRecording || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-indigo-50/70 border-3 border-indigo-200/80 p-5 rounded-[32px] shadow-sm flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-1 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider font-mono flex items-center gap-1">
                🤖 AI Speech Transcription
              </span>
            </div>
            {isRecording && (
              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider font-mono px-2 py-0.5 bg-indigo-100 rounded-full animate-pulse">
                Listening Live...
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-slate-800 leading-relaxed italic pr-2">
            "
            {transcript ||
              (lang === "en"
                ? "Start reading aloud to see speech-to-text live..."
                : "Commence à lire à haute voix pour voir s'afficher ton texte...")}
            "
          </p>
        </motion.div>
      )}

      {/* Real-time reading score and analysis layout if originalText is provided */}
      {originalText && (isRecording || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-emerald-50/60 border-3 border-emerald-200/80 p-5 rounded-[32px] shadow-sm flex flex-col gap-4 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100/80">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider font-mono">
                {lang === "en"
                  ? "Reading Performance Analysis"
                  : "Analyse de Performance de Lecture"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center justify-end">
              <div className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
                {motsCorrects} / {totalMots} {lang === "en" ? "words" : "mots"}{" "}
                ({percentage}%)
              </div>
              {syllabesLues > 0 && (
                <div className="bg-teal-100 text-teal-800 text-xs font-black px-3 py-1 rounded-full border border-teal-300 animate-pulse flex items-center gap-1">
                  <span>✨</span>
                  <span>
                    {syllabesLues} {lang === "en" ? "syllables" : "syllabes"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-emerald-200/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>

          {/* Motivational phrase */}
          <p className="text-xs font-extrabold text-emerald-800 bg-emerald-100/50 px-3 py-2 rounded-2xl border border-emerald-200/30">
            {getMotivationalFeedback()}
          </p>

          {/* Interactive word checklist */}
          <div className="flex flex-wrap gap-2 justify-center p-3 bg-white/80 rounded-2xl border border-emerald-100/65 max-h-48 overflow-y-auto">
            {originalWords.map((word, idx) => {
              const cleaned = word
                .toLowerCase()
                .replace(cleanupRegex, "")
                .trim();
              const isCorrect = transcriptWords.includes(cleaned);
              return (
                <motion.span
                  key={idx}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: isCorrect ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all duration-300 ${
                    isCorrect
                      ? "bg-emerald-100/80 text-emerald-800 border-2 border-emerald-200 shadow-sm shadow-emerald-50"
                      : "bg-slate-50 text-slate-400 border border-slate-200"
                  }`}
                >
                  {word}
                  {isCorrect && <span className="text-[10px]">✅</span>}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      )}

      {audioUrl && !isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white p-6 rounded-[32px] border-2 border-[var(--primary)] shadow-xl flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                <Volume2 size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-[var(--text)] uppercase tracking-widest">
                  {lang === "en"
                    ? "Recording saved"
                    : "Enregistrement enregistré"}
                </p>
                <p className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                  <span>💾</span>{" "}
                  {lang === "en" ? "Saved in cache" : "Sauvegardé en mémoire"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                if (audioUrl) URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
                localStorage.removeItem(`stt_transcript_${recordingKey}`);
                setTranscript("");
                if (recordingKey) {
                  await deleteAudioFromIndexedDB(recordingKey);
                  if (onRecordingSaved) {
                    onRecordingSaved(
                      lang === "en"
                        ? "The recording was successfully deleted from memory. 🗑️"
                        : "L'enregistrement a bien été supprimé du stockage. 🗑️",
                    );
                  }
                }
              }}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="bg-[var(--bg-light)] p-2 rounded-2xl">
            <audio src={audioUrl} controls className="w-full h-10" />
          </div>
        </motion.div>
      )}
    </div>
  );
};
