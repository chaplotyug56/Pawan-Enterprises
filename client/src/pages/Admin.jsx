import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../services/api";

import DashboardCards from "../components/admin/DashboardCards";
import ProductForm from "../components/admin/ProductForm";
import ProductTable from "../components/admin/ProductTable";
import ConfirmModal from "../components/admin/ConfirmModal";

import "../styles/Admin.css";
import RecentOrders from "../components/admin/RecentOrders";
import TopProducts from "../components/admin/TopProducts";
import RecentCustomers from "../components/admin/RecentCustomers";
import AnalyticsCharts from "../components/admin/AnalyticsCharts";
import NotificationBell from "../components/admin/NotificationBell";
import NotificationSettings from "../components/admin/NotificationSettings";
import { onForegroundMessage } from "../utils/firebaseUtils";

function Admin() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    mrp: "",
    price: "",
    stock: "",
    images: [],
    hasVariants: false,
    variants: [],
  });
  async function fetchProducts() {
    try {
      const res = await api.get("/products", { params: { admin: true } });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load products");
    }
  }

  async function fetchDashboard() {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadDashboard() {
    try {
      setLoading(true);

      await Promise.all([
        fetchProducts(),
        fetchDashboard(),
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (files) {
      if (name === "images") {
        setForm((prev) => ({
          ...prev,
          images: Array.from(files),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function editProduct(product) {
    setEditingId(product._id);
    setIsEditing(true);

    setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        mrp: product.mrp,
        price: product.price,
        stock: product.stock,
        images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
        hasVariants: product.hasVariants || false,
        variants: product.variants || [],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteProduct(id) {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    try {
      await api.delete(`/products/${deleteId}`);

      toast.success("Product deleted successfully");

      await loadDashboard();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  }

  async function updateStock(id, newStock) {
    if (newStock < 0) return;
    setProducts(products.map(p => p._id === id ? { ...p, stock: newStock } : p));
    try {
      await api.put(`/products/${id}`, { stock: newStock });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stock");
      fetchProducts(); // Revert on failure
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
        if (key === "images") {
            form.images.forEach((img) => {
                data.append("images", img);
            });
        }
        else if (key === "variants") {
            const variantsMetadata = form.variants.map(v => ({ 
                color: v.color, 
                size: v.size,
                mrp: v.mrp,
                price: v.price,
                stock: v.stock,
                image: typeof v.image === "string" ? v.image : "" 
            }));
            data.append("variants", JSON.stringify(variantsMetadata));
            form.variants.forEach((v, i) => {
                if (v.image instanceof File) {
                    data.append(`variantImage_${i}`, v.image);
                }
            });
        }
        else if (key !== "image") {
            data.append(key, form[key]);
        }
    });

    try {
      setLoading(true);

      if (isEditing) {
        await api.put(`/products/${editingId}`, data);
        toast.success("Product updated");
      } else {
        await api.post("/products", data);
        toast.success("Product added");
      }

      setForm({
        name:"",
        category:"",
        description:"",
        price:"",
        stock:"",
        images:[],
        hasVariants: false,
        variants: [],
    });

      setEditingId(null);
      setIsEditing(false);

      await loadDashboard();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  }

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
  <h1 className="admin-title">Admin Dashboard</h1>
  
  <NotificationBell />
</div>

<NotificationSettings />

<DashboardCards stats={stats} />
    <ProductForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        setForm={setForm}
      />

<div className="analytics-grid">
<AnalyticsCharts stats={stats} />

<RecentOrders />
<TopProducts products={stats?.topProducts} />
<RecentCustomers customers={stats?.recentCustomers} />
</div>

      <ProductTable
        products={products}
        editProduct={editProduct}
        deleteProduct={deleteProduct}
        updateStock={updateStock}
      />

      <ConfirmModal
        open={showDeleteModal}
        title="Delete Product"
        message="This action cannot be undone. Do you really want to delete this product?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

export default Admin;
