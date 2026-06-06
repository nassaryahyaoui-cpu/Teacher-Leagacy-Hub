export interface QCMQuestion {
  q: string;
  choices: string[];
  answer: string;
}

export interface OpenQuestion {
  q: string;
  placeholder?: string;
  keywords: string[];
  helperText?: string;
}

export interface LangueQuestion {
  q: string;
  instruction: string;
  type: 'input' | 'select';
  choices?: string[];
  answer: string;
}

export interface RedactionQuestion {
  prompt: string;
  mandatoryWords: string[];
  exampleAnswer?: string;
}

export interface Exam {
  id: number;
  title: string;
  qcm: QCMQuestion[];
  open: OpenQuestion[];
  langue: LangueQuestion[];
  redaction: RedactionQuestion;
}

export const EXAMS: Record<number, Exam> = {
  1: {
    id: 1,
    title: "La maladie de Jacquot",
    qcm: [
      { q: "Pourquoi Jacquot ne va-t-il pas à l'école ?", choices: ["Il est en vacances", "Il est malade", "Il fait beau"], answer: "Il est malade" },
      { q: "Qui la maman de Jacquot appelle-t-elle ?", choices: ["Le voisin", "Le docteur", "Le directeur"], answer: "Le docteur" },
      { q: "Où la maman va-t-elle acheter les médicaments ?", choices: ["À la pharmacie", "Au supermarché", "À la boulangerie"], answer: "À la pharmacie" }
    ],
    open: [
      { q: "Quels sont les symptômes de Jacquot répertoriés dans le texte ?", keywords: ["fièvre", "corps brûlant", "toux", "gorge rouge"], placeholder: "il a une forte fièvre..." },
      { q: "Comment le gentil docteur examine-t-il Jacquot ?", keywords: ["stéthoscope", "gorge", "coeur"], placeholder: "Il utilise son stéthoscope..." }
    ],
    langue: [
      { q: "Quel est le synonyme du mot 'médecin' ?", instruction: "Saisis le mot du texte", type: "input", answer: "docteur" },
      { q: "Complète : 'Jacquot ___ très chaud.'", instruction: "Choisis le bon verbe", type: "select", choices: ["a", "est", "ont"], answer: "a" }
    ],
    redaction: {
      prompt: "Écris 2 phrases pour raconter comment la maman de Jacquot prend soin de son fils malade.",
      mandatoryWords: ["maman", "médicament", "guérir", "chaud"]
    }
  },
  2: {
    id: 2,
    title: "Le cirque arrive en ville",
    qcm: [
      { q: "De quelle couleur est le chapiteau ?", choices: ["Bleu", "Vert", "Rouge"], answer: "Rouge" },
      { q: "Quel artiste marche sur un fil très haut ?", choices: ["Le clown", "L'acrobate", "Le jongleur"], answer: "L'acrobate" },
      { q: "Que font les spectateurs pour montrer leur joie ?", choices: ["Ils crient", "Ils dorment", "Ils applaudissent"], answer: "Ils applaudissent" }
    ],
    open: [
      { q: "Que font les clowns sur la scène ?", keywords: ["grimaces", "comiques", "rire"], placeholder: "Ils font des..." },
      { q: "Avec quoi les jongleurs font-ils leur spectacle ?", keywords: ["balles", "multicolores"], placeholder: "Ils lancent des..." }
    ],
    langue: [
      { q: "Mets au pluriel : 'un clown comique' -> 'des ...'", instruction: "Saisis la réponse complète", type: "input", answer: "clowns comiques" },
      { q: "Trouve le contraire de 'tristement' dans le texte.", instruction: "Choisis l'adverbe correspondant", type: "select", choices: ["prudemment", "joyeusement", "magnifique"], answer: "joyeusement" }
    ],
    redaction: {
      prompt: "Raconte en 2 phrases quel numéro de cirque tu aimerais faire et pourquoi.",
      mandatoryWords: ["clown", "jongleur", "spectacle", "balles"]
    }
  },
  3: {
    id: 3,
    title: "Une journée à la campagne",
    qcm: [
      { q: "Où va la famille de Sami ?", choices: ["À l'école", "À la campagne", "Au zoo"], answer: "À la campagne" },
      { q: "Quel jour de la semaine se passe l'histoire ?", choices: ["Samedi", "Dimanche", "Mardi"], answer: "Dimanche" },
      { q: "Que fait le papa près de la rivière ?", choices: ["Il prépare les grillades", "Il dort sagement", "Il nage dans l'eau"], answer: "Il prépare les grillades" }
    ],
    open: [
      { q: "Où la maman installe-t-elle la nappe de pique-nique ?", keywords: ["herbe verte", "près d'une rivière"], placeholder: "Sur l'herbe..." },
      { q: "Que font Sami et sa sœur pendant que papa prépare le repas ?", keywords: ["jouent au ballon", "ballon"], placeholder: "Ils jouent..." }
    ],
    langue: [
      { q: "Accorde l'adjectif qualificatif : 'une nappe (vert)' -> 'une nappe ___'", instruction: "Saisis l'adjectif accordé", type: "input", answer: "verte" },
      { q: "Sami et sa sœur ___ au ballon.", instruction: "Choisis le verbe jouer au présent", type: "select", choices: ["joue", "jouent", "joues"], answer: "jouent" }
    ],
    redaction: {
      prompt: "Écris deux phrases pour raconter ton pique-nique idéal en plein air.",
      mandatoryWords: ["panier", "campagne", "manger", "soleil"]
    }
  },
  4: {
    id: 4,
    title: "La fête de l'école",
    qcm: [
      { q: "Comment est décorée l'école ?", choices: ["Avec des fleurs et des feuilles", "Avec des ballons et des guirlandes", "Sans décoration"], answer: "Avec des ballons et des guirlandes" },
      { q: "Que portent les élèves pour cette fête ?", choices: ["Des uniformes bleus", "Des costumes magnifiques", "Des manteaux chauds"], answer: "Des costumes magnifiques" },
      { q: "Que distribue le directeur ?", choices: ["Des livres jaunes", "Des prix aux meilleurs élèves", "Des ballons de foot"], answer: "Des prix aux meilleurs élèves" }
    ],
    open: [
      { q: "Donne deux exemples de costumes portés par les élèves.", keywords: ["princesses", "chevaliers", "animaux"], placeholder: "Il y a des..." },
      { q: "Que font les enfants devant leurs parents dans la cour ?", keywords: ["chantent", "dansent"], placeholder: "Ils chantent et..." }
    ],
    langue: [
      { q: "Mets au pluriel : 'un ballon coloré' -> 'des ...'", instruction: "Saisis la forme correcte", type: "input", answer: "ballons colorés" },
      { q: "Sélecteur : 'Quelle ___ joyeuse !'", instruction: "Choisis le bon mot", type: "select", choices: ["ambiance", "directeur", "trimestre"], answer: "ambiance" }
    ],
    redaction: {
      prompt: "Raconte la fin d'une fête d'école : comment les enfants s'amusent et ce qu'ils boivent.",
      mandatoryWords: ["fête", "gâteau", "boire", "jus"]
    }
  },
  5: {
    id: 5,
    title: "Au zoo du Belvédère",
    qcm: [
      { q: "Quel zoo visitent les élèves ?", choices: ["Zoo de Paris", "Zoo du Belvédère", "Zoo de Tunis"], answer: "Zoo du Belvédère" },
      { q: "Quel animal rugit d'une manière majestueuse ?", choices: ["Le singe", "La girafe", "Le lion"], answer: "Le lion" },
      { q: "Que fait le soigneur du zoo ?", choices: ["Il prend des photos", "Il explique la vie des animaux", "Il dort sous un arbre"], answer: "Il explique la vie des animaux" }
    ],
    open: [
      { q: "Que fait la girafe dans le zoo ?", keywords: ["cou immense", "girafe"], placeholder: "Elle a un cou..." },
      { q: "Qu'est-ce que les enfants apprennent d'important sur la nature ?", keywords: ["protéger", "respecter", "nature", "animaux"], placeholder: "Ils apprennent qu'il faut..." }
    ],
    langue: [
      { q: "Trouve le synonyme du mot 'grand' employé pour le cou de la girafe.", instruction: "Saisis le mot du texte", type: "input", answer: "immense" },
      { q: "Sélecteur : 'Les enfants ___ des photos.'", instruction: "Choisis le verbe prendre au présent", type: "select", choices: ["prend", "prennent", "prenons"], answer: "prennent" }
    ],
    redaction: {
      prompt: "Rédige un petit paragraphe pour inciter à protéger les animaux sauvages du zoo.",
      mandatoryWords: ["zoo", "animaux", "protéger", "nature"]
    }
  },
  6: {
    id: 6,
    title: "Le petit Indien du Canada",
    qcm: [
      { q: "Où vit le petit Indien Hiawatha ?", choices: ["Au cœur de la forêt canadienne", "Près de la mer en France", "Dans un grand désert"], answer: "Au cœur de la forêt canadienne" },
      { q: "Comment s'appelle la cabane traditionnelle de sa famille ?", choices: ["Une tente rouge", "Un wigwam", "Une maison en briques"], answer: "Un wigwam" },
      { q: "Grâce à quel moyen glisse-t-il sur la rivière sauvage ?", choices: ["Un bateau à moteur", "Un canoë en écorce", "Une barque en métal"], answer: "Un canoë en écorce" }
    ],
    open: [
      { q: "De quel instrument le père de Hiawatha joue-t-il le soir ?", keywords: ["flûte", "roseau"], placeholder: "Il joue de..." },
      { q: "Avec quoi Hiawatha fabrique-t-il son canoë ?", keywords: ["écorce de bouleau", "écorce", "bouleau"], placeholder: "Il utilise..." }
    ],
    langue: [
      { q: "Trouve l'antonyme (le contraire) de 'calme' appliqué à la rivière dans le texte.", instruction: "Saisis le mot du texte", type: "input", answer: "sauvage" },
      { q: "Complète : 'Hiawatha ___ la nature.'", instruction: "Choisis la bonne forme verbale", type: "select", choices: ["aime", "aiment", "aimes"], answer: "aime" }
    ],
    redaction: {
      prompt: "Imagine la soirée de Hiawatha avec sa famille autour du feu.",
      mandatoryWords: ["forêt", "feu", "flûte", "père"]
    }
  },
  7: {
    id: 7,
    title: "Le courage de Fatma",
    qcm: [
      { q: "Quel événement violent s'abat sur le village de Fatma ?", choices: ["Une forte tempête de neige", "Une violente tempête de sable", "Une éruption volcanique"], answer: "Une violente tempête de sable" },
      { q: "Qui a disparu pendant que le sable soufflait ?", choices: ["Le petit frère de Fatma", "Le sonneur du village", "Le chien de la famille"], answer: "Le petit frère de Fatma" },
      { q: "Où Fatma retrouve-t-elle l'agneau ?", choices: ["Au milieu des dunes sagement", "Blotti derrière un rocher", "Dans la bergerie solide"], answer: "Blotti derrière un rocher" }
    ],
    open: [
      { q: "Quels animaux de la famille étaient en fureur ou affolés ?", keywords: ["troupeau", "agneau", "chèvres"], placeholder: "Les animaux..." },
      { q: "Comment est qualifié le geste de Fatma ?", keywords: ["courageux", "sauve", "courage"], placeholder: "C'est un geste..." }
    ],
    langue: [
      { q: "Trouve l'adjectif féminin correspondant à 'courageux' dans le titre.", instruction: "Saisis l'adjectif", type: "input", answer: "courageuse" },
      { q: "Conjugue : 'Le vent ___ fort sur les dunes.'", instruction: "Choisis le verbe souffler", type: "select", choices: ["soufflent", "souffle", "souffles"], answer: "souffle" }
    ],
    redaction: {
      prompt: "Raconte comment Fatma rassure son frère après l'avoir sauvé de la tempête.",
      mandatoryWords: ["courage", "sable", "frère", "sauvé"]
    }
  },
  8: {
    id: 8,
    title: "La recette des crêpes",
    qcm: [
      { q: "Quelle fête célèbre-t-on pour faire ces crêpes ?", choices: ["Noël", "La Chandeleur", "L 'Aïd"], answer: "La Chandeleur" },
      { q: "Pour que la pâte soit fluide et sans grumeaux, que faut-il ?", choices: ["Laisser reposer la pâte", "Ajouter du gros sel", "La manger tout de suite"], answer: "Laisser reposer la pâte" },
      { q: "Que fait joyeusement la maman avec la poêle ?", choices: ["Elle la jette à la poubelle", "Elle fait sauter les crêpes", "Elle la lave à grande eau"], answer: "Elle fait sauter les crêpes" }
    ],
    open: [
      { q: "Quels sont les ingrédients principaux de la pâte à crêpes décrits dans le texte ?", keywords: ["farine", "œufs", "lait", "sucre"], placeholder: "Pour faire la pâte, il faut..." },
      { q: "Que met-on sur les crêpes chaudes à la fin ?", keywords: ["chocolat", "confiture", "miel"], placeholder: "On peut garnir avec..." }
    ],
    langue: [
      { q: "Mets au pluriel : 'un œuf frais' -> 'des ... ...'", instruction: "Saisis la forme correcte", type: "input", answer: "œufs frais" },
      { q: "Sélecteur : 'Maman ___ de la farine.'", instruction: "Choisis le verbe ajouter au présent", type: "select", choices: ["ajoute", "ajoutent", "ajoutes"], answer: "ajoute" }
    ],
    redaction: {
      prompt: "Écris 2 phrases pour raconter comment tu cuisines ou manges tes crêpes préférées.",
      mandatoryWords: ["recette", "crêpe", "chocolat", "sauter"]
    }
  },
  9: {
    id: 9,
    title: "La Hyène et le Lièvre",
    qcm: [
      { q: "Comment est décrit le Lièvre de la savane ?", choices: ["Méchant et bête", "Très intelligent et rusé", "Grand et peureux"], answer: "Très intelligent et rusé" },
      { q: "Quel animal affamé et rusé veut piéger le Lièvre ?", choices: ["La hyène gourmande", "Un lion affreux", "Un énorme serpent"], answer: "La hyène gourmande" },
      { q: "Qu'est-ce que le Lièvre prétend avoir trouvé pour piéger la hyène ?", choices: ["Un trésor de pièces d'or", "De la viande juteuse cachée", "Un piège en fer solide"], answer: "De la viande juteuse cachée" }
    ],
    open: [
      { q: "Comment le Lièvre réussit-il à s'échapper à la fin ?", keywords: ["rusé", "piège", "trompe", "court vite"], placeholder: "Le Lièvre..." },
      { q: "Quel vilain défaut caractérise la Hyène dans ce conte africain ?", keywords: ["gourmandise", "gourmande", "bêtise", "crédulité"], placeholder: "La Hyene est..." }
    ],
    langue: [
      { q: "Trouve le contraire de 'bête' appliqué au Lièvre dans le texte.", instruction: "Saisis l'adjectif correct", type: "input", answer: "intelligent" },
      { q: "Sélecteur : 'La hyène ___ le lièvre.'", instruction: "Choisis le verbe vouloir au présent", type: "select", choices: ["veux", "veut", "veulent"], answer: "veut" }
    ],
    redaction: {
      prompt: "Rédige la morale de cette histoire : pourquoi l'intelligence est plus forte que la méchanceté.",
      mandatoryWords: ["rusé", "hyène", "lièvre", "conseil"]
    }
  },
  10: {
    id: 10,
    title: "L'enfant Aborigène",
    qcm: [
      { q: "Dans quel pays habite le petit garçon ?", choices: ["Au Canada", "En Australie", "Au Maroc"], answer: "En Australie" },
      { q: "Quel est l'instrument de musique traditionnel dont il joue ?", choices: ["Le didgeridoo", "La flûte de roseau", "La guitare"], answer: "Le didgeridoo" },
      { q: "Quel outil en bois lance-t-il pour s'entraîner ?", choices: ["Un harpon", "Un boomerang", "Une flèche"], answer: "Un boomerang" }
    ],
    open: [
      { q: "Comment l'enfant apprend-il à connaître la nature avec son grand-père ?", keywords: ["traces", "animaux", "pistes"], placeholder: "Le grand-père lui montre..." },
      { q: "Quels animaux de la savane australienne sont mentionnés ?", keywords: ["kangourous", "koalas"], placeholder: "On observe des..." }
    ],
    langue: [
      { q: "Trouve le mot qui désigne un instrument traditionnel qui vibre.", instruction: "Saisis le mot du texte", type: "input", answer: "didgeridoo" },
      { q: "Sélecteur : 'Nous ___ le didgeridoo.'", instruction: "Choisis le verbe écouter au présent", type: "select", choices: ["écoute", "écoutons", "écoutent"], answer: "écoutons" }
    ],
    redaction: {
      prompt: "Décris la beauté du désert rouge d'Australie le soir.",
      mandatoryWords: ["Australie", "désert", "traces", "bois"]
    }
  },
  11: {
    id: 11,
    title: "Dans le parc d'attractions",
    qcm: [
      { q: "Quel manège propose une descente à toute vitesse ?", choices: ["Les montagnes russes", "La grande roue calme", "Le carrousel à chevaux"], answer: "Les montagnes russes" },
      { q: "Que grignotent les enfants avec gourmandise ?", choices: ["De la barbe à papa", "Des pommes de terre", "Du pain sec"], answer: "De la barbe à papa" }
    ],
    open: [
      { q: "Quelle vue offre la grande roue ?", keywords: ["hauteur", "panoramique", "ville", "vue"], placeholder: "Elle permet de voir..." }
    ],
    langue: [
      { q: "Trouve le nom du nuage sucré rose.", instruction: "Saisis le mot précis", type: "input", answer: "barbe à papa" },
      { q: "Sélecteur : 'Les enfants ___ fort dans les manèges.'", instruction: "Choisis le verbe crier", type: "select", choices: ["crie", "crient", "crions"], answer: "crient" }
    ],
    redaction: {
      prompt: "Raconte ta journée de rêve dans un parc d'attractions.",
      mandatoryWords: ["manège", "rire", "gourmand", "amis"]
    }
  },
  12: {
    id: 12,
    title: "Le petit colporteur",
    qcm: [
      { q: "Que vend le petit colporteur dans sa boîte sagement ?", choices: ["Des crayons, rubans et boutons", "Des fruits mûrs et juteux", "Des jouets électroniques"], answer: "Des crayons, rubans et boutons" },
      { q: "Où marche-t-il inlassablement de village en village ?", choices: ["Sur les sentiers de montagne", "Au bord de l'océan", "Dans le désert"], answer: "Sur les sentiers de montagne" }
    ],
    open: [
      { q: "Pourquoi les gens du village l'attendent-ils avec grande impatience ?", keywords: ["nouvelles", "marchandises", "couture", "colporteur"], placeholder: "Il apporte des..." }
    ],
    langue: [
      { q: "Trouve le mot qui désigne la boîte plate en bois qu'il porte.", instruction: "Saisis le mot", type: "input", answer: "colporteur" },
      { q: "Sélecteur : 'Le colporteur ___ ses boutons.'", instruction: "Choisis le verbe vendre au présent", type: "select", choices: ["vends", "vend", "vendent"], answer: "vend" }
    ],
    redaction: {
      prompt: "Imagine que tu es un marchand ambulant du temps jadis. Décris ton long chemin.",
      mandatoryWords: ["boîte", "marcher", "boutons", "village"]
    }
  },
  13: {
    id: 13,
    title: "La fête de l'Aïd",
    qcm: [
      { q: "Que portent les enfants le matin pour célébrer l'Aïd ?", choices: ["Leurs vieux habits salis", "Des vêtements neufs et propres", "Des costumes de super-héros"], answer: "Des vêtements neufs et propres" },
      { q: "Quelles délicieuses pâtisseries la maman a-t-elle préparées ?", choices: ["Des gâteaux de semoule au miel", "Des crêpes salées", "Des pizzas"], answer: "Des gâteaux de semoule au miel" }
    ],
    open: [
      { q: "Comment les membres de la famille se saluent-ils ?", keywords: ["Aïd Mabrouk", "embrassent", "vœux"], placeholder: "Ils se disent..." }
    ],
    langue: [
      { q: "Mets au pluriel : 'un habit neuf' -> 'des ... ...'", instruction: "Saisis la forme correcte", type: "input", answer: "habits neufs" },
      { q: "Sélecteur : 'Nous ___ nos grands-parents pour l'Aïd.'", instruction: "Choisis l'action appropriée", type: "select", choices: ["visitons", "visite", "visitent"], answer: "visitons" }
    ],
    redaction: {
      prompt: "Raconte comment se passe le réveil et la fête chez toi le jour de l'Aïd.",
      mandatoryWords: ["fête", "famille", "habits", "gâteau"]
    }
  },
  14: {
    id: 14,
    title: "Le voyage en train",
    qcm: [
      { q: "Où Sami prend-il place pour son grand voyage ?", choices: ["Dans son compartiment près de la fenêtre", "Sur le toit du train", "Près de la locomotive chaude"], answer: "Dans son compartiment près de la fenêtre" },
      { q: "Qu'entend-on siffler avant que le train ne s'ébranle ?", choices: ["La voix du contrôleur", "Le sifflet du chef de gare", "Une chanson joyeuse"], answer: "Le sifflet du chef de gare" }
    ],
    open: [
      { q: "Que voit Sami défiler à toute vitesse par la vitre ?", keywords: ["paysages", "arbres", "villages", "champs"], placeholder: "Il voit..." }
    ],
    langue: [
      { q: "Donne le synonyme de déplacer/se mettre en marche : 'Le train s'______'", instruction: "Saisis le mot du texte", type: "input", answer: "ébranle" },
      { q: "Sélecteur : 'Les trains ___ rapidement sur les rails.'", instruction: "Choisis la bonne forme", type: "select", choices: ["roule", "roulent", "roules"], answer: "roulent" }
    ],
    redaction: {
      prompt: "Décris les sensations d'un voyageur de train admirant le paysage sauvage.",
      mandatoryWords: ["train", "voyage", "vitre", "gare"]
    }
  },
  15: {
    id: 15,
    title: "L'ordinateur de l'école",
    qcm: [
      { q: "Où est installé le bel appareil informatique ?", choices: ["Dans la cour de récréation", "Dans la bibliothèque de l'école", "Dans la salle informatique"], answer: "Dans la salle informatique" },
      { q: "Qu'utilise Sami pour déplacer la flèche à l'écran ?", choices: ["Le clavier noir", "La souris grise", "L'écran géant"], answer: "La souris grise" }
    ],
    open: [
      { q: "Que font les élèves sur l'ordinateur ?", keywords: ["recherches", "exercices de français", "jeux éducatifs", "apprennent"], placeholder: "Ils font des..." }
    ],
    langue: [
      { q: "Trouve le mot qui sert à écrire des lettres et des chiffres.", instruction: "Saisis l'outil", type: "input", answer: "clavier" },
      { q: "Sélecteur : 'Sami et Sarah ___ des exercices interactifs.'", instruction: "Choisis le présent de faire", type: "select", choices: ["fait", "faisons", "font"], answer: "font" }
    ],
    redaction: {
      prompt: "Raconte comment l'ordinateur t'aide à faire tes exercices d'école.",
      mandatoryWords: ["ordinateur", "clavier", "écran", "apprendre"]
    }
  },
  16: {
    id: 16,
    title: "Le petit jardinier",
    qcm: [
      { q: "Qu'enfile Amine pour ne pas se salir au potager ?", choices: ["Un grand manteau chaud", "Son tablier de toile solide", "Ses chaussures en cuir"], answer: "Son tablier de toile solide" },
      { q: "Que sème-t-il sagement dans les sillons bien creusés ?", choices: ["Des miettes de pain dur", "Des graines de légumes ronds", "Des cailloux blancs"], answer: "Des graines de légumes ronds" }
    ],
    open: [
      { q: "Quel outil utilise Amine pour arroser sagement ses plantations ?", keywords: ["rosoir", "eau", "arrosoir"], placeholder: "Il arrose avec..." }
    ],
    langue: [
      { q: "Trouve le mot qui désigne les petits canaux creusés en terre.", instruction: "Saisis le mot", type: "input", answer: "sillons" },
      { q: "Sélecteur : 'Le jardinier ___ tous les matins.'", instruction: "Choisis la forme correcte d'arroser", type: "select", choices: ["arrose", "arrosent", "arroses"], answer: "arrose" }
    ],
    redaction: {
      prompt: "Aide Amine à expliquer comment faire pousser une petite graine de fleur.",
      mandatoryWords: ["graine", "terre", "arroser", "soleil"]
    }
  },
  17: {
    id: 17,
    title: "Ma ville est propre",
    qcm: [
      { q: "Que font les enfants du quartier le samedi matin ?", choices: ["Une grande campagne de nettoyage", "Un tournoi de football", "Une fête sous un chapiteau"], answer: "Une grande campagne de nettoyage" },
      { q: "Où jettent-ils soigneusement les papiers salis ?", choices: ["Dans les caniveaux du chemin", "Dans les poubelles colorées", "Par terre sagement"], answer: "Dans les poubelles colorées" }
    ],
    open: [
      { q: "Pourquoi les enfants plantent-ils de jolies fleurs dans les bacs ?", keywords: ["embellir", "fleurs", "joli", "propre", "quartier"], placeholder: "Pour embellir..." }
    ],
    langue: [
      { q: "Trouve le mot qui est le contraire de 'sale'.", instruction: "Saisis l'adjectif", type: "input", answer: "propre" },
      { q: "Sélecteur : 'Nous ___ notre cher quartier.'", instruction: "Choisis le verbe nettoyer", type: "select", choices: ["nettoyons", "nettoie", "nettoient"], answer: "nettoyons" }
    ],
    redaction: {
      prompt: "Écris une phrase forte pour demander à tes voisins de garder la rue propre.",
      mandatoryWords: ["propre", "poubelle", "fleurs", "protéger"]
    }
  },
  18: {
    id: 18,
    title: "Le chevalier et le dragon",
    qcm: [
      { q: "Quel animal légendaire effraie les pauvres paysans ?", choices: ["Un dragon vert de colère", "Un loup féroce", "Un loup-garou"], answer: "Un dragon vert de colère" },
      { q: "Avec quelle arme brillante le preux chevalier part-il lutter ?", choices: ["Un stylo en argent", "Une lance en acier étincelant", "Un arc en bois de chêne"], answer: "Une lance en acier étincelant" }
    ],
    open: [
      { q: "Où se cache le dragon cracheur de flammes ?", keywords: ["grotte sombre", "montagne noire", "grotte"], placeholder: "Dans une..." }
    ],
    langue: [
      { q: "Trouve le synonyme de courageux dans le texte appliqué au chevalier.", instruction: "Saisis le mot exact", type: "input", answer: "preux" },
      { q: "Sélecteur : 'Le chevalier ___ le dragon.'", instruction: "Choisis le présent d'affronter", type: "select", choices: ["affronte", "affrontent", "affrontes"], answer: "affronte" }
    ],
    redaction: {
      prompt: "Raconte la fin du combat entre le chevalier victorieux et le dragon.",
      mandatoryWords: ["chevalier", "dragon", "combat", "sauver"]
    }
  },
  19: {
    id: 19,
    title: "La visite à la bibliothèque",
    qcm: [
      { q: "Où se rendent sagement les élèves pendant la récréation ?", choices: ["Dans le gymnase", "À la bibliothèque de l'école", "À la cantine"], answer: "À la bibliothèque de l'école" },
      { q: "Quelle règle d'or faut-il respecter dans ce sanctuaire ?", choices: ["Crier très fort de joie", "Parler tout bas et respecter le silence", "Courir entre les tables"], answer: "Parler tout bas et respecter le silence" }
    ],
    open: [
      { q: "Quelle action fait la gentille bibliothécaire ?", keywords: ["conseille", "livres", "aide"], placeholder: "Elle oriente et..." }
    ],
    langue: [
      { q: "Trouve le contraire de 'bruit' ou 'vacarme'.", instruction: "Saisis le nom", type: "input", answer: "silence" },
      { q: "Sélecteur : 'Les enfants ___ des bandes dessinées.'", instruction: "Choisis le verbe lire", type: "select", choices: ["lit", "lisent", "lisons"], answer: "lisent" }
    ],
    redaction: {
      prompt: "Explique l'importance d'aimer lire des livres.",
      mandatoryWords: ["livre", "bibliothèque", "lire", "histoire"]
    }
  },
  20: {
    id: 20,
    title: "Le voyage dans l'espace",
    qcm: [
      { q: "À bord de quel engin l'astronaute Thomas s'envole-t-il ?", choices: ["Un hélicoptère géant", "Une fusée surpuissante", "Une montgolfière colorée"], answer: "Une fusée surpuissante" },
      { q: "Quelle planète bleue observe-t-il depuis la coupole ?", choices: ["La Terre", "Mars la rouge", "La Lune grise"], answer: "La Terre" }
    ],
    open: [
      { q: "Que ressent l'astronaute en flottant en apesanteur ?", keywords: ["apesanteur", "flotter", "léger", "magique"], placeholder: "Il ressent..." }
    ],
    langue: [
      { q: "Trouve le mot qui décrit l'absence de gravité.", instruction: "Saisis le mot exact", type: "input", answer: "apesanteur" },
      { q: "Sélecteur : 'La fusée ___ vers les étoiles.'", instruction: "Choisis la bonne forme verbale", type: "select", choices: ["décolle", "décollent", "décolles"], answer: "décolle" }
    ],
    redaction: {
      prompt: "Raconte les rêves d'un enfant qui veut devenir astronaute plus tard.",
      mandatoryWords: ["espace", "étoiles", "fusée", "planète"]
    }
  },
  22: {
    id: 22,
    title: "Les nouveaux voisins",
    qcm: [
      { q: "Qui emménage en face de la maison de Sami ?", choices: ["Une nouvelle famille avec enfants", "Un clown du cirque", "Un fermier solitaire"], answer: "Une nouvelle famille avec enfants" },
      { q: "Pour les accueillir chaleureusement, qu'apporte la maman de Sami ?", choices: ["Une tarte aux pommes chaude", "Une boîte en carton vide", "Un paquet de lessive"], answer: "Une tarte aux pommes chaude" }
    ],
    open: [
      { q: "Que décident de faire les enfants des deux familles dans le jardin ?", keywords: ["jouer", "ballon", "amuser"], placeholder: "Ils se réunissent pour..." }
    ],
    langue: [
      { q: "Donne l'antonyme (qui est le contraire) de 'froidement'.", instruction: "Saisis l'adverbe", type: "input", answer: "chaleureusement" },
      { q: "Sélecteur : 'Nous ___ poliment à nos voisins.'", instruction: "Choisis le présent de dire", type: "select", choices: ["disons", "dites", "disant"], answer: "disons" }
    ],
    redaction: {
      prompt: "Écris 2 phrases pour décrire l'amitié entre deux enfants du quartier.",
      mandatoryWords: ["voisins", "jouer", "partager", "maison"]
    }
  },
  23: {
    id: 23,
    title: "La course de vélo",
    qcm: [
      { q: "De quel grand parcours sportif s'agit-il ?", choices: ["La course de vélo du quartier", "Un match de football d'école", "Une course de natation à la piscine"], answer: "La course de vélo du quartier" },
      { q: "Quel équipement de sécurité obligatoire Youssef porte-t-il ?", choices: ["Un chapeau de paille", "Son casque solide", "Des lunettes noires"], answer: "Son casque solide" }
    ],
    open: [
      { q: "Que reçoit Youssef, le vainqueur, sur le podium ?", keywords: ["médaille d'or", "coupe", "médaille", "applaudissements"], placeholder: "Il reçoit..." }
    ],
    langue: [
      { q: "Trouve le synonyme du mot 'gagner' ou 'triompher'.", instruction: "Saisis le verbe", type: "input", answer: "vaincre" },
      { q: "Sélecteur : 'Youssef ___ très vite sur sa bicyclette.'", instruction: "Choisis le verbe pédaler au présent", type: "select", choices: ["pédale", "pédalent", "pédales"], answer: "pédale" }
    ],
    redaction: {
      prompt: "Raconte la joie de franchir la ligne d'arrivée lors d'une compétition sportive.",
      mandatoryWords: ["vélo", "course", "médaille", "victoire"]
    }
  },
  24: {
    id: 24,
    title: "Pinocchio – Marionnette menteuse",
    qcm: [
      { q: "Qui est le créateur aimant de la marionnette en bois ?", choices: ["Le gentil docteur", "Le vieux menuisier Geppetto", "Le clown du cirque"], answer: "Le vieux menuisier Geppetto" },
      { q: "Que se passe-t-il sur le visage de Pinocchio quand il ment ?", choices: ["Ses yeux deviennent tout verts", "Son nez s'allonge de plus en plus", "Ses oreilles commencent à bouger"], answer: "Son nez s'allonge de plus en plus" }
    ],
    open: [
      { q: "Qui conseille à Pinocchio de rester sage et d'aller à l'école ?", keywords: ["grillon", "Grillon parlant", "feé"], placeholder: "Il s'agit du..." }
    ],
    langue: [
      { q: "Trouve le mot qui désigne un personnage fabriqué en bois avec des fils.", instruction: "Saisis le nom", type: "input", answer: "marionnette" },
      { q: "Sélecteur : 'La marionnette ___ la vérité à la fin.'", instruction: "Choisis le présent de dire", type: "select", choices: ["dit", "disent", "dises"], answer: "dit" }
    ],
    redaction: {
      prompt: "Écris la leçon de morale ou le conseil que tu donnerais à Pinocchio pour qu'il soit un vrai petit garçon courageux.",
      mandatoryWords: ["sage", "vérité", "Geppetto", "grillon"]
    }
  },
  25: {
    id: 25,
    title: "Le Chat botté – Ruses",
    qcm: [
      { q: "Quel héritage insolite le plus jeune fils du meunier reçoit-il ?", choices: ["Un grand sac d'or", "Un simple chat rusé", "Un vieux moulin en ruine"], answer: "Un simple chat rusé" },
      { q: "Que demande le chat à son jeune maître pour l'aider ?", choices: ["Une bonne paire de bottes et un sac", "Un costume de roi magnifique", "Une flûte magique"], answer: "Une bonne paire de bottes et un sac" }
    ],
    open: [
      { q: "Quel titre imaginaire s'invente le chat pour qualifier son jeune maître devant le Roi ?", keywords: ["Marquis de Carabas", "marquis"], placeholder: "Le Marquis de..." }
    ],
    langue: [
      { q: "Trouve le mot désignant une astuce ou une tromperie intelligente.", instruction: "Saisis la réponse", type: "input", answer: "ruse" },
      { q: "Sélecteur : 'Le chat ___ astucieusement le géant.'", instruction: "Choisis le synonyme de tromper", type: "select", choices: ["trompe", "trompent", "trompes"], answer: "trompe" }
    ],
    redaction: {
      prompt: "Décris comment le Chat Botté court et se présente devant le château du Roi.",
      mandatoryWords: ["chat", "bottes", "rusé", "roi"]
    }
  },
  26: {
    id: 26,
    title: "Heidi – Fille de la montagne",
    qcm: [
      { q: "Où habite joyeusement la petite orpheline Heidi ?", choices: ["Dans un grand chalet dans les Alpes", "Dans un wigwam canadien", "Dans un compartiment de train"], answer: "Dans un grand chalet dans les Alpes" },
      { q: "Quel est le nom de son meilleur ami berger ?", choices: ["Sami", "Peter", "Thomas"], answer: "Peter" }
    ],
    open: [
      { q: "Quelle nourriture simple et saine Heidi mange-t-elle à la ferme ?", keywords: ["fromage", "pain", "lait de chèvre", "lait"], placeholder: "Elle mange du..." }
    ],
    langue: [
      { q: "Trouve le mot qui désigne une petite fille sans parents.", instruction: "Saisis le mot exact", type: "input", answer: "orpheline" },
      { q: "Sélecteur : 'Heidi ___ dans les prés d'alpage.'", instruction: "Choisis le présent de courir", type: "select", choices: ["court", "courent", "cours"], answer: "court" }
    ],
    redaction: {
      prompt: "Décris la beauté de la nature sauvage et des prés de montagne où Heidi garde ses chèvres.",
      mandatoryWords: ["chalet", "Peter", "montagne", "chèvres"]
    }
  },
  27: {
    id: 27,
    title: "L'amitié qui dure",
    qcm: [
      { q: "Depuis quelle classe Sami et Peter sont-ils d'inséparables camarades ?", choices: ["Le jardin d'enfants", "La classe de CP", "Le collège de la ville"], answer: "La classe de CP" },
      { q: "Que partagent-ils toujours volontiers pendant la dure journée ?", choices: ["Leurs devoirs de français", "Leurs collations et leurs jeux", "Leurs habits neufs"], answer: "Leurs collations et leurs jeux" }
    ],
    open: [
      { q: "Que font les deux amis lorsqu'un des deux rencontre une difficulté ?", keywords: ["s'entraident", "conseille", "aide", "consolent"], placeholder: "Ils se..." }
    ],
    langue: [
      { q: "Trouve l'adjectif synonyme de 'qu'on ne peut pas séparer'.", instruction: "Saisis le mot exact", type: "input", answer: "inséparables" },
      { q: "Sélecteur : 'Nous ___ toujours ensemble.'", instruction: "Choisis le verbe rester au présent", type: "select", choices: ["restons", "reste", "restent"], answer: "restons" }
    ],
    redaction: {
      prompt: "Rédige une belle définition de ce que représente un vrai ami fidèle pour toi.",
      mandatoryWords: ["ami", "partager", "entraide", "fidèle"]
    }
  },
  28: {
    id: 28,
    title: "Le pique-nique de la famille Duval",
    qcm: [
      { q: "Où se rend la famille Duval ?", choices: ["À la mer", "À la campagne", "À la montagne"], answer: "À la campagne" },
      { q: "Que prépare Maman pour cette belle journée ?", choices: ["Du pain, de la salade et des fruits", "Un grand gâteau au chocolat", "Des crêpes sucrées"], answer: "Du pain, de la salade et des fruits" },
      { q: "Que voit Alain par terre après le repas ?", choices: ["Des jouets perdus", "Des ordures sur le sol", "Des fleurs sauvages"], answer: "Des ordures sur le sol" }
    ],
    open: [
      { q: "Que s'écrie Alain lorsqu'il voit que les gens salissent la nature ?", keywords: ["salir", "nature", "il ne faut pas"], placeholder: "Il s'écrie : « ... »" },
      { q: "Comment le petit groupe protège-t-il l'environnement à la fin ?", keywords: ["ramassent", "restes", "sac poubelle", "propres"], placeholder: "Ils ramassent..." }
    ],
    langue: [
      { q: "Mets au pluriel : 'une campagne propre' -> 'des campagnes ___'", instruction: "Saisis l'adjectif accordé", type: "input", answer: "propres" },
      { q: "Sélecteur : 'Les enfants ___ vite les restes.'", instruction: "Choisis la bonne forme verbale", type: "select", choices: ["ramasse", "ramassent", "ramasses"], answer: "ramassent" }
    ],
    redaction: {
      prompt: "Rédige deux phrases pour conseiller à tes amis de garder la campagne et l'herbe propres.",
      mandatoryWords: ["campagne", "nature", "salir", "ramasser"]
    }
  },
  29: {
    id: 29,
    title: "Au parc d'attractions",
    qcm: [
      { q: "Quel jour de la semaine se déroule cette sortie agréable ?", choices: ["Samedi dernier", "Dimanche dernier", "Mercredi après-midi"], answer: "Dimanche dernier" },
      { q: "Vers quel manège les enfants courent-ils en premier ?", choices: ["Les montagnes russes", "Les chevaux de bois", "La grande roue"], answer: "Les chevaux de bois" },
      { q: "Quel spectacle magique regardent-ils l'après-midi ?", choices: ["Le spectacle de marionnettes", "Le spectacle des clowns", "Le numéro de l'acrobate"], answer: "Le spectacle des clowns" }
    ],
    open: [
      { q: "Que mangent et dégustent Martine et ses frères au parc ?", keywords: ["barbe à papa", "glaces", "grande"], placeholder: "Ils achètent de..." },
      { q: "Pourquoi tout le monde rit-il de bon cœur ?", keywords: ["clowns", "grimaces", "drôles", "riaient"], placeholder: "Grâce aux..." }
    ],
    langue: [
      { q: "Trouve l'antonyme (le contraire) du mot 'tristes' dans le texte.", instruction: "Saisis l'adjectif au pluriel", type: "input", answer: "heureux" },
      { q: "Sélecteur : 'Martine et son frère ___ vers les manèges.'", instruction: "Choisis le verbe courir au présent", type: "select", choices: ["courons", "courent", "court"], answer: "courent" }
    ],
    redaction: {
      prompt: "Décris ta journée idéale à la fête foraine ou dans un parc d'attractions.",
      mandatoryWords: ["manège", "parc", "clown", "musique"]
    }
  },
  30: {
    id: 30,
    title: "La grande fête du village",
    qcm: [
      { q: "Pourquoi tout le monde se prépare-t-il avec joie ?", choices: ["Parce qu'il va pleuvoir", "Parce que les fêtes sont rares chez nous", "Parce que l'école est finie"], answer: "Parce que les fêtes sont rares chez nous" },
      { q: "Qu'est-ce que Jeanne portera comme déguisement ?", choices: ["Un costume de clown rigolo", "Un masque et une cape noire", "Une longue robe blanche et indigo"], answer: "Une longue robe blanche et indigo" },
      { q: "Que signifie 'Le carnaval est inoubliable' ?", choices: ["Il est ennuyeux", "On l'oubliera très vite", "Il restera gravé dans les mémoires"], answer: "Il restera gravé dans les mémoires" }
    ],
    open: [
      { q: "Est-ce que Julien a déjà choisi son costume lors de la discussion ?", keywords: ["non", "hésite", "clown", "police"], placeholder: "Non, Julien..." },
      { q: "Quelle phrase montre que le village a complètement changé le jour de la fête ?", keywords: ["village", "devenu", "méconnaissable"], placeholder: "Le jour du..." }
    ],
    langue: [
      { q: "Trouve dans le texte le synonyme de 'savoureux' : 'des _______ plats.'", instruction: "Saisis l'adjectif au pluriel", type: "input", answer: "succulents" },
      { q: "Sélecteur : 'Mes camarades et moi ___ de nos déguisements.'", instruction: "Choisis la bonne forme verbale", type: "select", choices: ["parle", "parlons", "parlent"], answer: "parlons" }
    ],
    redaction: {
      prompt: "Raconte en trois phrases comment les habitants célèbrent le défilé dans les rues.",
      mandatoryWords: ["décorées", "carnaval", "dégustent", "boissons"]
    }
  }
};

// Simple helper to fetch the exam or generate a dynamic fallback if needed
export function getExam(ficheId: number, title?: string): Exam {
  if (EXAMS[ficheId]) {
    return EXAMS[ficheId];
  }
  
  // High fidelity dynamic generator fallback for any custom or missing index
  const safeTitle = title || `Fiche ${ficheId}`;
  return {
    id: ficheId,
    title: safeTitle,
    qcm: [
      { q: `Quel est le thème principal autour duquel s'articule le texte de "${safeTitle}" ?`, choices: ["L'apprentissage", "La découverte du monde", "La vie quotidienne"], answer: "La découverte du monde" },
      { q: `Comment décrirais-tu le ton général de l'histoire de "${safeTitle}" ?`, choices: ["Amusant et pédagogique", "Sombre et difficile", "Triste et désolé"], answer: "Amusant et pédagogique" }
    ],
    open: [
      { q: "Quelle leçon d'éthique ou d'apprentissage tires-tu de ce texte ?", keywords: ["apprendre", "sage", "histoire"], placeholder: "En lisant ce texte, j'apprends que..." }
    ],
    langue: [
      { q: "Remplace le sujet par 'Nous' : 'Il aime apprendre.'", instruction: "Tape la phrase transformée au présent", type: "input", answer: "Nous aimons apprendre." },
      { q: "Sélecteur : 'Les élèves ___ le texte de français.'", instruction: "Choisis la bonne forme", type: "select", choices: ["lisons", "lisent", "lit"], answer: "lisent" }
    ],
    redaction: {
      prompt: `Écris une phrase pour expliquer pourquoi tu as aimé étudier l'histoire de "${safeTitle}".`,
      mandatoryWords: ["histoire", "aimé", "appris", "français"]
    }
  };
}
