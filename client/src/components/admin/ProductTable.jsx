import { useMemo, useState } from "react";

function ProductTable({
  products,
  editProduct,
  deleteProduct,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All"
          ? true
          : product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

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

              filteredProducts.map((product) => (

                <tr key={product._id}>

                  <td>

                    <img
                      className="table-image"
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `/uploads/${product.image}`
                      }
                      alt={product.name}
                    />

                  </td>

                  <td>{product.name}</td>

                  <td>{product.category}</td>

                  <td>₹{product.price}</td>

                  <td>

                    <span
                      className={
                        product.stock === 0
                          ? "badge danger"

                          : product.stock < 5
                          ? "badge warning"

                          : "badge success"
                      }
                    >
                      {product.stock === 0
                        ? "Out"

                        : product.stock < 5
                        ? "Low"

                        : "In Stock"}
                    </span>

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

    </div>
  );
}

export default ProductTable;