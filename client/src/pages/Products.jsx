import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
  } from "react";
  import { useSearchParams, useNavigationType } from "react-router-dom";
  
  import api from "../services/api";
  
  import ProductCard from "../components/ProductCard";
  import SearchBar from "../components/SearchBar";
  
  import { useCart } from "../context/CartContext";
  
  import "../styles/Products.css";
  
  function Products() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [sort, setSort] = useState("newest");
    const [inStock, setInStock] = useState(false);
  
    const { addToCart } = useCart();
    const navigationType = useNavigationType();

    // Sync state with URL params on route change
    useEffect(() => {
      const querySearch = searchParams.get("search");
      const queryCategory = searchParams.get("category");
      
      if (querySearch !== null) setSearch(querySearch);
      if (queryCategory !== null) setCategory(queryCategory);
    }, [searchParams]);

    // Fetch Products
    const fetchProducts = useCallback(async () => {
      try {
        setLoading(true);
  
        const res = await api.get("/products", {
          params: {
            search,
            category,
            sort,
            inStock,
          },
        });
  
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }, [search, category, sort, inStock]);
  
    // Debounced Search
    useEffect(() => {
      const timer = setTimeout(() => {
        fetchProducts();
      }, 400);
  
      return () => clearTimeout(timer);
    }, [fetchProducts]);

    // Scroll Restoration Logic
    const scrollPos = useRef(0);

    useEffect(() => {
      if (!loading && navigationType === "POP") {
        const savedScroll = sessionStorage.getItem("productsScrollPos");
        if (savedScroll) {
          setTimeout(() => window.scrollTo(0, parseInt(savedScroll, 10)), 0);
        }
      }
    }, [loading, navigationType]);

    useEffect(() => {
      const handleScroll = () => {
        scrollPos.current = window.scrollY;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        sessionStorage.setItem("productsScrollPos", scrollPos.current.toString());
      };
    }, []);
  
    // Products are already filtered by the backend
    const filteredProducts = useMemo(() => products, [products]);
  
    return (
      <section className="products-page section">
        <div className="container">
          <div className="page-header">
            <h1>Our Products</h1>
  
            <p>
              Browse our collection of grocery,
              cosmetics, paints, stationery and
              household essentials.
            </p>
          </div>
  
          <SearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
            inStock={inStock}
            setInStock={setInStock}
          />
  
          {loading ? (
            <div className="loading-products">
              <h3>Loading products...</h3>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <h2>No Products Found</h2>
              <p>Try changing your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="results-count">
                {filteredProducts.length} Product
                {filteredProducts.length !== 1 ? "s" : ""} Found
              </div>
  
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    );

}

export default Products;