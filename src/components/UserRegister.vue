<template>
  <div class="register-popup">
    <h2>Registrazione</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <input type="email" v-model="email" placeholder="Email" required />
        <span class="asterisk">*</span>
      </div>
      <div class="input-group">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" required @input="validatePassword" />
        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="toggle-visibility" @click="togglePasswordVisibility('password')" />
      </div>
      <div class="input-group">
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Conferma Password" required />
        <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="toggle-visibility" @click="togglePasswordVisibility('confirmPassword')" />
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
      <p @click="$emit('switch-view', 'login')" class="switch-view">Hai già un account? Login</p>
    </form>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, addDoc } from 'firebase/firestore';

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
      if (!this.validateEmail(this.email)) {
        this.errorMessage = 'Indirizzo email non valido.';
        return;
      }
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

        // Crea l'utente con email e password
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Aggiorna il profilo dell'utente con il nickname
        await updateProfile(user, {
          displayName: this.nickname
        });

        // Salva i dati aggiuntivi dell'utente nel database
        await setDoc(doc(db, 'users', user.uid), {
          nickname: this.nickname,
          email: this.email,
          nome: this.nome,
          cognome: this.cognome,
          telefono: this.telefono
        });

        // Invia un messaggio di benvenuto
        await addDoc(collection(db, 'messages'), {
          to: this.nickname,
          from: 'admin', // O un altro identificatore appropriato per il mittente
          message: 'Benvenuto! Segui le istruzioni per utilizzare il sito.',
          timestamp: new Date(),
          read: false // Assicurati che il campo 'read' sia presente
        });



        this.successMessage = 'Registrazione avvenuta con successo.';
        // Passa il nickname e cambia vista al login dopo un breve periodo
        setTimeout(() => {
          this.$emit('switch-view', 'login'); // Cambia vista al login
        }, 2000); // Cambia vista dopo 2 secondi
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'L\'email è già in uso.';
        } else {
          this.errorMessage = 'Errore durante la registrazione.';
        }
        console.error('Errore durante la registrazione:', error);
      }

    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
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
.register-popup {
  position: relative;
  background-color: white;
  padding: 10px;
  border-radius: 1px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 400px;
  box-sizing: border-box;
  font-size: 1.2rem;
}
.register-popup h2 {
  margin-top: 0;
  font-size: 1.5rem;
  text-align: center;
}
.register-popup form {
  display: flex;
  flex-direction: column;
}
.input-group {
  margin-bottom: 15px;
  position: relative;
}
.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
}
.input-group .asterisk {
  position: absolute;
  top: 10px;
  right: 10px;
  color: red;
}
.input-group .toggle-visibility {
  position: absolute;
  top: 10px;
  right: 5px;
  cursor: pointer;
  font-size: 1.3vw;
}
.register-popup button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}
.register-popup button:hover {
  background-color: #218838;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
.success {
  color: green;
  text-align: center;
  margin-top: 10px;
}
</style>
