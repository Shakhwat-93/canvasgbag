import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ShieldAlert, PhoneCall, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { useStore } from "@/components/providers/store-provider";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import { supabaseOrders } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export function CheckoutForm() {
  const { items, addItem, updateQuantity, removeItem, clearCart } = useCart();
  const { products, settings } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingZone, setShippingZone] = useState<"Inside dhaka" | "Outside dhaka">("Inside dhaka");
  const [rateLimitData, setRateLimitData] = useState<{
    phone: string;
    ip: string;
    reason: "phone" | "ip" | "local_storage";
    nextAvailableTime: string;
  } | null>(null);

  const beginCheckoutFired = useRef(false);

  const productSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleShippingZoneChange = (zone: "Inside dhaka" | "Outside dhaka") => {
    setShippingZone(zone);
    
    const cost = zone === "Inside dhaka"
      ? (settings.shippingInsideDhaka ?? 60)
      : (settings.shippingOutsideDhaka ?? 130);
    const newTotal = productSubtotal + cost;

    // GA4 dataLayer add_shipping_info push via centralized trackEvent
    trackEvent("add_shipping_info", {
      value: newTotal,
      shipping_zone: zone === "Inside dhaka" ? "Inside Dhaka" : "Outside Dhaka",
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        item_brand: "CanvasBag",
        item_variant: item.variantName || "Standard",
        quantity: item.quantity
      }))
    });
  };
  const shippingCost = shippingZone === "Inside dhaka"
    ? (settings.shippingInsideDhaka ?? 60)
    : (settings.shippingOutsideDhaka ?? 130);
  const total = productSubtotal + shippingCost;

  useEffect(() => {
    if (items.length > 0 && !beginCheckoutFired.current) {
      beginCheckoutFired.current = true;
      trackEvent("begin_checkout", {
        value: total,
        items: items.map((item) => ({
          item_id: item.productId,
          item_name: item.name,
          item_brand: "CanvasBag",
          item_variant: item.variantName || "Standard",
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [items, total]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name     = String(formData.get("name")     ?? "").trim();
    const phone    = String(formData.get("phone")    ?? "").trim();
    const address  = String(formData.get("address")  ?? "").trim();
    const note     = String(formData.get("note")     ?? "").trim();

    // Bangladesh phone validation
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone)) {
      setError("মোবাইল নম্বরটি সঠিক নয়! দয়া করে ১১ ডিজিটের সঠিক বাংলাদেশী মোবাইল নম্বর দিন (উদাঃ 01712345678)।");
      setIsSubmitting(false);
      return;
    }

    // Resolve IP address
    const ipAddress = (window as any).userIp || "";

    // Rate Limit Checks
    const bypassPhones = ["01953986982", "01315183993"];
    const isBypass = bypassPhones.includes(phone);

    if (!isBypass) {
      const blockHours = settings.duplicateBlockHours ?? 6;
      const thresholdTime = new Date(Date.now() - blockHours * 60 * 60 * 1000).toISOString();

      // Check localStorage
      const lastOrderTime = localStorage.getItem("last_order_time");
      if (lastOrderTime) {
        const lastOrderDate = new Date(lastOrderTime);
        const timeDiffMs = Date.now() - lastOrderDate.getTime();
        const blockHoursMs = blockHours * 60 * 60 * 1000;
        if (timeDiffMs < blockHoursMs) {
          const nextDate = new Date(lastOrderDate.getTime() + blockHoursMs);
          const isToday = nextDate.toDateString() === new Date().toDateString();
          const formattedTime = nextDate.toLocaleTimeString("bn-BD", {
            hour: "2-digit",
            minute: "2-digit"
          });
          const nextTimeStr = (isToday ? "আজ " : "আগামীকাল ") + formattedTime;
          setRateLimitData({
            phone,
            ip: ipAddress || "Unknown",
            reason: "local_storage",
            nextAvailableTime: nextTimeStr
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Check orders table: phone matches and created_at >= thresholdTime
      const { data: phoneOrders, error: phoneErr } = await supabaseOrders
        .from("orders")
        .select("created_at")
        .eq("phone", phone)
        .gte("created_at", thresholdTime)
        .order("created_at", { ascending: false })
        .limit(1);

      if (phoneErr) {
        console.error("Supabase phone check error:", phoneErr);
      } else if (phoneOrders && phoneOrders.length > 0) {
        const lastOrderDate = new Date(phoneOrders[0].created_at);
        const nextDate = new Date(lastOrderDate.getTime() + blockHours * 60 * 60 * 1000);
        const isToday = nextDate.toDateString() === new Date().toDateString();
        const formattedTime = nextDate.toLocaleTimeString("bn-BD", {
          hour: "2-digit",
          minute: "2-digit"
        });
        const nextTimeStr = (isToday ? "আজ " : "আগামীকাল ") + formattedTime;
        setRateLimitData({
          phone,
          ip: ipAddress || "Unknown",
          reason: "phone",
          nextAvailableTime: nextTimeStr
        });
        setIsSubmitting(false);
        return;
      }

      // Check orders table: ip_address matches and created_at >= thresholdTime
      if (ipAddress) {
        const { data: ipOrders, error: ipErr } = await supabaseOrders
          .from("orders")
          .select("created_at")
          .eq("ip_address", ipAddress)
          .gte("created_at", thresholdTime)
          .order("created_at", { ascending: false })
          .limit(1);

        if (ipErr) {
          console.error("Supabase IP check error:", ipErr);
        } else if (ipOrders && ipOrders.length > 0) {
          const lastOrderDate = new Date(ipOrders[0].created_at);
          const nextDate = new Date(lastOrderDate.getTime() + blockHours * 60 * 60 * 1000);
          const isToday = nextDate.toDateString() === new Date().toDateString();
          const formattedTime = nextDate.toLocaleTimeString("bn-BD", {
            hour: "2-digit",
            minute: "2-digit"
          });
          const nextTimeStr = (isToday ? "আজ " : "আগামীকাল ") + formattedTime;
          setRateLimitData({
            phone,
            ip: ipAddress,
            reason: "ip",
            nextAvailableTime: nextTimeStr
          });
          setIsSubmitting(false);
          return;
        }
      }
    }

    const primaryProductName = items[0]?.name || "Canvas Bag";
    const words = primaryProductName.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/);
    const prefix = words.length === 1
      ? words[0].toUpperCase()
      : words
          .filter(w => !["AND", "OR", "OF", "THE", "A", "FOR", "TO", "WITH", "BY", "IN", "ON"].includes(w.toUpperCase()))
          .map(w => w[0].toUpperCase())
          .join("");

    const orderId = `${prefix || "ORD"}-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullAddress = address;

    // Traffic Source Detection
    const detectTrafficSource = (): string => {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source");
      if (utmSource) return utmSource;

      if (urlParams.has("fbclid")) return "Facebook";
      if (urlParams.has("gclid")) return "Google Ads";
      if (urlParams.has("ttclid")) return "TikTok";
      if (urlParams.has("msclkid")) return "Bing Ads";

      const referrer = document.referrer ? document.referrer.toLowerCase() : "";
      if (referrer) {
        try {
          const hostname = new URL(referrer).hostname;
          if (hostname.includes("facebook.com") || hostname.includes("fb.com")) return "Facebook";
          if (hostname.includes("instagram.com")) return "Instagram";
          if (hostname.includes("tiktok.com")) return "TikTok";
          if (hostname.includes("google.com") || hostname.includes("google.com.bd")) return "Google";
          if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "YouTube";
          if (hostname.includes("whatsapp.com") || hostname.includes("wa.me")) return "WhatsApp";
          if (hostname.includes("linkedin.com")) return "LinkedIn";
          if (hostname.includes("x.com") || hostname.includes("twitter.com") || hostname.includes("t.co")) return "Twitter/X";
          if (hostname.includes("bing.com")) return "Bing";
          if (hostname.includes("pinterest.com")) return "Pinterest";
        } catch (e) {
          console.error("Failed to parse referrer URL:", e);
        }
      }
      return "Direct";
    };

    const trafficSource = detectTrafficSource();
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const distinctItemsCount = items.length;

    const orderedItems = items.map((item) => ({
      name: item.variantName ? `${item.name} - ${item.variantName}` : item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      // 1. Insert the order row in the new schema
      const { error: orderError } = await supabaseOrders
        .from("orders")
        .insert({
          id: orderId,
          customer_name: name,
          phone,
          address: fullAddress,
          product_name: primaryProductName,
          quantity: distinctItemsCount,
          source: "main website",
          status: "New",
          amount: total,
          items: totalQuantity,
          payment_status: "Unpaid",
          shipping_zone: shippingZone,
          ordered_items: orderedItems,
          notes: note || null,
          traffic_source: trafficSource,
          ip_address: ipAddress || null
        });

      if (orderError) {
        setError(orderError?.message ?? "Failed to place order. Please try again.");
        return;
      }

      // Store order details in localStorage for success page GTM tracking
      const pendingOrderData = {
        id: orderId,
        name: name,
        phone: phone,
        address: fullAddress,
        shippingZone: shippingZone,
        note: note || "",
        subtotal: productSubtotal,
        deliveryFee: shippingCost,
        total: total,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          variantName: item.variantName || "Standard",
          price: item.price,
          quantity: item.quantity
        }))
      };
      localStorage.setItem("cb_pending_order", JSON.stringify(pendingOrderData));
      localStorage.setItem("last_order_time", new Date().toISOString());

      // 3. Clear cart and redirect
      clearCart();
      navigate(`/order/success/${orderId}?total=${total}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (items.length === 0) {
    return (
      <div className="mx-auto grid min-h-[55vh] max-w-xl place-items-center px-4 py-20 text-center">
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold">Your cart is empty.</h1>
          <p className="mt-3 text-muted-foreground">Add a product before placing a COD order.</p>
          <Button asChild className="mt-6">
            <Link to="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cartProductIds = Array.from(new Set(items.map((item) => item.productId)));
  const cartProducts = products.filter((p) => cartProductIds.includes(p.id));

  return (
    <div className="mx-auto w-full max-w-6xl px-3.5 py-6 sm:px-6 sm:py-10 lg:px-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        {/* Top Center: Products choose/selection option */}
        <div className="w-full flex flex-col gap-6">
          {/* Your Products Section */}
          <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-5">Your Products</h2>
            
            <div className="space-y-6">
              {cartProducts.map((product) => (
                <div key={product.id} className="space-y-4">
                  {cartProducts.length > 1 && (
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.name}</h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.variants.map((variant) => {
                      const isInCart = items.some((item) => item.productId === product.id && item.variantId === variant.id);
                      const cartItem = items.find((item) => item.productId === product.id && item.variantId === variant.id);

                      const handleToggle = () => {
                        if (isInCart) {
                          if (items.length === 1) {
                            return; // Keep at least one item in cart
                          }
                          removeItem(product.id, variant.id);
                        } else {
                          if (!variant.inStock) return;
                          addItem({
                            productId: product.id,
                            slug: product.slug,
                            name: product.name,
                            image: variant.image || product.images[0]?.url || "",
                            price: variant.price,
                            compareAtPrice: product.compareAtPrice,
                            variantId: variant.id,
                            variantName: variant.name,
                            quantity: 1,
                          });
                        }
                      };

                      const handleQtyChange = (newQty: number) => {
                        if (newQty <= 0) {
                          if (items.length === 1) return;
                          removeItem(product.id, variant.id);
                        } else {
                          updateQuantity(product.id, variant.id, newQty);
                        }
                      };

                      return (
                        <div
                          key={variant.id}
                          onClick={variant.inStock ? handleToggle : undefined}
                          className={`relative flex items-center gap-3.5 p-4 rounded-2xl border transition-all select-none ${
                            isInCart
                              ? "border-[var(--primary)] bg-white shadow-sm ring-1 ring-[var(--primary)]"
                              : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                          } ${!variant.inStock ? "opacity-60 cursor-not-allowed bg-slate-100/30" : "cursor-pointer"}`}
                        >
                          {/* Checkbox wrapper */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle();
                            }}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-white transition-all cursor-pointer ${
                              isInCart
                                ? "bg-[var(--primary)] border-[var(--primary)]"
                                : "border-slate-350 bg-white hover:border-slate-400"
                            } ${!variant.inStock ? "pointer-events-none opacity-50" : ""}`}
                          >
                            {isInCart && (
                              <svg className="h-3 w-3 text-[var(--primary-foreground)] stroke-[3.5] stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </div>

                          {/* Image */}
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                            <img
                              src={variant.image || product.images[0]?.url || ""}
                              alt={variant.name}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-[13px] leading-snug truncate">
                              {product.name} - {variant.name}
                            </p>
                            <div className="flex items-center justify-between mt-2 gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">
                                {formatCurrency(variant.price)}
                              </span>

                              {isInCart ? (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange((cartItem?.quantity || 1) - 1)}
                                    className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 font-extrabold active:scale-90 transition-all text-xs"
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-slate-800">
                                    {cartItem?.quantity || 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange((cartItem?.quantity || 1) + 1)}
                                    className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-100 font-extrabold active:scale-90 transition-all text-xs"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {/* Stock out badge */}
                          {!variant.inStock && (
                            <span className="absolute top-3.5 right-4 bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                              STOCK OUT
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Left-Right Columns for Desktop (stacks on Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 sm:gap-8 items-start">
          {/* Left Column: Customer details (Billing & Shipping details) */}
          <div className="w-full flex flex-col gap-6">
            <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1.5">Billing & Shipping</h2>
                <Separator className="bg-slate-100 mb-6" />
              </div>

              {error ? (
                <div className="mb-6 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-xs font-semibold text-destructive">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700">আপনার নাম লিখুন <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" autoComplete="name" required placeholder="e.g. Hasan Mahmud" className="rounded-xl h-11 border-slate-200 focus-visible:ring-primary text-slate-800 text-sm font-medium" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-xs font-bold text-slate-700">আপনার ঠিকানা এলাকা, থানা, জেলা লিখুন <span className="text-red-500">*</span></Label>
                  <Input id="address" name="address" required placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka" className="rounded-xl h-11 border-slate-200 focus-visible:ring-primary text-slate-800 text-sm font-medium" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-700">মোবাইল নাম্বার <span className="text-red-500">*</span></Label>
                  <Input id="phone" name="phone" autoComplete="tel" required placeholder="01XXXXXXXXX" className="rounded-xl h-11 border-slate-200 focus-visible:ring-primary text-slate-800 text-sm font-medium" />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary, Shipping Zone, Total, and Order Confirm button */}
          <aside className="w-full h-fit rounded-3xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Your order</h2>
            
            <div className="mt-5 grid gap-4">
              {/* Header row */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-200/60">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              {/* List of checked products */}
              <div className="divide-y divide-slate-200/40">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 py-3.5 text-sm">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-100 bg-white" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        {item.variantName ? `${item.variantName} ` : ""}x {item.quantity}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900 shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-200/60" />

              {/* Subtotal row */}
              <div className="flex justify-between text-sm py-1.5">
                <span className="text-slate-500 font-bold">Subtotal</span>
                <span className="font-extrabold text-slate-800">{formatCurrency(productSubtotal)}</span>
              </div>

              <Separator className="bg-slate-200/60" />

              {/* Shipping zone radio buttons selector */}
              <div className="grid gap-2.5 py-2">
                {/* Inside Dhaka option */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                  shippingZone === "Inside dhaka"
                    ? "border-[var(--primary)] bg-white ring-1 ring-[var(--primary)] shadow-sm"
                    : "border-slate-150 bg-slate-50 hover:bg-slate-100/50"
                }`}>
                  <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <span>ঢাকার ভিতরে ডেলিভারি চার্জ:</span>
                    <span className="text-[var(--primary)] font-extrabold">{settings.shippingInsideDhaka ?? 60}.00৳</span>
                  </div>
                  <input
                    type="radio"
                    name="shipping_zone"
                    value="Inside dhaka"
                    checked={shippingZone === "Inside dhaka"}
                    onChange={() => handleShippingZoneChange("Inside dhaka")}
                    className="h-4.5 w-4.5 border-slate-350 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </label>

                {/* Outside Dhaka option */}
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                  shippingZone === "Outside dhaka"
                    ? "border-[var(--primary)] bg-white ring-1 ring-[var(--primary)] shadow-sm"
                    : "border-slate-150 bg-slate-50 hover:bg-slate-100/50"
                }`}>
                  <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <span>ঢাকার বাইরে ডেলিভারি চার্জ:</span>
                    <span className="text-[var(--primary)] font-extrabold">{settings.shippingOutsideDhaka ?? 130}.00৳</span>
                  </div>
                  <input
                    type="radio"
                    name="shipping_zone"
                    value="Outside dhaka"
                    checked={shippingZone === "Outside dhaka"}
                    onChange={() => handleShippingZoneChange("Outside dhaka")}
                    className="h-4.5 w-4.5 border-slate-350 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </label>
              </div>

              <Separator className="bg-slate-200/60" />

              {/* Total row */}
              <div className="flex justify-between items-center text-base py-1.5">
                <span className="font-extrabold text-slate-800">Total</span>
                <span className="text-xl font-black text-red-600 tracking-tight">{formatCurrency(total)}</span>
              </div>

              {/* Submit CTA button */}
              <SubmitButton isSubmitting={isSubmitting} />

              {/* Helpline support below button */}
              <p className="text-[10px] font-bold text-slate-400 text-center mt-3 leading-normal">
                অর্ডার করতে কোনো সমস্যা হলে কল করুন: <a href="tel:+8801942212267" className="text-slate-600 hover:underline font-extrabold">+8801942-212267</a>
              </p>
            </div>
          </aside>
        </div>

        {/* Rate Limit Modal */}
        <AnimatePresence>
          {rateLimitData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRateLimitData(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              
              {/* Modal Body */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-950/95 font-poppins text-slate-800 dark:text-slate-100"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setRateLimitData(null)}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col items-center text-center">
                  {/* Warning Icon Container */}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
                    <ShieldAlert className="h-8 w-8" />
                  </div>

                  {/* Heading */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {rateLimitData.reason === "ip"
                      ? "দুঃখিত, আইপি ব্লক সনাক্ত হয়েছে"
                      : "দুঃখিত, ডুপ্লিকেট অর্ডার সনাক্ত হয়েছে"}
                  </h3>
                  
                  {/* Description */}
                  <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {rateLimitData.reason === "ip"
                      ? `আমাদের সিস্টেমে আপনার ইন্টারনেট ঠিকানা (IP) থেকে সম্প্রতি একটি অর্ডার পাওয়া গেছে। স্প্যাম প্রতিরোধে আগামী ${settings.duplicateBlockHours ?? 6} ঘণ্টার মধ্যে পুনরায় অর্ডার করার সুযোগ সাময়িকভাবে সীমিত।`
                      : `আমাদের সিস্টেমে আপনার ফোন নম্বর বা ব্রাউজার থেকে সম্প্রতি একটি অর্ডার পাওয়া গেছে। স্প্যাম প্রতিরোধে আগামী ${settings.duplicateBlockHours ?? 6} ঘণ্টার মধ্যে পুনরায় অর্ডার করার সুযোগ সাময়িকভাবে সীমিত।`}
                  </p>

                  {/* Details Card */}
                  <div className="mt-6 w-full rounded-2xl bg-slate-50/80 p-4 border border-slate-150 text-left text-[11px] space-y-2 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">মোবাইল নম্বর:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{rateLimitData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">আইপি এড্রেস:</span>
                      <span className="font-mono text-slate-600 dark:text-slate-300">{rateLimitData.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">পুনরায় অর্ডারের সময়:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{rateLimitData.nextAvailableTime}</span>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="mt-8 flex w-full flex-col gap-2.5">
                    <a
                      href="tel:01953986982"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 active:scale-[0.98] transition-all text-xs cursor-pointer shadow-md shadow-slate-900/10 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                    >
                      <PhoneCall className="h-4 w-4" />
                      হটলাইনে কথা বলুন
                    </a>
                    <button
                      type="button"
                      onClick={() => setRateLimitData(null)}
                      className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all text-xs cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      className="mt-4 h-13 w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          অর্ডার প্রসেসিং হচ্ছে...
        </>
      ) : (
        <>
          <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          অর্ডার কনফার্ম করুন
        </>
      )}
    </Button>
  );
}
