import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setMenuOpen(false);
      setSearch("");
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
  }, [search, products]);

  return (
    <div className="navbar-wrapper">
      <header className="navbar">

        {/* Logo */}

        <Link to="/" className="logo">
          <img src="/logo.png" alt="Pawan Enterprises Logo" className="logo-img" />

          <div>
            <h2>Pawan</h2>
            <span>Enterprises</span>
          </div>
        </Link>

        {/* Search */}

        <form className="search-box" onSubmit={handleSearchSubmit}>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            <FaSearch />
          </button>

          {suggestions.length > 0 && (
            <div className="search-dropdown">

              {suggestions.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="search-item"
                  onClick={() => {
                    setSearch("");
                    setSuggestions([]);
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div>
                    <strong>{product.name}</strong>
                    <p>₹{product.price}</p>
                  </div>

                </Link>
              ))}

            </div>
          )}

        </form>

        {/* Icons */}

        <div className="nav-icons">

          <NavLink to="/wishlist">
            <FaHeart />
            <span>Wishlist</span>
          </NavLink>

          <NavLink to="/cart" className="cart-link">

            <FaShoppingCart />

            {cartCount > 0 && (
              <div className="cart-count">
                {cartCount}
              </div>
            )}

            <span>Cart</span>

          </NavLink>

          {!user ? (
            <NavLink to="/login">
              <FaUser />
              <span>Login</span>
            </NavLink>
          ) : (
            <NavLink to="/profile">
              <FaUser />
              <span>{user.name.split(" ")[0]}</span>
            </NavLink>
          )}

        </div>

        {/* Mobile Menu Button */}

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </header>

      {/* Navigation */}

      <nav className={`menu ${menuOpen ? "show" : ""}`}>

        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/products" onClick={() => setMenuOpen(false)}>
          Products
        </NavLink>

        {user && (
          <>
            <NavLink to="/my-orders" onClick={() => setMenuOpen(false)}>
              My Orders
            </NavLink>

            <NavLink to="/addresses" onClick={() => setMenuOpen(false)}>
              Saved Addresses
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
              Admin Dashboard
            </NavLink>

            <NavLink to="/admin/orders" onClick={() => setMenuOpen(false)}>
              Manage Orders
            </NavLink>

            <NavLink to="/admin/billing" onClick={() => setMenuOpen(false)}>
              Shop Billing
            </NavLink>

            <NavLink to="/admin/reviews" onClick={() => setMenuOpen(false)}>
              Reviews
            </NavLink>
          </>
        )}

        {!user && (
          <NavLink to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </NavLink>
        )}

        {user && (
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        )}

      </nav>
    </div>
  );
}

export default Navbar;