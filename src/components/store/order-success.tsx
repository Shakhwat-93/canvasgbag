"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { useStore } from "@/components/providers/store-provider";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";

export function OrderSuccess({ orderId, total }: { orderId: string; total: number }) {
  const { clearCart } = useCart();
  const { addOrder } = useStore();

  useEffect(() => {
    trackEvent("purchase", {
      order_id: orderId,
      value: total,
    });

    const pendingOrderStr = localStorage.getItem("cb_pending_order");
    if (pendingOrderStr) {
      try {
        const pendingOrder = JSON.parse(pendingOrderStr);
        addOrder({
          id: orderId,
          customerName: pendingOrder.name,
          phone: pendingOrder.phone,
          status: "pending",
          paymentMethod: "cod",
          subtotal: pendingOrder.subtotal,
          deliveryFee: pendingOrder.deliveryFee,
          discount: pendingOrder.discount,
          total: total || pendingOrder.total,
          items: pendingOrder.items,
          createdAt: new Date().toISOString(),
        });
        localStorage.removeItem("cb_pending_order");
      } catch (e) {
        console.error("Failed to parse pending order", e);
      }
    } else {
      // Avoid empty/fallback order if we just refresh page
      addOrder({
        id: orderId,
        customerName: "Web Customer",
        phone: "017XXXXXXXX",
        status: "pending",
        paymentMethod: "cod",
        subtotal: total > 120 ? total - 120 : total,
        deliveryFee: total > 120 ? 120 : 0,
        discount: 0,
        total: total,
        items: [],
        createdAt: new Date().toISOString(),
      });
    }

    clearCart();
  }, [clearCart, orderId, total, addOrder]);

  return (
    <main className="mx-auto grid min-h-[65vh] max-w-2xl place-items-center px-4 py-16 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-medium uppercase text-muted-foreground">Order received</p>
        <h1 className="mt-2 text-4xl font-semibold">We will call to confirm.</h1>
        <p className="mt-4 text-muted-foreground">
          Your COD order <span className="font-medium text-foreground">{orderId}</span> has been created.
          Estimated payable total is <span className="font-medium text-foreground">{formatCurrency(total)}</span>.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Continue shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/category/everyday-totes">Explore totes</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
