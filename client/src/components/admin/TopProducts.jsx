import { useState } from "react";

function TopProducts({ products }) {
  const [showAll, setShowAll] = useState(false);
  const displayedProducts = showAll ? products : products?.slice(0, 5) || [];

  if (!displayedProducts.length) return null;

  return (
    <div className="recent-orders">
      <h2>Top Selling Products</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {displayedProducts.map((product) => (
            <tr key={product._id}>
              <td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>
                    {product.name}
                  </span>
                </div>
              </td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>
                <span className="badge success">{product.salesCount} sold</span>
              </td>
              <td>
                <span
                  className={`badge ${product.stock > 10 ? "success" : product.stock >= 3 ? "warning" : "danger"}`}
                >
                  {product.stock}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products?.length > 5 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={() => setShowAll(!showAll)} className="edit-btn">
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TopProducts;
