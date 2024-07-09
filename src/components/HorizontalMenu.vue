<template>
  <div class="horizontal-menu">
    <ul>
      <li v-for="(item, index) in menuItems" :key="index" @mouseover="hoverIndex = index" @mouseout="hoverIndex = -1" @click="handleItemClick(item)" :class="{ disabled: !isLoggedIn && item.requiresAuth }">
        <font-awesome-icon :icon="item.icon" :class="{ 'icon-hover': hoverIndex === index }" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </li>
      <li v-if="isLoggedIn" @click="showMessages = true" class="message-icon">
        <font-awesome-icon :icon="['fas', 'envelope']" class="menu-icon" />
        <span class="menu-label">Messaggi</span>
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </li>
      <li v-if="isLoggedIn" @click="showLogoutPopup = true">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="menu-icon" />
        <span id="nickname" class="menu-label">{{ truncatedNickname }}</span>
      </li>
      <li v-else @click="showLoginPopup = true">
        <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="menu-icon" />
        <span class="menu-label">Accesso</span>
      </li>
    </ul>
    <UserAuth v-if="showLoginPopup" @close="showLoginPopup = false" @login="handleLogin" />
    <UserLogout v-if="showLogoutPopup" @close="showLogoutPopup = false" @logout="handleLogout" />
    <MessageView v-if="showMessages" :nickname="nickname" @close="showMessages = false" @update-unread-count="updateUnreadCount" />
  </div>
</template>

<script>
import UserAuth from '../components/UserAuth.vue';
import UserLogout from '../components/UserLogout.vue';
import MessageView from '../components/MessageView.vue';

export default {
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  components: {
    UserAuth,
    UserLogout,
    MessageView
  },
  data() {
    return {
      menuItems: [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Chi siamo', icon: 'users', path: '/ChiSiamo' },
        { label: 'Community', icon: 'share', path: '/CommunityBook', requiresAuth: true },
        { label: 'DashBoard', icon: 'tachometer-alt', path: '/UserDashboard', requiresAuth: true }
      ],
      hoverIndex: -1,
      showLoginPopup: false,
      showLogoutPopup: false,
      showMessages: false, // Variabile per controllare la visualizzazione di MessageView
      isLoggedIn: false,
      nickname: '',
      unreadCount: 0 // Numero di messaggi non letti
    };
  },
  watch: {
    user(newUser) {
      if (newUser) {
        console.log('User prop changed: Logged in as', newUser.displayName);
        this.isLoggedIn = true;
        this.nickname = newUser.displayName;
      } else {
        console.log('User prop changed: Not logged in');
        this.isLoggedIn = false;
        this.nickname = '';
      }
    }
  },
  computed: {
    truncatedNickname() {
      return this.nickname && this.nickname.length > 10 ? this.nickname.substring(0, 10) + '...' : this.nickname;
    }
  },
  methods: {
    handleItemClick(item) {
      if (!this.isLoggedIn && item.requiresAuth) {
        return;
      }
      if (item.path) {
        this.$router.push(item.path);
      }
    },
    handleLogin({ nickname, unreadCount }) {
      this.nickname = nickname;
      this.isLoggedIn = true;
      this.unreadCount = unreadCount; // Aggiorna il numero di messaggi non letti
      this.showLoginPopup = false;
    },
    handleLogout() {
      this.nickname = '';
      this.isLoggedIn = false;
      this.showLogoutPopup = false;
      this.unreadCount = 0; // Resetta il conteggio dei messaggi non letti
    },
    updateUnreadCount(count) {
      this.unreadCount = count; // Aggiorna il conteggio dei messaggi non letti
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

.menu-icon:hover {
  color: rgba(45, 45, 46, 0.397);
  transform: translate(2px, -1px);
}

#nickname {
  font-size: 0.9em;
  color: rgb(64, 86, 223);
  font-weight: bold;
  font-style: italic;

}
.badge {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0.2em 0.4em;
  position: absolute;
  top: -2px;
  right: -20px;
  font-size: 0.7em;
}
.message-icon {
  position: relative;
}

</style>


