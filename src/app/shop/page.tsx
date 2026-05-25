import type { Metadata } from "next";
import { ShopLayoutClient } from "@/components/store/shop-layout-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop All Canvas Bags | CanvasBag",
  description: "Browse our entire premium catalog of canvas travel, gym, laptop, and everyday carry bags in Bangladesh.",
};

export default function ShopPage() {
  return <ShopLayoutClient initialCategorySlug={null} />;
}
