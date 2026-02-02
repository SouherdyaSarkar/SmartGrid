// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smartgrid-a2c22.firebaseapp.com",
  databaseURL:
    "https://smartgrid-a2c22-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartgrid-a2c22",
  storageBucket: "smartgrid-a2c22.firebasestorage.app",
  messagingSenderId: "332901198288",
  appId: "1:332901198288:web:763de04a4214cdae0571d5",
  measurementId: "G-4DTCLLCXRV",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
