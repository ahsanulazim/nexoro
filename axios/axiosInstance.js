import { auth } from "@/firebase/firebase.config";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";

// Wait for Firebase Auth to finish restoring session if currentUser is not ready yet
const getCurrentFirebaseUser = () => {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const user = await getCurrentFirebaseUser();
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
