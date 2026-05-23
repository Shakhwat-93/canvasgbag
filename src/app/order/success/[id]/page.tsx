import type { Metadata } from "next";
import { OrderSuccess } from "@/components/store/order-success";

export const metadata: Metadata = {
  title: "Order Received | CanvasBag",
  description: "Your CanvasBag COD order has been received.",
};

export default async function OrderSuccessPage(props: PageProps<"/order/success/[id]">) {
  const [{ id }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const total = Number(searchParams.total ?? 0);

  return <OrderSuccess orderId={id} total={Number.isFinite(total) ? total : 0} />;
}
