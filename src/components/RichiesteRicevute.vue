<template>
  <div class="richieste-ricevute">
    <div class="header">
      <h3>Richieste Ricevute</h3>
      <!-- Bottone per eliminare tutte le richieste -->
      <button class="elimina-storico" @click="cancellaTutteRichieste">Elimina storico richieste</button>
    </div>
    <div v-if="richieste.length > 0">
      <ul>
        <li v-for="richiesta in richieste" :key="richiesta.id">
          <div class="richiesta-info">
            <div class="libro-info">
              <strong>{{ richiesta.titolo }}</strong> di {{ richiesta.autore }}<br>
              Richiesto da <strong>{{ richiesta.richiedenteNickname }}</strong> il {{ new Date(richiesta.timestamp.seconds * 1000).toLocaleString() }}
            </div>
            <div class="azioni">
              <!-- Mostra il messaggio "Richiesta rifiutata" se la richiesta è stata rifiutata -->
              <template v-if="richiesta.rifiutata">
                <span class="rifiutata">Richiesta rifiutata</span>
              </template>
              <!-- Mostra il messaggio "Richiesta accettata" se la richiesta è stata accettata -->
              <template v-else-if="richiesta.accettata">
                <span class="accettata">Richiesta accettata</span>
              </template>
              <!-- Mostra i bottoni "Accetta" e "Rifiuta" se la richiesta non è stata ancora gestita -->
              <template v-else>
                <button @click="accettaRichiesta(richiesta)">Accetta</button>
                <button @click="rifiutaRichiesta(richiesta)">Rifiuta</button>
              </template>
            </div>
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
import { collection, query, where, getDocs, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

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

        // Recupera i documenti della collezione 'richieste' da Firebase
        const querySnapshot = await getDocs(query(collection(db, 'richieste'), where('proprietario', '==', userNickname)));
        const richieste = [];

        // Usa un ciclo for...of per gestire le promesse in modo corretto
        for (const doc of querySnapshot.docs) {
          // Estrae i dati di ogni richiesta e li memorizza nell'array richieste
          const richiestaData = doc.data();
          richiestaData.id = doc.id;
          const richiedenteNickname = await this.getNickname(richiestaData.richiedenteId);

          // Filtra le richieste che non devono essere visualizzate
          if (!richiestaData.cancellatoDaProprietario) {
            richieste.push({
              ...richiestaData,
              richiedenteNickname,
              rifiutata: richiestaData.rifiutata || false,
              accettata: richiestaData.accettata || false
            });
          }
        }

        // Aggiorna l'array delle richieste nel componente
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
    // Metodo per accettare una richiesta
    async accettaRichiesta(richiesta) {
      // Aggiorna lo stato della richiesta su Firebase
      try {
        // Imposta lo stato della richiesta accettata
        await setDoc(doc(db, 'richieste', richiesta.id), { accettata: true }, { merge: true });

        // Verifica che libroId sia presente
        if (!richiesta.libroId) {
          console.error('libroId non presente nella richiesta:', richiesta);
          return;
        }

        // Crea una nuova entrata nella collezione 'prestiti'
        await addDoc(collection(db, 'prestiti'), {
          ...richiesta,
          libroId: richiesta.libroId, // Aggiungi il campo libroId
          dataAccettazione: serverTimestamp(),
          recensione: false
        });

        // Aggiorna lo stato della richiesta nel frontend
        richiesta.accettata = true;
        await this.fetchRichiesteRicevute(); // Ricarica le richieste
      } catch (error) {
        console.error('Errore durante l\'aggiornamento della richiesta:', error);
      }
    },
    // Metodo per rifiutare una richiesta
    async rifiutaRichiesta(richiesta) {
      // Aggiorna lo stato della richiesta su Firebase
      try {
        await setDoc(doc(db, 'richieste', richiesta.id), { rifiutata: true }, { merge: true });
        // Aggiorna lo stato della richiesta nel frontend
        richiesta.rifiutata = true;
        await this.fetchRichiesteRicevute(); // Ricarica le richieste

        // Crea un messaggio su Firebase
        const user = auth.currentUser;
        const userNickname = await this.getNickname(user.uid);
        await addDoc(collection(db, 'messages'), {
          from: 'admin',
          message: `Il prestito del libro "${richiesta.titolo}" di ${richiesta.autore} è stato rifiutato da ${userNickname}`,
          read: false,
          timestamp: serverTimestamp(),
          to: richiesta.richiedenteNickname
        });
      } catch (error) {
        console.error('Errore durante l\'invio del messaggio:', error);
      }
    },
    // Metodo per cancellare tutte le richieste
    async cancellaTutteRichieste() {
      try {
        const richiesteIds = this.richieste.map(richiesta => richiesta.id);
        const updatePromises = richiesteIds.map(id => setDoc(doc(db, 'richieste', id), { cancellatoDaProprietario: true }, { merge: true }));
        await Promise.all(updatePromises);
        // Rimuovi immediatamente le richieste dal frontend
        this.richieste = this.richieste.filter(richiesta => !richiesta.cancellatoDaProprietario);
        await this.fetchRichiesteRicevute(); // Ricarica le richieste
      } catch (error) {
        console.error('Errore durante la cancellazione dello storico delle richieste:', error);
      }
    }
  }
};
</script>

<style scoped>
.richieste-ricevute {
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

.richieste-ricevute ul {
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

.azioni {
  display: flex; /* Allinea i pulsanti su una singola riga */
  align-items: center; /* Centra gli elementi verticalmente */
}

.richieste-ricevute li {
  margin-bottom: 10px;
}

.richieste-ricevute button {
  margin-right: 10px;
}

.rifiutata, .accettata {
  font-weight: bold;
  color: #101010;
}

</style>








