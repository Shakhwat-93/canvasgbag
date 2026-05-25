"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Zap, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency } from "@/lib/format";
import type { Product, Category } from "@/lib/types";

// Mock subcategories tags based on canvas bag features
const SUB_CATEGORIES = [
  { id: "gym-sports", name: "Gym & Sports", keyword: "gym" },
  { id: "laptop-business", name: "Laptop & Business", keyword: "laptop" },
  { id: "travel-weekender", name: "Travel & Weekender", keyword: "travel" },
  { id: "everyday-carry", name: "Everyday Carry", keyword: "everyday" },
];

export function ShopLayoutClient({
  initialCategorySlug = null,
}: {
  initialCategorySlug?: string | null;
}) {
  const router = useRouter();
  const { products, categories } = useStore();

  // Active filters state
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(initialCategorySlug);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  
  // Price range state
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(maxProductPrice);
  const [priceSlider, setPriceSlider] = useState<number>(maxProductPrice);

  // Sorting state
  const [sortBy, setSortBy] = useState<string>("latest");

  // Mobile filters drawer open state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update selection if prop changes (e.g. user navigates between categories)
  useEffect(() => {
    setSelectedCategorySlug(initialCategorySlug);
  }, [initialCategorySlug]);

  // Sync price slider with price inputs
  useEffect(() => {
    setPriceSlider(maxPrice);
  }, [maxPrice]);

  // Calculate dynamic counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.slug] = products.filter((p) => p.categorySlug === cat.slug).length;
    });
    return counts;
  }, [categories, products]);

  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SUB_CATEGORIES.forEach((sub) => {
      counts[sub.id] = products.filter((p) => 
        p.name.toLowerCase().includes(sub.keyword) || 
        p.shortDescription.toLowerCase().includes(sub.keyword) ||
        p.story.toLowerCase().includes(sub.keyword)
      ).length;
    });
    return counts;
  }, [products]);

  // Filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategorySlug) {
      result = result.filter((p) => p.categorySlug === selectedCategorySlug);
    }

    // Filter by Subcategory keyword
    if (selectedSubCategory) {
      const sub = SUB_CATEGORIES.find((s) => s.id === selectedSubCategory);
      if (sub) {
        result = result.filter((p) => 
          p.name.toLowerCase().includes(sub.keyword) || 
          p.shortDescription.toLowerCase().includes(sub.keyword) ||
          p.story.toLowerCase().includes(sub.keyword)
        );
      }
    }

    // Filter by Price range
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Apply Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Latest (default) - assuming newer products have higher IDs or are first
    }

    return result;
  }, [products, selectedCategorySlug, selectedSubCategory, minPrice, maxPrice, sortBy]);

  const currentCategoryName = useMemo(() => {
    if (!selectedCategorySlug) return "আমাদের সকল পণ্য";
    return categories.find((c) => c.slug === selectedCategorySlug)?.name || "Category Products";
  }, [selectedCategorySlug, categories]);

  // Handler for category filter toggle
  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategorySlug(slug);
    if (slug) {
      router.push(`/category/${slug}`);
    } else {
      router.push("/shop");
    }
    setMobileFiltersOpen(false);
  };

  const handleSubCategorySelect = (subId: string | null) => {
    setSelectedSubCategory(selectedSubCategory === subId ? null : subId);
    setMobileFiltersOpen(false);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Category Tabs (Mobile only header) */}
      <div className="md:hidden mb-6 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Catalog Filters</span>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="px-3.5 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors duration-300"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* SIDEBAR FILTER (Desktop style) */}
        <aside className={`lg:block ${mobileFiltersOpen ? "block" : "hidden"} space-y-7 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm shrink-0`}>
          {/* PRICE RANGE FILTER */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-1">
              <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest border-b-2 border-primary pb-1.5 w-fit transition-colors duration-300">
                Price Range
              </h3>
            </div>
            
            {/* Slider */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={priceSlider}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceSlider(val);
                  setMaxPrice(val);
                }}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary transition-colors duration-300"
              />
            </div>

            {/* Inputs min & max */}
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full h-9 rounded-lg border border-slate-200 text-center font-bold text-slate-700 focus:outline-none focus:border-primary transition-colors duration-300"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-9 rounded-lg border border-slate-200 text-center font-bold text-slate-700 focus:outline-none focus:border-primary transition-colors duration-300"
              />
            </div>
          </div>

          {/* CATEGORIES FILTER */}
          <div className="space-y-3.5">
            <div className="border-b border-slate-100 pb-1">
              <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest border-b-2 border-primary pb-1.5 w-fit transition-colors duration-300">
                Categories
              </h3>
            </div>

            <div className="space-y-1">
              {/* All Categories Item */}
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full flex items-center justify-between text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg cursor-pointer ${
                  selectedCategorySlug === null
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedCategorySlug === null ? "bg-white border-white text-primary" : "border-slate-300"
                  }`}>
                    {selectedCategorySlug === null && <Check className="w-3 h-3 stroke-[3px]" />}
                  </span>
                  All Categories
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  selectedCategorySlug === null ? "bg-black/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {products.length}
                </span>
              </button>

              {/* Loop Categories */}
              {categories.map((cat) => {
                const isActive = selectedCategorySlug === cat.slug;
                const count = categoryCounts[cat.slug] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full flex items-center justify-between text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "bg-white border-white text-primary" : "border-slate-300"
                      }`}>
                        {isActive && <Check className="w-3 h-3 stroke-[3px]" />}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className={`text-[10px] font-black shrink-0 px-2 py-0.5 rounded-full ${
                      isActive ? "bg-black/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUB CATEGORIES FILTER */}
          <div className="space-y-3.5">
            <div className="border-b border-slate-100 pb-1">
              <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest border-b-2 border-primary pb-1.5 w-fit transition-colors duration-300">
                Sub Categories
              </h3>
            </div>

            <div className="space-y-1">
              {/* All Sub Categories Item */}
              <button
                onClick={() => handleSubCategorySelect(null)}
                className={`w-full flex items-center justify-between text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg cursor-pointer ${
                  selectedSubCategory === null
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedSubCategory === null ? "bg-white border-white text-primary" : "border-slate-300"
                  }`}>
                    {selectedSubCategory === null && <Check className="w-3 h-3 stroke-[3px]" />}
                  </span>
                  All Sub Categories
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  selectedSubCategory === null ? "bg-black/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {products.length}
                </span>
              </button>

              {/* Loop Sub Categories */}
              {SUB_CATEGORIES.map((sub) => {
                const isActive = selectedSubCategory === sub.id;
                const count = subCategoryCounts[sub.id] || 0;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubCategorySelect(sub.id)}
                    className={`w-full flex items-center justify-between text-xs font-bold transition-all px-2.5 py-1.5 rounded-lg cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "bg-white border-white text-primary" : "border-slate-300"
                      }`}>
                        {isActive && <Check className="w-3 h-3 stroke-[3px]" />}
                      </span>
                      <span className="truncate">{sub.name}</span>
                    </span>
                    <span className={`text-[10px] font-black shrink-0 px-2 py-0.5 rounded-full ${
                      isActive ? "bg-black/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PRODUCTS LIST GRID */}
        <div className="space-y-6">
          {/* Header block with count & sorting */}
          <div className="flex items-center justify-between bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm text-xs md:text-sm">
            <span className="font-bold text-slate-700">
              {filteredAndSortedProducts.length} Products Found
            </span>

            {/* Sorting dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold hidden md:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:border-primary cursor-pointer transition-colors duration-300"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Heading with left vertical indicator line */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <span className="w-1.5 h-6 bg-primary rounded-sm transition-colors duration-300" />
            <h2 className="text-lg md:text-xl font-black text-slate-900">
              {currentCategoryName} {selectedSubCategory && ` - ${SUB_CATEGORIES.find(s => s.id === selectedSubCategory)?.name}`}
            </h2>
          </div>

          {/* Product Cards Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-16 text-center space-y-3">
              <p className="text-sm text-slate-400 font-bold">No products match your active filter range.</p>
              <button
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(maxProductPrice);
                  setPriceSlider(maxProductPrice);
                  setSelectedCategorySlug(null);
                  setSelectedSubCategory(null);
                }}
                className="text-xs font-black text-primary hover:underline cursor-pointer transition-colors duration-300"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 2} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
