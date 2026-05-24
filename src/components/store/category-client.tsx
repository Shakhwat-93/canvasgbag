"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/product-card";
import { useStore } from "@/components/providers/store-provider";
import type { Category, Product } from "@/lib/types";

export function CategoryClient({
  slug,
  initialCategory,
  initialProducts,
}: {
  slug: string;
  initialCategory: Category;
  initialProducts: Product[];
}) {
  const { categories, products } = useStore();

  // Find category dynamically
  const category = categories.find((c) => c.slug === slug) || initialCategory;
  if (!category) {
    notFound();
  }

  // Filter products dynamically
  const filteredProducts = products.filter((p) => p.categorySlug === slug);
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : initialProducts;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile Wrapper with soft blue app background */}
      <div className="-mx-4 -mt-8 px-4 py-8 md:p-0 md:m-0 bg-[#F3F8FA] md:bg-transparent min-h-[calc(100vh-110px)] md:min-h-0">
        
        {/* Search Bar (Mobile only) */}
        <div className="md:hidden flex items-center justify-between bg-white rounded-full px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/50 mb-6">
          <input
            type="text"
            placeholder="Find Bags"
            className="bg-transparent border-none outline-none text-xs font-semibold text-slate-700 placeholder-slate-400 w-full"
          />
          <button className="bg-primary text-primary-foreground p-2 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3 h-3">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>

        {/* Heading & Category Tabs (Mobile only) */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <div className="flex gap-5 overflow-x-auto py-3 no-scrollbar shrink-0">
            {categories.map((cat) => {
              const isCurrent = cat.slug === slug;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`text-xs font-extrabold tracking-wide whitespace-nowrap transition-colors pb-1 ${
                    isCurrent 
                      ? "text-slate-900 border-b-2 border-primary" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Header */}
        <section className="hidden md:block max-w-3xl mb-8">
          <p className="text-sm font-medium uppercase text-muted-foreground">Collection</p>
          <h1 className="mt-2 text-4xl font-semibold">{category.name}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{category.description}</p>
        </section>

        {/* Products Grid */}
        <section className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </section>

      </div>
    </main>
  );
}
