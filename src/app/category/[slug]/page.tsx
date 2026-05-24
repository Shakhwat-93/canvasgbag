import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryClient } from "@/components/store/category-client";
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
  const [category, products] = await Promise.all([getCategoryBySlug(slug), getProductsByCategory(slug)]);

  if (!category) {
    notFound();
  }

  return (
    <CategoryClient
      slug={slug}
      initialCategory={category}
      initialProducts={products}
    />
  );
}
