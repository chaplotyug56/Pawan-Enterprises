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
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [updatingMaintenance, setUpdatingMaintenance] = useState(false);

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

  async function fetchSettings() {
    try {
      const res = await api.get("/settings");
      if (res.data && res.data.data) {
        setMaintenanceMode(res.data.data.maintenanceMode);
      }
    } catch (err) {
      console.error("Unable to load settings", err);
    }
  }

  async function toggleMaintenanceMode() {
    setUpdatingMaintenance(true);
    const newValue = !maintenanceMode;
    try {
      await api.put("/settings", { maintenanceMode: newValue });
      setMaintenanceMode(newValue);
      if (newValue) {
        toast.warning("Site is now offline (Maintenance Mode ON)");
      } else {
        toast.success("Site is back online (Maintenance Mode OFF)");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle maintenance mode");
    } finally {
      setUpdatingMaintenance(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
    fetchSettings();

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
        { autoClose: 5000, closeOnClick: true, icon: "🛒" },
      );
      // Auto refresh dashboard to show new order
      fetchDashboard();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="loading-page">Loading Dashboard...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="admin-title mb-0">Reports & Analytics</h1>
        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch d-flex align-items-center gap-2 m-0 border border-danger rounded px-3 py-1 bg-light">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="maintenanceToggle"
              checked={maintenanceMode}
              onChange={toggleMaintenanceMode}
              disabled={updatingMaintenance}
              style={{ cursor: "pointer" }}
            />
            <label className="form-check-label text-danger fw-bold m-0" htmlFor="maintenanceToggle" style={{ cursor: "pointer" }}>
              Maintenance Mode
            </label>
          </div>
          <NotificationBell />
        </div>
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
