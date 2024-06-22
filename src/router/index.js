// Importa le funzioni necessarie da 'vue-router' per creare il router
import { createRouter, createWebHashHistory } from 'vue-router';

// Importa i componenti HomeView e ChiSiamo
import HomeView from '../views/HomeView.vue';
import ChiSiamo from '../views/ChiSiamo.vue';

// Definisce le rotte dell'applicazione. Ogni rotta è mappata a un componente
const routes = [
  {
    // Rotta principale '/' che è mappata al componente HomeView
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    // Rotta '/ChiSiamo' che è mappata al componente ChiSiamo
    path: '/ChiSiamo',
    name: 'ChiSiamo',
    component: ChiSiamo
  }
];

// Crea una nuova istanza di Router utilizzando 'createRouter'
const router = createRouter({
  // Usa la modalità 'createWebHashHistory' per la gestione della cronologia basata su hash
  history: createWebHashHistory(),
  // Passa l'array di rotte definito sopra all'istanza del router
  routes
});

// Esporta l'istanza del router per poterla utilizzare in altre parti dell'applicazione
export default router;


