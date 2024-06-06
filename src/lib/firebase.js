import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-9b054.firebaseapp.com",
  projectId: "reactchat-9b054",
  storageBucket: "reactchat-9b054.appspot.com",
  messagingSenderId: "450237511085",
  appId: "1:450237511085:web:b59244907456c94a7ddd24",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
