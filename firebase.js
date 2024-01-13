// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTCCxBHayxZ2EHuF8P8wCaHg7IXgp0KnQ",
  authDomain: "eventplanner-cf98e.firebaseapp.com",
  projectId: "eventplanner-cf98e",
  storageBucket: "eventplanner-cf98e.appspot.com",
  messagingSenderId: "723918941985",
  appId: "1:723918941985:web:90e2dd3923e91f36a39860",
  measurementId: "G-E5X7VBS7HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)