import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDwYlKVwt1G8qqWCrTXeoyNwamWJhNt-4U",
  authDomain: "pawan-enterprises-shop.firebaseapp.com",
  projectId: "pawan-enterprises-shop",
  storageBucket: "pawan-enterprises-shop.firebasestorage.app",
  messagingSenderId: "89341605121",
  appId: "1:89341605121:web:be2dde2e9b0bcb88ca1700",
  measurementId: "G-KTW8NZMQHL",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Messaging service
let messaging;

// Firebase messaging only works in secure contexts (HTTPS) and supported browsers
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Firebase Messaging failed to initialize", error);
  }
}

export { app, messaging, getToken, onMessage, analytics };
