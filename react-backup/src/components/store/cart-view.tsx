import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { useStore } from "@/components/providers/store-provider";
import { calculateCartTotals, formatCurrency } from "@/lib/format";

interface ColorDropdownProps {
  variants: { id: string; name: string; colorCode?: string; inStock: boolean }[];
  selectedVariantId: string;
  onChange: (variant: any) => void;
}

function ColorDropdown({ variants, selectedVariantId, onChange }: ColorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  return (
    <div className="relative inline-block text-left z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 hover:border-slate-350 hover:bg-slate-50 transition-all select-none focus:outline-none"
      >
        {currentVariant.colorCode && (
          <span
            className="h-3 w-3 rounded-full border border-slate-200 shrink-0 shadow-sm"
            style={{ backgroundColor: currentVariant.colorCode }}
          />
        )}
        <span>{currentVariant.name}</span>
        <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 rounded-xl border border-slate-150 bg-white p-1.5 shadow-xl z-40 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="space-y-1">
            {variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.inStock}
                  onClick={() => {
                    onChange(v);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-bold text-left transition-all ${
                    isSelected
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50"
                  } ${!v.inStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {v.colorCode && (
                      <span
                        className="h-3 w-3 rounded-full border border-slate-200 shrink-0 shadow-sm"
                        style={{ backgroundColor: v.colorCode }}
                      />
                    )}
                    <span className="truncate">{v.name}</span>
                    {!v.inStock && (
                      <span className="text-[9px] font-bold text-red-500 bg-red-50 border border-red-100/50 px-1 rounded uppercase tracking-wider scale-90">
                        স্টক আউট
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CartView() {
  const { items, updateQuantity, removeItem, updateVariant } = useCart();
  const { products } = useStore();
  const totals = calculateCartTotals(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto grid min-h-[55vh] max-w-xl place-items-center px-4 py-20 text-center">
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">Your cart is quiet</p>
          <h1 className="mt-3 text-3xl font-semibold">Find a canvas bag worth carrying.</h1>
          <p className="mt-3 text-muted-foreground">
            Explore best sellers and add your preferred color before checkout.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Shop best sellers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-3.5 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[1fr_360px] lg:px-8">
      <section>
        <h1 className="text-3xl font-semibold">Cart</h1>
        <div className="mt-6 grid gap-4">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            const variants = product?.variants || [];
            return (
              <article key={`${item.productId}-${item.variantId}`} className="grid grid-cols-[96px_1fr] gap-4 rounded-lg border p-3 sm:p-4">
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      {variants.length > 1 ? (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-semibold">Color:</span>
                          <ColorDropdown
                            variants={variants}
                            selectedVariantId={item.variantId}
                            onChange={(newVar) => {
                              updateVariant(item.productId, item.variantId, newVar);
                            }}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.variantName}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 md:h-8 md:w-8 text-muted-foreground hover:text-destructive shrink-0"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 items-center rounded-md border bg-background overflow-hidden">
                      <Button
                        variant="ghost"
                        className="h-full w-10 rounded-none px-0"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        className="h-full w-10 rounded-none px-0"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="h-fit rounded-lg border bg-card p-4 sm:p-5">
        <h2 className="font-semibold">Order summary</h2>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-slate-800">{formatCurrency(totals.subtotal)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="font-bold text-slate-900">{formatCurrency(totals.subtotal)}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-normal">
            * Delivery charge and discounts will be calculated at checkout.
          </p>
        </div>
        <Button asChild size="lg" className="mt-6 h-12 w-full">
          <Link to="/checkout">Checkout with COD</Link>
        </Button>
      </aside>
    </div>
  );
}
