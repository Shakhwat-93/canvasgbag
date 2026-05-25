import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopLayoutClient } from "@/components/store/shop-layout-client";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";

export const revalidate = 3600;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(props: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return {
    title: `${category.name} | CanvasBag`,
    description: category.description,
  };
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const [category] = await Promise.all([getCategoryBySlug(slug)]);

  if (!category) {
    notFound();
  }

  return (
    <ShopLayoutClient
      initialCategorySlug={slug}
    />
  );
}
