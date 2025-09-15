import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"; // eslint-disable-line spellcheck/spell-checker
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyD0sXMvHR87u20GyXjQkzY86g7XVMw73GQ",
  authDomain: "mealplan-9fca6.firebaseapp.com",
  projectId: "mealplan-9fca6",
  storageBucket: "mealplan-9fca6.appspot.com",  // 👈 fixed typo: should be appspot.com, not firebasestorage.app
  messagingSenderId: "487594153255",
  appId: "1:487594153255:web:e3007313257787f95cc502",
  measurementId: "G-0W6857KB92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("✅ Firebase initialized:", app.name);

// Export the services you need
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);