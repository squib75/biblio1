<template>
  <div class="message-view-popup">
    <!-- Contenitore per il pulsante di chiusura -->
    <div class="close-container">
      <span class="close" @click="$emit('close')">&times;</span>
    </div>
    <!-- Contenitore per i componenti MessageList e MessageForm -->
    <div class="message-container">
      <MessageList :nickname="nickname" class="message-list" />
      <MessageForm class="message-form" />
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
  props: ['nickname'], // Riceve il nickname come prop
};
</script>

<style scoped>
/* Stile principale per il popup della vista messaggi */
.message-view-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(224, 231, 243);
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  height: 50%;
  max-width: 1200px;
  box-sizing: border-box;
  border: solid black 2px;
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
  border: 1px solid #ccc;
  padding: 2px;
  border-radius: 1px;
}

/* Contenitore per disporre i componenti MessageList e MessageForm affiancati */
.message-container {
  display: flex;
  gap: 10px;
}

/* Stile per il componente MessageList */
.message-list {
  flex: 1;
}

/* Stile per il componente MessageForm */
.message-form {
  flex: 1;
}

/* Stile per i messaggi di successo */
.success {
  color: green;
}

/* Stile per i messaggi di errore */
.error {
  color: red;
}

/* Stile per il campo textarea */
textarea {
  width: 100%;
  height: 100px;
}
</style>
