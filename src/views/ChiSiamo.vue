<template>
  <!-- Contenitore principale del componente -->
  <div class="chisiamo">
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
  name: 'ChiSiamo',
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
        const response = await axios.get('/chisiamo.json');
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
  max-width: 800px;
  margin: 0 auto;
  font-size: large;
  text-align: justify;
  line-height: 1.6; /* Aumenta l'interlinea */
  /* Aggiunge una barra di scorrimento verticale se il contenuto supera l'altezza massima */
  overflow-y: auto;
  /* Imposta un padding inferiore per evitare la sovrapposizione del footer */
  padding-bottom: 100px;
}
/* Stile per il messaggio di errore */
.error-message {
  font-size: xxx-large;
  color: red;
}
/* Stile per l'immagine del logo */
.logo {
  float: right;
  padding: 30px;
  width: 20%;
}
</style>

