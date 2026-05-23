import "server-only";

import { z } from "zod";
import { calculateCartTotals } from "@/lib/format";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import type { CartItem, CheckoutForm } from "@/lib/types";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladesh mobile number."),
  city: z.string().min(2, "Select or enter your city."),
  area: z.string().min(2, "Enter your delivery area."),
  address: z.string().min(8, "Enter a complete delivery address."),
  note: z.string().max(300).optional(),
});

export const cartPayloadSchema = z
  .array(
    z.object({
      productId: z.string(),
      slug: z.string(),
      name: z.string(),
      image: z.string().min(1),
      price: z.number().positive(),
      compareAtPrice: z.number().positive().optional(),
      variantId: z.string(),
      variantName: z.string(),
      quantity: z.number().int().min(1).max(10),
    })
  )
  .min(1, "Your cart is empty.");

export type CheckoutInput = CheckoutForm & {
  items: CartItem[];
};

export async function createCodOrder(input: CheckoutInput) {
  const form = checkoutSchema.parse(input);
  const items = cartPayloadSchema.parse(input.items);
  const totals = calculateCartTotals(items);

  if (!hasSupabaseConfig()) {
    return {
      id: `demo-${Date.now().toString(36)}`,
      ...totals,
      demoMode: true,
    };
  }

  const supabase = getSupabaseAdmin();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: form.name,
      phone: form.phone,
      city: form.city,
      area: form.area,
      address: form.address,
      note: form.note ?? null,
      status: "pending",
      payment_method: "cod",
      subtotal: totals.subtotal,
      delivery_fee: totals.deliveryFee,
      discount: totals.discount,
      total: totals.total,
      attribution: {},
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Could not create order.");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: item.name,
      variant_name: item.variantName,
      unit_price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    }))
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return {
    id: order.id as string,
    ...totals,
    demoMode: false,
  };
}
