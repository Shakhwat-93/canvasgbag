import type { Metadata } from "next";
import { CartView } from "@/components/store/cart-view";

export const metadata: Metadata = {
  title: "Cart | CanvasBag",
  description: "Review your CanvasBag cart before COD checkout.",
};

export default function CartPage() {
  return <CartView />;
}
