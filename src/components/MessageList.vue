<template>
  <div class="message-list-popup">
    <h2><b>Messaggi Ricevuti</b></h2>
    <ul class="message-list">
      <li
          v-for="(message) in sortedMessages"
          :key="message.id"
          class="message-item"
          :class="{ expanded: expandedId === message.id, read: message.read }"
          @click="toggleMessage(message.id)"
          @contextmenu.prevent="confirmDelete(message.id)"
      >
        <label :for="'message-' + message.id">
          <b>Da:</b> <i>{{ message.from }}</i>
          <b> Data e Ora:</b> <i>{{ new Date(message.timestamp.seconds * 1000).toLocaleString() }}</i>
          <br><br>
          <p v-if="expandedId === message.id"><i>{{ message.message }}</i></p>
        </label>
        <button v-if="expandedId === message.id" @click.stop="replyMessage(message)">Rispondi</button>
      </li>
    </ul>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  props: ['nickname'],
  data() {
    return {
      messages: [],
      errorMessage: '',
      expandedId: null
    };
  },
  async created() {
    await this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      try {
        if (!this.nickname) {
          this.errorMessage = 'Nickname non definito.';
          return;
        }

        const q = query(collection(db, 'messages'), where('to', '==', this.nickname));
        const querySnapshot = await getDocs(q);
        const messages = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          messageData.id = doc.id;
          messages.push(messageData);
        });
        this.messages = messages;
        this.updateUnreadCount();
      } catch (error) {
        console.error("Errore durante il recupero dei messaggi: ", error);
        this.errorMessage = 'Errore durante il recupero dei messaggi.';
      }
    },
    toggleMessage(id) {
      const message = this.messages.find(msg => msg.id === id);
      if (this.expandedId === id) {
        this.expandedId = null;
      } else {
        this.expandedId = id;
      }
      if (!message.read) {
        updateDoc(doc(db, 'messages', id), { read: true });
        message.read = true;
        this.updateUnreadCount();
      }
    },
    confirmDelete(id) {
      if (confirm('Vuoi davvero eliminare questo messaggio?')) {
        this.deleteMessage(id);
      }
    },
    async deleteMessage(id) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        this.messages = this.messages.filter(msg => msg.id !== id);
        this.updateUnreadCount();
      } catch (error) {
        console.error('Errore durante l\'eliminazione del messaggio: ', error);
        this.errorMessage = 'Errore durante l\'eliminazione del messaggio.';
      }
    },
    replyMessage(message) {
      const replyContent = `\n\nRe: ${message.message}\n${new Date(message.timestamp.seconds * 1000).toLocaleString()}`;
      this.$emit('reply-message', { to: message.from, content: replyContent });
    },
    updateUnreadCount() {
      const unreadCount = this.messages.filter(msg => !msg.read).length;
      this.$emit('update-unread-count', unreadCount);
    }
  },
  computed: {
    sortedMessages() {
      return this.messages.slice().sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    }
  }
};
</script>

<style scoped>
/* Stile per il messaggio di errore */
.error {
  color: red;
}

/* Stile per il contenitore principale dei messaggi */
.message-list-popup {
  max-height: 500px; /* Definisce un'altezza massima per il contenitore */
  overflow-y: auto; /* Aggiunge una barra di scorrimento verticale */
}

/* Stile per il titolo della lista dei messaggi */
.message-list-popup h2 {
  padding: 0;
  font-size: 1.5vw;
}

/* Stile per la lista dei messaggi */
.message-list {
  list-style-type: none; /* Elimina elenco puntato */
  padding: 0; /* Rimuove il padding predefinito */
  margin: 0; /* Rimuove il margine predefinito */
}

/* Stile per ogni elemento della lista dei messaggi */
.message-item {
  font-size: 1.3rem;
  align-items: flex-start; /* Allineamento degli elementi all'inizio */
  margin-bottom: 5px; /* Spaziatura inferiore tra gli elementi */
  text-align: left; /* Allineamento del testo a sinistra */
  white-space: pre-wrap; /* Per andare a capo nel testo */
  overflow-wrap: break-word; /* Per gestire l'overflow del testo */
  padding: 10px; /* Padding interno */
  background-color: #bf731e; /* Colore di sfondo iniziale */
  cursor: pointer; /* Cambia il cursore al passaggio */
  transition: all 0.3s ease; /* Transizione per cambiamenti di stato */
}

/* Aggiunge una traslazione al passaggio del mouse */
.message-item:hover {
  transform: translateY(-3px);
}

/* Stile per l'elemento espanso */
.message-item.expanded {
  background-color: #cadaca; /* Colore di sfondo quando espanso */
  max-height: none; /* Permette l'espansione completa dell'elemento */
}

/* Stile per l'elemento letto */
.message-item.read {
  background-color: #679c57; /* Mantiene il colore rosso dopo aver letto */
}

/* Stile per i paragrafi all'interno degli elementi della lista */
.message-item p {
  margin: 0; /* Rimuove il margine predefinito dei paragrafi */
  white-space: pre-wrap; /* Per andare a capo nel testo */
  overflow-wrap: break-word; /* Per gestire l'overflow del testo */
  display: none; /* Nasconde il testo del messaggio */
}

/* Mostra il testo del messaggio se espanso */
.message-item.expanded p {
  display: block;
}

/* Stile per il pulsante Rispondi */
button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #34805a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
