<template>
  <div class="horizontal-menu">
    <ul>
      <li v-for="(item, index) in menuItems" :key="index" @mouseover="hoverIndex = index" @mouseout="hoverIndex = -1" @click="handleItemClick(item)" :class="{ disabled: !isLoggedIn && item.requiresAuth }">
        <font-awesome-icon :icon="item.icon" :class="{ 'icon-hover': hoverIndex === index }" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </li>
      <li v-if="isLoggedIn" @click="showMessages = true">
        <font-awesome-icon :icon="['fas', 'envelope']" class="menu-icon" />
        <span class="menu-label">Messaggi</span>
      </li>
      <li v-if="isLoggedIn" @click="showLogoutPopup = true">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="menu-icon" />
        <span id="nickname" class="menu-label">{{ truncatedNickname }}</span>
      </li>
      <li v-else @click="showLoginPopup = true">
        <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="menu-icon" />
        <span class="menu-label">Login</span>
      </li>
    </ul>
    <UserAuth v-if="showLoginPopup" @close="showLoginPopup = false" @login="handleLogin" />
    <UserLogout v-if="showLogoutPopup" @close="showLogoutPopup = false" @logout="handleLogout" />
    <MessageView v-if="showMessages" @close="showMessages = false" :nickname="nickname" />
  </div>
</template>

<script>
import UserAuth from '../components/UserAuth.vue';
import UserLogout from '../components/UserLogout.vue';
import MessageView from '../components/MessageView.vue';

export default {
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
        { label: 'Community', icon: 'share', path: '/Community', requiresAuth: true },
        { label: 'Profilo', icon: 'user', path: '/UserProfile', requiresAuth: true }
      ],
      hoverIndex: -1,
      showLoginPopup: false,
      showLogoutPopup: false,
      showMessages: false,
      isLoggedIn: false,
      nickname: ''
    };
  },
  computed: {
    truncatedNickname() {
      return this.nickname.length > 10 ? this.nickname.substring(0, 15) + '...' : this.nickname;
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
    handleLogin(nickname) {
      this.nickname = nickname;
      this.isLoggedIn = true;
      this.showLoginPopup = false;
    },
    handleLogout() {
      this.nickname = '';
      this.isLoggedIn = false;
      this.showLogoutPopup = false;
      this.showMessages = false; // Nascondi il popup dei messaggi durante il logout
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

