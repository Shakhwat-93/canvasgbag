import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <>
      {/* Desktop Version */}
      <article className="hidden md:flex flex-col group overflow-hidden rounded-3xl border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority={priority}
            />
            {product.badge ? (
              <span className="lime-pill absolute left-3 top-3 shadow-sm">
                {product.badge}
              </span>
            ) : null}
          </div>
        </Link>
        <div className="grid gap-4 p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{product.categoryName}</p>
              <span className="flex items-center gap-1 text-xs font-semibold" style={{color: 'oklch(0.55 0.12 130)'}}>
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {product.rating}
              </span>
            </div>
            <Link href={`/product/${product.slug}`} className="block text-base font-bold leading-6 hover:underline">
              {product.name}
            </Link>
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
              {product.compareAtPrice ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              ) : null}
            </div>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:opacity-90 rounded-full h-9 w-9 p-0 shadow-md">
              <Link href={`/product/${product.slug}`}>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Mobile App-Style Version */}
      <article className="md:hidden relative flex flex-col items-center justify-between rounded-[2rem] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-slate-100/50 transition-all duration-300 active:scale-[0.98]">
        {/* Top: Price & Wishlist */}
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-black text-slate-900">
            {formatCurrency(product.price)}
          </span>
          <button className="text-rose-500/80 hover:text-rose-500 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/product/${product.slug}`} className="w-full flex justify-center py-4">
          <div className="relative w-24 h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-transform duration-300">
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              className="object-contain"
              sizes="96px"
              priority={priority}
            />
          </div>
        </Link>

        {/* Title */}
        <div className="text-center w-full mt-1">
          <Link href={`/product/${product.slug}`} className="block text-[11px] font-extrabold text-slate-800 leading-tight line-clamp-2 hover:underline">
            {product.name}
          </Link>
        </div>
      </article>
    </>
  );
}
