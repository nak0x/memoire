<script setup lang="ts">
const annee = new Date().getFullYear()
const { retentionMonths } = useRuntimeConfig().public
</script>

<template>
  <div>
    <header class="top">
      <div class="wrap top-in">
        <NuxtLink to="/" class="brand">Enquête <span>· pédagogies du dehors</span></NuxtLink>
        <nav>
          <NuxtLink to="/">Questionnaire</NuxtLink>
          <NuxtLink to="/a-propos">À propos</NuxtLink>
          <NuxtLink to="/donnees">Vos données</NuxtLink>
        </nav>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="foot">
      <div class="wrap">
        <nav>
          <NuxtLink to="/a-propos">À propos</NuxtLink>
          <NuxtLink to="/donnees">Données personnelles</NuxtLink>
          <NuxtLink to="/cgu">Conditions d’utilisation</NuxtLink>
          <NuxtLink to="/mentions-legales">Mentions légales et licence</NuxtLink>
        </nav>
        <p>
          Enquête universitaire · Données hébergées dans l’Union européenne ·
          Conservation limitée à {{ retentionMonths }} mois · Aucun traceur, aucun cookie.
        </p>
        <p>© {{ annee }} Théo P. A. Lesage · Contenu sous licence CC BY 4.0.</p>
      </div>
    </footer>
  </div>
</template>
