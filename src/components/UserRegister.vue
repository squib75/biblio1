<template>
  <div>
    <h2>Registrazione</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <input type="email" v-model="email" placeholder="Email" required />
        <span class="asterisk">*</span>
      </div>
      <div class="input-group">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required @input="validatePassword" />
        <span class="asterisk">*</span>
        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" @click="togglePasswordVisibility('password')" />
      </div>
      <div class="input-group">
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Conferma Password" required />
        <span class="asterisk">*</span>
        <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" @click="togglePasswordVisibility('confirmPassword')" />
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
      <p @click="$emit('switch-view', 'login')">Hai già un account? Login</p>
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
    async register() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Le password non corrispondono.';
        return;
      }
      if (this.errorMessage) {
        return;
      }

      try {
        // Controlla se il nickname è già in uso
        const nicknameQuery = query(collection(db, 'users'), where('nickname', '==', this.nickname));
        const nicknameSnapshot = await getDocs(nicknameQuery);
        if (!nicknameSnapshot.empty) {
          this.errorMessage = 'Il nickname è già in uso.';
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          nickname: this.nickname,
          nome: this.nome,
          cognome: this.cognome,
          telefono: this.telefono
        });
        this.successMessage = 'Registrazione avvenuta con successo.';
        this.$emit('register', this.nickname); // Passa il nickname
      } catch (error) {
        this.errorMessage = 'Errore durante la registrazione.';
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
    },
    togglePasswordVisibility(field) {
      if (field === 'password') {
        this.showPassword = !this.showPassword;
      } else if (field === 'confirmPassword') {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    }
  }
};
</script>

<style scoped>
/* Aggiungi gli stili necessari qui, se necessario */
</style>
