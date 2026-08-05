import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import api from "../../services/api";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);

      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  async function markAllRead() {
    try {
      await api.put("/notifications/read-all");

      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="notification-bell"
      ref={dropdownRef}
    >
      <div onClick={() => setOpen(!open)}>
        <FaBell size={22} />

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="notification-dropdown">

          <div className="notification-header">
            <strong>Notifications</strong>

            <button onClick={markAllRead}>
              Mark all
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="empty">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${
                  !n.isRead ? "unread" : ""
                }`}
                onClick={() => markAsRead(n._id)}
              >
                <strong>{n.title}</strong>

                <p>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;