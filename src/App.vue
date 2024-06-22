<template>
  <div id="app">
    <!-- Menu orizzontale visibile su tutte le pagine -->
    <HorizontalMenu />
    <!-- Router view per caricare le viste dinamicamente -->
    <router-view />
    <FooterBase />
  </div>
</template>

<script>
import HorizontalMenu from './components/HorizontalMenu.vue';
import FooterBase from "@/components/FooterBase.vue";

export default {
  name: 'App',
  components: {
    FooterBase,
    HorizontalMenu
  }
};
</script>

<style>
/* Stili globali per l'applicazione */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif; /* Famiglia di font */
  -webkit-font-smoothing: antialiased; /* Antialiasing per font su WebKit */
  -moz-osx-font-smoothing: grayscale; /* Antialiasing per font su Firefox */
  text-align: center; /* Allineamento del testo al centro */
  color: #2c3e50; /* Colore del testo */
  margin-top: 60px; /* Margine superiore */
  padding-bottom: 60px; /* Spazio inferiore per evitare che il contenuto venga sovrapposto al footer */
}


/* Stili per i link */
.link {
  color: #000; /* Colore del testo del link nero */
  text-decoration: none; /* Rimuove la sottolineatura del link */
  font-weight: bold; /* Grassetto per il link */
  transition: transform 0.2s, color 0.2s; /* Aggiunge una transizione per l'effetto di spostamento e cambiamento di colore */
}

.link:hover {
  transform: translateY(-2px); /* Sposta leggermente la scritta verso l'alto al passaggio del mouse */
  color: #007bff; /* Cambia il colore al passaggio del mouse */
}

.link:visited {
  color: #000; /* Assicura che il colore del link visitato sia nero */
}

.link:active {
  color: #007bff; /* Colore del link quando è attivo (cliccato) diventa blu */
}
</style>
