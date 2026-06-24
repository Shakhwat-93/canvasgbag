<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'CanvasBag Bangladesh | Premium Carry')</title>
    <meta name="description" content="@yield('meta_description', 'Premium canvas bags built for everyday movement in Bangladesh. Confident carry, minimal styling, and nationwide cash on delivery.')">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.png" type="image/png">

    <!-- Theme Color Engine -->
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
        const savedTheme = localStorage.getItem("cb_theme") || "{{ $settings['themeColor'] ?? 'lime' }}";
        applyTheme(savedTheme);
        window.applyTheme = applyTheme;
      })();
    </script>

    @php
        $activeGtmId = session('landing_page_gtm_id');
        if (!$activeGtmId) {
            $host = request()->getHost();
            if ($host && !in_array($host, ['localhost', '127.0.0.1'])) {
                $landingPages = \Illuminate\Support\Facades\Cache::remember('cb_landing_pages', 300, function () {
                    return (new \App\Services\SupabaseService())->getLandingPages();
                });
                $matchedLp = collect($landingPages)->first(function ($lp) use ($host) {
                    return ($lp['custom_domain'] ?? '') === $host;
                });
                if ($matchedLp && !empty($matchedLp['gtm_id'])) {
                    $activeGtmId = $matchedLp['gtm_id'];
                }
            }
        }
        if (!$activeGtmId) {
            $activeGtmId = $settings['gtmId'] ?? null;
        }
    @endphp

    @if(!empty($activeGtmId))
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','{{ trim($activeGtmId) }}');</script>
        <!-- End Google Tag Manager -->
    @endif

    @if(!empty(env('FACEBOOK_PIXEL_ID')))
        <!-- Meta Pixel Code -->
        <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '{{ env('FACEBOOK_PIXEL_ID') }}');
        fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id={{ env('FACEBOOK_PIXEL_ID') }}&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Meta Pixel Code -->
    @endif

    <!-- Vite Styles and Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-white text-slate-800">
    @if(!empty($activeGtmId))
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ trim($activeGtmId) }}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
    @endif

    <div class="fixed inset-x-0 top-0 z-50 flex flex-col">
        @include('layouts.partials.announcement-bar')
        @include('layouts.partials.header')
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-full overflow-x-hidden pt-[140px] md:pt-[110px] pb-16 md:pb-0">
        @yield('content')
    </main>

    @include('layouts.partials.footer')
    @include('layouts.partials.cart-drawer')

    <!-- Toast Container -->
    <div id="toast-container" class="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 max-w-sm pointer-events-none"></div>

    <!-- Floating Mobile Cart Widget (Visible on mobile/tablet, hidden on desktop) -->
    <button
      onclick="toggleCartDrawer(true)"
      class="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#f95c32] hover:bg-[#e04f27] text-white flex flex-col items-center justify-center w-14 py-3 rounded-l-xl shadow-lg border border-r-0 border-white/20 active:scale-95 transition-all select-none cursor-pointer"
    >
      <svg class="w-6 h-6 stroke-current fill-none mb-1" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
      <span class="text-[9px] font-black uppercase tracking-wider leading-none text-center">
        <span class="widget-cart-count">0</span> ITEMS
      </span>
      <span class="mt-2 bg-white text-[#f95c32] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm leading-none">
        ৳<span class="widget-cart-total">0</span>
      </span>
    </button>

    <!-- Mobile Sticky Bottom Navigation (Visible on mobile, hidden on desktop) -->
    <div class="block md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#f95c32] border-t border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div class="grid grid-cols-5 h-14 w-full">
        <!-- Home -->
        <a href="/" class="flex flex-col items-center justify-center text-white active:scale-95 transition-transform">
          <svg class="w-5.5 h-5.5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[10px] font-bold mt-1">হোম</span>
        </a>

        <!-- Categories -->
        <a href="/shop" class="flex flex-col items-center justify-center text-white active:scale-95 transition-transform">
          <svg class="w-5.5 h-5.5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          <span class="text-[10px] font-bold mt-1">ক্যাটাগরি</span>
        </a>

        <!-- Cart -->
        <button onclick="toggleCartDrawer(true)" class="flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer">
          <div class="relative">
            <svg class="w-5.5 h-5.5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span id="mobile-nav-cart-badge" class="widget-cart-count absolute -top-1 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-white text-[#f95c32] text-[8px] font-black leading-none">0</span>
          </div>
          <span class="text-[10px] font-bold mt-1">কার্ট</span>
        </button>

        <!-- Search -->
        <button onclick="window.scrollTo({top: 0, behavior: 'smooth'}); document.querySelector('input[name=search]')?.focus();" class="flex flex-col items-center justify-center text-white active:scale-95 transition-transform cursor-pointer">
          <svg class="w-5.5 h-5.5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <span class="text-[10px] font-bold mt-1">খুঁজুন</span>
        </button>

        <!-- Admin -->
        <a href="/admin" class="flex flex-col items-center justify-center text-white active:scale-95 transition-transform">
          <svg class="w-5.5 h-5.5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="text-[10px] font-bold mt-1">অ্যাডমিন</span>
        </a>
      </div>
    </div>

    <!-- Core Scripts -->
    <script src="/assets/js/analytics.js?v={{ filemtime(public_path('assets/js/analytics.js')) }}"></script>
    <script src="/assets/js/cart.js?v={{ filemtime(public_path('assets/js/cart.js')) }}"></script>
    @yield('scripts')
</body>
</html>
