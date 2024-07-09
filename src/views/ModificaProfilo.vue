<template>
  <div class="modifica-profilo">
    <h2>Modifica Profilo</h2>

    <!-- Visualizza i campi del profilo utente con spazi tra etichetta e testo -->
    <div>
      <label>Nickname:   </label>
      <span><strong>{{ nickname }}</strong> <br> Rating: <strong>{{ rating }}</strong></span>
    </div>

    <div>
      <label>Nome:   </label>
      <span><strong>{{ nome }}</strong></span>
    </div>

    <div>
      <label>Cognome:   </label>
      <span><strong>{{ cognome }}</strong></span>
    </div>

    <div>
      <label>Numero di telefono:   </label>
      <span><strong>{{ telefono }}</strong></span>
    </div>

    <!-- Menu a tendina per selezionare il campo da aggiornare -->
    <div>
      <label>Seleziona il campo da aggiornare:    </label>
      <select v-model="selectedField">
        <option value="nickname">Nickname</option>
        <option value="telefono">Numero di Telefono</option>
      </select>
      <button @click="openPopup">Modifica</button>
    </div>

    <!-- Messaggio di stato -->
    <div v-if="message" :class="{ 'success-message': messageType === 'success', 'error-message': messageType === 'error' }">
      {{ message }}
    </div>

    <!-- Popup per la modifica del campo selezionato -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <h3>Modifica {{ selectedFieldLabel }}</h3>
        <input type="text" v-model="fieldValue" placeholder="Inserisci nuovo valore" />
        <button @click="updateField">Salva</button>
        <button @click="closePopup">Annulla</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase'; // Importa l'autenticazione e il database di Firebase
import { updateDoc, doc, getDoc } from 'firebase/firestore'; // Importa le funzioni Firestore necessarie

export default {
  name: 'ModificaProfilo',
  data() {
    return {
      user: null, // Utente attualmente autenticato
      nickname: '', // Nickname dell'utente
      nome: '', // Nome dell'utente
      cognome: '', // Cognome dell'utente
      telefono: '', // Numero di telefono dell'utente
      rating: 'N/A', // Rating dell'utente
      selectedField: '', // Campo selezionato per la modifica
      fieldValue: '', // Nuovo valore del campo
      showPopup: false, // Mostra/nascondi popup
      message: '', // Messaggio di stato
      messageType: '' // Tipo di messaggio (successo/errore)
    };
  },
  computed: {
    selectedFieldLabel() {
      switch (this.selectedField) {
        case 'nickname':
          return 'Nickname';
        case 'telefono':
          return 'Numero di Telefono';
        default:
          return '';
      }
    }
  },
  methods: {
    openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.fieldValue = '';
    },
    async updateField() {
      if (this.user) {
        try {
          const userRef = doc(db, 'users', this.user.uid);
          await updateDoc(userRef, {
            [this.selectedField]: this.fieldValue
          });
          // Aggiorna i dati modificati
          this[this.selectedField] = this.fieldValue;

          this.message = 'Campo aggiornato con successo!';
          this.messageType = 'success';
          this.closePopup();
        } catch (error) {
          this.message = 'Errore durante l\'aggiornamento del campo.';
          this.messageType = 'error';
        }
      }
    }
  },
  async mounted() {
    // Ottiene l'utente attualmente autenticato
    this.user = auth.currentUser;
    // Verifica se l'utente è autenticato
    if (this.user) {
      // Crea un riferimento al documento dell'utente nel database Firebase
      const userRef = doc(db, 'users', this.user.uid);
      // Ottiene il documento dell'utente dal database
      const userSnap = await getDoc(userRef);
      // Verifica se il documento dell'utente esiste
      if (userSnap.exists()) {
        // Estrae i dati dell'utente dal documento
        const userData = userSnap.data();
        // Assegna i dati dell'utente alle proprietà del componente
        this.nickname = userData.nickname || '';
        this.nome = userData.nome || '';
        this.cognome = userData.cognome || '';
        this.telefono = userData.telefono || '';
        this.rating = userData.rating || 'N/A'; // Aggiungi il recupero del rating
      }
    }
  }

};
</script>

<style scoped>
.modifica-profilo {
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: left;
  line-height: 2em;
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
}
button {
  margin-left: 5px;
}
</style>

