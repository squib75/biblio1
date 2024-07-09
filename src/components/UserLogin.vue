<template>
  <div class="login-popup">
    <h2>Accesso</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required autocomplete="email" />
      </div>
      <div class="password-container">
        <label for="password">Password:</label>
        <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" required autocomplete="current-password" />
        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="toggle-visibility" @click="togglePasswordVisibility" />
      </div>
      <button type="submit">Login</button>
    </form>
    <p @click="$emit('switch-view', 'register')" class="switch-view">Registrati</p>
    <p @click="$emit('switch-view', 'forgot')" class="switch-view">Password dimenticata?</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>


// UserLogin.vue
<script>
import { auth, db } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      showPassword: false // Variabile per gestire la visibilità della password
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
          // Ottieni il numero di messaggi non letti
          const unreadMessagesQuery = query(collection(db, 'messages'), where('to', '==', userData.nickname), where('read', '==', false));
          const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
          const unreadCount = unreadMessagesSnapshot.size;

          this.$emit('login', { nickname: userData.nickname, unreadCount }); // Passa il nickname e il conteggio dei messaggi non letti
        } else {
          this.errorMessage = 'Utente non trovato.';
        }
      } catch (error) {
        this.errorMessage = 'Errore durante il login. Verifica le credenziali.';
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  }
};
</script>


<style scoped>
.login-popup {
  background-color: white;
  padding: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  box-sizing: border-box;
  font-size: 1.2em;
  text-align: left;
}

.login-popup h2 {
  margin-top: 0;
  font-size: 1.5rem;
  text-align: center;
}

.login-popup form {
  display: flex;
  flex-direction: column;
}

.login-popup label {
  margin-top: 10px;
  margin-right: 5px;
  font-weight: bold;
  font-size: 1rem;
}

.login-popup input {
  position: absolute;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 2px;
  font-size: 1rem;
  right: 5px;
  margin: 0 5px 100px 0;
  width: 68%;
}

.password-container {
  position: relative;
  margin: 20px -10px 20px 0;
}

.password-container input {
  width: 70%;
}

.toggle-visibility {
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  font-size: 1.3vw;
}

.login-popup button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.login-popup button:hover {
  background-color: #218838;
}


.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>

