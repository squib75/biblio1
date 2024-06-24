// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Inizializza i servizi
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };