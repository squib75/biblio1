<template>
  <div>
    <h2>Registrazione</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <input type="email" v-model="email" placeholder="Email" required />
        <span class="asterisk">*</span>
      </div>
      <div class="input-group">
        <input type="password" v-model="password" placeholder="Password" required @input="validatePassword" />
        <span class="asterisk">*</span>
        <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" @click="togglePasswordVisibility" />
      </div>
      <div class="input-group">
        <input type="password" v-model="confirmPassword" placeholder="Conferma Password" required />
        <span class="asterisk">*</span>
        <font-awesome-icon :icon="showConfirmPassword ? 'eye' : 'eye-slash'" @click="toggleConfirmPasswordVisibility" />
      </div>
      <div class="input-group">
        <input type="text" v-model="nickname" placeholder="Nickname" required />
        <span class="asterisk">*</span>
      </div>
      <div class="input-group">
        <input type="text" v-model="nome" placeholder="Nome" required />
        <span class="asterisk">*</span>
      </div>
      <div class="input-group">
        <input type="text" v-model="cognome" placeholder="Cognome" required />
        <span class="asterisk">*</span>
      </div>
      <div class="input-group">
        <input type="tel" v-model="telefono" placeholder="Telefono" required />
        <span class="asterisk">*</span>
      </div>
      <button type="submit">Registrati</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p @click="$emit('switch-view', 'UserLogin')">Hai già un account? Login</p>
    </form>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      nome: '',
      cognome: '',
      telefono: '',
      errorMessage: '',
      successMessage: '',
      showPassword: false,
      showConfirmPassword: false
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async register() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Le password non corrispondono.';
        return;
      }
      if (this.errorMessage) {
        return;
      }

      // Verifica se il nickname esiste già
      const q = query(collection(db, "users"), where("nickname", "==", this.nickname));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        this.errorMessage = 'Il nickname è già in uso.';
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          nickname: this.nickname,
          nome: this.nome,
          cognome: this.cognome,
          telefono: this.telefono,
          email: this.email // salva anche l'email dell'utente
        });
        this.successMessage = 'Registrazione avvenuta con successo.';
        this.$emit('close');
      } catch (error) {
        this.errorMessage = 'Errore durante la registrazione: ' + error.message;
      }
    },
    validatePassword() {
      const password = this.password;
      if (password.length < 6) {
        this.errorMessage = 'La password deve essere di almeno 6 caratteri.';
      } else if (!/[a-z]/.test(password)) {
        this.errorMessage = 'La password deve contenere almeno una lettera minuscola.';
      } else if (!/[A-Z]/.test(password)) {
        this.errorMessage = 'La password deve contenere almeno una lettera maiuscola.';
      } else if (!/[0-9]/.test(password)) {
        this.errorMessage = 'La password deve contenere almeno un numero.';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        this.errorMessage = 'La password deve contenere almeno un carattere speciale.';
      } else {
        this.errorMessage = '';
      }
    }
  }
};
</script>

<style scoped>
.asterisk {
  color: red;
}
.success {
  color: green;
  font-size: 0.9em;
}
.error {
  color: red;
  font-size: 0.9em;
}
.input-group {
  display: flex;
  align-items: center;
}
input {
  flex: 1;
}
</style>


