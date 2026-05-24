"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product, Category, Order } from "@/lib/types";
import { products as initialProducts, categories as initialCategories } from "@/lib/data";

export interface SiteSettings {
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
  promoTitle: string;
  promoHeadline: string;
  promoDescription: string;
  promoLink: string;
  promoButtonText: string;
}

const defaultSettings: SiteSettings = {
  announcementText: "🎒 Free shoe bag included with every order  ·  COD available nationwide",
  heroHeadline: "Elevate Your Style With Bold Carry",
  heroSubheadline: "• learn about us through our bags •",
  promoTitle: "Weekend ready",
  promoHeadline: "Start with the Canvas Weekender.",
  promoDescription: "It gives the strongest brand impression: structured travel capacity, premium canvas texture, and a confident gym-to-weekend look.",
  promoLink: "/product/canvas-weekender",
  promoButtonText: "Buy with COD",
};

const initialOrders: Order[] = [
  {
    id: "ord-8f7a9",
    customerName: "Imran Khan",
    phone: "01712345678",
    status: "confirmed",
    paymentMethod: "cod",
    subtotal: 3450,
    deliveryFee: 120,
    discount: 0,
    total: 3570,
    items: [
      {
        productId: "prod-2",
        slug: "canvas-weekender",
        name: "Canvas Weekender",
        image: "/brand/prod_family_travel.webp",
        price: 3450,
        variantId: "v-1",
        variantName: "Stealth Black",
        quantity: 1,
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: "ord-4a2c1",
    customerName: "Nusrat Jahan",
    phone: "01987654321",
    status: "pending",
    paymentMethod: "cod",
    subtotal: 1850,
    deliveryFee: 120,
    discount: 150,
    total: 1820,
    items: [
      {
        productId: "prod-1",
        slug: "magnetic-gym-duffel",
        name: "Magnetic Gym Duffel",
        image: "/brand/prod_magnetic_gym.webp",
        price: 1850,
        variantId: "v-2",
        variantName: "Olive Green",
        quantity: 1,
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
  }
];

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: SiteSettings;
  theme: string;
  setTheme: (color: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [theme, setThemeState] = useState<string>("lime");

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("cb_products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error(e);
      }
    }
    const savedCategories = localStorage.getItem("cb_categories");
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error(e);
      }
    }
    const savedOrders = localStorage.getItem("cb_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error(e);
      }
    }
    const savedSettings = localStorage.getItem("cb_settings");
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error(e);
      }
    }
    const savedTheme = localStorage.getItem("cb_theme");
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (color: string) => {
    const root = document.documentElement;
    // Map theme keys to OKLCH values
    if (color === "lime") {
      root.style.setProperty("--primary", "oklch(0.83 0.21 130)");
      root.style.setProperty("--primary-foreground", "oklch(0.12 0.01 130)");
    } else if (color === "orange") {
      root.style.setProperty("--primary", "oklch(0.70 0.23 45)");
      root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 45)");
    } else if (color === "purple") {
      root.style.setProperty("--primary", "oklch(0.55 0.25 300)");
      root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 300)");
    } else if (color === "blue") {
      root.style.setProperty("--primary", "oklch(0.60 0.18 250)");
      root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 250)");
    } else if (color === "pink") {
      root.style.setProperty("--primary", "oklch(0.65 0.26 350)");
      root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 350)");
    }
  };

  const setTheme = (color: string) => {
    setThemeState(color);
    localStorage.setItem("cb_theme", color);
    applyTheme(color);
  };

  const addProduct = (p: Product) => {
    const updated = [p, ...products];
    setProducts(updated);
    localStorage.setItem("cb_products", JSON.stringify(updated));
  };

  const updateProduct = (p: Product) => {
    const updated = products.map((item) => (item.id === p.id ? p : item));
    setProducts(updated);
    localStorage.setItem("cb_products", JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    localStorage.setItem("cb_products", JSON.stringify(updated));
  };

  const addCategory = (c: Category) => {
    const updated = [...categories, c];
    setCategories(updated);
    localStorage.setItem("cb_categories", JSON.stringify(updated));
  };

  const updateCategory = (c: Category) => {
    const updated = categories.map((item) => (item.id === c.id ? c : item));
    setCategories(updated);
    localStorage.setItem("cb_categories", JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((item) => item.id !== id);
    setCategories(updated);
    localStorage.setItem("cb_categories", JSON.stringify(updated));
  };

  const addOrder = (o: Order) => {
    // Avoid duplicates
    setOrders((prev) => {
      if (prev.some((item) => item.id === o.id)) return prev;
      const updated = [o, ...prev];
      localStorage.setItem("cb_orders", JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrder = (o: Order) => {
    const updated = orders.map((item) => (item.id === o.id ? o : item));
    setOrders(updated);
    localStorage.setItem("cb_orders", JSON.stringify(updated));
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter((item) => item.id !== id);
    setOrders(updated);
    localStorage.setItem("cb_orders", JSON.stringify(updated));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("cb_settings", JSON.stringify(updated));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        theme,
        setTheme,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addOrder,
        updateOrder,
        deleteOrder,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
