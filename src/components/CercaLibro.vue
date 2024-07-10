<template>
  <div class="cerca-libro">
    <div class="form-group">
      <label>ISBN:</label>
      <input type="text" v-model="isbn" placeholder="Inserisci ISBN" />
      <button @click="caricaDaISBN">Carica</button>
    </div>
    <div class="form-group">
      <label>Titolo:</label>
      <input type="text" v-model="titolo" placeholder="Inserisci titolo" required />
    </div>
    <div class="form-group">
      <label>Autore:</label>
      <input type="text" v-model="autore" placeholder="Inserisci autore" required />
    </div>
    <div class="form-group">
      <label>Anno di Pubblicazione:</label>
      <input type="text" v-model="annoPubblicazione" placeholder="Inserisci anno di pubblicazione" />
    </div>
    <div class="form-group">
      <label>Genere:</label>
      <input type="text" v-model="genere" placeholder="Inserisci genere" />
    </div>
    <div class="form-group">
      <label>Descrizione:</label>
      <textarea v-model="descrizione" placeholder="Inserisci descrizione"></textarea>
    </div>
    <div class="form-group button-group">
      <button @click="aggiungiLibro">Aggiungi Libro</button>
    </div>
    <div v-if="message" :class="{ 'success-message': messageType === 'success', 'error-message': messageType === 'error' }">
      {{ message }}
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'CercaLibro',
  data() {
    return {
      isbn: '',
      titolo: '',
      autore: '',
      annoPubblicazione: '',
      genere: '',
      descrizione: '',
      message: '',
      messageType: '',
      nickname: ''
    };
  },
  methods: {
    isValidISBN(isbn) {
      return /^(\d{10}|\d{13})$/.test(isbn);
    },
    async caricaDaISBN() {
      if (!this.isValidISBN(this.isbn)) {
        this.message = 'Formato ISBN non valido. Deve essere ISBN-10 (10 cifre) o ISBN-13 (13 cifre).';
        this.messageType = 'error';
        return;
      }
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${this.isbn}`);
        const bookData = response.data.items ? response.data.items[0].volumeInfo : null;
        if (bookData) {
          this.titolo = bookData.title || '';
          this.autore = bookData.authors ? bookData.authors.join(', ') : '';
          this.annoPubblicazione = bookData.publishedDate || '';
          this.genere = bookData.categories ? bookData.categories.join(', ') : '';
          this.descrizione = bookData.description || '';
          this.message = 'Dati del libro caricati con successo';
          this.messageType = 'success';
        } else {
          this.message = 'Nessun dato trovato per l\'ISBN inserito';
          this.messageType = 'error';
        }
      } catch (error) {
        console.error('Errore durante il caricamento dei dati del libro:', error);
        this.message = 'Errore durante il caricamento dei dati del libro';
        this.messageType = 'error';
      }
    },

    aggiungiLibro() {
      if (!this.titolo || !this.autore) {
        this.message = 'Titolo e Autore sono obbligatori';
        this.messageType = 'error';
        return;
      }
      const nuovoLibro = {
        titolo: this.titolo,
        autore: this.autore,
        annoPubblicazione: this.annoPubblicazione,
        genere: this.genere,
        descrizione: this.descrizione,
        isbn: this.isbn,
        prestito: false,
        scambio: false,
        regalo: false,
        scambioLibro: {},
        nickname: null
      };
      this.$emit('aggiungiLibro', nuovoLibro);
      this.message = 'Libro aggiunto con successo';
      this.messageType = 'success';
      this.resetForm();
    },
    resetForm() {
      this.isbn = '';
      this.titolo = '';
      this.autore = '';
      this.annoPubblicazione = '';
      this.genere = '';
      this.descrizione = '';
    }
  }
};
</script>

<style scoped>
.cerca-libro {
  max-width: 600px;
  margin: 0 auto;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-group label {
  width: 180px; /* Fissa la larghezza della label per l'allineamento */
  margin-right: 10px;
}

.form-group input,
.form-group textarea {
  flex: 1;
}

.form-group button {
  margin-left: 10px; /* Spazio tra input e bottone */
}

.button-group {
  justify-content: flex-end;
}

</style>
