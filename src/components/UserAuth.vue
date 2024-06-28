<template>
  <!-- Overlay per oscurare lo sfondo quando il popup è aperto -->
  <div class="overlay">
    <!-- Contenitore del popup -->
    <div class="popup">
      <!-- Contenitore del pulsante di chiusura -->
      <div class="close-container">
        <!-- Pulsante di chiusura -->
        <span class="close" @click="$emit('close')">&times;</span>
      </div>
      <!-- Visualizza il componente UserLogin se currentView è 'login' -->
      <UserLogin v-if="currentView === 'login'" @switch-view="switchView" @login="handleLoginSuccess" />
      <!-- Visualizza il componente UserRegister se currentView è 'register' -->
      <UserRegister v-if="currentView === 'register'" @switch-view="switchView" @register="handleRegisterSuccess" />
      <!-- Visualizza il componente UserPasswordForgot se currentView è 'forgot' -->
      <UserPasswordForgot v-if="currentView === 'forgot'" @switch-view="switchView" />
    </div>
  </div>
</template>


<script>
import UserLogin from './UserLogin.vue';
import UserRegister from './UserRegister.vue';
import UserPasswordForgot from './UserPasswordForgot.vue';

export default {
  components: {
    UserLogin,          // Importa il componente UserLogin
    UserRegister,       // Importa il componente UserRegister
    UserPasswordForgot  // Importa il componente UserPasswordForgot
  },
  data() {
    return {
      currentView: 'login'  // Vista corrente, inizialmente impostata su 'login'
    };
  },
  methods: {
    // Metodo per cambiare la vista corrente
    switchView(view) {
      this.currentView = view;
    },
    // Metodo chiamato al successo del login
    handleLoginSuccess(payload) {
      this.$emit('login', payload); // Passa il payload che include nickname e unreadCount
    },
    // Metodo chiamato al successo della registrazione
    handleRegisterSuccess(nickname) {
      this.$emit('login', nickname);  // Emette un evento 'login' con il nickname
    }
  }
};
</script>


<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup {
  background-color: white;
  padding: 40px 0 5px 5px;
  border-radius: 1px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 500px;
  box-sizing: border-box;
  position: relative;
}
.close-container {
  display: flex;
  justify-content: flex-end;
}

.close {
  cursor: pointer;
  font-size: 20px;
  border: 1px solid #101010;
  padding: 1px;
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>