importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyDwYlKVwt1G8qqWCrTXeoyNwamWJhNt-4U",
  authDomain: "pawan-enterprises-shop.firebaseapp.com",
  projectId: "pawan-enterprises-shop",
  storageBucket: "pawan-enterprises-shop.firebasestorage.app",
  messagingSenderId: "89341605121",
  appId: "1:89341605121:web:be2dde2e9b0bcb88ca1700",
  measurementId: "G-KTW8NZMQHL",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const notificationTitle = payload.notification.title || "New Notification";
  const notificationOptions = {
    body: payload.notification.body || "You have a new message.",
    icon: "/logo192.png", // Ensure this icon exists in public folder
    data: payload.data, // This passes along the data payload containing click_action
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  const clickAction = event.notification.data?.click_action || "/admin";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open with this URL
        for (const client of clientList) {
          if (client.url.includes(clickAction) && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      }),
  );
});
