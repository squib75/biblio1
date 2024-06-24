<template>
  <div class="horizontal-menu">
    <ul>
      <li v-for="(item, index) in menuItems" :key="index" @mouseover="hoverIndex = index" @mouseout="hoverIndex = -1" @click="handleItemClick(item)">
        <font-awesome-icon :icon="item.icon" :class="{ 'icon-hover': hoverIndex === index }" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </li>
    </ul>
    <UserAuth v-if="showLoginPopup" @close="showLoginPopup = false" />
  </div>
</template>

<script>
import UserAuth from './UserAuth.vue';

export default {
  components: {
    UserAuth
  },
  data() {
    return {
      menuItems: [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Chi siamo', icon: 'users', path: '/ChiSiamo' },
        { label: 'Community', icon: 'share', path: '/Community' },
        { label: 'Profilo', icon: 'user', path: '/UserProfile' },
        { label: 'Login', icon: 'sign-in-alt' } // No path for special handling
      ],
      hoverIndex: -1,
      selectedIndex: -1,
      showLoginPopup: false
    };
  },
  methods: {
    handleItemClick(item) {
      if (item.path) {
        this.selectItem(item.path);
      } else if (item.label === 'Login') {
        this.showLoginPopup = true;
      }
    },
    selectItem(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    }
  }
};
</script>

<style scoped>
/* Stili per il menu orizzontale */
.horizontal-menu {
  background-color: #b8fa7e;
  color: #221616;
  font-size: 1.3em; /* Dimensione del testo relativa */
  height: auto;
  width: 96.7%; /* Occupazione dell'intera larghezza della pagina */
  padding: 0.7em;
  margin: 0;
  display: flex;
  align-items: center;
  position: fixed; /* Fissa il menu in alto */
  top: 0; /* Allinea il menu al bordo superiore della pagina */
  z-index: 1000; /* Posizionamento sopra altri elementi della pagina */
}

/* Stili per la lista non ordinata */
.horizontal-menu ul {
  list-style-type: none; /* Rimuove i punti elenco */
  font-size: 1em;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around; /* Spaziatura uniforme tra gli elementi */
  width: 100%;
}

/* Stili per gli elementi della lista */
.horizontal-menu li {
  padding: 0; /* Rimuove il padding */
  cursor: pointer; /* Indica che è cliccabile */
  display: flex;
  align-items: center; /* Allineamento verticale al centro */
  text-align: center; /* Allineamento del testo al centro */
}

/* Stili per le icone del menu */
.menu-icon {
  margin-right: 10px; /* Margine destro per separare l'icona dal testo */
  font-size: 3.3vh; /* Dimensione dell'icona */
  color: #221616; /* Colore dell'icona */
}

/* Stili per l'icona in hover */
.icon-hover {
  color: rgba(45, 45, 46, 0.397); /* Colore e opacità in hover */
  transform: translate(2px, -1px); /* Effetto di traslazione lieve */
}
</style>
