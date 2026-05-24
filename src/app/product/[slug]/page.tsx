import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductClient } from "@/components/store/product-client";
import { getProductBySlug, getProducts, products } from "@/lib/data";

export const revalidate = 3600;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | CanvasBag`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0].url, width: 1200, height: 1400, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = (await getProducts())
    .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => image.url),
    description: product.shortDescription,
    brand: { "@type": "Brand", name: "CanvasBag" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductClient
        slug={slug}
        initialProduct={product}
        initialRelated={related}
      />
    </>
  );
}
