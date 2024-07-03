<template>
  <div class="libri-desiderati-container">
    <div class="libri-list">
      <div class="header">
      <h3>Libri desiderati</h3>
      <button @click="showCercaLibroPopup = true">Aggiungi libro</button>
      </div>

      <div v-for="(libro, index) in libriDesiderati" :key="index" class="libro-item">
        <div><i>
        <strong>{{ libro.titolo }}</strong> di {{ libro.autore }}
        <span v-if="libro.annoPubblicazione"> ({{ libro.annoPubblicazione }})</span>
        </i></div>
        <div class="button-group">
        <button @click="rimuoviLibro(libro.id)">Rimuovi</button>
        </div>
      </div>
    </div>
<!-- Popup per CercaLibro -->
    <div v-if="showCercaLibroPopup" class="popup">
      <div class="popup-content">
      <CercaLibro @aggiungi-libro="aggiungiLibro" />
      <button @click="closeCercaLibroPopup">Chiudi</button>
      </div>
    </div>
  </div>
  <div>
  <CercaLibriCommunity />
  </div>
</template>


<script>
import { db, auth } from '@/firebase';
import { collection, getDocs, query, where, deleteDoc, doc, addDoc } from 'firebase/firestore';
import CercaLibro from '@/components/CercaLibro.vue';
import CercaLibriCommunity from "@/components/CercaLibroCommunity.vue";

export default {
  name: 'LibriDesiderati',
  components: {
    CercaLibriCommunity,
    CercaLibro
  },
  data() {
    return {
      user: null,
      libriDesiderati: [],
      message: '',
      messageType: '',
      showCercaLibroPopup: false, // Stato del popup CercaLibro
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      this.user = user;
      await this.loadLibri();
    }
  },
  methods: {
    async loadLibri() {
      try {
        const libriSnapshot = await getDocs(query(collection(db, 'libriDesiderati'), where('userId', '==', this.user.uid)));
        this.libriDesiderati = libriSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
      } catch (error) {
        console.error('Errore durante il caricamento dei libri:', error);
      }
    },
    async rimuoviLibro(libroId) {
      try {
        await deleteDoc(doc(db, 'libriDesiderati', libroId));
        this.message = 'Libro rimosso con successo';
        this.messageType = 'success';
        await this.loadLibri();
      } catch (error) {
        console.error('Errore durante la rimozione del libro:', error);
        this.message = 'Errore durante la rimozione del libro';
        this.messageType = 'error';
      }
    },
    async aggiungiLibro(nuovoLibro) {
      try {
        // Aggiungi il libro a Firebase
        const user = auth.currentUser;
        if (user) {
          nuovoLibro.userId = user.uid; // Aggiungi l'ID dell'utente al libro
          const libroRef = await addDoc(collection(db, 'libriDesiderati'), nuovoLibro);
          // Aggiungi il libro alla lista locale con l'ID ottenuto da Firebase
          this.libriDesiderati.push({ id: libroRef.id, ...nuovoLibro });
          this.message = 'Libro aggiunto con successo';
          this.messageType = 'success';
          this.showCercaLibroPopup = false;
        }
      } catch (error) {
        console.error('Errore durante l\'aggiunta del libro:', error);
        this.message = 'Errore durante l\'aggiunta del libro';
        this.messageType = 'error';
      }
    },
    closeCercaLibroPopup() {
      // Chiude il popup CercaLibro
      this.showCercaLibroPopup = false;
    }

  },
};
</script>

<style scoped>
.libri-desiderati-container {
  text-align: left;
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
.header {
  display: flex;
  justify-content: space-between;
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


