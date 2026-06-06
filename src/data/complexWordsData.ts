export interface ComplexWordInfo {
  word: string;
  definition: string;
  example: string;
  synonyms: string[];
}

export const COMPLEX_WORDS_REGISTRY: Record<string, ComplexWordInfo> = {
  "malade": {
    word: "malade",
    definition: "Qui a une altération de la santé, qui ne se sent pas bien.",
    example: "Jacquot est resté au lit car il est très malade aujourd'hui.",
    synonyms: ["souffrant", "indisposé", "fatigué", "alité"]
  },
  "médecin": {
    word: "médecin",
    definition: "Personne dont le métier est de soigner les malades et de prescrire des médicaments.",
    example: "Le médecin arrive avec sa sacoche pour examiner le blessé.",
    synonyms: ["docteur", "praticien", "thérapeute"]
  },
  "fièvre": {
    word: "fièvre",
    definition: "Élévation accidentelle de la température du corps au-dessus du niveau normal.",
    example: "Le petit garçon a une forte fièvre et le front très brûlant.",
    synonyms: ["température", "pyrexie", "chaleur"]
  },
  "docteur": {
    word: "docteur",
    definition: "Personne habilitée à soigner et à guérir les personnes malades.",
    example: "Le gentil docteur ausculte le cœur de Jacquot.",
    synonyms: ["médecin", "praticien", "généraliste"]
  },
  "examine": {
    word: "examine",
    definition: "Regarder très attentivement quelque chose ou quelqu'un pour observer son état.",
    example: "Le docteur examine la gorge toute rouge du petit malade.",
    synonyms: ["ausculte", "observe", "analyse", "étudie"]
  },
  "stéthoscope": {
    word: "stéthoscope",
    definition: "Instrument médical servant à écouter les bruits internes du corps (cœur, poumons).",
    example: "Avec son stéthoscope froid, le docteur écoute les battements cardiaques.",
    synonyms: ["écouteur médical", "amplificateur pulmonaire"]
  },
  "gorge": {
    word: "gorge",
    definition: "Partie interne du cou qui sert à respirer et à avaler la nourriture.",
    example: "Le docteur demande d'ouvrir grand la bouche pour regarder la gorge.",
    synonyms: ["gosier", "pharynx"]
  },
  "ordonnance": {
    word: "ordonnance",
    definition: "Papier écrit par le médecin qui indique la liste des médicaments à acheter.",
    example: "Maman prend l'ordonnance remise par le médecin pour aller à la pharmacie.",
    synonyms: ["prescription", "formule médicale"]
  },
  "conseille": {
    word: "conseille",
    definition: "Indiquer à quelqu'un ce qu'il doit ou peut faire d'utile.",
    example: "Le médecin lui conseille de boire des boissons chaudes et de se reposer.",
    synonyms: ["recommande", "suggère", "aiguille", "guide"]
  },
  "pharmacie": {
    word: "pharmacie",
    definition: "Lieu où l'on prépare et où l'on vend des médicaments.",
    example: "Pour avoir ses comprimés, la maman court vite à la pharmacie du village.",
    synonyms: ["officine", "apothicairerie"]
  },
  "sirop": {
    word: "sirop",
    definition: "Médicament liquide, sirupeux et sucré que l'on boit généralement à la cuillère.",
    example: "Ce sirop à la menthe calme rapidement la vilaine toux nocturne.",
    synonyms: ["potion", "liquide sucré", "médicament fluide"]
  },
  "chapiteau": {
    word: "chapiteau",
    definition: "Grande tente de toile tendue sous laquelle se donnent les représentations de cirque.",
    example: "Le grand chapiteau rouge et blanc a été dressé au milieu de la place de la ville.",
    synonyms: ["tente de cirque", "toile", "dôme"]
  },
  "jongleur": {
    word: "jongleur",
    definition: "Artiste qui lance, rattrape et manipule habilement des objets en l'air.",
    example: "Le jongleur rattrape avec dextérité dix massues colorées en même temps.",
    synonyms: ["prestidigitateur", "artiste", "manipulateur"]
  },
  "acrobate": {
    word: "acrobate",
    definition: "Personne qui fait par profession des exercices d'équilibre ou de gymnastique difficiles.",
    example: "L'acrobate s'élance sur son trapèze volant et réalise un saut périlleux.",
    synonyms: ["voltigeur", "gymnaste", "funambule"]
  },
  "clown": {
    word: "clown",
    definition: "Artiste de cirque comique habillé de façon bizarre, maquillé et coiffé d'un nez rouge.",
    example: "Le clown fait rire les enfants en trébuchant maladroitement avec des seaux d'eau.",
    synonyms: ["pitre", "farceur", "bouffon", "comédien"]
  },
  "spectacle": {
    word: "spectacle",
    definition: "Divertissement ou représentation publique qui se donne au théâtre, au cirque ou en plein air.",
    example: "Les enfants applaudissent fort à la fin du magnifique spectacle de magie.",
    synonyms: ["représentation", "divertissement", "fête", "gala"]
  },
  "émerveillé": {
    word: "émerveillé",
    definition: "Qui est frappé d'un étonnement agréable ou de grande admiration devant quelque chose.",
    example: "Le public émerveillé regarde le feu d'artifice illuminer le ciel nocturne.",
    synonyms: ["ravi", "étonné", "fasciné", "enchanté", "subjugué"]
  },
  "majestueux": {
    word: "majestueux",
    definition: "Qui a une grandeur imposante et digne, qui inspire le respect.",
    example: "Un majestueux aigle royal déploie ses grandes ailes au sommet de la falaise.",
    synonyms: ["imposant", "grand", "noble", "splendide", "solennel"]
  },
  "rugir": {
    word: "rugir",
    definition: "Pousser son cri puissant et effrayant, en parlant du lion ou d'autres fauves.",
    example: "Au coucher du soleil, on entend le lion rugir à des kilomètres dans la savane.",
    synonyms: ["hurler", "beugler", "rugir", "gronder"]
  },
  "soigneur": {
    word: "soigneur",
    definition: "Personne dont le rôle est de nourrir et de veiller sur la santé des animaux dans un zoo.",
    example: "Le soigneur donne de grands morceaux de bambou frais aux pandas géants.",
    synonyms: ["gardien d'animaux", "assistant animalier"]
  },
  "diversité": {
    word: "diversité",
    definition: "Variété, grand nombre de choses d'espèces ou d'opinions différentes.",
    example: "Le biologiste admire la grande diversité de fleurs sauvages dans la vallée.",
    synonyms: ["variété", "pluralité", "multiplicité", "différence"]
  },
  "inséparable": {
    word: "inséparable",
    definition: "Qu'on ne peut pas séparer, éloigner ou diviser ; qui sont toujours ensemble.",
    example: "Sami et Thomas sont des amis inséparables, ils partagent tous leurs jeux.",
    synonyms: ["indivisible", "uni", "lié", "soudé"]
  },
  "tempête": {
    word: "tempête",
    definition: "Violente perturbation de l'air avec des vents rapides, souvent accompagnée de pluie ou de neige.",
    example: "La tempête de sable recouvre le désert et oblige les caravanes à s'arrêter.",
    synonyms: ["ouragan", "bourrasque", "tempête", "typhon", "orage"]
  },
  "courageuse": {
    word: "courageuse",
    definition: "Qui a du courage, qui affronte le danger ou les épreuves sans faiblir.",
    example: "La courageuse jeune fille a bravé l'orage pour retrouver son petit agneau perdu.",
    synonyms: ["brave", "intrépide", "vaillante", "héroïque", "hardie"]
  },
  "savane": {
    word: "savane",
    definition: "Immense étendue herbeuse des régions tropicales chaudes, parsemée d'arbres isolés.",
    example: "Les gazelles courent librement à travers la savane africaine sous un soleil brûlant.",
    synonyms: ["prairie tropicale", "steppe", "brousse"]
  },
  "rusé": {
    word: "rusé",
    definition: "Qui fait preuve de ruse et d'astuce pour tromper les autres ou se tirer d'affaire.",
    example: "Le lièvre rusé de l'histoire a imaginé un plan pour échapper aux griffes du lion.",
    synonyms: ["malin", "astucieux", "malicieux", "finaud", "roublard"]
  },
  "intelligence": {
    word: "intelligence",
    definition: "Faculté de comprendre, de réfléchir, de raisonner et de s'adapter aux situations.",
    example: "Grâce à son intelligence pratique, Sami a résolu l'énigme complexe en un instant.",
    synonyms: ["esprit", "compréhension", "génie", "raison", "astuce"]
  },
  "désert": {
    word: "désert",
    definition: "Grande étendue stérile où il ne pleut presque jamais et où la vie est très rare.",
    example: "Des dunes de sable infinies s'étendent de part et d'autre du désert du Sahara.",
    synonyms: ["étendue aride", "solitude", "vide", "friche"]
  },
  "légende": {
    word: "légende",
    definition: "Récit transmis oralement, où l'imaginaire et la magie se mêlent à des faits réels.",
    example: "Le chef de tribu raconte la légende du grand esprit de la montagne aux enfants.",
    synonyms: ["conte", "mythe", "récit", "fable", "folklore"]
  },
  "ancêtre": {
    word: "ancêtre",
    definition: "Personne de la famille dont on descend et qui a vécu il y a très longtemps.",
    example: "Nos ancêtres cultivaient la terre à l'aide de grands chevaux de trait.",
    synonyms: ["aïeul", "prédécesseur", "ancêtre", "parent ancien"]
  },
  "villageois": {
    word: "villageois",
    definition: "Personne qui habite un village ou la campagne environnante.",
    example: "Tous les villageois se réunissent sur la place principale pour la fête de l'été.",
    synonyms: ["habitant du village", "paysan", "bourgeois de campagne"]
  },
  "impatience": {
    word: "impatience",
    definition: "Difficulté ou incapacité à attendre tranquillement que quelque chose arrive.",
    example: "Les élèves trépignent d'impatience à l'idée de commencer la chasse au trésor.",
    synonyms: ["empressement", "nervosité", "hâte", "irritation"]
  },
  "traditionnel": {
    word: "traditionnel",
    definition: "Qui découle de traditions transmises de génération en génération depuis longtemps.",
    example: "Pour la fête, les danseurs portent un costume traditionnel aux broderies colorées.",
    synonyms: ["coutumier", "classique", "historique", "habituel"]
  },
  "célébrer": {
    word: "célébrer",
    definition: "Fêter dignement un jour spécial par des réunions ou des cérémonies joyeuses.",
    example: "Toute l'école est décorée ce matin pour célébrer la fin de l'année scolaire.",
    synonyms: ["fêter", "honorer", "solenniser", "commémorer"]
  },
  "retentir": {
    word: "retentir",
    definition: "Produire une résonance sonore prolongée, puissante et éclatante.",
    example: "On entend le sifflet du train de voyageurs retentir à l'entrée de la gare.",
    synonyms: ["résonner", "sonner", "éclater", "vibrer"]
  },
  "environnement": {
    word: "environnement",
    definition: "Climat et milieu de vie naturel (terre, eau, faune) entourant les êtres vivants.",
    example: "Trier les déchets en plastique est un geste simple pour sauver l'environnement.",
    synonyms: ["nature", "milieu biologique", "alentours", "cadre de vie"]
  },
  "armure": {
    word: "armure",
    definition: "Assemblage de plaques de fer destinées à protéger le corps d'un chevalier au combat.",
    example: "L'armure du preux chevalier brillait intensément sous la lumière du soleil.",
    synonyms: ["cuirasse", "protection en fer", "harnois"]
  },
  "épée": {
    word: "épée",
    definition: "Arme de combat munie d'une poignée et d'une longue lame tranchante en acier.",
    example: "Le chevalier lève bien haut son épée pour saluer le roi et la reine présents.",
    synonyms: ["glaive", "sabre", "fleuret"]
  },
  "bouclier": {
    word: "bouclier",
    definition: "Arme défensive portée au bras gauche destinée à parer les projectiles ou les coups.",
    example: "Le garde dévie une flèche à l'aide de son large bouclier en bois clouté.",
    synonyms: ["écu", "pavois", "rondache", "protection"]
  },
  "château": {
    word: "château",
    definition: "Grande demeure historique ou forteresse féodale autrefois fortifiée pour la guerre.",
    example: "Le vieux château fort se dresse sur la colline avec ses hautes tours de pierre.",
    synonyms: ["forteresse", "palais", "bastion", "castel"]
  },
  "bibliothèque": {
    word: "bibliothèque",
    definition: "Lieu calme abritant des collections de livres que l'on peut consulter sur place ou emprunter.",
    example: "La maîtresse nous emmène à la bibliothèque pour lire des contes d'aventures.",
    synonyms: ["médiathèque", "librairie", "salle de lecture"]
  },
  "fusée": {
    word: "fusée",
    definition: "Engin volant propulsé à très haute vitesse vers l'espace sideral.",
    example: "La fusée décolle dans un bruit de tonnerre et monte droit vers la Lune.",
    synonyms: ["vaisseau spatial", "projectile", "missile", "navette"]
  },
  "astronaute": {
    word: "astronaute",
    definition: "Personne entraînée pour voyager et effectuer des travaux scientifiques à bord d'un engin spatial.",
    example: "L'astronaute flotte en apesanteur près de la station internationale.",
    synonyms: ["cosmonaute", "spationaute", "voyageur de l'espace"]
  },
  "gravité": {
    word: "gravité",
    definition: "Force d'attraction universelle qui tire tous les objets en direction de la Terre.",
    example: "Sur la Lune, la gravité est plus faible, ce qui permet de faire des bonds géants.",
    synonyms: ["attraction terrestre", "pesanteur", "force d'attraction"]
  },
  "lointain": {
    word: "lointain",
    definition: "Qui est situé à une distance considérable, très éloigné dans l'espace ou dans le passé.",
    example: "Le bateau met les voiles vers un continent lointain inconnu des marins tunisiens.",
    synonyms: ["éloigné", "reculé", "distant", "vague"]
  },
  "original": {
    word: "original",
    definition: "Qui n'est pas copié, qui sort de l'ordinaire par sa nouveauté ou sa singularité.",
    example: "Cette maison a un toit original en forme de chapeau de fée.",
    synonyms: ["singulier", "bizarre", "nouveau", "créatif", "atypique"]
  },
  "timide": {
    word: "timide",
    definition: "Qui manque d'assurance ou craint d'aborder les personnes par réserve ou peur de mal faire.",
    example: "Le nouvel écolier est timide et n'ose pas parler avec ses camarades de classe.",
    synonyms: ["réservé", "effarouché", "gêné", "pudique", "discret"]
  },
  "solidarité": {
    word: "solidarité",
    definition: "Sentiment d'entraide fraternelle poussant les personnes à s'aider mutuellement face aux besoins.",
    example: "Les élèves font preuve de solidarité en partageant leurs crayons avec le voisin.",
    synonyms: ["entraide", "coopération", "soutien", "fraternité", "union"]
  },
  "menuisier": {
    word: "menuisier",
    definition: "Artisan travaillant le bois pour fabriquer des meubles, des portes, des fenêtres et des cadres.",
    example: "Le menuisier découpe une planche d'acajou avec sa scie circulaire.",
    synonyms: ["charpentier", "artisan du bois", "ébéniste"]
  },
  "marionnette": {
    word: "marionnette",
    definition: "Figurine de bois ou d'étoffe manœuvrée par des fils ou l'enfilage de la main.",
    example: "La marionnette de Pinocchio bouge ses bras articulés sur la petite scène.",
    synonyms: ["pantin", "figurine", "poupon"]
  },
  "s'animer": {
    word: "s'animer",
    definition: "Prendre vie, se mettre en mouvement, s'exciter ou devenir plus actif.",
    example: "Dès que l'horloge sonne minuit, les jolis jouets du magasin se mettent à s'animer.",
    synonyms: ["prendre vie", "s'éveiller", "s'agiter", "bouger"]
  },
  "honnête": {
    word: "honnête",
    definition: "Qui respecte la justice, qui refuse de mentir ou de s'emparer du bien d'autrui.",
    example: "L'élève honnête a rendu le billet tombé par terre à sa maîtresse.",
    synonyms: ["sincère", "loyal", "droit", "franc", "juste"]
  },
  "héritage": {
    word: "héritage",
    definition: "Transmission de biens, de richesses ou de valeurs culturelles reçus par succession des aïeux.",
    example: "La vieille maison familiale est un précieux héritage légué par notre grand-père.",
    synonyms: ["patrimoine", "legs", "succession", "héritage"]
  },
  "ordinaire": {
    word: "ordinaire",
    definition: "Qui est régulier, habituel, sans éclat ou sans élément surprenant.",
    example: "Pendant des heures, il a mené une vie ordinaire avant de monter dans le manège.",
    synonyms: ["commun", "habituel", "banal", "simple", "moyen"]
  },
  "tromper": {
    word: "tromper",
    definition: "Induire quelqu'un en erreur volontairement à l'aide de mensonges ou d'artifices.",
    example: "Le corbeau rusé espère tromper le renard pour garder son délicieux fromage.",
    synonyms: ["duper", "leurrer", "piéger", "berner", "abuser"]
  },
  "orpheline": {
    word: "orpheline",
    definition: "Jeune fille ayant perdu ses parents, décédés ou introuvables.",
    example: "L'orpheline Heidi passait ses étés dans les jolis pâturages de haute montagne.",
    synonyms: ["sans parents", "abandonnée", "solitaire"]
  },
  "solitaire": {
    word: "solitaire",
    definition: "Qui vit seul par tempérament ou accident, sans fréquenter la présence d'autres humains.",
    example: "Le vieux hibou solitaire dort seul au creux d'un vieux tronc de chêne.",
    synonyms: ["isolé", "seul", "retiré", "ermite", "unique"]
  },
  "compagnie": {
    word: "compagnie",
    definition: "Présence chaleureuse de quelqu'un à nos côtés, ou groupe de personnes unies.",
    example: "La petite fille adore lire de belles histoires en compagnie de sa mamie.",
    synonyms: ["présence", "société", "groupe", "entourage"]
  },
  "curiosité": {
    word: "curiosité",
    definition: "Désir d'examiner et de s'instruire, ou envie parfois indiscrète d'apprendre des nouvelles secrets.",
    example: "La saine curiosité pousse les élèves à observer les fourmis à la loupe.",
    synonyms: ["intérêt", "indiscrétion", "éveil", "attention", "recherche"]
  },
  "différence": {
    word: "différence",
    definition: "Élément qui distingue deux choses ou créatures l'une de l'autre de manière visible ou morale.",
    example: "La principale différence entre ces fleurs réside dans leur belle odeur.",
    synonyms: ["divergence", "distinction", "écart", "variété"]
  },
  "tolérance": {
    word: "tolérance",
    definition: "Volonté d'accepter chez d'autres personnes des façons de penser ou d'agir différentes des nôtres.",
    example: "La tolérance scolaire permet à chacun de vivre heureux malgré ses différences.",
    synonyms: ["indulgence", "respect", "ouverture", "compréhension", "patience"]
  },
  "printemps": {
    word: "printemps",
    definition: "Saison douce succédant à l'hiver, caractérisée par la floraison de la végétation et le retour du vert.",
    example: "Au printemps, les oiseaux chantent joyeusement dans les branches fleuries.",
    synonyms: ["saison des fleurs", "renouveau", "embellie de l'année"]
  },
  "campagne": {
    word: "campagne",
    definition: "Vaste étendue d'espace naturel ou cultivé à l'extérieur des grandes villes.",
    example: "Nous passons le long week-end à la campagne chez notre oncle vigneron.",
    synonyms: ["champs", "plaine", "nature", "terroir"]
  },
  "appétit": {
    word: "appétit",
    definition: "Sensation de faim ou vif désir d'ingérer de délicieux petits plats préparés.",
    example: "Après l'escalade, le randonneur dévore sa tartine de confiture avec appétit.",
    synonyms: ["faim", "gourmandise", "envie de manger"]
  },
  "propre": {
    word: "propre",
    definition: "Qui est parfaitement lavé, net de poussière, d'ordure ou de bactérie de saleté.",
    example: "L'élève poli jette ses mouchoirs usés à la corbeille pour garder sa chambre propre.",
    synonyms: ["net", "lavé", "impeccable", "sain"]
  },
  "manège": {
    word: "manège",
    definition: "Carrousel forain rotatif équipé de petits chevaux ou d'avions mécaniques pour les loisirs.",
    example: "Le rire des enfants retentit alors que le grand manège tourne en musique.",
    synonyms: ["carrousel", "attraction tournante", "montagne russe"]
  },
  "magnifique": {
    word: "magnifique",
    definition: "Qui est d'une beauté et d'une splendeur extraordinaires qui ravissent l'esprit.",
    example: "Tateb arbore une magnifique écharpe tricotée en laine de mérinos.",
    synonyms: ["splendide", "superbe", "merveilleux", "admirable", "somptueux"]
  },
  "déguisement": {
    word: "déguisement",
    definition: "Vêtements, perruque ou masque portés temporairement pour cacher ou modifier l'identité de quelqu'un.",
    example: "Le déguisement de détective de Sami comprend une loupe de poche et une casquette.",
    synonyms: ["costume", "masque", "travestissement"]
  },
  "méconnaissable": {
    word: "méconnaissable",
    definition: "Qui a tellement changé d'aspect ou de comportement qu'on ne l'identifie plus directement.",
    example: "Grimé en pirate borgne, le petit garçon était méconnaissable pour sa maman.",
    synonyms: ["transformé", "défiguré", "méconnaissable", "altéré"]
  },
  "défiler": {
    word: "défiler",
    definition: "Marcher l'un après l'autre de façon rythmée, alignée et solennelle lors d'une célébration.",
    example: "Les enfants déguisés s'élancent pour défiler dans les rues fleuries de la ville.",
    synonyms: ["parader", "marcher à la file", "défiler", "parcourir"]
  },
  "succulents": {
    word: "succulents",
    definition: "Qui est juteux, extrêmement savoureux et qui flatte délicieusement le palais gustatif.",
    example: "Notre grand-mère tunisienne prépare des succulents beignets au miel et aux graines de sésame.",
    synonyms: ["délicieux", "savoureux", "exquis", "délectables"]
  },
  "rare": {
    word: "rare",
    definition: "Qui existe ou se produit en très petite quantité ou de façon exceptionnelle.",
    example: "Trouver une perle ronde au fond de ce lac est un fait exceptionnellement rare.",
    synonyms: ["unique", "exceptionnel", "insolite", "clairsemé"]
  }
};

/**
 * Finds the local synonym database match or returns a standard default object.
 */
export const findComplexWordInfoLocal = (word: string): ComplexWordInfo | null => {
  if (!word) return null;
  const normalized = word.toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Accent stripping for comparison tolerance

  // Direct lookup
  if (COMPLEX_WORDS_REGISTRY[normalized]) {
    return COMPLEX_WORDS_REGISTRY[normalized];
  }

  // Fallback search prefix matching or spelling variance
  for (const key of Object.keys(COMPLEX_WORDS_REGISTRY)) {
    if (normalized.startsWith(key) || key.startsWith(normalized)) {
      return COMPLEX_WORDS_REGISTRY[key];
    }
  }

  return null;
};
