// Importa Vue, l'app principale e il router
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles.css'; // Importa il foglio di stile globale
// Importa FontAwesomeIcon dal file di configurazione
import FontAwesomeIcon from './plugins/font-awesome';

// Crea l'istanza dell'app Vue
const app = createApp(App);

// Registra FontAwesomeIcon come componente globale
app.component('font-awesome-icon', FontAwesomeIcon);

// Usa il router
app.use(router);

// Monta l'app sull'elemento con id 'app'
app.mount('#app');
