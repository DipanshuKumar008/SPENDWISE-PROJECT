// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore,doc,setDoc } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAR-Uq9Q8A77IqetvFrJnK9vgbwIphAg8Q",
    authDomain: "spendwise-ce5d0.firebaseapp.com",
    projectId: "spendwise-ce5d0",
    storageBucket: "spendwise-ce5d0.firebasestorage.app",
    messagingSenderId: "560751034908",
    appId: "1:560751034908:web:fe1d9c6946f39c783715d9",
    measurementId: "G-E75DH8HB2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc}




