import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBLL3wAXw8xrQFhnw8oY0pRjJqP7EByltE",
  authDomain: "sportsbook-1.firebaseapp.com",
  projectId: "sportsbook-1",
  storageBucket: "sportsbook-1.firebasestorage.app",
  messagingSenderId: "169865196143",
  appId: "1:169865196143:web:5100aef30c3d31184e139a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);