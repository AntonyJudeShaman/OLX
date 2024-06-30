import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAw8d6kHXSl-VFeuJLKhb901q7YkRiLOg",
  authDomain: "olx-proj-d4091.firebaseapp.com",
  projectId: "olx-proj-d4091",
  storageBucket: "olx-proj-d4091.appspot.com",
  messagingSenderId: "1041983116772",
  appId: "1:1041983116772:web:00d4bfdef361e0c142e3f1",
  measurementId: "G-HS0BR8GR2S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
export { app, auth };
