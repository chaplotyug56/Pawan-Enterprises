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
      <div className="admin-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="admin-title" style={{ margin: 0 }}>Reports & Analytics</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          
          {/* Custom Styled Maintenance Toggle */}
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              border: "1px solid #ef4444", 
              borderRadius: "8px", 
              padding: "6px 12px", 
              backgroundColor: maintenanceMode ? "#fef2f2" : "#fff",
              cursor: "pointer"
            }}
            onClick={!updatingMaintenance ? toggleMaintenanceMode : undefined}
          >
            <input
              type="checkbox"
              id="maintenanceToggle"
              checked={maintenanceMode}
              onChange={() => {}} // Handled by div onClick
              disabled={updatingMaintenance}
              style={{ cursor: "pointer", margin: 0, width: "16px", height: "16px", accentColor: "#ef4444" }}
            />
            <label 
              htmlFor="maintenanceToggle" 
              style={{ color: "#ef4444", fontWeight: "600", margin: 0, cursor: "pointer", fontSize: "14px" }}
            >
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
