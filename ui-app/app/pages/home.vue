<script setup lang="ts">
definePageMeta({
	layout: 'landing-layout'
});

</script>




<template>
  <section class="simple-page panel">
    <div class="simple-hero"><span class="material-symbols-rounded big-icon">home</span><div><p class="eyebrow">PIATTAFORMA INDIRE</p><h1>Benvenuto nella tua area docente</h1><p>Riprendi il percorso di riflessione sul disagio giovanile e trova rapidamente gli strumenti per accompagnare i tuoi studenti.</p></div></div>
    <div class="quick-grid"><NuxtLink to="/"><span class="material-symbols-rounded">forum</span><strong>Continua il dialogo</strong><small>Riprendi dalla situazione di Marco</small></NuxtLink><NuxtLink to="/risorse"><span class="material-symbols-rounded">folder_open</span><strong>Esplora le risorse</strong><small>Materiali consigliati per te</small></NuxtLink><NuxtLink to="/percorso-e-learning"><span class="material-symbols-rounded">school</span><strong>Vai al percorso e-learning</strong><small>Le tappe della formazione</small></NuxtLink></div>
    <div class="home-section"><h2>Il tuo percorso in sintesi</h2><div class="home-progress"><div><b>3</b><span>dimensioni esplorate</span></div><div><b>2</b><span>aspetti da approfondire</span></div><div><b>12</b><span>risorse correlate</span></div></div></div>
  </section>
</template>
