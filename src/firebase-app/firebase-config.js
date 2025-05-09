import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCL3ok4HX632sLNYmwc28F68sVoGa3pZxU",
  authDomain: "monkey-blog-9d6a1.firebaseapp.com",
  projectId: "monkey-blog-9d6a1",
  storageBucket: "monkey-blog-9d6a1.firebasestorage.app",
  messagingSenderId: "985184614115",
  appId: "1:985184614115:web:530df1130f4ee9222737d6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
