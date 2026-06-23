<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $page['title'] ?? 'Exclusive Deal' }} | CanvasBag</title>
    <meta name="description" content="Premium Carry - Direct landing page promotional offer. Nationwide Cash on Delivery in Bangladesh.">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.png" type="image/png">

    <!-- Vite Styles and Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Dynamic Theme Overrides -->
    <script>
      (function() {
        const applyTheme = (color) => {
          const root = document.documentElement;
          root.style.removeProperty("--primary-gradient");
          if (color === "lime" || !color) {
            root.style.setProperty("--primary", "oklch(0.83 0.21 130)");
            root.style.setProperty("--primary-foreground", "oklch(0.12 0.01 130)");
          } else if (color === "orange") {
            root.style.setProperty("--primary", "oklch(0.70 0.23 45)");
            root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 45)");
          } else if (color === "purple") {
            root.style.setProperty("--primary", "oklch(0.55 0.25 300)");
            root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 300)");
          } else if (color === "blue") {
            root.style.setProperty("--primary", "oklch(0.60 0.18 250)");
            root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 250)");
          } else if (color === "pink") {
            root.style.setProperty("--primary", "oklch(0.65 0.26 350)");
            root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 350)");
          } else if (color.startsWith("gradient:")) {
            const parts = color.substring(9).split(",");
            const start = parts[0] || "#86E237";
            const end = parts[1] || "#FF6B35";
            const fgType = parts[2] || "dark";
            root.style.setProperty("--primary", start);
            root.style.setProperty("--primary-gradient", `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
            root.style.setProperty("--primary-foreground", fgType === "light" ? "oklch(0.98 0 0)" : "oklch(0.12 0.01 130)");
          } else if (color.startsWith("hex:")) {
            const parts = color.substring(4).split(",");
            const hex = parts[0] || "#86E237";
            const fgType = parts[1] || "dark";
            root.style.setProperty("--primary", hex);
            root.style.setProperty("--primary-foreground", fgType === "light" ? "oklch(0.98 0 0)" : "oklch(0.12 0.01 130)");
          }
        };
        applyTheme("{{ $settings['themeColor'] ?? 'lime' }}");
      })();
    </script>

    @if(!empty($page['gtm_id']))
        <!-- Page-Specific Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','{{ trim($page['gtm_id']) }}');</script>
        <!-- End Google Tag Manager -->
    @endif

    @if(!empty($page['custom_css']))
        <style>
            {!! $page['custom_css'] !!}
        </style>
    @endif
</head>
<body class="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">
    @if(!empty($page['gtm_id']))
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ trim($page['gtm_id']) }}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
    @endif

    <!-- Simple Sticky Navbar -->
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2">
                <span class="text-lg font-black tracking-tight text-slate-900 uppercase">Canvas<span class="text-[var(--primary)]">Bag</span></span>
            </a>
            <a href="#checkout-section" class="bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-md active:scale-95">
                অর্ডার করুন
            </a>
        </div>
    </nav>

    <!-- Components Loop -->
    <div class="flex flex-col w-full">
        @php
            $components = $page['components'] ?? [];
            $showcasedProduct = null;
        @endphp

        @foreach($components as $comp)
            @php
                $type = $comp['type'] ?? '';
                $settings = $comp['settings'] ?? [];
            @endphp

            {{-- 1. HERO SECTION --}}
            @if($type === 'hero')
                <section class="relative py-12 md:py-20 overflow-hidden" style="background-color: {{ $settings['bg_color'] ?? '#F8FAFC' }};">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div class="space-y-6 text-left">
                            @if(!empty($settings['badge']))
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--primary)] text-[var(--primary-foreground)]">
                                    {{ $settings['badge'] }}
                                </span>
                            @endif
                            <h1 class="text-3xl sm:text-5xl font-black text-slate-900 leading-tight uppercase">
                                {!! nl2br(e($settings['title'] ?? 'Premium Carry Solutions')) !!}
                            </h1>
                            <p class="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                                {{ $settings['subtitle'] ?? 'Minimalist everyday essentials crafted for movement.' }}
                            </p>
                            <div class="pt-2">
                                <a href="#checkout-section" class="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all active:scale-[0.98]">
                                    {{ $settings['cta_text'] ?? 'অর্ডার করুন (ক্যাশ অন ডেলিভারি)' }}
                                </a>
                            </div>
                        </div>
                        @if(!empty($settings['image']))
                            <div class="relative flex justify-center">
                                <img src="{{ $settings['image'] }}" alt="Banner Image" class="max-h-[380px] md:max-h-[480px] w-auto object-contain rounded-3xl drop-shadow-2xl" />
                            </div>
                        @endif
                    </div>
                </section>
            @endif

            {{-- 2. PRODUCT SHOWCASE --}}
            @if($type === 'product_showcase')
                @php
                    $prodId = $settings['product_id'] ?? '';
                    $product = collect($products)->first(function($p) use ($prodId) {
                        return $p['id'] === $prodId;
                    });
                    if($product) {
                        $showcasedProduct = $product;
                    }
                @endphp

                @if($product)
                    <section class="py-16 bg-white">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <!-- Left: Product Images -->
                            <div class="space-y-4">
                                <div class="relative aspect-square overflow-hidden bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                                    <img id="showcase-main-img" src="{{ $product['images'][0] ?? '/placeholder.png' }}" alt="{{ $product['name'] }}" class="absolute inset-0 h-full w-full object-cover transition-all duration-300" />
                                </div>
                                @if(count($product['images'] ?? []) > 1)
                                    <div class="flex gap-2 overflow-x-auto py-1">
                                        @foreach($product['images'] as $imgIndex => $imgUrl)
                                            <button onclick="document.getElementById('showcase-main-img').src='{{ $imgUrl }}'" class="h-16 w-16 rounded-xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs cursor-pointer hover:border-[var(--primary)] transition-all">
                                                <img src="{{ $imgUrl }}" alt="Thumb" class="h-full w-full object-cover" />
                                            </button>
                                        @endforeach
                                    </div>
                                @endif
                            </div>

                            <!-- Right: Product Info -->
                            <div class="space-y-6">
                                <span class="text-xs font-black uppercase tracking-widest text-slate-400">Featured Offer</span>
                                <h2 class="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">{{ $product['name'] }}</h2>
                                
                                <div class="flex items-baseline gap-4 py-2 border-y border-slate-100">
                                    <span class="text-3xl font-black text-red-600">{{ $product['price'] }} Tk</span>
                                    @if(!empty($product['compareAtPrice']))
                                        <span class="text-lg text-slate-450 line-through font-bold">{{ $product['compareAtPrice'] }} Tk</span>
                                        <span class="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-lg border border-red-150 font-black">
                                            SAVE {{ intval($product['compareAtPrice']) - intval($product['price']) }} Tk
                                        </span>
                                    @endif
                                </div>

                                @if(!empty($settings['benefits']) && is_array($settings['benefits']))
                                    <ul class="space-y-3.5">
                                        @foreach($settings['benefits'] as $benefit)
                                            <li class="flex items-start gap-3">
                                                <span class="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm">
                                                    <svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>
                                                </span>
                                                <span class="text-sm font-semibold text-slate-650">{{ $benefit }}</span>
                                            </li>
                                        @endforeach
                                    </ul>
                                @endif

                                <div class="pt-4">
                                    <a href="#checkout-section" class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all">
                                        আজই অর্ডার করুন
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                @endif
            @endif

            {{-- 3. BENEFITS GRID --}}
            @if($type === 'benefits')
                <section class="py-12 bg-slate-50 border-y border-slate-100">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        @if(!empty($settings['title']))
                            <h2 class="text-xl sm:text-2xl font-black text-center text-slate-900 uppercase tracking-wider mb-10">{{ $settings['title'] }}</h2>
                        @endif
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            @php
                                $items = $settings['items'] ?? [];
                            @endphp
                            @foreach($items as $item)
                                <div class="bg-white border border-slate-150 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-sm">
                                    <div class="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md">
                                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"/></svg>
                                    </div>
                                    <div>
                                        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">{{ $item['title'] ?? 'Feature Title' }}</h3>
                                        <p class="text-xs text-slate-505 font-medium mt-1 leading-normal">{{ $item['description'] ?? 'Detail text explaining why the product stands out.' }}</p>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </section>
            @endif

            {{-- 4. TESTIMONIALS / REVIEWS --}}
            @if($type === 'reviews')
                <section class="py-16 bg-white">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center max-w-xl mx-auto mb-12">
                            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">{{ $settings['title'] ?? 'Customer Love' }}</h2>
                            <p class="text-xs font-bold tracking-widest text-[var(--primary)] uppercase mt-1">Verified Ratings & Reviews</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            @php
                                $reviewsList = $settings['reviews'] ?? [];
                            @endphp
                            @foreach($reviewsList as $review)
                                <div class="bg-slate-50 border border-slate-200/60 p-6 rounded-3xl space-y-4">
                                    <div class="flex items-center gap-1 text-amber-500">
                                        @for($i=0; $i<5; $i++)
                                            <svg class="h-4.5 w-4.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                        @endfor
                                    </div>
                                    <p class="text-xs sm:text-sm font-medium italic text-slate-650 leading-relaxed">
                                        "{!! e($review['text'] ?? '') !!}"
                                    </p>
                                    <div class="flex items-center gap-3 pt-2">
                                        <div class="h-9 w-9 rounded-full bg-slate-200 grid place-items-center font-black text-xs text-slate-600 uppercase border border-slate-300">
                                            {{ substr($review['name'] ?? 'U', 0, 1) }}
                                        </div>
                                        <div>
                                            <p class="text-xs font-bold text-slate-850">{{ $review['name'] ?? 'Verified Customer' }}</p>
                                            <p class="text-[10px] font-bold text-slate-400">Verified Buyer</p>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </section>
            @endif

            {{-- 5. FAQS ACCORDION --}}
            @if($type === 'faq')
                <section class="py-16 bg-slate-50 border-t border-slate-100">
                    <div class="max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 class="text-2xl sm:text-3xl font-black text-center text-slate-900 uppercase tracking-tight mb-10">{{ $settings['title'] ?? 'Frequently Asked Questions' }}</h2>
                        <div class="space-y-3.5">
                            @php
                                $faqs = $settings['faqs'] ?? [];
                            @endphp
                            @foreach($faqs as $faqIndex => $faq)
                                <details class="group bg-white border border-slate-150 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300 shadow-sm" {{ $faqIndex === 0 ? 'open' : '' }}>
                                    <summary class="flex justify-between items-center p-5 cursor-pointer font-bold text-slate-800 text-sm select-none">
                                        <span>{{ $faq['question'] }}</span>
                                        <span class="ml-4 transition-transform group-open:rotate-180 text-slate-400">
                                            <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                                        </span>
                                    </summary>
                                    <div class="px-5 pb-5 text-xs sm:text-sm text-slate-505 font-medium leading-relaxed border-t border-slate-50 pt-3">
                                        {!! nl2br(e($faq['answer'])) !!}
                                    </div>
                                </details>
                            @endforeach
                        </div>
                    </div>
                </section>
            @endif

            {{-- 6. DIRECT CHECKOUT BLOCK --}}
            @if($type === 'checkout')
                @php
                    $checkoutProdId = $settings['product_id'] ?? ($showcasedProduct['id'] ?? ($products[0]['id'] ?? ''));
                    $checkoutProduct = collect($products)->first(function($p) use ($checkoutProdId) {
                        return $p['id'] === $checkoutProdId;
                    });
                @endphp

                @if($checkoutProduct)
                    <section id="checkout-section" class="py-16 bg-white">
                        <div class="max-w-4xl mx-auto px-4 sm:px-6">
                            <div class="bg-[#F8FAFC] border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
                                <div class="absolute top-0 right-0 h-2 w-full bg-[var(--primary)]"></div>
                                
                                <div class="text-center max-w-md mx-auto mb-8">
                                    <h2 class="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">{{ $settings['title'] ?? 'অর্ডার কনফার্ম করুন' }}</h2>
                                    <p class="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">ফ্রি ডেলিভারি এবং ক্যাশ অন ডেলিভারি বাংলাদেশ</p>
                                </div>

                                <form id="lp-checkout-form" action="/checkout" method="POST" onsubmit="handleLpCheckoutSubmit(event)">
                                    @csrf
                                    <!-- Hidden Input holding GTM details & checkout items -->
                                    <input type="hidden" name="landing_page_gtm_id" value="{{ $page['gtm_id'] ?? '' }}" />
                                    <input type="hidden" name="items" id="lp-checkout-items-json" />

                                    <div class="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 items-start">
                                        <!-- Left Side: Product Config & Address -->
                                        <div class="space-y-6">
                                            <!-- Product Brief -->
                                            <div class="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm">
                                                <img id="lp-checkout-item-img" src="{{ $checkoutProduct['images'][0] ?? '/placeholder.png' }}" alt="{{ $checkoutProduct['name'] }}" class="h-16 w-16 rounded-xl object-cover shrink-0 border border-slate-100" />
                                                <div class="min-w-0 flex-1">
                                                    <h4 class="text-sm font-black text-slate-900 leading-snug truncate">{{ $checkoutProduct['name'] }}</h4>
                                                    <p class="text-xs font-bold text-[var(--primary)] mt-1"><span id="lp-base-price-val">{{ $checkoutProduct['price'] }}</span> Tk</p>
                                                </div>
                                            </div>

                                            <!-- Variant Selector -->
                                            @if(!empty($checkoutProduct['variants']) && is_array($checkoutProduct['variants']))
                                                <div class="space-y-2">
                                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">সিলেক্ট করুন <span class="text-red-500">*</span></label>
                                                    <div class="grid grid-cols-2 gap-2">
                                                        @foreach($checkoutProduct['variants'] as $vIdx => $v)
                                                            <label class="lp-variant-card border p-3 rounded-xl flex items-center justify-between cursor-pointer select-none transition-all shadow-xs bg-white border-slate-200 hover:border-slate-300 {{ $vIdx === 0 ? 'border-[var(--primary)] ring-1 ring-[var(--primary)] bg-[var(--primary)]/5' : '' }}">
                                                                <div class="flex flex-col text-left">
                                                                    <span class="text-xs font-bold text-slate-800">{{ $v['name'] }}</span>
                                                                    @if(!empty($v['price']))
                                                                        <span class="text-[10px] text-slate-400 font-extrabold">{{ $v['price'] }} Tk</span>
                                                                    @endif
                                                                </div>
                                                                <input
                                                                    type="radio"
                                                                    name="lp_variant_id"
                                                                    value="{{ $v['id'] }}"
                                                                    data-name="{{ $v['name'] }}"
                                                                    data-price="{{ $v['price'] ?? $checkoutProduct['price'] }}"
                                                                    data-image="{{ $v['image'] ?? ($checkoutProduct['images'][0] ?? '') }}"
                                                                    {{ $vIdx === 0 ? 'checked' : '' }}
                                                                    onchange="selectLpVariant(this)"
                                                                    class="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                                                                />
                                                            </label>
                                                        @endforeach
                                                    </div>
                                                </div>
                                            @endif

                                            <!-- Quantity Selector -->
                                            <div class="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
                                                <span class="text-xs font-bold text-slate-700 uppercase tracking-wide">পরিমাণ (Quantity)</span>
                                                <div class="flex items-center gap-1.5 border border-slate-200 rounded-xl bg-slate-50 p-1">
                                                    <button type="button" onclick="changeLpQty(-1)" class="h-7 w-7 rounded-lg bg-white flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer select-none">-</button>
                                                    <span id="lp-qty-val" class="text-sm font-black text-slate-900 w-6 text-center select-none">1</span>
                                                    <button type="button" onclick="changeLpQty(1)" class="h-7 w-7 rounded-lg bg-white flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 shadow-xs cursor-pointer select-none">+</button>
                                                </div>
                                            </div>

                                            <!-- Form Billing Inputs -->
                                            <div class="space-y-4 pt-2">
                                                <div class="grid gap-1.5">
                                                    <label for="name" class="text-xs font-bold text-slate-650">আপনার নাম <span class="text-red-500">*</span></label>
                                                    <input type="text" id="name" name="name" required placeholder="নাম লিখুন" class="rounded-xl h-11 px-4 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-white" />
                                                </div>
                                                <div class="grid gap-1.5">
                                                    <label for="phone" class="text-xs font-bold text-slate-650">মোবাইল নাম্বার <span class="text-red-500">*</span></label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        required
                                                        pattern="01[0-9]{9}"
                                                        maxlength="11"
                                                        minlength="11"
                                                        placeholder="01XXXXXXXXX"
                                                        onfocus="triggerBeginCheckout()"
                                                        title="মোবাইল নাম্বারটি অবশ্যই ১১ ডিজিটের হতে হবে এবং ০১ দিয়ে শুরু হতে হবে (যেমন: 01712345678)"
                                                        class="rounded-xl h-11 px-4 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-white"
                                                    />
                                                </div>
                                                <div class="grid gap-1.5">
                                                    <label for="address" class="text-xs font-bold text-slate-650">সম্পূর্ণ ঠিকানা (থানা ও জেলাসহ) <span class="text-red-500">*</span></label>
                                                    <input type="text" id="address" name="address" required placeholder="e.g. বাড়ি নং ১২, রোড ৪, ধানমন্ডি, ঢাকা" class="rounded-xl h-11 px-4 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-white" />
                                                </div>
                                                <div class="grid gap-1.5">
                                                    <label for="note" class="text-xs font-bold text-slate-650">ডেলিভারি নোট (অপশনাল)</label>
                                                    <textarea id="note" name="note" placeholder="Write any specific delivery instructions here..." rows="2" class="rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 text-sm font-medium bg-white"></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Right Side: Order Calculation & Submit -->
                                        <div class="space-y-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
                                            <h3 class="text-xs font-black uppercase tracking-wider text-slate-850 border-b border-slate-100 pb-3">অর্ডার সামারি</h3>
                                            
                                            <div class="space-y-2">
                                                <div class="flex justify-between items-center text-xs font-semibold text-slate-505 py-1.5">
                                                    <span>সাব-টোটাল</span>
                                                    <span><span id="lp-summary-subtotal">0</span> Tk</span>
                                                </div>

                                                <!-- Shipping Radio Grid -->
                                                <div class="grid gap-2.5 py-2">
                                                    <!-- Inside Dhaka -->
                                                    <label id="lp-shipping-inside-lbl" class="flex items-center justify-between p-3 rounded-xl border border-[var(--primary)] bg-white ring-1 ring-[var(--primary)] cursor-pointer select-none transition-all shadow-xs">
                                                        <div class="text-[10px] font-bold text-slate-600 flex flex-col">
                                                            <span>ঢাকার ভিতরে</span>
                                                            <span class="text-[var(--primary)] font-black text-xs mt-0.5"><span id="lp-inside-rate-val">60</span> Tk</span>
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="shipping_zone"
                                                            value="Inside dhaka"
                                                            checked
                                                            onchange="changeLpShippingZone('Inside dhaka')"
                                                            class="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                                                        />
                                                    </label>

                                                    <!-- Outside Dhaka -->
                                                    <label id="lp-shipping-outside-lbl" class="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/35 cursor-pointer select-none transition-all">
                                                        <div class="text-[10px] font-bold text-slate-600 flex flex-col">
                                                            <span>ঢাকার বাইরে</span>
                                                            <span class="text-[var(--primary)] font-black text-xs mt-0.5"><span id="lp-outside-rate-val">130</span> Tk</span>
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name="shipping_zone"
                                                            value="Outside dhaka"
                                                            onchange="changeLpShippingZone('Outside dhaka')"
                                                            class="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                                                        />
                                                    </label>
                                                </div>

                                                <!-- Discount Row -->
                                                <div id="lp-discount-row" class="hidden flex justify-between items-center py-2 px-3 bg-red-50/50 rounded-xl border border-red-100 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                                                    <span>ডিসকাউন্ট (৳৩২০০+ অর্ডারে)</span>
                                                    <span>-250 Tk</span>
                                                </div>

                                                <!-- Total Amount -->
                                                <div class="flex justify-between items-center py-3.5 px-4 bg-white rounded-xl border-2 border-red-150 shadow-inner mt-4">
                                                    <span class="text-xs font-black text-slate-800 uppercase tracking-wide">সর্বমোট মূল্য</span>
                                                    <span id="lp-summary-total" class="text-xl font-black text-red-650 tracking-tight">0 Tk</span>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                class="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <svg class="w-4.5 h-4.5 fill-current animate-pulse" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                                {{ $settings['button_text'] ?? 'অর্ডার কনফার্ম করুন' }}
                                            </button>

                                            <p class="text-[10px] font-bold text-slate-400 text-center mt-3">
                                                📞 হেল্পলাইন: <a href="tel:01942212267" class="text-slate-600 hover:underline">01942-212267</a>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                @endif
            @endif
        @endforeach
    </div>

    <!-- Toast Container -->
    <div id="toast-container" class="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 max-w-sm pointer-events-none"></div>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 text-center space-y-4">
            <p class="font-extrabold text-slate-200 uppercase tracking-wider">CanvasBag Bangladesh</p>
            <p class="max-w-md mx-auto leading-normal">Premium Carry products tailored for minimalist and confident everyday movement. Made in Bangladesh.</p>
            <p class="text-[10px] text-slate-650 font-medium">© {{ date('Y') }} CanvasBag BD. All rights reserved.</p>
        </div>
    </footer>

    <!-- Analytics Helpers -->
    <script src="/assets/js/analytics.js?v={{ filemtime(public_path('assets/js/analytics.js')) }}"></script>
    
    <!-- Script Logic for Landing Page Builder Interactions -->
    <script>
        const lpProduct = {!! json_encode($checkoutProduct ?? null) !!};
        let lpQty = 1;
        let lpSelectedVariantId = null;
        let lpSelectedVariantName = "";
        let lpSelectedVariantPrice = lpProduct ? lpProduct.price : 0;
        let lpSelectedVariantImage = lpProduct && lpProduct.images ? lpProduct.images[0] : "";
        let lpShippingFee = {{ $settings['shippingInsideDhaka'] ?? 60 }};
        const lpShippingInside = {{ $settings['shippingInsideDhaka'] ?? 60 }};
        const lpShippingOutside = {{ $settings['shippingOutsideDhaka'] ?? 130 }};

        let hasBegunCheckout = false;

        window.addEventListener('DOMContentLoaded', () => {
            const insideEl = document.getElementById("lp-inside-rate-val");
            const outsideEl = document.getElementById("lp-outside-rate-val");
            if (insideEl) insideEl.textContent = lpShippingInside;
            if (outsideEl) outsideEl.textContent = lpShippingOutside;

            if (lpProduct) {
                if (lpProduct.variants && lpProduct.variants.length > 0) {
                    const checkedRadio = document.querySelector('input[name="lp_variant_id"]:checked');
                    if (checkedRadio) {
                        lpSelectedVariantId = checkedRadio.value;
                        lpSelectedVariantName = checkedRadio.getAttribute('data-name');
                        lpSelectedVariantPrice = parseInt(checkedRadio.getAttribute('data-price'));
                        lpSelectedVariantImage = checkedRadio.getAttribute('data-image');
                    }
                } else {
                    lpSelectedVariantId = null;
                    lpSelectedVariantName = "";
                    lpSelectedVariantPrice = lpProduct.price;
                    lpSelectedVariantImage = lpProduct.images[0] || "";
                }

                recalculateLpCheckout();
                fireViewItemEvent();
            }
        });

        function fireViewItemEvent() {
            if (!lpProduct) return;
            trackEvent("view_item", {
                value: lpProduct.price,
                items: [{
                    item_id: lpProduct.id,
                    item_name: lpProduct.name,
                    price: lpProduct.price,
                    quantity: 1,
                    item_brand: "CanvasBag",
                }]
            });
        }

        function triggerBeginCheckout() {
            if (hasBegunCheckout || !lpProduct) return;
            hasBegunCheckout = true;
            
            trackEvent("begin_checkout", {
                value: lpSelectedVariantPrice * lpQty,
                items: [{
                    item_id: lpProduct.id,
                    item_name: lpProduct.name,
                    item_variant: lpSelectedVariantName || "Standard",
                    price: lpSelectedVariantPrice,
                    quantity: lpQty,
                    item_brand: "CanvasBag",
                }]
            });
        }

        function selectLpVariant(radio) {
            lpSelectedVariantId = radio.value;
            lpSelectedVariantName = radio.getAttribute('data-name');
            lpSelectedVariantPrice = parseInt(radio.getAttribute('data-price'));
            lpSelectedVariantImage = radio.getAttribute('data-image');

            document.querySelectorAll('.lp-variant-card').forEach(card => {
                card.classList.remove('border-[var(--primary)]', 'ring-1', 'ring-[var(--primary)]', 'bg-[var(--primary)]/5');
            });
            const cardEl = radio.closest('.lp-variant-card');
            if (cardEl) {
                cardEl.classList.add('border-[var(--primary)]', 'ring-1', 'ring-[var(--primary)]', 'bg-[var(--primary)]/5');
            }

            const imgEl = document.getElementById("lp-checkout-item-img");
            if (imgEl && lpSelectedVariantImage) {
                imgEl.src = lpSelectedVariantImage;
            }

            recalculateLpCheckout();
        }

        function changeLpQty(delta) {
            lpQty = Math.max(1, lpQty + delta);
            const qtyEl = document.getElementById("lp-qty-val");
            if (qtyEl) qtyEl.textContent = lpQty;

            recalculateLpCheckout();
        }

        function changeLpShippingZone(zone) {
            lpShippingFee = (zone === 'Inside dhaka') ? lpShippingInside : lpShippingOutside;

            const insideLbl = document.getElementById("lp-shipping-inside-lbl");
            const outsideLbl = document.getElementById("lp-shipping-outside-lbl");

            if (zone === 'Inside dhaka') {
                insideLbl.classList.add('border-[var(--primary)]', 'ring-1', 'ring-[var(--primary)]');
                insideLbl.classList.remove('border-slate-200', 'bg-slate-50');
                outsideLbl.classList.remove('border-[var(--primary)]', 'ring-1', 'ring-[var(--primary)]');
                outsideLbl.classList.add('border-slate-200', 'bg-slate-50');
            } else {
                outsideLbl.classList.add('border-[var(--primary)]', 'ring-1', 'ring-[var(--primary)]');
                outsideLbl.classList.remove('border-slate-200', 'bg-slate-50');
                insideLbl.classList.remove('border-[var(--primary)]', 'ring-1', 'ring-[var(--primary)]');
                insideLbl.classList.add('border-slate-200', 'bg-slate-50');
            }

            recalculateLpCheckout();
        }

        function recalculateLpCheckout() {
            if (!lpProduct) return;

            const subtotal = lpSelectedVariantPrice * lpQty;
            const discount = (subtotal >= 3200) ? 250 : 0;
            
            let shippingVal = lpShippingFee;
            if (subtotal >= 2500) {
                shippingVal = 0;
            }

            const total = subtotal - discount + shippingVal;

            const subtotalEl = document.getElementById("lp-summary-subtotal");
            const totalEl = document.getElementById("lp-summary-total");
            const discRow = document.getElementById("lp-discount-row");

            if (subtotalEl) subtotalEl.textContent = subtotal;
            if (totalEl) totalEl.textContent = `${total} Tk`;

            if (discRow) {
                if (discount > 0) {
                    discRow.classList.remove("hidden");
                } else {
                    discRow.classList.add("hidden");
                }
            }
        }

        function handleLpCheckoutSubmit(event) {
            event.preventDefault();

            if (!lpProduct) {
                alert("অর্ডারের পণ্যটি খুঁজে পাওয়া যায়নি!");
                return;
            }

            const items = [{
                productId: lpProduct.id,
                variantId: lpSelectedVariantId,
                name: lpProduct.name,
                variantName: lpSelectedVariantName,
                price: lpSelectedVariantPrice,
                quantity: lpQty,
                image: lpSelectedVariantImage
            }];

            document.getElementById("lp-checkout-items-json").value = JSON.stringify(items);

            trackEvent("add_shipping_info", {
                value: lpSelectedVariantPrice * lpQty,
                shipping_zone: lpShippingFee === 0 ? "Free Shipping" : (lpShippingFee === lpShippingInside ? "Inside Dhaka" : "Outside Dhaka"),
                items: [{
                    item_id: lpProduct.id,
                    item_name: lpProduct.name,
                    item_variant: lpSelectedVariantName || "Standard",
                    price: lpSelectedVariantPrice,
                    quantity: lpQty
                }]
            });

            event.target.submit();
        }
    </script>
</body>
</html>
