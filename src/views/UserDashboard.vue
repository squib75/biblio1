<template>
  <div class="user-dashboard">
    <!-- Menu laterale -->
    <user-menu :menu-items="menuItems" @menu-item-clicked="selectMenuItem" class="user-menu"></user-menu>

    <!-- Contenitore centrale per i dati personali -->
    <div class="center-panel">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import UserMenu from './UserMenu.vue';
import ModificaProfilo from './ModificaProfilo.vue';
import GeneriPreferiti from './GeneriPreferiti.vue';
import LibriPosseduti from './LibriPosseduti.vue';
import LibriDesiderati from './LibriDesiderati.vue';
import RichiesteRicevute from "@/components/RichiesteRicevute.vue";
import PrestitiEffettuati from "@/components/PrestitiEffettuati.vue";

export default {
  name: 'UserDashboard',
  components: {
    UserMenu,
    ModificaProfilo,
    GeneriPreferiti,
    LibriPosseduti,
    LibriDesiderati,
    RichiesteRicevute,
    PrestitiEffettuati
  },
  data() {
    return {
      menuItems: [
        { id: 1, label: 'Modifica Profilo', name: 'modifica-profilo' },
        { id: 2, label: 'Biblioteca Personale', name: 'libri-posseduti' },
        { id: 3, label: 'Libri desiderati', name: 'libri-desiderati' },
        { id: 4, label: 'Generi preferiti', name: 'generi-preferiti' },
        { id: 5, label: 'Richieste ricevute', name: 'richieste-ricevute' },
        { id: 6, label: 'Prestiti effettuati', name: 'prestiti-effettuati' }
      ],
      selectedMenuItem: 'modifica-profilo', // Menu di default selezionato
      currentComponent: 'ModificaProfilo'
    };
  },
  methods: {
    // Metodo per gestire il click su una voce di menu
    selectMenuItem(item) {
      this.selectedMenuItem = item.name; // Imposta la voce di menu selezionata
      this.currentComponent = this.getComponentName(item.name); // Aggiorna il componente corrente
    },
    // Metodo per ottenere il nome del componente in base alla voce di menu selezionata
    getComponentName(menuItemName) {
      switch (menuItemName) {
        case 'modifica-profilo':
          return 'ModificaProfilo';
        case 'libri-posseduti':
          return 'LibriPosseduti';
        case 'libri-desiderati':
          return 'LibriDesiderati';
        case 'generi-preferiti':
          return 'GeneriPreferiti';
        case 'richieste-ricevute':
          return 'RichiesteRicevute';
        case 'prestiti-effettuati':
          return 'PrestitiEffettuati';
        default:
          return 'ModificaProfilo';
      }
    }
  }
};
</script>

<style scoped>
.user-dashboard {
  display: flex; /* Utilizza flexbox per il layout a righe */
  justify-content: space-between; /* Distribuisce gli elementi uniformemente */
  width: 100%; /* Occupa tutta la larghezza disponibile */
  height: 100vh; /* Occupa tutta l'altezza della viewport */
  padding: 20px; /* Spazio intorno al contenuto */
}

.center-panel {
  flex: 1; /* Occupa lo spazio rimanente */
  padding: 20px; /* Spazio intorno al contenuto */
  background-color: #dde4dd;
}
.user-menu {
  width:22%;
  left: 0;
  text-align: left;
}
</style>

