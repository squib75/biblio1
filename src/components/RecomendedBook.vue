<template>
  <!-- Contenitore principale -->
  <div class="book-info" v-if="book && book.title">
    <!-- Titolo della sezione -->
    <h2>Consigli di lettura</h2>
    <!-- Contenitore della lista dei libri -->
    <div class="book-list">
      <!-- Immagine del libro -->
      <img :src="book.imageUrl" :alt="book.title" class="book-image">
      <!-- Dettagli del libro -->
      <div class="book-details">
        <!-- Titolo del libro -->
        <h3>{{ book.title }}</h3>
        <!-- Autore -->
        <p><strong>Autore:</strong> {{ book.author }}</p>
        <!-- Editore -->
        <p><strong>Editore:</strong> {{ book.publisher }}</p>
        <!-- ISBN -->
        <p><strong>ISBN:</strong> {{ book.isbn }}</p>
        <!-- Anno di pubblicazione -->
        <p><strong>Anno:</strong> {{ book.year }}</p>
        <!-- Recensione -->
        <p><strong>Recensione:</strong> {{ book.review }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: {
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        year: '',
        review: '',
        imageUrl: ''
      }, // Oggetto che conterrà i dati del libro
    };
  },
  mounted() {
    // Carica i dati del libro dal file JSON
    fetch('/books.json')
        .then(response => response.json())
        .then(data => {
          // Stampa i dati per il debug: Stampa i dati nel metodo mounted per verificare che i dati vengano caricati correttamente.
          console.log('Dati ricevuti:', data);
          // Controlla la struttura del JSON: Assicurati che il JSON abbia effettivamente i dati necessari.
          // Verifica che l'array di libri non sia vuoto
          if (data.length > 0) {
            // Aggiungi un controllo di fallback: Aggiungi un controllo per garantire che book abbia tutti i campi necessari.
            // Assegna i dati del primo libro dell'array
            this.book = data[0];
          } else {
            console.error('Nessun libro trovato nel file JSON.');
          }
        })
        .catch(error => {
          console.error('Errore durante il caricamento dei dati del libro:', error);
        });
  },
};
</script>

<style scoped>
/* Stile del contenitore principale */
.book-info {
  background-color: #f0b68c;
  padding: 10px;
  border-radius: 8px;
  margin-left: 10px;
  /* Imposta la larghezza massima dell'elemento in percentuale rispetto alla larghezza della finestra */
  max-width: 95%;
  height: 98%;
  margin-top: 10px;
}

.book-info h2 {
  margin-top: 0;
}

/* Stile del contenitore della lista dei libri */
.book-list {
  padding: 2px;
  margin-right: 1px;
  display: flex; /* Rende flessibile il layout */
}

/* Stile dell'immagine del libro */
.book-image {
  width: auto; /* Imposta la larghezza automaticamente */
  height: 15vw; /* Imposta l'altezza in base alla larghezza del viewport */
  display: flex; /* Consente la visualizzazione corretta dell'immagine */
  margin-right: 1px; /* Aggiunge un margine a destra */
}

/* Stile dei dettagli del libro */
.book-details {
  text-align: justify; /* Giustifica il testo */
  margin-right: 5px; /* Aggiunge un margine a destra */
  font-size: 1.2rem;
  line-height: 1.5;
}

/* Stile del titolo del libro */
.book-details h3 {
  margin-top: 0; /* Rimuove il margine superiore del titolo */
}

</style>
