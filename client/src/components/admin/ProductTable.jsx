import { useMemo, useState } from "react";

function ProductTable({
  products,
  editProduct,
  deleteProduct,
  updateStock,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  const [showAll, setShowAll] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All"
          ? true
          : product.category === category;
          
      let matchesStock = true;
      const totalStock = product.hasVariants ? (product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0) : (product.stock || 0);
      const isOutOfStock = totalStock === 0;

      if (stockFilter === "InStock") matchesStock = !isOutOfStock;
      if (stockFilter === "OutStock") matchesStock = isOutOfStock;
      if (stockFilter === "LowStock") {
         const threshold = product.lowStockThreshold || 5;
         matchesStock = !isOutOfStock && totalStock <= threshold;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
    
    return filtered.sort((a, b) => {
      if (sortOrder === "NameAsc") return a.name.localeCompare(b.name);
      if (sortOrder === "NameDesc") return b.name.localeCompare(a.name);
      if (sortOrder === "PriceAsc") return a.price - b.price;
      if (sortOrder === "PriceDesc") return b.price - a.price;
      if (sortOrder === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });
  }, [products, search, category, stockFilter, sortOrder]);

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 5);

  const renderStock = (product) => {
    if (product.hasVariants) {
      const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
      return <span style={{ fontSize: "12px", color: "#666" }}>{totalStock} (in variants)</span>;
    }
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button 
          style={{ cursor: "pointer", padding: "2px 8px", background: "#f0f0f0", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", fontWeight: "bold", color: "#333" }}
          onClick={() => updateStock(product._id, Math.max(0, product.stock - 1))}
        >
          -
        </button>
        <span
          className={
            product.stock === 0 ? "badge danger" :
            product.stock <= (product.lowStockThreshold || 5)
              ? "badge warning"
              : "badge success"
          }
          style={{ minWidth: "25px", textAlign: "center" }}
        >
          {product.stock}
        </span>
        <button 
          style={{ cursor: "pointer", padding: "2px 8px", background: "#f0f0f0", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", fontWeight: "bold", color: "#333" }}
          onClick={() => updateStock(product._id, product.stock + 1)}
        >
          +
        </button>
      </div>
    );
  };

  const getStatus = (product) => {
    if (!product.active) return <span className="badge danger">Hidden</span>;
    const totalStock = product.hasVariants ? (product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0) : (product.stock || 0);
    if (totalStock === 0) {
       return <span className="badge danger" style={{ background: "#dc3545" }}>Out of Stock</span>;
    } else if (totalStock <= (product.lowStockThreshold || 5)) {
       return <span className="badge warning" style={{ background: "#ffc107", color: "#000" }}>Low Stock</span>;
    }
    return <span className="badge success" style={{ background: "#28a745" }}>In Stock</span>;
  };

  return (
    <div className="admin-card">
      <div className="table-header" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div className="table-header-top">
          <h2>Product Inventory ({filteredProducts.length})</h2>
          <button style={{ padding: "8px 15px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>+ Add New Product</button>
        </div>

        <div className="table-filters">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Paints">Paints</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Stationery">Stationery</option>
            <option value="Grocery">Grocery</option>
            <option value="Household">Household</option>
            <option value="Others">Others</option>
          </select>
          
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="InStock">In Stock</option>
            <option value="LowStock">Low Stock</option>
            <option value="OutStock">Out of Stock</option>
          </select>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="Newest">Sort: Newest</option>
            <option value="Oldest">Sort: Oldest</option>
            <option value="PriceDesc">Sort: Price High to Low</option>
            <option value="PriceAsc">Sort: Price Low to High</option>
            <option value="NameAsc">Sort: Name A-Z</option>
            <option value="NameDesc">Sort: Name Z-A</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "800px" }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Details</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row" style={{ textAlign: "center", padding: "20px" }}>
                  No Products Found
                </td>
              </tr>
            ) : (
              displayedProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      className="table-image"
                      src={product.image?.startsWith("http") || product.image?.startsWith("//") ? product.image : `//${window.location.host}/api/images/${product.image}`}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong style={{ fontSize: "14px", color: "#333" }}>{product.name}</strong>
                      <span style={{ fontSize: "12px", color: "#666" }}>{product.category} {product.subCategory ? `> ${product.subCategory}` : ""}</span>
                      <div style={{ display: "flex", gap: "5px", marginTop: "4px" }}>
                        {product.featured && <span style={{ fontSize: "10px", background: "#17a2b8", color: "white", padding: "2px 5px", borderRadius: "3px" }}>Featured</span>}
                        {product.hasVariants && <span style={{ fontSize: "10px", background: "#6c757d", color: "white", padding: "2px 5px", borderRadius: "3px" }}>Variants</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong style={{ color: "#28a745" }}>₹{product.price}</strong>
                      <span style={{ fontSize: "12px", color: "#999", textDecoration: "line-through" }}>₹{product.mrp}</span>
                    </div>
                  </td>
                  <td>{renderStock(product)}</td>
                  <td>{getStatus(product)}</td>
                  <td>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons" style={{ display: "flex", gap: "5px" }}>
                      <button
                        className="edit-btn"
                        style={{ padding: "5px 10px", background: "#0056b3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                        onClick={() => editProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredProducts.length > 5 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button 
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: "8px 20px",
              background: "#e6f7ff",
              color: "#1890ff",
              border: "1px solid #91d5ff",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            {showAll ? "Show Less Products" : `Show All Products (${filteredProducts.length})`}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductTable;