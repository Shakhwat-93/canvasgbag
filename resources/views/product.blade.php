@extends('layouts.app')

@section('title', ($product['name'] ?? 'Product') . ' | CanvasBag')

@section('content')
<div class="bg-[#F8FAFC] min-h-screen text-slate-800 pb-16">
  <!-- Breadcrumb section -->
  <div class="bg-white border-b border-slate-100 py-3">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-xs font-bold text-slate-400 flex items-center gap-1.5 flex-wrap">
      <a href="/" class="hover:text-[var(--primary)] transition-colors">Home</a>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      <a href="/category/{{ $product['categorySlug'] ?? $product['category_slug'] ?? 'everyday-totes' }}" class="hover:text-[var(--primary)] transition-colors lowercase">{{ $product['categoryName'] ?? 'Category' }}</a>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      <span class="text-slate-600 truncate">{{ $product['name'] }}</span>
    </div>
  </div>

  <!-- Main product overview -->
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_0.9fr] gap-8 items-start bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/60 shadow-sm">
      
      <!-- Column 1: Image Gallery -->
      <div class="space-y-4">
        <!-- Main Image -->
        <div class="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center group shadow-sm">
          <img
            id="main-product-image"
            src="{{ $product['images'][0]['url'] ?? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop' }}"
            alt="{{ $product['images'][0]['alt'] ?? $product['name'] }}"
            class="absolute inset-0 h-full w-full object-cover"
          />
          @php
            $compareAtPrice = $product['compareAtPrice'] ?? $product['compare_at_price'] ?? 0;
            $price = $product['price'] ?? 0;
            $discountPercent = ($compareAtPrice > $price) ? round((($compareAtPrice - $price) / $compareAtPrice) * 100) : 0;
          @endphp
          
          <div id="discount-badge" class="{{ $discountPercent > 0 ? '' : 'hidden' }} absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md animate-pulse">
            <span id="discount-percent-text">{{ $discountPercent }}</span>% ছাড়
          </div>
        </div>

        <!-- Thumbnails list -->
        @if(!empty($product['images']) && count($product['images']) > 1)
          <div class="flex gap-2 items-center overflow-x-auto py-1 no-scrollbar justify-center">
            @foreach($product['images'] as $idx => $img)
              <button
                type="button"
                onclick="selectGalleryImage({{ $idx }})"
                class="gallery-thumbnail-btn relative w-14 h-14 rounded-lg bg-slate-50 border overflow-hidden shrink-0 transition-all cursor-pointer {{ $idx === 0 ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 scale-[0.98]' : 'border-slate-200 hover:border-slate-400' }}"
                data-index="{{ $idx }}"
              >
                <img
                  src="{{ $img['url'] }}"
                  alt="{{ $img['alt'] ?? '' }}"
                  class="absolute inset-0 h-full w-full object-cover"
                />
              </button>
            @endforeach
          </div>
        @endif
      </div>

      <!-- Column 2: Product purchasing details -->
      <div class="space-y-6">
        <div class="space-y-2">
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {{ $product['name'] }}
          </h1>
          
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <span>Category:</span>
            <a href="/category/{{ $product['categorySlug'] ?? $product['category_slug'] ?? 'everyday-totes' }}" class="text-[var(--primary)] hover:underline lowercase font-extrabold">
              {{ $product['categoryName'] ?? 'Category' }}
            </a>
          </div>

          <!-- Pricing row with discount pill -->
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <span id="compare-price-container" class="{{ $compareAtPrice > $price ? '' : 'hidden' }} text-sm font-semibold text-slate-400 line-through">
              <span id="compare-price-val">{{ number_format($compareAtPrice) }}</span> ৳
            </span>
            <span class="text-xl sm:text-2xl font-black text-slate-900">
              <span id="active-price-val">{{ number_format($price) }}</span> ৳
            </span>
            <span id="discount-pill" class="{{ $discountPercent > 0 ? '' : 'hidden' }} bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-sm">
              <span id="discount-pill-text">{{ $discountPercent }}</span>% OFF
            </span>
          </div>
        </div>

        <!-- Benefits/Specs Overview -->
        <div class="border-t border-slate-100 pt-5 space-y-3">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">🔸 প্রোডাক্টের বৈশিষ্ট্য:</p>
          <div class="space-y-2">
            @if(!empty($product['benefits']))
              @foreach(array_slice($product['benefits'], 0, 3) as $benefit)
                <div class="flex items-start gap-2.5 text-sm font-semibold text-slate-800 leading-relaxed">
                  <span class="w-4.5 h-4.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <svg class="w-2.5 h-2.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </span>
                  <span>{{ $benefit }}</span>
                </div>
              @endforeach
            @endif
          </div>
          <button onclick="scrollToDetails()" class="text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer">
            বিস্তারিত
          </button>
        </div>

        <!-- Variants Color Panel -->
        @if(!empty($product['variants']) && count($product['variants']) > 1)
          <div class="space-y-3 border-t border-slate-100 pt-5">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Color</p>
            <div class="flex flex-wrap gap-2">
              @foreach($product['variants'] as $idx => $v)
                @php
                  $isFirst = ($idx === 0);
                @endphp
                <button
                  type="button"
                  onclick="selectVariant({{ $idx }}, '{{ $v['id'] }}')"
                  class="variant-select-btn flex h-11 items-center gap-2.5 rounded-full border px-4.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer {{ $isFirst ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] ring-1 ring-[var(--primary)]' : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white shadow-sm' }}"
                  data-variant-id="{{ $v['id'] }}"
                  data-index="{{ $idx }}"
                >
                  <span
                    class="h-3.5 w-3.5 rounded-full border border-slate-200 shadow-sm shrink-0"
                    style="background-color: {{ $v['colorCode'] ?? $v['color_code'] ?? '#cbd5e1' }}"
                  ></span>
                  <span>{{ $v['name'] }}</span>
                  <svg class="v-check-icon h-3.5 w-3.5 text-[var(--primary)] shrink-0 {{ $isFirst ? '' : 'hidden' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </button>
              @endforeach
            </div>
          </div>
        @endif

        <!-- Qty & Action buttons -->
        <div class="space-y-3.5 pt-4 border-t border-slate-100">
          <div class="flex gap-3.5 w-full items-center">
            <!-- Qty selector -->
            <div class="flex items-center border border-slate-200/80 rounded-full h-12 bg-slate-50/50 w-[110px] sm:w-28 shrink-0 justify-between px-1 shadow-sm">
              <button onclick="decrementQty()" type="button" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/50 font-bold text-base transition-colors cursor-pointer text-slate-500 active:scale-90">-</button>
              <span id="product-qty-badge" class="font-bold text-sm text-slate-800">1</span>
              <button onclick="incrementQty()" type="button" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/50 font-bold text-base transition-colors cursor-pointer text-slate-500 active:scale-90">+</button>
            </div>

            <!-- Add to cart -->
            <button
              id="btn-add-to-cart"
              onclick="triggerAddToCart()"
              type="button"
              class="flex-1 h-12 bg-[#1E293B] hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span id="add-to-cart-text">ADD TO CART</span>
            </button>

            <!-- Buy Now (Desktop only inside grid) -->
            <button
              id="btn-buy-now"
              onclick="triggerBuyNow()"
              type="button"
              class="hidden sm:flex flex-1 h-12 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 font-black text-xs uppercase tracking-wider rounded-full items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-primary/15"
            >
              <svg class="w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span id="buy-now-text">BUY NOW</span>
            </button>
          </div>

          <!-- Row 2: Buy Now (Mobile only) -->
          <button
            id="btn-buy-now-mobile"
            onclick="triggerBuyNow()"
            type="button"
            class="flex sm:hidden w-full h-12 bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 font-black text-xs uppercase tracking-wider rounded-full items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-primary/15"
          >
            <svg class="w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span id="buy-now-mobile-text">BUY NOW</span>
          </button>
        </div>
      </div>

      <!-- Column 3: Trust Panel / Delivery details -->
      <div class="space-y-4">
        <div class="relative aspect-video rounded-xl bg-slate-900 border border-white/5 overflow-hidden flex flex-col items-center justify-center shadow-sm">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center text-center p-3">
            <span class="w-10 h-10 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer">
              <svg class="w-4.5 h-4.5 fill-current" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </span>
            <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2.5">Original Quality</span>
            <p class="text-[9px] text-slate-400 mt-1">100% genuine canvas travel & workout carrier bags</p>
          </div>
        </div>

        <div class="border-2 border-dashed border-slate-200/80 bg-slate-50/50 p-5 rounded-2xl space-y-4 text-xs font-semibold text-slate-700 leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
          <div class="space-y-1">
            <p class="text-slate-900 font-bold text-sm flex items-center gap-1.5">🛵 ডেলিভারি চার্জ:</p>
            <p class="text-xs pl-6 text-slate-700 font-medium leading-normal">ঢাকার মধ্যে {{ $settings['shippingInsideDhaka'] ?? 60 }} টাকা, ঢাকার বাইরে {{ $settings['shippingOutsideDhaka'] ?? 130 }} টাকা!</p>
          </div>
          <div class="space-y-1">
            <p class="text-slate-900 font-bold text-sm flex items-center gap-1.5">💵 সম্পূর্ণ ক্যাশ অন ডেলিভারি:</p>
            <p class="text-xs pl-6 text-slate-700 font-medium leading-normal">অর্ডার করতে অগ্রিম ১ টাকাও দিতে হবেনা, পণ্য রিসিভ করার সময় টাকা পরিশোধ করবেন!</p>
          </div>
          <div class="space-y-1">
            <p class="text-slate-900 font-bold text-sm flex items-center gap-1.5">🔎 প্রোডাক্ট চেক করে নেওয়ার সুযোগ:</p>
            <p class="text-xs pl-6 text-slate-700 font-medium leading-normal">ডেলিভারি ম্যানের সামনে পণ্য ভালোভাবে দেখে তারপর রিসিভ করতে পারবেন।</p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Description tabs block -->
  <div id="details-tabs" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
      <!-- Tab Headers -->
      <div class="flex border-b border-slate-100 bg-slate-50/50">
        <button
          onclick="switchTab('description')"
          id="tab-btn-description"
          class="px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 border-[var(--primary)] text-[var(--primary)] transition-all cursor-pointer"
        >
          Product Description
        </button>
        <button
          onclick="switchTab('specs')"
          id="tab-btn-specs"
          class="px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
        >
          Specifications
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Description Content -->
        <div id="tab-content-description" class="space-y-6">
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-slate-900">{{ $product['name'] }} - এর ব্যবহার ও কার্যকারিতা</h3>
            <p class="text-sm leading-relaxed text-slate-700 font-semibold">
              {{ $product['story'] ?? '' }}
            </p>
          </div>

          <div class="space-y-3.5 border-t border-slate-100 pt-6">
            <h4 class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <span>🔸</span> প্রোডাক্টের বৈশিষ্ট্য:
            </h4>
            <div class="grid gap-2.5 sm:grid-cols-2">
              @if(!empty($product['benefits']))
                @foreach($product['benefits'] as $benefit)
                  <div class="flex items-start gap-2.5 text-sm font-semibold text-slate-800 leading-relaxed">
                    <span class="w-4.5 h-4.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-2.5 h-2.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    </span>
                    <span>{{ $benefit }}</span>
                  </div>
                @endforeach
              @endif
            </div>
          </div>
        </div>

        <!-- Specifications Content -->
        <div id="tab-content-specs" class="space-y-6 hidden">
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-slate-900">প্রোডাক্টের টেকনিক্যাল স্পেসিফিকেশন</h3>
            <p class="text-sm text-slate-600 font-semibold">ভ্রমণ ও দৈনন্দিন ব্যবহারের জন্য সঠিক ও নিখুঁত পরিমাপসমূহ</p>
          </div>

          <div class="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 max-w-xl text-sm">
            @if(!empty($product['specs']))
              @foreach($product['specs'] as $idx => $spec)
                <div class="grid grid-cols-[120px_1fr] gap-4 p-3.5 hover:bg-slate-50 transition-colors">
                  <span class="font-bold text-slate-400 uppercase tracking-wider">Spec {{ $idx + 1 }}</span>
                  <span class="font-semibold text-slate-700">{{ $spec }}</span>
                </div>
              @endforeach
            @endif
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Related Products -->
  @if(!empty($related))
    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-8">
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-6 bg-[var(--primary)] rounded-sm transition-colors duration-300" />
          <h2 class="text-lg md:text-xl font-black text-slate-900">সর্বাধিক জনপ্রিয় পণ্য</h2>
        </div>
        <a href="/shop" class="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">View All</a>
      </div>

      <div class="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        @foreach($related as $item)
          @include('components.product-card', ['product' => $item])
        @endforeach
      </div>
    </section>
  @endif
</div>
@endsection

@section('scripts')
<script>
  // Dynamic Product details parsed to Javascript
  const productData = @json($product);
  
  // Local state variables
  let activeImageIdx = 0;
  let activeQty = 1;
  let selectedVariantIndex = 0;
  let activeVariant = productData.variants && productData.variants.length > 0 ? productData.variants[0] : null;

  // Initialize view_item GTM/Meta Pixel event
  window.addEventListener('DOMContentLoaded', () => {
    fireViewItemEvent();
    updateStockUI();
  });

  function fireViewItemEvent() {
    trackEvent("view_item", {
      value: productData.price,
      items: [{
        item_id: productData.id,
        item_name: productData.name,
        item_brand: "CanvasBag",
        item_category: productData.categoryName || productData.categorySlug || "",
        item_variant: activeVariant ? activeVariant.name : "Standard",
        price: productData.price,
        quantity: 1
      }]
    });
  }

  // Gallery view controls
  function selectGalleryImage(idx) {
    activeImageIdx = idx;
    const imgUrl = productData.images[idx]?.url;
    
    // Update main image src
    document.getElementById("main-product-image").src = imgUrl;

    // Remove active styles on all thumbnails, add to selected one
    const thumbnails = document.querySelectorAll(".gallery-thumbnail-btn");
    thumbnails.forEach(t => {
      const tIdx = parseInt(t.getAttribute("data-index"), 10);
      if (tIdx === idx) {
        t.className = "gallery-thumbnail-btn relative w-14 h-14 rounded-lg bg-slate-50 border overflow-hidden shrink-0 transition-all cursor-pointer border-[var(--primary)] ring-2 ring-[var(--primary)]/20 scale-[0.98]";
      } else {
        t.className = "gallery-thumbnail-btn relative w-14 h-14 rounded-lg bg-slate-50 border overflow-hidden shrink-0 transition-all cursor-pointer border-slate-200 hover:border-slate-400";
      }
    });

    // Check if image matches a variant image, and auto-select that variant
    if (productData.variants && productData.variants.length > 0) {
      const matchIdx = productData.variants.findIndex(v => v.image === imgUrl);
      if (matchIdx !== -1 && matchIdx !== selectedVariantIndex) {
        selectVariant(matchIdx, productData.variants[matchIdx].id, false);
      }
    }
  }

  // Variant select controls
  function selectVariant(idx, variantId, syncGallery = true) {
    selectedVariantIndex = idx;
    activeVariant = productData.variants[idx];

    // Update buttons UI
    const variantButtons = document.querySelectorAll(".variant-select-btn");
    variantButtons.forEach(btn => {
      const bIdx = parseInt(btn.getAttribute("data-index"), 10);
      const checkIcon = btn.querySelector(".v-check-icon");
      if (bIdx === idx) {
        btn.className = "variant-select-btn flex h-11 items-center gap-2.5 rounded-full border px-4.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] ring-1 ring-[var(--primary)]";
        if (checkIcon) checkIcon.classList.remove("hidden");
      } else {
        btn.className = "variant-select-btn flex h-11 items-center gap-2.5 rounded-full border px-4.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer border-slate-200 hover:border-slate-350 text-slate-700 bg-white shadow-sm";
        if (checkIcon) checkIcon.classList.add("hidden");
      }
    });

    // Sync main gallery image
    if (syncGallery && activeVariant && activeVariant.image) {
      const imgIdx = productData.images.findIndex(img => img.url === activeVariant.image);
      if (imgIdx !== -1) {
        selectGalleryImage(imgIdx);
      }
    }

    updateStockUI();
    fireViewItemEvent(); // Fire view event for variant change
  }

  // Stock status checks
  function updateStockUI() {
    const isOutOfStock = activeVariant && !activeVariant.inStock && !activeVariant.in_stock;

    const btnAdd = document.getElementById("btn-add-to-cart");
    const btnBuy = document.getElementById("btn-buy-now");
    const btnBuyMobile = document.getElementById("btn-buy-now-mobile");

    if (isOutOfStock) {
      document.getElementById("add-to-cart-text").textContent = "STOCK OUT";
      document.getElementById("buy-now-text").textContent = "STOCK OUT";
      document.getElementById("buy-now-mobile-text").textContent = "STOCK OUT";
      
      [btnAdd, btnBuy, btnBuyMobile].forEach(btn => {
        if(btn) btn.disabled = true;
      });
    } else {
      document.getElementById("add-to-cart-text").textContent = "ADD TO CART";
      document.getElementById("buy-now-text").textContent = "BUY NOW";
      document.getElementById("buy-now-mobile-text").textContent = "BUY NOW";
      
      [btnAdd, btnBuy, btnBuyMobile].forEach(btn => {
        if(btn) btn.disabled = false;
      });
    }
  }

  // Quantity controllers
  function incrementQty() {
    if (activeQty < 10) {
      activeQty++;
      document.getElementById("product-qty-badge").textContent = activeQty;
    }
  }

  function decrementQty() {
    if (activeQty > 1) {
      activeQty--;
      document.getElementById("product-qty-badge").textContent = activeQty;
    }
  }

  // Cart operations hooks
  function triggerAddToCart() {
    addItem({
      productId: productData.id,
      slug: productData.slug,
      name: productData.name,
      image: (activeVariant && activeVariant.image) ? activeVariant.image : (productData.images[0]?.url || ""),
      price: productData.price,
      variantId: activeVariant ? activeVariant.id : 'standard',
      variantName: activeVariant ? activeVariant.name : 'Standard',
      quantity: activeQty
    });
  }

  function triggerBuyNow() {
    addItem({
      productId: productData.id,
      slug: productData.slug,
      name: productData.name,
      image: (activeVariant && activeVariant.image) ? activeVariant.image : (productData.images[0]?.url || ""),
      price: productData.price,
      variantId: activeVariant ? activeVariant.id : 'standard',
      variantName: activeVariant ? activeVariant.name : 'Standard',
      quantity: activeQty
    });
    window.location.href = "/checkout";
  }

  // Description specs tabs toggles
  function switchTab(tab) {
    const descBtn = document.getElementById("tab-btn-description");
    const specsBtn = document.getElementById("tab-btn-specs");
    const descContent = document.getElementById("tab-content-description");
    const specsContent = document.getElementById("tab-content-specs");

    if (tab === 'description') {
      descBtn.className = "px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 border-[var(--primary)] text-[var(--primary)] transition-all cursor-pointer";
      specsBtn.className = "px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-650 transition-all cursor-pointer";
      
      descContent.classList.remove("hidden");
      specsContent.classList.add("hidden");
    } else {
      specsBtn.className = "px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 border-[var(--primary)] text-[var(--primary)] transition-all cursor-pointer";
      descBtn.className = "px-6 py-4.5 text-xs font-black uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-650 transition-all cursor-pointer";
      
      specsContent.classList.remove("hidden");
      descContent.classList.add("hidden");
    }
  }

  function scrollToDetails() {
    const target = document.getElementById("details-tabs");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>
@endsection
