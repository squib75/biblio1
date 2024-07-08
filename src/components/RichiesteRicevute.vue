<template>
  <div class="richieste-ricevute">
    <h3>Richieste Ricevute</h3>
    <div v-if="richieste.length > 0">
      <ul>
        <li v-for="richiesta in richieste" :key="richiesta.id">
          <strong>{{ richiesta.titolo }}</strong> di {{ richiesta.autore }}<br>
          Richiesto da <strong>{{ richiesta.richiedenteNickname }}</strong> il {{ richiesta.dataRichiesta }}
          <div>
            <button @click="accettaRichiesta(richiesta)">Accetta</button>
            <button @click="rifiutaRichiesta(richiesta)">Rifiuta</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Nessuna richiesta ricevuta.</p>
    </div>
  </div>
</template>

<script>
// Importa le funzioni necessarie da Firebase
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'RichiesteRicevute',
  data() {
    return {
      richieste: [], // Array per memorizzare le richieste ricevute
    };
  },
  // Metodo chiamato quando il componente viene creato
  async created() {
    await this.fetchRichiesteRicevute(); // Recupera le richieste ricevute
  },
  methods: {
    // Metodo per recuperare le richieste ricevute dal database
    async fetchRichiesteRicevute() {
      try {
        // Ottiene l'utente autenticato
        const user = auth.currentUser;
        if (!user) {
          console.error('Utente non autenticato.');
          return;
        }

        // Recupera il nickname dell'utente autenticato
        const userNickname = await this.getNickname(user.uid);
        if (userNickname === 'Sconosciuto') {
          console.error('Nickname utente non trovato.');
          return;
        }

        // Recupera i documenti della collezione 'LibriRichiesti' da Firebase
        const querySnapshot = await getDocs(query(collection(db, 'LibriRichiesti'), where('proprietario', '==', userNickname)));
        const richieste = [];

        // Usa un ciclo for...of per gestire le promesse in modo corretto
        for (const doc of querySnapshot.docs) {
          // Estrae i dati di ogni richiesta e li memorizza nell'array richieste
          const richiestaData = doc.data();
          richiestaData.id = doc.id;
          const richiedenteNickname = await this.getNickname(richiestaData.richiedenteId);
          richieste.push({
            ...richiestaData,
            richiedenteNickname
          });
        }

        this.richieste = richieste;
      } catch (error) {
        console.error('Errore durante il recupero delle richieste:', error);
      }
    },
    // Metodo per ottenere il nickname dell'utente dato il suo ID
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

  }
};
</script>

<style scoped>
.richieste-ricevute {
  margin: 20px;
}

.richieste-ricevute ul {
  list-style: none;
  padding: 0;
}

.richieste-ricevute li {
  margin-bottom: 10px;
}

.richieste-ricevute button {
  margin-right: 10px;
}
</style>

