<template>
  <div class="popup-content">
    <h4>Richiedi {{ libro.titolo }} di <i>{{libro.autore}}</i></h4>
    <div>
      <p>Proprietario: {{ proprietario }}</p>
      <label>Disponibilità:</label>
      <label v-if="libro.prestito">
        <input  type="radio" v-model="tipoRichiesta" value="prestito" /> Prestito
      </label>
      <label v-if="libro.regalo">
        <input  type="radio" v-model="tipoRichiesta" value="regalo" /> Regalo
      </label>
      <label v-if="libro.scambio">
        <input  type="radio" v-model="tipoRichiesta" value="scambio" /> Scambio
      </label>
      <label v-if="libro.scambioLibro[0] && libro.scambioLibro[1]!== ''">
        <input  type="radio" v-model="tipoRichiesta" value="scambioLibro" /> Scambio con libro specifico
      </label>
    </div>
    <div>
      <label for="messaggio">Messaggio:</label>
      <textarea id="messaggio" v-model="messaggio"></textarea>
    </div>
  <div>
  <button @click="inviaRichiesta">Richiesta</button>
  <button @click="$emit('chiudi')">Chiudi</button>
  </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';

export default {
  name: 'RichiediLibro',
  props: {
    libro: {
      type: Object,
      required: true
    },
    proprietario: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tipoRichiesta: '',
      messaggio: '',
      libroRichiesto: ''
    };
  },
  methods: {
    async inviaRichiesta() {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('Utente non autenticato.');
          return;
        }

// Recupera il nickname dell'utente attualmente loggato
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        const fromNickname = userData ? userData.nickname : 'Sconosciuto';

        // Crea il documento nella tabella LibriRichiesti
        const richiesta = {
          userId: user.uid,
          titolo: this.libro.titolo,
          autore: this.libro.autore,
          isbn: this.libro.isbn || null,
          proprietario: this.proprietario,
          prestito: this.tipoRichiesta === 'prestito',
          regalo: this.tipoRichiesta === 'regalo',
          scambio: this.tipoRichiesta === 'scambio',
          scambioLibro: this.tipoRichiesta === 'scambioLibro' ? this.libro.scambioLibro : null,
          messaggio: this.messaggio,
          dataInserimento: serverTimestamp()
        };

        await addDoc(collection(db, 'LibriRichiesti'), richiesta);

        // Crea il messaggio per il proprietario del libro
        const tipoRichiestaLabel = this.tipoRichiesta === 'prestito' ? 'prestito' :
            this.tipoRichiesta === 'regalo' ? 'regalo' :
                this.tipoRichiesta === 'scambio' ? 'scambio' :
                    'scambio con libro';

        const messageContent = `Ciao, sono interessato al ${tipoRichiestaLabel} del libro ${this.libro.titolo} di ${this.libro.autore}. - ${this.messaggio} Accetta o Rifiuta`;

        const messaggio = {
          from: fromNickname,
          to: this.proprietario,
          message: messageContent,
          read: false,
          timestamp: serverTimestamp()
        };

        await addDoc(collection(db, 'messages'), messaggio);

        this.$emit('chiudi');
      } catch (error) {
        console.error('Errore durante l\'invio della richiesta:', error);
      }
    }
  }
};
</script>

<style scoped>
.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  width: 100%;
}
</style>

