import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import type { CartItem } from "@/lib/types";

type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  updateVariant: (productId: string, oldVariantId: string, newVariant: any) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "canvasbag-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const itemCount = itemCountFromItems(items);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored) as CartItem[]);
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn("Cart local storage write failed:", e);
      }
    }
  }, [hydrated, items]);

  const addItem = useCallback((item: AddCartItemInput) => {
    const quantity = item.quantity ?? 1;

    setItems((current) => {
      const existing = current.find(
        (entry) => entry.productId === item.productId && entry.variantId === item.variantId
      );

      if (existing) {
        return current.map((entry) =>
          entry.productId === item.productId && entry.variantId === item.variantId
            ? { ...entry, quantity: Math.min(entry.quantity + quantity, 10) }
            : entry
        );
      }

      return [...current, { ...item, quantity }];
    });
    trackEvent("add_to_cart", {
      value: item.price * quantity,
      items: [
        {
          item_id: item.productId,
          item_name: item.name,
          item_brand: "CanvasBag",
          item_variant: item.variantName || "Standard",
          price: item.price,
          quantity: quantity,
        }
      ]
    });

    toast.success("Added to cart", {
      description: `${item.name} in ${item.variantName}`,
    });
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: Math.min(Math.max(quantity, 1), 10) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const updateVariant = useCallback((productId: string, oldVariantId: string, newVariant: any) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.variantId === oldVariantId
          ? {
              ...item,
              variantId: newVariant.id,
              variantName: newVariant.name,
              price: newVariant.price,
              image: newVariant.image,
            }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((productId: string, variantId: string) => {
    let itemToRemove: any = null;
    setItems((current) => {
      const item = current.find((i) => i.productId === productId && i.variantId === variantId);
      if (item) {
        itemToRemove = item;
      }
      return current.filter((item) => item.productId !== productId || item.variantId !== variantId);
    });

    if (itemToRemove) {
      trackEvent("remove_from_cart", {
        value: itemToRemove.price * itemToRemove.quantity,
        items: [
          {
            item_id: itemToRemove.productId,
            item_name: itemToRemove.name,
            item_brand: "CanvasBag",
            item_variant: itemToRemove.variantName || "Standard",
            price: itemToRemove.price,
            quantity: itemToRemove.quantity,
          }
        ]
      });
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addItem,
      updateQuantity,
      updateVariant,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, itemCount, items, removeItem, updateQuantity, updateVariant]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function itemCountFromItems(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
