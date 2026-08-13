import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

import DashboardCards from "../components/admin/DashboardCards";
import RecentOrders from "../components/admin/RecentOrders";
import TopProducts from "../components/admin/TopProducts";
import RecentCustomers from "../components/admin/RecentCustomers";
import AnalyticsCharts from "../components/admin/AnalyticsCharts";
import NotificationBell from "../components/admin/NotificationBell";
import NotificationSettings from "../components/admin/NotificationSettings";
import { onForegroundMessage } from "../utils/firebaseUtils";

import "../styles/Admin.css";

function AdminReport() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  async function fetchDashboard() {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();

    // Listen for foreground push notifications
    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload?.notification?.title || "New Notification";
      const body = payload?.notification?.body || "";
      toast.info(
        <div>
          <strong>{title}</strong>
          <br />
          {body}
        </div>,
        { autoClose: 5000, closeOnClick: true, icon: "🛒" }
      );
      // Auto refresh dashboard to show new order
      fetchDashboard();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Reports & Analytics</h1>
        <NotificationBell />
      </div>

      <NotificationSettings />

      <DashboardCards stats={stats} />

      <div className="analytics-grid">
        <AnalyticsCharts stats={stats} />
        <RecentOrders />
        <TopProducts products={stats?.topProducts} />
        <RecentCustomers customers={stats?.recentCustomers} />
      </div>
    </div>
  );
}

export default AdminReport;
