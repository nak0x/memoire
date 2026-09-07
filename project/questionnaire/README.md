# Questionnaire de terrain — LICHEN

Application du questionnaire décrit dans [`../terrain/questionnaire.md`](../terrain/questionnaire.md),
avec son interface de dépouillement.

> **Contrainte de fond, à ne pas contourner :** le questionnaire ne présente aucun objet et
> ne demande à personne si une idée lui plaît. Il mesure l'état d'un terrain, pas l'accueil
> d'un projet. Toute évolution qui décrit le prototype dans les pages publiques invalide les
> réponses déjà collectées.

## Ce que c'est

| | |
|---|---|
| Cadre | Nuxt 4 (Vue 3, Nitro), rendu serveur, pas de framework CSS |
| Base | SQLite via `node:sqlite` — module natif de Node, zéro dépendance |
| Graphiques | Chart.js, chargé **uniquement** sur `/results` |
| Poids public | pas de police distante, pas d'image, pas de traceur, aucune requête tierce |
| Thème | clair ou sombre selon `prefers-color-scheme`, sans script |

## Pages

| Route | Contenu |
|---|---|
| `/` | Présentation courte et questionnaire complet (parties A à E) |
| `/a-propos` | Ce que cherche la recherche, et ce que le questionnaire n'est pas |
| `/donnees` | Traitement, hébergement UE, conservation 6 mois, droits RGPD |
| `/cgu` | Conditions d'utilisation |
| `/mentions-legales` | Éditeur, hébergeur, licences (CC BY 4.0 pour le contenu, MIT pour le code) |
| `/results` | 🔒 Tableau de bord — **non listé, non indexé, protégé par mot de passe** |
| `/results/<id>` | 🔒 Une réponse, avec le codage de la Q9 et les notes de dépouillement |

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

Chaque exécution est consignée dans la table `purge_log` (date, date de coupure, nombre de
suppressions) et affichée sur `/results`. Le bouton « Exécuter la purge maintenant » permet
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
| `POST` | `/api/reponse` | public — validation, piège à robots, limitation en mémoire |
| `GET` | `/api/health` | public — sonde du conteneur |
| `GET` | `/api/admin/stats` | 🔒 agrégats du tableau de bord |
| `GET` | `/api/admin/reponses` | 🔒 liste compacte |
| `GET` `PATCH` `DELETE` | `/api/admin/reponses/<id>` | 🔒 détail, codage, effacement |
| `GET` | `/api/admin/export` | 🔒 export CSV (contient les contacts) |
| `POST` | `/api/admin/purge` | 🔒 purge manuelle |

## Structure

```
shared/options.ts          libellés du questionnaire — source unique
app/pages/index.vue        le questionnaire
app/pages/results/         dépouillement (layout admin)
server/utils/db.ts         SQLite, schéma, purge de rétention
server/utils/validate.ts   validation serveur (Q9 obligatoire si Q8 ≥ 4)
server/middleware/admin.ts authentification Basic sur /results et /api/admin
server/tasks/db/purge.ts   tâche planifiée quotidienne
```

## Licence

Code : MIT (voir `LICENSE`). Contenu et résultats : CC BY 4.0 avec l'addendum d'attribution
à la racine du dépôt.
