import {
    FaPaintRoller,
    FaBook,
    FaShoppingBasket,
    FaPumpSoap,
    FaGift,
    FaHome,
  } from "react-icons/fa";
  import { Link } from "react-router-dom";
  import "../styles/Categories.css";
  
  const categories = [
    {
      name: "Paints",
      icon: <FaPaintRoller />,
      color: "#FFE082",
    },
    {
      name: "Stationery",
      icon: <FaBook />,
      color: "#BBDEFB",
    },
    {
      name: "Grocery",
      icon: <FaShoppingBasket />,
      color: "#C8E6C9",
    },
    {
      name: "Cosmetics",
      icon: <FaPumpSoap />,
      color: "#F8BBD0",
    },
    {
      name: "Gift Items",
      icon: <FaGift />,
      color: "#E1BEE7",
    },
    {
      name: "Household",
      icon: <FaHome />,
      color: "#D7CCC8",
    },
  ];
  
  function Categories() {
    return (
      <section className="categories section">
  
        <div className="container">
  
          <div className="section-heading">
  
            <h2>Shop by Category</h2>
  
            <p>
              Find everything you need in one place
            </p>
  
          </div>
  
          <div className="category-grid">
  
            {categories.map((item, index) => (
  
              <Link
                key={index}
                to={`/products?category=${item.name}`}
                className="category-box"
                style={{
                  background: item.color,
                }}
              >
                <div className="category-icon">
                  {item.icon}
                </div>
  
                <h3>{item.name}</h3>
  
              </Link>
  
            ))}
  
          </div>
  
        </div>
  
      </section>
    );
  }
  
  export default Categories;
  