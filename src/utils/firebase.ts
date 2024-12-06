import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCTPnjohMb34L7E_S4McTXaEu2oMD1_jBA",
    authDomain: "",
    projectId: "vue-firebase-f1c00",
    storageBucket: "",
    messagingSenderId: "",
    appId: "1:231337518979:web:8ded4170662fbd4716b8b6",
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };
