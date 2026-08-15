import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/CategoryCard.css";

function CategoryCard({ title, image, link }) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
      <Link to={link} className="category-card">
        <img src={image} alt={title} />

        <div className="category-overlay">
          <h3>{title}</h3>
        </div>
      </Link>
    </motion.div>
  );
}

export default CategoryCard;
