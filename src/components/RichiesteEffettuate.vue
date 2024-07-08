<template>
  <div class="richieste-effettuate">
    <h3>Richieste Effettuate</h3>
    <div v-if="richieste.length > 0">
      <ul>
        <li v-for="richiesta in richieste" :key="richiesta.id">
          <div class="richiesta-info">
            <div class="libro-info">
              <strong>{{ richiesta.titolo }}</strong> di {{ richiesta.autore }}<br>
              Richiesto a <strong>{{ richiesta.nickname }}</strong> il {{ new Date(richiesta.timestamp.seconds * 1000).toLocaleString() }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Nessuna richiesta effettuata.</p>
    </div>
  </div>
</template>

<script>
// Importa le funzioni necessarie da Firebase
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'RichiesteEffettuate',
  data() {
    return {
      richieste: [], // Array per memorizzare le richieste effettuate
    };
  },
  // Metodo chiamato quando il componente viene creato
  async created() {
    await this.fetchRichiesteEffettuate(); // Recupera le richieste effettuate
  },
  methods: {
    // Metodo per recuperare le richieste effettuate dal database
    async fetchRichiesteEffettuate() {
      try {
        // Ottiene l'utente autenticato
        const user = auth.currentUser;
        if (!user) {
          console.error('Utente non autenticato.');
          return;
        }

        // Recupera i documenti della collezione 'richieste' da Firebase
        const querySnapshot = await getDocs(query(collection(db, 'richieste'), where('richiedenteId', '==', user.uid)));
        const richieste = [];

        // Estrae i dati di ogni richiesta e li memorizza nell'array richieste
        for (const doc of querySnapshot.docs) {
          const richiestaData = doc.data();
          richiestaData.id = doc.id;
          const nickname = await this.getNickname(richiestaData.userId);
          richieste.push({
            ...richiestaData,
            nickname // Aggiungi il nickname recuperato
          });
        }

        this.richieste = richieste;
      } catch (error) {
        console.error('Errore durante il recupero delle richieste:', error);
      }
    },
    // Metodo per ottenere il nickname dell'utente
    async getNickname(userId) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          return userDoc.data().nickname;
        } else {
          console.error('Nessun documento trovato per l\'utente:', userId);
          return 'Sconosciuto';
        }
      } catch (error) {
        console.error('Errore durante il recupero del nickname:', error);
        return 'Errore';
      }
    }
  }
};
</script>

<style scoped>
.richieste-effettuate {
  margin: 20px;
  text-align: left; /* Assicura che tutto sia allineato a sinistra */
}

.richieste-effettuate ul {
  list-style: none;
  padding: 0;
}

.richiesta-info {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Centra gli elementi verticalmente */
}

.libro-info {
  flex-grow: 1; /* Occupa lo spazio disponibile */
}

.richieste-ricevute li {
  margin-bottom: 10px;
}

.richieste-ricevute button {
  margin-right: 10px;
}
</style>
