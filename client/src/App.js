import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";

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
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        <Route
  path="/wishlist"
  element={<Wishlist />}

/>

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

<ToastContainer
  position="top-right"
  autoClose={3000}
/>
    </>
  );
}

export default App;