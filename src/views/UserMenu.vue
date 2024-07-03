<template>
  <div class="user-menu">
    <ul>
      <!-- Itera attraverso le voci del menu -->
      <li v-for="item in menuItems" :key="item.id" @click="selectMenuItem(item)">
        {{ item.label }} <!-- Mostra il testo della voce del menu -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserMenu', // Nome del componente
  props: {
    menuItems: Array // Proprietà che riceve un array di voci di menu dal componente genitore
  },
  methods: {
    selectMenuItem(item) {
      // Metodo chiamato quando una voce del menu viene cliccata
      // Il componente genitore che passa l'elenco è UserDashboard
      // Emette un evento chiamato 'menu-item-clicked' con l'elemento del menu cliccato come argomento
      this.$emit('menu-item-clicked', item);
    }
  }
};
</script>


<style scoped>
.user-menu {
  background-color: #f0f0f0; /* Colore di sfondo del menu */
  padding: 20px; /* Spazio intorno al menu */
}

.user-menu ul {
  list-style-type: none; /* Rimuove i punti elenco */
  padding: 0; /* Rimuove il padding predefinito */
}

.user-menu ul li {
  cursor: pointer; /* Cambia il cursore al passaggio del mouse */
  padding: 10px; /* Spazio interno tra le voci di menu */
  border-bottom: 1px solid #ccc; /* Linea divisoria tra le voci di menu */
}

.user-menu ul li:hover {
  background-color: #e0e0e0; /* Colore di sfondo al passaggio del mouse */
}
</style>
