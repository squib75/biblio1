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
  background-color: #f6fa2a3a; /* Colore sfondo trasparente */
  font-family: Avenir, Helvetica, Arial, sans-serif; /* Famiglia di font */
  -webkit-font-smoothing: antialiased; /* Antialiasing per font su WebKit */
  -moz-osx-font-smoothing: grayscale; /* Antialiasing per font su Firefox */
  text-align: center; /* Allineamento del testo al centro */
  color: #2c3e50; /* Colore del testo */
  min-height: 100vh; /* Altezza minima per coprire l'intera vista */
  display: flex; /* Utilizzo del flexbox per centrare il contenuto */
  flex-direction: column; /* Disposizione del contenuto in colonna */
  margin-top: 20px;
  align-items: center; /* Centra orizzontalmente il contenuto */
  width: 100%; /* Occupa tutta la larghezza della pagina */

  padding: 0; /* Elimina padding */
  box-sizing: border-box; /* Include padding e bordo nella larghezza totale e altezza */
}

.logo {
  width: 10vw;
  height: auto;
  margin-top: 10px; /* Aggiungi un margine superiore per compensare il menu fisso */
}
</style>
