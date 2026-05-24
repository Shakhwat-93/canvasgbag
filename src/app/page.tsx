import type { Metadata } from "next";
import { HomeClient } from "@/components/store/home-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CanvasBag | Premium Canvas Bags in Bangladesh",
  description: "Premium canvas gym, travel, and daily carry bags for Bangladesh with cash-on-delivery checkout and fast dispatch.",
};

export default function Home() {
  return <HomeClient />;
}
