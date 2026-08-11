import React, { useState, useEffect } from "react";
import { requestNotificationPermission } from "../../utils/firebaseUtils";
import api from "../../services/api";
import { toast } from "react-toastify";

const NotificationSettings = () => {
  const [notificationStatus, setNotificationStatus] = useState("checking...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setNotificationStatus("unsupported");
    } else if (Notification.permission === "granted") {
      setNotificationStatus("enabled");
    } else if (Notification.permission === "denied") {
      setNotificationStatus("denied");
    } else {
      setNotificationStatus("disabled");
    }
  }, []);

  const enableNotifications = async () => {
    setLoading(true);
    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        // Send token to backend
        await api.post("/notifications/token", { 
          token, 
          deviceInfo: navigator.userAgent 
        });
        
        setNotificationStatus("enabled");
        toast.success("Order notifications enabled for this device!");
      } else {
        if (Notification.permission === "denied") {
          setNotificationStatus("denied");
          toast.error("Notifications are blocked by your browser settings.");
        } else {
          toast.error("Failed to generate notification token.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while enabling notifications.");
    } finally {
      setLoading(false);
    }
  };

  if (notificationStatus === "unsupported") {
    return null; // Don't show anything if browser doesn't support push
  }

  return (
    <div style={{
      background: "#fff",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          🔔 Order Notifications
        </h3>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          Status: {notificationStatus === "enabled" ? (
            <span style={{ color: "green", fontWeight: "bold" }}>Enabled ✅</span>
          ) : notificationStatus === "denied" ? (
            <span style={{ color: "red", fontWeight: "bold" }}>Blocked ❌</span>
          ) : (
            <span style={{ color: "orange", fontWeight: "bold" }}>Disabled ❌</span>
          )}
        </p>
        {notificationStatus === "enabled" && (
          <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#888" }}>
            This device will receive alerts for new orders.
          </p>
        )}
      </div>
      
      {notificationStatus !== "enabled" && notificationStatus !== "denied" && (
        <button
          onClick={enableNotifications}
          disabled={loading}
          style={{
            background: "#0056b3",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Enabling..." : "Enable Notifications"}
        </button>
      )}
      
      {notificationStatus === "denied" && (
        <span style={{ fontSize: "12px", color: "#888" }}>
          Unblock in site settings
        </span>
      )}
    </div>
  );
};

export default NotificationSettings;
