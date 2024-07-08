<template>
  <div class="recensione-prestito-overlay">
    <div class="recensione-prestito">
      <h3>Lascia una recensione</h3>
      <div class="voto">
        <span
            v-for="n in 5"
            :key="n"
            :class="{'libro-votato': n <= voto, 'libro-non-votato': n > voto}"
            @click="setVoto(n)"
        >&#128218;</span>
      </div>
      <textarea v-model="recensione" placeholder="Scrivi la tua recensione qui..."></textarea>
      <div class="actions">
        <button @click="$emit('chiudi')">Annulla</button>
        <button @click="salva">Salva</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecensionePrestito',
  props: {
    prestito: Object
  },
  data() {
    return {
      voto: 0,
      recensione: ''
    };
  },
  methods: {
    setVoto(n) {
      this.voto = n;
    },
    salva() {
      console.log('Salvataggio recensione per prestito ID:', this.prestito.id.toString());
      console.log('Recensione:', this.recensione);
      console.log('Voto:', this.voto);
      this.$emit('salvaRecensione', this.prestito.id.toString(), this.recensione, this.voto); // Assicurati che prestitoId sia una stringa
    }
  }
};
</script>

<style scoped>
.recensione-prestito-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.recensione-prestito {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}

.voto span {
  cursor: pointer;
  font-size: 2rem;
}

.libro-votato {
  color: gold;
}

.libro-non-votato {
  color: gray;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
}

.actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>



