# Cadre juridique

> Quatre textes structurent l'espace du projet. Aucun ne l'interdit ; deux le contraignent,
> un lui fournit un vocabulaire, et le quatrième — depuis le 14 août 2026 — lui fournit
> un **argument**.

## 1. RGPD article 8 — le consentement des mineurs `[RGPD-8]`

Le règlement fixe à 16 ans le seuil au-dessus duquel un mineur peut consentir seul au
traitement de ses données pour les services de la société de l'information, en laissant
aux États la faculté de descendre jusqu'à 13 ans. **La France a retenu 15 ans**
(loi Informatique et Libertés, art. 45). En dessous, le consentement doit être recueilli
conjointement avec le titulaire de l'autorité parentale.

**Conséquence pour LICHEN.** La cible du projet (8-14 ans) est **intégralement** en dessous
du seuil. Toute collecte impliquerait un dispositif de recueil du consentement parental —
lourd, coûteux, et contradictoire avec le principe « l'objet appartient à l'enfant ».

> D'où la décision de conception : **pas de collecte du tout**. Le RGPD ne s'applique
> pas à des données qui ne quittent jamais l'appareil et ne sont jamais traitées par un
> responsable de traitement. Ce n'est pas une mise en conformité, c'est une sortie du
> champ. C'est le seul design qui rend le projet tenable pour un étudiant seul.

⚠️ **Réserve à ne pas escamoter.** Dès qu'une observation est remontée vers une plateforme
de sciences participatives (l'option « Serveur » de la note), le projet **rentre** dans le
champ. Cette fonction est donc optionnelle, désactivée par défaut, et devra faire l'objet
d'une analyse d'impact à l'étape 4.

## 2. Loi Studer — le contrôle parental obligatoire `[STUDER-2022]`

- **Loi n° 2022-300 du 2 mars 2022**, portée par le député Bruno Studer ;
- **décret n° 2023-588 du 11 juillet 2023** ;
- obligations applicables au **13 juillet 2024**.

Tout appareil neuf permettant la navigation sur internet et vendu en France doit intégrer
un dispositif de contrôle parental, dont l'activation est proposée **gratuitement dès la
première mise en service**, sans abonnement ni option payante. Contrôle assuré par
l'**ANFR**, qui peut mettre en demeure, ordonner le retrait ou le rappel des produits, et
prononcer des amendes administratives (1 500 € personne physique, 7 500 € personne morale,
jusqu'à 15 000 € en récidive).

**Conséquence pour LICHEN — à trancher.** Un objet dédié à l'enfant, permettant la
navigation, vendu neuf en France, **entre dans le champ**. Trois issues :

1. l'objet ne permet **aucune navigation** (contenu embarqué uniquement) → hors champ,
   et c'est cohérent avec « pas de réseau » ;
2. l'objet est **reconditionné** et non neuf → la lecture du texte vise les appareils neufs
   mis sur le marché, mais le point mérite d'être vérifié juridiquement ;
3. l'objet est neuf et navigable → obligation à assumer.

> L'option 1 est celle du projet, et elle est confortée par le fait que le contrôle
> parental est **sans objet** sur un appareil qui n'accède à rien. À écrire noir sur blanc
> à l'étape 4 : *le meilleur contrôle parental est l'absence de ce qu'il faudrait
> contrôler.*

## 3. Loi AGEC → indice de durabilité `[AGEC-DURABILITE]`

Loi anti-gaspillage pour une économie circulaire du **10 février 2020**. L'**indice de
durabilité**, noté de **1 à 10** et affiché à côté du prix, remplace progressivement
l'indice de réparabilité :

- **téléviseurs** : depuis **janvier 2025** ;
- **lave-linge** : depuis le **8 avril 2025** ;
- extension prévue à d'autres catégories.

Il agrège la **réparabilité** (disponibilité des pièces, prix, démontabilité,
documentation) et l'**aptitude à durer** (fiabilité, robustesse, possibilité de mise à
jour et d'amélioration).

**Conséquence pour LICHEN.** Le projet n'est pas assujetti — un carnet relié autour d'une
liseuse reconditionnée n'est dans aucune des catégories visées. Mais l'indice fournit
quelque chose de plus utile qu'une obligation : **un référentiel public, opposable, et
compris du jury**, pour dire ce que « durable » veut dire. L'enjeu E4 doit être évalué
avec les critères de l'indice, en le revendiquant explicitement.

## 4. Réseaux sociaux et moins de 15 ans — la loi censurée `[CC-2026-911]`

**Chronologie.**

| Date | Événement |
|---|---|
| 21 juillet 2026 | Adoption définitive par l'Assemblée nationale |
| — | Entrée en vigueur prévue au 1er septembre 2026 (nouveaux comptes), 1er janvier 2027 (comptes existants) |
| **14 août 2026** | **Censure de l'article 1er par le Conseil constitutionnel, décision n° 2026-911 DC** |
| Depuis | Un nouveau texte, plus « robuste », a été demandé au Premier ministre |

**Les deux motifs de censure**, et pourquoi ils comptent pour ce projet :

1. **L'indifférenciation.** L'interdiction, applicable à tous les mineurs de moins de
   quinze ans, « ne permet aucune appréciation particulière du risque pour le mineur,
   compte tenu notamment de son âge, de son degré de maturité et de sa situation
   familiale ». Atteinte disproportionnée à la liberté d'expression et de communication.

2. **L'imprécision de la vérification d'âge.** Le législateur n'a pas suffisamment
   déterminé les conditions et limites dans lesquelles les utilisateurs devraient prouver
   leur âge : une obligation pesant sur des millions de personnes, sans que la loi offre
   elle-même les garanties nécessaires à la protection de leur vie privée.

> **C'est l'argument juridique le plus fort dont dispose le projet, et il est arrivé après
> la rédaction de la note de cadrage.**
>
> Le premier motif est, en droit constitutionnel, exactement la thèse de Tisseron contre
> celle de Desmurget : on ne peut pas traiter « les moins de 15 ans » comme un bloc
> indifférencié, il faut regarder l'âge, la maturité et la situation. Le second dit que la
> protection des mineurs ne peut pas se payer d'une surveillance généralisée — ce qui est
> le fondement du choix « sans compte, sans collecte ».
>
> LICHEN n'est pas un réseau social et n'est pas concerné. Mais il peut se réclamer de
> cette décision : **un dispositif différencié, sans collecte et sans identification est
> précisément ce que le Conseil constitutionnel oppose à l'interdiction indifférenciée.**

**Contexte européen à suivre.** Sept États pionniers (Chypre, Danemark, France, Grèce,
Irlande, Italie, Espagne) travaillent avec la Commission sur une application européenne de
vérification d'âge, annoncée pour fin 2026. Si elle aboutit, le motif n° 2 tombe et un
nouveau texte devient possible. **À revérifier avant la soutenance du 03/12.**

## Veille à tenir jusqu'à la soutenance

| À surveiller | Pourquoi | Échéance |
|---|---|---|
| Nouveau texte « réseaux sociaux < 15 ans » | Change la planche 03 | Automne 2026 |
| Application européenne de vérification d'âge | Lève le motif n° 2 de la censure | Fin 2026 |
| Extension de l'indice de durabilité | Renforcerait le référentiel E4 | 2026-2027 |
