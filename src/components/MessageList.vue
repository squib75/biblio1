<template>
  <!-- Contenitore principale per la lista dei messaggi -->
  <div class="message-list-popup">
    <h2><b>Messaggi Ricevuti</b></h2>
    <ul class="message-list">
      <!-- Ciclo sui messaggi per creare la lista -->
      <li
          v-for="(message) in sortedMessages"
          :key="message.id"
          class="message-item"
          :class="{ expanded: expandedId === message.id, read: message.read }"
          @click="toggleMessage(message.id)"
          @contextmenu.prevent="confirmDelete(message.id)"
      >
      <label :for="'message-' + message.id">
        <!-- Mostra il mittente del messaggio -->
        <b>Da:</b> <i>{{ message.from }} </i>
        <!-- Mostra la data e ora del messaggio -->
        <b> Data e Ora:</b> <i>{{ new Date(message.timestamp.seconds * 1000).toLocaleString() }}</i>
        <!-- A capo -->
        <br><br>
        <!-- Mostra il contenuto del messaggio solo se espanso -->
        <p v-if="expandedId === message.id"><i>{{ message.message }}</i></p>
      </label>
      </li>
    </ul>
    <!-- Mostra eventuali messaggi di errore -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  // Riceve il nickname come prop
  props: ['nickname'],
  data() {
    return {
      messages: [], // Array per memorizzare i messaggi ricevuti
      errorMessage: '', // Messaggio di errore
      expandedId: null // Identificatore del messaggio espanso
    };
  },
  // Fetch dei messaggi al montaggio del componente
  async created() {
    await this.fetchMessages();
  },
  methods: {
    // Metodo per recuperare i messaggi
    async fetchMessages() {
      try {
        // Controlla se il nickname è definito
        if (!this.nickname) {
          this.errorMessage = 'Nickname non definito.';
          return;
        }

        console.log("Nickname:", this.nickname);

        // Query per recuperare i messaggi indirizzati al nickname
        const q = query(collection(db, 'messages'), where('to', '==', this.nickname));
        const querySnapshot = await getDocs(q);
        const messages = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          messageData.id = doc.id; // Aggiungi l'identificatore del documento
          messages.push(messageData);
        });
        this.messages = messages;
      } catch (error) {
        console.error("Errore durante il recupero dei messaggi: ", error);
        this.errorMessage = 'Errore durante il recupero dei messaggi.';
      }
    },
    // Metodo per espandere o comprimere un messaggio
    async toggleMessage(id) {
      const message = this.messages.find(msg => msg.id === id);
      if (this.expandedId === id) {
        // Se il messaggio è già espanso, comprimi e segna come letto
        this.expandedId = null;
      } else {
        // Espandi solo il messaggio cliccato
        this.expandedId = id;
      }

      // Segna il messaggio come letto e aggiorna nel database
      if (!message.read) {
        message.read = true;
        await updateDoc(doc(db, 'messages', id), { read: true });
      }
    },
    // Metodo per confermare la cancellazione di un messaggio
    async confirmDelete(id) {
      if (confirm("Sei sicuro di voler eliminare questo messaggio?")) {
        await this.deleteMessage(id);
      }
    },
    // Metodo per cancellare un messaggio
    async deleteMessage(id) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        this.messages = this.messages.filter(msg => msg.id !== id);
      } catch (error) {
        console.error("Errore durante la cancellazione del messaggio: ", error);
        this.errorMessage = 'Errore durante la cancellazione del messaggio.';
      }
    }
  },
  computed: {
    // Computed property per ordinare i messaggi dal più recente al meno recente
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
  padding: 0;
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
  font-size: 1.3vw;
  align-items: flex-start; /* Allineamento degli elementi all'inizio */
  margin-bottom: 5px; /* Spaziatura inferiore tra gli elementi */
  text-align: left; /* Allineamento del testo a sinistra */
  white-space: pre-wrap; /* Per andare a capo nel testo */
  overflow-wrap: break-word; /* Per gestire l'overflow del testo */
  padding-top: 10px; /* Padding interno */
  padding-left: 5px;
  background-color: #a8bca8; /* Colore di sfondo iniziale */
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
  background-color: #6e756c; /* Mantiene il colore rosso dopo aver letto */
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
</style>
