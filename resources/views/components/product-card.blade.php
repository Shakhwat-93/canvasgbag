@php
    $variants = $product['variants'] ?? [];
    $hasVariants = count($variants) > 0;
    if ($hasVariants) {
        $firstInStockVariant = collect($variants)->first(function($v) {
            return !empty($v['inStock']) || !empty($v['in_stock']);
        });
        $isOutOfStock = !$firstInStockVariant;
    } else {
        $firstInStockVariant = null;
        $isOutOfStock = false;
    }
    $firstImage = $product['images'][0]['url'] ?? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop';
    $firstImageAlt = $product['images'][0]['alt'] ?? $product['name'];
    $badge = $product['badge'] ?? null;
    $price = $product['price'] ?? 0;
    $compareAtPrice = $product['compareAtPrice'] ?? $product['compare_at_price'] ?? null;
@endphp

<article class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
  <a href="/product/{{ $product['slug'] }}" class="block relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100">
    <img
      src="{{ $firstImage }}"
      alt="{{ $firstImageAlt }}"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      loading="lazy"
    />
    @if($badge)
      <span class="absolute left-2.5 top-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm transition-colors duration-300">
        {{ $badge }}
      </span>
    @endif
    @if($isOutOfStock)
      <span class="absolute right-2.5 top-2.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md">
        STOCK OUT
      </span>
    @endif
  </a>

  <div class="p-3 flex-1 flex flex-col justify-between gap-3">
    <div class="space-y-1">
      <a href="/product/{{ $product['slug'] }}" class="block text-xs md:text-sm font-semibold text-slate-800 hover:text-[var(--primary)] transition-colors line-clamp-2 min-h-[34px] leading-tight text-left">
        {{ $product['name'] }}
      </a>
      
      <div class="flex flex-wrap items-baseline gap-2 pt-0.5 justify-start">
        <span class="font-extrabold text-base md:text-lg text-red-600 transition-colors duration-300">
          {{ number_format($price) }} ৳
        </span>
        @if($compareAtPrice)
          <span class="text-xs md:text-sm text-slate-400 line-through">
            {{ number_format($compareAtPrice) }} ৳
          </span>
        @endif
      </div>
    </div>

    <div class="space-y-1.5 pt-1 w-full">
      <a href="/product/{{ $product['slug'] }}" class="block w-full">
        <button class="w-full h-9 rounded-lg bg-[#1E293B] hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          View Product
        </button>
      </a>

      @if($isOutOfStock)
        <button disabled class="w-full h-9 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200">
          Stock Out
        </button>
      @else
        <button
          onclick="event.preventDefault(); addItem({
            productId: '{{ $product['id'] }}',
            slug: '{{ $product['slug'] }}',
            name: '{{ addslashes($product['name']) }}',
            image: '{{ $firstInStockVariant['image'] ?? $firstImage }}',
            price: {{ $price }},
            variantId: '{{ $firstInStockVariant['id'] ?? 'standard' }}',
            variantName: '{{ addslashes($firstInStockVariant['name'] ?? 'Standard') }}',
            quantity: 1
          }); window.location.href = '/checkout';"
          class="w-full h-9 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <svg class="w-3.5 h-3.5 fill-current animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Order Now
        </button>
      @endif
    </div>
  </div>
</article>
