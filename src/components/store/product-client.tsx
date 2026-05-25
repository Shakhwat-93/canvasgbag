"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Eye, Zap, ShoppingCart, Check, Heart, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { useStore } from "@/components/providers/store-provider";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import { reviews } from "@/lib/data";
import type { Product } from "@/lib/types";

export function ProductClient({
  slug,
  initialProduct,
  initialRelated,
}: {
  slug: string;
  initialProduct: Product;
  initialRelated: Product[];
}) {
  const router = useRouter();
  const { products, categories } = useStore();
  const { addItem } = useCart();

  // Find product dynamically from client store
  const product = products.find((p) => p.slug === slug) || initialProduct;
  if (!product) {
    notFound();
  }

  // Active Image State
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Selected Variant State
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id ?? "");
  const selectedVariant = useMemo(
    () => product.variants?.find((v) => v.id === variantId) ?? product.variants?.[0],
    [product.variants, variantId]
  );

  // Quantity State
  const [qty, setQty] = useState(1);

  // Description tab state
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");

  // Calculate percentage discount
  const discountPercent = useMemo(() => {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }, [product.price, product.compareAtPrice]);

  // Filter related products dynamically
  const related = products
    .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
    .slice(0, 4);
  const displayRelated = related.length > 0 ? related : initialRelated;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      quantity: qty,
    });
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      quantity: qty,
    });
    router.push("/checkout");
  };

  const currentImage = product.images[activeImgIndex] ?? product.images[0];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 pb-16">
      {/* Breadcrumb section */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-xs font-bold text-slate-400 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/category/${product.categorySlug}`} className="hover:text-primary transition-colors">{product.categoryName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 truncate">{product.name}</span>
        </div>
      </div>

      {/* Main product overview */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_0.9fr] gap-8 items-start bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/60 shadow-sm">
          
          {/* Column 1: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center group">
              <Image
                src={currentImage?.url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
                alt={currentImage?.alt || product.name}
                fill
                className="object-cover"
                priority
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md animate-pulse">
                  {discountPercent}% ছাড়
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {product.images.length > 1 && (
              <div className="flex gap-2 items-center overflow-x-auto py-1 no-scrollbar justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-14 h-14 rounded-lg bg-slate-50 border overflow-hidden shrink-0 transition-all cursor-pointer ${
                      activeImgIndex === idx ? "border-primary ring-2 ring-primary/20 scale-[0.98]" : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Product purchasing details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <span>Category:</span>
                <Link href={`/category/${product.categorySlug}`} className="text-primary hover:underline lowercase font-extrabold">
                  {product.categoryName}
                </Link>
              </div>

              {/* Pricing row with discount pill */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatCurrency(product.price)}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">🔸 প্রোডাক্টের বৈশিষ্ট্য:</p>
              <div className="space-y-2">
                {product.benefits.slice(0, 3).map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2.5 text-xs font-bold text-slate-600">
                    <span className="w-4.5 h-4.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const target = document.getElementById("details-tabs");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs font-black text-primary hover:underline cursor-pointer"
              >
                বিস্তারিত
              </button>
            </div>

            {/* Variants Color Panel */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Choose Color</p>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = variantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariantId(v.id)}
                        className={`flex min-h-11 items-center justify-between rounded-xl border px-3 text-xs font-bold transition-all cursor-pointer ${
                          isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className="h-3 w-3 rounded-full border border-white shadow-sm shrink-0"
                            style={{ backgroundColor: v.color }}
                          />
                          <span className="truncate">{v.name}</span>
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty & Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Qty selector */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-11 bg-slate-50 w-28 shrink-0 justify-between">
                <button
                  onClick={() => setQty((q) => Math.max(q - 1, 1))}
                  className="w-9 h-full hover:bg-slate-100 font-extrabold text-sm transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="font-extrabold text-xs text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(q + 1, 10))}
                  className="w-9 h-full hover:bg-slate-100 font-extrabold text-sm transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-11 bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                ADD TO CART
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 h-11 bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Zap className="w-4 h-4 fill-current" />
                BUY NOW
              </button>
            </div>

            {/* WhatsApp Contact button */}
            <div className="pt-1">
              <a
                href={`https://wa.me/8801841650668?text=Hello,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-[#075E54] hover:bg-[#128C7E] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-current" />
                +8801841650668
              </a>
            </div>
          </div>

          {/* Column 3: Trust Panel / Delivery details */}
          <div className="space-y-4">
            {/* Visual play/details placeholder matching mockup right panel */}
            <div className="relative aspect-video rounded-xl bg-slate-900 border border-white/5 overflow-hidden flex flex-col items-center justify-center shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center text-center p-3">
                <span className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 text-primary flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer">
                  <Zap className="w-4.5 h-4.5 fill-current" />
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2.5">Original Quality</span>
                <p className="text-[9px] text-slate-400 mt-1">100% genuine canvas travel & workout carrier bags</p>
              </div>
            </div>

            {/* Dashed Trust info box */}
            <div className="border-2 border-dashed border-slate-200/80 bg-slate-50/50 p-5 rounded-2xl space-y-4 text-xs font-semibold text-slate-600 leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
              <div className="space-y-1">
                <p className="text-slate-800 font-extrabold flex items-center gap-1.5">
                  🛵 ডেলিভারি চার্জ:
                </p>
                <p className="text-[11px] pl-5">ঢাকার মধ্যে ৭০ টাকা, ঢাকার বাইরে ১২০ টাকা!</p>
              </div>

              <div className="space-y-1">
                <p className="text-slate-800 font-extrabold flex items-center gap-1.5">
                  💵 সম্পূর্ণ ক্যাশ অন ডেলিভারি:
                </p>
                <p className="text-[11px] pl-5">অর্ডার করতে অগ্রিম ১ টাকাও দিতে হবেনা, পণ্য রিসিভ করার সময় টাকা পরিশোধ করবেন!</p>
              </div>

              <div className="space-y-1">
                <p className="text-slate-800 font-extrabold flex items-center gap-1.5">
                  🔎 প্রোডাক্ট চেক করে নেওয়ার সুযোগ:
                </p>
                <p className="text-[11px] pl-5">ডেলিভারি ম্যানের সামনে পণ্য ভালোভাবে দেখে তারপর রিসিভ করতে পারবেন।</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Description tabs block */}
      <div id="details-tabs" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "description" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "specs" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Specifications
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {activeTab === "description" ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-800">
                    {product.name} - এর ব্যবহার ও কার্যকারিতা
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-semibold">
                    {product.story}
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <span>🔸</span> প্রোডাক্টের বৈশিষ্ট্য:
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {product.benefits && product.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2.5 text-xs font-bold text-slate-600">
                        <span className="w-4.5 h-4.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                        </span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-800">প্রোডাক্টের টেকনিক্যাল স্পেসিফিকেশন</h3>
                  <p className="text-xs text-slate-500 font-semibold">ভ্রমণ ও দৈনন্দিন ব্যবহারের জন্য সঠিক ও নিখুঁত পরিমাপসমূহ</p>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 max-w-xl text-xs">
                  {product.specs && product.specs.map((spec, index) => (
                    <div key={index} className="grid grid-cols-[120px_1fr] gap-4 p-3.5 hover:bg-slate-50 transition-colors">
                      <span className="font-extrabold text-slate-400 uppercase tracking-wider">Spec {index + 1}</span>
                      <span className="font-bold text-slate-700">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products slider list */}
      {displayRelated.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-sm transition-colors duration-300" />
              <h2 className="text-lg md:text-xl font-black text-slate-900">সর্বাধিক জনপ্রিয় পণ্য</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
              View All
            </Link>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {displayRelated.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
