<template>
    <!-- Contenitore principale -->
    <div class="book-info">
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
        book: {}, // Oggetto che conterrà i dati del libro
      };
    },
    mounted() {
      // Carica i dati del libro dal file JSON
      fetch('/books.json')
        .then(response => response.json())
        .then(data => {
          // Assegna i dati del primo libro dell'array
          this.book = data[0];
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
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
    width: 100%;
    max-width: 100%;
    margin-left: 5px;
  }
  
  /* Stile dell'immagine del libro */
  .book-image {
    width: auto; /* Imposta la larghezza automaticamente */
    height: 15vw; /* Imposta l'altezza in base alla larghezza del viewport */
    display: flex; /* Consente la visualizzazione corretta dell'immagine */
    margin-right: 5px; /* Aggiunge un margine a destra */
  }
  
  /* Stile dei dettagli del libro */
  .book-details {
    text-align: justify; /* Giustifica il testo */
    margin-right: 10px; /* Aggiunge un margine a destra */
  }
  
  /* Stile del titolo del libro */
  .book-details h3 {
    margin-top: 0; /* Rimuove il margine superiore del titolo */
  }
  
  /* Stile del contenitore della lista dei libri */
  .book-list {
    padding: 5px;
    margin-right: 5px;
    display: flex; /* Rende flessibile il layout */
  }
  </style>
  
  
  