"use server";

import { redirect } from "next/navigation";
import { createCodOrder } from "@/lib/checkout";
import type { CartItem } from "@/lib/types";

export type CheckoutActionState = {
  error?: string;
};

export async function createOrderAction(
  _state: CheckoutActionState,
  formData: FormData
): Promise<CheckoutActionState> {
  let orderId: string | null = null;
  let total = 0;

  try {
    const items = JSON.parse(String(formData.get("items") ?? "[]")) as CartItem[];
    const order = await createCodOrder({
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      city: String(formData.get("city") ?? ""),
      area: String(formData.get("area") ?? ""),
      address: String(formData.get("address") ?? ""),
      note: String(formData.get("note") ?? ""),
      items,
    });

    orderId = order.id;
    total = order.total;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not place your order.",
    };
  }

  redirect(`/order/success/${orderId}?total=${total}`);
}
