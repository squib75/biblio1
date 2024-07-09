// firebase.js
console.log('Caricamento di firebase.js...');


import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('Inizializzazione di Firebase...');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYhjP7ns8t2zDNdHP6Dx8DtUMxg9vGSEA",
    authDomain: "progetto-tiw-4836b.firebaseapp.com",
    projectId: "progetto-tiw-4836b",
    storageBucket: "progetto-tiw-4836b.appspot.com",
    messagingSenderId: "43547450829",
    appId: "1:43547450829:web:d434d3f0304b503e04f884"
};

// Inizializza Firebase

const app = initializeApp(firebaseConfig);
console.log('Firebase inizializzato');

// Inizializza i servizi
const auth = getAuth(app);
const db = getFirestore(app);

console.log('Servizi Firebase inizializzati');

// Configura la persistenza della sessione
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log('Persistenza configurata correttamente');
    })
    .catch((error) => {
        console.error('Errore nella configurazione della persistenza:', error);
    });

export { auth, db };