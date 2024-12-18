import { initializeApp } from "firebase/app";
import {onAuthStateChanged, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { useContext } from "react";

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

export function checkCurrentUser() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user);
    } else {
      console.log("User is not logged in.");
    }
  });
}

export function signOutUser() {
  const auth = getAuth();
  signOut(auth).then(() => {
    console.log('Sign-out successful.');
  }).catch((error) => {
    console.error('Error during sign-out:', error.message);
  });
}

export function loginWithGoogle(router) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    router.push('/dashboard');
  }).catch((error) => {
    // Handle Errors here.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error);
  });
}

export async function registerUserWithGoogle(router) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    // Sign in with Google and get user data
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);  // Reference to the Firestore user document

    // Check if the user already exists
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      // If the user already exists, reject with an error
      throw new Error("User already exists in the database.");
    }

    // New user: Add to Firestore
    console.log("New user. Adding to database...");
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      createdAt: new Date(),
    });

    console.log("User added to database.");
    router.push('/dashboard');
  } catch (error) {
    // Handle any errors (either from Firebase or custom errors)
    throw error;  // Rethrow the error so it can be handled elsewhere if necessary
  }
}

export async function login(email, password) {
  const auth = getAuth();

  try {
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorCode = error.code;
    console.error("Error during sign-in:", error.code, error.message);
    return Promise.reject(errorCode);
  }
}

export function register(email, password) {
  const auth = getAuth();

  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log('User registered:', user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return Promise.reject(errorCode);
    });
}