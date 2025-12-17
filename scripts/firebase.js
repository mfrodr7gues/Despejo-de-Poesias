// scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoER0S2PnnnTIhNcHAsLyShreEmHzsuvA",
  authDomain: "despejodepoesias.firebaseapp.com",
  projectId: "despejodepoesias",
  storageBucket: "despejodepoesias.appspot.com",
  messagingSenderId: "935639960074",
  appId: "1:935639960074:web:176af6fb78070935312df3"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);