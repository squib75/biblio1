<template>
  <div class="community-book">
    <div class="title"><h1>Community - <i class="small-text">Elenco dei gruppi di appassionati di lettura disponibili.</i></h1>
      <img class="logo" alt="Community" src="../assets/community.png" />
    </div>
    <h3>Leggi la descrizione, guarda il luogo e scegli quelle più adatte a te!</h3>
    <h4>Le Community vivono dei propri iscritti: condividi i tuoi libri e partecipa agli eventi del tuo gruppo!</h4>

    <div class="community-grid">
      <!-- Ciclo delle community e visualizzo nome, indirizzo e numero di iscritti -->
      <div v-for="community in communities" :key="community.id" class="community-card">
        <h4>{{ community.Nome }}</h4>
        <div class="location">
          <a v-if="community.Indirizzo" :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(community.Indirizzo)" target="_blank">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="location-icon" />
            <span>{{ community.Indirizzo }}</span>
          </a>
        </div>
        <p><b>N° di Iscritti: {{ getCommunityMemberCount(community.Nome) }}</b></p>
        <div class="buttons">
          <button v-if="!isUserSubscribed(community.Nome)" @click="subscribeToCommunity(community.Nome)" class="Iscrizione">Iscriviti</button>
          <button v-if="isUserSubscribed(community.Nome)" @click="unsubscribeFromCommunity(community.Nome)" class="Disiscrizione">Disiscriviti</button>
          <button @click="showDescription(community.Descrizione)" class="Descrizione">Descrizione</button>
        </div>
      </div>
    </div>

    <!-- Popup per la descrizione -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <span class="close" @click="closePopup">&times;</span>
        <p>{{ popupDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebase'; // Importa il database e l'autenticazione di Firebase
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'; // Importa le funzioni di Firestore necessarie
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faMapMarkerAlt);

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      communities: [], // Array per memorizzare le community
      users: [], // Array per memorizzare gli utenti
      currentUser: null, // Dati dell'utente loggato
      showPopup: false, // Stato del popup
      popupDescription: '' // Testo della descrizione da mostrare nel popup
    };
  },
  async created() {
    // Recupera le community e gli utenti quando il componente è creato
    await this.fetchCommunities();
    await this.fetchUsers();

    const user = auth.currentUser;
    if (user) {
      await this.getCurrentUser();
    } else {
      // Aggiungi un listener per l'autenticazione se l'utente non è ancora disponibile
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await this.getCurrentUser();
        }
      });
    }
  },
  methods: {
    // Metodo per recuperare le community dal database
    async fetchCommunities() {
      try {
        // Query per recuperare le community
        const querySnapshot = await getDocs(collection(db, 'Community'));
        const communities = [];
        querySnapshot.forEach((doc) => {
          const communityData = doc.data();
          communityData.id = doc.id; // Aggiungi l'identificatore del documento
          communityData.Nome = communityData.Nome || ''; // Assicurati che il campo Nome sia definito
          communityData.Indirizzo = communityData.Indirizzo || ''; // Assicurati che il campo Luogo sia definito
          communityData.Descrizione = communityData.Descrizione || ''; // Assicurati che il campo Descrizione sia definito
          communities.push(communityData);
        });
        this.communities = communities;
      } catch (error) {
        console.error('Errore durante il recupero delle community:', error);
      }
    },
    // Metodo per recuperare gli utenti dal database
    async fetchUsers() {
      try {
        // Query per recuperare gli utenti
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          userData.Community = userData.Community || []; // Assicurati che il campo Community sia definito
          users.push(userData);
        });
        this.users = users;
      } catch (error) {
        console.error('Errore durante il recupero degli utenti:', error);
      }
    },
    // Metodo per ottenere i dati dell'utente loggato
    async getCurrentUser() {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Assicurati che Community sia inizializzato come array
          userData.Community = userData.Community || [];
          this.currentUser = userData;
        }
      }
    },
    // Metodo per verificare se l'utente è iscritto a una community
    isUserSubscribed(communityName) {
      // Verifica che currentUser e currentUser.Community non siano undefined
      if (!this.currentUser || !this.currentUser.Community) {
        return false;
      }
      return this.currentUser.Community.includes(communityName);
    },
    // Metodo per iscriversi a una community
    async subscribeToCommunity(communityName) {
      if (this.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            Community: arrayUnion(communityName)
          });
          if (!this.currentUser.Community) {
            this.currentUser.Community = [];
          }
          this.currentUser.Community.push(communityName);
          alert(`Iscritto a ${communityName}`);
          await this.fetchUsers(); // Aggiorna la lista degli utenti
        } catch (error) {
          console.error('Errore durante l\'iscrizione alla community:', error);
          alert('Errore durante l\'iscrizione. Riprova.');
        }
      } else {
        alert('Devi effettuare il login per iscriverti a una community.');
      }
    },
    // Metodo per disiscriversi da una community
    async unsubscribeFromCommunity(communityName) {
      if (this.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            Community: arrayRemove(communityName)
          });
          const index = this.currentUser.Community.indexOf(communityName);
          if (index > -1) {
            this.currentUser.Community.splice(index, 1);
          }
          alert(`Disiscritto da ${communityName}`);
          await this.fetchUsers(); // Aggiorna la lista degli utenti
        } catch (error) {
          console.error('Errore durante la disiscrizione dalla community:', error);
          alert('Errore durante la disiscrizione. Riprova.');
        }
      } else {
        alert('Devi effettuare il login per disiscriverti da una community.');
      }
    },
    // Metodo per contare il numero di utenti iscritti a una specifica community
    getCommunityMemberCount(communityName) {
      let count = 0;
      this.users.forEach((user) => {
        if (user.Community && Array.isArray(user.Community)) {
          if (user.Community.includes(communityName)) {
            count++;
          }
        }
      });
      return count;
    },
    // Metodo per mostrare il popup con la descrizione
    showDescription(description) {
      this.popupDescription = description;
      this.showPopup = true;
    },
    // Metodo per chiudere il popup
    closePopup() {
      this.showPopup = false;
      this.popupDescription = '';
    }
  }
};
</script>

<style scoped>
/* Stile per il contenitore principale del Community Book */
.community-book {
  padding: 5px;
  font-size: 1.5rem;
}

/* Stile per la griglia delle community */
.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 10px;

}

/* Stile per le card delle community */
.community-card {
  background-color: #d6e4f3;
  border: 3px solid #635b5b;
  padding: 10px;
  border-radius: 2px;
  font-size: 1.2vw;
  text-align: center; /* Centra il testo */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Spaziatura variabile */
  align-items: center;
  height: 300px; /* Altezza fissa per le card */
}

/* Stile per la location */
.location {
  display: flex;
  align-items: center;
  margin-top: 5px;
  line-height: 1.5; /* Interlinea */
  font-size: 1.3rem;
}

.location-icon {
  margin-right: 10px;
  cursor: pointer;
}
/* Stile per i pulsanti */
button {
  padding: 10px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 1em;
  margin: 5px;
  transition: background-color 0.3s, transform 0.3s; /* Transizione per colore e trasformazione */
}
/* Stile per i pulsanti */
button.Iscrizione {
  background-color: #28a745;
  color: white;
}
button.Disiscrizione {
  background-color: #bf1d1d;
  color: white;
}
button.Descrizione {
  background-color: rgb(186, 90, 39);
  color: white;
}
/* Stile per i pulsanti al passaggio del mouse */
button:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* Effetto di ingrandimento */
}
/* Stile per i pulsanti all'interno delle card */
.buttons {
  margin-top: auto; /* Spinge i pulsanti in basso */
  width: 100%;
  text-align: center;
}
/* Centra i pulsanti all'interno delle card */
.community-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Stile per il popup */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Stile per il contenuto del popup */
.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 2px;
  max-width: 500px;
  text-align: center;
  position: relative;
}

/* Stile per il pulsante di chiusura del popup */
.popup-content .close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}

a {
  color: #000; /* Colore del font */
  text-decoration: none; /* Nessuna sottolineatura */
  font-weight: normal; /* No grassetto */
  display: inline-block; /* Consente applicazione effetti di transizione */
}

.small-text {
  font-size: 1.7vw;
}

.title {
  display: flex;
  align-items: center;
}

.logo {
  width: 20vw;
  height: auto;
  margin-left: 10px;
}

</style>
