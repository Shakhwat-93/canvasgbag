import { Link, useNavigate } from "react-router-dom";
import { Eye, Zap } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const firstInStockVariant = product.variants?.find((v) => v.inStock);
  const isOutOfStock = !firstInStockVariant;

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: firstInStockVariant.image || product.images[0]?.url || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      variantId: firstInStockVariant.id,
      variantName: firstInStockVariant.name,
      quantity: 1,
    });

    navigate("/checkout");
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100">
        <img
          src={product.images[0]?.url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
          alt={product.images[0]?.alt || product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          loading={priority ? "eager" : "lazy"}
        />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm transition-colors duration-300">
            {product.badge}
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute right-2.5 top-2.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md">
            STOCK OUT
          </span>
        )}
      </Link>

      <div className="p-3 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <Link to={`/product/${product.slug}`} className="block text-xs md:text-sm font-semibold text-slate-800 hover:text-primary transition-colors line-clamp-2 min-h-[34px] leading-tight text-left">
            {product.name}
          </Link>
          
          <div className="flex flex-wrap items-baseline gap-2 pt-0.5 justify-start">
            <span className="font-extrabold text-base md:text-lg text-red-600 transition-colors duration-300">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs md:text-sm text-slate-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 pt-1 w-full">
          <Link to={`/product/${product.slug}`} className="block w-full">
            <button className="w-full h-9 rounded-lg bg-[#1E293B] hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm">
              <Eye className="w-3.5 h-3.5" />
              View Product
            </button>
          </Link>

          {isOutOfStock ? (
            <button
              disabled
              className="w-full h-9 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200"
            >
              Stock Out
            </button>
          ) : (
            <button
              onClick={handleOrderNow}
              className="w-full h-9 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Order Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
