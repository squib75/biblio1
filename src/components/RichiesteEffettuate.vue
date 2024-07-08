<template>
  <div class="richieste-effettuate">
    <div class="header">
      <h3>Richieste Effettuate</h3>
      <button class="elimina-storico" @click="cancellaTutteRichieste">Elimina storico richieste</button>
    </div>
    <div v-if="richieste.length > 0">
      <ul>
        <li v-for="richiesta in richieste" :key="richiesta.id">
          <div class="richiesta-info">
            <div class="libro-info">
              <strong>{{ richiesta.titolo }}</strong> di {{ richiesta.autore }}<br>
              Richiesto a <strong>{{ richiesta.nickname }}</strong> il {{ new Date(richiesta.timestamp.seconds * 1000).toLocaleString() }}
            </div>
            <div class="stato-richiesta">
              <span v-if="richiesta.accettata" class="accettata">Richiesta accettata</span>
              <span v-if="richiesta.rifiutata" class="rifiutata">Richiesta rifiutata</span>
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
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

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

          // Filtra le richieste che non devono essere visualizzate
          if (!richiestaData.cancellatoDaRichiedente) {
            richieste.push({
              ...richiestaData,
              nickname, // Aggiungi il nickname recuperato
              accettata: richiestaData.accettata || false,
              rifiutata: richiestaData.rifiutata || false
            });
          }
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
    },
    // Metodo per cancellare tutte le richieste
    async cancellaTutteRichieste() {
      try {
        const richiesteIds = this.richieste.map(richiesta => richiesta.id);
        const updatePromises = richiesteIds.map(id => setDoc(doc(db, 'richieste', id), { cancellatoDaRichiedente: true }, { merge: true }));
        await Promise.all(updatePromises);
        // Rimuovi immediatamente le richieste dal frontend
        this.richieste = this.richieste.filter(richiesta => !richiesta.cancellatoDaRichiedente);
        await this.fetchRichiesteEffettuate(); // Ricarica le richieste
      } catch (error) {
        console.error('Errore durante la cancellazione dello storico delle richieste:', error);
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.elimina-storico {
  margin-left: 20px;
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

.stato-richiesta {
  margin-left: 20px; /* Spazio tra il libro e lo stato della richiesta */
}

.accettata, .rifiutata {
  color: #101010;
}


.richieste-effettuate li {
  margin-bottom: 20px; /* Aumentato lo spazio tra i libri */
}
</style>



