"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function MobileProductView({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  // Sync selected variant with the image carousel index
  const [imgIndex, setImgIndex] = useState(0);
  const variantIndex = product.variants.findIndex((v) => v.id === variantId);
  useMemo(() => {
    if (variantIndex !== -1 && variantIndex < product.images.length) {
      setImgIndex(variantIndex);
    }
  }, [variantId, variantIndex, product.images.length]);

  const currentImage = product.images[imgIndex] ?? product.images[0];

  function handlePrevImage() {
    setImgIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  }

  function handleNextImage() {
    setImgIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  }

  function handleAddToCart() {
    if (!selectedVariant) return;

    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      });
    }
  }

  return (
    <div className="md:hidden min-h-screen bg-[#F3F8FA] pb-24 text-slate-800">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 pt-6">
        <Link
          href={`/category/${product.categorySlug}`}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100/60 hover:scale-105 active:scale-95 transition-all text-slate-800"
        >
          <ChevronLeft className="w-5 h-5 stroke-[3]" />
        </Link>
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Product Title Section */}
      <div className="px-6 pt-6 space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          {product.categoryName}
        </span>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm font-semibold text-slate-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-rose-500 border border-slate-100 hover:scale-105 active:scale-95 transition-all">
            <Heart className="w-4 h-4 fill-rose-500 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Floating Product Image Slider */}
      <div className="relative flex items-center justify-between px-4 py-8">
        {product.images.length > 1 ? (
          <button
            onClick={handlePrevImage}
            className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:bg-white transition-all active:scale-90"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : <div className="w-8" />}

        <div className="relative w-56 h-56 drop-shadow-[0_16px_32px_rgba(0,0,0,0.14)] transition-transform duration-500 hover:scale-105">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            className="object-contain"
            priority
            sizes="224px"
          />
        </div>

        {product.images.length > 1 ? (
          <button
            onClick={handleNextImage}
            className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:bg-white transition-all active:scale-90"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : <div className="w-8" />}
      </div>

      {/* White Bottom Drawer Card */}
      <div className="relative z-10 bg-white rounded-t-[3rem] px-6 pt-8 pb-12 shadow-[0_-12px_40px_rgba(0,0,0,0.04)] border-t border-slate-100/50 space-y-6">
        {/* Description Section */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Description</h2>
          <p className="text-sm font-semibold leading-relaxed text-slate-700">
            {product.story}
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="space-y-2">
          {product.benefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-2.5 text-sm font-semibold text-slate-800 leading-relaxed">
              <span className="text-primary font-bold text-base mt-[-1px]">›</span>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Selectors Panel (Capacity, Color, Qty) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Capacity Selector */}
          <div className="flex flex-col items-center justify-center bg-[#F3F8FA] rounded-2xl h-12 px-2.5 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Capacity</span>
            <select className="bg-transparent border-none text-xs font-black text-slate-700 outline-none text-center cursor-pointer w-full">
              <option>Standard</option>
              <option>30 L</option>
            </select>
          </div>

          {/* Color Selector */}
          <div className="flex flex-col items-center justify-center bg-[#F3F8FA] rounded-2xl h-12 px-2.5 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Color</span>
            <div className="flex items-center gap-1.5 justify-center w-full">
              <span
                className="h-3 w-3 rounded-full border border-white shadow-sm shrink-0"
                style={{ backgroundColor: selectedVariant?.color ?? "#1E1E1E" }}
              />
              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-slate-700 outline-none cursor-pointer max-w-[50px] overflow-hidden"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name.replace("Charcoal ", "").replace("Slate ", "").replace("Sporty ", "").replace("Matte ", "").replace("Premium ", "").replace("Deep ", "").replace("Classic ", "").replace("Royal ", "").replace("Burgundy ", "").replace("Warm ", "")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Qty Selector */}
          <div className="flex flex-col items-center justify-center bg-[#F3F8FA] rounded-2xl h-12 px-2.5 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Qty</span>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="bg-transparent border-none text-xs font-black text-slate-700 outline-none text-center cursor-pointer w-full"
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add to Bag Pill Button */}
        <div className="pt-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground hover:opacity-95 active:scale-[0.98] rounded-full py-4.5 px-6 font-extrabold text-sm flex items-center justify-between shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 group"
          >
            <span className="pl-4">Add To Bag</span>
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
