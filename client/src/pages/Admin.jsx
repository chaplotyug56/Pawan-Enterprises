import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../services/api";

import DashboardCards from "../components/admin/DashboardCards";
import ProductForm from "../components/admin/ProductForm";
import ProductTable from "../components/admin/ProductTable";
import ConfirmModal from "../components/admin/ConfirmModal";

import "../styles/Admin.css";
import RecentOrders from "../components/admin/RecentOrders";
import AnalyticsCharts from "../components/admin/AnalyticsCharts";
import NotificationBell from "../components/admin/NotificationBell";
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
    image: null,
    images: [],
  });
  async function fetchProducts() {
    try {
      const res = await api.get("/products");
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (files) {
      if (name === "images") {
        const promises = Array.from(files).map(file => {
             return new Promise((resolve) => {
                 const reader = new FileReader();
                 reader.onload = (e) => resolve(e.target.result);
                 reader.readAsDataURL(file);
             });
         });
         Promise.all(promises).then(base64Images => {
             setForm((prev) => ({
                 ...prev,
                 images: base64Images
             }));
         });
      } else {
         const file = files[0];
         const reader = new FileReader();
         reader.onload = (e) => {
             setForm((prev) => ({
                 ...prev,
                 [name]: e.target.result
             }));
         };
         reader.readAsDataURL(file);
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
        image: product.image,
        images: product.images || [],
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

  async function handleSubmit(e) {
    e.preventDefault();

    const data = { ...form };

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
        image:null,
        mrp:"",
        images:[]
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

<DashboardCards stats={stats} />
    


<AnalyticsCharts stats={stats} />

<RecentOrders />

      <ProductForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
      />

      <ProductTable
        products={products}
        editProduct={editProduct}
        deleteProduct={deleteProduct}
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