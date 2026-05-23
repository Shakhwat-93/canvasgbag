"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";

export function OrderSuccess({ orderId, total }: { orderId: string; total: number }) {
  const { clearCart } = useCart();

  useEffect(() => {
    trackEvent("purchase", {
      order_id: orderId,
      value: total,
    });
    clearCart();
  }, [clearCart, orderId, total]);

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
