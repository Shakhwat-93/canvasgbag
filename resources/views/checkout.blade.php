@extends('layouts.app')

@section('title', 'Checkout COD | CanvasBag')

@section('content')
<div class="bg-[#F8FAFC] min-h-screen text-slate-800 pb-16">
  <!-- Title / Header -->
  <div class="bg-white border-b border-slate-100 py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">Checkout Order</h1>
      <p class="text-xs text-slate-400 font-bold tracking-widest mt-1">Cash on Delivery Bangladesh</p>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Empty Cart Warning -->
    <div id="checkout-empty-state" class="hidden flex-col items-center justify-center py-20 text-center space-y-4 bg-white border border-slate-200/60 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
      <div class="grid h-16 w-16 place-items-center rounded-full bg-slate-50 border border-slate-100">
        <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1,0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0,1-1.12-1.243l1.264-12A1.125 1.125 0 0,1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Zm7.5 0a.375.375 0 1,1-.75 0 .375.375 0 0,1 .75 0Z"/></svg>
      </div>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-slate-800">Your cart is empty</h3>
        <p class="text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
      </div>
      <a href="/shop" class="bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md">
        Go to Shop
      </a>
    </div>

    <!-- Active Checkout Form Layout -->
    <div id="checkout-form-container" class="hidden">
      <form action="/checkout" method="POST" onsubmit="handleCheckoutSubmit(event)">
        @csrf
        <!-- Hidden input holding JSON cart items string -->
        <input type="hidden" name="items" id="checkout-hidden-items-val" />

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 sm:gap-8 items-start">
          
          <!-- Left Column: Shipping Details -->
          <div class="w-full flex flex-col gap-6">
            <section class="rounded-3xl border border-slate-200/60 bg-white p-5 sm:p-8 shadow-sm">
              <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider mb-4">Billing & Shipping</h2>
              
              @if ($errors->any())
                <div class="mb-6 flex flex-col gap-1 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
                  @foreach ($errors->all() as $error)
                    <p>⚠️ {{ $error }}</p>
                  @endforeach
                </div>
              @endif

              <div class="grid gap-5">
                <div class="grid gap-2">
                  <label htmlFor="name" class="text-xs font-bold text-slate-600">আপনার নাম লিখুন <span class="text-red-500">*</span></label>
                  <input type="text" id="name" name="name" required placeholder="e.g. Hasan Mahmud" class="rounded-xl h-11 px-4 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-slate-50/25" />
                </div>
                <div class="grid gap-2">
                  <label htmlFor="address" class="text-xs font-bold text-slate-600">আপনার ঠিকানা এলাকা, থানা, জেলা লিখুন <span class="text-red-500">*</span></label>
                  <input type="text" id="address" name="address" required placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka" class="rounded-xl h-11 px-4 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-slate-50/25" />
                </div>
                <div class="grid gap-2">
                  <label htmlFor="phone" class="text-xs font-bold text-slate-600">মোবাইল নাম্বার <span class="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    pattern="01[0-9]{9}"
                    maxlength="11"
                    minlength="11"
                    placeholder="01XXXXXXXXX"
                    title="মোবাইল নাম্বারটি অবশ্যই ১১ ডিজিটের হতে হবে এবং ০১ দিয়ে শুরু হতে হবে (যেমন: 01712345678)"
                    class="rounded-xl h-11 px-4 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-slate-50/25"
                  />
                </div>
                <div class="grid gap-2">
                  <label htmlFor="note" class="text-xs font-bold text-slate-600">অর্ডার নোট (অপশনাল)</label>
                  <textarea id="note" name="note" placeholder="Write any specific delivery instructions here..." rows="3" class="rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-slate-50/25"></textarea>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Summary & Place Order -->
          <aside class="w-full h-fit rounded-3xl border border-slate-200/60 bg-slate-50/50 p-4 sm:p-6 shadow-sm">
            <h2 class="font-bold text-slate-850 text-sm uppercase tracking-wider border-b border-slate-200/60 pb-3">Your Order</h2>
            
            <!-- Items summary list -->
            <div id="checkout-summary-items" class="divide-y divide-slate-200/40 max-h-60 overflow-y-auto pr-1">
              <!-- Dynamically populated by Javascript -->
            </div>

            <!-- Subtotal, Shipping Zone, Total -->
            <div class="mt-4 space-y-4">
              <div class="flex justify-between items-center py-2.5 px-3.5 bg-white rounded-2xl border border-slate-150 shadow-xs">
                <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Cart Subtotal</span>
                <span id="checkout-subtotal-val" class="font-black text-slate-850 text-sm">0 Tk</span>
              </div>

              <!-- Shipping zone selector radios -->
              <div class="grid gap-2.5 py-1">
                <!-- Inside Dhaka -->
                <label id="shipping-label-inside" class="flex items-center justify-between p-3.5 rounded-xl border border-[var(--primary)] bg-white ring-1 ring-[var(--primary)] shadow-sm cursor-pointer select-none transition-all">
                  <div class="text-xs font-bold text-slate-650 flex flex-col">
                    <span>ঢাকার ভিতরে</span>
                    <span class="text-[var(--primary)] font-black text-sm mt-0.5"><span id="shipping-rate-inside-val">0</span> Tk</span>
                  </div>
                  <input
                    type="radio"
                    name="shipping_zone"
                    value="Inside dhaka"
                    checked
                    onchange="changeShippingZone('Inside dhaka')"
                    class="h-4.5 w-4.5 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </label>

                <!-- Outside Dhaka -->
                <label id="shipping-label-outside" class="flex items-center justify-between p-3.5 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100/35 cursor-pointer select-none transition-all">
                  <div class="text-xs font-bold text-slate-650 flex flex-col">
                    <span>ঢাকার বাইরে</span>
                    <span class="text-[var(--primary)] font-black text-sm mt-0.5"><span id="shipping-rate-outside-val">0</span> Tk</span>
                  </div>
                  <input
                    type="radio"
                    name="shipping_zone"
                    value="Outside dhaka"
                    onchange="changeShippingZone('Outside dhaka')"
                    class="h-4.5 w-4.5 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </label>
              </div>

              <!-- Discount row -->
              <div id="checkout-discount-row" class="hidden flex justify-between items-center py-2 px-3 bg-red-50/50 rounded-xl border border-red-100 text-xs font-bold text-red-600 uppercase tracking-wider">
                <span>Discount (Tk 3,200+ Order)</span>
                <span class="font-black text-sm">-250 Tk</span>
              </div>

              <!-- Total row -->
              <div class="flex justify-between items-center py-3.5 px-4 bg-white rounded-2xl border-2 border-red-200 shadow-xs">
                <span class="text-sm font-black text-slate-800 uppercase tracking-wide">Total Amount</span>
                <span id="checkout-total-val" class="text-xl sm:text-2xl font-black text-red-650 tracking-tight bg-red-50/80 px-4 py-1.5 rounded-xl border border-red-200 shadow-inner min-w-[120px] text-center">0 Tk</span>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                id="checkout-submit-btn"
                class="mt-2 h-12 w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4 fill-current animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Confirm Order (ক্যাশ অন ডেলিভারি)
              </button>

              <!-- Trust / Support details -->
              <p class="text-[10px] font-bold text-slate-400 text-center mt-3 leading-normal">
                📞 Help / Support: <a href="tel:01942212267" class="text-slate-600 hover:underline">01942-212267</a>
              </p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
  let checkoutCartItems = [];
  let checkoutShippingZone = "Inside dhaka";
  let shippingInsideFee = {{ $settings['shippingInsideDhaka'] ?? 60 }};
  let shippingOutsideFee = {{ $settings['shippingOutsideDhaka'] ?? 130 }};

  window.addEventListener('DOMContentLoaded', () => {
    // Populate rates in UI labels
    document.getElementById("shipping-rate-inside-val").textContent = shippingInsideFee;
    document.getElementById("shipping-rate-outside-val").textContent = shippingOutsideFee;

    initializeCheckout();
  });

  function initializeCheckout() {
    checkoutCartItems = getCartItems();

    if (checkoutCartItems.length === 0) {
      document.getElementById("checkout-empty-state").classList.remove("hidden");
      document.getElementById("checkout-form-container").classList.add("hidden");
    } else {
      document.getElementById("checkout-empty-state").classList.add("hidden");
      document.getElementById("checkout-form-container").classList.remove("hidden");

      // Bind hidden input items string
      document.getElementById("checkout-hidden-items-val").value = JSON.stringify(checkoutCartItems);

      // Render summary items
      renderSummaryList();
      recalculateCheckout();

      // Trigger GTM/Meta Pixel begin_checkout analytics event
      fireBeginCheckoutEvent();
    }
  }

  function renderSummaryList() {
    const listEl = document.getElementById("checkout-summary-items");
    if (!listEl) return;

    listEl.innerHTML = checkoutCartItems.map((item) => `
      <div class="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 relative">
        <img src="${item.image}" alt="${item.name}" class="h-14 w-14 rounded-xl object-cover shrink-0 border border-slate-200 bg-white shadow-xs" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900 leading-snug text-left" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.name}</p>
          <p class="text-xs text-slate-505 font-bold mt-1.5 text-left flex items-center gap-1.5">
            <span>${item.variantName ? `${item.variantName}` : "Standard"}</span>
          </p>
          <!-- Quantity Adjuster -->
          <div class="flex items-center gap-1 border border-slate-200 rounded-lg bg-slate-50 p-0.5 mt-2 w-fit">
            <button type="button" onclick="updateQuantity('${item.productId}', '${item.variantId}', ${item.quantity - 1})" class="h-5.5 w-5.5 rounded-md bg-white flex items-center justify-center font-extrabold text-slate-700 hover:bg-slate-100 text-xs shadow-xs cursor-pointer select-none">-</button>
            <span class="text-xs font-black text-slate-900 w-5 text-center select-none">${item.quantity}</span>
            <button type="button" onclick="updateQuantity('${item.productId}', '${item.variantId}', ${item.quantity + 1})" class="h-5.5 w-5.5 rounded-md bg-white flex items-center justify-center font-extrabold text-slate-700 hover:bg-slate-100 text-xs shadow-xs cursor-pointer select-none">+</button>
          </div>
        </div>
        <!-- Price and Remove Button -->
        <div class="flex flex-col items-end justify-between self-stretch shrink-0">
          <button type="button" onclick="removeItem('${item.productId}', '${item.variantId}')" class="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors" title="Remove item">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
          <span class="font-black text-sm text-slate-950 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">${item.price * item.quantity} Tk</span>
        </div>
      </div>
    `).join("");
  }

  function recalculateCheckout() {
    let subtotal = 0;
    let totalQty = 0;

    checkoutCartItems.forEach(item => {
      subtotal += item.price * item.quantity;
      totalQty += item.quantity;
    });

    // Subtotal >= 3200 gets 250 discount
    const discount = subtotal >= 3200 ? 250 : 0;
    
    // Subtotal >= 2500 gets free shipping
    let shippingFee = 0;
    if (subtotal < 2500) {
      shippingFee = (checkoutShippingZone === "Inside dhaka") ? shippingInsideFee : shippingOutsideFee;
    }

    const total = Math.max((subtotal + shippingFee) - discount, 0);

    // Update UI
    document.getElementById("checkout-subtotal-val").textContent = `${subtotal} Tk`;
    document.getElementById("checkout-total-val").textContent = `${total} Tk`;

    const discountRow = document.getElementById("checkout-discount-row");
    if (discount > 0) {
      discountRow.classList.remove("hidden");
    } else {
      discountRow.classList.add("hidden");
    }
  }

  function changeShippingZone(zone) {
    checkoutShippingZone = zone;

    const labelInside = document.getElementById("shipping-label-inside");
    const labelOutside = document.getElementById("shipping-label-outside");

    if (zone === "Inside dhaka") {
      labelInside.className = "flex items-center justify-between p-3 rounded-xl border border-[var(--primary)] bg-white ring-1 ring-[var(--primary)] shadow-sm cursor-pointer select-none transition-all";
      labelOutside.className = "flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100/35 cursor-pointer select-none transition-all";
    } else {
      labelOutside.className = "flex items-center justify-between p-3 rounded-xl border border-[var(--primary)] bg-white ring-1 ring-[var(--primary)] shadow-sm cursor-pointer select-none transition-all";
      labelInside.className = "flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100/35 cursor-pointer select-none transition-all";
    }

    recalculateCheckout();

    // Trigger add_shipping_info analytics
    fireAddShippingInfoEvent();
  }

  function fireBeginCheckoutEvent() {
    let subtotal = checkoutCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    trackEvent("begin_checkout", {
      value: subtotal,
      items: checkoutCartItems.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        item_brand: "CanvasBag",
        item_variant: item.variantName || "Standard",
        price: item.price,
        quantity: item.quantity
      }))
    });
  }

  function fireAddShippingInfoEvent() {
    let subtotal = checkoutCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingZoneName = (checkoutShippingZone === "Inside dhaka") ? "Inside Dhaka" : "Outside Dhaka";
    trackEvent("add_shipping_info", {
      value: subtotal,
      shipping_zone: shippingZoneName,
      items: checkoutCartItems.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        item_brand: "CanvasBag",
        item_variant: item.variantName || "Standard",
        price: item.price,
        quantity: item.quantity
      }))
    });
  }

  function handleCheckoutSubmit(event) {
    const items = getCartItems();
    if (items.length === 0) {
      event.preventDefault();
      showToast("Order Failed", "Your cart is empty. Please add items.");
      return;
    }

    const phone = document.getElementById("phone").value.trim();
    const phoneRegexBD = /^01[0-9]{9}$/;
    if (!phoneRegexBD.test(phone)) {
      event.preventDefault();
      showToast("ভুল মোবাইল নাম্বার", "মোবাইল নাম্বারটি অবশ্যই ০১ দিয়ে শুরু হওয়া ১১ ডিজিটের নাম্বার হতে হবে (যেমন: 01712345678)।");
      return;
    }

    // Disable button to prevent double clicks
    const submitBtn = document.getElementById("checkout-submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      Processing...
    `;

    // Save pending order details to localStorage for GA4/Meta Pixel attribution on success page redirect
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const note = document.getElementById("note").value;
    
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    const discount = subtotal >= 3200 ? 250 : 0;
    let deliveryFee = 0;
    if (subtotal < 2500) {
      deliveryFee = (checkoutShippingZone === "Inside dhaka") ? shippingInsideFee : shippingOutsideFee;
    }
    const total = Math.max((subtotal + deliveryFee) - discount, 0);

    const pendingOrder = {
      name: name,
      phone: phone,
      address: address,
      note: note,
      shippingZone: (checkoutShippingZone === "Inside dhaka") ? "Inside Dhaka" : "Outside Dhaka",
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      items: items
    };

    localStorage.setItem("cb_pending_order", JSON.stringify(pendingOrder));

    // Cart details are submitted in hidden form elements. Allow form submission.
  }
</script>
@endsection
