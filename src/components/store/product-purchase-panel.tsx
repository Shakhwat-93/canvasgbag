"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  useEffect(() => {
    trackEvent("view_product", {
      product_id: product.id,
      product_name: product.name,
      value: product.price,
    });
  }, [product.id, product.name, product.price]);

  function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }

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

  return (
    <div className="lg:sticky lg:top-24">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge variant="secondary" className="rounded-md">
            {product.badge ?? product.categoryName}
          </Badge>
          <div>
            <h1 className="text-3xl font-semibold leading-tight text-balance sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{product.shortDescription}</p>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-semibold">{formatCurrency(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="pb-1 text-base text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Choose color</p>
          <div className="grid grid-cols-2 gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setVariantId(variant.id)}
                className={`flex min-h-12 items-center justify-between rounded-md border px-3 text-sm transition-all ${
                  variant.id === variantId ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "hover:border-primary/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: variant.color }}
                    aria-hidden="true"
                  />
                  {variant.name}
                </span>
                {variant.id === variantId ? <Check className="h-4 w-4" /> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {product.benefits.slice(0, 4).map((benefit) => (
            <div key={benefit} className="flex gap-3 text-sm leading-6">
              <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <Button size="lg" className="hidden h-12 w-full md:inline-flex" onClick={handleAddToCart}>
          <ShoppingBag className="h-5 w-5" />
          Add to cart
        </Button>

        <div className="grid gap-3 rounded-lg border bg-muted/35 p-4 text-sm">
          <div className="flex items-center gap-3">
            <Truck className="h-4 w-4" />
            <span>COD delivery available across Bangladesh</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4" />
            <span>7-day easy exchange for unused products</span>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-3 md:hidden">
        <Button size="lg" className="h-12 w-full" onClick={handleAddToCart}>
          <ShoppingBag className="h-5 w-5" />
          Add to cart - {formatCurrency(product.price)}
        </Button>
      </div>
    </div>
  );
}
