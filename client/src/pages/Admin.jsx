import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../services/api";

import ProductForm from "../components/admin/ProductForm";
import ProductTable from "../components/admin/ProductTable";
import ConfirmModal from "../components/admin/ConfirmModal";
import NotificationBell from "../components/admin/NotificationBell";
import NotificationSettings from "../components/admin/NotificationSettings";

import "../styles/Admin.css";

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    brand: "",
    sku: "",
    description: "",
    mrp: "",
    price: "",
    gstPercent: 0,
    stock: "",
    lowStockThreshold: 5,
    allowOutOfStockPurchase: false,
    images: [],
    hasVariants: false,
    variants: [],
    deliveryAvailable: true,
    deliveryCharge: 0,
    freeDeliveryAbove: 1000,
    estimatedDeliveryTime: "1 Business Day",
    deliveryRadiusKm: 0,
    weight: "",
    unit: "",
    manufacturer: "",
    countryOfOrigin: "",
    expiryDate: "",
    productType: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    showOnHomepage: false,
    active: true,
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

  async function loadDashboard() {
    try {
      setLoading(true);
      await fetchProducts();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
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
        name: product.name || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        brand: product.brand || "",
        sku: product.sku || "",
        description: product.description || "",
        mrp: product.mrp || "",
        price: product.price || "",
        gstPercent: product.gstPercent || 0,
        stock: product.stock !== undefined ? product.stock : "",
        lowStockThreshold: product.lowStockThreshold !== undefined ? product.lowStockThreshold : 5,
        allowOutOfStockPurchase: product.allowOutOfStockPurchase || false,
        images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
        hasVariants: product.hasVariants || false,
        variants: product.variants || [],
        deliveryAvailable: product.deliveryAvailable !== undefined ? product.deliveryAvailable : true,
        deliveryCharge: product.deliveryCharge || 0,
        freeDeliveryAbove: product.freeDeliveryAbove !== undefined ? product.freeDeliveryAbove : 1000,
        estimatedDeliveryTime: product.estimatedDeliveryTime || "1 Business Day",
        deliveryRadiusKm: product.deliveryRadiusKm || 0,
        weight: product.weight || "",
        unit: product.unit || "",
        manufacturer: product.manufacturer || "",
        countryOfOrigin: product.countryOfOrigin || "",
        expiryDate: product.expiryDate || "",
        productType: product.productType || "",
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        newArrival: product.newArrival || false,
        showOnHomepage: product.showOnHomepage || false,
        active: product.active !== undefined ? product.active : true,
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
                sku: v.sku || "",
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
        name: "",
        category: "",
        subCategory: "",
        brand: "",
        sku: "",
        description: "",
        mrp: "",
        price: "",
        gstPercent: 0,
        stock: "",
        lowStockThreshold: 5,
        allowOutOfStockPurchase: false,
        images: [],
        hasVariants: false,
        variants: [],
        deliveryAvailable: true,
        deliveryCharge: 0,
        freeDeliveryAbove: 1000,
        estimatedDeliveryTime: "1 Business Day",
        deliveryRadiusKm: 0,
        weight: "",
        unit: "",
        manufacturer: "",
        countryOfOrigin: "",
        expiryDate: "",
        productType: "",
        featured: false,
        bestSeller: false,
        newArrival: false,
        showOnHomepage: false,
        active: true,
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
        <h1 className="admin-title">Manage Products</h1>
        <NotificationBell />
      </div>

      <NotificationSettings />

      <ProductForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        setForm={setForm}
      />

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
