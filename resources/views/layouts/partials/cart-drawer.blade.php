<style>
  #cart-drawer-items-container .relative {
    width: 80px !important;
    height: 80px !important;
    min-width: 80px !important;
    min-height: 80px !important;
    max-width: 80px !important;
    max-height: 80px !important;
  }
  #cart-drawer-items-container img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }
</style>

<div id="cart-drawer" class="fixed inset-0 z-[110] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-none opacity-0">
  <!-- Backdrop click close -->
  <div onclick="toggleCartDrawer(false)" class="absolute inset-0 cursor-pointer"></div>

  <!-- Cart Drawer Panel -->
  <div class="relative w-[90%] sm:max-w-md h-full bg-white shadow-2xl transition-transform duration-300 translate-x-full flex flex-col justify-between z-10">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-5 border-b border-slate-150 bg-slate-50/50">
      <div class="flex items-center gap-2.5">
        <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <h2 class="font-black text-slate-900 text-lg uppercase tracking-wider">Your Carry</h2>
      </div>
      <button onclick="toggleCartDrawer(false)" class="p-2.5 text-slate-400 hover:text-slate-650 rounded-full hover:bg-slate-100 cursor-pointer">
        <svg class="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Items container -->
    <div id="cart-drawer-items-container" class="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
      <!-- Dynamic cart items will be rendered here by cart.js -->
    </div>

    <!-- Bottom summary & actions -->
    <div id="cart-drawer-summary" class="border-t border-slate-200 p-6 bg-slate-50/90 space-y-5 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
      <div class="flex justify-between items-center py-3.5 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm mb-1">
        <span class="text-base font-extrabold text-slate-800 uppercase tracking-wider">Subtotal</span>
        <span id="cart-drawer-subtotal" class="font-black text-xl sm:text-2xl text-red-600 bg-red-50/80 px-4.5 py-1.5 rounded-xl border border-red-200 shadow-inner min-w-[130px] text-center tracking-tight">0 Tk</span>
      </div>
      <div class="text-xs sm:text-[13px] text-slate-650 font-black uppercase tracking-wider text-center flex items-center justify-center gap-1.5 py-1">
        🎒 Free shoe bag included with every order
      </div>
      <div class="grid grid-cols-2 gap-4 pt-1">
        <button onclick="toggleCartDrawer(false)" class="border-2 border-slate-300 hover:bg-slate-100 text-slate-850 hover:text-slate-950 rounded-2xl py-4 text-xs sm:text-sm font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95">
          Keep Shopping
        </button>
        <a href="/checkout" class="bg-[var(--primary)] hover:brightness-95 text-[var(--primary-foreground)] rounded-2xl py-4 text-xs sm:text-sm font-black uppercase tracking-widest text-center shadow-lg shadow-[var(--primary)]/25 active:scale-95 transition-all flex items-center justify-center">
          Checkout COD
        </a>
      </div>
    </div>
  </div>
</div>
