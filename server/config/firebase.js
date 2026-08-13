const admin = require("firebase-admin");
let initializationError = "Unknown error";

function initializeFirebaseAdmin() {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      initializationError = "Missing Env: " + (!process.env.FIREBASE_PROJECT_ID ? "PROJECT_ID " : "") + (!process.env.FIREBASE_CLIENT_EMAIL ? "CLIENT_EMAIL " : "") + (!process.env.FIREBASE_PRIVATE_KEY ? "PRIVATE_KEY" : "");
      console.warn("⚠️ Firebase Admin SDK is NOT initialized:", initializationError);
      return null;
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines with actual newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log("✅ Firebase Admin SDK initialized successfully");
    }
    return admin;
  } catch (error) {
    initializationError = "Firebase Init Error: " + error.message;
    console.error("🔥 Error initializing Firebase Admin:", error);
    return null;
  }
}

const firebaseAdmin = initializeFirebaseAdmin();

module.exports = { admin: firebaseAdmin, initializationError };
