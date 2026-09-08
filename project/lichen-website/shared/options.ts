// Libellés et valeurs du questionnaire.
// Fichier unique partagé par le formulaire, la validation serveur et
// l'administration : un libellé ne doit exister qu'à un seul endroit.

export interface Opt { v: string; l: string }

export const CADRES: Opt[] = [
  { v: 'ecole-publique', l: 'École publique' },
  { v: 'ecole-hors-contrat', l: 'École hors contrat' },
  { v: 'ecole-democratique', l: 'École démocratique' },
  { v: 'animation-nature', l: 'Animation nature' },
  { v: 'ief', l: 'Instruction en famille' },
  { v: 'centre-loisirs', l: 'Centre de loisirs' },
  { v: 'autre', l: 'Autre' }
]

export const AGES: Opt[] = [
  { v: '3-7', l: '3 à 7 ans' },
  { v: '8-11', l: '8 à 11 ans' },
  { v: '12-14', l: '12 à 14 ans' },
  { v: '15+', l: '15 ans et plus' }
]

export const FREQUENCES: Opt[] = [
  { v: 'quotidienne', l: 'Quotidienne' },
  { v: 'hebdomadaire', l: 'Hebdomadaire' },
  { v: 'mensuelle', l: 'Mensuelle' },
  { v: 'ponctuelle', l: 'Ponctuelle' }
]

export const ANCIENNETES: Opt[] = [
  { v: '-1an', l: 'Moins d’un an' },
  { v: '1-3ans', l: '1 à 3 ans' },
  { v: '3-10ans', l: '3 à 10 ans' },
  { v: '10ans+', l: 'Plus de 10 ans' }
]

export const GROUPES: Opt[] = [
  { v: '1-3', l: '1 à 3 enfants' },
  { v: '4-8', l: '4 à 8 enfants' },
  { v: '9-15', l: '9 à 15 enfants' },
  { v: '16-25', l: '16 à 25 enfants' },
  { v: '25+', l: 'Plus de 25 enfants' }
]

export const EMPORTE: Opt[] = [
  { v: 'carnet', l: 'Carnet' },
  { v: 'crayons', l: 'Crayons' },
  { v: 'loupe', l: 'Loupe' },
  { v: 'jumelles', l: 'Jumelles' },
  { v: 'cles', l: 'Clés de détermination' },
  { v: 'photo', l: 'Appareil photo' },
  { v: 'smartphone-vous', l: 'Smartphone (le vôtre)' },
  { v: 'smartphone-enfants', l: 'Smartphone (celui des enfants)' },
  { v: 'tablette', l: 'Tablette' },
  { v: 'rien', l: 'Rien' },
  { v: 'autre', l: 'Autre' }
]

export const APPS: Opt[] = [
  { v: 'seek', l: 'Seek' },
  { v: 'plantnet', l: 'Pl@ntNet' },
  { v: 'merlin', l: 'Merlin' },
  { v: 'inaturalist', l: 'iNaturalist' },
  { v: 'vigie-nature', l: 'Vigie-Nature École' },
  { v: 'autre', l: 'Autre' },
  { v: 'aucune', l: 'Aucune' }
]

export const ECHELLE: Opt[] = [
  { v: '1', l: 'Pas du tout d’accord' },
  { v: '2', l: 'Plutôt pas d’accord' },
  { v: '3', l: 'Sans avis tranché' },
  { v: '4', l: 'Plutôt d’accord' },
  { v: '5', l: 'Tout à fait d’accord' }
]

// Grille de codage de la Q9 — les quatre hypothèses de rejet, plus deux
// sorties de secours. À figer AVANT la lecture des réponses.
export const CODES: Opt[] = [
  { v: 'sensoriel', l: 'Sensoriel — l’écran coupe du milieu' },
  { v: 'pratique', l: 'Pratique — logistique, casse, batterie, réseau' },
  { v: 'institutionnel', l: 'Institutionnel — règlement, hiérarchie, parents' },
  { v: 'economique', l: 'Économique — modèle des plateformes, données, publicité' },
  { v: 'hors-grille', l: 'Hors grille — argument non prévu' },
  { v: 'illisible', l: 'Inexploitable — réponse trop courte ou ambiguë' }
]

export const OBJECTIF_REPONSES = 30

export const label = (list: Opt[], v: string): string =>
  list.find((o) => o.v === v)?.l || v

export const values = (list: Opt[]): string[] => list.map((o) => o.v)

// ===========================================================================
// Second questionnaire — grand public (/dehors)
//
// Même contrainte de fond que le premier : il ne présente aucun objet et ne
// demande à personne si une idée lui plaît. Il mesure des positions et des
// pratiques déclarées chez des adultes, parents ou non.
//
// ECHELLE, APPS et CODES sont volontairement partagés avec le questionnaire
// professionnel : c'est ce qui rend les deux populations comparables sur le
// seul croisement qui compte (position déclarée × usage réel), et permet
// d'appliquer une grille de codage unique aux deux corpus.
// ===========================================================================

export const LIENS: Opt[] = [
  { v: 'parent', l: 'J’ai un ou plusieurs enfants' },
  { v: 'grand-parent', l: 'Je suis grand-parent' },
  { v: 'entourage', l: 'Je n’ai pas d’enfant, mais j’en côtoie (famille, amis)' },
  { v: 'sans', l: 'Je n’ai pas d’enfant et je n’en côtoie pas' },
  { v: 'metier', l: 'Mon métier me met en contact avec des enfants' }
]

export const AGES_PROCHES: Opt[] = [
  { v: '0-2', l: 'Moins de 3 ans' },
  { v: '3-7', l: '3 à 7 ans' },
  { v: '8-11', l: '8 à 11 ans' },
  { v: '12-14', l: '12 à 14 ans' },
  { v: '15+', l: '15 ans et plus' },
  { v: 'sans-objet', l: 'Sans objet' }
]

export const SORTIES: Opt[] = [
  { v: 'quotidienne', l: 'Presque tous les jours' },
  { v: 'hebdomadaire', l: 'Chaque semaine' },
  { v: 'mensuelle', l: 'Une ou deux fois par mois' },
  { v: 'rare', l: 'Quelques fois par an' },
  { v: 'jamais', l: 'Presque jamais' }
]

// Mesure indirecte de l'« extinction de l'expérience » (Pyle) : elle sert de
// variable de contrôle, pas de jugement.
export const SAVOIRS: Opt[] = [
  { v: 'aucune', l: 'Aucune, ou presque' },
  { v: 'quelques', l: 'Moins d’une dizaine' },
  { v: 'vingtaine', l: 'Une vingtaine' },
  { v: 'beaucoup', l: 'Cinquante ou plus' }
]

export const ENFANCE: Opt[] = [
  { v: 'souvent', l: 'Souvent' },
  { v: 'parfois', l: 'Parfois' },
  { v: 'rarement', l: 'Rarement' },
  { v: 'jamais', l: 'Jamais' }
]

export const GESTES: Opt[] = [
  { v: 'photo', l: 'Je le photographie' },
  { v: 'appli', l: 'J’ouvre une application pour l’identifier' },
  { v: 'plus-tard', l: 'Je cherche sur internet, plus tard' },
  { v: 'demande', l: 'Je demande à quelqu’un' },
  { v: 'livre', l: 'Je regarde dans un guide ou un livre' },
  { v: 'regarde', l: 'Je le regarde, sans chercher à savoir ce que c’est' },
  { v: 'rien', l: 'Honnêtement, je ne le remarque pas vraiment' },
  { v: 'autre', l: 'Autre' }
]

// Les cinq voies vers la connexion à la nature (Lumber, Richardson & Sheffield,
// PLoS ONE, 2017), plus trois propositions de sens commun. `noms` est la seule
// dont l'étude établit qu'elle n'augmente **pas** la connexion à la nature :
// l'écart entre ce que le public croit et ce que la littérature établit est le
// résultat que cette question cherche à produire.
export const VOIES: Opt[] = [
  { v: 'noms', l: 'Apprendre à reconnaître et à nommer les espèces' },
  { v: 'sensoriel', l: 'Toucher, sentir, écouter — et avoir le droit de se salir' },
  { v: 'emotion', l: 'Des moments forts vécus dehors' },
  { v: 'compassion', l: 'S’occuper d’un être vivant et s’en sentir responsable' },
  { v: 'sens', l: 'Comprendre sa place dans un ensemble plus grand' },
  { v: 'beaute', l: 'Être saisi par la beauté de quelque chose' },
  { v: 'adulte', l: 'L’exemple d’un adulte qui aime ça' },
  { v: 'temps', l: 'Du temps libre dehors, sans programme' }
]

/** La voie que la littérature invalide — isolée ici pour le dépouillement. */
export const VOIE_INVALIDEE = 'noms'

/** Les quatre voies « sensibles » établies par l'étude de 2017. */
export const VOIES_ETABLIES = ['sensoriel', 'emotion', 'compassion', 'sens', 'beaute']

// Chaque condition se rattache à l'une des quatre hypothèses de rejet, ce qui
// donne une lecture fermée de la question ouverte qui la précède.
export const CONDITIONS: Opt[] = [
  { v: 'jamais', l: 'Aucune : je n’en vois pas l’intérêt' },
  { v: 'apres', l: 'Seulement après que l’enfant a observé par lui-même' },
  { v: 'court', l: 'Si le temps passé dessus reste très court' },
  { v: 'hors-ligne', l: 'S’il fonctionne sans connexion et sans compte' },
  { v: 'sans-donnees', l: 'Si aucune donnée sur l’enfant n’est collectée' },
  { v: 'sans-pub', l: 'S’il n’y a ni publicité, ni abonnement, ni boutique' },
  { v: 'accompagne', l: 'Seulement en présence d’un adulte' },
  { v: 'produire', l: 'S’il sert à noter et à fabriquer, plutôt qu’à consulter' },
  { v: 'reparable', l: 'S’il dure longtemps et se répare' },
  { v: 'autre', l: 'Autre' }
]

/** Rattachement d'une condition à l'hypothèse de rejet qu'elle exprime. */
export const CONDITION_HYPOTHESE: Record<string, string> = {
  apres: 'sensoriel',
  court: 'sensoriel',
  accompagne: 'institutionnel',
  'hors-ligne': 'pratique',
  reparable: 'pratique',
  'sans-donnees': 'economique',
  'sans-pub': 'economique',
  produire: 'economique'
}

// Décision n° 2026-911 DC du 14 août 2026 : le Conseil constitutionnel oppose à
// l'interdiction indifférenciée « l'appréciation particulière du risque » selon
// l'âge, la maturité et la situation. Les deux dernières réponses sont cette
// position ; les autres sont un seuil unique.
export const AGES_MINI: Opt[] = [
  { v: 'jamais', l: 'Jamais, à aucun âge' },
  { v: '15', l: 'Pas avant 15 ans' },
  { v: '12', l: 'Pas avant 12 ans' },
  { v: '10', l: 'Pas avant 10 ans' },
  { v: '8', l: 'Pas avant 8 ans' },
  { v: 'enfant', l: 'Cela dépend de l’enfant, pas de son âge' },
  { v: 'usage', l: 'Cela dépend de l’usage, pas de l’âge' }
]

/** Réponses qui refusent le seuil unique — le point de la décision 2026-911 DC. */
export const AGES_MINI_DIFFERENCIES = ['enfant', 'usage']

export const OBJECTIF_REPONSES_PUBLIC = 60
