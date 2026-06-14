<div id="cart-drawer" class="fixed inset-0 z-[110] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-none opacity-0">
  <!-- Backdrop click close -->
  <div onclick="toggleCartDrawer(false)" class="absolute inset-0 cursor-pointer"></div>

  <!-- Cart Drawer Panel -->
  <div class="relative w-[90%] sm:max-w-md h-full bg-white shadow-2xl transition-transform duration-300 translate-x-full flex flex-col justify-between z-10">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <h2 class="font-extrabold text-slate-800 text-base uppercase tracking-wider">Your Carry</h2>
      </div>
      <button onclick="toggleCartDrawer(false)" class="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Items container -->
    <div id="cart-drawer-items-container" class="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
      <!-- Dynamic cart items will be rendered here by cart.js -->
    </div>

    <!-- Bottom summary & actions -->
    <div id="cart-drawer-summary" class="border-t border-slate-100 p-5 bg-slate-50/50 space-y-4">
      <div class="flex justify-between items-center text-sm">
        <span class="font-semibold text-slate-500">Subtotal</span>
        <span id="cart-drawer-subtotal" class="font-extrabold text-slate-900 text-base">0 Tk</span>
      </div>
      <div class="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center">
        🎒 Free shoe bag included with every order
      </div>
      <div class="grid grid-cols-2 gap-2.5 pt-1">
        <button onclick="toggleCartDrawer(false)" class="border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl py-3 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all active:scale-95">
          Keep Shopping
        </button>
        <a href="/checkout" class="bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] rounded-xl py-3 text-xs font-bold uppercase tracking-widest text-center shadow-md shadow-primary/20 active:scale-95 transition-all">
          Checkout COD
        </a>
      </div>
    </div>
  </div>
</div>
