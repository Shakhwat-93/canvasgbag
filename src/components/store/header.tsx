"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Home, Sparkles, Compass, Briefcase, Mail, Phone, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import type { Category } from "@/lib/types";

export function Header({ categories }: { categories: Category[] }) {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isShopExpanded, setIsShopExpanded] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="flex justify-center px-4 pb-3 pt-2">
      {/* Floating pill container */}
      <div
        className="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.10)] backdrop-blur-2xl"
        style={{ WebkitBackdropFilter: "blur(24px)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-full px-2 py-1 transition-opacity hover:opacity-85"
          aria-label="CanvasBag home"
        >
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-black">
            <Image
              src="/brand/logo.webp"
              alt="CanvasBag"
              width={26}
              height={26}
              className="object-contain"
            />
          </span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">CanvasBag</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Home */}
          <Link
            href="/"
            className={`relative flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-250 ${
              isActive("/")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
            }`}
          >
            Home
          </Link>

          {/* Shop with Dropdown Submenu */}
          <div className="group relative">
            <button
              className={`relative flex items-center gap-1.5 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-250 cursor-pointer ${
                pathname.startsWith("/category/")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
              }`}
            >
              Shop
              <ChevronDown className="h-3.5 w-3.5 opacity-75 group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {/* Dropdown Panel */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="w-[340px] rounded-2xl border border-white/60 bg-white/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 px-3.5 mb-2">
                  Product Categories
                </p>
                <div className="grid gap-1">
                  {categories.map((cat) => {
                    const CatIcon = cat.slug === "everyday-totes" ? Sparkles : cat.slug === "crossbody-bags" ? Compass : Briefcase;
                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-start gap-3 rounded-xl p-3.5 transition-all hover:bg-black/5 group/item text-left"
                      >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all">
                          <CatIcon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-none">
                            {cat.name}
                          </h4>
                          <p className="mt-1.5 text-xs text-muted-foreground font-medium leading-relaxed">
                            {cat.description.substring(0, 50)}...
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <Link
            href="#footer"
            className="relative flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-250 text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            Contact Us
          </Link>
        </nav>

        {/* Cart + Mobile Menu */}
        <div className="flex items-center gap-1">
          {/* Cart pill button */}
          <Link
            href="/cart"
            aria-label="Open cart"
            className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-primary">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  className="flex rounded-full md:hidden h-10 w-10 items-center justify-center hover:bg-black/5"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:max-w-sm flex flex-col justify-between p-6">
              <div className="flex-1 flex flex-col">
                <SheetHeader className="pb-3 border-b border-slate-100 p-0">
                  <SheetTitle className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-black shadow-sm shrink-0">
                      <Image src="/brand/logo.webp" alt="CanvasBag" width={26} height={26} className="object-contain" />
                    </span>
                    <span className="font-extrabold tracking-tight text-base text-slate-800">CanvasBag</span>
                  </SheetTitle>
                </SheetHeader>

                <motion.nav 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                      }
                    }
                  }}
                  className="mt-6 flex flex-col gap-2.5"
                >
                  {/* Home */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
                    }}
                  >
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold transition-all duration-200 active:scale-[0.98] ${
                        isActive("/")
                          ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(134,226,55,0.2)]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
                      }`}
                    >
                      <Home className={`h-5 w-5 shrink-0 ${isActive("/") ? "text-primary-foreground" : "text-slate-400"}`} />
                      <span>Home</span>
                      {isActive("/") && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse" />}
                    </Link>
                  </motion.div>

                  {/* Shop with Nested Collapsible Accordion */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
                    }}
                    className="flex flex-col"
                  >
                    <button
                      onClick={() => setIsShopExpanded(!isShopExpanded)}
                      className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold transition-all duration-200 ${
                        pathname.startsWith("/category/")
                          ? "text-slate-900 bg-black/5"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <ShoppingBag className="h-5 w-5 shrink-0 text-slate-400" />
                      <span>Shop</span>
                      <ChevronDown className={`ml-auto h-4 w-4 text-slate-400 transition-transform duration-250 ${isShopExpanded ? "rotate-180" : ""}`} />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: isShopExpanded ? "auto" : 0, opacity: isShopExpanded ? 1 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden pl-7 flex flex-col gap-1.5 mt-1"
                    >
                      {categories.map((cat) => {
                        const active = pathname === `/category/${cat.slug}`;
                        const CatIcon = cat.slug === "everyday-totes" ? Sparkles : cat.slug === "crossbody-bags" ? Compass : Briefcase;
                        return (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => {
                              setIsOpen(false);
                              setIsShopExpanded(false);
                            }}
                            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${
                              active
                                ? "bg-primary/10 text-slate-900 border-l-2 border-primary"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <CatIcon className="h-4 w-4 shrink-0 opacity-75 text-primary" />
                            <span>{cat.name.replace(" & Rider Gear", "").replace(" & Laptop Bags", "").replace(" & Storage", "")}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  </motion.div>

                  {/* Contact Us */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
                    }}
                  >
                    <Link
                      href="#footer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold transition-all duration-200 active:scale-[0.98] text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
                    >
                      <Phone className="h-5 w-5 shrink-0 text-slate-400" />
                      <span>Contact Us</span>
                    </Link>
                  </motion.div>

                  {/* View Cart */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
                    }}
                    className="mt-4"
                  >
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between rounded-xl bg-black text-white px-5 py-4 text-base font-extrabold shadow-lg hover:bg-black/90 active:scale-[0.98] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5 text-primary group-hover:rotate-6 transition-transform" />
                        <span>View Cart</span>
                      </div>
                      {itemCount > 0 ? (
                        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1.5 text-xs font-black text-primary-foreground">
                          {itemCount}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Empty</span>
                      )}
                    </Link>
                  </motion.div>
                </motion.nav>
              </div>

              {/* Drawer footer Support info */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.25 }}
                className="mt-auto pt-6 border-t border-slate-100 space-y-4 shrink-0"
              >
                <div className="space-y-2">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Support & Confirmation</p>
                  <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      hello@canvasbagbd.com
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      +880 17XXXXXXXX
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>© 2026 CanvasBag BD</span>
                  <span className="text-primary font-bold">Frictionless COD</span>
                </div>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
