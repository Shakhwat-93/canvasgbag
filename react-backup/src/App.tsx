import { useEffect } from "react";
import { Routes, Route, useLocation, Link, useSearchParams, useParams } from "react-router-dom";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { HomeClient } from "@/components/store/home-client";
import { CategoryClient } from "@/components/store/category-client";
import { ProductClient } from "@/components/store/product-client";
import { CartView } from "@/components/store/cart-view";
import { CheckoutForm } from "@/components/store/checkout-form";
import { OrderSuccess } from "@/components/store/order-success";
import { ShopLayoutClient } from "@/components/store/shop-layout-client";
import AdminPage from "@/app/admin/page";
import { products as hardcodedProducts, categories as hardcodedCategories } from "@/lib/data";
import { useStore } from "@/components/providers/store-provider";

function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const total = Number(searchParams.get("total") ?? 0);
  return <OrderSuccess orderId={id ?? ""} total={total} />;
}

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useStore();
  
  // Find product dynamically, fallback to hardcoded if not loaded yet
  const product = products.find((p) => p.slug === slug) || hardcodedProducts.find((p) => p.slug === slug);
  const related = products.filter((p) => p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 4);

  if (!product) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 py-20 text-center">
        <div>
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-2 text-muted-foreground">The product you are looking for does not exist.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Go home</Link>
        </div>
      </div>
    );
  }

  return <ProductClient slug={slug ?? ""} initialProduct={product} initialRelated={related.length > 0 ? related : hardcodedProducts.slice(0, 4)} />;
}

function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { categories, products } = useStore();
  
  // Find category dynamically
  const category = categories.find((c) => c.slug === slug) || hardcodedCategories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === (slug ?? ""));

  if (!category) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 py-20 text-center">
        <div>
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-2 text-muted-foreground">The category you are looking for does not exist.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Go home</Link>
        </div>
      </div>
    );
  }

  return <CategoryClient slug={slug ?? ""} initialCategory={category} initialProducts={categoryProducts.length > 0 ? categoryProducts : hardcodedProducts.filter(p => p.categorySlug === slug)} />;
}

function StoreLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex-1 min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-white">
      <div className="fixed inset-x-0 top-0 z-50 flex flex-col">
        <AnnouncementBar />
        <Header />
      </div>
      <div className="flex-1 w-full max-w-full overflow-x-hidden pt-[110px]">{children}</div>
      <Footer />
    </div>
  );
}

function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/98 backdrop-blur-md">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loader-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-progress {
          animation: loader-progress 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
      <div className="flex flex-col items-center max-w-xs text-center space-y-6">
        {/* Pulsing circular icon container */}
        <div className="relative flex items-center justify-center">
          {/* Glowing pulse rings */}
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/20 animate-ping opacity-75" />
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/10 animate-pulse" />
          
          {/* Logo container */}
          <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-black shadow-lg">
            <img
              src="/brand/logo.webp"
              alt="CanvasBag Logo"
              width={38}
              height={38}
              className="object-contain"
            />
          </div>
        </div>

        {/* Text area */}
        <div className="space-y-2">
          <h2 className="text-sm font-black tracking-[0.25em] text-slate-900 uppercase">
            CanvasBag
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Loading premium carry...
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-28 h-0.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-primary rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
}

export default function App() {
  const { loading } = useStore();

  if (loading) {
    return <PremiumLoader />;
  }

  return (
    <>
      <ScrollToTop />
      <StoreLayout>
      <Routes>
        <Route path="/" element={<HomeClient />} />
        <Route path="/shop" element={<ShopLayoutClient />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/order/success/:id" element={<OrderSuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 py-20 text-center">
              <div>
                <p className="text-7xl font-black text-muted-foreground/30">404</p>
                <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
                <p className="mt-3 text-muted-foreground">The page you are looking for does not exist.</p>
                <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Go home</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </StoreLayout>
    </>
  );
}
