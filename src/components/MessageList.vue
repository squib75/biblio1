<template>
  <div class="message-list-popup">
    <h2>Messaggi Ricevuti</h2>
    <ul>
      <li v-for="(message, index) in messages" :key="index">
        Da: {{ message.from }} - Messaggio: {{ message.message }}
      </li>
    </ul>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  props: ['nickname'], // Assicurati che il nickname sia passato come prop
  data() {
    return {
      messages: [],
      errorMessage: ''
    };
  },
  async created() {
    await this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      try {
        // Controlla se il nickname è definito
        if (!this.nickname) {
          this.errorMessage = 'Nickname non definito.';
          return;
        }

        // Aggiungi log per verificare il nickname
        console.log("Nickname:", this.nickname);

        const q = query(collection(db, 'messages'), where('to', '==', this.nickname));
        const querySnapshot = await getDocs(q);
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push(doc.data());
        });
        this.messages = messages;
      } catch (error) {
        console.error("Errore durante il recupero dei messaggi: ", error);
        this.errorMessage = 'Errore durante il recupero dei messaggi.';
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

.error {
  color: red;
}
</style>

