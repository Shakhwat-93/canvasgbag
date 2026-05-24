"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/providers/cart-provider";
import { StoreProvider } from "@/components/providers/store-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <TooltipProvider>
        <CartProvider>{children}</CartProvider>
        <Toaster richColors position="top-center" />
      </TooltipProvider>
    </StoreProvider>
  );
}
