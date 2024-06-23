<template>
  <div id="app">
    <!-- Contenitore principale per i componenti -->
    <div>
      <!-- Router view per gestire le route -->
      <router-view/>
      <!-- Immagine del logo della biblioteca -->
      <img class="logo" alt="Logo Biblioteca" src="../assets/logo.png" />
      <!-- Componente WelcomeHome per il messaggio di benvenuto -->
      <WelcomeHome msg="Piattaforma di Gestione Biblioteche Personali"/>
    </div>
  </div>
</template>

<script>
// Importazione dei componenti necessari per l'applicazione
import WelcomeHome from '../components/WelcomeHome.vue'


export default {
  name: 'App',
  // Registrazione dei componenti importati per l'utilizzo all'interno del template
  components: {
    WelcomeHome
  }
}
</script>

<style>
/* Stili globali per l'applicazione */
#app {
  padding-top: 20px;
}
.logo {
  width: 10vw;
  height: auto;
  margin-top: 15px; /* Aggiungi un margine superiore per compensare il menu fisso */
}
</style>
