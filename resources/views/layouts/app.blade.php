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
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

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
    <main class="flex-1 w-full max-w-full overflow-x-hidden pt-[110px]">
        @yield('content')
    </main>

    @include('layouts.partials.footer')
    @include('layouts.partials.cart-drawer')

    <!-- Toast Container -->
    <div id="toast-container" class="fixed bottom-5 right-5 z-[200] flex flex-col gap-2.5 max-w-sm pointer-events-none"></div>

    <!-- Core Scripts -->
    <script src="/assets/js/analytics.js?v={{ filemtime(public_path('assets/js/analytics.js')) }}"></script>
    <script src="/assets/js/cart.js?v={{ filemtime(public_path('assets/js/cart.js')) }}"></script>
    @yield('scripts')
</body>
</html>
