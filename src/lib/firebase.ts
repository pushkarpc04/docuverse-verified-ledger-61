
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBmnkihaAQdyatHaOEedx-fc9zr0KeRhcw",
  authDomain: "documents-veri.firebaseapp.com",
  projectId: "documents-veri",
  storageBucket: "documents-veri.firebasestorage.app",
  messagingSenderId: "856152577329",
  appId: "1:856152577329:web:218ddb41b2351e642b0c10",
  measurementId: "G-RYSJB4B535"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
