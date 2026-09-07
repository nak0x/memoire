<script setup lang="ts">
useHead({ title: 'Mentions légales et licence' })
const { contactEmail, hostName, hostLocation } = useRuntimeConfig().public
</script>

<template>
  <div class="wrap">
    <h1>Mentions légales et licence</h1>

    <h2>Éditeur</h2>
    <p>
      Théo P. A. Lesage, personne physique, agissant à titre personnel et non professionnel
      dans le cadre d’un travail universitaire.<br />
      Contact : <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a><br />
      Directeur de la publication : Théo P. A. Lesage.
    </p>
    <p class="meta">
      Conformément à l’article 6 III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance
      dans l’économie numérique, l’éditeur non professionnel peut ne pas publier son adresse
      postale ; celle-ci est tenue à la disposition de l’hébergeur et de toute autorité
      judiciaire ou administrative en faisant la demande.
    </p>

    <h2>Hébergeur</h2>
    <p>{{ hostName }} — {{ hostLocation }}.</p>

    <h2>Données personnelles</h2>
    <p>
      Le traitement, sa finalité, sa durée et vos droits sont décrits sur la page
      <NuxtLink to="/donnees">Vos données</NuxtLink>.
    </p>

    <h2>Licence du contenu</h2>
    <p>
      Les textes de ce site et les résultats de la recherche sont diffusés sous licence
      <a href="https://creativecommons.org/licenses/by/4.0/deed.fr" rel="noopener">Creative
      Commons Attribution 4.0 International (CC BY 4.0)</a>, complétée par un addendum
      d’attribution :
    </p>
    <ul>
      <li>
        <strong>Reprise à l’identique</strong> — créditer « Auteur : Théo P. A. Lesage ».
      </li>
      <li>
        <strong>Œuvre dérivée</strong> — créditer « Inspiré du travail de Théo P. A. Lesage ».
        Mentionner l’auteur comme auteur, co-auteur, contributeur, relecteur ou superviseur
        d’une œuvre dérivée est expressément interdit sans accord écrit préalable : cette
        distinction signale que l’œuvre dérivée n’a été ni relue ni approuvée.
      </li>
    </ul>
    <p class="meta">
      Le droit moral de l’auteur, notamment le droit à la paternité et au respect de l’œuvre
      (article L.121-1 du Code de la propriété intellectuelle), demeure inaliénable et n’est
      pas cédé par la présente licence.
    </p>

    <h2>Licence du code</h2>
    <p>
      Le code source de cette application est diffusé sous licence
      <strong>MIT</strong> : usage, modification et redistribution libres, à condition de
      conserver la mention de copyright et l’avis de licence. Le logiciel est fourni « tel
      quel », sans garantie d’aucune sorte.
    </p>
    <p class="mono">Copyright © 2026 Théo P. A. Lesage</p>

    <h2>Bibliothèques tierces</h2>
    <p>
      L’interface de dépouillement utilise <a href="https://www.chartjs.org/" rel="noopener">Chart.js</a>
      (licence MIT). L’application est construite avec <a href="https://nuxt.com" rel="noopener">Nuxt</a>
      et <a href="https://vuejs.org" rel="noopener">Vue</a> (licence MIT). Aucune de ces
      bibliothèques n’est chargée depuis un service tiers : tout est servi par le site lui-même.
    </p>

    <h2>Accessibilité et sobriété</h2>
    <p>
      Le site est conçu pour rester lisible sans script sur les pages d’information, sans police
      distante, sans image de décor et sans vidéo. La page du questionnaire pèse quelques
      dizaines de kilo-octets, s’affiche selon votre préférence de thème clair ou sombre, et ne
      déclenche aucune requête vers un domaine tiers. Un défaut d’accessibilité constaté peut
      être signalé à <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
    </p>
  </div>
</template>
