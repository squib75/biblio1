<template>
  <div class="password-reset-popup">
    <h2>Recupero Password</h2>
    <form @submit.prevent="resetPassword">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" placeholder="Email" required />
      </div>
      <button type="submit">Reset Password</button>
      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p @click="$emit('switch-view', 'login')" class="switch-view">Torna al login</p>
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
.password-reset-popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  box-sizing: border-box;
  font-size: 1.2rem;
}

.password-reset-popup h2 {
  margin-top: 0;
  font-size: 1.5rem;
  text-align: center;
}

.password-reset-popup form {
  display: flex;
  flex-direction: column;
}

.password-reset-popup label {
  margin-top: 10px;
  margin-right: 5px;
  font-weight: bold;
}

.password-reset-popup input {
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.password-reset-popup button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.password-reset-popup button:hover {
  background-color: #218838;
}


.success {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>

