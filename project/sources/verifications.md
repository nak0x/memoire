# Journal de vérification de la note de cadrage

> Passe de sourçage menée le **07/09/2026**, après le rendu de l'étape 1. Chaque
> affirmation chiffrée ou attribuée de [[note-de-cadrage]] a été confrontée à sa source
> primaire quand elle existe.
>
> **La note de cadrage n'a pas été corrigée.** Elle est rendue telle qu'elle a été
> écrite ; ce fichier est la liste de ce qui doit changer à l'étape 2. C'est aussi, en
> soi, une pièce à montrer au jury : le sourçage a produit des corrections, ce qui est
> le signe qu'il a réellement eu lieu.

## Récapitulatif

| # | Objet | Statut | Gravité |
|---|-------|--------|---------|
| V1 | Loi réseaux sociaux < 15 ans | ⛔ **Fait nouveau — censure constitutionnelle** | **Élevée** |
| V2 | Garmin eTrex : « IP67, MIL-STD-810, ~130 h » | ⚠️ **Trois erreurs** | Moyenne |
| V3 | « Le e-ink est incapable par nature d'afficher de la vidéo » | ⚠️ **Argument caduc** | **Élevée** |
| V4 | « Plus de 2 000 écoles » pratiquant la classe dehors | ❓ **Non sourcé** | Moyenne |
| V5 | Richardson 2017 : attribution de la paternité | ⚠️ Citation imprécise | Faible |
| V6 | IEF : taux de refus 11 % → 23 % | ✅ **Confirmé** (mais définition à préciser) | — |
| V7 | ADEME-Arcep : 79 % / 4-5ᵉ / ×3 | ✅ **Confirmé** (préciser le scénario) | — |
| V8 | Hors-contrat : 502 → 1 116 écoles | ✅ **Confirmé** | — |
| V9 | Loi Studer, loi AGEC | ✅ **Confirmé** | — |

---

## V1 — ⛔ La loi sur les réseaux sociaux a été censurée le 14 août 2026

**Ce que dit la note** (planche 03, tableau réglementaire) :
> « Réseaux < 15 ans — Restriction adoptée en juillet 2026, vérification d'âge
> généralisée. → La puissance publique choisit la voie restrictive. »

**Ce qui s'est passé.** La loi a bien été adoptée définitivement le **21 juillet 2026**
par l'Assemblée nationale. Mais le **Conseil constitutionnel a censuré son article 1er le
14 août 2026** (décision n° **2026-911 DC**), au double motif que :

1. l'interdiction, applicable indistinctement à tous les mineurs de moins de quinze ans,
   ne permet **aucune appréciation particulière du risque** selon l'âge, le degré de
   maturité et la situation familiale du mineur — atteinte disproportionnée à la liberté
   d'expression et de communication ;
2. le législateur **n'a pas suffisamment déterminé les conditions et limites** de la
   vérification d'âge, faisant peser une obligation sur des millions d'utilisateurs sans
   garantir la protection de leur vie privée.

Le Premier ministre a été chargé de préparer un nouveau texte.

**Pourquoi c'est important pour le projet — et pourquoi c'est plutôt une bonne nouvelle
argumentative.** La note utilisait cette loi pour dire : *la puissance publique choisit la
voie restrictive, donc l'espace pour un outil non social s'élargit.* L'argument survit,
mais il change de nature et devient **plus fort** :

> Ce n'est plus « l'État interdit, donc il reste de la place pour autre chose ». C'est
> « l'État a essayé d'interdire, et **le Conseil constitutionnel lui a répondu que
> l'interdiction indifférenciée est disproportionnée** parce qu'elle ignore l'âge, la
> maturité et la situation de chaque enfant ». C'est exactement la thèse de Tisseron
> contre celle de Desmurget (voir [[ecrans-et-enfance]]), et elle vient d'être écrite dans
> une décision du Conseil constitutionnel.

**À faire à l'étape 2.** Réécrire la ligne du tableau réglementaire, et déplacer cette
décision de la planche « contexte » vers la planche « tension centrale » : c'est un appui
juridique au parti pris du projet, pas un simple élément de décor.

**Sources.** `[CC-2026-911]` · `[LCP-2026]` · `[TLE-2026]`

---

## V2 — ⚠️ Garmin eTrex : trois erreurs dans la même ligne

**Ce que dit la note** (planche 06, famille D) :
> « IP67, MIL-STD-810, ~130 h sur deux piles AA, gamme née en 2000 et toujours
> commercialisée. »

**Ce que disent les spécifications constructeur (eTrex 22x / 32x)** :

| Affirmation | Réalité | Verdict |
|-------------|---------|---------|
| IP67 | **IPX7** — l'indice ne comporte pas de chiffre pour les poussières | ⚠️ Erreur |
| MIL-STD-810 | Non revendiqué sur la gamme eTrex (c'est la gamme GPSMAP / Montana) | ⚠️ Non fondé |
| ~130 h sur 2 AA | **25 h** sur deux piles AA | ⚠️ Erreur d'un facteur 5 |
| Gamme née en 2000 | **eTrex Yellow, décembre 1999** ; eTrex Summit en juin 2000 | ⚠️ Approximation |
| Toujours commercialisée | Vrai — 22x/32x sortis en juin 2019, toujours au catalogue | ✅ |

**Ce qui reste vrai, et c'est l'essentiel.** L'argument de la note ne portait pas sur les
chiffres mais sur la longévité de la *gamme* : une lignée de produits vendue en continu
depuis vingt-six ans, avec un format de piles standard remplaçables partout. Cela reste
l'étalon de longévité du projet. **Mais il faut retirer les chiffres faux** : un jury
qui vérifie une spécification trouvera l'erreur en trente secondes, et elle décrédibilise
tout le reste du benchmark.

**À faire.** Reformuler sans chiffres inventés : « IPX7, deux piles AA standard, 25 h
d'autonomie annoncées, gamme continue depuis décembre 1999. »

**Sources.** `[GARMIN-ETREX-SPEC]` · `[GPSTRAINING-HIST]`

---

## V3 — ⚠️ L'argument « le e-ink ne peut pas faire de vidéo » ne tient plus

**Ce que dit la note** (planche 07) :
> « Assez rapide pour montrer un mouvement […] et **trop lente pour la vidéo et le
> défilement infini**. La sobriété est garantie par la matière, pas par une règle. »

C'est **le pivot argumentatif de toute la planche 07** : la contrainte matérielle
remplace la règle morale. Or l'état de l'art de 2026 le contredit directement — voir
[[e-ink-etat-de-l-art]] pour le détail :

- Dasung **Paperlike 103** : moniteur e-ink **60 Hz**, la vidéo passe ;
- liseuses Dasung annoncées à **50 Hz** ;
- modes « fast refresh » poussés jusqu'à **80 fps** chez certains constructeurs (BigMe) ;
- Onyx Boox propose un **mode vidéo** explicite dans ses réglages d'affichage.

**Ce que ça casse, et comment le réparer.** Le e-ink de 2026 *peut* afficher de la vidéo.
La contrainte n'est donc plus dans la matière, elle est dans **le compromis** : monter en
fréquence dégrade le contraste, augmente le ghosting et fait s'effondrer l'autonomie. La
formulation défendable devient :

> Le e-ink ne rend pas la vidéo *impossible*, il la rend **coûteuse et laide**. Un
> appareil réglé pour tenir plusieurs semaines sur une charge, en niveaux de gris et sans
> rémanence, ne peut pas simultanément servir de lecteur vidéo. Le choix d'un budget
> d'autonomie *est* le choix de la sobriété.

C'est un déplacement réel : la sobriété redevient une **décision de conception assumée**
et non une fatalité physique. Moins confortable à défendre, mais vrai — et le jury a le
droit de me demander pourquoi je n'ai pas simplement acheté un Paperlike 103.

**À faire.** Réécrire l'argument avant l'étape 3. Fixer un budget chiffré (autonomie
cible, fréquence maximale) et en faire un critère d'acceptation du prototype, comme
« Différer ».

**Sources.** `[DASUNG-103]` · `[LILIPUTING-DASUNG]` · `[HACKADAY-EINK-60]`

---

## V4 — ❓ « Plus de 2 000 écoles » pratiquant la classe dehors : pas de source primaire

**Ce que dit la note** (planche 03) :
> « Plus de 2 000 écoles déclarent pratiquer la classe dehors en France (sur ~47 800). »

**Ce que j'ai trouvé.** Rien qui étaye ce chiffre au niveau national. Ce qui existe :

- **académie de Poitiers seule** : plus de 300 écoles engagées dans un projet « classe
  dehors », plus de 600 classes de la maternelle au collège, ~14 000 élèves ;
- **Rencontres internationales de Poitiers**, 31 mai – 4 juin 2023 : ~2 000 **participants**
  attendus (pas 2 000 écoles) ;
- **édition 2025** : plus de **1 800 écoles et établissements dans 25 pays** ayant
  participé aux temps forts — chiffre international, pas français.

**Hypothèse sur l'origine de l'erreur.** Le « 2 000 » de la note vient très probablement
d'une confusion entre les **2 000 participants** aux Rencontres de 2023 et un nombre
d'écoles. C'est le type d'erreur qui se propage : je l'ai écrite de mémoire.

**Statut.** Il n'existe **pas** de recensement national de la classe dehors — l'Éducation
nationale ne collecte pas cette information, et c'est en soi un fait intéressant pour le
mémoire (une pratique en expansion, invisible dans la statistique publique).

**À faire.** Soit remplacer par les chiffres de l'académie de Poitiers, correctement
attribués et présentés comme locaux, soit assumer explicitement l'absence de recensement
national. La seconde option est plus honnête et plus utile : elle justifie l'enquête de
terrain. Ne **jamais** réutiliser « 2 000 écoles ».

**Sources.** `[AC-POITIERS-2023]` · `[FRENE-RENCONTRES]`

---

## V5 — ⚠️ Richardson 2017 : la citation attribue mal la paternité

**Ce que dit la note** : « Richardson & le *Nature Connectedness Research Group* ».

**Référence exacte** : **Lumber R., Richardson M., Sheffield D.** (2017), « Beyond knowing
nature: Contact, emotion, compassion, meaning, and beauty are pathways to nature
connection », *PLoS ONE* 12(5): e0177186. Le **premier auteur est Ryan Lumber**.

Les cinq voies exactes sont **contact (sensoriel), émotion, compassion, sens/signification,
beauté** — la note traduit « contact » par « sens », ce qui est acceptable mais doit être
signalé comme une traduction et non comme le terme des auteurs.

**Précision de fond à ne pas perdre.** Le résultat n'est pas seulement « la connaissance
n'augmente pas la connexion » : les auteurs ont mené **une intervention de marche** dont
les activités opérationnalisaient les cinq voies, et elle augmentait significativement la
connexion à la nature *par rapport à une marche en nature seule*. Autrement dit, l'étude
ne dit pas « sortir dehors suffit » — elle dit que **la médiation compte, à condition
qu'elle ne soit pas de l'identification**. C'est beaucoup plus favorable au projet que ce
que la note en tire, qui n'en retient que la partie négative.

**À faire.** Corriger la citation, et exploiter le versant positif du résultat à l'étape 2.

**Sources.** `[LUMBER-2017]` (PDF local disponible)

---

## V6 — ✅ IEF : le taux de refus est confirmé, mais sa définition doit être donnée

Le chiffre « 11 % → 23 % » de la note est **exact**, et se lit dans le rapport de la Cour
des comptes, p. 41 :

> « en 2022-2023 (période transitoire), le taux de refus global était de 11 % (26 % pour
> les demandes de droit commun […] mais seulement 4 % pour les demandes de plein droit
> […]) tandis qu'en 2024-2025 (année de plein déploiement de la réforme), il a été de
> 23 % (taux cependant inférieur au taux de refus de droit commun de la période
> transitoire). »

**Piège à éviter.** Le rapport donne aussi 40 846 demandes pour 30 644 autorisations, d'où
l'on déduit naïvement 10 202 refus, soit **25 %**. Ce n'est pas le même indicateur : les
23 % sont le taux **après RAPO** (recours administratif préalable obligatoire), et le
dénominateur brut est gonflé par les dépôts multiples d'une même famille dans plusieurs
départements. Si le jury oppose 25 % à 23 %, la réponse est là.

**Nuance à ajouter.** La dernière incise du rapport dit que 23 % reste *inférieur* aux 26 %
de droit commun de la période transitoire. Présenter le durcissement comme un simple
doublement (11 → 23) est donc un raccourci : la comparaison honnête est 26 % → 23 % à
périmètre de droit commun constant. **Le durcissement réel tient à la bascule
déclaration → autorisation, pas à la sévérité de l'examen.** Le nombre d'enfants concernés
a chuté de **36 %** en un an, ce qui est le vrai chiffre du resserrement.

**Sources.** `[CCOMPTES-2025]` (PDF local, p. 41)

---

## V7 — ✅ ADEME-Arcep : confirmé, mais il faut nommer le scénario

| Affirmation de la note | Vérification |
|---|---|
| 79 % terminaux / 16 % centres de données / 5 % réseaux | ✅ exact (empreinte carbone 2020) |
| Fabrication ≈ 4/5 de l'empreinte des équipements | ✅ ~80 % |
| « ×3 sans action » d'ici 2050 | ✅ **mais** : c'est le scénario **tendanciel**, à **+187 %** (soit ×2,87) |

**À préciser.** Le rapport projette quatre scénarios contrastés à 2050 : *génération
frugale* **−45 %**, *coopérations territoriales* **+32 %**, *technologies vertes*
**+183 %**, *pari réparateur* **+372 %**, et un tendanciel à **+187 %**. Dire « ×3 sans
action » est correct mais imprécis : il faut nommer le scénario, sinon un jury informé
demandera lequel. Le scénario *pari réparateur* (+372 %) est d'ailleurs le plus
intéressant pour le projet, puisque c'est celui qui mise sur la technologie plutôt que sur
la sobriété — et qui échoue le plus.

**Sources.** `[ADEME-ARCEP-2023]` (PDF local)

---

## V8 & V9 — ✅ Confirmés sans réserve

- **Hors-contrat 1er degré : 502 écoles en 2015 → 1 116 en 2024** (DEPP). S'ajoutent :
  1 959 → 4 112 classes, part passée de 1 % à 2,4 %. Effectifs 13 100 (2010) → 83 000
  (2023). ✅
- **Loi Studer** : loi n° 2022-300 du 2 mars 2022, décret n° 2023-588 du 11 juillet 2023,
  obligations applicables au **13 juillet 2024**, contrôle par l'ANFR. ✅
- **Indice de durabilité** (loi AGEC du 10 février 2020) : téléviseurs depuis **janvier
  2025**, lave-linge depuis le **8 avril 2025**, échelle de 1 à 10, remplace
  progressivement l'indice de réparabilité. ✅

**Sources.** `[DEPP-HORS-CONTRAT]` · `[STUDER-2022]` · `[AGEC-DURABILITE]`

---

## Ce que cette passe m'apprend sur ma méthode

Les quatre écarts ont la **même cause** : j'ai écrit de mémoire des chiffres qui
« sonnaient justes » (130 heures, 2 000 écoles, IP67) au lieu d'ouvrir la fiche technique.
Aucun n'était une invention délibérée ; tous auraient été trouvés par un jury curieux.

Règle pour la suite, appliquée à partir de l'étape 2 : **aucun chiffre ne rentre dans un
rendu sans une ligne correspondante dans [[chiffres-cles]]**, avec l'URL et la date de
consultation. Les affirmations qualitatives peuvent attendre ; les chiffres, non.
