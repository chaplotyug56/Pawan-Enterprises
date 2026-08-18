import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./services/api";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminReport from "./pages/AdminReport";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import StaffDashboard from "./pages/StaffDashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import AdminReviews from "./pages/AdminReviews";
import Addresses from "./pages/Addresses";
import AdminSettings from "./pages/AdminSettings";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ShopBilling from "./pages/ShopBilling";
import AdminShopBills from "./pages/AdminShopBills";
import Maintenance from "./pages/Maintenance";

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get("/settings");
        if (res.data && res.data.data) {
          setMaintenanceMode(res.data.data.maintenanceMode);
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

  if (loadingSettings) {
    return null; // or a full screen loader
  }

  const isAdminOrStaff = user && (user.role === "admin" || user.role === "staff");
  const isLoginPage = location.pathname === "/login";

  if (maintenanceMode && !isAdminOrStaff && !isLoginPage) {
    return <Maintenance />;
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/report"
          element={
            <ProtectedRoute>
              <AdminReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route
          path="/admin/billing"
          element={
            <ProtectedRoute>
              <ShopBilling />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shop-bills"
          element={
            <ProtectedRoute>
              <AdminShopBills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute>
              <AdminReviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />

      <FloatingWhatsApp />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
