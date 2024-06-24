<template>
  <div>
    <h2>Recupero Password</h2>
    <form @submit.prevent="resetPassword">
      <input type="email" v-model="email" placeholder="Email" required />
      <button type="submit">Reset Password</button>
      <p v-if="message" class="message">{{ message }}</p>
      <p @click="$emit('switch-view', 'UserLogin')">Torna al login</p>
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
      message: ''
    };
  },
  methods: {
    async resetPassword() {
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.message = 'Email per il reset della password inviata.';
      } catch (error) {
        this.message = 'Errore nell\'invio dell\'email.';
      }
    }
  }
};
</script>

<style scoped>
.message {
  color: green;
  font-size: 0.9em;
}
</style>
