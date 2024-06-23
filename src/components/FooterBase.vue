<!-- FooterBase.vue -->
<template>
  <!-- Contenitore principale del footer -->
  <footer class="footer">
    <div class="container">
      <ul class="footer-list">
        <!-- Email e Telefono -->
        <li class="footer-item">
          <p><a href="mailto:info@esempio.com" >Email: info@esempio.com</a></p>
          <p><a href="tel:+391234567890" >Telefono: +39 1234567890</a></p>
        </li>
        <!-- Logo centrale -->
        <li class="footer-item logo-item">
          <img class="footer-logo" alt="Logo" src="../assets/logo.png" />
        </li>
        <!-- Regolamento -->
        <li class="footer-item">
          <router-link to="/RegolamentoApp" >Regolamento</router-link>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterBase'
}
</script>

<style scoped>
/* Stili per il footer */
.footer {
  background-color: #f8f9fa;
  color: #221616;
  padding: 0.5rem 0; /* Riduce il padding verticale */
  margin: 0;
  width: 100%; /* Assicura che il footer occupi l'intera larghezza della pagina */
  display: flex;
  align-items: center;
  justify-content: center; /* Centra il contenuto orizzontalmente */
  position: fixed; /* Rende il footer fisso */
  bottom: 0; /* Allinea il footer al bordo inferiore della pagina */
  z-index: 1000; /* Assicura che il footer sia sopra altri elementi della pagina */
}

/* Contenitore centrale del footer */
.container {
  display: flex;
  justify-content: center; /* Centra il contenuto orizzontalmente */
  width: 100%;
  max-width: 1200px;
  padding: 0 20px; /* Aggiunge padding orizzontale al contenitore */
}

/* Lista non ordinata per gli elementi del footer */
.footer-list {
  list-style: none; /* Rimuove i punti elenco */
  display: flex;
  justify-content: space-between; /* Distribuisce uniformemente gli elementi orizzontalmente */
  align-items: center; /* Allinea verticalmente al centro gli elementi della lista */
  width: 100%;
  padding: 0;
  margin: 0;
}

/* Elementi della lista */
.footer-item {
  flex: 1;
  text-align: center; /* Centra il testo orizzontalmente */
}

/* Elemento centrale per il logo */
.logo-item {
  display: flex;
  justify-content: center; /* Centra il logo orizzontalmente */
}

/* Stili per il logo */
.footer-logo {
  height: 5vw; /* Imposta un'altezza ridotta per il logo */
  width: auto;
}


</style>
