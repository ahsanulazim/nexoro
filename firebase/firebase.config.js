// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSjasVDTBQtQD_LN-ozPPCt4dtNX96SE4",
  authDomain: "nexoro-84f8a.firebaseapp.com",
  projectId: "nexoro-84f8a",
  storageBucket: "nexoro-84f8a.firebasestorage.app",
  messagingSenderId: "198617648122",
  appId: "1:198617648122:web:e29090471198453778f243",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
