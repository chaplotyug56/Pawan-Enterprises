const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let initializationError = "Unknown error";
let app = null;
let auth = null;

function initializeFirebaseAdmin() {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      initializationError = "Missing Env: " + (!process.env.FIREBASE_PROJECT_ID ? "PROJECT_ID " : "") + (!process.env.FIREBASE_CLIENT_EMAIL ? "CLIENT_EMAIL " : "") + (!process.env.FIREBASE_PRIVATE_KEY ? "PRIVATE_KEY" : "");
      console.warn("⚠️ Firebase Admin SDK is NOT initialized:", initializationError);
      return null;
    }

    if (!getApps().length) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines with actual newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      auth = getAuth(app);
    }
    return { app, auth };
  } catch (error) {
    initializationError = "Firebase Init Error: " + error.message;
    console.error("🔥 Error initializing Firebase Admin:", error);
    return null;
  }
}

const firebaseAdmin = initializeFirebaseAdmin();

module.exports = { 
  admin: firebaseAdmin ? firebaseAdmin.app : null, 
  auth: firebaseAdmin ? firebaseAdmin.auth : null,
  initializationError 
};
