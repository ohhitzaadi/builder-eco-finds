import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "./storage";
import type { CartItem, ID, PurchaseItem } from "./types";

interface CartContextValue {
  cart: CartItem[];
  purchases: PurchaseItem[];
  addToCart: (productId: ID, quantity?: number) => void;
  removeFromCart: (cartItemId: ID) => void;
  clearCart: () => void;
  checkout: (priceLookup: (productId: ID) => number) => void; // price in cents
}

const CART_KEY = (userId: string | null) => (userId ? `cart:${userId}` : `cart:guest`);
const PURCHASES_KEY = (userId: string | null) => (userId ? `purchases:${userId}` : `purchases:guest`);

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ userId, children }: { userId: string | null; children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => loadJSON<CartItem[]>(CART_KEY(userId), []));
  const [purchases, setPurchases] = useState<PurchaseItem[]>(() => loadJSON<PurchaseItem[]>(PURCHASES_KEY(userId), []));

  useEffect(() => {
    saveJSON(CART_KEY(userId), cart);
  }, [cart, userId]);

  useEffect(() => {
    saveJSON(PURCHASES_KEY(userId), purchases);
  }, [purchases, userId]);

  const addToCart = useCallback((productId: ID, quantity = 1) => {
    setCart((prev) => [{ id: crypto.randomUUID(), productId, quantity, addedAt: Date.now() }, ...prev]);
  }, []);

  const removeFromCart = useCallback((cartItemId: ID) => {
    setCart((prev) => prev.filter((c) => c.id !== cartItemId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback((priceLookup: (productId: ID) => number) => {
    const now = Date.now();
    const purchased: PurchaseItem[] = cart.map((c) => ({
      id: crypto.randomUUID(),
      productId: c.productId,
      purchasedAt: now,
      priceAtPurchase: priceLookup(c.productId),
    }));
    setPurchases((prev) => [...purchased, ...prev]);
    setCart([]);
  }, [cart]);

  const value = useMemo<CartContextValue>(() => ({ cart, purchases, addToCart, removeFromCart, clearCart, checkout }), [cart, purchases, addToCart, removeFromCart, clearCart, checkout]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
