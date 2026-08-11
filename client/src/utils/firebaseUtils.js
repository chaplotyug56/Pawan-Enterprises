import { messaging, getToken, onMessage } from "../config/firebase";

// The VAPID key (Web Push certificate) provided from Firebase Console
const VAPID_KEY = "BIT_fbkTEwOHsMAz2bBzi79Tsb8SKcU102yCEDk4Rz_U4d3JfIpbDfyZRBFmqjHFHZC2hEaTspOY0vpMRoXqcG0"; 

export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      console.warn("Messaging not supported or not initialized.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Get the FCM token
      const currentToken = await getToken(messaging, { 
        vapidKey: VAPID_KEY 
      });
      
      if (currentToken) {
        console.log("FCM Token retrieved.");
        return currentToken;
      } else {
        console.warn("No registration token available. Request permission to generate one.");
        return null;
      }
    } else {
      console.warn("Notification permission denied by user.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token: ", error);
    return null;
  }
};

export const onForegroundMessage = (callback) => {
  if (!messaging) return null;
  return onMessage(messaging, (payload) => {
    console.log("Received foreground message: ", payload);
    callback(payload);
  });
};
