export interface CommonActivityQuestion {
  key: string;
  choices: string[];
  answer: string;
}

export interface CommonThemeActivity {
  themeName: string;
  words: string[];
  textParts: string[]; // Length must be 5 to match 4 Gaps
  questions: CommonActivityQuestion[];
}

export const COMMON_ACTIVITIES_BY_THEME: Record<string, CommonThemeActivity> = {
  "Santé et Hygiène": {
    themeName: "Santé et Hygiène",
    words: ["sain", "propre", "bouche", "bon"],
    textParts: [
      "Pour rester ",
      ", il faut bien se laver les mains régulièrement. Un enfant ",
      " prend une bonne douche tiède après le sport. Le docteur examine notre ",
      " pour vérifier s'il y a des rougeurs. Nous achetons un ",
      " savon doux à la pharmacie."
    ],
    questions: [
      { key: "q1", choices: ["sain", "sante", "sainement"], answer: "sain" },
      { key: "q2", choices: ["propre", "propreté", "proprement"], answer: "propre" },
      { key: "q3", choices: ["bouche", "gorge", "tête"], answer: "bouche" },
      { key: "q4", choices: ["bon", "bonne", "belle"], answer: "bon" }
    ]
  },
  "Loisirs et Divertissement": {
    themeName: "Loisirs et Divertissement",
    words: ["rigolo", "enthousiastes", "petit", "merveilleuse"],
    textParts: [
      "Le cirque s'installe enfin sur la place de la ville ! Le clown ",
      " fait rire tout le public avec ses acrobaties. Les spectateurs ",
      " applaudissent de toutes leurs forces. Papa achète un ",
      " ticket d'entrée pour chacun de nous. C'est une journée ",
      " dont nous nous souviendrons longtemps !"
    ],
    questions: [
      { key: "q1", choices: ["rigolo", "rigolote", "rigoler"], answer: "rigolo" },
      { key: "q2", choices: ["enthousiastes", "enthousiaste", "colériques"], answer: "enthousiastes" },
      { key: "q3", choices: ["petit", "petite", "petits"], answer: "petit" },
      { key: "q4", choices: ["merveilleuse", "merveilleux", "merveille"], answer: "merveilleuse" }
    ]
  },
  "Loisirs (Pique-nique)": {
    themeName: "Loisirs (Pique-nique)",
    words: ["ombragé", "frais", "grande", "heureuse"],
    textParts: [
      "Dimanche, nous partons faire un pique-nique sous un arbre ",
      ". Maman prépare une limonade fraîche et coupe des fruits ",
      " et sucrés. Sami installe une ",
      " nappe à carreaux rouges sur l'herbe verte. Toute la famille est ",
      " d'être réunie ensemble au grand air."
    ],
    questions: [
      { key: "q1", choices: ["ombragé", "ombragée", "ombre"], answer: "ombragé" },
      { key: "q2", choices: ["frais", "fraîche", "fraîchement"], answer: "frais" },
      { key: "q3", choices: ["grande", "grand", "grandement"], answer: "grande" },
      { key: "q4", choices: ["heureuse", "heureux", "joie"], answer: "heureuse" }
    ]
  },
  "Vie Scolaire / Fêtes": {
    themeName: "Vie Scolaire / Fêtes",
    words: ["attentive", "heureux", "grande", "délicieux"],
    textParts: [
      "C'est la fin de l'année ! La directrice de l'école est très ",
      " au bien-être de tous. Les élèves sont ",
      " de recevoir leurs jolis prix sous le préau. Maman a apporté une ",
      " brioche dorée. Nous dégustons un ",
      " gâteau au chocolat pour cette fête de l'école."
    ],
    questions: [
      { key: "q1", choices: ["attentive", "attentif", "attention"], answer: "attentive" },
      { key: "q2", choices: ["heureux", "heureusement", "heure"], answer: "heureux" },
      { key: "q3", choices: ["grande", "grand", "grandement"], answer: "grande" },
      { key: "q4", choices: ["délicieux", "délicieuse", "délicieusement"], answer: "délicieux" }
    ]
  },
  "Loisirs (Zoo)": {
    themeName: "Loisirs (Zoo)",
    words: ["sauvages", "immense", "haute", "curieux"],
    textParts: [
      "Aujourd'hui, nous visitons le parc zoologique pour observer des animaux ",
      ". Dans un ",
      " enclos boisé, une girafe dévore calmement les feuilles sur une ",
      " branche d'acacia. Les enfants ",
      " posent de nombreuses questions au soigneur."
    ],
    questions: [
      { key: "q1", choices: ["sauvages", "sauvage", "forêt"], answer: "sauvages" },
      { key: "q2", choices: ["immense", "immensément", "petit"], answer: "immense" },
      { key: "q3", choices: ["haute", "haut", "hauteur"], answer: "haute" },
      { key: "q4", choices: ["curieux", "curieuse", "curiosité"], answer: "curieux" }
    ]
  },
  "Contes et Culture (Amérique)": {
    themeName: "Contes et Culture (Amérique)",
    words: ["anciennes", "sage", "vaste", "brave"],
    textParts: [
      "Sous un grand totem en bois, les tribus écoutent des légendes ",
      " transmises de génération en génération. Le ",
      " chef de la tribu prend la parole au milieu de la ",
      " plaine ensoleillée. Il félicite un ",
      " guerrier pour son exploit face au grand ours brun."
    ],
    questions: [
      { key: "q1", choices: ["anciennes", "anciens", "ancien"], answer: "anciennes" },
      { key: "q2", choices: ["sage", "sagesse", "sagement"], answer: "sage" },
      { key: "q3", choices: ["vaste", "vastes", "petit"], answer: "vaste" },
      { key: "q4", choices: ["brave", "braves", "bravo"], answer: "brave" }
    ]
  },
  "Courage et Détermination": {
    themeName: "Courage et Détermination",
    words: ["difficile", "déterminé", "forte", "fiers"],
    textParts: [
      "Le petit alpiniste commence l'ascension d'un sommet très ",
      ". Malgré le froid glacial, il reste très ",
      " à atteindre le sommet de la montagne. Une ",
      " tempête de neige se lève, mais ses parents seront très ",
      " de son courage persévérant."
    ],
    questions: [
      { key: "q1", choices: ["difficile", "difficulté", "facile"], answer: "difficile" },
      { key: "q2", choices: ["déterminé", "déterminée", "détermination"], answer: "déterminé" },
      { key: "q3", choices: ["forte", "fort", "fortement"], answer: "forte" },
      { key: "q4", choices: ["fiers", "fier", "fièrement"], answer: "fiers" }
    ]
  },
  "La Recette / Alimentation": {
    themeName: "La Recette / Alimentation",
    words: ["sucrées", "mûres", "chaud", "délicieuse"],
    textParts: [
      "Pour préparer une bonne tarte, nous choisisons des fraises bien ",
      " et parfumées. Maman lave des prunes ",
      " cueillies ce matin dans le verger. Papa prépare le four bien ",
      " pour la cuisson. C'est une recette ",
      " facile à faire en famille le week-end !"
    ],
    questions: [
      { key: "q1", choices: ["sucrées", "sucré", "sucre"], answer: "sucrées" },
      { key: "q2", choices: ["mûres", "mûr", "mûrement"], answer: "mûres" },
      { key: "q3", choices: ["chaud", "chaude", "chaudement"], answer: "chaud" },
      { key: "q4", choices: ["délicieuse", "délicieux", "délice"], answer: "délicieuse" }
    ]
  },
  "Contes d'Afrique": {
    themeName: "Contes d'Afrique",
    words: ["brûlant", "rusé", "petite", "joyeux"],
    textParts: [
      "Sous le soleil ",
      " de la savane, le lièvre ",
      " essaie de tromper le lion en imitant une ",
      " voix terrifiante. Tous les autres animaux du village entonnent un chant ",
      " pour célébrer la paix retrouvée."
    ],
    questions: [
      { key: "q1", choices: ["brûlant", "brûlante", "brûler"], answer: "brûlant" },
      { key: "q2", choices: ["rusé", "rusée", "ruse"], answer: "rusé" },
      { key: "q3", choices: ["petite", "petit", "petits"], answer: "petite" },
      { key: "q4", choices: ["joyeux", "joyeuse", "joie"], answer: "joyeux" }
    ]
  },
  "Contes d'Australie": {
    themeName: "Contes d'Australie",
    words: ["rapides", "grand", "verte", "douce"],
    textParts: [
      "Dans le bush australien, des kangourous font des bonds très ",
      " pour échapper aux prédateurs. Un ",
      " koala dort paisiblement installé dans une branche d'eucalyptus ",
      ". La mélodie ",
      " du didgeridoo résonne au coucher du soleil."
    ],
    questions: [
      { key: "q1", choices: ["rapides", "rapide", "rapidement"], answer: "rapides" },
      { key: "q2", choices: ["grand", "grande", "grands"], answer: "grand" },
      { key: "q3", choices: ["verte", "vert", "verdissement"], answer: "verte" },
      { key: "q4", choices: ["douce", "doux", "doucement"], answer: "douce" }
    ]
  },
  "Loisirs": {
    themeName: "Loisirs",
    words: ["amusant", "passionnés", "nouvelle", "belle"],
    textParts: [
      "Le football dans la cour de récréation est un jeu très ",
      ". Les joueurs ",
      " s'entraînent chaque mercredi après-midi. Amélie s'achète une ",
      " raquette de tennis pour le tournoi de ce week-end. Quelle ",
      " occasion de s'amuser avec ses amis !"
    ],
    questions: [
      { key: "q1", choices: ["amusant", "amusante", "amusement"], answer: "amusant" },
      { key: "q2", choices: ["passionnés", "passionné", "passionnément"], answer: "passionnés" },
      { key: "q3", choices: ["nouvelle", "nouveau", "nouvelles"], answer: "nouvelle" },
      { key: "q4", choices: ["belle", "beau", "beaux"], answer: "belle" }
    ]
  },
  "Vie d'autrefois": {
    themeName: "Vie d'autrefois",
    words: ["ancienne", "difficiles", "vieux", "précieux"],
    textParts: [
      "À l'époque de nos grands-parents, l'école ",
      " n'avait pas d'ordinateurs ni d'écrans. Les récoltes à la ferme étaient parfois ",
      " à cause de la météo. Le ",
      " moulin à vent moulait le blé en farine blanche. Ces souvenirs sont un patrimoine ",
      " pour notre mémoire collective."
    ],
    questions: [
      { key: "q1", choices: ["ancienne", "ancien", "anciennement"], answer: "ancienne" },
      { key: "q2", choices: ["difficiles", "difficile", "difficulté"], answer: "difficiles" },
      { key: "q3", choices: ["vieux", "vieille", "vieux-jeu"], answer: "vieux" },
      { key: "q4", choices: ["précieux", "précieuse", "prix"], answer: "précieux" }
    ]
  },
  "Fêtes et Célébrations": {
    themeName: "Fêtes et Célébrations",
    words: ["colorés", "joyeuse", "grande", "magnifique"],
    textParts: [
      "Pour célébrer l'anniversaire, des lampions ",
      " éclairent magnifiquement le jardin. Une musique ",
      " invite les invités à danser sous les arbres. Maman apporte une ",
      " corbeille de gâteaux parfumés de fleurs d'oranger. C'est un spectacle ",
      " qui brille de mille feux !"
    ],
    questions: [
      { key: "q1", choices: ["colorés", "coloré", "colorée"], answer: "colorés" },
      { key: "q2", choices: ["joyeuse", "joyeux", "joie"], answer: "joyeuse" },
      { key: "q3", choices: ["grande", "grand", "grandement"], answer: "grande" },
      { key: "q4", choices: ["magnifique", "magnifiquement", "mignon"], answer: "magnifique" }
    ]
  },
  "Voyages": {
    themeName: "Voyages",
    words: ["lointain", "immense", "bleue", "inoubliable"],
    textParts: [
      "Cet été, la famille s'envole vers un pays ",
      " pour découvrir de nouveaux paysages. Depuis l'avion, ils survolent un ",
      " océan et admirent la mer ",
      " qui s'étend à perte de vue. Ce voyage sera une expérience ",
      " pour toute la vie !"
    ],
    questions: [
      { key: "q1", choices: ["lointain", "lointaine", "loin"], answer: "lointain" },
      { key: "q2", choices: ["immense", "immensément", "étroit"], answer: "immense" },
      { key: "q3", choices: ["bleue", "bleu", "bleus"], answer: "bleue" },
      { key: "q4", choices: ["inoubliable", "oublier", "oubliable"], answer: "inoubliable" }
    ]
  },
  "Modernité": {
    themeName: "Modernité",
    words: ["rapides", "intelligente", "nouvelles", "utile"],
    textParts: [
      "Grâce aux technologies modernes, nous envoyons des messages très ",
      " à travers le monde. La maison ",
      " gère automatiquement sa consommation d'énergie. Ces ",
      " inventions changent notre vie quotidienne. L'ordinateur est un outil très ",
      " pour apprendre et s'amuser."
    ],
    questions: [
      { key: "q1", choices: ["rapides", "rapide", "rapidement"], answer: "rapides" },
      { key: "q2", choices: ["intelligente", "intelligent", "intelligence"], answer: "intelligente" },
      { key: "q3", choices: ["nouvelles", "nouveau", "nouvelle"], answer: "nouvelles" },
      { key: "q4", choices: ["utile", "utiles", "utilité"], answer: "utile" }
    ]
  },
  "La Nature": {
    themeName: "La Nature",
    words: ["verte", "parfumé", "petites", "magnifiques"],
    textParts: [
      "Au printemps, la forêt redeveient ",
      " et pleine de vie. De jolies fleurs de lis parfument le sentier ",
      ". Les ",
      " abeilles butinent le nectar pour fabriquer du miel de forêt. Les paysages sauvages sont ",
      " et apaisent notre esprit."
    ],
    questions: [
      { key: "q1", choices: ["verte", "vert", "verdi"], answer: "verte" },
      { key: "q2", choices: ["parfumé", "parfumée", "parfumer"], answer: "parfumé" },
      { key: "q3", choices: ["petites", "petite", "petit"], answer: "petites" },
      { key: "q4", choices: ["magnifiques", "magnifique", "magnifiquement"], answer: "magnifiques" }
    ]
  },
  "Environnement": {
    themeName: "Environnement",
    words: ["propre", "recyclable", "grands", "indispensable"],
    textParts: [
      "Pour protéger la Terre, nous gardons notre quartier bien ",
      ". Nous trions chaque déchet dans une poubelle ",
      " en carton. Les ",
      " arbres des parcs purifient l'air de la ville. L'eau est une ressource ",
      " qu'il faut économiser chaque jour."
    ],
    questions: [
      { key: "q1", choices: ["propre", "propreté", "proprement"], answer: "propre" },
      { key: "q2", choices: ["recyclable", "recycler", "recyclage"], answer: "recyclable" },
      { key: "q3", choices: ["grands", "grand", "grande"], answer: "grands" },
      { key: "q4", choices: ["indispensable", "indispensables", "facultatif"], answer: "indispensable" }
    ]
  },
  "Contes de fées": {
    themeName: "Contes de fées",
    words: ["enchantée", "gentil", "mystérieuse", "magique"],
    textParts: [
      "Il était une fois, dans une forêt ",
      ", une princesse qui parlait aux oiseaux. Un ",
      " elfe l'aida à retrouver son chemin vers la colline ",
      ". Elle agita une baguette ",
      " pour faire apparaître un magnifique château de cristal."
    ],
    questions: [
      { key: "q1", choices: ["enchantée", "enchanté", "enchantement"], answer: "enchantée" },
      { key: "q2", choices: ["gentil", "gentille", "gentiment"], answer: "gentil" },
      { key: "q3", choices: ["mystérieuse", "mystérieux", "mystère"], answer: "mystérieuse" },
      { key: "q4", choices: ["magique", "magicien", "magiquement"], answer: "magique" }
    ]
  },
  "Le Savoir": {
    themeName: "Le Savoir",
    words: ["curieux", "intelligents", "belle", "excellent"],
    textParts: [
      "Pour approfondir ses connaissances, l'étudiant ",
      " lit de nombreux manuels scolaires. Les projets les plus  ",
      " naissent d'une curiosité insatiable. Les poésies contiennent une ",
      " leçon de vie universelle. Un ",
      " livre instruit l'esprit tout en ouvrant l'imagination."
    ],
    questions: [
      { key: "q1", choices: ["curieux", "curieuse", "curiosité"], answer: "curieux" },
      { key: "q2", choices: ["intelligents", "intelligent", "intelligence"], answer: "intelligents" },
      { key: "q3", choices: ["belle", "beau", "beaux"], answer: "belle" },
      { key: "q4", choices: ["excellent", "excellente", "excellence"], answer: "excellent" }
    ]
  },
  "Science-Fiction": {
    themeName: "Science-Fiction",
    words: ["spatiale", "lointaines", "brillantes", "incroyable"],
    textParts: [
      "Le vaisseau entame sa mission ",
      " à travers la galaxie. Les astronautes explorent des planètes ",
      " pleines de secrets. Les étoiles de la nébuleuse sont particulièrement ",
      " et guident le capitaine. C'est une aventure ",
      " qui défie les lois de la physique moderne."
    ],
    questions: [
      { key: "q1", choices: ["spatiale", "spatial", "espace"], answer: "spatiale" },
      { key: "q2", choices: ["lointaines", "lointain", "loin"], answer: "lointaines" },
      { key: "q3", choices: ["brillantes", "brillante", "brillant"], answer: "brillantes" },
      { key: "q4", choices: ["incroyable", "croire", "incroyablement"], answer: "incroyable" }
    ]
  },
  "Tolérance & Entraide": {
    themeName: "Tolérance & Entraide",
    words: ["solidaire", "généreux", "forte", "unis"],
    textParts: [
      "Dans cette aventure, chaque citoyen est ",
      " envers ses voisins en difficulté. Un don ",
      " réchauffe les cœurs blessés. Notre union crée une ",
      " barrière contre l'injustice sociale. Les bénévoles marchent main dans la main, ",
      " pour construire un monde meilleur."
    ],
    questions: [
      { key: "q1", choices: ["solidaire", "solidarité", "solidairement"], answer: "solidaire" },
      { key: "q2", choices: ["généreux", "généreuse", "générosité"], answer: "généreux" },
      { key: "q3", choices: ["forte", "fort", "force"], answer: "forte" },
      { key: "q4", choices: ["unis", "uni", "unir"], answer: "unis" }
    ]
  },
  "Loisirs & Amitié": {
    themeName: "Loisirs & Amitié",
    words: ["complices", "joyeux", "nouvelle", "heureuse"],
    textParts: [
      "Dans le grand jardin public, deux camarades très ",
      " partagent leurs jouets préférés. Les rires ",
      " résonnent près du toboggan coloré. Ils inventent une ",
      " règle pour rendre leur jeu encore plus passionnant. C'est une journée ",
      " passée entre copains."
    ],
    questions: [
      { key: "q1", choices: ["complices", "complice", "complicité"], answer: "complices" },
      { key: "q2", choices: ["joyeux", "joyeuse", "joie"], answer: "joyeux" },
      { key: "q3", choices: ["nouvelle", "nouveau", "nouvelles"], answer: "nouvelle" },
      { key: "q4", choices: ["heureuse", "heureux", "heureusement"], answer: "heureuse" }
    ]
  },
  "Conte classique": {
    themeName: "Conte classique",
    words: ["ancienne", "petite", "rusé", "mystérieuse"],
    textParts: [
      "Dans une ",
      " maison forestière de pain d'épices habitait une gentille famille. Une ",
      " fille y cultivait de magnifiques roses rouges. Un loup ",
      " l'observait derrière un buisson de la prairie ",
      ", espérant découvrir le secret de son parfum enchanté."
    ],
    questions: [
      { key: "q1", choices: ["ancienne", "ancien", "anciennement"], answer: "ancienne" },
      { key: "q2", choices: ["petite", "petit", "petits"], answer: "petite" },
      { key: "q3", choices: ["rusé", "rusée", "ruse"], answer: "rusé" },
      { key: "q4", choices: ["mystérieuse", "mystérieux", "mystère"], answer: "mystérieuse" }
    ]
  },
  "Amitié / Tolérance": {
    themeName: "Amitié / Tolérance",
    words: ["sincère", "bienveillants", "grande", "fiers"],
    textParts: [
      "Une amitié ",
      " réunit des enfants venus d'horizons différents. Leurs regards ",
      " témoignent d'une acceptation totale d'autrui. Une ",
      " chaîne d'entraide s'organise naturellement dans la cour de récréation. Nous sommes ",
      " de célébrer nos différences culturelles."
    ],
    questions: [
      { key: "q1", choices: ["sincère", "sincèrement", "sincérité"], answer: "sincère" },
      { key: "q2", choices: ["bienveillants", "bienveillant", "bienveillance"], answer: "bienveillants" },
      { key: "q3", choices: ["grande", "grand", "grandement"], answer: "grande" },
      { key: "q4", choices: ["fiers", "fier", "fièrement"], answer: "fiers" }
    ]
  }
};

export const DEFAULT_COMMON_ACTIVITY: CommonThemeActivity = {
  themeName: "La fête de fin d'année",
  words: ["attentive", "heureux", "grande", "délicieux"],
  textParts: [
    "C'est la fin de l'année ! La directrice de l'école est très ",
    " . Les élèves sont ",
    " de recevoir leurs prix. Maman a apporté une ",
    " brioche. Nous dégustons un ",
    " gâteau au chocolat."
  ],
  questions: [
    { key: "q1", choices: ["attentive", "attentif", "attention"], answer: "attentive" },
    { key: "q2", choices: ["heureux", "heureusement", "heure"], answer: "heureux" },
    { key: "q3", choices: ["grande", "grand", "grandement"], answer: "grande" },
    { key: "q4", choices: ["délicieux", "délicieuse", "délicieusement"], answer: "délicieux" }
  ]
};

export const getCommonActivityForFiche = (theme?: string): CommonThemeActivity => {
  if (!theme) return DEFAULT_COMMON_ACTIVITY;
  // Try to find direct match
  if (COMMON_ACTIVITIES_BY_THEME[theme]) {
    return COMMON_ACTIVITIES_BY_THEME[theme];
  }
  // Alternate search (case-insensitive or sub-string match)
  const themeLower = theme.toLowerCase();
  for (const key of Object.keys(COMMON_ACTIVITIES_BY_THEME)) {
    if (themeLower.includes(key.toLowerCase()) || key.toLowerCase().includes(themeLower)) {
      return COMMON_ACTIVITIES_BY_THEME[key];
    }
  }
  return DEFAULT_COMMON_ACTIVITY;
};
