// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3GPRq472pNvStVqPc9Q9J1JzzmMJvK68",
  authDomain: "react-with-api-2783a.firebaseapp.com",
  projectId: "react-with-api-2783a",
  storageBucket: "react-with-api-2783a.firebasestorage.app",
  messagingSenderId: "531309867157",
  appId: "1:531309867157:web:bdc3bd651f17cf14d8ab9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)


export { auth, db}
