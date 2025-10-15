// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwLQmCjLO5YuZG8VAZHbVVwYCJmES4v8o",
  authDomain: "supermarket-store-a4508.firebaseapp.com",
  projectId: "supermarket-store-a4508",
  storageBucket: "supermarket-store-a4508.firebasestorage.app",
  messagingSenderId: "459333411299",
  appId: "1:459333411299:web:a533f52cfff281cbc080d6",
  measurementId: "G-CNSBYS7P30"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
