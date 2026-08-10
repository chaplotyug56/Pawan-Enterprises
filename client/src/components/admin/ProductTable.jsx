import { useMemo, useState } from "react";

function ProductTable({
  products,
  editProduct,
  deleteProduct,
  updateStock,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

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

      return matchesSearch && matchesCategory;
    });
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [products, search, category]);

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 5);

  return (
    <div className="admin-card">

      <div className="table-header">

        <h2>Products</h2>

        <div className="table-filters">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="All">
              All Categories
            </option>

            <option value="Paints">
              Paints
            </option>

            <option value="Cosmetics">
              Cosmetics
            </option>

            <option value="Stationery">
              Stationery
            </option>

            <option value="Grocery">
              Grocery
            </option>

            <option value="Household">
              Household
            </option>

            <option value="Gift Items">
              Gift Items
            </option>

          </select>

        </div>

      </div>

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Image</th>

              <th>Name</th>

              <th>Category</th>

              <th>Price</th>

              <th>Stock</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                >
                  No Products Found
                </td>

              </tr>

            ) : (

              displayedProducts.map((product) => (

                <tr key={product._id}>

                  <td>

                    <img
                      className="table-image"
                      src={product.image}
                      alt={product.name}
                    />

                  </td>

                  <td>{product.name}</td>

                  <td>{product.category}</td>

                  <td>₹{product.price}</td>

                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button 
                        style={{ cursor: "pointer", padding: "4px 10px", background: "#f0f0f0", border: "1px solid #ddd", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", color: "#333" }}
                        onClick={() => updateStock(product._id, product.stock - 1)}
                      >
                        -
                      </button>
                      <span
                        className={
                          product.stock < 3
                            ? "badge danger"
                            : product.stock <= 10
                            ? "badge warning"
                            : "badge success"
                        }
                        style={{ minWidth: "30px", textAlign: "center" }}
                      >
                        {product.stock}
                      </span>
                      <button 
                        style={{ cursor: "pointer", padding: "4px 10px", background: "#f0f0f0", border: "1px solid #ddd", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", color: "#333" }}
                        onClick={() => updateStock(product._id, product.stock + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editProduct(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteProduct(product._id)
                        }
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
              padding: "10px 20px",
              background: "#1565C0",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

    </div>
  );
}

export default ProductTable;