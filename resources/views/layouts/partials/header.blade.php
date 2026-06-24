<!-- Mobile Header (Visible on mobile, hidden on desktop) -->
<div class="block md:hidden bg-white border-b border-slate-100 px-4 py-3.5 w-full shadow-xs">
  <!-- Row 1: Logo & Icons -->
  <div class="flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex shrink-0 items-center gap-2" aria-label="CanvasBag home">
      <span class="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-black">
        <img src="/brand/logo.webp" alt="CanvasBag" width="26" height="26" class="object-contain" />
      </span>
      <span class="text-sm font-bold tracking-tight text-slate-900">CanvasBag</span>
    </a>
    
    <!-- Cart & Menu Buttons -->
    <div class="flex items-center gap-2">
      <!-- Cart Button (Circular) -->
      <button onclick="toggleCartDrawer(true)" class="relative h-10 w-10 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <span id="mobile-cart-badge" class="absolute -top-1 -right-1 hidden grid h-5 min-w-5 place-items-center rounded-full bg-[#f95c32] px-1 text-[10px] font-bold text-white border border-white">0</span>
      </button>

      <!-- Menu Button (Circular) -->
      <button onclick="toggleMobileMenu(true)" class="h-10 w-10 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 active:scale-95 transition-all cursor-pointer" aria-label="Open menu">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>

  <!-- Row 2: Search Bar -->
  <div class="mt-3">
    <form action="/shop" method="GET" class="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-10 shadow-xs">
      <input type="text" name="search" placeholder="পণ্য খুঁজুন..." class="flex-1 px-3 text-sm focus:outline-none text-slate-800 font-medium" />
      <button type="submit" class="h-full px-4.5 bg-[#f95c32] hover:bg-[#e04f27] text-white flex items-center justify-center transition-colors cursor-pointer">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </button>
    </form>
  </div>
</div>

<header class="hidden md:flex justify-center px-4 pb-3 pt-2">
  <!-- Floating pill container -->
  <div class="flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.10)] backdrop-blur-2xl" style="WebkitBackdropFilter: blur(24px)">
    <!-- Logo -->
    <a href="/" class="flex shrink-0 items-center gap-2 rounded-full px-2 py-1 transition-opacity hover:opacity-85" aria-label="CanvasBag home">
      <span class="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-black">
        <img src="/brand/logo.webp" alt="CanvasBag" width="26" height="26" class="object-contain" />
      </span>
      <span class="hidden text-sm font-bold tracking-tight sm:block">CanvasBag</span>
    </a>

    <!-- Desktop Nav -->
    <nav class="hidden items-center gap-1 md:flex">
      <a href="/" class="relative flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-250 {{ Request::is('/') ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground' }}">
        Home
      </a>

      <!-- Shop with Dropdown Submenu -->
      <div class="group relative">
        <a href="/shop" class="relative flex items-center gap-1.5 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-250 cursor-pointer {{ Request::is('shop') || Request::is('category/*') ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground' }}">
          Shop
          <svg class="h-3.5 w-3.5 opacity-75 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
        </a>

        <!-- Dropdown Panel -->
        <div class="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
          <div class="w-[240px] rounded-2xl border border-slate-100 bg-white p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
            <div class="flex flex-col">
              @foreach($categories as $cat)
                <a href="/category/{{ $cat['slug'] }}" class="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150 group/item text-left">
                  <span class="text-[12px] font-semibold tracking-wide">{{ $cat['name'] }}</span>
                  <svg class="h-3.5 w-3.5 -rotate-90 opacity-0 group-hover/item:opacity-80 group-hover/item:translate-x-0.5 transition-all duration-150 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                </a>
              @endforeach
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Us -->
      <a href="#footer" class="relative flex items-center gap-2 rounded-full px-4.5 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-250 text-muted-foreground hover:bg-black/5 hover:text-foreground">
        Contact Us
      </a>
    </nav>

    <!-- Cart + Mobile Menu -->
    <div class="flex items-center gap-1">
      <button onclick="toggleCartDrawer(true)" aria-label="Open cart" class="relative flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <span class="hidden sm:inline">Cart</span>
        <span id="cart-count-badge" class="hidden grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-[var(--primary)]">0</span>
      </button>

      <!-- Mobile Nav Trigger -->
      <button onclick="toggleMobileMenu(true)" class="flex rounded-full md:hidden h-10 w-10 items-center justify-center hover:bg-black/5 cursor-pointer" aria-label="Open menu">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Menu Overlay -->
<div id="mobile-menu" class="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-none opacity-0">
  <!-- Content Panel -->
  <div class="w-[85%] sm:max-w-sm h-full bg-white p-6 shadow-2xl transition-transform duration-300 translate-x-full flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <span class="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-black shadow-sm shrink-0">
            <img src="/brand/logo.webp" alt="CanvasBag" width="26" height="26" class="object-contain" />
          </span>
          <span class="font-extrabold tracking-tight text-base text-slate-800">CanvasBag</span>
        </div>
        <button onclick="toggleMobileMenu(false)" class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <nav class="mt-6 flex flex-col gap-2.5">
        <a href="/" onclick="toggleMobileMenu(false)" class="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold transition-all duration-200 {{ Request::is('/') ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-slate-600 hover:bg-slate-50' }}">
          <svg class="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span>Home</span>
        </a>

        <!-- Collapsible Shop Submenu -->
        <div>
          <button onclick="toggleMobileShop()" class="flex w-full items-center justify-between gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            <div class="flex items-center gap-3.5">
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span>Shop Categories</span>
            </div>
            <svg id="mobile-shop-chevron" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div id="mobile-shop-submenu" class="hidden pl-12 pr-4 py-1.5 flex flex-col gap-2 transition-all duration-300">
            <a href="/shop" onclick="toggleMobileMenu(false)" class="text-sm font-semibold py-2 text-slate-500 hover:text-slate-900">All Products</a>
            @foreach($categories as $cat)
              <a href="/category/{{ $cat['slug'] }}" onclick="toggleMobileMenu(false)" class="text-sm font-semibold py-2 text-slate-500 hover:text-slate-900">{{ $cat['name'] }}</a>
            @endforeach
          </div>
        </div>

        <a href="#footer" onclick="toggleMobileMenu(false)" class="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <span>Contact Us</span>
        </a>
      </nav>
    </div>

    <!-- Mobile Footer Info -->
    <div class="pt-6 border-t border-slate-100 space-y-4">
      <a href="tel:01942212267" class="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all">
        <svg class="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        <span class="font-bold text-slate-800">01942-212267</span>
      </a>
      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">CanvasBag Bangladesh</p>
    </div>
  </div>
</div>
