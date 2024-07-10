<template>
  <div class="register-popup">
    <h2>Registrazione</h2>
    <form @submit.prevent="register">
      <!-- Campo email e validazione -->
      <div class="input-group">
        <input type="email" v-model="email" placeholder="Email" required />
        <span class="asterisk">*</span>
      </div>
      <!-- Campo password e validazione (icona per visibilità)-->
      <div class="input-group">
        <input :type="showPassword ? 'text' : 'password'" v-model="password" @focus="validateEmailInput" placeholder="Password" required @input="validatePassword" />
        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="toggle-visibility" @click="togglePasswordVisibility('password')" />
      </div>
      <!-- Campo conferma password (icona per visibilità) -->
      <div class="input-group">
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Conferma Password" required />
        <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="toggle-visibility" @click="togglePasswordVisibility('confirmPassword')" />
      </div>
      <!-- Campo nickname -->
      <div class="input-group">
        <input type="text" v-model="nickname" placeholder="Nickname" required />
        <span class="asterisk">*</span>
      </div>
      <!-- Campo nome -->
      <div class="input-group">
        <input type="text" v-model="nome" placeholder="Nome" required />
        <span class="asterisk">*</span>
      </div>
      <!-- Campo cognome -->
      <div class="input-group">
        <input type="text" v-model="cognome" placeholder="Cognome" required />
        <span class="asterisk">*</span>
      </div>
      <!-- Campo telefono -->
      <div class="input-group">
        <input type="tel" v-model="telefono" placeholder="Telefono" required />
        <span class="asterisk">*</span>
      </div>
      <!-- Bottone per inviare il modulo di registrazione -->
      <button type="submit">Registrati</button>
      <!-- Bottone per cancellare i campi del modulo -->
      <button type="button" @click="clearForm">Cancella</button>
      <!-- Messaggio di errore -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <!-- Messaggio di successo -->
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <!-- Link per passare al login -->
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
      email: '',                // Campo email
      password: '',             // Campo password
      confirmPassword: '',      // Campo conferma password
      nickname: '',             // Campo nickname
      nome: '',                 // Campo nome
      cognome: '',              // Campo cognome
      telefono: '',             // Campo telefono
      errorMessage: '',         // Messaggio di errore
      successMessage: '',       // Messaggio di successo
      showPassword: false,      // Stato visibilità password
      showConfirmPassword: false// Stato visibilità conferma password
    };
  },
  methods: {
    async register() {
      // Validazione email
      if (!this.validateEmail(this.email)) {
        this.errorMessage = 'Indirizzo email non valido.';
        return;
      }
      // Controllo corrispondenza password
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Le password non corrispondono.';
        return;
      }
      // Controllo presenza di errori
      if (this.errorMessage) {
        return;
      }

      try {
        // Verifica se il nickname è già in uso
        const nicknameQuery = query(collection(db, 'users'), where('nickname', '==', this.nickname));
        const nicknameSnapshot = await getDocs(nicknameQuery);
        if (!nicknameSnapshot.empty) {
          this.errorMessage = 'Il nickname è già in uso.';
          return;
        }

        // Crea l'utente con email e password
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        // Aggiorna profilo dell'utente con il nickname
        await updateProfile(user, {
          displayName: this.nickname
        });

        // Salva i dati aggiuntivi dell'utente nel database
        await setDoc(doc(db, 'users', user.uid), {
          nickname: this.nickname,
          email: this.email,
          nome: this.nome,
          cognome: this.cognome,
          telefono: this.telefono,
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
        // Passa il nickname e cambia vista al login con ritardo
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
    // Verifica che l'indirizzo mail sia in un formato corretto
    validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    },
    validateEmailInput() {
      if (!this.validateEmail(this.email)) {
        this.errorMessage = 'Indirizzo email non valido.';
      } else {
        this.errorMessage = '';
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
      // Alterna la visibilità della password o della conferma password
      if (field === 'password') {
        this.showPassword = !this.showPassword;
      } else if (field === 'confirmPassword') {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
    },
    clearForm() {
      // Resetta tutti i campi del modulo
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.nickname = '';
      this.nome = '';
      this.cognome = '';
      this.telefono = '';
      this.errorMessage = '';
      this.successMessage = '';
    }
  }
};
</script>


<style scoped>
.register-popup {
  position: relative;
  background-color: white;
  padding: 5px;
  border-radius: 1px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  width: 450px;
  box-sizing: border-box;
  font-size: 1.2rem;
}
.register-popup h2 {
  margin-top: 0;
  font-size: 1.4rem;
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
  font-size: 1.3rem;
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
