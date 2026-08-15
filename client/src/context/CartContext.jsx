import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, setCart] = useState(() => {
    const key = user ? `cart_${user._id}` : "cart_guest";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // When user changes (e.g. login/logout), load their cart
  useEffect(() => {
    const key = user ? `cart_${user._id}` : "cart_guest";
    const saved = localStorage.getItem(key);
    setCart(saved ? JSON.parse(saved) : []);
  }, [user]);

  // When cart changes, save it
  useEffect(() => {
    const key = user ? `cart_${user._id}` : "cart_guest";
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);

  const addToCart = (product) => {
    if (user && user.role === "staff") {
      toast.error("Staff accounts cannot place orders.");
      return;
    }

    setCart((prev) => {
      // Create a unique cart item identifier based on options
      const cartItemId = `${product._id}-${product.color || ""}-${product.size || ""}`;

      const existing = prev.find((item) => {
        const itemId = `${item._id}-${item.color || ""}-${item.size || ""}`;
        return itemId === cartItemId;
      });

      if (existing) {
        toast.success("✅ Quantity updated in cart");

        return prev.map((item) => {
          const itemId = `${item._id}-${item.color || ""}-${item.size || ""}`;
          return itemId === cartItemId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item;
        });
      }

      toast.success("🛒 Product added to cart");

      return [
        ...prev,
        {
          ...product,
          cartItemId,
          quantity: 1,
        },
      ];
    });
  };

  const buyNow = (product) => {
    if (user && user.role === "staff") {
      toast.error("Staff accounts cannot place orders.");
      return;
    }

    const cartItemId = `${product._id}-${product.color || ""}-${product.size || ""}`;
    setCart([
      {
        ...product,
        cartItemId,
        quantity: 1,
      },
    ]);

    toast.success("🚀 Proceeding to Checkout");
  };

  const increaseQuantity = (cartItemId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId || item._id === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (cartItemId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId || item._id === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.cartItemId !== cartItemId && item._id !== cartItemId,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
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
