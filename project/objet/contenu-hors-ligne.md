# Contenu hors ligne — la « profondeur sans plafond » est-elle réaliste ?

> Réponse courte : **oui, et largement.** C'est le seul point de la planche 07 où le
> sourçage a *renforcé* l'argument au lieu de l'affaiblir.

## Les chiffres réels

Relevés le **07/09/2026** sur le catalogue Kiwix (`[KIWIX]`), Wikipédia francophone,
édition de mai 2026 :

| Édition | Taille | Contenu |
|---|---|---|
| `wikipedia_fr_all_maxi` | **52 Go** | articles complets **avec images** |
| `wikipedia_fr_all_nopic` | **13 Go** | articles complets, **sans images** |
| `wikipedia_fr_all_mini` | **3,4 Go** | introductions + infobox |

Ordres de grandeur pour comparaison : une carte microSD de 128 Go coûte une quinzaine
d'euros ; une liseuse d'entrée de gamme embarque 8 à 32 Go.

## Ce que ça permet, concrètement

> **Wikipédia en français, sans images, tient sur 13 Go.** Un enfant avec une carte SD à
> 15 € porte dans sa poche l'intégralité d'une encyclopédie, consultable en forêt, sans
> réseau, sans compte, sans que personne ne sache ce qu'il a cherché.

C'est la **strate 06** de la profondeur à la demande — « la strate où l'objet cesse d'être
un jouet ». Et sur un écran e-ink monochrome, l'édition **sans images** n'est pas une
privation : les images de Wikipédia rendent mal en niveaux de gris de toute façon.

> La contrainte matérielle et le choix documentaire **convergent**, ce qui est rare et
> vaut d'être dit : le format le plus léger est aussi le mieux adapté à l'affichage.

## Le format ZIM et le principe « Durer »

ZIM est un **format ouvert**, documenté, avec plusieurs implémentations de lecteurs. Kiwix
est porté par une association.

**Ce que ça garantit et ce que ça ne garantit pas :**

| ✅ Garanti | ⚠️ Non garanti |
|---|---|
| Un fichier ZIM téléchargé aujourd'hui reste lisible si Kiwix disparaît | Que le catalogue continue d'être mis à jour |
| Aucun serveur n'est nécessaire à la lecture | Que les corpus restent produits |
| Le contenu appartient à l'enfant | Que Wikipédia reste sous licence libre |

> C'est exactement le critère C7 : **survit-il à son éditeur ?** Un ZIM oui, une
> application propriétaire non. C'est ce qui distingue Kiwix de Science Journal
> ([[famille-c-mesurer-fabriquer]]).

## Les vrais problèmes, qui ne sont pas techniques

### 1. Wikipédia n'est pas écrit pour un enfant de neuf ans

L'article « Lichen » de Wikipédia est écrit pour un lecteur adulte cultivé. La strate 06
est utile **parce qu'elle est illimitée**, pas parce qu'elle est adaptée.

> C'est assumé dans le design : les strates 01 à 05 sont rédigées pour l'enfant, la 06 est
> le moment où il bascule dans le texte des adultes. **Le passage à la strate 06 est en
> soi un événement pédagogique** — c'est le moment où l'objet cesse de protéger.
> À tester : est-ce vécu comme une promotion ou comme un mur ?

### 2. Wikispecies est inutilisable en l'état

Citée dans la note de cadrage. En pratique, Wikispecies est une base taxonomique
squelettique, sans texte, destinée aux spécialistes. **À retirer** ou à traiter comme
source de données taxonomiques, pas comme contenu lisible.

### 3. Il manque un corpus adapté, et personne ne le fournit

Ni Wikipédia, ni Wikispecies, ni les clés de détermination ne fournissent les strates 01
à 05. **Ce corpus est à écrire**, et c'est un travail éditorial considérable, sans rapport
avec le développement.

> C'est la vraie menace sur le périmètre (risque R3), plus que la technique. Décision à
> prendre à l'étape 3 : **un seul milieu, une seule saison, une vingtaine d'espèces
> traitées à fond**, plutôt qu'un catalogue superficiel. Mieux vaut vingt espèces avec
> cinq strates que deux cents avec une.

## À faire

- [ ] Vérifier la licence exacte des ZIM Wikipédia pour une redistribution embarquée
- [ ] Estimer le volume de rédaction pour 20 espèces × 5 strates
- [ ] Chercher un corpus naturaliste francophone libre déjà existant (INPN ? Tela Botanica ?)
- [ ] Retirer Wikispecies des rendus suivants
