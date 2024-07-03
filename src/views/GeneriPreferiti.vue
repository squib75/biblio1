<template>
  <div class="generi-preferiti">
    <h2>Generi Preferiti</h2>
    <!-- Mostra i generi preferiti esistenti da Firebase -->
    <div v-if="userGenres.length > 0">
      <ul>
        <li v-for="(genre, index) in userGenres" :key="index">
          <b>{{ genre }}</b>
          <button @click="removeGenre(genre)">Rimuovi</button>
        </li>
      </ul>
    </div>

    <!-- Menu a tendina per selezionare e aggiungere nuovi generi -->
    <label for="newGenre">Aggiungi nuovo genere:</label>
    <select id="newGenre" v-model="selectedNewGenre">
      <option v-for="category in availableCategories" :key="category.id" :value="category.name">
        {{ category.name }}
      </option>
    </select>

    <!-- Bottone per confermare l'aggiunta del nuovo genere -->
    <button @click="addNewGenre">Aggiungi</button>

    <!-- Messaggi di stato -->
    <div v-if="message" :class="{'success-message': messageType === 'success', 'error-message': messageType === 'error'}">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase'; // Importa il database e l'autenticazione di Firebase
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; // Importa le funzioni necessarie da Firestore
import axios from 'axios'; // Importa axios per fare richieste HTTP

export default {
  name: 'GeneriPreferiti',
  data() {
    return {
      userGenres: [], // Array per i generi preferiti dell'utente (da Firebase)
      selectedNewGenre: '', // Genero selezionato per l'aggiunta
      bookCategories: [], // Array per memorizzare i generi caricati dal file JSON
      message: '', // Messaggio di stato
      messageType: '', // Tipo di messaggio (successo o errore)
      userId: '' // ID dell'utente loggato
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      this.userId = user.uid;
      await this.loadBookCategories();
      await this.loadUserGenres();
    } else {
      this.message = 'Utente non autenticato';
      this.messageType = 'error';
    }
  },
  methods: {
    // Carica i generi preferiti dell'utente da Firebase
    async loadUserGenres() {
      try {
        const userDoc = doc(db, 'users', this.userId);
        const snapshot = await getDoc(userDoc);
        if (snapshot.exists()) {
          this.userGenres = snapshot.data().favoriteGenres || [];
        }
      } catch (error) {
        console.error('Errore durante il recupero dei generi preferiti:', error);
      }
    },
    // Metodo per caricare i generi dal file JSON
    async loadBookCategories() {
      try {
        const response = await axios.get('/genres.json'); // Percorso corretto del file JSON nella cartella public
        this.bookCategories = response.data;
      } catch (error) {
        console.error('Errore durante il caricamento dei generi:', error);
      }
    },
    // Metodo per aggiungere un nuovo genere preferito
    async addNewGenre() {
      if (this.selectedNewGenre && !this.userGenres.includes(this.selectedNewGenre)) {
        try {
          const userDoc = doc(db, 'users', this.userId);
          await updateDoc(userDoc, {
            favoriteGenres: arrayUnion(this.selectedNewGenre)
          });
          this.userGenres.push(this.selectedNewGenre);
          this.selectedNewGenre = '';
          this.message = 'Genere preferito salvato';
          this.messageType = 'success';
        } catch (error) {
          console.error('Errore durante l\'aggiunta del nuovo genere:', error);
          this.message = 'Errore durante l\'aggiunta del nuovo genere';
          this.messageType = 'error';
        }
      } else {
        this.message = 'Genere già selezionato o non valido';
        this.messageType = 'error';
      }
    },
    // Metodo per rimuovere un genere preferito
    async removeGenre(genre) {
      try {
        const userDoc = doc(db, 'users', this.userId);
        await updateDoc(userDoc, {
          favoriteGenres: arrayRemove(genre)
        });
        this.userGenres = this.userGenres.filter(g => g !== genre);
        this.message = 'Genere preferito rimosso';
        this.messageType = 'success';
      } catch (error) {
        console.error('Errore durante la rimozione del genere preferito:', error);
        this.message = 'Errore durante la rimozione del genere preferito';
        this.messageType = 'error';
      }
    }
  },
  computed: {
    // Filtra i generi disponibili per escludere quelli già selezionati dall'utente
    availableCategories() {
      return this.bookCategories.filter(category => !this.userGenres.includes(category.name));
    }
  }
};
</script>

<style scoped>
.generi-preferiti {
  padding: 20px;
  text-align: left;
}
.generi-preferiti li {
  list-style-type: none; /* Rimuove i punti elenco */
}
</style>
