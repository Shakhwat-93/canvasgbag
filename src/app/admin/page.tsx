"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Sliders,
  Palette,
  Search,
  Plus,
  Trash2,
  Edit,
  LogOut,
  X,
  TrendingUp,
  Check,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, SiteSettings } from "@/components/providers/store-provider";
import { formatCurrency } from "@/lib/format";
import type { Product, Category, Order, OrderStatus } from "@/lib/types";

// Static data for color choices
const THEME_OPTIONS = [
  { id: "lime", name: "Lime Green", color: "#86E237", class: "bg-[#86E237]" },
  { id: "orange", name: "Electric Orange", color: "#FF6B35", class: "bg-[#FF6B35]" },
  { id: "purple", name: "Royal Purple", color: "#9B51E0", class: "bg-[#9B51E0]" },
  { id: "blue", name: "Classic Blue", color: "#3C99DC", class: "bg-[#3C99DC]" },
  { id: "pink", name: "Hot Pink", color: "#FF4081", class: "bg-[#FF4081]" },
];

export default function AdminPanel() {
  const {
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
    updateOrder,
    deleteOrder,
    updateSettings,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "orders" | "settings" | "theme">("dashboard");

  // Authentication check
  useEffect(() => {
    const isAuth = localStorage.getItem("cb_admin_auth") === "true";
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin" || passcode === "canvasbag123") {
      setIsAuthenticated(true);
      localStorage.setItem("cb_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode. Try 'admin' or 'canvasbag123'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cb_admin_auth");
    setPasscode("");
  };

  // State variables for Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    compareAtPrice: "",
    categorySlug: "",
    shortDescription: "",
    story: "",
    imageUrl: "",
    variantName: "",
    variantColor: "",
    variantStock: "",
    specs: "",
    benefits: "",
    isBestSeller: false,
    badge: "",
  });

  // State variables for Category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  // State for order details expansion
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");

  // State for settings page edit
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Calculations for Dashboard Stats
  const confirmedOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;

  // Custom Chart Data: represent weekly distribution of sales (mock)
  const salesChartData = [
    { day: "Jan", sales: 180000, height: "h-[35%]" },
    { day: "Feb", sales: 240000, height: "h-[45%]" },
    { day: "Mar", sales: 490000, height: "h-[90%]" },
    { day: "Apr", sales: 320000, height: "h-[60%]" },
    { day: "May", sales: 410000, height: "h-[75%]" },
    { day: "Jun", sales: 290000, height: "h-[55%]" },
    { day: "Jul", sales: 380000, height: "h-[70%]" },
  ];

  // Handler for product form submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.slug === productForm.categorySlug);

    const specsArray = productForm.specs
      ? productForm.specs.split("\n").map((s) => s.trim()).filter(Boolean)
      : ["Premium canvas material", "Practical carry system"];
    
    const benefitsArray = productForm.benefits
      ? productForm.benefits.split("\n").map((b) => b.trim()).filter(Boolean)
      : ["High durability", "Sleek look"];

    const slug = productForm.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: productForm.name,
      slug,
      categorySlug: productForm.categorySlug || "everyday-totes",
      categoryName: category ? category.name : "Everyday Totes",
      price: Number(productForm.price),
      compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
      rating: editingProduct ? editingProduct.rating : 4.8,
      reviewCount: editingProduct ? editingProduct.reviewCount : 12,
      shortDescription: productForm.shortDescription,
      story: productForm.story || "A versatile carry solution built for active routines.",
      benefits: benefitsArray,
      specs: specsArray,
      images: [
        {
          id: `img-1`,
          url: productForm.imageUrl || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
          alt: productForm.name,
        },
      ],
      variants: [
        {
          id: `v-1`,
          name: productForm.variantName || "Standard",
          color: productForm.variantColor || "#121212",
          stock: Number(productForm.variantStock || 50),
        },
      ],
      isBestSeller: productForm.isBestSeller,
      badge: productForm.badge || undefined,
    };

    if (editingProduct) {
      updateProduct(newProduct);
    } else {
      addProduct(newProduct);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: "",
      compareAtPrice: "",
      categorySlug: "",
      shortDescription: "",
      story: "",
      imageUrl: "",
      variantName: "",
      variantColor: "",
      variantStock: "",
      specs: "",
      benefits: "",
      isBestSeller: false,
      badge: "",
    });
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: String(prod.price),
      compareAtPrice: prod.compareAtPrice ? String(prod.compareAtPrice) : "",
      categorySlug: prod.categorySlug,
      shortDescription: prod.shortDescription,
      story: prod.story || "",
      imageUrl: prod.images[0]?.url || "",
      variantName: prod.variants[0]?.name || "Standard",
      variantColor: prod.variants[0]?.color || "#121212",
      variantStock: String(prod.variants[0]?.stock || 50),
      specs: prod.specs.join("\n"),
      benefits: prod.benefits.join("\n"),
      isBestSeller: !!prod.isBestSeller,
      badge: prod.badge || "",
    });
    setIsProductModalOpen(true);
  };

  // Handler for category form submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const newCategory: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: categoryForm.name,
      slug,
      description: categoryForm.description,
      image: categoryForm.image || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      productCount: editingCategory ? editingCategory.productCount : 0,
    };

    if (editingCategory) {
      updateCategory(newCategory);
    } else {
      addCategory(newCategory);
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      image: "",
    });
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert("Page settings saved successfully!");
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === "all" || o.status === orderFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-110px)] bg-[#0A0C0E] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#121418] border border-white/5 rounded-3xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.4)] backdrop-blur-xl relative z-10"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">CanvasBag Control Hub</h1>
            <p className="text-sm text-slate-400 mt-2">Enter administration passcode to access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className="w-full h-12 px-4 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50 text-center tracking-widest text-lg font-bold transition-all placeholder:text-slate-600"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-500 font-semibold bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center animate-shake">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-primary hover:opacity-90 active:scale-[0.98] transition-all text-primary-foreground font-extrabold rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Verify Passcode
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500 mt-6 font-medium">
            Demo credentials: <span className="font-bold text-slate-400">admin</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#0B0D0F] text-slate-200 font-sans flex flex-col md:flex-row relative">
      
      {/* Dynamic theme accent border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-20" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#111317] border-r border-white/5 p-5 flex flex-col shrink-0">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/25">
            🎒
          </div>
          <div>
            <h2 className="text-sm font-black text-white leading-none">CanvasBag</h2>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Control Center</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Products Catalog
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            Categories Map
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Order Registry
            {orders.filter((o) => o.status === "pending").length > 0 && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white grid place-items-center">
                {orders.filter((o) => o.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            Page Settings
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "theme"
                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Palette className="w-4 h-4" />
            Theme Accent
          </button>
        </nav>

        {/* Upgrade/Shortcut */}
        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Demo Storefront</p>
          <p className="text-[11px] text-slate-500 mt-1">Make changes here to see them instantly on the storefront pages.</p>
          <Link
            href="/"
            className="mt-3.5 inline-flex items-center gap-1 text-[11px] font-black text-primary hover:underline"
          >
            Storefront
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Exit Session
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-110px)] relative">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <span className="text-[10px] font-black tracking-widest text-primary uppercase">Management Console</span>
            <h1 className="text-2xl font-black text-white mt-1 capitalize">{activeTab} Interface</h1>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-500 font-semibold">Active theme:</span>
            <span className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {theme}
            </span>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Bento Stats row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-[#121418] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl transition-all group-hover:scale-110" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sales (BDT)</span>
                <p className="text-2xl font-black text-white mt-2 leading-none">{formatCurrency(totalRevenue)}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.4% vs last week</span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl transition-all group-hover:scale-110" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orders Registered</span>
                <p className="text-2xl font-black text-white mt-2 leading-none">{totalOrders}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <span className="text-red-400 font-bold">{orders.filter(o => o.status === "pending").length} pending</span>
                  <span>confirmation call</span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl transition-all group-hover:scale-110" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Products</span>
                <p className="text-2xl font-black text-white mt-2 leading-none">{activeProducts}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <span className="text-primary font-bold">{categories.length}</span>
                  <span>different bag types</span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl transition-all group-hover:scale-110" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Color Theme</span>
                <p className="text-2xl font-black text-white mt-2 leading-none uppercase tracking-wide flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary" />
                  {theme}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-bold hover:underline cursor-pointer" onClick={() => setActiveTab("theme")}>
                  <span>Change color accent →</span>
                </div>
              </div>
            </div>

            {/* Sales Chart Section */}
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="bg-[#121418] border border-white/5 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Cash Flow Summary</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Mocked monthly revenue overview in BDT</p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/20 uppercase tracking-wider">
                    2026 Sandbox
                  </span>
                </div>

                {/* SVG/Div Chart */}
                <div className="h-64 flex items-end gap-3.5 pt-4 border-b border-white/5 relative">
                  {salesChartData.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.sales / 1000}k
                      </div>
                      <div
                        className={`w-full rounded-t-lg bg-gradient-to-t from-primary/45 to-primary transition-all duration-500 ${data.height} group-hover:brightness-110 shadow-[0_0_20px_rgba(var(--primary),0.1)]`}
                      />
                      <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors pb-2">
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-[#121418] border border-white/5 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-primary font-bold hover:underline">
                    View Registry →
                  </button>
                </div>

                <div className="flex-1 space-y-3.5">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 bg-white/3 hover:bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white leading-none truncate">{order.customerName}</p>
                        <span className="text-[10px] text-slate-500 font-bold block mt-1 uppercase">
                          {order.id} · {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          order.status === "delivered"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : order.status === "cancelled"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs font-bold text-white leading-none">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Store Catalog ({products.length} Items)
              </h3>
              
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    price: "",
                    compareAtPrice: "",
                    categorySlug: categories[0]?.slug || "everyday-totes",
                    shortDescription: "",
                    story: "",
                    imageUrl: "",
                    variantName: "",
                    variantColor: "",
                    variantStock: "",
                    specs: "",
                    benefits: "",
                    isBestSeller: false,
                    badge: "",
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-primary hover:opacity-90 active:scale-[0.98] text-primary-foreground font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#121418] border border-white/5 rounded-2xl overflow-hidden shadow-sm flex flex-col group relative"
                >
                  <div className="relative aspect-[4/5] bg-slate-900 border-b border-white/5">
                    <Image
                      src={product.images[0]?.url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    {product.isBestSeller && (
                      <span className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Best Seller
                      </span>
                    )}
                    {product.badge && (
                      <span className="absolute top-2.5 right-2.5 bg-[#FF6B35] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {product.badge}
                      </span>
                    )}

                    {/* Quick actions overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform hover:scale-105 border border-white/10 cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-transform hover:scale-105 border border-red-500/10 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-slate-500 tracking-wider">
                        {product.categoryName}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1 leading-tight line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="mt-3.5 flex justify-between items-baseline">
                      <span className="text-xs font-black text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[10px] text-slate-500 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Product Categories Map
              </h3>
              
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({
                    name: "",
                    slug: "",
                    description: "",
                    image: "",
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="bg-primary hover:opacity-90 active:scale-[0.98] text-primary-foreground font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-[#121418] border border-white/5 rounded-3xl overflow-hidden shadow-sm group relative min-h-[160px] p-5 flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-300" />
                  
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-black text-white">{cat.name}</h4>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${cat.name}?`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <span>SLUG: <code className="text-primary font-mono lowercase">{cat.slug}</code></span>
                    <span>
                      {products.filter((p) => p.categorySlug === cat.slug).length} products
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Order Log Sandbox
              </h3>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by name, phone or id..."
                    className="h-10 pl-9 pr-4 rounded-xl border border-white/5 bg-[#121418] text-xs text-white focus:outline-none focus:border-primary/50 w-56 transition-all"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-white/5 bg-[#121418] text-xs text-white font-bold focus:outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-[#121418] border border-white/5 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/2 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Order Value</th>
                      <th className="p-4">COD Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                          <React.Fragment key={order.id}>
                            <tr className="hover:bg-white/1 transition-colors">
                              <td className="p-4 font-mono font-bold text-white uppercase">{order.id}</td>
                              <td className="p-4 font-bold text-slate-200">{order.customerName}</td>
                              <td className="p-4 font-medium text-slate-400">{order.phone}</td>
                              <td className="p-4 font-black text-white">{formatCurrency(order.total)}</td>
                              <td className="p-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => {
                                    updateOrder({ ...order, status: e.target.value as OrderStatus });
                                  }}
                                  className={`h-8 px-2.5 rounded-lg border text-[10px] font-black uppercase cursor-pointer ${
                                    order.status === "delivered"
                                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                                      : order.status === "cancelled"
                                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                                      : order.status === "dispatched"
                                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                      : order.status === "confirmed"
                                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="dispatched">Dispatched</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-4 flex items-center gap-3">
                                <button
                                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                  className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                                >
                                  {isExpanded ? "Collapse" : "Items"}
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete record for order ${order.id}?`)) {
                                      deleteOrder(order.id);
                                    }
                                  }}
                                  className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                                  title="Delete order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                            
                            {/* Expansion Detail */}
                            {isExpanded && (
                              <tr className="bg-white/1.5 border-y border-white/5">
                                <td colSpan={6} className="p-5">
                                  <div className="grid gap-6 md:grid-cols-2 text-xs">
                                    {/* Column 1: Shipping details */}
                                    <div className="space-y-2.5">
                                      <p className="font-black uppercase tracking-wider text-slate-400">Shipment Details</p>
                                      <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
                                        <span className="text-slate-500">Method:</span>
                                        <span className="font-bold text-white uppercase">{order.paymentMethod} (COD)</span>
                                        <span className="text-slate-500">Address:</span>
                                        <span className="font-bold text-slate-200">
                                          {order.items[0] ? (order as any).address || "CanvasBag client address grid" : "Stored Sandbox Location"}
                                        </span>
                                        <span className="text-slate-500">Date:</span>
                                        <span className="text-slate-400">{new Date(order.createdAt).toLocaleString()}</span>
                                      </div>
                                    </div>

                                    {/* Column 2: Items list */}
                                    <div className="space-y-2.5">
                                      <p className="font-black uppercase tracking-wider text-slate-400">Cart Contents</p>
                                      <div className="space-y-2">
                                        {order.items.length === 0 ? (
                                          <p className="text-slate-500 italic">Empty items list (refresh simulation order)</p>
                                        ) : (
                                          order.items.map((item) => (
                                            <div key={`${item.productId}-${item.variantId}`} className="flex justify-between items-center gap-4 bg-black/20 p-2 rounded-lg border border-white/5">
                                              <div>
                                                <p className="font-bold text-white">{item.name}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{item.variantName} x {item.quantity}</p>
                                              </div>
                                              <span className="font-bold text-slate-300">{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === "settings" && (
          <div className="bg-[#121418] border border-white/5 rounded-3xl p-6 shadow-sm max-w-3xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6">
              Page-wise Content Config
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Announcement Top Bar</label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Headline</label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroHeadline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full p-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50 resize-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Hero Badge Text</label>
                  <input
                    type="text"
                    value={settingsForm.heroSubheadline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-5 space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest">Home Promo Section Settings</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Pill Badge Title</label>
                    <input
                      type="text"
                      value={settingsForm.promoTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoTitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Promo Headline</label>
                    <input
                      type="text"
                      value={settingsForm.promoHeadline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoHeadline: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Promo Description</label>
                  <textarea
                    rows={3}
                    value={settingsForm.promoDescription}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoDescription: e.target.value })}
                    className="w-full p-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Promo Button Link</label>
                    <input
                      type="text"
                      value={settingsForm.promoLink}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoLink: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Promo Button Label</label>
                    <input
                      type="text"
                      value={settingsForm.promoButtonText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoButtonText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-white/5 bg-[#171A20] text-xs text-white focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-primary hover:opacity-90 active:scale-[0.98] text-primary-foreground font-black text-xs px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Apply Page Customizations
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: Theme */}
        {activeTab === "theme" && (
          <div className="bg-[#121418] border border-white/5 rounded-3xl p-6 shadow-sm max-w-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">
              Color Theme Designer
            </h3>
            <p className="text-xs text-slate-400 mb-8">
              Choose an elite-level accent color theme for the CanvasBag storefront. The UI adapts instantly.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {THEME_OPTIONS.map((opt) => {
                const isActive = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`p-4 rounded-2xl bg-white/3 border flex flex-col items-center gap-4 transition-all cursor-pointer hover:bg-white/5 group ${
                      isActive ? "border-primary shadow-[0_8px_24px_rgba(0,0,0,0.15)]" : "border-white/5"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full ${opt.class} flex items-center justify-center text-primary-foreground border border-white/10 group-hover:scale-105 transition-transform`}>
                      {isActive && <Check className="w-6 h-6 stroke-[3px]" />}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-white leading-none">{opt.name}</p>
                      <span className="text-[10px] text-slate-500 font-bold block mt-1 lowercase">{opt.color}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: Add / Edit Product */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121418] border border-white/5 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {editingProduct ? `Edit ${editingProduct.name}` : "Create New Product Catalog Entry"}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Canvas Duffel Pro"
                      className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Category Classification</label>
                    <select
                      value={productForm.categorySlug}
                      onChange={(e) => setProductForm({ ...productForm, categorySlug: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50 cursor-pointer font-bold"
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Price (BDT)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. 1850"
                      className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Compare at Price (BDT) - Optional</label>
                    <input
                      type="number"
                      value={productForm.compareAtPrice}
                      onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                      placeholder="e.g. 2400"
                      className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Image Asset URL</label>
                  <input
                    type="text"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="e.g. /brand/prod_rider_leg.webp"
                    className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Variant Name</label>
                    <input
                      type="text"
                      value={productForm.variantName}
                      onChange={(e) => setProductForm({ ...productForm, variantName: e.target.value })}
                      placeholder="Stealth Black"
                      className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Variant Color hex</label>
                    <input
                      type="text"
                      value={productForm.variantColor}
                      onChange={(e) => setProductForm({ ...productForm, variantColor: e.target.value })}
                      placeholder="#121212"
                      className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Variant Stock Quantity</label>
                    <input
                      type="number"
                      value={productForm.variantStock}
                      onChange={(e) => setProductForm({ ...productForm, variantStock: e.target.value })}
                      placeholder="50"
                      className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Short Card Subtitle</label>
                  <input
                    type="text"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    placeholder="e.g. Spacious active workout travel pack"
                    className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Brand Story (Long Details)</label>
                  <textarea
                    rows={2}
                    value={productForm.story}
                    onChange={(e) => setProductForm({ ...productForm, story: e.target.value })}
                    placeholder="Provide details about the utility design..."
                    className="w-full p-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Specs (One per line)</label>
                    <textarea
                      rows={3}
                      value={productForm.specs}
                      onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                      placeholder="Water-resistant shell&#10;Dimensions: 45 x 30 x 20 cm&#10;Volume: 35L"
                      className="w-full p-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Benefits (One per line)</label>
                    <textarea
                      rows={3}
                      value={productForm.benefits}
                      onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
                      placeholder="Dedicated dirty shoe bunker&#10;Smart water container hold&#10;Easy quick grab side pouch"
                      className="w-full p-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isBestSeller"
                      checked={productForm.isBestSeller}
                      onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                      className="w-4 h-4 accent-primary rounded border border-white/10"
                    />
                    <label htmlFor="isBestSeller" className="font-bold text-slate-300 cursor-pointer">
                      Flag as Best Seller
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Promo Badge Text (e.g. -20%)</label>
                    <input
                      type="text"
                      value={productForm.badge}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      placeholder="Sale"
                      className="w-full h-8 px-3 rounded-lg border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="h-10 px-4 rounded-xl border border-white/5 hover:bg-white/5 text-slate-300 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-black transition-all cursor-pointer"
                  >
                    {editingProduct ? "Save Changes" : "Insert to Catalog"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Add / Edit Category */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121418] border border-white/5 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {editingCategory ? `Edit ${editingCategory.name}` : "Create Category Mapping"}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-5 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Category Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Travel Duffels"
                    className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Custom Category Slug (lowercase, hyphens) - Optional</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="e.g. travel-duffels"
                    className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50 lowercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Category Cover Image URL</label>
                  <input
                    type="text"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="e.g. /brand/hero_mint_model.webp"
                    className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Short Description</label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Describe what lifestyle of carry matches this category..."
                    className="w-full p-3 rounded-xl border border-white/5 bg-[#171A20] text-white focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="h-10 px-4 rounded-xl border border-white/5 hover:bg-white/5 text-slate-300 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-black transition-all cursor-pointer"
                  >
                    {editingCategory ? "Save Changes" : "Create Mapping"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
