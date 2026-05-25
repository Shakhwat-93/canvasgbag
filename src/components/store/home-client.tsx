"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { MotionSection } from "@/components/store/motion-section";
import { HeroSection } from "@/components/store/hero-slider";
import { useStore } from "@/components/providers/store-provider";
import { reviews } from "@/lib/data";

const valueProps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Sparkles,
    title: "Built for active routines",
    text: "Gym, travel, and everyday carry stay organized without looking messy.",
  },
  {
    icon: CheckCircle2,
    title: "Practical compartments",
    text: "Room for water, shoes, tech, charger, wallet, and quick-grab essentials.",
  },
  {
    icon: Truck,
    title: "COD-friendly buying flow",
    text: "Quick confirmation and no payment friction for Bangladesh shoppers.",
  },
  {
    icon: ShieldCheck,
    title: "Premium brand perception",
    text: "Strong visuals, clean product pages, and trust details make the store feel launch-ready.",
  },
];

export function HomeClient() {
  const { products, categories, settings } = useStore();

  // Filter best sellers from dynamic products list (or fallback to top products)
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

  return (
    <>
      <HeroSection />

      {/* Shop by Category Section */}
      <MotionSection className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase text-muted-foreground">Shop by lifestyle</p>
            <h2 className="mt-2 text-3xl font-semibold">Pick the bag that matches your day.</h2>
          </div>
          {categories.length > 0 && (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={`/category/${categories[0].slug}`}>View all</Link>
            </Button>
          )}
        </div>
        <div className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-3">
          {categories.map((category, index) => {
            const colors = [
              "bg-gradient-to-br from-[#ff8c4a] to-[#e66012]",
              "bg-gradient-to-br from-[#9b51e0] to-[#7b2cbf]",
              "bg-gradient-to-br from-[#ff4081] to-[#e91e63]",
            ];
            const bgClass = colors[index % colors.length];

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative flex min-h-[380px] flex-col justify-end"
              >
                {/* Slanted Background Shape */}
                <div
                  className={`absolute bottom-6 left-0 right-0 top-12 rounded-t-3xl rounded-b-[2rem] transition-transform duration-500 group-hover:scale-[1.02] ${bgClass}`}
                  style={{ clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0% 100%)" }}
                />

                {/* Cutout Image Overlapping */}
                <div className="absolute inset-x-2 -top-10 bottom-[120px] z-10 transition-transform duration-500 group-hover:-translate-y-3">
                  <Image
                    src={category.image || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
                    alt={category.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain object-bottom drop-shadow-2xl"
                  />
                </div>

                {/* White Info Card Overlay */}
                <div className="relative z-20 mx-4 mb-0 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{category.name}</h3>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">
                        {products.filter((p) => p.categorySlug === category.slug).length} styles available
                      </p>
                    </div>
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1ed760]" />
                  </div>

                  <div className="mt-5 flex w-full items-center justify-center rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    Shop Now +
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </MotionSection>

      {/* Best Sellers Section */}
      <MotionSection className="border-y bg-muted/25">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-sm" />
              <h2 className="text-lg md:text-xl font-black text-slate-900">আমাদের সকল পণ্য</h2>
            </div>
            <Link href={`/category/${categories[0]?.slug || 'everyday-totes'}`} className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
              View All
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayBestSellers.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Value Propositions */}
      <MotionSection className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">Why it works</p>
          <h2 className="mt-2 text-3xl font-semibold">Not just a bag. A sharper carry system.</h2>
        </div>
        <div className="grid gap-4">
          {valueProps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-lg border p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </MotionSection>

      {/* Reviews Section */}
      <MotionSection className="bg-primary text-primary-foreground transition-colors duration-300">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.id} className="rounded-xl border border-black/10 bg-white/40 p-5 backdrop-blur-sm">
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-7 text-primary-foreground/85">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-primary-foreground">
                  {review.author} · {review.location}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Promo banner block controlled page-wise */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-primary bg-primary/10 p-8 text-center sm:p-12 transition-colors duration-300">
          <span className="lime-pill mb-4 inline-flex">{settings.promoTitle}</span>
          <h2 className="mt-3 text-3xl font-semibold">{settings.promoHeadline}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {settings.promoDescription}
          </p>
          <Button asChild size="lg" className="mt-6 h-12 px-8">
            <Link href={settings.promoLink}>{settings.promoButtonText}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
