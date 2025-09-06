import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "./storage";
import type { Category, ID, Product } from "./types";

interface ProductsContextValue {
  products: Product[];
  categories: Category[];
  create: (input: Omit<Product, "id" | "createdAt" | "updatedAt" | "sellerId">, sellerId: ID) => Product;
  update: (id: ID, input: Partial<Omit<Product, "id" | "sellerId" | "createdAt">>) => void;
  remove: (id: ID) => void;
}

const PRODUCTS_KEY = "products";

const DEFAULT_CATEGORIES: Category[] = [
  "Fashion",
  "Beauty",
  "Accessories",
  "Electronics",
  "Smart Devices",
  "Home",
  "Furniture",
  "Decor",
  "Kitchen",
  "Books",
  "Media",
  "Educational",
  "Toys",
  "Sports",
  "Sports Gear",
  "Outdoor",
  "Outdoor Equipment",
  "Fitness",
  "Other",
];

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadJSON<Product[]>(PRODUCTS_KEY, []));

  useEffect(() => {
    saveJSON(PRODUCTS_KEY, products);
  }, [products]);

  const create = useCallback((input: Omit<Product, "id" | "createdAt" | "updatedAt" | "sellerId">, sellerId: ID) => {
    const p: Product = {
      id: crypto.randomUUID(),
      sellerId,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      price: Math.max(0, Math.round(input.price)),
      imageDataUrl: input.imageDataUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProducts((prev) => [p, ...prev]);
    return p;
  }, []);

  const update = useCallback((id: ID, input: Partial<Omit<Product, "id" | "sellerId" | "createdAt">>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...input, updatedAt: Date.now() } : p)));
  }, []);

  const remove = useCallback((id: ID) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo<ProductsContextValue>(() => ({ products, categories: DEFAULT_CATEGORIES, create, update, remove }), [products, create, update, remove]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
