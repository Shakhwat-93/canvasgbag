@extends('layouts.app')

@section('title', 'Order Confirmed | CanvasBag')

@section('content')
<div class="mx-auto max-w-xl px-4 py-16 text-center min-h-[60vh] flex flex-col justify-center items-center">
  <div class="rounded-3xl border border-slate-200/60 bg-white p-8 sm:p-10 shadow-sm w-full space-y-6">
    <!-- Checkmark icon -->
    <div class="flex justify-center">
      <div class="relative flex items-center justify-center">
        <!-- Glowing pulse rings -->
        <div class="absolute inset-0 h-16 w-16 rounded-full bg-green-500/20 animate-ping opacity-75"></div>
        <div class="absolute inset-0 h-16 w-16 rounded-full bg-green-500/10 animate-pulse"></div>
        
        <!-- Icon container -->
        <div class="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-green-500 text-white shadow-lg">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
      </div>
    </div>

    <!-- Title and recap -->
    <div class="space-y-2">
      <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!</h1>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Reference ID: <span class="text-slate-700 font-black">{{ $orderId }}</span></p>
    </div>

    <!-- Detail table recap -->
    @if($order)
      <div class="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-left text-xs bg-slate-50/20">
        <!-- Billing Recap -->
        <div class="p-4 space-y-2 bg-white">
          <p class="font-bold text-slate-800 text-sm">Shipping Information</p>
          <div class="text-slate-500 space-y-1 font-semibold">
            <p>Name: <span class="text-slate-700">{{ $order->customer_name }}</span></p>
            <p>Phone: <span class="text-slate-700">{{ $order->phone }}</span></p>
            <p>Address: <span class="text-slate-700">{{ $order->address }}</span></p>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-4 space-y-2">
          <p class="font-bold text-slate-800">Purchased Items</p>
          <div class="divide-y divide-slate-200/50">
            @foreach($order->items as $item)
              <div class="flex justify-between py-2 text-slate-655 font-semibold">
                <span>{{ $item->product_name }} {{ $item->variant_name ? " - " . $item->variant_name : "" }} x {{ $item->quantity }}</span>
                <span class="text-slate-900 font-bold">{{ number_format($item->total) }} Tk</span>
              </div>
            @endforeach
          </div>
        </div>

        <!-- Prices -->
        <div class="p-4 space-y-2 bg-white font-semibold">
          <div class="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span class="text-slate-800">{{ number_format($order->subtotal) }} Tk</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>Delivery Fee</span>
            <span class="text-slate-800">{{ number_format($order->delivery_fee) }} Tk</span>
          </div>
          @if($order->discount > 0)
            <div class="flex justify-between text-red-500 font-bold">
              <span>Discount</span>
              <span>-{{ number_format($order->discount) }} Tk</span>
            </div>
          @endif
          <div class="flex justify-between text-slate-900 font-extrabold text-sm border-t border-slate-100 pt-2">
            <span>Total Paid</span>
            <span class="text-red-600 font-black text-base">{{ number_format($order->total) }} Tk</span>
          </div>
        </div>
      </div>
    @endif

    <div class="pt-2">
      <a href="/" class="inline-flex h-12 w-full items-center justify-center bg-black hover:bg-black/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm">
        Go Back Home
      </a>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
  window.addEventListener('DOMContentLoaded', () => {
    // 1. Clear cart
    clearCart();

    // 2. Trigger GTM/Meta Pixel Purchase Event Tracking
    const orderId = "{{ $orderId }}";
    const total = {{ $order ? $order->total : 0 }};
    
    const trackKey = `purchase_tracked_${orderId}`;
    const alreadyTracked = localStorage.getItem(trackKey);

    const pendingOrderStr = localStorage.getItem("cb_pending_order");
    
    if (pendingOrderStr && !alreadyTracked) {
      try {
        const pendingOrder = JSON.parse(pendingOrderStr);
        localStorage.setItem(trackKey, "true");

        // Format phone to E.164 for advanced matching
        const formatPhoneE164 = (p) => {
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

        // Track purchase via centralized analytics helper (dataLayer & Meta Pixel)
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
          items: pendingOrder.items.map(item => ({
            item_id: item.productId,
            item_name: item.name,
            item_brand: "CanvasBag",
            item_variant: item.variantName || "Standard",
            price: item.price,
            quantity: item.quantity,
          })),
        });
      } catch (e) {
        console.error("Failed to parse pending order for purchase tracking:", e);
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
    }
  });
</script>
@endsection
