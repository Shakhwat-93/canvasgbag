import { Link } from "react-router-dom";
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
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Featured Categories</h2>
          <span className="mt-2.5 h-1 w-12 rounded bg-[var(--primary)]" />
        </div>

        <div className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-6 justify-start md:justify-center -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((category) => {
            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group flex w-[125px] sm:w-[155px] h-[135px] sm:h-[165px] shrink-0 flex-col items-center justify-center p-3.5 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all duration-300 hover:border-[var(--primary)] hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Image Container */}
                <div className="relative h-14 w-14 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-1 border border-slate-100/50">
                  <img
                    src={category.image || "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"}
                    alt={category.name}
                    className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Title */}
                <span className="mt-3.5 text-xs sm:text-[13px] font-extrabold text-slate-800 text-center tracking-tight truncate w-full group-hover:text-slate-900 transition-colors">
                  {category.name}
                </span>
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
              <span className="w-1.5 h-6 bg-primary rounded-sm transition-colors duration-300" />
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">আমাদের সকল পণ্য</h2>
            </div>
            <Link to={`/category/${categories[0]?.slug || 'everyday-totes'}`} className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </div>
      </MotionSection>

      {/* Value Propositions */}
      <MotionSection className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs md:text-sm font-semibold uppercase text-muted-foreground tracking-wider">Why it works</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold">Not just a bag. A sharper carry system.</h2>
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
              <figure key={review.id} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 text-slate-800">
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-6 text-slate-600 font-medium">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-xs font-bold text-slate-800">
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
          <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full mb-4 inline-flex shadow-sm transition-colors duration-300">{settings.promoTitle}</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold">{settings.promoHeadline}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {settings.promoDescription}
          </p>
          <Button asChild size="lg" className="mt-6 h-12 px-8">
            <Link to={settings.promoLink}>{settings.promoButtonText}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
