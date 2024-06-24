<template>
  <!-- Contenitore principale del componente -->
  <div class="privacy">
    <!-- Mostra un messaggio di errore se c'è un errore -->
    <div v-if="error" class="error-message">
      <b>Errore caricamento testo</b>
    </div>
    <!-- Div che contiene il titolo e il testo caricati dinamicamente -->
    <div class="testo">
      <!-- Titolo caricato dinamicamente dal file JSON -->
      <h2>
        <span v-html="formatTitolo(testoJson.titolo)"></span>
        <!-- Immagine del logo -->
        <img class="logo" alt="Logo Biblioteca" src="../assets/logo.png" />
      </h2>
      <!-- Testo caricato dinamicamente dal file JSON -->
      <p v-for="(testo, index) in testoJson.testo" :key="index">
        {{ testo }}
      </p>
    </div>
  </div>
</template>

<script>
// Importa la libreria Axios per fare richieste HTTP
import axios from 'axios';

export default {
  // Nome del componente
  name: 'PrivacyApp',
  // Dati iniziali del componente
  data() {
    return {
      // Oggetto che conterrà il titolo e il testo caricati dal file JSON
      testoJson: { titolo: '', testo: [] },
      // Proprietà per tracciare se c'è un errore
      error: false,
    };
  },
  // Metodo chiamato quando il componente viene creato
  created() {
    // Chiama il metodo per caricare il testo dal file JSON
    this.caricaTesto();
  },
  methods: {
    // Metodo asincrono per caricare il testo dal file JSON
    async caricaTesto() {
      try {
        // Effettua una richiesta GET al file JSON
        const response = await axios.get('/privacy.json');
        // Assegna i dati ricevuti al componente
        this.testoJson = response.data;
        // Logga la risposta per debug
        console.log('Risposta Axios:', response);
      } catch (error) {
        // Gestisce eventuali errori e li mostra nella console
        console.error('Errore nel caricamento del testo:', error);
        // Imposta error a true quando si verifica un errore
        this.error = true;
      }
    },
    // Metodo per formattare il titolo con le interruzioni di riga
    formatTitolo(titolo) {
      return titolo.replace(/\n/g, '<br>');
    },
  },
};
</script>

<style scoped>
/* Stile per il div che contiene il testo, con larghezza massima e centramento */
.testo {
  /* Impostato un padding inferiore per evitare la sovrapposizione del footer */
  padding-bottom: 100px;
}

h2 {
  font-size: 1.2em;
  text-align: left;
}

/* Stile per l'immagine del logo */
.logo {
  float: right;
  padding: 30px;
  width: 15vw; /* Il logo sarà largo il 15% della larghezza della finestra */
  height: auto; /* Mantiene le proporzioni originali del logo */
}
</style>