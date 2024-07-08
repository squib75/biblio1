<template>
  <div class="cerca-libri-community">
    <h3>Cerca Libri nelle Community</h3>
    <div class="search-form">
      <input type="text" v-model="searchQuery" placeholder="Cerca per titolo, autore o ISBN" />
      <span>Cerca per:</span>
      <button @click="cercaLibri('titolo')">Titolo</button>
      <button @click="cercaLibri('autore')">Autore</button>
      <button @click="cercaLibri('genere')">Genere</button>
      <button @click="cercaLibri('isbn')">ISBN</button>
    </div>
    <div v-if="risultati.length > 0" class="results">
      <h4>Risultati della ricerca:</h4>
      <ul>
        <li v-for="libro in risultati" :key="libro.id">
          <strong>{{ libro.titolo }}</strong> di {{ libro.autore }}
          <div class="elDisp" v-if="libro.isbn">ISBN: {{ libro.isbn }}</div>
          <div>Proprietario: <i><b>{{ libro.proprietario }}</b></i></div>
          <div>Community: <i><b>{{ libro.community.join(', ') }}</b></i></div> <!-- Converte l'array in una stringa separata da virgole -->
          Disponibile per:<i>
          <span v-if="libro.prestito"> prestito - </span>
          <span v-if="libro.scambio"> scambio -</span>
          <span v-if="libro.regalo"> regalo -</span>
          <span v-if="libro.scambioLibro && libro.scambioLibro.length > 0"> scambio con il libro: <i>{{libro.scambioLibro[1]}} di {{libro.scambioLibro[2]}}</i></span>
        </i>
        </li>
      </ul>
    </div>
    <div v-else-if="searchPerformed" class="no-results">
      <p>Nessun risultato trovato.</p>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
export default {
  name: 'CercaLibroCommunity',
  data() {
    return {
      searchQuery: '', // Query di ricerca inserita dall'utente
      risultati: [], // Array per memorizzare i risultati della ricerca
      searchPerformed: false, // Flag per indicare se la ricerca è stata effettuata
      communities: [], // Array per memorizzare le community
      users: [], // Array per memorizzare gli utenti
      currentUser: null // Dati dell'utente loggato
    };
  },
  async created() {
    // Quando il componente è creato, carica i dati dell'utente e le community
    await this.getCurrentUser();
    await this.fetchCommunities();
    await this.fetchUsers();
  },
  methods: {
    // Metodo per recuperare le community dal database
    async fetchCommunities() {
      try {
        // Recupera i documenti della collezione 'Community' da Firebase
        const querySnapshot = await getDocs(collection(db, 'Community'));
        const communities = [];
        querySnapshot.forEach((doc) => {
          // Estrae i dati di ogni community e li memorizza nell'array communities
          const communityData = doc.data();
          communityData.id = doc.id;
          communityData.Nome = communityData.Nome || '';
          communities.push(communityData);
        });
        this.communities = communities;
      } catch (error) {
        console.error('Errore durante il recupero delle community:', error);
      }
    },
    // Metodo per recuperare gli utenti dal database
    async fetchUsers() {
      try {
        // Recupera i documenti della collezione 'users' da Firebase
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        querySnapshot.forEach((doc) => {
          // Estrae i dati di ogni utente e li memorizza nell'array users
          const userData = doc.data();
          userData.Community = userData.Community || [];
          users.push(userData);
        });
        this.users = users;
      } catch (error) {
        console.error('Errore durante il recupero degli utenti:', error);
      }
    },
    // Metodo per ottenere i dati dell'utente loggato
    async getCurrentUser() {
      const user = auth.currentUser; // Ottiene l'utente attualmente autenticato
      if (user) {
        // Recupera i dati dell'utente dalla collezione 'users'
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          this.currentUser = { ...userDoc.data(), userId: user.uid }; // Memorizza i dati dell'utente nel componente, includendo userId
        }
      }
    },
    async getNickname(userId) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData.nickname || 'Sconosciuto';
        } else {
          return 'Sconosciuto';
        }
      } catch (error) {
        console.error('Errore durante il recupero del nickname:', error);
        return 'Sconosciuto';
      }
    },
    async getCommonCommunities(userId) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userCommunities = userData.Community || [];
          return userCommunities.filter(communityId => this.currentUser.Community.includes(communityId));
        } else {
          return [];
        }
      } catch (error) {
        console.error('Errore durante il recupero delle community condivise:', error);
        return [];
      }
    },
    async cercaLibri(categoria) {
      if (!this.searchQuery) {
        console.log('Campo di ricerca vuoto.');
        return;
      }
      this.risultati = []; // Resetta i risultati della ricerca
      this.searchPerformed = false; // Resetta il flag della ricerca
      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato.');
        return;
      }
      try {
        // Verifica se l'utente è iscritto a delle community
        if (!this.currentUser || !this.currentUser.Community || this.currentUser.Community.length === 0) {
          console.log('L\'utente non è iscritto a nessuna community.');
          this.searchPerformed = true;
          return;
        }
        const userCommunityIds = this.currentUser.Community;
        // Recupera tutti gli utenti iscritti alle stesse community
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userIds = usersSnapshot.docs
            .filter(doc => {
              const userCommunities = doc.data().Community || [];
              // Filtra gli utenti in base alle community condivise
              return userCommunities.some(communityId => userCommunityIds.includes(communityId));
            })
            .map(doc => doc.id);
        if (userIds.length === 0) {
          console.log('Nessun altro utente trovato nelle stesse community.');
          this.searchPerformed = true;
          return;
        }
        // Costruisce la query di ricerca per i libri degli utenti nelle stesse community
        const libriRef = collection(db, 'libri');
        let libriQuery = query(libriRef, where('userId', 'in', userIds));
        // Esegue la query di ricerca per ottenere tutti i libri degli utenti nelle stesse community
        const libriSnapshot = await getDocs(libriQuery);
        const searchQueryLower = this.searchQuery.toLowerCase();
        const libriPromises = libriSnapshot.docs.map(async doc => {
          const libro = doc.data();

          // Debug: Log dei dettagli del libro e dell'utente corrente
          console.log('Libro:', libro);
          console.log('User ID del libro:', libro.userId);
          console.log('User ID corrente:', this.currentUser.userId);

          const proprietarioNickname = await this.getNickname(libro.userId);
          const comuniCommunities = await this.getCommonCommunities(libro.userId);

          // Controlla se il libro soddisfa i criteri di ricerca case-insensitive
          let matches = false;
          if (categoria === 'titolo' && libro.titolo.toLowerCase().includes(searchQueryLower)) {
            matches = true;
          } else if (categoria === 'autore' && libro.autore.toLowerCase().includes(searchQueryLower)) {
            matches = true;
          } else if (categoria === 'isbn' && libro.isbn.toLowerCase().includes(searchQueryLower)) {
            matches = true;
          } else if (categoria === 'genere' && libro.genere.toLowerCase().includes(searchQueryLower)) {
            matches = true;
          }
          // Filtra i libri che hanno almeno uno dei campi prestito, regalo, scambio o scambioLibro a true
          if (matches && (libro.prestito || libro.regalo || libro.scambio || libro.scambioLibro[0] )) {
            // Escludi i libri del proprietario loggato
            if (libro.userId !== this.currentUser.userId) {
              return {
                id: doc.id,
                ...libro,
                proprietario: proprietarioNickname,
                community: comuniCommunities
              };
            }
          }
          return null; // Non mostra i libri che non soddisfano il criterio
        });
        const libri = await Promise.all(libriPromises);
        this.risultati = libri.filter(libro => libro !== null);
        this.searchPerformed = true;
      } catch (error) {
        console.error('Errore durante la ricerca dei libri:', error);
        this.searchPerformed = true;
      }
    }
  }
};
</script>

<style scoped>
.cerca-libri-community {
  margin: 20px;
  text-align: left;
}
.search-form {
  display: flex;
  align-items: center;
}
.search-form input {
  flex: 1;
  margin-right: 10px;
}
.elDisp {
  font-size: 1.1vw;
}
.results ul {
  list-style: none;
  padding: 0;
}
.results li {
  margin-bottom: 10px;
}
.no-results {
  margin-top: 20px;
  color: red;
}
</style>