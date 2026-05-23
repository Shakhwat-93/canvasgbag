import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ProductPurchasePanel } from "@/components/store/product-purchase-panel";
import { ProductCard } from "@/components/store/product-card";
import { MobileProductView } from "@/components/store/mobile-product-view";
import { getProductBySlug, getProducts, products, reviews } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

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
    <main className="pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      
      {/* Mobile-App styled Single Product View */}
      <MobileProductView product={product} />

      {/* Desktop-only Single Product View */}
      <div className="hidden md:block">
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            {product.images.map((image, index) => (
              <div key={image.id} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <ProductPurchasePanel product={product} />
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase text-muted-foreground">Benefit-first details</p>
            <h2 className="mt-2 text-3xl font-semibold">Everything earns its place.</h2>
            <p className="mt-3 text-muted-foreground">{product.story}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {product.benefits.map((benefit) => (
              <div key={benefit} className="rounded-lg border p-4">
                <Badge variant="secondary" className="rounded-md">
                  Benefit
                </Badge>
                <p className="mt-3 text-sm leading-6">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/25">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-3xl font-semibold">Reviews that reduce doubt.</h2>
              <p className="mt-3 text-muted-foreground">
                {product.reviewCount} customers rated this {product.rating}/5 for practical carry, material feel,
                and clean styling.
              </p>
            </div>
            <div className="grid gap-3">
              {reviews.slice(0, 2).map((review) => (
                <figure key={review.id} className="rounded-lg border bg-background p-4">
                  <blockquote className="text-sm leading-6">&ldquo;{review.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-sm font-medium">
                    {review.author} · {review.location}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold">Specs and questions</h2>
            <p className="mt-3 text-muted-foreground">
              Transparent details before checkout. Current price: {formatCurrency(product.price)}.
            </p>
          </div>
          <Accordion className="w-full">
            <AccordionItem value="specs">
              <AccordionTrigger>Material and dimensions</AccordionTrigger>
              <AccordionContent>
                <ul className="grid gap-2 text-sm text-muted-foreground">
                  {product.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger>How does COD delivery work?</AccordionTrigger>
              <AccordionContent>
                Place the order, receive a confirmation call, then pay cash when the courier delivers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="exchange">
              <AccordionTrigger>Can I exchange it?</AccordionTrigger>
              <AccordionContent>
                Unused products can be exchanged within 7 days if the color or style is not right.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {related.length > 0 ? (
          <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">You may also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

