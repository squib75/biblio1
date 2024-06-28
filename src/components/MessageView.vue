<template>
  <div class="message-view-popup">
    <div class="close-container">
      <span class="close" @click="$emit('close')">&times;</span>
    </div>
    <div class="message-container">
      <MessageList :nickname="nickname" @update-unread-count="updateUnreadCount" class="message-component"/>
      <MessageForm :nickname="nickname" class="message-component"/>
    </div>
  </div>
</template>

<script>
import MessageList from './MessageList.vue';
import MessageForm from './MessageForm.vue';

export default {
  components: {
    MessageList,
    MessageForm
  },
  props: ['nickname'],
  methods: {
    updateUnreadCount(count) {
      this.$emit('update-unread-count', count);
    }
  }
};
</script>

<style scoped>
/* Stile principale per il popup della vista messaggi */
.message-view-popup {
  position: fixed;
  width: 95vw; /* Adatta la larghezza del popup alla larghezza del viewport */
  height: 90vh; /* Adatta l'altezza del popup all'altezza del viewport */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(224, 231, 243);
  padding: 20px;
  border-radius: 4px;
  z-index: 1000;
  max-width: 1200px;
  max-height: 90vh;
  border: solid black 1px;
  box-sizing: border-box; /* Include padding e bordo nella dimensione totale */
}

/* Contenitore per il pulsante di chiusura */
.close-container {
  display: flex;
  justify-content: flex-end;
}

/* Stile per il pulsante di chiusura */
.close {
  cursor: pointer;
  font-size: 20px;
  border: 1px solid black;
  padding: 5px;
  border-radius: 3px;
}

/* Contenitore per disporre i componenti MessageList e MessageForm affiancati */
.message-container {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 40px); /* Altezza adattabile per riempire il contenitore */
  gap: 10px;
  overflow: hidden; /* Nasconde il contenuto in eccesso */
}

.message-component {
  width: 48%; /* Adatta la larghezza dei componenti per occupare tutto lo spazio disponibile */
  height: 100%;
  background-color: #e5f1e0;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Aggiunge una barra di scorrimento verticale se necessario */
}

/* Stile per il campo textarea */
textarea {
  width: 100%;
  height: 100px;
}
</style>
