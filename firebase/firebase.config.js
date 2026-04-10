// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8l8tV9Kk0ppcmrvQYrTnwRsxOrWX08ZA",
  authDomain: "nexoro-58c7b.firebaseapp.com",
  projectId: "nexoro-58c7b",
  storageBucket: "nexoro-58c7b.firebasestorage.app",
  messagingSenderId: "1068531548852",
  appId: "1:1068531548852:web:c2d7e0c1e5020dce8f8de1",
  measurementId: "G-9CK5WL9G2L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
export { auth, analytics };
