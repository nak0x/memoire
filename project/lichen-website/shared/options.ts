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
