// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0OdGWCTdeOLKyAStdoGiHk_ITD3ye0TI",
  authDomain: "realestate-project-28361.firebaseapp.com",
  projectId: "realestate-project-28361",
  storageBucket: "realestate-project-28361.firebasestorage.app",
  messagingSenderId: "556492141212",
  appId: "1:556492141212:web:f9848311c39dfc92287359",
  measurementId: "G-9QVDERBMRY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
