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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start bg-white p-4 sm:p-8 rounded-3xl border border-slate-200/60 shadow-sm">
      
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

          <!-- Slider Arrow Controls -->
          @if(!empty($product['images']) && count($product['images']) > 1)
            <button type="button" onclick="prevGalleryImage()" class="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center shadow-md text-slate-700 hover:text-slate-900 transition-all select-none cursor-pointer z-10">
              <svg class="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
            </button>
            <button type="button" onclick="nextGalleryImage()" class="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center shadow-md text-slate-700 hover:text-slate-900 transition-all select-none cursor-pointer z-10">
              <svg class="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            </button>
          @endif
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
            <!-- Column 2: Product purchasing details -->
      <div class="space-y-6">
        <div class="space-y-3 text-left">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {{ $product['name'] }}
          </h1>

          <!-- Pricing block styled like reference screenshot -->
          <div class="flex items-center gap-3.5 py-1.5 border-y border-slate-100">
            <span id="compare-price-container" class="{{ $compareAtPrice > $price ? '' : 'hidden' }} text-base font-semibold text-slate-400 line-through">
              ৳<span id="compare-price-val">{{ number_format($compareAtPrice) }}</span>
            </span>
            <span class="text-3xl font-bold text-[#f95c32]">
              ৳<span id="active-price-val">{{ number_format($price) }}</span>
            </span>
            <span id="discount-pill" class="{{ $discountPercent > 0 ? '' : 'hidden' }} bg-[#e53935] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              <span id="discount-pill-text">{{ $discountPercent }}</span>% OFF
            </span>
          </div>
        </div>

        <!-- Variants Option Cards selection -->
        @if(!empty($product['variants']) && count($product['variants']) > 1)
          <div class="space-y-2 pt-2 text-left">
            <p class="text-sm font-medium text-slate-900">বাছাই করুন:</p>
            <div class="flex flex-wrap gap-2.5">
              @foreach($product['variants'] as $idx => $v)
                @php
                  $isFirst = ($idx === 0);
                  $vComparePrice = $v['compareAtPrice'] ?? $v['compare_at_price'] ?? $compareAtPrice;
                  $vPrice = $v['price'] ?? $price;
                  $vDiscountPercent = ($vComparePrice > $vPrice) ? round((($vComparePrice - $vPrice) / $vComparePrice) * 100) : 0;
                @endphp
                <button
                  type="button"
                  onclick="selectVariant({{ $idx }}, '{{ $v['id'] }}')"
                  class="variant-select-btn flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-xs {{ $isFirst ? 'border-[#00d056] bg-white text-slate-900 ring-1 ring-[#00d056]' : 'border-slate-200 hover:border-slate-350 text-slate-800 bg-white' }}"
                  data-variant-id="{{ $v['id'] }}"
                  data-index="{{ $idx }}"
                >
                  <span class="text-slate-900">{{ $v['name'] }}</span>
                  @if($vDiscountPercent > 0)
                    <span class="bg-red-50 text-red-650 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                      {{ $vDiscountPercent }}% OFF
                    </span>
                  @endif
                </button>
              @endforeach
            </div>
          </div>
        @endif

        <!-- Qty & Action buttons styled like reference screenshot -->
        <div class="space-y-4 pt-3 border-t border-slate-100">
          <div class="flex flex-col gap-4">
            
            <!-- Quantity selector (Outlined 3-compartment box) -->
            <div class="flex items-center select-none">
              <div class="flex items-center bg-white border border-slate-300 rounded-lg h-9 w-28 overflow-hidden">
                <button onclick="decrementQty()" type="button" class="w-9 h-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50 border-r border-slate-300 transition-colors cursor-pointer active:bg-slate-100 text-lg">-</button>
                <span id="product-qty-badge" class="font-bold text-sm text-slate-900 flex-1 text-center">1</span>
                <button onclick="incrementQty()" type="button" class="w-9 h-full flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50 border-l border-slate-300 transition-colors cursor-pointer active:bg-slate-100 text-lg">+</button>
              </div>
            </div>

            <!-- 2x2 Buttons Grid -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Add to Cart (Outlined) -->
              <button
                id="btn-add-to-cart"
                onclick="triggerAddToCart()"
                type="button"
                class="h-12 border border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                কার্টে যোগ করুন
              </button>

              <!-- Order Now (Solid Orange-Red) -->
              <button
                id="btn-buy-now"
                onclick="triggerBuyNow()"
                type="button"
                class="h-12 bg-[#f95c32] hover:bg-[#e04f27] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <svg class="w-4 h-4 mr-0.5 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span id="buy-now-text">অর্ডার করুন</span>
              </button>

              <!-- Order via WhatsApp -->
              <a
                id="btn-whatsapp-order"
                href="https://wa.me/{{ preg_replace('/\D/', '', $settings['phone'] ?? '01942212267') }}?text={{ rawurlencode('আসসালামু আলাইকুম, আমি এই প্রোডাক্টটি অর্ডার করতে চাই: ' . $product['name'] . ' (দাম: ' . $product['price'] . ' টাকা)') }}"
                target="_blank"
                class="h-12 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <svg class="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.787-1.455L0 24zm6.09-3.921c1.65.981 3.265 1.502 4.908 1.503 5.432.002 9.851-4.42 9.855-9.86.002-2.63-1.019-5.101-2.876-6.96C16.177 2.9 13.702 1.88 11.069 1.88 5.637 1.88 1.219 6.302 1.215 11.741c-.002 1.685.443 3.329 1.292 4.796L1.472 21.09l4.675-1.226z"/></svg>
                হোয়াটসঅ্যাপে অর্ডার করুন
              </a>

              <!-- Direct Call to Order -->
              <a
                href="tel:{{ $settings['phone'] ?? '01942212267' }}"
                class="h-12 border border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                কল অর্ডার: {{ $settings['phone'] ?? '09678812525' }}
              </a>
            </div>
          </div>
        </div>

        <!-- Category Link relocated at bottom -->
        <div class="text-xs font-bold text-slate-500 pt-1 text-left">
          ক্যাটাগরি: <a href="/category/{{ $product['categorySlug'] ?? $product['category_slug'] ?? 'everyday-totes' }}" class="text-slate-800 hover:underline">{{ $product['categoryName'] ?? 'Category' }}</a>
        </div>

        <!-- Trust Guidelines Block -->
        <div class="border border-dashed border-slate-200 bg-slate-50/50 p-4.5 rounded-xl space-y-4 text-xs font-semibold text-slate-700 leading-relaxed text-left">
          <div class="space-y-1">
            <p class="text-slate-900 font-bold text-sm flex items-center gap-1.5">🛵 ডেলিভারি চার্জ:</p>
            <p class="text-xs pl-6 text-slate-750 font-medium leading-normal">ঢাকার মধ্যে {{ $settings['shippingInsideDhaka'] ?? 60 }} টাকা, ঢাকার বাইরে {{ $settings['shippingOutsideDhaka'] ?? 130 }} টাকা!</p>
          </div>
          <div class="space-y-1">
            <p class="text-slate-900 font-bold text-sm flex items-center gap-1.5">💵 সম্পূর্ণ ক্যাশ অন ডেলিভারি:</p>
            <p class="text-xs pl-6 text-slate-750 font-medium leading-normal">অর্ডার করতে অগ্রিম ১ টাকাও দিতে হবেনা, পণ্য রিসিভ করার সময় টাকা পরিশোধ করবেন!</p>
          </div>
          <div class="space-y-1">
            <p class="text-slate-900 font-bold text-sm flex items-center gap-1.5">🔎 প্রোডাক্ট চেক করে নেওয়ার সুযোগ:</p>
            <p class="text-xs pl-6 text-slate-750 font-medium leading-normal">ডেলিভারি ম্যানের সামনে পণ্য ভালোভাবে দেখে তারপর রিসিভ করতে পারবেন।</p>
          </div>
        </div>
      </div>�েওয়ার সুযোগ:</p>
            <p class="text-xs pl-6 text-slate-700 font-medium leading-normal">ডেলিভারি ম্যানের সামনে পণ্য ভালোভাবে দেখে তারপর রিসিভ করতে পারবেন।</p>
          </div>
        </div>
      </div>class="space-y-1">
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
    // Initialize variant details on load
    if (productData.variants && productData.variants.length > 0) {
      selectVariant(0, productData.variants[0].id, false);
    }
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

  function prevGalleryImage() {
    if (!productData.images || productData.images.length <= 1) return;
    let idx = activeImageIdx - 1;
    if (idx < 0) {
      idx = productData.images.length - 1;
    }
    selectGalleryImage(idx);
  }

  function nextGalleryImage() {
    if (!productData.images || productData.images.length <= 1) return;
    let idx = activeImageIdx + 1;
    if (idx >= productData.images.length) {
      idx = 0;
    }
    selectGalleryImage(idx);
  }

  // Variant select controls
  function selectVariant(idx, variantId, syncGallery = true) {
    selectedVariantIndex = idx;
    activeVariant = productData.variants[idx];

    // Update buttons UI
    const variantButtons = document.querySelectorAll(".variant-select-btn");
    variantButtons.forEach(btn => {
      const bIdx = parseInt(btn.getAttribute("data-index"), 10);
      if (bIdx === idx) {
        btn.className = "variant-select-btn flex items-center gap-2 border px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-xs border-[#00d056] bg-white text-slate-900 ring-1 ring-[#00d056]";
      } else {
        btn.className = "variant-select-btn flex items-center gap-2 border px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-xs border-slate-200 hover:border-slate-350 text-slate-800 bg-white";
      }
    });

    // Update dynamic prices and badges
    const activePrice = (activeVariant && activeVariant.price) ? activeVariant.price : productData.price;
    const activeComparePrice = (activeVariant && (activeVariant.compareAtPrice || activeVariant.compare_at_price)) ? (activeVariant.compareAtPrice || activeVariant.compare_at_price) : (productData.compareAtPrice || productData.compare_at_price || 0);

    const activePriceEl = document.getElementById("active-price-val");
    if (activePriceEl) {
      activePriceEl.textContent = Number(activePrice).toLocaleString();
    }

    const comparePriceEl = document.getElementById("compare-price-val");
    const compareContainerEl = document.getElementById("compare-price-container");
    if (comparePriceEl && compareContainerEl) {
      if (activeComparePrice > activePrice) {
        comparePriceEl.textContent = Number(activeComparePrice).toLocaleString();
        compareContainerEl.classList.remove("hidden");
      } else {
        compareContainerEl.classList.add("hidden");
      }
    }

    const discountPillEl = document.getElementById("discount-pill");
    const discountTextEl = document.getElementById("discount-pill-text");
    if (discountPillEl && discountTextEl) {
      if (activeComparePrice > activePrice) {
        const discountPercent = Math.round(((activeComparePrice - activePrice) / activeComparePrice) * 100);
        discountTextEl.textContent = discountPercent;
        discountPillEl.classList.remove("hidden");
      } else {
        discountPillEl.classList.add("hidden");
      }
    }

    // Update WhatsApp link dynamic pre-fill parameters
    const waBtn = document.getElementById("btn-whatsapp-order");
    if (waBtn) {
      const activeVariantName = activeVariant ? activeVariant.name : "Standard";
      const waPhone = "{{ preg_replace('/\D/', '', $settings['phone'] ?? '01942212267') }}";
      const waText = `আসসালামু আলাইকুম, আমি এই প্রোডাক্টটি অর্ডার করতে চাই: ${productData.name} (বাছাই: ${activeVariantName}, দাম: ${activePrice} টাকা)`;
      waBtn.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;
    }

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

    if (isOutOfStock) {
      if(btnAdd) {
        btnAdd.disabled = true;
        btnAdd.textContent = "STOCK OUT";
      }
      if(btnBuy) {
        btnBuy.disabled = true;
        const buySpan = btnBuy.querySelector("#buy-now-text");
        if(buySpan) buySpan.textContent = "STOCK OUT";
      }
    } else {
      if(btnAdd) {
        btnAdd.disabled = false;
        btnAdd.textContent = "কার্টে যোগ করুন";
      }
      if(btnBuy) {
        btnBuy.disabled = false;
        const buySpan = btnBuy.querySelector("#buy-now-text");
        if(buySpan) buySpan.textContent = "অর্ডার করুন";
      }
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
      price: (activeVariant && activeVariant.price) ? activeVariant.price : productData.price,
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
      price: (activeVariant && activeVariant.price) ? activeVariant.price : productData.price,
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
