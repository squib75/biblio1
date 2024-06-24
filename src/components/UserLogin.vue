<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p @click="$emit('switch-view', 'UserRegister')">Non hai un account? Registrati</p>
      <p @click="$emit('switch-view', 'UserPasswordForgot')">Password dimenticata?</p>
    </form>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$emit('close');
      } catch (error) {
        this.errorMessage = 'Email o password non corretti.';
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
}
/* Stili per i campi input */
input {
  width: calc(100% - 20px); /* Riduce la larghezza per mantenere il padding interno */
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 3px;
}

/* Stili per i pulsanti */
button {
  width: calc(100% - 20px); /* Riduce la larghezza per mantenere il padding interno */
  padding: 10px;
  background: #b8fa7e;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background: #a2e36a;
}

/* Stili per i link */
p {
  cursor: pointer;
  color: #007bff;
  margin: 10px 0 0;
}

p:hover {
  text-decoration: underline;
}

</style>