# La reliure, la loupe, l'herbier — les quatre cinquièmes non numériques

> Dans l'objet décrit planche 07, **l'écran est un élément sur cinq**. Les quatre autres ne
> consomment rien, ne s'éteignent jamais et ne peuvent pas tomber en panne. Ce fichier
> documente ce que je sais — et ce que je ne sais pas encore — de cette partie-là.
>
> ⚠️ **C'est le dossier le plus faible du projet.** Je suis développeur ; je n'ai aucune
> compétence en reliure, et aucune source. Tout ce qui suit est à valider auprès d'un
> artisan.

## La reliure

**Intention.** Cuir pleine fleur, cousue, format carnet, fermeture par lien.

**Ce que ça apporte, par ordre d'importance :**

1. **Ça se patine au lieu de s'abîmer.** Une coque plastique rayée est cassée ; un cuir
   rayé est vécu. C'est la seule matière courante qui s'améliore en vieillissant — et le
   principe « l'objet doit vieillir visiblement » n'a pas d'autre support crédible.
2. **Ça amortit.** Une chute sur un chemin est la condition nominale, pas l'accident.
3. **Ça se répare chez un relieur**, pas dans un centre agréé. La réparabilité sort du
   circuit industriel, ce qui est cohérent avec `[AGEC-DURABILITE]` sans en dépendre.
4. **Ça ne ressemble pas à un appareil.** Argument d'acceptation auprès de U3 et U4,
   probablement le plus fort du projet — et le plus facile à mal utiliser : si l'objet
   *cache* qu'il est numérique, c'est un mensonge, pas un design.

**Questions ouvertes, toutes sans réponse à ce jour :**

- Coût réel d'une reliure cuir en petite série ? *(la lacune de coût, cf. [[bibliographie]])*
- Le cuir est-il défendable écologiquement ? **Question sérieuse** : tannage, élevage.
  Alternatives à étudier — cuir de récupération, tannage végétal, textile ciré.
  ⚠️ Un projet dont l'argument central est environnemental ne peut pas choisir une matière
  sans en connaître l'impact. **À traiter avant l'étape 3, c'est une faille exploitable.**
- Comment loger une dalle rigide dans une reliure souple sans la casser ?
- Étanchéité : le cuir n'est pas imperméable. Comment protéger l'électronique ?

## La loupe

**Intention.** Loupe de botaniste, logée dans la couverture.

**Ce que ça apporte.** C'est **le seul instrument qui augmente réellement l'œil** — zéro
batterie, durée de vie illimitée, aucune médiation. Un grossissement ×10 fait apparaître
des structures qu'aucun écran ne montrera avec la même évidence, parce que c'est le
spécimen réel qu'on regarde, pas son image.

> C'est aussi la réponse la plus directe à `[LUMBER-2017]` : la loupe est un dispositif de
> **contact sensoriel** pur. Elle ne nomme rien, ne classe rien, n'explique rien — elle
> rapproche. Si une seule pièce de l'objet devait survivre à un arbitrage de périmètre,
> ce serait celle-là.

**Questions ouvertes :** grossissement (×10 est le standard botanique) ; loupe de poche
pliante ou lentille sertie dans la couverture ; risque de rayure ; risque de perte.

## Le bloc-notes

**Intention.** Papier et crayon, glissés dans la reliure.

**Ce que ça apporte.** Le premier geste reste manuel : **décrire et dessiner avant de
chercher**. C'est le support matériel du principe « Différer » — et il vaut mieux qu'une
contrainte logicielle, parce qu'il ne peut pas être contourné par un appui long.

**À intégrer :** le *nature journaling* est une pédagogie constituée (`[LAWS]`), avec ses
protocoles — « I notice, I wonder, It reminds me of ». Le projet ne doit pas la
réinventer : il doit **l'outiller**. Voir [[famille-d-tangible-durable]].

**Question ouverte :** crayon ou stylo ? Le crayon marche mouillé et sous zéro, ne coule
pas, s'efface. C'est probablement la seule réponse.

## L'herbier

**Intention.** Feuillets buvards et pochettes en fin de carnet.

**Ce que ça apporte.** Ce qui a été ramassé **reste dans l'objet**. La collection est
physique ; l'écran ne fait que l'annoter. C'est ce qui donne à l'objet son épaisseur au
sens propre : un carnet qui a servi ne ferme plus.

> C'est le seul élément qui rende la **durée visible**. Un fichier ne s'épaissit pas.

**Questions ouvertes, dont une sérieuse :**

- ⚠️ **Éthique et droit de la cueillette.** Faire ramasser des plantes à des enfants, dans
  des espaces parfois protégés, n'est pas neutre. Le code de l'environnement et les
  arrêtés de protection s'appliquent. **Il faut une règle explicite dans l'objet**
  (jamais d'espèce protégée, jamais en espace protégé, une feuille et pas la plante).
  À croiser avec l'enjeu E6, où seule la protection des données était traitée.
- Conservation : une plante mal séchée moisit et abîme le carnet.
- Alternative à étudier : herbier de **traces** (empreintes, frottis, calques) plutôt que
  de prélèvements. Plus défendable écologiquement, et compatible avec la voie
  « compassion » de `[LUMBER-2017]` — on ne cueille pas ce dont on se soucie.

## Récapitulatif — ce qui reste à établir

| Sujet | Statut | Échéance |
|---|---|---|
| Impact environnemental du cuir | ❓ **rien** — faille exploitable par le jury | Étape 3 |
| Coût d'une reliure en petite série | ❓ rien | Étape 3 |
| Règle de cueillette / espèces protégées | ❓ rien | Étape 3 |
| Intégration mécanique dalle ↔ reliure | ❓ rien | Étape 4 |
| Protocole *nature journaling* à outiller | 🟢 source identifiée (`[LAWS]`) | Étape 2 |

> **À faire en priorité :** trouver un relieur ou un maroquinier acceptant une heure
> d'entretien. C'est le seul métier du projet dont je ne connais rien, et c'est celui qui
> porte quatre éléments sur cinq.
