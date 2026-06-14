<footer id="footer" class="relative bg-[#F8F9FB] text-slate-600 border-t border-slate-200/80 pt-10 sm:pt-16 pb-0 overflow-hidden font-poppins w-full">
  <!-- Decorative top border glow - dynamically matches theme -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1.5px]" style="background: linear-gradient(to right, transparent 0%, var(--primary) 50%, transparent 100%); opacity: 0.5"></div>

  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
    <!-- Main Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-x-8 gap-y-8 pb-10 sm:pb-16">
      
      <!-- Column 1: Brand Info -->
      <div class="space-y-4 col-span-2 lg:col-span-1">
        <a href="/" class="inline-block text-2xl font-black tracking-wider text-slate-900 uppercase font-outfit hover:text-[var(--primary)] transition-colors duration-300">
          CANVASBAG
        </a>
        <p class="max-w-sm text-sm leading-relaxed text-slate-500">
          Premium canvas bags built for everyday movement in Bangladesh. Confident carry, minimal styling, and a frictionless COD shopping experience.
        </p>
      </div>

      <!-- Column 2: Quick Links -->
      <div class="space-y-3 col-span-1">
        <h4 class="text-xs font-bold text-slate-900 uppercase tracking-widest">Quick Link</h4>
        <ul class="space-y-2.5 text-sm">
          <li>
            <a href="/" class="text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center gap-1 group">
              Home
              <svg class="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--primary)] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </li>
          <li>
            <a href="/shop" class="text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center gap-1 group">
              Shop All
              <svg class="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--primary)] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </li>
          <li>
            <a href="tel:01942212267" class="text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center gap-1 group">
              Contact Us
              <svg class="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--primary)] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 3: Shop Categories -->
      <div class="space-y-3 col-span-1">
        <h4 class="text-xs font-bold text-slate-900 uppercase tracking-widest">Categories</h4>
        <ul class="space-y-2.5 text-sm text-slate-500">
          @foreach(array_slice($categories, 0, 4) as $cat)
            <li>
              <a href="/category/{{ $cat['slug'] }}" class="hover:text-[var(--primary)] transition-colors duration-300">{{ $cat['name'] }}</a>
            </li>
          @endforeach
        </ul>
      </div>

      <!-- Column 4: Socials & Support -->
      <div class="space-y-4 col-span-2 lg:col-span-1">
        <h4 class="text-xs font-bold text-slate-900 uppercase tracking-widest">Social & Support</h4>
        <div class="flex flex-col sm:flex-row lg:flex-col gap-3 text-sm">
          <a href="https://www.facebook.com/canvas.bangladesh" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center sm:justify-start gap-3 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[var(--primary)] text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-300 w-full lg:max-w-[220px] font-medium">
            <svg class="h-4 w-4 fill-current text-[#1877F2] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="truncate">canvas.bangladesh</span>
          </a>

          <a href="tel:01942212267" class="flex items-center justify-center sm:justify-start gap-3 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[var(--primary)] text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-300 w-full lg:max-w-[220px] font-medium">
            <svg class="h-4 w-4 text-[var(--primary)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span class="font-semibold text-slate-800 truncate">01942-212267</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom copyrights -->
    <div class="mt-8 border-t border-slate-200/60 py-6 text-center text-xs text-slate-400 font-medium">
      <p>&copy; {{ date('Y') }} CanvasBag Bangladesh. All rights reserved.</p>
    </div>
  </div>
</footer>
