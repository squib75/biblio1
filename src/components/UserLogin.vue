<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p @click="$emit('switch-view', 'register')">Non hai un account? Registrati</p>
      <p @click="$emit('switch-view', 'forgot')">Password dimenticata?</p>
    </form>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Recupera il nickname dal Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.$emit('login', userData.nickname); // Passa il nickname
        } else {
          this.errorMessage = 'Utente non trovato.';
        }
      } catch (error) {
        this.errorMessage = 'Errore durante il login. Verifica le credenziali.';
      }
    }
  }
};
</script>

<style scoped>
/* Aggiungi gli stili necessari qui, se necessario */
</style>
