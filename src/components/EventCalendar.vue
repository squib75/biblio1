<template>
  <div class="event-menu">
    <!-- Titolo del menu -->
    <h2>Eventi in primo piano</h2>

    <!-- Lista degli eventi -->
    <div class="event-list">
      <!-- Iterazione attraverso gli eventi -->
      <div v-for="(event, index) in events" :key="index" class="event-item">
        <!-- Dettagli dell'evento -->
        <div class="event-details">
          <div class="event-container">
            <div> <!-- Titolo dell'evento -->
              <h3>{{ event.title }}</h3>
            </div>
            <!-- Data e luogo dell'evento -->
            <div class="event-metadata">
              <!-- Data dell'evento -->
              <p>{{ event.date }}</p>
              <!-- Luogo dell'evento -->
              <p><a :href="event.url" target="_blank">{{ event.location }}</a></p>
            </div>
          </div>
          <!-- Immagine dell'evento -->
          <img :src="event.imageUrl" :alt="event.title" class="event-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      events: [] // Array di eventi, inizialmente vuoto
    };
  },
  mounted() {
    // Effettua una richiesta HTTP per caricare i dati degli eventi dal file JSON
    fetch('/events.json')
      .then(response => response.json())
      .then(data => {
        this.events = data; // Assegna i dati degli eventi all'array events
      })
      .catch(error => {
        console.error('Errore durante il caricamento degli eventi:', error);
      });
  }
};
</script>

<style scoped>
.event-menu {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  margin-left: 5px;
  overflow-x: auto; /* Abilita la barra di scorrimento orizzontale se necessario */
}
/* Imposta la larghezza massima dell'elemento in percentuale rispetto alla larghezza della finestra */
  .event-menu {
    background-color: #e19b6a;
    padding: 10px;
    border-radius: 8px;
    max-width: 95%;
    height: 98%;
    margin-left: 10px;
    margin-top: 10px;

  }
.event-menu h2 {
  margin-top: 0; /* Margine superiore */
}
.event-list {
  display: flex;
  flex-wrap: wrap; /* Rende flessibile il layout */
  gap: 10px; /* Spazio tra gli eventi */
  height: 95%;
  flex-direction: column;
}
.event-item {
  flex: 1 1 300px;
  background-color: #d6e4f3;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow-y: auto;
  max-width: 95%; /* Larghezza massima */
  max-height: 95%; /* Altezza massima */
  font-size: 1.3rem; /* Dimensione del font sarà il 1.3 root em */
  padding: 10px;
  margin-bottom: 20px;
  margin-left: 10px;
}
.event-details {
  display: flex;
  flex-direction: column;
  padding: 2px;
  overflow-y: auto;
  width: 100%;
  margin-left: 10px;
}
.event-image {
  margin: 15px;
  width: 90%;
  height: auto;
  border-bottom: 1px solid #ccc;
  display: flex;
}
.event-details h3 {
  font-size: 1.1em;
  overflow: hidden; /* nasconde il testo che sfora la larghezza del container */
}
.event-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: justify;
  padding: 0 0 0 5px;
}

.event-metadata {
  display: flex;
  flex-direction: column;
  text-align: justify;
}
.event-details p {
  margin: 0;
  line-height: 1.5;
}

</style>
