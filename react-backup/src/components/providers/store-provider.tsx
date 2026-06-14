

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product, Category, Order } from "@/lib/types";
import { products as initialProducts, categories as initialCategories } from "@/lib/data";
import { supabase, supabaseOrders } from "@/lib/supabase";

export interface SiteSettings {
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
  promoTitle: string;
  promoHeadline: string;
  promoDescription: string;
  promoLink: string;
  promoButtonText: string;
  heroImage1?: string;
  heroImage2?: string;
  heroImage3?: string;
  heroImage4?: string;
  heroImage5?: string;
  heroImage6?: string;
  heroImage7?: string;
  gtmId?: string;
  duplicateBlockHours?: number;
  heroMobileFourCards?: boolean;
  shippingInsideDhaka?: number;
  shippingOutsideDhaka?: number;
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
  heroImage1: "/brand/hero_orange_model.webp",
  heroImage2: "/brand/hero_kid_model.webp",
  heroImage3: "/brand/hero_green_model.webp",
  heroImage4: "/brand/hero_yellow_model.webp",
  heroImage5: "/brand/hero_blue_model.webp",
  heroImage6: "/brand/hero_mint_model.webp",
  heroImage7: "/brand/hero_dark_green_model.webp",
  gtmId: "",
  duplicateBlockHours: 6,
  heroMobileFourCards: true,
  shippingInsideDhaka: 60,
  shippingOutsideDhaka: 130,
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
  loading: boolean;
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

const safeLocalStorageSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`LocalStorage write failed for key "${key}":`, e);
  }
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("cb_products");
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("cb_categories");
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("cb_orders");
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem("cb_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [theme, setThemeState] = useState<string>("lime");
  const [loading, setLoading] = useState<boolean>(() => {
    const savedProducts = localStorage.getItem("cb_products");
    const savedCategories = localStorage.getItem("cb_categories");
    const savedSettings = localStorage.getItem("cb_settings");
    return !(savedProducts && savedCategories && savedSettings);
  });

  // Load from Supabase on mount
  useEffect(() => {
    // 1. Load Settings
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("cb_settings")
          .select("*")
          .eq("id", "main_settings")
          .maybeSingle();
        
        if (!error && data && data.data) {
          const dbSettings = data.data;
          setSettings(dbSettings);
          safeLocalStorageSetItem("cb_settings", JSON.stringify(dbSettings));
        } else {
          // If not in DB, use defaultSettings or localStorage
          const savedSettings = localStorage.getItem("cb_settings");
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          } else {
            setSettings(defaultSettings);
            await supabase.from("cb_settings").upsert({ id: "main_settings", data: defaultSettings });
          }
        }
      } catch (e) {
        console.error("Error loading settings from DB:", e);
      }
    };

    // 2. Load Products
    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("cb_products")
          .select("*");

        if (!error && data) {
          const dbProducts = data.map((row: any) => row.data as Product);
          setProducts(dbProducts);
          safeLocalStorageSetItem("cb_products", JSON.stringify(dbProducts));
        } else {
          // Fallback to local storage if DB call returns empty/fails
          const savedProducts = localStorage.getItem("cb_products");
          if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
          }
        }
      } catch (e) {
        console.error("Error loading products from DB:", e);
      }
    };

    // 3. Load Categories
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("cb_categories")
          .select("*");

        if (!error && data) {
          const dbCategories = data.map((row: any) => row.data as Category);
          setCategories(dbCategories);
          safeLocalStorageSetItem("cb_categories", JSON.stringify(dbCategories));
        } else {
          // Fallback to local storage
          const savedCategories = localStorage.getItem("cb_categories");
          if (savedCategories) {
            setCategories(JSON.parse(savedCategories));
          }
        }
      } catch (e) {
        console.error("Error loading categories from DB:", e);
      }
    };

    // Load Local Orders
    const savedOrders = localStorage.getItem("cb_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error(e);
      }
    }

    // Load real orders from Supabase (ORDERS_DB)
    supabaseOrders
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (!error && data) {
          const mapped: Order[] = data.map((row: any) => {
            const statusMap = (status: string): Order["status"] => {
              const lower = (status || "").toLowerCase();
              if (lower === "new") return "pending";
              if (lower === "confirmed") return "confirmed";
              if (lower === "dispatched") return "dispatched";
              if (lower === "delivered") return "delivered";
              if (lower === "cancelled") return "cancelled";
              return "pending";
            };
            return {
              id: row.id as string,
              customerName: row.customer_name as string,
              phone: row.phone as string,
              city: (row.district as string) || "",
              area: "",
              address: row.address as string,
              note: (row.notes as string) ?? "",
              status: statusMap(row.status as string),
              paymentMethod: "cod" as const,
              subtotal: (row.subtotal as number) || ((row.amount as number) - (row.delivery_fee as number || 0)),
              deliveryFee: (row.delivery_fee as number) || 0,
              discount: (row.discount as number) || 0,
              total: row.amount as number,
              createdAt: row.created_at as string,
              items: ((row.ordered_items as any[]) || []).map((item: any) => ({
                productId: "",
                variantId: "",
                name: item.name as string,
                variantName: "",
                price: item.price as number,
                quantity: item.quantity as number,
                slug: "",
                image: "",
              })),
            };
          });
          setOrders(mapped);
        }
      });

    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const json = await res.json();
        if (json.ip) {
          (window as any).userIp = json.ip;
        }
      } catch (err) {
        console.error("Failed to fetch user IP address:", err);
      }
    };

    const init = async () => {
      try {
        await Promise.all([
          loadSettings(),
          loadProducts(),
          loadCategories(),
          fetchIp()
        ]);
      } catch (err) {
        console.error("Error loading store data:", err);
      } finally {
        setLoading(false);
      }
    };
    init();

    const savedTheme = localStorage.getItem("cb_theme");
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // Dynamically inject GTM scripts when gtmId changes
  useEffect(() => {
    const gtmId = settings.gtmId?.trim();
    if (!gtmId) {
      // Clean up if cleared
      document.getElementById("gtm-script-tag")?.remove();
      document.getElementById("gtm-noscript-tag")?.remove();
      return;
    }

    // 1. Inject Head Script (Load directly via src for max reliability)
    const scriptId = "gtm-script-tag";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Initialize dataLayer and push gtm.start event
    const globalWindow = window as any;
    globalWindow.dataLayer = globalWindow.dataLayer || [];
    
    // Avoid double pushing gtm.js startup event
    const hasGtmStart = globalWindow.dataLayer.some((e: any) => e && e.event === "gtm.js");
    if (!hasGtmStart) {
      globalWindow.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

    // Set flag on window object directly in React
    globalWindow.isGtmConfigured = true;
    document.head.appendChild(script);

    // 2. Inject Body Noscript (Re-create node to stay in sync)
    const noscriptId = "gtm-noscript-tag";
    const existingNoscript = document.getElementById(noscriptId);
    if (existingNoscript) {
      existingNoscript.remove();
    }

    const noscript = document.createElement("noscript");
    noscript.id = noscriptId;
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    // Insert immediately after body opening
    document.body.insertBefore(noscript, document.body.firstChild);
  }, [settings.gtmId]);

  const applyTheme = (color: string) => {
    const root = document.documentElement;
    // Clear custom gradient property
    root.style.removeProperty("--primary-gradient");

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
    } else if (color.startsWith("gradient:")) {
      // Format: gradient:startHex,endHex,foregroundType
      const parts = color.substring(9).split(",");
      const start = parts[0] || "#86E237";
      const end = parts[1] || "#FF6B35";
      const fgType = parts[2] || "dark";
      root.style.setProperty("--primary", start);
      root.style.setProperty("--primary-gradient", `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
      root.style.setProperty("--primary-foreground", fgType === "light" ? "oklch(0.98 0 0)" : "oklch(0.12 0.01 130)");
    } else if (color.startsWith("hex:")) {
      // Format: hex:value,foregroundType
      const parts = color.substring(4).split(",");
      const hex = parts[0] || "#86E237";
      const fgType = parts[1] || "dark";
      root.style.setProperty("--primary", hex);
      root.style.setProperty("--primary-foreground", fgType === "light" ? "oklch(0.98 0 0)" : "oklch(0.12 0.01 130)");
    }
  };

  const setTheme = (color: string) => {
    setThemeState(color);
    safeLocalStorageSetItem("cb_theme", color);
    applyTheme(color);
  };

  const addProduct = async (p: Product) => {
    const updated = [p, ...products];
    setProducts(updated);
    safeLocalStorageSetItem("cb_products", JSON.stringify(updated));
    try {
      await supabase.from("cb_products").upsert({ id: p.id, data: p });
    } catch (err) {
      console.error("Error saving product to DB:", err);
    }
  };

  const updateProduct = async (p: Product) => {
    const updated = products.map((item) => (item.id === p.id ? p : item));
    setProducts(updated);
    safeLocalStorageSetItem("cb_products", JSON.stringify(updated));
    try {
      await supabase.from("cb_products").upsert({ id: p.id, data: p });
    } catch (err) {
      console.error("Error updating product in DB:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    safeLocalStorageSetItem("cb_products", JSON.stringify(updated));
    try {
      await supabase.from("cb_products").delete().eq("id", id);
    } catch (err) {
      console.error("Error deleting product from DB:", err);
    }
  };

  const addCategory = async (c: Category) => {
    const updated = [...categories, c];
    setCategories(updated);
    safeLocalStorageSetItem("cb_categories", JSON.stringify(updated));
    try {
      await supabase.from("cb_categories").upsert({ id: c.id, data: c });
    } catch (err) {
      console.error("Error saving category to DB:", err);
    }
  };

  const updateCategory = async (c: Category) => {
    const original = categories.find((item) => item.id === c.id);
    const updatedCategories = categories.map((item) => (item.id === c.id ? c : item));
    setCategories(updatedCategories);
    safeLocalStorageSetItem("cb_categories", JSON.stringify(updatedCategories));
    try {
      await supabase.from("cb_categories").upsert({ id: c.id, data: c });
    } catch (err) {
      console.error("Error updating category in DB:", err);
    }

    if (original && (original.slug !== c.slug || original.name !== c.name)) {
      const updatedProducts = products.map((prod) => {
        if (prod.categorySlug === original.slug) {
          const uProd = {
            ...prod,
            categorySlug: c.slug,
            categoryName: c.name,
          };
          supabase.from("cb_products").upsert({ id: prod.id, data: uProd }).then(({ error }) => { if (error) console.error(error); });
          return uProd;
        }
        return prod;
      });
      setProducts(updatedProducts);
      safeLocalStorageSetItem("cb_products", JSON.stringify(updatedProducts));
    }
  };

  const deleteCategory = async (id: string) => {
    const original = categories.find((item) => item.id === id);
    const updatedCategories = categories.filter((item) => item.id !== id);
    setCategories(updatedCategories);
    safeLocalStorageSetItem("cb_categories", JSON.stringify(updatedCategories));
    try {
      await supabase.from("cb_categories").delete().eq("id", id);
    } catch (err) {
      console.error("Error deleting category from DB:", err);
    }

    if (original) {
      const fallback = updatedCategories[0];
      const updatedProducts = products.map((prod) => {
        if (prod.categorySlug === original.slug) {
          const uProd = {
            ...prod,
            categorySlug: fallback ? fallback.slug : "uncategorized",
            categoryName: fallback ? fallback.name : "Uncategorized",
          };
          supabase.from("cb_products").upsert({ id: prod.id, data: uProd }).then(({ error }) => { if (error) console.error(error); });
          return uProd;
        }
        return prod;
      });
      setProducts(updatedProducts);
      safeLocalStorageSetItem("cb_products", JSON.stringify(updatedProducts));
    }
  };

  const addOrder = (o: Order) => {
    // Avoid duplicates
    setOrders((prev) => {
      if (prev.some((item) => item.id === o.id)) return prev;
      const updated = [o, ...prev];
      safeLocalStorageSetItem("cb_orders", JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrder = async (o: Order) => {
    const mapStatusToDb = (status: string) => {
      if (status === "pending") return "New";
      if (status === "confirmed") return "Confirmed";
      if (status === "dispatched") return "Dispatched";
      if (status === "delivered") return "Delivered";
      if (status === "cancelled") return "Cancelled";
      return status;
    };

    // Update in Supabase
    await supabaseOrders
      .from("orders")
      .update({ status: mapStatusToDb(o.status) })
      .eq("id", o.id);
    const updated = orders.map((item) => (item.id === o.id ? o : item));
    setOrders(updated);
  };

  const deleteOrder = async (id: string) => {
    // Delete from Supabase
    await supabaseOrders.from("orders").delete().eq("id", id);
    const updated = orders.filter((item) => item.id !== id);
    setOrders(updated);
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    safeLocalStorageSetItem("cb_settings", JSON.stringify(updated));
    try {
      const { error } = await supabase.from("cb_settings").upsert({ id: "main_settings", data: updated });
      if (error) throw error;
    } catch (err) {
      console.error("Error saving settings to DB:", err);
      throw err;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        theme,
        loading,
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
