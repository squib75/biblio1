// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDA8TGUp9AxNkhIu2IMqEllYfxNzrj-OE4",
    authDomain: "progetto-tiw-5a920.firebaseapp.com",
    projectId: "progetto-tiw-5a920",
    storageBucket: "progetto-tiw-5a920.appspot.com",
    messagingSenderId: "103819928920",
    appId: "1:103819928920:web:2d53be1c568f5f396c712d"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta i moduli di autenticazione e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };