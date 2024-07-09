<template>
  <div id="app" class="app-container">
    <!-- Menu orizzontale visibile su tutte le pagine -->
    <HorizontalMenu :user="user" />
    <main class="content">
      <!-- Router view per caricare le viste dinamicamente -->
      <router-view />
    </main>
    <FooterBase />
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import HorizontalMenu from './components/HorizontalMenu.vue';
import FooterBase from "@/components/FooterBase.vue";

export default {
  name: 'App',
  components: {
    FooterBase,
    HorizontalMenu
  },
  data() {
    return {
      user: null // Variabile per memorizzare lo stato dell'utente autenticato
    };
  },
  created() {
    console.log('Componente App creato');
    // Recupera lo stato dell'utente da localStorage se presente
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      console.log('Utente recuperato da localStorage:', savedUser);
      this.user = JSON.parse(savedUser);
    }

// Listener per monitorare lo stato di autenticazione dell'utente
    onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged chiamato');
      if (user) {
        console.log('Utente autenticato:', user);
        // Se l'utente è autenticato, aggiorna la variabile 'user' e salva lo stato in localStorage
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        console.log('Utente non autenticato');
        // Se l'utente non è autenticato, imposta 'user' a null e rimuove lo stato da localStorage
        this.user = null;
        localStorage.removeItem('user');
      }
    });
  }
};
</script>

<style>
/* Gli stili sono gestiti in /assets/styles.css */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  width: 100%;
}
</style>

