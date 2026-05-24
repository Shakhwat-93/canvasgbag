"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ProductPurchasePanel } from "@/components/store/product-purchase-panel";
import { ProductCard } from "@/components/store/product-card";
import { MobileProductView } from "@/components/store/mobile-product-view";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency } from "@/lib/format";
import { reviews } from "@/lib/data";
import type { Product } from "@/lib/types";

export function ProductClient({
  slug,
  initialProduct,
  initialRelated,
}: {
  slug: string;
  initialProduct: Product;
  initialRelated: Product[];
}) {
  const { products } = useStore();

  // Find product dynamically
  const product = products.find((p) => p.slug === slug) || initialProduct;
  if (!product) {
    notFound();
  }

  // Filter related products dynamically
  const related = products
    .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
    .slice(0, 3);
  const displayRelated = related.length > 0 ? related : initialRelated;

  return (
    <main className="pb-20 md:pb-0">
      {/* Mobile-App styled Single Product View */}
      <MobileProductView product={product} />

      {/* Desktop-only Single Product View */}
      <div className="hidden md:block">
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            {product.images.map((image, index) => (
              <div key={image.id} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted border border-slate-100">
                <Image
                  src={image.url || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
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
            {product.benefits && product.benefits.map((benefit) => (
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
                  {product.specs && product.specs.map((spec) => (
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

        {displayRelated.length > 0 ? (
          <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">You may also like</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayRelated.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
