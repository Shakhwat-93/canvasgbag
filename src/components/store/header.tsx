"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Home, Sparkles, Compass, Briefcase, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import type { Category } from "@/lib/types";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Active Carry", href: "/category/everyday-totes", icon: Sparkles },
  { label: "Training Gear", href: "/category/crossbody-bags", icon: Compass },
  { label: "Travel Duffels", href: "/category/travel-canvas", icon: Briefcase },
];

export function Header({ categories }: { categories: Category[] }) {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-250 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
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
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    const LinkIcon = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        variants={{
                          hidden: { opacity: 0, x: 25 },
                          show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 280, damping: 22 } }
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold transition-all duration-200 active:scale-[0.98] ${
                            active
                              ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(134,226,55,0.2)]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100"
                          }`}
                        >
                          <LinkIcon className={`h-5 w-5 shrink-0 ${active ? "text-primary-foreground" : "text-slate-400"}`} />
                          <span>{link.label}</span>
                          {active && <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse" />}
                        </Link>
                      </motion.div>
                    );
                  })}

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
