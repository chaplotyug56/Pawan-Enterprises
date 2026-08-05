import { FaWhatsapp } from "react-icons/fa";
import "../styles/FloatingWhatsApp.css";

function FloatingWhatsApp() {
  const phone = "919929119290";

  const message = encodeURIComponent(
    "Hello Pawan Enterprises, I would like to know about your products."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
    >
      <FaWhatsapp />
    </a>
  );
}

export default FloatingWhatsApp;