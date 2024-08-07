<template>
  <div class="libri-posseduti-container">
    <div class="libri-list">
      <div class="header">
        <h3>Biblioteca personale</h3>
        <button @click="showCercaLibroPopup1 = true">Aggiungi libro</button>
      </div>
      <!-- Itera su ogni libro nella lista libri e visualizza i dettagli -->
      <div v-for="(libro, index) in libri" :key="index" class="libro-item">
        <div>
          <i>
            <strong>{{ libro.titolo }}</strong> di {{ libro.autore }}
            <span v-if="libro.annoPubblicazione"> ({{ libro.annoPubblicazione }})</span>
          </i>
        </div>
        <div class="button-group">
          <button @click="toggleDisponibilitaMenu(libro, index)">Disponibilità</button>
          <button @click="rimuoviLibro(libro.id)">Rimuovi</button>
        </div>
      </div>
    </div>

    <!-- Popup per la disponibilità -->
    <div v-if="showDisponibilitaPopup" class="popup">
      <div class="popup-content">
        <h3>Modifica Disponibilità</h3>
        <!-- Checkbox per modificare la disponibilità del libro -->
        <label>
          <input type="checkbox" v-model="selectedLibro.prestito"/>
          Disponibile per prestito
        </label>
        <label>
          <input type="checkbox" v-model="selectedLibro.scambio"/>
          Disponibile per scambio
        </label>
        <label>
          <input type="checkbox" v-model="selectedLibro.regalo"/>
          Disponibile per regalo
        </label>
        <div>
          <label>
            <input type="checkbox" v-model="selectedLibro.scambioLibro[0]" @change="checkScambioLibro"/>
            Disponibile per scambio con libro specifico
          </label>
        </div>
        <button @click="updateDisponibilita(selectedLibro.id)">Salva</button>
        <button @click="closeDisponibilitaPopup">Annulla</button>
      </div>
    </div>
  </div>
  <!-- Popup per CercaLibro -->
  <div v-if="showCercaLibroPopup1" class="popup">
    <div class="popup-content">
      <CercaLibro @aggiungi-libro="aggiungiNuovoLibro"/>
      <button @click="closeCercaLibroPopup">Chiudi</button>
    </div>
  </div>
  <div v-if="showCercaLibroPopup2" class="popup">
    <div class="popup-content">
      <CercaLibro @aggiungi-libro="aggiungiLibro"/>
      <button @click="closeCercaLibroPopup">Chiudi</button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase'; // Importa l'autenticazione e il database di Firebase
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import CercaLibro from '@/components/CercaLibro.vue'; // Importa il componente CercaLibro

export default {
  name: 'LibriPosseduti',
  components: {
    CercaLibro
  },
  data() {
    return {
      user: null,
      libri: [], // Lista dei libri posseduti dall'utente
      selectedLibro: null, // Libro selezionato per la modifica
      showDisponibilitaPopup: false, // Stato del popup di disponibilità
      showCercaLibroPopup1: false, // Stato del popup CercaLibro
      showCercaLibroPopup2: false, // Stato del popup CercaLibro
      message: '', // Messaggio di feedback per l'utente
      messageType: '' // Tipo di messaggio (successo o errore)
    };
  },
  async created() {
    // Quando il componente è creato, carica l'utente corrente e i suoi libri
    this.user = auth.currentUser;
    if (this.user) {
      await this.loadLibri();
    } else {
      // Aggiungi un listener per l'autenticazione se l'utente non è ancora disponibile
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.user = user;
          await this.loadLibri();
        }
      });
    }
  },
  methods: {
    async loadLibri() {
      // Carica i libri dell'utente corrente dal database
      try {
        const libriSnapshot = await getDocs(query(collection(db, 'libri'), where('userId', '==', this.user.uid)));
        this.libri = libriSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), showDisponibilitaMenu: false }));
      } catch (error) {
        console.error('Errore durante il caricamento dei libri:', error);
      }
    },
    async rimuoviLibro(libroId) {
      // Rimuove un libro dal database
      try {
        await deleteDoc(doc(db, 'libri', libroId));
        this.message = 'Libro rimosso con successo';
        this.messageType = 'success';
        await this.loadLibri(); // Ricarica la lista dei libri dopo la rimozione
      } catch (error) {
        console.error('Errore durante la rimozione del libro:', error);
        this.message = 'Errore durante la rimozione del libro';
        this.messageType = 'error';
      }
    },
    async updateDisponibilita(libroId) {
      try {
        console.log('SelectedLibro prima di aggiornare la disponibilità:', this.selectedLibro);
        if (!this.selectedLibro) {
          console.log('SelectedLibro è null prima di aggiornare la disponibilità');
          return;
        }

        const libroRef = doc(db, 'libri', libroId);
        const updateData = {
          prestito: this.selectedLibro.prestito,
          scambio: this.selectedLibro.scambio,
          regalo: this.selectedLibro.regalo,
          scambioLibro: this.selectedLibro.scambioLibro
        };
        // Aggiorna il documento nel database
        console.log('Update data:', updateData); // Log per il debug
        await updateDoc(libroRef, updateData);
        this.message = 'Disponibilità aggiornata con successo';
        this.messageType = 'success';

        // Verifica se il libro aggiornato è presente tra i desiderati di altri utenti
        if (this.selectedLibro) {
          console.log('SelectedLibro prima del controllo dei libri desiderati:', this.selectedLibro);
          await this.checkLibriDesiderati(this.selectedLibro);
        } else {
          console.log('SelectedLibro è null dopo aver aggiornato la disponibilità:', this.selectedLibro);
        }

        this.closeDisponibilitaPopup();
      } catch (error) {
        console.error('Errore durante l\'aggiornamento della disponibilità:', error);
        this.message = 'Errore durante l\'aggiornamento della disponibilità';
        this.messageType = 'error';
      }
    },
    async toggleDisponibilitaMenu(libro) {
      // Mostra il popup di disponibilità e carica i dettagli del libro selezionato
      try {
        console.log('Toggle disponibilità per libro:', libro);
        const libroRef = doc(db, 'libri', libro.id);
        const libroSnapshot = await getDoc(libroRef);
        if (libroSnapshot.exists()) {
          const libroData = libroSnapshot.data();
          this.selectedLibro = {
            ...libroData,
            id: libro.id,
            scambioLibro: libroData.scambioLibro || [false, '', '', '', '', '', '']
          };
          console.log('Libro selezionato:', this.selectedLibro);
          this.showDisponibilitaPopup = true;
        } else {
          console.log('Nessun documento trovato per il libro con id:', libro.id);
        }
      } catch (error) {
        console.error('Errore durante il caricamento dei dettagli del libro:', error);
      }
    },
    closeDisponibilitaPopup() {
      // Chiude il popup di disponibilità
      this.showDisponibilitaPopup = false;
      this.selectedLibro = null;
    },
    checkScambioLibro() {
      // Mostra il popup CercaLibro se il flag scambioLibro è selezionato
      if (this.selectedLibro.scambioLibro[0]) {
        this.showCercaLibroPopup2 = true;
      } else {
        this.selectedLibro.scambioLibro = [false, '', '', '', '', '', ''];
      }
    },
    async aggiungiLibro(nuovoLibro) {
      // Aggiunge i dettagli del libro selezionato all'array scambioLibro
      try {
        console.log('Libro selezionato per scambio:', nuovoLibro); // Log per il debug
        this.selectedLibro.scambioLibro = [
          true,
          nuovoLibro.titolo || '',
          nuovoLibro.autore || '',
          nuovoLibro.annoPubblicazione || '',
          nuovoLibro.genere || '',
          nuovoLibro.descrizione || '',
          nuovoLibro.isbn || ''
        ];
        console.log('Scambio libro aggiornato:', this.selectedLibro.scambioLibro); // Log per il debug
        this.showCercaLibroPopup2 = false;
        await this.updateDisponibilita(this.selectedLibro.id); // Aggiorna la disponibilità del libro su Firebase
      } catch (error) {
        console.error('Errore durante il salvataggio dei dettagli del libro di scambio:', error);
      }
    },
    async aggiungiNuovoLibro(nuovoLibro) {
      // Aggiunge un nuovo libro al database
      try {
        const user = auth.currentUser;
        if (user) {
          nuovoLibro.userId = user.uid; // Aggiungi l'ID dell'utente al libro
          const libroRef = await addDoc(collection(db, 'libri'), nuovoLibro);
          // Aggiungi il libro alla lista locale con l'ID ottenuto da Firebase
          this.libri.push({ id: libroRef.id, ...nuovoLibro });
          this.message = 'Libro aggiunto con successo';
          this.messageType = 'success';
          this.showCercaLibroPopup1 = false;
        }
      } catch (error) {
        console.error('Errore durante l\'aggiunta del libro:', error);
        this.message = 'Errore durante l\'aggiunta del libro';
        this.messageType = 'error';
      }
    },
    closeCercaLibroPopup() {
      // Chiude il popup CercaLibro
      this.showCercaLibroPopup1 = false;
      this.showCercaLibroPopup2 = false;
    },
    async checkLibriDesiderati(libro) {
      try {
        console.log('Controllo libri desiderati per il libro:', libro);
        if (!libro || !libro.titolo || !libro.autore) {
          console.log('Il libro è null o non ha titolo o autore:', libro);
          return;
        }

        // Recupera tutti i libri desiderati
        const desideratiSnapshot = await getDocs(collection(db, 'libriDesiderati'));
        for (const desideratoDoc of desideratiSnapshot.docs) {
          const desiderato = desideratoDoc.data();
          console.log('Verifica libro desiderato:', desiderato);
          // Controlla se il libro aggiornato corrisponde a uno dei libri desiderati (per titolo o autore)
          if ((libro.titolo.toLowerCase() === desiderato.titolo.toLowerCase()) || (libro.autore.toLowerCase() === desiderato.autore.toLowerCase())) {
            console.log('Trovata corrispondenza:', libro, desiderato);
            // Recupera il nickname dell'utente che ha desiderato il libro
            const userDoc = await getDoc(doc(db, 'users', desiderato.userId));
            if (userDoc.exists()) {
              const userNickname = userDoc.data().nickname || 'Sconosciuto';
              // Crea un messaggio di notifica su Firebase
              await addDoc(collection(db, 'messages'), {
                to: userNickname, // Nickname dell'utente che ha desiderato il libro
                from: 'admin',
                message: `Il libro "${libro.titolo}" presente nella tua Biblioteca dei desideri è ora disponibile! Effettua una ricerca e scopri se il proprietario ${this.user.displayName} appartiene alla tua community!`,
                timestamp: new Date(),
                read: false
              });
              console.log('Notifica inviata a:', userNickname);
            } else {
              console.log('Documento utente non trovato per userId:', desiderato.userId);
            }
          }
        }
      } catch (error) {
        console.error('Errore durante il controllo dei libri desiderati:', error);
      }
    }
  }
};
</script>

<style scoped>
.libri-posseduti-container {
  text-align: left;
  width: 100%;
}

.libro-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 1px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  width: 100%;
}

h4 {
  margin-bottom: 10px;
}
</style>




