"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { AlertCircle, LockKeyhole, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { createOrderAction } from "@/lib/actions";
import { trackEvent } from "@/lib/analytics";
import { calculateCartTotals, formatCurrency } from "@/lib/format";

export function CheckoutForm() {
  const { items } = useCart();
  const totals = calculateCartTotals(items);
  const [state, action] = useActionState(createOrderAction, {});

  useEffect(() => {
    if (items.length > 0) {
      trackEvent("begin_checkout", {
        value: totals.total,
        items: items.map((item) => ({
          id: item.productId,
          name: item.name,
          variant: item.variantName,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    }
  }, [items, totals.total]);

  if (items.length === 0) {
    return (
      <div className="mx-auto grid min-h-[55vh] max-w-xl place-items-center px-4 py-20 text-center">
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold">Your cart is empty.</h1>
          <p className="mt-3 text-muted-foreground">Add a product before placing a COD order.</p>
          <Button asChild className="mt-6">
            <Link href="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-3.5 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[1fr_380px] lg:px-8">
      <form action={action} className="rounded-lg border bg-card p-4 sm:p-6">
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">Cash on delivery</p>
          <h1 className="mt-2 text-3xl font-semibold">Complete your order</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We will call to confirm before dispatch. No online payment needed.
          </p>
        </div>

        {state.error ? (
          <div className="mt-5 flex gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        ) : null}

        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" autoComplete="name" required placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" autoComplete="tel" required placeholder="01XXXXXXXXX" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required placeholder="Dhaka" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="area">Area</Label>
            <Input id="area" name="area" required placeholder="Banani, Mirpur, Dhanmondi" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="address">Full delivery address</Label>
            <Textarea id="address" name="address" required placeholder="House, road, block, nearby landmark" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="note">Delivery note</Label>
            <Textarea id="note" name="note" placeholder="Preferred delivery time or color note" />
          </div>
        </div>

        <SubmitButton />
      </form>

      <aside className="h-fit rounded-lg border bg-muted/30 p-4 sm:p-5">
        <h2 className="font-semibold">Order summary</h2>
        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="flex justify-between gap-4 text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">
                  {item.variantName} x {item.quantity}
                </p>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <Separator />
          <div className="grid gap-2 text-sm">
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
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
          <div className="grid gap-2 rounded-md border bg-background p-3 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>COD confirmation call before dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-4 w-4" />
              <span>Your data is used only for order delivery</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="mt-6 h-12 w-full" disabled={pending}>
      {pending ? "Placing order..." : "Place COD order"}
    </Button>
  );
}
