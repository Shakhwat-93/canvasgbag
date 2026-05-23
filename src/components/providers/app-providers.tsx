"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/providers/cart-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <CartProvider>{children}</CartProvider>
      <Toaster richColors position="top-center" />
    </TooltipProvider>
  );
}
