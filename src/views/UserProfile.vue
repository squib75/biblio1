<template>
  <!-- Elemento radice del template -->
  <div class="user-profile">
    <h1>Profilo Utente</h1>
    <p>Benvenuto, {{ nickname }}!</p>
    <!-- Aggiungi ulteriori informazioni sul profilo utente qui -->
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      nickname: '' // Sostituisci con il dato corretto
    };
  },
  created() {
    // Recupera il nickname o altre informazioni utente dal backend o stato dell'app
    this.nickname = 'EsempioNickname'; // Sostituisci con il valore reale
  }
};
</script>

<style scoped>
.user-profile {
  /* Stili per il profilo utente */
}
</style>
