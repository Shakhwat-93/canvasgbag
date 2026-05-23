"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { calculateCartTotals, formatCurrency } from "@/lib/format";

export function CartView() {
  const { items, updateQuantity, removeItem } = useCart();
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
            <Link href="/">Shop best sellers</Link>
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
          {items.map((item) => (
            <article key={`${item.productId}-${item.variantId}`} className="grid grid-cols-[96px_1fr] gap-4 rounded-lg border p-3 sm:p-4">
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="grid gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.variantName}</p>
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
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border bg-card p-4 sm:p-5">
        <h2 className="font-semibold">Order summary</h2>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>{totals.deliveryFee === 0 ? "Free" : formatCurrency(totals.deliveryFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>-{formatCurrency(totals.discount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
        <Button asChild size="lg" className="mt-6 h-12 w-full">
          <Link href="/checkout">Checkout with COD</Link>
        </Button>
      </aside>
    </div>
  );
}
