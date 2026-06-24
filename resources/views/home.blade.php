@extends('layouts.app')

@section('title', 'CanvasBag Bangladesh | Elevate Your Style With Bold Carry')

@section('content')
    <!-- SVG Clip Path Definitions for Folder Tabs -->
    <svg class="absolute w-0 h-0" width="0" height="0">
        <defs>
            <clipPath id="folder-left" clipPathUnits="objectBoundingBox">
                <path d="M 0, 0.12 
                         C 0, 0.06, 0.05, 0, 0.1, 0 
                         L 0.42, 0 
                         C 0.45, 0, 0.48, 0.03, 0.50, 0.08 
                         L 0.54, 0.15
                         C 0.56, 0.19, 0.59, 0.22, 0.63, 0.22 
                         L 0.9, 0.22 
                         C 0.95, 0.22, 1, 0.27, 1, 0.32 
                         L 1, 0.9 
                         C 1, 0.95, 0.95, 1, 0.9, 1 
                         L 0.1, 1 
                         C 0.05, 1, 0, 0.95, 0, 0.9 
                         Z" />
            </clipPath>
            <clipPath id="folder-right" clipPathUnits="objectBoundingBox">
                <path d="M 0, 0.22
                         C 0, 0.27, 0.05, 0.22, 0.1, 0.22
                         L 0.37, 0.22
                         C 0.41, 0.22, 0.44, 0.19, 0.46, 0.15
                         L 0.50, 0.08
                         C 0.52, 0.03, 0.55, 0, 0.58, 0
                         L 0.9, 0
                         C 0.95, 0, 1, 0.05, 1, 0.1
                         L 1, 0.9
                         C 1, 0.95, 0.95, 1, 0.9, 1
                         L 0.1, 1
                         C 0.05, 1, 0, 0.95, 0, 0.9
                         Z" />
            </clipPath>
        </defs>
    </svg>

    <!-- Hero Section -->
    <section class="relative mx-auto w-full max-w-[1440px] px-4 pt-6 pb-6 sm:px-6 lg:px-8 overflow-hidden bg-white text-slate-800">
        <!-- Mobile Image Carousel (Visible on mobile, hidden on desktop) -->
        <div class="relative sm:hidden w-full aspect-[16/9.5] rounded-2xl overflow-hidden shadow-md">
          <div id="mobile-hero-slider" class="flex transition-transform duration-500 h-full w-full">
            <div class="w-full h-full shrink-0 relative">
              <img src="/brand/hero_orange_model.webp" alt="Promo" class="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div class="w-full h-full shrink-0 relative">
              <img src="/brand/hero_green_model.webp" alt="Promo" class="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div class="w-full h-full shrink-0 relative">
              <img src="/brand/hero_yellow_model.webp" alt="Promo" class="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
          <!-- Dots indicators -->
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            <span class="mobile-slider-dot h-2 w-2 rounded-full bg-white opacity-100 transition-opacity"></span>
            <span class="mobile-slider-dot h-2 w-2 rounded-full bg-white opacity-40 transition-opacity"></span>
            <span class="mobile-slider-dot h-2 w-2 rounded-full bg-white opacity-40 transition-opacity"></span>
          </div>
        </div>

        <!-- Bento Grid Container (Desktop & Tablet) -->
        <div class="hidden sm:grid grid-cols-5 gap-2 sm:gap-6 items-start px-0.5 sm:px-1 mt-0">
            <!-- Column 1 -->
            <div class="flex flex-col gap-2 sm:gap-6 mt-0.5 sm:mt-3">
                <div class="relative w-full aspect-[3/7.2] sm:aspect-[3/3.8] overflow-hidden bg-[#FF6B35] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-all duration-300" style="clip-path: url(#folder-left)">
                    <img src="{{ $settings['heroImage1'] ?? '/brand/hero_orange_model.webp' }}" alt="Model" class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div class="relative w-full aspect-[3/4.5] sm:aspect-[3/2.1] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#FFB84C] cursor-pointer group shadow-sm hover:shadow-lg border border-slate-100/50 transition-all duration-300">
                    <img src="{{ $settings['heroImage2'] ?? '/brand/hero_kid_model.webp' }}" alt="Model" class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                </div>
            </div>

            <!-- Column 2 -->
            <div class="flex flex-col mt-1.5 sm:mt-8">
                <div class="relative w-full aspect-[3/8.8] sm:aspect-[3/4.6] overflow-hidden bg-[#4E9F3D] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-all duration-300" style="clip-path: url(#folder-left)">
                    <img src="{{ $settings['heroImage3'] ?? '/brand/hero_green_model.webp' }}" alt="Model" class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                </div>
            </div>

            <!-- Column 3 - Center -->
            <div class="flex flex-col items-center justify-end gap-2 sm:gap-6 self-stretch mt-0 pb-2">
                <div class="relative w-full aspect-[3/6.8] sm:aspect-[3/3.4] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#FFCC00] cursor-pointer group shadow-sm hover:shadow-lg border border-slate-100/50 transition-all duration-300">
                    <img src="{{ $settings['heroImage4'] ?? '/brand/hero_yellow_model.webp' }}" alt="Model" class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                </div>
                <a href="/category/everyday-totes" class="w-full hidden lg:block">
                    <button class="w-full bg-black text-white hover:bg-black/90 active:scale-95 transition-all duration-300 rounded-full py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 group shadow-md cursor-pointer">
                        Shop Now
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-[#86E237] group-hover:translate-x-1 transition-transform duration-300"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                    </button>
                </a>
            </div>

            <!-- Column 4 -->
            <div class="flex flex-col mt-1.5 sm:mt-8">
                <div class="relative w-full aspect-[3/8.8] sm:aspect-[3/4.6] overflow-hidden bg-[#3C99DC] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-all duration-300" style="clip-path: url(#folder-left)">
                    <img src="{{ $settings['heroImage5'] ?? '/brand/hero_blue_model.webp' }}" alt="Model" class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                </div>
            </div>

            <!-- Column 5 -->
            <div class="flex flex-col gap-2 sm:gap-6 mt-0.5 sm:mt-3">
                <div class="relative w-full aspect-[3/7.2] sm:aspect-[3/3.8] overflow-hidden bg-[#88D49E] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-all duration-300" style="clip-path: url(#folder-right)">
                    <img src="{{ $settings['heroImage6'] ?? '/brand/hero_mint_model.webp' }}" alt="Model" class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div class="relative w-full aspect-[3/4.5] sm:aspect-[3/2.1] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#1A5F35] cursor-pointer group shadow-sm hover:shadow-lg border border-slate-100/50 transition-all duration-300">
                    <img src="{{ $settings['heroImage7'] ?? '/brand/hero_dark_green_model.webp' }}" alt="Model" class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                </div>
            </div>
        </div>
    </section>

    <!-- Flash Sale & Stats Bar (Mobile and Desktop) -->
    <div class="bg-[#121212] py-4 px-4 text-center select-none shadow-inner w-full">
      <div class="mx-auto max-w-md flex flex-col items-center gap-2.5">
        <!-- Stats line -->
        <div class="flex items-center gap-2 text-white text-xs font-bold tracking-wide">
          <span class="h-2 w-2 rounded-full bg-[#f95c32] animate-ping shrink-0"></span>
          <span>আজ ৩৪৭ জন অর্ডার করেছেন</span>
        </div>
        <!-- Flash Deal countdown pill -->
        <div class="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-[#f95c32]/10 border border-[#f95c32]/30 text-white text-xs font-bold">
          <span class="text-orange-500 font-extrabold animate-pulse">⚡</span>
          <span>ফ্ল্যাশ ডিল অফার শেষ হবে:</span>
          <span id="flash-deal-timer" class="font-extrabold tracking-widest text-[#f95c32] font-mono ml-0.5">05:59:56</span>
        </div>
      </div>
    </div>

    <!-- Featured Categories Section -->
    <section class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center mb-10 text-center">
            <!-- Categories Button Badge -->
            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#f95c32]/25 bg-[#f95c32]/5 text-[#f95c32] text-xs font-bold uppercase tracking-wider select-none mb-3">
                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Categories
            </span>
            <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Featured Categories</h2>
        </div>

        <!-- Scrollable Category Row -->
        <div class="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-6 justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
            @foreach($categories as $category)
                <a href="/category/{{ $category['slug'] }}" class="group flex flex-col items-center gap-3.5 shrink-0 w-24 sm:w-32 md:w-36">
                    <!-- Rounded Square Card Frame -->
                    <div class="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-3xl bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex items-center justify-center p-3.5 sm:p-5 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.05)] group-hover:border-[var(--primary)] shrink-0">
                        <img 
                            src="{{ $category['image'] ?? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop' }}" 
                            alt="{{ $category['name'] }}" 
                            class="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105" 
                        />
                    </div>
                    <!-- Label -->
                    <span class="text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-700 group-hover:text-black text-center tracking-tight transition-colors leading-tight px-1 select-none">
                        {{ $category['name'] }}
                    </span>
                </a>
            @endforeach
        </div>
    </section>

    <!-- Best Selling Products Section -->
    <section class="border-y bg-slate-50/30">
        <div class="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
                <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Best Selling Products</h2>
                <a href="/shop" class="text-xs sm:text-sm font-extrabold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 group">
                    View All Products <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>
            
            @php
                $displayBestSellers = count($bestSellers) > 0 ? $bestSellers : array_slice($products, 0, 8);
            @endphp
            
            <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                @foreach($displayBestSellers as $product)
                    @include('components.product-card', ['product' => $product])
                @endforeach
            </div>
        </div>
    </section>

    <!-- Value Propositions -->
    <section class="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
            <p class="text-xs md:text-sm font-semibold uppercase text-slate-400 tracking-wider">Why it works</p>
            <h2 class="mt-2 text-2xl md:text-3xl font-bold text-slate-950">Not just a bag. A sharper carry system.</h2>
        </div>
        <div class="grid gap-4">
            <div class="flex gap-4 rounded-lg border border-slate-100 p-4 bg-white">
                <div class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                </div>
                <div>
                    <h3 class="font-bold text-sm text-slate-800">Built for active routines</h3>
                    <p class="mt-1 text-xs leading-relaxed text-slate-500">Gym, travel, and everyday carry stay organized without looking messy.</p>
                </div>
            </div>
            <div class="flex gap-4 rounded-lg border border-slate-100 p-4 bg-white">
                <div class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <h3 class="font-bold text-sm text-slate-800">Practical compartments</h3>
                    <p class="mt-1 text-xs leading-relaxed text-slate-500">Room for water, shoes, tech, charger, wallet, and quick-grab essentials.</p>
                </div>
            </div>
            <div class="flex gap-4 rounded-lg border border-slate-100 p-4 bg-white">
                <div class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zm9-3h-2v2h2v-2zm0-4h-2v2h2V9zm-2 8h2v1a1 1 0 01-1 1h-1v-2zm2-12v1a1 1 0 01-1 1h-1V5h2z"/></svg>
                </div>
                <div>
                    <h3 class="font-bold text-sm text-slate-800">COD-friendly buying flow</h3>
                    <p class="mt-1 text-xs leading-relaxed text-slate-500">Quick confirmation and no payment friction for Bangladesh shoppers.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Reviews Section -->
    <section class="bg-[var(--primary)] text-[var(--primary-foreground)] transition-colors duration-300">
        <div class="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div class="grid gap-5 md:grid-cols-3">
                <figure class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 text-slate-800">
                    <div class="flex gap-0.5">
                        @for($i = 0; $i < 5; $i++)
                            <svg class="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        @endfor
                    </div>
                    <blockquote class="mt-4 text-sm leading-relaxed text-slate-600 font-medium">
                        "The Canvas Weekender is amazing! It fits all my travel items and has a premium aesthetic. Delivery was very fast too."
                    </blockquote>
                    <figcaption class="mt-4 text-xs font-bold text-slate-800">
                        Hasan M. · Dhaka
                    </figcaption>
                </figure>
                <figure class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 text-slate-800">
                    <div class="flex gap-0.5">
                        @for($i = 0; $i < 5; $i++)
                            <svg class="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        @endfor
                    </div>
                    <blockquote class="mt-4 text-sm leading-relaxed text-slate-600 font-medium">
                        "Very happy with the F-35 Tactical backpack. Built extremely strong and fits my laptop and charging brick perfectly."
                    </blockquote>
                    <figcaption class="mt-4 text-xs font-bold text-slate-800">
                        Nabil R. · Chittagong
                    </figcaption>
                </figure>
                <figure class="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/60 text-slate-800">
                    <div class="flex gap-0.5">
                        @for($i = 0; $i < 5; $i++)
                            <svg class="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        @endfor
                    </div>
                    <blockquote class="mt-4 text-sm leading-relaxed text-slate-600 font-medium">
                        "Great packaging and COD system. Ordered and received in 2 days inside Dhaka. Bag quality is 10/10."
                    </blockquote>
                    <figcaption class="mt-4 text-xs font-bold text-slate-800">
                        Sarah J. · Uttara, Dhaka
                    </figcaption>
                </figure>
            </div>
        </div>
    </section>

    <!-- Promo Banner -->
    @if(!empty($settings['promoTitle']))
        <section class="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div class="rounded-2xl border-2 border-[var(--primary)] bg-[var(--primary)]/10 p-8 text-center sm:p-12 transition-colors duration-300">
                <span class="bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-bold uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full mb-4 inline-flex shadow-sm">{{ $settings['promoTitle'] }}</span>
                <h2 class="mt-3 text-2xl md:text-3xl font-bold text-slate-900">{{ $settings['promoHeadline'] }}</h2>
                <p class="mx-auto mt-3 max-w-2xl text-slate-500 text-sm leading-relaxed">
                    {{ $settings['promoDescription'] }}
                </p>
                <a href="{{ $settings['promoLink'] }}" class="mt-6 inline-flex h-12 items-center justify-center bg-black hover:bg-black/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl px-8 transition-colors">
                    {{ $settings['promoButtonText'] }}
                </a>
            </div>
        </section>
    @endif
@endsection


@section('scripts')
<script>
// Mobile slider carousel
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("mobile-hero-slider");
  const dots = document.querySelectorAll(".mobile-slider-dot");
  if (!slider || dots.length === 0) return;

  let activeIdx = 0;
  const slideCount = dots.length;
  
  setInterval(() => {
    activeIdx = (activeIdx + 1) % slideCount;
    slider.style.transform = `translateX(-${activeIdx * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.className = `mobile-slider-dot h-2 w-2 rounded-full bg-white transition-opacity ${idx === activeIdx ? 'opacity-100' : 'opacity-40'}`;
    });
  }, 3500);
});

// Start countdown timer on load
document.addEventListener("DOMContentLoaded", () => {
  const timerEl = document.getElementById("flash-deal-timer");
  if (!timerEl) return;

  let hours = 5, minutes = 59, seconds = 56;
  setInterval(() => {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
      if (minutes < 0) {
        minutes = 59;
        hours--;
        if (hours < 0) {
          hours = 5; // Reset to 6 hours
        }
      }
    }
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
});
</script>
@endsection
