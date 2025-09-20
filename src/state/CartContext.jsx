import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cc_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cc_cart", JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + (it.price || 0) * it.quantity, 0);

  const value = useMemo(() => ({
    items,
    totalItems,
    subtotal,
    addToCart: (product) => {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p._id === product._id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
          return copy;
        }
        return [...prev, { _id: product._id, name: product.name, price: product.price || 0, image: product.image, quantity: 1 }];
      });
    },
    removeFromCart: (id) => setItems((prev) => prev.filter((p) => p._id !== id)),
    updateQty: (id, qty) => setItems((prev) => prev.map((p) => p._id === id ? { ...p, quantity: Math.max(1, qty) } : p)),
    clearCart: () => setItems([]),
  }), [items, totalItems, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


