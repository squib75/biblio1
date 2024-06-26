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
          <!-- Immagine dell'evento -->
          <img :src="event.imageUrl" :alt="event.title" class="event-image">
          <div class="event-container">
            <div> <!-- Titolo dell'evento -->
              <h3>{{ event.title }}</h3>
            </div>
            <!-- Data e luogo dell'evento -->
            <div class="event-metadata">
              <!-- Data dell'evento -->
              <p>{{ event.date }}</p>
              <!-- Luogo dell'evento -->
              <p>{{ event.location }}</p>
            </div>
          </div>
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
    margin-left: 5px;

  }
.event-menu h2 {
  margin-top: 0; /* Margine superiore */
}
.event-list {
  display: flex;
  flex-wrap: wrap; /* Rende flessibile il layout */
  gap: 10px; /* Spazio tra gli eventi */
}
.event-item {
  flex: 1 1 300px;
  background-color: rgb(214, 228, 243);
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  max-width: 45vw; /* Larghezza massima */
  max-height: 35vw; /* Altezza massima */
  font-size: 1.3vw; /* Dimensione del font sarà il 1.6% della larghezza della finestra */
}
.event-details {
  padding: 2px;
  overflow-y: auto;
  display: flex;
}
.event-image {
  max-width:30%;
  height: auto;
  border-bottom: 1px solid #ccc;
  display: flex;
}
.event-details h3 {
  font-size: 1.1em;
  margin: 7px;
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
