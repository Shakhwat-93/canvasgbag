import React from "react";
import { CartProvider } from "@/components/providers/cart-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <CartProvider>
        {children}
        <Toaster richColors position="bottom-right" />
      </CartProvider>
    </StoreProvider>
  );
}
