"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Zap } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the first variant of the product (or fallback)
    const firstVariant = product.variants?.[0] || { id: "std-var", name: "Standard", color: "#121212" };
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      variantId: firstVariant.id,
      variantName: firstVariant.name,
      quantity: 1,
    });

    // Direct checkout
    router.push("/checkout");
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100">
        <Image
          src={product.images[0]?.url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
          alt={product.images[0]?.alt || product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
          priority={priority}
        />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-3 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`} className="block text-xs md:text-sm font-bold text-slate-800 hover:text-rose-600 transition-colors line-clamp-2 min-h-[34px] leading-tight text-left">
            {product.name}
          </Link>
          
          <div className="flex flex-wrap items-baseline gap-2 pt-0.5 justify-start">
            <span className="font-extrabold text-sm md:text-base text-rose-600">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] md:text-xs text-slate-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Stacked */}
        <div className="space-y-1.5 pt-1 w-full">
          <Link href={`/product/${product.slug}`} className="block w-full">
            <button className="w-full h-9 rounded-lg bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm">
              <Eye className="w-3.5 h-3.5" />
              View Product
            </button>
          </Link>

          <button
            onClick={handleOrderNow}
            className="w-full h-9 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Order Now
          </button>
        </div>
      </div>
    </article>
  );
}
