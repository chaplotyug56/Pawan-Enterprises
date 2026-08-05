import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const key = user ? `cart_${user._id}` : "cart_guest";
      
        const saved = localStorage.getItem(key);
      
        setCart(saved ? JSON.parse(saved) : []);
      }, [user]);

      useEffect(() => {
        const key = user ? `cart_${user._id}` : "cart_guest";
      
        localStorage.setItem(key, JSON.stringify(cart));
      }, [cart, user]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id
      );
  
      if (existing) {
        toast.success("✅ Quantity updated in cart");
  
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }
  
      toast.success("🛒 Product added to cart");
  
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const buyNow = (product) => {
    setCart([
      {
        ...product,
        quantity: 1,
      },
    ]);
  
    toast.success("🚀 Proceeding to Checkout");
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
    value={{
        cart,
        addToCart,
        buyNow,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);