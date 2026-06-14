import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { useStore } from "@/components/providers/store-provider";
import { trackEvent } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";

export function OrderSuccess({ orderId, total }: { orderId: string; total: number }) {
  const { clearCart } = useCart();
  const { addOrder } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const trackKey = `purchase_tracked_${orderId}`;
    const alreadyTracked = localStorage.getItem(trackKey);

    const pendingOrderStr = localStorage.getItem("cb_pending_order");
    if (pendingOrderStr && !alreadyTracked) {
      try {
        const pendingOrder = JSON.parse(pendingOrderStr);
        localStorage.setItem(trackKey, "true");

        // Format phone to E.164 for advanced matching
        const formatPhoneE164 = (p: string) => {
          const clean = p.replace(/\D/g, "");
          if (clean.startsWith("01") && clean.length === 11) {
            return `+88${clean}`;
          }
          if (clean.startsWith("8801") && clean.length === 13) {
            return `+${clean}`;
          }
          if (clean.startsWith("+")) {
            return clean;
          }
          return p;
        };

        const formattedPhone = formatPhoneE164(pendingOrder.phone);

        // Track purchase via centralized analytics helper (which handles both GTM dataLayer and Pixel)
        trackEvent("purchase", {
          order_id: orderId,
          value: total || pendingOrder.total,
          shipping_cost: pendingOrder.deliveryFee,
          customer_info: {
            name: pendingOrder.name,
            phone: pendingOrder.phone,
            address: pendingOrder.address,
            shipping_zone: pendingOrder.shippingZone,
            note: pendingOrder.note || "",
          },
          user_data: {
            phone_number: formattedPhone,
            address: {
              first_name: pendingOrder.name,
              street: pendingOrder.address,
              city: pendingOrder.shippingZone === "Inside dhaka" ? "Dhaka" : "",
              country: "BD",
            }
          },
          items: pendingOrder.items.map((item: any) => ({
            item_id: item.productId,
            item_name: item.name,
            item_brand: "CanvasBag",
            item_variant: item.variantName || "Standard",
            price: item.price,
            quantity: item.quantity,
          })),
        });

        addOrder({
          id: orderId,
          customerName: pendingOrder.name,
          phone: pendingOrder.phone,
          status: "pending",
          paymentMethod: "cod",
          subtotal: pendingOrder.subtotal,
          deliveryFee: pendingOrder.deliveryFee,
          discount: pendingOrder.discount || 0,
          total: total || pendingOrder.total,
          items: pendingOrder.items,
          createdAt: new Date().toISOString(),
        });

      } catch (e) {
        console.error("Failed to parse pending order for purchase tracking", e);
      } finally {
        localStorage.removeItem("cb_pending_order");
      }
    } else if (!alreadyTracked) {
      // Direct success page entry or fallback if no pending order in storage
      localStorage.setItem(trackKey, "true");
      
      trackEvent("purchase", {
        order_id: orderId,
        value: total,
      });

      addOrder({
        id: orderId,
        customerName: "Web Customer",
        phone: "017XXXXXXXX",
        status: "pending",
        paymentMethod: "cod",
        subtotal: total > 120 ? total - 120 : total,
        deliveryFee: total > 120 ? 120 : 0,
        discount: 0,
        total: total,
        items: [],
        createdAt: new Date().toISOString(),
      });
    }

    clearCart();
  }, [clearCart, orderId, total, addOrder]);

  return (
    <main className="mx-auto grid min-h-[65vh] max-w-2xl place-items-center px-4 py-16 text-center font-poppins">
      <div className="flex flex-col items-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-lime-500/10 text-lime-600 shadow-inner mb-6">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <p className="text-xs font-bold uppercase text-lime-600 tracking-wider">অর্ডার সফল হয়েছে</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight px-2">অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</h1>
        <p className="mt-4 text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed px-4">
          আপনার ক্যাশ অন ডেলিভারি অর্ডার আইডি <span className="font-bold text-slate-800">#{orderId}</span> তৈরি করা হয়েছে। 
          অর্ডারটি কনফার্ম করার জন্য আমাদের কাস্টমার প্রতিনিধি খুব শীঘ্রই আপনাকে কল করবেন।
        </p>
        
        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4 w-full max-w-sm text-center">
          <span className="text-slate-400 font-bold text-xs block">মোট পরিশোধযোগ্য মূল্য:</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">{formatCurrency(total)}</span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center max-w-sm px-4">
          <Button
            onClick={() => navigate("/")}
            className="!h-12 w-full sm:w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold !rounded-2xl cursor-pointer text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all active:scale-[0.98]"
            style={{ height: "48px", minHeight: "48px", borderRadius: "16px" }}
          >
            শপিং চালিয়ে যান
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/category/everyday-totes")}
            className="!h-12 w-full sm:w-1/2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-extrabold !rounded-2xl cursor-pointer text-xs sm:text-sm transition-all active:scale-[0.98]"
            style={{ height: "48px", minHeight: "48px", borderRadius: "16px" }}
          >
            নতুন ব্যাগ দেখুন
          </Button>
        </div>
      </div>
    </main>
  );
}

