<template>
  <div class="message-list-popup">
    <h2>Invia un Messaggio</h2>
    <form @submit.prevent="sendMessage">
      <div>
        <label for="to">A:</label>
        <input type="text" v-model="to" id="to" autocomplete="username" required />
      </div>
      <div>
        <label for="message">Messaggio:</label>
        <textarea v-model="message" id="message" autocomplete="off" required maxlength="500"></textarea>
        <small class="char-limit">Max 500 caratteri</small>
      </div>
      <button type="submit">Invia</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  props: ['nickname'],
  data() {
    return {
      to: '',
      message: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async sendMessage() {
      try {
        console.log("Dati di input:", this.to, this.message);

        if (!this.to || !this.message) {
          this.errorMessage = 'Tutti i campi sono obbligatori.';
          return;
        }

        console.log("Tentativo di verifica del destinatario...");

        // Verifica se il destinatario esiste
        const q = query(collection(db, 'users'), where('nickname', '==', this.to));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          this.errorMessage = 'Il destinatario non esiste.';
          return;
        }

        console.log("Destinatario verificato. Tentativo di aggiunta del documento...");

        const docRef = await addDoc(collection(db, 'messages'), {
          to: this.to,
          from: this.nickname,
          message: this.message,
          timestamp: new Date()
        });

        console.log("Document written with ID: ", docRef.id);

        this.to = '';
        this.message = '';
        this.successMessage = 'Messaggio inviato con successo.';
        this.errorMessage = '';
      } catch (error) {
        console.error("Errore durante l'invio del messaggio: ", error);
        this.errorMessage = 'Errore durante l\'invio del messaggio.';
        this.successMessage = '';
      }
    }
  }
};
</script>

<style scoped>
/* Contenitore principale per il modulo di invio messaggi */
.message-list-popup {
  border-top: 0;
  padding: 0;
}

/* Stile per il titolo */
.message-list-popup h2 {
  border-top: 0;
  padding: 0;
  font-size: 1.6vw;
}

/* Stile per le etichette */
label {
  display: block;
  font-weight: bold;
  text-align: left;
  margin: 10px 0 5px 0;
}

/* Stile per i campi di input */
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Stile per il campo textarea */
textarea {
  width: 100%;
  height: 10vw; /* Adatta l'altezza in base alla viewport width */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: none; /* Disabilita il ridimensionamento manuale */
}

/* Stile per il pulsante di invio */
button {
  width: 30%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.6vw;
}

button:hover {
  background-color: #218838;
}

/* Stile per il messaggio di successo */
.success {
  color: green;
  margin-top: 10px;
}

/* Stile per il messaggio di errore */
.error {
  color: red;
  margin-top: 10px;
}

/* Stile per la didascalia che indica il limite di caratteri */
.char-limit {
  display: block;
  font-size: 0.8em;
  color: #666;
  margin-top: 5px;
}
</style>
