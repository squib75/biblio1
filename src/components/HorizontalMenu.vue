<template>
  <div class="horizontal-menu">
    <ul>
      <li v-for="(item, index) in menuItems" :key="index" @mouseover="hoverIndex = index" @mouseout="hoverIndex = -1" @click="selectItem(index)">
        <font-awesome-icon :icon="item.icon" :class="{ 'icon-hover': hoverIndex === index }" class="menu-icon" />
        <span class="menu-label">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Chi siamo', icon: 'users', path: '/ChiSiamo' },
        { label: 'Community', icon: 'share', path: '/Community'},
        { label: 'Profilo', icon: 'user', path: '/UserProfile' },
        { label: 'Login', icon: 'sign-in-alt', path: '/UserAuth' }
      ],
      hoverIndex: -1,
      selectedIndex: -1
    };
  },
  methods: {
    selectItem(index) {
      const selectedPath = this.menuItems[index].path;
      // Controlla se la rotta corrente è diversa da quella selezionata
      if (this.$route.path !== selectedPath) {
        this.selectedIndex = index;
        this.$router.push(selectedPath);
      }
    }
  }
};
</script>

<style scoped>
.horizontal-menu {
  background-color: #b8fa7e;
  color: #221616;
  height: 4vw;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  position: fixed; /* Aggiungi posizione fissa per fissare il menu in alto */
  top: 0; /* Allinea il menu al bordo superiore della pagina */
  width: 100%; /* Assicurati che il menu occupi l'intera larghezza della pagina */
  z-index: 1000; /* Assicurati che il menu sia sopra altri elementi della pagina */
}

.horizontal-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.horizontal-menu li {
  padding: 0;
  cursor: pointer;
  font-size: 2.6vw;
  display: flex;
  align-items: center;
  text-align: center;
}

.menu-icon {
  margin-right: 10px;
  font-size: 2vw;
  color: #221616;
}

.icon-hover {
  color: rgba(45, 45, 46, 0.397);
  transform: translate(2px, -1px);
}
</style>