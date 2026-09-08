# Questionnaires de terrain — LICHEN

Application des deux questionnaires du projet, avec leur interface de dépouillement :

- [`../terrain/questionnaire.md`](../terrain/questionnaire.md) — professionnels du dehors, sur `/`
- [`../terrain/questionnaire-public.md`](../terrain/questionnaire-public.md) — adultes avec ou sans enfant, sur `/dehors`

> **Contrainte de fond, à ne pas contourner :** aucun des deux questionnaires ne présente
> d'objet, et aucun ne demande à personne si une idée lui plaît. Ils mesurent l'état d'un
> terrain, pas l'accueil d'un projet. Toute évolution qui décrit le prototype dans les pages
> publiques invalide les réponses déjà collectées — celles des deux questionnaires à la
> fois, puisqu'ils partagent le même site.

## Ce que c'est

| | |
|---|---|
| Cadre | Nuxt 4 (Vue 3, Nitro), rendu serveur, pas de framework CSS |
| Base | SQLite via `node:sqlite` — module natif de Node, zéro dépendance |
| Graphiques | Chart.js, chargé **uniquement** sur les pages `/results` |
| Animation | GSAP, chargé **uniquement** sur `/lichen` — les questionnaires n'ont aucun script d'agrément |
| Poids public | pas de police distante, pas d'image, pas de traceur, aucune requête tierce |
| Thème | clair ou sombre selon `prefers-color-scheme`, sans script |

## Pages

| Route | Contenu |
|---|---|
| `/` | Questionnaire **professionnels** — présentation courte et parties A à E |
| `/dehors` | Questionnaire **grand public** — adultes avec ou sans enfant |
| `/lichen` | Page de présentation du projet — **sans objet**, comme le reste du site |
| `/projet` | Description du projet de recherche — **sans objet**, comme le reste du site |
| `/entretiens` | Recrutement d'entretiens (professionnels et écoles), d'après `../terrain/protocole-entretien.md` |
| `/a-propos` | Ce que cherche la recherche, et ce que le questionnaire n'est pas |
| `/donnees` | Traitement, hébergement UE, conservation 6 mois, droits RGPD |
| `/cgu` | Conditions d'utilisation |
| `/mentions-legales` | Éditeur, hébergeur, licences (CC BY 4.0 pour le contenu, MIT pour le code) |
| `/results` | 🔒 Tableau de bord des réponses professionnelles — **non listé, non indexé, protégé par mot de passe** |
| `/results/<id>` | 🔒 Une réponse, avec le codage de la Q9 et les notes de dépouillement |
| `/results/public` | 🔒 Tableau de bord des réponses du grand public |
| `/results/public/<id>` | 🔒 Une réponse du grand public, avec son codage |

`/results` n'apparaît nulle part : aucun lien dans les pages publiques, aucune entrée dans
`sitemap.xml`, et **volontairement aucune ligne dans `robots.txt`** — un `Disallow: /results`
publierait justement l'adresse qu'on veut garder discrète. La protection réelle est
l'authentification, doublée d'un en-tête `X-Robots-Tag: noindex, nofollow, noarchive`.

## Variables d'environnement

| Variable | Rôle | Défaut |
|---|---|---|
| `ADMIN_LOGIN` | Identifiant de `/results` (**obligatoire**) | — |
| `ADMIN_PASS` | Mot de passe de `/results` (**obligatoire**) | — |
| `DB_PATH` | Fichier SQLite, à placer dans un volume | `/app/data/questionnaire.db` |
| `RETENTION_MONTHS` | Durée de conservation | `6` |
| `NUXT_PUBLIC_CONTACT_EMAIL` | Adresse affichée dans les pages légales | `pro.theolesage@gmail.com` |
| `NUXT_PUBLIC_SITE_URL` | URL canonique (robots.txt, sitemap) | déduite de la requête |
| `NUXT_PUBLIC_HOST_NAME` | Nom de l'hébergeur, pour les mentions légales | générique |
| `NUXT_PUBLIC_HOST_LOCATION` | Localisation de l'hébergeur | `Union européenne` |

Sans `ADMIN_LOGIN`/`ADMIN_PASS`, `/results` et `/api/admin/*` répondent `503` : l'absence de
configuration ne peut pas ouvrir l'administration par accident.

## Conservation des données — six mois, appliqués

La suppression n'est pas une promesse écrite dans une page légale, c'est du code, déclenché
par trois voies indépendantes :

1. **Au démarrage** du serveur (`server/plugins/init.ts`) ;
2. **Chaque nuit à 03h17 UTC**, tâche planifiée Nitro `db:purge` (`nitro.scheduledTasks`
   dans `nuxt.config.ts`) — elle tourne dans le processus applicatif, sans `cron` dans
   l'image ;
3. **En garde-fou**, au plus une fois par heure, au fil des envois.

La purge porte sur **les deux tables de réponses** : ajouter une table sans l'ajouter à
`purgeOldResponses()` romprait l'engagement pris auprès des répondants sans que rien ne le
signale. Chaque exécution est consignée dans la table `purge_log` (date, date de coupure,
nombre total de suppressions) et affichée sur `/results`. Le bouton « Exécuter la purge maintenant » permet
de la déclencher à la main.

## Développement

Node 24 recommandé — `node:sqlite` est intégré au binaire et n'exige aucun drapeau à
partir de Node 23.4. Sur Node 22.5 à 23.3, lancer avec `--experimental-sqlite`.

```sh
npm install
ADMIN_LOGIN=admin ADMIN_PASS=admin npm run dev
```

La base est créée automatiquement dans `./data/questionnaire.db`.

## Déploiement sur Coolify

1. **Nouvelle ressource → Application → Dockerfile**, dépôt Git, chemin de base
   `project/questionnaire`.
2. **Port exposé :** `3000`.
3. **Volume persistant :** monter un volume sur `/app/data`.
   Sans lui, la base est perdue à chaque redéploiement.
4. **Variables d'environnement :** au minimum `ADMIN_LOGIN` et `ADMIN_PASS`, plus
   `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_HOST_NAME` et `NUXT_PUBLIC_HOST_LOCATION` pour que
   les mentions légales décrivent l'hébergement réel.
5. **Choisir un serveur situé dans l'Union européenne** — c'est écrit dans les pages
   publiques, cela doit être vrai.
6. Activer HTTPS. L'authentification `Basic` transmet le mot de passe en clair : sans TLS,
   l'administration n'est pas protégée.

Sauvegarde : le seul état à sauvegarder est `/app/data/questionnaire.db` (plus les fichiers
`-wal` et `-shm`). Une copie de ce fichier suffit à restaurer l'enquête — et une sauvegarde
conservée au-delà de six mois annulerait l'engagement pris auprès des répondants : la purge
doit être appliquée aux archives aussi.

## API

| Méthode | Route | Accès |
|---|---|---|
| `POST` | `/api/reponse` | public — questionnaire professionnel |
| `POST` | `/api/reponse-publique` | public — questionnaire grand public |
| `GET` | `/api/health` | public — sonde du conteneur |
| `GET` | `/api/admin/stats` | 🔒 agrégats du tableau de bord |
| `GET` | `/api/admin/reponses` | 🔒 liste compacte |
| `GET` `PATCH` `DELETE` | `/api/admin/reponses/<id>` | 🔒 détail, codage, effacement |
| `GET` | `/api/admin/export` | 🔒 export CSV (contient les contacts) |
| `GET` | `/api/admin/public/stats` | 🔒 agrégats du questionnaire grand public |
| `GET` | `/api/admin/public/reponses` | 🔒 liste compacte |
| `GET` `PATCH` `DELETE` | `/api/admin/public/reponses/<id>` | 🔒 détail, codage, effacement |
| `GET` | `/api/admin/public/export` | 🔒 export CSV du grand public |
| `POST` | `/api/admin/purge` | 🔒 purge manuelle — **les deux tables à la fois** |

## Structure

```
shared/options.ts             libellés des deux questionnaires — source unique
app/pages/index.vue           questionnaire professionnels
app/pages/dehors.vue          questionnaire grand public
app/pages/lichen.vue          présentation du projet (seule page à charger GSAP)
app/components/FondLichen.vue fond animé, dessiné à l'exécution — aucune image
app/pages/results/            dépouillement professionnels (layout admin)
app/pages/results/public/     dépouillement grand public
server/utils/db.ts            SQLite, schéma des deux tables, purge de rétention
server/utils/validate.ts      validation du questionnaire professionnel
server/utils/validate-public.ts  validation du questionnaire grand public
server/utils/rate.ts          limitation de débit, commune aux deux formulaires
server/middleware/admin.ts    authentification Basic sur /results et /api/admin
server/tasks/db/purge.ts      tâche planifiée quotidienne
```

Les deux questionnaires **partagent volontairement** l'échelle 1-5, la liste
d'applications et la grille de codage (`ECHELLE`, `APPS`, `CODES` dans `shared/options.ts`).
C'est ce qui rend les deux corpus comparables sur les seuls points construits pour l'être ;
les faire diverger annulerait l'intérêt du second questionnaire.

## Licence

Code : MIT (voir `LICENSE`). Contenu et résultats : CC BY 4.0 avec l'addendum d'attribution
à la racine du dépôt.
