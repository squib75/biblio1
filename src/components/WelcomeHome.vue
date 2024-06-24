<template>
  <div class="WelcomeHome">
    <h1>{{ msg }}</h1>
    <p> La lettura è il viaggio di chi non può prendere un treno. <i>(Francis De Croisett)</i></p>
  </div>
  <div class="grid-container">
    <div class="grid-item"><EventCalendar/></div>
    <div class="grid-item"><RecomendedBook/></div>
    <div class="grid-item">Elemento3</div>
    <div class="grid-item">Elemento 4</div>
  </div>
</template>

<script>
// Importa il componente EventCalendar.vue
import EventCalendar from './EventCalendar.vue';
import RecomendedBook from './RecomendedBook.vue';

export default {
  name: 'WelcomeHome',
  props: {
    msg: String,
  },
  components: {
    EventCalendar, RecomendedBook
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 40px 0 0;
}
p{
  font-size: 4vh
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Due colonne */
  gap: 10px; /* Spazio tra le celle */
}

.grid-item {
  width: 45vw; /* 45% della larghezza della finestra */
  height: 35vw; /* 35% dell'altezza della finestra */
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  overflow-y: auto; /* Abilita la barra di scorrimento se necessario */
}
</style>
