# E-ink — état de l'art 2026

> **Ce fichier contredit la planche 07 de [[note-de-cadrage]].** Voir [[verifications]] V3.
> C'est le point technique le plus important à trancher avant l'étape 3.

## Ce que la note de cadrage affirme

> « Dalle e-ink monochrome, rafraîchissement de l'ordre de **30 images/s** […] assez rapide
> pour montrer un mouvement — une croissance, un cycle, une coupe qui tourne — et **trop
> lente pour la vidéo et le défilement infini**. La sobriété est garantie par la matière,
> pas par une règle. »

C'est **le pivot argumentatif de toute la planche** : la contrainte matérielle remplace la
règle morale. Si la prémisse tombe, l'argument tombe.

## Ce que dit le marché en 2026

| Produit | Rafraîchissement | Source |
|---|---|---|
| Dasung **Paperlike 103** (moniteur) | **60 Hz** — « la vidéo passe » | `[DASUNG-103]` |
| Liseuses Dasung (nouvelle gamme) | **50 Hz** | `[LILIPUTING-DASUNG]` |
| Modes « fast refresh » (BigMe et autres) | jusqu'à **80 fps** annoncés | tests constructeurs |
| Onyx Boox (Mira et gamme) | **mode vidéo** explicite dans les réglages | documentation produit |
| Montage amateur documenté | moniteur e-ink 60 Hz | `[HACKADAY-EINK-60]` |

**La prémisse est fausse.** Le e-ink de 2026 affiche de la vidéo. La cible de 30 images/s
retenue par la note n'est pas une limite physique : c'est en dessous de ce qui se vend.

## Le compromis réel — ce qui remplace l'argument

Ce qui est vrai, en revanche, c'est que **la vitesse se paie**, et sur trois postes :

| Poste | Effet d'une montée en fréquence |
|---|---|
| **Contraste** | Les modes rapides réduisent le nombre de niveaux de gris ; l'image pâlit |
| **Rémanence (*ghosting*)** | L'image précédente reste visible ; il faut des rafraîchissements complets |
| **Autonomie** | L'e-ink ne consomme qu'au changement d'image. À 60 Hz, il change 60 fois par seconde : l'avantage énergétique disparaît |

> C'est le troisième point qui sauve le projet. **Un écran e-ink poussé en vidéo consomme
> comme un écran ordinaire.** L'autonomie de plusieurs semaines et la vidéo sont
> mutuellement exclusives — non parce que la dalle ne sait pas, mais parce que le budget
> énergétique ne le permet pas.

## Reformulation défendable

> Le e-ink ne rend pas la vidéo **impossible**, il la rend **coûteuse et laide**. Un
> appareil réglé pour tenir plusieurs semaines sur une charge, en niveaux de gris et sans
> rémanence, ne peut pas simultanément servir de lecteur vidéo. **Le choix d'un budget
> d'autonomie *est* le choix de la sobriété.**

Ce qui change, et il faut l'assumer : la sobriété redevient une **décision de conception**
et non une fatalité physique. Moins confortable à défendre — et le jury a le droit de
demander pourquoi je n'ai pas simplement acheté un Paperlike 103.

**La réponse à préparer :** parce qu'un objet dont la sobriété dépend d'un réglage qu'on
peut changer n'est pas sobre. Le projet doit donc **verrouiller** le budget, pas seulement
le choisir — et c'est un critère d'acceptation, au même titre que « Différer ».

## Budget à fixer avant l'étape 3

| Paramètre | Cible proposée | Justification |
|---|---|---|
| Autonomie en usage de terrain | **≥ 2 semaines** | Une sortie hebdomadaire sur un trimestre sans penser à recharger |
| Rafraîchissement maximal | **≤ 30 im/s**, et uniquement sur une animation déclenchée | Suffit pour un cycle ou une rotation ; insuffisant pour un usage vidéo confortable |
| Durée maximale d'une animation | **≤ 10 s** | Au-delà, on regarde un film |
| Mode par défaut | **Image fixe** | L'animation est une exception demandée, pas l'état normal |

> Ces quatre lignes forment le **verrou**. S'il est franchi, l'objet devient une tablette.

## Matériel candidat pour le prototype

Le prototype détourne un appareil existant ([[note-de-cadrage]] § 7.1). Critères de choix,
par ordre :

1. **Reconditionné disponible en volume** — l'argument de [[empreinte-numerique]] tombe
   sinon ;
2. **Système ouvert** (Android sur liseuse type Onyx Boox) — pour installer sans store ;
3. **Format** compatible avec une reliure de carnet ;
4. **Piles ou batterie remplaçable** — sinon C7 (longévité) tombe.

⚠️ Le critère 4 est le plus difficile : quasiment aucune liseuse n'a de batterie
remplaçable par l'utilisateur. **Contradiction non résolue entre le principe « Durer » et
le choix du matériel détourné.** À traiter frontalement à l'étape 3, pas à masquer.

## À faire

- [ ] Réécrire l'argument de la planche 07 dans le dossier de recherche (étape 2)
- [ ] Mesurer l'autonomie réelle d'une liseuse d'occasion en usage animé
- [ ] Trouver le prix d'une liseuse e-ink reconditionnée en volume (lacune de coût)
- [ ] Chercher si une liseuse à batterie remplaçable existe, même en kit
