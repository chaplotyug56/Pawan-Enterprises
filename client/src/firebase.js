// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwYlKVwt1G8qqWCrTXeoyNwamWJhNt-4U",
  authDomain: "pawan-enterprises-shop.firebaseapp.com",
  projectId: "pawan-enterprises-shop",
  storageBucket: "pawan-enterprises-shop.firebasestorage.app",
  messagingSenderId: "89341605121",
  appId: "1:89341605121:web:be2dde2e9b0bcb88ca1700",
  measurementId: "G-KTW8NZMQHL",
};

let app = null;
let auth = null;
let googleProvider = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, googleProvider };
