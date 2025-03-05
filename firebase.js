// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDJqayT-PO6ss8LdE4pqiDRdOQYCCDOHT0",
    authDomain: "the-book-haven-6a20b.firebaseapp.com",
    databaseURL: "https://the-book-haven-6a20b-default-rtdb.firebaseio.com",
    projectId: "the-book-haven-6a20b",
    storageBucket: "the-book-haven-6a20b.firebasestorage.app",
    messagingSenderId: "847086382104",
    appId: "1:847086382104:web:ae35ad074cc8ea2e6a676d",
    measurementId: "G-J2VMMHJRYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
