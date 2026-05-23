import type { Metadata } from "next";
import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | CanvasBag",
  description: "Complete your CanvasBag cash-on-delivery order.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
