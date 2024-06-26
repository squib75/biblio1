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
        <textarea v-model="message" id="message" autocomplete="off" required></textarea>
      </div>
      <button type="submit">Invia</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
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
        // Aggiungi log per verificare i dati di input
        console.log("Dati di input:", this.to, this.message);

        // Verifica se i campi sono vuoti
        if (!this.to || !this.message) {
          this.errorMessage = 'Tutti i campi sono obbligatori.';
          return;
        }

        // Aggiungi log per verificare il tentativo di aggiunta del documento
        console.log("Tentativo di aggiunta del documento...");

        // Verifica se il destinatario esiste
        const docRef = await addDoc(collection(db, 'messages'), {
          to: this.to,
          message: this.message,
          timestamp: new Date()
        });

        // Aggiungi log per verificare l'avvenuta aggiunta del documento
        console.log("Document written with ID: ", docRef.id);

        // Pulisci i campi e mostra il messaggio di successo
        this.to = '';
        this.message = '';
        this.successMessage = 'Messaggio inviato con successo.';
        this.errorMessage = '';
      } catch (error) {
        // Aggiungi log per verificare l'errore
        console.error("Errore durante l'invio del messaggio: ", error);
        this.errorMessage = 'Errore durante l\'invio del messaggio.';
        this.successMessage = '';
      }
    }
  }
};
</script>

<style scoped>
.message-list-popup {
  border-top: 0;
  padding: 0;
}
.message-list-popup h2 {
  border-top: 0;
  padding: 0;
  font-size: 1.6vw;
}
.message-list-popup li {
  border: 0;
  padding: 0;
  font-size: 1.2vw;
  text-align: left;
}
/* Stili per le etichette */
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

/* Stili per i campi di input e textarea */
input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* Stili per il pulsante di invio */
button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}

/* Stili per il messaggio di successo */
.success {
  color: green;
  margin-top: 10px;
}

/* Stili per il messaggio di errore */
.error {
  color: red;
  margin-top: 10px;
}
</style>
