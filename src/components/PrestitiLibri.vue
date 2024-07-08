<template>
  <div class="prestiti-libri">
    <h3>Prestiti Libri</h3>
    <div v-if="prestiti.length > 0">
      <ul>
        <li v-for="prestito in prestiti" :key="prestito.id">
          <div class="prestito-info">
            <div class="libro-info">
              <strong>{{ prestito.titolo }}</strong> di {{ prestito.autore }}<br>
              Prestato da <strong>{{ prestito.proprietario }}</strong> a <strong>{{ prestito.richiedenteNickname }}</strong><br>
              Data Richiesta: {{ new Date(prestito.timestamp.seconds * 1000).toLocaleString() }}<br>
              Data Accettazione: {{ new Date(prestito.dataAccettazione.seconds * 1000).toLocaleString() }}
            </div>
            <div class="azioni">
              <button v-if="!prestito.conclusoProprietario || !prestito.conclusoRichiedente" @click="concludiPrestito(prestito)">
                Prestito concluso
              </button>
            </div>
            <div class="azioni">
              <button v-if="prestito.recensioneAltraParte" @click="toggleRecensione(prestito)">
                {{ prestito.mostraRecensione ? 'Chiudi Recensione' : 'Leggi Recensione' }}
              </button>
              <div class="icone-libri" v-if="prestito.recensioneAltraParte">

                <span v-for="n in prestito.votoAltraParte" :key="n" class="libro-votato">&#128218;</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Nessun prestito trovato.</p>
    </div>
    <RecensionePrestito v-if="showRecensionePopup" :prestito="selectedPrestito" @chiudi="chiudiRecensionePopup" @salvaRecensione="salvaRecensione" />
    <div v-if="showReview" class="review-popup">
      <h3>Recensione</h3>
      <p>{{ reviewContent }}</p>

    </div>
  </div>
</template>


<script>
// Importa le funzioni necessarie da Firebase
import { db, auth } from '@/firebase';
import { collection, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import RecensionePrestito from './RecensionePrestito.vue';

export default {
  name: 'PrestitiLibri',
  components: {
    RecensionePrestito
  },
  data() {
    return {
      prestiti: [], // Array per memorizzare i prestiti
      showRecensionePopup: false,
      selectedPrestito: null,
      showReview: false,
      reviewContent: ''
    };
  },
  // Metodo chiamato quando il componente viene creato
  async created() {
    await this.fetchPrestiti(); // Recupera i prestiti
  },
  methods: {
    // Metodo per recuperare i prestiti dal database
    async fetchPrestiti() {
      try {
        // Ottiene l'utente autenticato
        const user = auth.currentUser;
        if (!user) {
          console.error('Utente non autenticato.');
          return;
        }

        // Recupera i documenti della collezione 'prestiti' da Firebase
        const querySnapshot = await getDocs(collection(db, 'prestiti'));
        const prestiti = [];

        // Usa un ciclo for...of per gestire le promesse in modo corretto
        for (const doc of querySnapshot.docs) {
          // Estrae i dati di ogni prestito e li memorizza nell'array prestiti
          const prestitoData = doc.data();
          prestitoData.id = doc.id;

          // Filtra i prestiti dove l'utente loggato è il proprietario o il richiedente
          if (prestitoData.userId === user.uid || prestitoData.richiedenteId === user.uid) {
            const proprietarioNickname = await this.getNickname(prestitoData.userId);
            const richiedenteNickname = await this.getNickname(prestitoData.richiedenteId);
            prestiti.push({
              ...prestitoData,
              proprietarioNickname,
              richiedenteNickname,
              conclusoProprietario: prestitoData.conclusoProprietario || false,
              conclusoRichiedente: prestitoData.conclusoRichiedente || false,
              mostraRecensione: false,
              recensioneAltraParte: prestitoData.userId === user.uid ? prestitoData.recensioneRichiedente : prestitoData.recensioneProprietario,
              votoAltraParte: prestitoData.userId === user.uid ? prestitoData.votoRichiedente : prestitoData.votoProprietario
            });
          }
        }

        // Aggiorna l'array dei prestiti nel componente
        this.prestiti = prestiti;
      } catch (error) {
        console.error('Errore durante il recupero dei prestiti:', error);
      }
    },

    // Metodo per leggere o chiudere la recensione
    toggleRecensione(prestito) {
      if (prestito.mostraRecensione) {
        this.showReview = false;
      } else {
        this.reviewContent = prestito.recensioneAltraParte;
        this.showReview = true;
      }
      prestito.mostraRecensione = !prestito.mostraRecensione;
    },

    //Metodo per ottenere il nickname dell'utente dato il suo ID
    async getNickname(userId) {
      try {
        if (!userId) {
          console.error('userId non definito.');
          return 'Sconosciuto';
        }
        const userDocRef = doc(db, 'users', userId.toString());
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData.nickname || 'Sconosciuto';
        } else {
          console.error('Nessun documento trovato per l\'utente:', userId);
          return 'Sconosciuto';
        }
      } catch (error) {
        console.error('Errore durante il recupero del nickname:', error);
        return 'Errore';
      }
    },

    // Metodo per concludere un prestito
    async concludiPrestito(prestito) {
      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato.');
        return;
      }

      try {
        // Incrementa il campo "prestitiConclusi" nella tabella users dell'utente loggato
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const currentPrestitiConclusi = userDoc.exists() && userDoc.data().prestitiConclusi ? userDoc.data().prestitiConclusi : 0;
        await updateDoc(userDocRef, {
          prestitiConclusi: currentPrestitiConclusi + 1
        });

        // Segna il prestito come concluso per il tipo di utente appropriato
        const prestitoDocRef = doc(db, 'prestiti', prestito.id);
        const updateData = user.uid === prestito.userId
            ? { conclusoProprietario: true }
            : { conclusoRichiedente: true };
        await updateDoc(prestitoDocRef, updateData);

        // Mostra il popup di recensione
        this.selectedPrestito = prestito;
        this.showRecensionePopup = true;
      } catch (error) {
        console.error('Errore durante la conclusione del prestito:', error);
      }
    },

    // Metodo per salvare la recensione
    async salvaRecensione(prestitoId, recensione, voto) {
      const user = auth.currentUser;
      if (!user) {
        console.error('Utente non autenticato.');
        return;
      }

      try {
        // Recupera il documento del prestito per ottenere i dati necessari
        const prestitoDocRef = doc(db, 'prestiti', prestitoId.toString());
        const prestitoDoc = await getDoc(prestitoDocRef);
        if (!prestitoDoc.exists()) {
          console.error('Documento del prestito non trovato.');
          return;
        }
        const prestitoData = prestitoDoc.data();

        // Aggiorna il campo recensione e voto su Firebase
        const updateData = user.uid === prestitoData.userId
            ? { recensioneProprietario: recensione, votoProprietario: voto }
            : { recensioneRichiedente: recensione, votoRichiedente: voto };

        await updateDoc(prestitoDocRef, updateData);

        // Se il voto è del richiedente, aggiorna il punteggio del proprietario
        if (user.uid === prestitoData.richiedenteId) {
          const proprietarioDocRef = doc(db, 'users', prestitoData.userId);
          const proprietarioDoc = await getDoc(proprietarioDocRef);
          if (proprietarioDoc.exists()) {
            const currentPunteggio = proprietarioDoc.data().punteggio || 0;
            await updateDoc(proprietarioDocRef, {
              punteggio: currentPunteggio + voto
            });
          }
        }

        // Chiudi il popup
        this.showRecensionePopup = false;
        await this.fetchPrestiti(); // Ricarica i prestiti per aggiornare la vista
      } catch (error) {
        console.error('Errore durante il salvataggio della recensione:', error);
      }
    },

    // Metodo per chiudere il popup di recensione
    chiudiRecensionePopup() {
      this.showRecensionePopup = false;
    },
  }
};

</script>

<style scoped>
.prestiti-libri {
  margin: 20px;
  text-align: left; /* Assicura che tutto sia allineato a sinistra */
}

.prestiti-libri ul {
  list-style: none;
  padding: 0;
}

.prestito-info {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Centra gli elementi verticalmente */
  margin-bottom: 20px; /* Spazio tra i prestiti */
}

.libro-info {
  flex-grow: 1; /* Occupa lo spazio disponibile */
}

.azioni {
  display: flex;
  align-items: center;
  gap: 10px; /* Spazio tra i bottoni e le icone dei libri */
}

.icone-libri {
  display: flex;
  align-items: center;
}

.libro-votato {
  color: gold;
}

.review-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>







