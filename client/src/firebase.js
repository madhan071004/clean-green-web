import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace this with your actual Firebase config
// You can get this from your Firebase Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyCl0VQ8LFKmfERabD398QOhkE4Fb2NDYv0",
  authDomain: "clean-green-web.firebaseapp.com",
  projectId: "clean-green-web",
  storageBucket: "clean-green-web.firebasestorage.app",
  messagingSenderId: "499542490677",
  appId: "1:499542490677:web:1b462aff5ae678a1703b7c",
  measurementId: "G-F4H5GTPH74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
