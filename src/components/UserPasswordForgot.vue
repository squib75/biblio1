<template>
  <div>
    <h2>Recupero Password</h2>
    <form @submit.prevent="resetPassword">
      <input type="email" v-model="email" placeholder="Email" required />
      <button type="submit">Reset Password</button>
      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p @click="$emit('switch-view', 'login')">Torna al login</p>
    </form>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      message: '',
      errorMessage: ''
    };
  },
  methods: {
    async resetPassword() {
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.message = 'Email di reset della password inviata.';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Errore durante il reset della password.';
        this.message = '';
      }
    }
  }
};
</script>

<style scoped>
/* Aggiungi gli stili necessari qui, se necessario */
</style>
