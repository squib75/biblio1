<template>
  <!-- Contenitore principale del menu orizzontale -->
  <div class="horizontal-menu">
    <ul>
      <!-- Ciclo attraverso ogni elemento del menu, assegnando un gestore di eventi per il passaggio del mouse, l'uscita del mouse e il click. Aggiunge una classe 'disabled' se l'utente non è loggato e l'elemento richiede autenticazione. -->
      <li v-for="(item, index) in menuItems" :key="index" @mouseover="hoverIndex = index" @mouseout="hoverIndex = -1" @click="handleItemClick(item)" :class="{ disabled: !isLoggedIn && item.requiresAuth }">
        <font-awesome-icon :icon="item.icon" :class="{ 'icon-hover': hoverIndex === index }" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </li>
      <!-- Voce di menu per il logout, visibile solo se l'utente è loggato -->
      <li v-if="isLoggedIn" @click="showLogoutPopup = true">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="menu-icon" />
        <!-- Visualizza il nickname dell'utente loggato e l'icona di logout -->
        <span id=nickname class="menu-label">{{ truncatedNickname }}</span>
      </li>
      <li v-else @click="showLoginPopup = true">
        <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="menu-icon" />
        <span class="menu-label">Login</span>
      </li>
    </ul>
    <!-- Componente UserAuth per il login, registrazione e reset password -->
    <UserAuth v-if="showLoginPopup" @close="showLoginPopup = false" @login="handleLogin" />
    <!-- Visualizza il componente UserAuth solo se showLoginPopup è true. Gestisce gli eventi 'close' e 'login' -->
    <!-- Componente UserLogout per il logout -->
    <UserLogout v-if="showLogoutPopup" @close="showLogoutPopup = false" @logout="handleLogout" />
    <!-- Visualizza il componente UserLogout solo se showLogoutPopup è true. Gestisce gli eventi 'close' e 'logout' -->
  </div>
</template>

<script>
import UserAuth from '../components/UserAuth.vue';
import UserLogout from '../components/UserLogout.vue';

export default {
  // Registrazione dei componenti utilizzati
  components: {
    UserAuth,
    UserLogout
  },
  data() {
    return {
      // Elementi del menu con le relative icone, percorsi e requisiti di autenticazione
      menuItems: [
        {label: 'Home', icon: 'home', path: '/'},
        {label: 'Chi siamo', icon: 'users', path: '/ChiSiamo'},
        {label: 'Community', icon: 'share', path: '/Community', requiresAuth: true},
        {label: 'Profilo', icon: 'user', path: '/UserProfile', requiresAuth: true}
      ],
      hoverIndex: -1, // Indice dell'elemento del menu attualmente in hover
      showLoginPopup: false, // Stato di visualizzazione del popup di login
      showLogoutPopup: false, // Stato di visualizzazione del popup di logout
      isLoggedIn: false, // Stato di autenticazione dell'utente
      nickname: '' // Nickname dell'utente autenticato
    };
  },
  computed: {
    // Computed property per troncare il nickname se supera i 10 caratteri
    truncatedNickname() {
      return this.nickname.length > 10 ? this.nickname.substring(0, 15) + '...' : this.nickname;
    }
  },
  methods: {
    // Metodo gestore del click su un elemento del menu
    handleItemClick(item) {
      // Se l'utente non è loggato e l'elemento richiede autenticazione, non fare nulla
      if (!this.isLoggedIn && item.requiresAuth) {
        return;
      }
      // Se l'elemento ha un percorso associato, naviga a quella rotta
      if (item.path) {
        this.$router.push(item.path);
      }
    },
    // Metodo per gestire il successo del login
    handleLogin(nickname) {
      this.nickname = nickname;
      this.isLoggedIn = true;
      this.showLoginPopup = false;
    },
    // Metodo per gestire il logout
    handleLogout() {
      this.nickname = '';
      this.isLoggedIn = false;
      this.showLogoutPopup = false;
    }
  }

};
</script>


<style scoped>
.horizontal-menu {
  background-color: #b8fa7e;
  color: #221616;
  font-size: 1.3em;
  height: auto;
  width: 96.7%;
  padding: 0.7em;
  margin: 0;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 1000;
}

.horizontal-menu ul {
  list-style-type: none;
  font-size: 1em;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.horizontal-menu li {
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-align: center;
}

.horizontal-menu li.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.menu-icon {
  margin-right: 10px;
  font-size: 3.3vh;
  color: #221616;
}

.icon-hover {
  color: rgba(45, 45, 46, 0.397);
  transform: translate(2px, -1px);
}

#nickname {
  font-size: 0.9em;
  color: rgb(64, 86, 223);
  font-weight: bold;
  font-style: italic;

}
</style>

