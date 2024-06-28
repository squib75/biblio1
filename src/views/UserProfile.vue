<template>
  <!-- Contenitore principale per il popup del profilo utente -->
  <div class="profile-popup">
    <h2>Profilo Utente</h2>
    <form @submit.prevent="updateProfile">
      <!-- Campo per visualizzare il nickname dell'utente -->
      <div class="input-group">
        <label for="nickname">Nickname:</label>
        <input type="text" v-model="nickname" id="nickname" disabled />
      </div>
      <!-- Campo per visualizzare l'email dell'utente -->
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" disabled />
      </div>
      <!-- Campo per inserire i libri preferiti dell'utente -->
      <div class="input-group">
        <label for="favoriteBooks">Libri Preferiti:</label>
        <textarea v-model="favoriteBooks" id="favoriteBooks"></textarea>
      </div>
      <!-- Campo per inserire i libri posseduti dall'utente -->
      <div class="input-group">
        <label for="ownedBooks">Libri Posseduti:</label>
        <textarea v-model="ownedBooks" id="ownedBooks"></textarea>
      </div>
      <!-- Campo per inserire i libri desiderati dall'utente -->
      <div class="input-group">
        <label for="wantedBooks">Libri Desiderati:</label>
        <textarea v-model="wantedBooks" id="wantedBooks"></textarea>
      </div>
      <!-- Campo per selezionare le community a cui l'utente vuole iscriversi -->
      <div class="input-group">
        <label for="community">Community:</label>
        <select v-model="selectedCommunity" id="community" multiple>
          <option v-for="community in communities" :key="community.id" :value="community.id">{{ community.name }}</option>
        </select>
      </div>
      <button type="submit">Aggiorna Profilo</button>
    </form>
    <div class="input-group">
      <h3>Aggiungi un Libro</h3>
      <!-- Campo per inserire l'ISBN del libro -->
      <label for="isbn">ISBN:</label>
      <input type="text" v-model="isbn" id="isbn" @input="fetchBookDetails" placeholder="Inserisci ISBN" />
      <!-- Campo per inserire il titolo del libro -->
      <label for="title">Titolo:</label>
      <input type="text" v-model="title" id="title" placeholder="Titolo" />
      <!-- Campo per inserire l'autore del libro -->
      <label for="author">Autore:</label>
      <input type="text" v-model="author" id="author" placeholder="Autore" />
      <!-- Campo per inserire l'anno di pubblicazione del libro -->
      <label for="publicationYear">Anno di Pubblicazione:</label>
      <input type="text" v-model="publicationYear" id="publicationYear" placeholder="Anno di Pubblicazione" />
      <!-- Campo per inserire il genere del libro -->
      <label for="genre">Genere:</label>
      <input type="text" v-model="genre" id="genre" placeholder="Genere" />
      <!-- Campo per inserire la descrizione del libro -->
      <label for="description">Descrizione:</label>
      <textarea v-model="description" id="description" placeholder="Descrizione"></textarea>
      <button @click="addBook">Aggiungi Libro</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      nickname: '', // Variabile per memorizzare il nickname dell'utente
      email: '', // Variabile per memorizzare l'email dell'utente
      favoriteBooks: '', // Variabile per memorizzare i libri preferiti dell'utente
      ownedBooks: '', // Variabile per memorizzare i libri posseduti dall'utente
      wantedBooks: '', // Variabile per memorizzare i libri desiderati dall'utente
      selectedCommunity: [], // Variabile per memorizzare le community selezionate dall'utente
      communities: [], // Variabile per memorizzare le community disponibili
      isbn: '', // Variabile per memorizzare l'ISBN del libro da aggiungere
      title: '', // Variabile per memorizzare il titolo del libro da aggiungere
      author: '', // Variabile per memorizzare l'autore del libro da aggiungere
      publicationYear: '', // Variabile per memorizzare l'anno di pubblicazione del libro da aggiungere
      genre: '', // Variabile per memorizzare il genere del libro da aggiungere
      description: '' // Variabile per memorizzare la descrizione del libro da aggiungere
    };
  },
  async created() {
    // Recupera il profilo utente
    const user = auth.currentUser;
    if (user) {
      this.email = user.email;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.nickname = userData.nickname;
        this.favoriteBooks = userData.favoriteBooks || '';
        this.ownedBooks = userData.ownedBooks || '';
        this.wantedBooks = userData.wantedBooks || '';
        this.selectedCommunity = userData.community || [];
      }
    }

    // Recupera le community disponibili
    const communitySnapshot = await getDocs(collection(db, 'communities'));
    this.communities = communitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  methods: {
    async updateProfile() {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          favoriteBooks: this.favoriteBooks,
          ownedBooks: this.ownedBooks,
          wantedBooks: this.wantedBooks,
          community: this.selectedCommunity
        }, { merge: true });
      }
    },
    async fetchBookDetails() {
      // Verifica se l'ISBN è di 10 o 13 caratteri
      if (this.isbn.length === 13 || this.isbn.length === 10) {
        try {
          // Richiesta API per recuperare i dettagli del libro tramite ISBN
          const response = await axios.get(`https://api.example.com/books?isbn=${this.isbn}`);
          const book = response.data;
          // Popola i campi del form con i dettagli del libro
          this.title = book.title;
          this.author = book.author;
          this.publicationYear = book.publicationYear;
          this.genre = book.genre;
          this.description = book.description;
        } catch (error) {
          console.error('Errore durante il recupero dei dettagli del libro:', error);
        }
      }
    },
    addBook() {
      // Crea un nuovo oggetto libro
      const newBook = {
        title: this.title,
        author: this.author,
        publicationYear: this.publicationYear,
        genre: this.genre,
        description: this.description
      };
      // Aggiungi il nuovo libro alla lista dei libri posseduti
      this.ownedBooks += `\n${newBook.title} - ${newBook.author} (${newBook.publicationYear}) - ${newBook.genre}\n${newBook.description}`;
      // Resetta i campi del form
      this.isbn = '';
      this.title = '';
      this.author = '';
      this.publicationYear = '';
      this.genre = '';
      this.description = '';
    }
  }
};
</script>

<style scoped>
/* Stile per il popup del profilo utente */
.profile-popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 1.2rem;
}

/* Stile per il titolo del popup */
.profile-popup h2 {
  margin-top: 0;
  font-size: 1.5rem;
  text-align: center;
}

/* Stile per il form */
.profile-popup form {
  display: flex;
  flex-direction: column;
}

/* Stile per i gruppi di input */
.profile-popup .input-group {
  margin-bottom: 15px;
}

/* Stile per le etichette */
.profile-popup label {
  font-weight: bold;
}

/* Stile per gli input e i textarea */
.profile-popup input,
.profile-popup textarea,
.profile-popup select {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

/* Stile per il pulsante di invio */
.profile-popup button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 10px;
}

/* Stile per il pulsante di invio quando hover */
.profile-popup button:hover {
  background-color: #218838;
}
</style>
