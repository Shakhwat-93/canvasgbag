<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | CanvasBag</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 font-poppins min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-full bg-black text-white shadow-md">
                <img src="/brand/logo.webp" alt="CanvasBag Logo" width="24" height="24" class="object-contain" />
            </span>
            <div>
                <h1 class="text-base font-black uppercase tracking-wider text-slate-900 leading-none">CanvasBag Admin</h1>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Management Portal</p>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-slate-500 hidden sm:inline">{{ session('admin_email') }}</span>
            <form action="/admin/logout" method="POST">
                @csrf
                <button type="submit" class="border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all">
                    Sign Out
                </button>
            </form>
        </div>
    </header>

    <div class="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-[220px] shrink-0 space-y-2">
            <button onclick="switchTab('products')" id="btn-tab-products" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left bg-black text-white shadow-md cursor-pointer">
                🎒 Products Manager
            </button>
            <button onclick="switchTab('categories')" id="btn-tab-categories" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left text-slate-600 hover:bg-slate-100 cursor-pointer">
                📂 Categories Manager
            </button>
            <button onclick="switchTab('settings')" id="btn-tab-settings" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left text-slate-600 hover:bg-slate-100 cursor-pointer">
                ⚙️ Site Settings
            </button>
            <button onclick="switchTab('landing_pages')" id="btn-tab-landing_pages" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left text-slate-600 hover:bg-slate-100 cursor-pointer">
                📝 Landing Pages
            </button>
        </aside>

        <!-- Content Panel -->
        <main class="flex-1 min-w-0 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-sm">
            <!-- Messages -->
            @if ($errors->any())
                <div class="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold">
                    @foreach ($errors->all() as $error)
                        <p>⚠️ {{ $error }}</p>
                    @endforeach
                </div>
            @endif

            @if (session('success'))
                <div class="mb-6 bg-green-50 border border-green-200 text-green-600 rounded-2xl p-4 text-xs font-semibold">
                    ✅ {{ session('success') }}
                </div>
            @endif

            <!-- 2. PRODUCTS TAB -->
            <div id="tab-products" class="space-y-6">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 class="text-base font-black uppercase tracking-wider text-slate-800">Products Manager</h2>
                    <button onclick="openProductModal()" class="bg-black text-white hover:bg-black/90 text-[10px] font-bold uppercase tracking-widest px-4.5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]">+ Add Product</button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    @forelse($products as $p)
                        <div class="border border-slate-200/80 rounded-2xl p-4 flex gap-4 bg-white hover:shadow-md transition-shadow">
                            <img src="{{ $p['images'][0]['url'] ?? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop' }}" alt="" class="h-16 w-16 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0" />
                            <div class="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <h3 class="text-xs font-bold text-slate-800 truncate">{{ $p['name'] }}</h3>
                                    <p class="text-[10px] text-slate-450 mt-0.5">{{ $p['categoryName'] ?? 'Uncategorized' }}</p>
                                    <p class="text-xs font-extrabold text-slate-900 mt-1.5">{{ number_format($p['price']) }} Tk</p>
                                </div>
                                <div class="flex items-center justify-end gap-1.5 pt-2">
                                    <button onclick="editProduct({{ json_encode($p) }})" class="p-1.5 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 rounded-lg text-slate-500 cursor-pointer">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                    </button>
                                    <form action="/admin/product/{{ $p['id'] }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this product?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg cursor-pointer">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    @empty
                        <p class="text-xs font-semibold text-slate-400 col-span-3 text-center py-6">No products found. Add your first product.</p>
                    @endforelse
                </div>
            </div>

            <!-- 3. CATEGORIES TAB -->
            <div id="tab-categories" class="space-y-6 hidden">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 class="text-base font-black uppercase tracking-wider text-slate-800">Categories Manager</h2>
                    <button onclick="openCategoryModal()" class="bg-black text-white hover:bg-black/90 text-[10px] font-bold uppercase tracking-widest px-4.5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]">+ Add Category</button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    @forelse($categories as $c)
                        <div class="border border-slate-200/80 rounded-2xl p-4 flex gap-4 bg-white hover:shadow-md transition-shadow">
                            <img src="{{ $c['image'] ?? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop' }}" alt="" class="h-16 w-16 rounded-xl object-contain border border-slate-100 bg-slate-50 shrink-0" />
                            <div class="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <h3 class="text-xs font-bold text-slate-800 truncate">{{ $c['name'] }}</h3>
                                    <p class="text-[9px] text-slate-400 mt-0.5">Slug: {{ $c['slug'] }}</p>
                                </div>
                                <div class="flex items-center justify-end gap-1.5 pt-2">
                                    <button onclick="editCategory({{ json_encode($c) }})" class="p-1.5 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 rounded-lg text-slate-500 cursor-pointer">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                    </button>
                                    <form action="/admin/category/{{ $c['id'] }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this category?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-1.5 border border-slate-200 hover:border-red-400 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg cursor-pointer">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    @empty
                        <p class="text-xs font-semibold text-slate-400 col-span-3 text-center py-6">No categories found. Add your first category.</p>
                    @endforelse
                </div>
            </div>

            <!-- 5. LANDING PAGES TAB -->
            <div id="tab-landing_pages" class="space-y-6 hidden">
                <div class="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 class="text-base font-black uppercase tracking-wider text-slate-800">Landing Pages</h2>
                    <button onclick="openLandingPageBuilder()" class="bg-black text-white hover:bg-black/90 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]">
                        + Create Landing Page
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-slate-700 border-collapse">
                        <thead>
                            <tr class="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider text-left bg-slate-50">
                                <th class="py-3 px-4">Title / Slug</th>
                                <th class="py-3 px-4">Custom Domain</th>
                                <th class="py-3 px-4">GTM Container</th>
                                <th class="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @forelse($landingPages ?? [] as $lp)
                                <tr class="hover:bg-slate-50/50">
                                    <td class="py-3.5 px-4 font-bold text-slate-800">
                                        {{ $lp['title'] ?? 'Untitled Page' }}
                                        <div class="text-[10px] text-slate-400 font-bold mt-0.5 flex items-center gap-1.5">
                                            <span>Slug: /lp/{{ $lp['id'] }}</span>
                                            <a href="/lp/{{ $lp['id'] }}" target="_blank" class="text-indigo-650 hover:underline">Preview ↗</a>
                                        </div>
                                    </td>
                                    <td class="py-3.5 px-4 font-semibold text-slate-650">
                                        @if(!empty($lp['custom_domain']))
                                            <a href="http://{{ $lp['custom_domain'] }}" target="_blank" class="text-slate-650 hover:text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                                {{ $lp['custom_domain'] }} ↗
                                            </a>
                                        @else
                                            <span class="text-slate-400 font-medium">None</span>
                                        @endif
                                    </td>
                                    <td class="py-3.5 px-4">
                                        @if(!empty($lp['gtm_id']))
                                            <span class="bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded-md font-bold border border-indigo-150">{{ $lp['gtm_id'] }}</span>
                                        @else
                                            <span class="text-slate-400">Default Site GTM</span>
                                        @endif
                                    </td>
                                    <td class="py-3.5 px-4">
                                        <div class="flex justify-center items-center gap-2">
                                            <button onclick='editLandingPage({!! json_encode($lp) !!})' class="border border-slate-200 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider cursor-pointer transition-all">Edit</button>
                                            
                                            <form action="/admin/landing-page/{{ $lp['id'] }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this landing page?')" class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="border border-red-200 hover:bg-red-50 text-red-650 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider cursor-pointer transition-all">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="py-12 text-center text-slate-400 font-bold col-span-4">No landing pages created yet. Click the button above to build one in a few clicks!</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 4. SITE SETTINGS TAB -->
            <div id="tab-settings" class="space-y-6 hidden">
                <div class="border-b border-slate-100 pb-4">
                    <h2 class="text-base font-black uppercase tracking-wider text-slate-800">Site Settings</h2>
                </div>

                <form action="/admin/settings" method="POST" class="space-y-6 text-xs">
                    @csrf
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Announcement Bar Text</label>
                            <input type="text" name="settings[announcementText]" value="{{ $settings['announcementText'] ?? '' }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Google Tag Manager ID (GTM-XXXXXX)</label>
                            <input type="text" name="settings[gtmId]" value="{{ $settings['gtmId'] ?? '' }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Shipping Fee Inside Dhaka</label>
                            <input type="number" name="settings[shippingInsideDhaka]" value="{{ $settings['shippingInsideDhaka'] ?? 60 }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Shipping Fee Outside Dhaka</label>
                            <input type="number" name="settings[shippingOutsideDhaka]" value="{{ $settings['shippingOutsideDhaka'] ?? 130 }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Promo Offer Title</label>
                            <input type="text" name="settings[promoTitle]" value="{{ $settings['promoTitle'] ?? '' }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Promo Headline</label>
                            <input type="text" name="settings[promoHeadline]" value="{{ $settings['promoHeadline'] ?? '' }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                        <div class="space-y-1.5 md:col-span-2">
                            <label class="font-bold text-slate-650 uppercase">Promo Description</label>
                            <textarea name="settings[promoDescription]" rows="3" class="w-full p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10">{{ $settings['promoDescription'] ?? '' }}</textarea>
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Promo Action Link (URL)</label>
                            <input type="text" name="settings[promoLink]" value="{{ $settings['promoLink'] ?? '' }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                        <div class="space-y-1.5">
                            <label class="font-bold text-slate-650 uppercase">Promo Button Text</label>
                            <input type="text" name="settings[promoButtonText]" value="{{ $settings['promoButtonText'] ?? '' }}" class="w-full h-11 px-4 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/10" />
                        </div>
                    </div>

                    <!-- Theme selection -->
                    <div class="border-t border-slate-100 pt-5 space-y-3">
                        <label class="font-bold text-slate-650 uppercase block">Choose Store Theme Color</label>
                        <div class="flex flex-wrap gap-2.5" id="theme-selectors-container">
                            <button type="button" onclick="selectThemeInSettings('lime')" class="theme-option-btn flex h-10 items-center gap-2 rounded-full border px-4 font-bold cursor-pointer transition-all border-slate-200" data-theme-val="lime">
                                <span class="h-3 w-3 rounded-full bg-[#86E237] border shadow-sm"></span> Lime
                            </button>
                            <button type="button" onclick="selectThemeInSettings('orange')" class="theme-option-btn flex h-10 items-center gap-2 rounded-full border px-4 font-bold cursor-pointer transition-all border-slate-200" data-theme-val="orange">
                                <span class="h-3 w-3 rounded-full bg-[#FF6B35] border shadow-sm"></span> Orange
                            </button>
                            <button type="button" onclick="selectThemeInSettings('purple')" class="theme-option-btn flex h-10 items-center gap-2 rounded-full border px-4 font-bold cursor-pointer transition-all border-slate-200" data-theme-val="purple">
                                <span class="h-3 w-3 rounded-full bg-[#A855F7] border shadow-sm"></span> Purple
                            </button>
                            <button type="button" onclick="selectThemeInSettings('blue')" class="theme-option-btn flex h-10 items-center gap-2 rounded-full border px-4 font-bold cursor-pointer transition-all border-slate-200" data-theme-val="blue">
                                <span class="h-3 w-3 rounded-full bg-[#3B82F6] border shadow-sm"></span> Blue
                            </button>
                            <button type="button" onclick="selectThemeInSettings('pink')" class="theme-option-btn flex h-10 items-center gap-2 rounded-full border px-4 font-bold cursor-pointer transition-all border-slate-200" data-theme-val="pink">
                                <span class="h-3 w-3 rounded-full bg-[#EC4899] border shadow-sm"></span> Pink
                            </button>
                        </div>
                        <!-- Hidden theme color input -->
                        <input type="hidden" name="settings[themeColor]" id="settings-theme-color-val" value="lime" />
                    </div>

                    <div class="pt-2 border-t border-slate-100 flex justify-end">
                        <button type="submit" class="bg-black text-white hover:bg-black/90 text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]">Save Settings</button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <!-- PRODUCT MODAL -->
    <div id="product-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm hidden">
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto no-scrollbar space-y-5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 id="product-modal-title" class="text-sm font-black uppercase tracking-wider text-slate-800">Add New Product</h3>
                <button onclick="closeProductModal()" class="p-1 text-slate-400 hover:text-slate-650 rounded-full hover:bg-slate-100 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>

            <form action="/admin/product" method="POST" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                @csrf
                <input type="hidden" name="id" id="prod-id" />

                <div class="space-y-1 sm:col-span-2">
                    <label class="uppercase">Product Name *</label>
                    <input type="text" name="name" id="prod-name" required placeholder="e.g. Canvas Weekender" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" oninput="generateSlug(this.value, 'prod-slug')" />
                </div>
                <div class="space-y-1 sm:col-span-2">
                    <label class="uppercase">Product Slug *</label>
                    <input type="text" name="slug" id="prod-slug" required placeholder="e.g. canvas-weekender" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" />
                </div>
                <div class="space-y-1">
                    <label class="uppercase">Price *</label>
                    <input type="number" name="price" id="prod-price" required class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" />
                </div>
                <div class="space-y-1">
                    <label class="uppercase">Compare Price (৳)</label>
                    <input type="number" name="compareAtPrice" id="prod-comparePrice" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" />
                </div>
                <div class="space-y-1">
                    <label class="uppercase">Badge (Optional)</label>
                    <input type="text" name="badge" id="prod-badge" placeholder="e.g. Hot Sale" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" />
                </div>
                <div class="space-y-1">
                    <label class="uppercase">Category *</label>
                    <select name="categorySlug" id="prod-categorySelect" onchange="syncCategoryName(this)" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20 font-bold cursor-pointer">
                        @foreach($categories as $cat)
                            <option value="{{ $cat['slug'] }}" data-name="{{ $cat['name'] }}">{{ $cat['name'] }}</option>
                        @endforeach
                    </select>
                    <input type="hidden" name="categoryName" id="prod-categoryNameVal" />
                </div>

                <div class="flex items-center gap-2.5 py-1.5 sm:col-span-2 select-none">
                    <input type="checkbox" name="isBestSeller" id="prod-isBestSeller" class="h-4.5 w-4.5 text-[var(--primary)] border-slate-200 rounded focus:ring-0 cursor-pointer" />
                    <label for="prod-isBestSeller" class="uppercase cursor-pointer text-slate-700">Display as Best Seller on Homepage</label>
                </div>

                <div class="space-y-1 sm:col-span-2">
                    <label class="uppercase">Marketing Story Description</label>
                    <textarea name="story" id="prod-story" rows="3" placeholder="Explain the lifestyle utility story of this bag..." class="w-full p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20"></textarea>
                </div>

                <!-- Multiple images -->
                <div class="space-y-1.5 sm:col-span-2 pt-2 border-t border-slate-100">
                    <label class="uppercase block">Product Showcase Images (Showcase Gallery URLs) *</label>
                    <div id="product-images-inputs-container" class="space-y-2">
                        <!-- Filled by JS -->
                    </div>
                    <button type="button" onclick="addProductImageRow()" class="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer">+ Add Image URL</button>
                </div>

                <!-- Variants -->
                <div class="space-y-1.5 sm:col-span-2 pt-2 border-t border-slate-100">
                    <label class="uppercase block">Product Colors/Variants *</label>
                    <div id="product-variants-inputs-container" class="space-y-2">
                        <!-- Filled by JS -->
                    </div>
                    <button type="button" onclick="addProductVariantRow()" class="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer">+ Add Color Variant</button>
                </div>

                <!-- Benefits -->
                <div class="space-y-1.5 sm:col-span-2 pt-2 border-t border-slate-100">
                    <label class="uppercase block">Product Features List</label>
                    <div id="product-benefits-inputs-container" class="space-y-2">
                        <!-- Filled by JS -->
                    </div>
                    <button type="button" onclick="addBenefitRow()" class="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer">+ Add Feature</button>
                </div>

                <!-- Specs -->
                <div class="space-y-1.5 sm:col-span-2 pt-2 border-t border-slate-100">
                    <label class="uppercase block">Technical Specifications</label>
                    <div id="product-specs-inputs-container" class="space-y-2">
                        <!-- Filled by JS -->
                    </div>
                    <button type="button" onclick="addSpecRow()" class="text-[10px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer">+ Add Spec</button>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-end gap-2.5 sm:col-span-2">
                    <button type="button" onclick="closeProductModal()" class="border border-slate-200 hover:bg-slate-50 rounded-xl px-5 py-2.5 font-bold uppercase tracking-wider cursor-pointer">Cancel</button>
                    <button type="submit" class="bg-black text-white hover:bg-black/90 rounded-xl px-5 py-2.5 font-bold uppercase tracking-wider cursor-pointer shadow-md">Save Product</button>
                </div>
            </form>
        </div>
    </div>

    <!-- CATEGORY MODAL -->
    <div id="category-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm hidden">
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl w-full max-w-md space-y-5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 id="category-modal-title" class="text-sm font-black uppercase tracking-wider text-slate-800">Add New Category</h3>
                <button onclick="closeCategoryModal()" class="p-1 text-slate-400 hover:text-slate-650 rounded-full hover:bg-slate-100 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>

            <form action="/admin/category" method="POST" class="space-y-4 text-xs font-semibold text-slate-600">
                @csrf
                <input type="hidden" name="id" id="cat-id" />

                <div class="space-y-1">
                    <label class="uppercase">Category Name *</label>
                    <input type="text" name="name" id="cat-name" required placeholder="e.g. Travel Duffels" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" oninput="generateSlug(this.value, 'cat-slug')" />
                </div>
                <div class="space-y-1">
                    <label class="uppercase">Category Slug *</label>
                    <input type="text" name="slug" id="cat-slug" required placeholder="e.g. travel-duffels" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" />
                </div>
                <div class="space-y-1">
                    <label class="uppercase">Image Link URL</label>
                    <input type="text" name="image" id="cat-image" placeholder="e.g. /brand/logo.webp" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20" />
                    <div class="flex items-center gap-2 mt-1">
                        <label class="text-[10px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer font-bold inline-flex items-center gap-1 transition-colors">
                            📤 Upload Local File
                            <input type="file" accept="image/*" class="hidden" onchange="uploadLocalImage(this, 'cat-image')" />
                        </label>
                    </div>
                </div>
                <div class="space-y-1">
                    <label class="uppercase">Description</label>
                    <textarea name="description" id="cat-description" rows="3" placeholder="Brief tagline or category details..." class="w-full p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50/20"></textarea>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                    <button type="button" onclick="closeCategoryModal()" class="border border-slate-200 hover:bg-slate-50 rounded-xl px-5 py-2.5 font-bold uppercase tracking-wider cursor-pointer">Cancel</button>
                    <button type="submit" class="bg-black text-white hover:bg-black/90 rounded-xl px-5 py-2.5 font-bold uppercase tracking-wider cursor-pointer shadow-md">Save Category</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Scripts -->
    <script>
      // Image upload and compression helper
      function uploadLocalImage(fileInput, targetInputId) {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            const MAX_DIM = 700;
            if (width > height) {
              if (width > MAX_DIM) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL("image/webp", 0.7);
              document.getElementById(targetInputId).value = compressedDataUrl;
              alert("Local image processed & compressed successfully!");
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }

      // 1. Tab switching engine
      function switchTab(activeTab) {
        const tabs = ['products', 'categories', 'settings', 'landing_pages'];
        tabs.forEach(tab => {
          const btn = document.getElementById(`btn-tab-${tab}`);
          if (tab === activeTab) {
            btn.className = "w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left bg-black text-white shadow-md cursor-pointer";
            document.getElementById(`tab-${tab}`).classList.remove("hidden");
          } else {
            btn.className = "w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left text-slate-600 hover:bg-slate-100 cursor-pointer";
            document.getElementById(`tab-${tab}`).classList.add("hidden");
          }
        });

        // Store active tab in localStorage
        localStorage.setItem("cb_admin_active_tab", activeTab);
      }

      // Restore active tab
      window.addEventListener('DOMContentLoaded', () => {
        let savedTab = localStorage.getItem("cb_admin_active_tab");
        if (!savedTab || savedTab === 'orders') {
          savedTab = 'products';
        }
        switchTab(savedTab);
        
        // Settings theme initialization
        const activeTheme = "{{ $settings['themeColor'] ?? 'lime' }}";
        selectThemeInSettings(activeTheme, false);
      });

      // 2. Slug generator helper
      function generateSlug(text, targetId) {
        const slug = text.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        document.getElementById(targetId).value = slug;
      }

      // Category SELECT handler
      function syncCategoryName(select) {
        const selectedOption = select.options[select.selectedIndex];
        const name = selectedOption.getAttribute("data-name");
        document.getElementById("prod-categoryNameVal").value = name;
      }

      // Initialize Category selector on load
      window.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById("prod-categorySelect");
        if (select) syncCategoryName(select);
      });

      /* ──────────────────────────────────────────────────────────
         PRODUCT CRUD MODAL CONTROLS & DYNAMIC FIELDS
         ────────────────────────────────────────────────────────── */
      let imgRowIndex = 0;
      let varRowIndex = 0;
      let benRowIndex = 0;
      let specRowIndex = 0;

      function openProductModal() {
        document.getElementById("product-modal-title").textContent = "Add New Product";
        document.getElementById("prod-id").value = "";
        document.getElementById("prod-name").value = "";
        document.getElementById("prod-slug").value = "";
        document.getElementById("prod-price").value = "";
        document.getElementById("prod-comparePrice").value = "";
        document.getElementById("prod-badge").value = "";
        document.getElementById("prod-isBestSeller").checked = false;
        document.getElementById("prod-story").value = "";

        // Reset dynamic lists
        document.getElementById("product-images-inputs-container").innerHTML = "";
        document.getElementById("product-variants-inputs-container").innerHTML = "";
        document.getElementById("product-benefits-inputs-container").innerHTML = "";
        document.getElementById("product-specs-inputs-container").innerHTML = "";

        // Add initial blank rows
        addProductImageRow();
        addProductVariantRow();
        addBenefitRow();
        addSpecRow();

        document.getElementById("product-modal").classList.remove("hidden");
      }

      function closeProductModal() {
        document.getElementById("product-modal").classList.add("hidden");
      }

      function editProduct(product) {
        document.getElementById("product-modal-title").textContent = "Edit Product";
        document.getElementById("prod-id").value = product.id;
        document.getElementById("prod-name").value = product.name;
        document.getElementById("prod-slug").value = product.slug;
        document.getElementById("prod-price").value = product.price;
        document.getElementById("prod-comparePrice").value = product.compareAtPrice || "";
        document.getElementById("prod-badge").value = product.badge || "";
        document.getElementById("prod-isBestSeller").checked = !!product.isBestSeller;
        document.getElementById("prod-story").value = product.story || "";

        // Select Category
        const select = document.getElementById("prod-categorySelect");
        if (select) {
          select.value = product.categorySlug;
          syncCategoryName(select);
        }

        // Fill images
        const imgContainer = document.getElementById("product-images-inputs-container");
        imgContainer.innerHTML = "";
        if (product.images && product.images.length > 0) {
          product.images.forEach(img => addProductImageRow(img.url, img.alt));
        } else {
          addProductImageRow();
        }

        // Fill variants
        const varContainer = document.getElementById("product-variants-inputs-container");
        varContainer.innerHTML = "";
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach(v => addProductVariantRow(v.id, v.name, v.colorCode || v.color_code, v.image, v.inStock || v.in_stock));
        } else {
          addProductVariantRow();
        }

        // Fill benefits
        const benContainer = document.getElementById("product-benefits-inputs-container");
        benContainer.innerHTML = "";
        if (product.benefits && product.benefits.length > 0) {
          product.benefits.forEach(b => addBenefitRow(b));
        } else {
          addBenefitRow();
        }

        // Fill specs
        const specContainer = document.getElementById("product-specs-inputs-container");
        specContainer.innerHTML = "";
        if (product.specs && product.specs.length > 0) {
          product.specs.forEach(s => addSpecRow(s));
        } else {
          addSpecRow();
        }

        document.getElementById("product-modal").classList.remove("hidden");
      }

      // Dynamic field helpers
      function addProductImageRow(url = "", alt = "") {
        const container = document.getElementById("product-images-inputs-container");
        const div = document.createElement("div");
        div.className = "flex flex-col gap-1.5 border border-slate-100 p-2.5 rounded-xl bg-slate-50/30";
        const uniqueId = `prod-img-input-${imgRowIndex}`;
        div.innerHTML = `
          <div class="flex gap-2 items-center">
            <input type="text" id="${uniqueId}" name="images[${imgRowIndex}][url]" value="${url}" placeholder="Image URL or Upload File" class="flex-1 h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" required />
            <input type="text" name="images[${imgRowIndex}][alt]" value="${alt}" placeholder="Alt Text" class="w-32 h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" />
            <button type="button" onclick="this.parentNode.parentNode.remove()" class="text-red-500 hover:text-red-700 p-2 cursor-pointer font-bold">&times;</button>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-[9px] text-slate-650 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md cursor-pointer font-bold inline-flex items-center gap-1 transition-colors">
              📤 Upload File
              <input type="file" accept="image/*" class="hidden" onchange="uploadLocalImage(this, '${uniqueId}')" />
            </label>
          </div>
        `;
        container.appendChild(div);
        imgRowIndex++;
      }

      function addProductVariantRow(id = "", name = "", color = "", image = "", inStock = true) {
        const container = document.getElementById("product-variants-inputs-container");
        const div = document.createElement("div");
        div.className = "flex flex-wrap gap-2 items-center border border-slate-100 p-2.5 rounded-xl bg-slate-50/50";
        if (!id) id = 'var-' + Math.random().toString(36).substr(2, 6);
        const uniqueId = `prod-var-img-${varRowIndex}`;
        div.innerHTML = `
          <input type="hidden" name="variants[${varRowIndex}][id]" value="${id}" />
          <input type="text" name="variants[${varRowIndex}][name]" value="${name}" placeholder="Name (e.g. Forest Green)" class="w-36 h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" required />
          <input type="text" name="variants[${varRowIndex}][colorCode]" value="${color}" placeholder="Color (e.g. #1A5F35)" class="w-28 h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" />
          <div class="flex-1 min-w-[200px] flex flex-col gap-1.5">
            <div class="flex gap-1.5 items-center">
              <input type="text" id="${uniqueId}" name="variants[${varRowIndex}][image]" value="${image}" placeholder="Matching Image URL" class="w-full h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" />
              <label class="text-[9px] text-slate-650 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md cursor-pointer font-bold inline-flex items-center gap-1 transition-colors shrink-0">
                📤 Upload
                <input type="file" accept="image/*" class="hidden" onchange="uploadLocalImage(this, '${uniqueId}')" />
              </label>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <input type="checkbox" name="variants[${varRowIndex}][inStock]" value="true" ${inStock ? 'checked' : ''} class="h-4.5 w-4.5 border-slate-200 rounded cursor-pointer" />
            <label class="text-[10px] uppercase text-slate-500 cursor-pointer">In Stock</label>
          </div>
          <button type="button" onclick="this.parentNode.remove()" class="text-red-500 hover:text-red-700 p-2 cursor-pointer font-bold">&times;</button>
        `;
        container.appendChild(div);
        varRowIndex++;
      }

      function addBenefitRow(text = "") {
        const container = document.getElementById("product-benefits-inputs-container");
        const div = document.createElement("div");
        div.className = "flex gap-2 items-center";
        div.innerHTML = `
          <input type="text" name="benefits[]" value="${text}" placeholder="Product Feature (e.g. Water resistant coating)" class="flex-1 h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
          <button type="button" onclick="this.parentNode.remove()" class="text-red-500 hover:text-red-700 p-2 cursor-pointer font-bold">&times;</button>
        `;
        container.appendChild(div);
        benRowIndex++;
      }

      function addSpecRow(text = "") {
        const container = document.getElementById("product-specs-inputs-container");
        const div = document.createElement("div");
        div.className = "flex gap-2 items-center";
        div.innerHTML = `
          <input type="text" name="specs[]" value="${text}" placeholder="Specification (e.g. Capacity: 35L)" class="flex-1 h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
          <button type="button" onclick="this.parentNode.remove()" class="text-red-500 hover:text-red-700 p-2 cursor-pointer font-bold">&times;</button>
        `;
        container.appendChild(div);
        specRowIndex++;
      }

      /* ──────────────────────────────────────────────────────────
         CATEGORY CRUD MODAL CONTROLS
         ────────────────────────────────────────────────────────── */
      function openCategoryModal() {
        document.getElementById("category-modal-title").textContent = "Add New Category";
        document.getElementById("cat-id").value = "";
        document.getElementById("cat-name").value = "";
        document.getElementById("cat-slug").value = "";
        document.getElementById("cat-image").value = "";
        document.getElementById("cat-description").value = "";
        document.getElementById("category-modal").classList.remove("hidden");
      }

      function closeCategoryModal() {
        document.getElementById("category-modal").classList.add("hidden");
      }

      function editCategory(category) {
        document.getElementById("category-modal-title").textContent = "Edit Category";
        document.getElementById("cat-id").value = category.id;
        document.getElementById("cat-name").value = category.name;
        document.getElementById("cat-slug").value = category.slug;
        document.getElementById("cat-image").value = category.image || "";
        document.getElementById("cat-description").value = category.description || "";
        document.getElementById("category-modal").classList.remove("hidden");
      }

      /* ──────────────────────────────────────────────────────────
         LANDING PAGE BUILDER CONTROLLER LOGIC
         ────────────────────────────────────────────────────────── */
      const catalogProducts = {!! json_encode($products) !!};
      let builderComponents = [];
      let currentEditingCompId = null;

      function openLandingPageBuilder() {
        // Reset states
        builderComponents = [];
        currentEditingCompId = null;

        document.getElementById("lp-builder-title").textContent = "Create Landing Page";
        document.getElementById("lp-title").value = "";
        
        const slugInput = document.getElementById("lp-id");
        slugInput.value = "";
        slugInput.removeAttribute("readonly");
        slugInput.className = "w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium";

        document.getElementById("lp-custom-domain").value = "";
        document.getElementById("lp-gtm-id").value = "";
        document.getElementById("lp-template").value = "default";
        document.getElementById("lp-custom-css").value = "";
        document.getElementById("lp-form-components").value = "[]";

        // Show Modal
        document.getElementById("lp-builder-modal").classList.remove("hidden");
        drawBuilderCanvas();
      }

      function closeLandingPageBuilder() {
        document.getElementById("lp-builder-modal").classList.add("hidden");
      }

      function editLandingPage(lp) {
        builderComponents = lp.components || [];
        currentEditingCompId = null;

        document.getElementById("lp-builder-title").textContent = "Edit Landing Page";
        document.getElementById("lp-title").value = lp.title || "";
        
        const slugInput = document.getElementById("lp-id");
        slugInput.value = lp.id || "";
        slugInput.setAttribute("readonly", "readonly");
        slugInput.className = "w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-105 text-slate-400 font-medium cursor-not-allowed";

        document.getElementById("lp-custom-domain").value = lp.custom_domain || "";
        document.getElementById("lp-gtm-id").value = lp.gtm_id || "";
        document.getElementById("lp-template").value = lp.template || "default";
        document.getElementById("lp-custom-css").value = lp.custom_css || "";
        document.getElementById("lp-form-components").value = JSON.stringify(builderComponents);

        document.getElementById("lp-builder-modal").classList.remove("hidden");
        drawBuilderCanvas();
      }

      function addBuilderComponent(type) {
        const id = 'comp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        let defaultSettings = {};

        if (type === 'hero') {
          defaultSettings = {
            title: "নতুন প্রিমিয়াম ক্যানভাস ব্যাগ কালেকশন",
            subtitle: "আপনার নিত্যদিনের যাতায়াত সহজ ও স্টাইলিশ করতে প্রিমিয়াম কোয়ালিটি ব্যাগ।",
            cta_text: "অর্ডার করতে এখানে ক্লিক করুন",
            bg_color: "#F8FAFC",
            badge: "সীমিত সময়ের অফার",
            image: ""
          };
        } else if (type === 'product_showcase') {
          defaultSettings = {
            product_id: catalogProducts[0] ? catalogProducts[0].id : "",
            benefits: [
              "১০০% ক্যানভাস ও ওয়াটারপ্রুফ ইনার",
              "ফ্রি ক্যাশ অন ডেলিভারি সুবিধা",
              "৩ দিনের সহজ রিটার্ন পলিসি"
            ]
          };
        } else if (type === 'benefits') {
          defaultSettings = {
            title: "কেন আমাদের পণ্যটি সেরা?",
            items: [
              { title: "ডেলিভারি সুবিধা", description: "পণ্য হাতে পেয়ে চেক করে পেমেন্ট করার নিশ্চয়তা।" },
              { title: "রিপ্লেসমেন্ট সুবিধা", description: "যেকোনো ত্রুটিতে রয়েছে ফ্রি পরিবর্তন সুবিধা।" },
              { title: "উন্নত ফিনিশিং", description: "আমাদের নিজস্ব ফ্যাক্টরিতে অভিজ্ঞ কারিগর দ্বারা তৈরি।" }
            ]
          };
        } else if (type === 'reviews') {
          defaultSettings = {
            title: "গ্রাহকেরা যা বলছেন",
            reviews: [
              { name: "রাসেল চৌধুরী", text: "ব্যাগটা আসলেই দারুণ! প্রচুর জায়গা আছে এবং কাপড়টা বেশ মোটা।" },
              { name: "নাবিলা পারভীন", text: "ঢাকার বাইরে ২ দিনে ব্যাগটা হাতে পেয়েছি। কোয়ালিটি ছবির মতোই।" },
              { name: "আহমেদ ইমরান", text: "খুবই ভালো কাস্টমার সার্ভিস। ব্যাগের সেলাই ও ফিনিশিং দারুণ।" }
            ]
          };
        } else if (type === 'faq') {
          defaultSettings = {
            title: "সাধারণ কিছু প্রশ্নাবলী",
            faqs: [
              { question: "ডেলিভারি চার্জ কত?", answer: "ঢাকার ভিতরে ৬০ টাকা এবং ঢাকার বাইরে ১৩০ টাকা।" },
              { question: "পছন্দ না হলে ফেরত দেওয়া যাবে?", answer: "হ্যাঁ, ডেলিভারি ম্যানের সামনে দেখে অপছন্দ হলে সাথে সাথেই রিটার্ন করতে পারবেন।" },
              { question: "পেমেন্ট কিভাবে করব?", answer: "আমরা শুধুমাত্র ক্যাশ অন ডেলিভারি (COD) সার্ভিস প্রদান করে থাকি।" }
            ]
          };
        } else if (type === 'checkout') {
          defaultSettings = {
            product_id: catalogProducts[0] ? catalogProducts[0].id : "",
            title: "অর্ডার কনফার্ম করতে ফর্মটি পূরণ করুন",
            button_text: "অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)"
          };
        }

        builderComponents.push({ id, type, settings: defaultSettings });
        drawBuilderCanvas();
      }

      function deleteBuilderComponent(id) {
        if (confirm("Are you sure you want to delete this section?")) {
          builderComponents = builderComponents.filter(c => c.id !== id);
          if (currentEditingCompId === id) {
            currentEditingCompId = null;
          }
          drawBuilderCanvas();
        }
      }

      function moveBuilderComponent(index, direction) {
        if (direction === 'up' && index > 0) {
          const temp = builderComponents[index];
          builderComponents[index] = builderComponents[index - 1];
          builderComponents[index - 1] = temp;
        } else if (direction === 'down' && index < builderComponents.length - 1) {
          const temp = builderComponents[index];
          builderComponents[index] = builderComponents[index + 1];
          builderComponents[index + 1] = temp;
        }
        drawBuilderCanvas();
      }

      function openComponentEditor(id) {
        currentEditingCompId = id;
        drawBuilderCanvas();
      }

      function closeComponentEditor() {
        currentEditingCompId = null;
        drawBuilderCanvas();
      }

      function drawBuilderCanvas() {
        const listEl = document.getElementById("lp-components-list");
        if (!listEl) return;

        const editorEl = document.getElementById("lp-component-editor");
        const canvasEl = document.getElementById("lp-canvas-panel");

        if (currentEditingCompId) {
          editorEl.classList.remove("hidden");
          canvasEl.classList.add("hidden");
          renderComponentEditor();
          return;
        }

        editorEl.classList.add("hidden");
        canvasEl.classList.remove("hidden");

        if (builderComponents.length === 0) {
          listEl.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10 text-slate-400 font-bold text-center text-xs">
              <span class="text-2xl mb-1">📋</span>
              <span>No sections in this landing page. Click the buttons below to add sections like Hero, Showcase, or Checkout Block.</span>
            </div>
          `;
          return;
        }

        listEl.innerHTML = builderComponents.map((comp, idx) => {
          let summary = "";
          if (comp.type === 'hero') {
            summary = comp.settings.title || "No Title";
          } else if (comp.type === 'product_showcase' || comp.type === 'checkout') {
            const prod = catalogProducts.find(p => p.id === comp.settings.product_id);
            summary = prod ? `Product: ${prod.name}` : "No Product Selected";
          } else {
            summary = comp.settings.title || "Section Details";
          }

          return `
            <div class="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-xs hover:border-slate-350 transition-all select-none">
              <div class="flex items-center gap-3">
                <span class="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-sm border border-slate-200">
                  ${comp.type === 'hero' ? '🚀' : comp.type === 'product_showcase' ? '🎁' : comp.type === 'benefits' ? '🌟' : comp.type === 'reviews' ? '❤️' : comp.type === 'faq' ? '❓' : '🛒'}
                </span>
                <div class="text-left">
                  <h5 class="text-xs font-black uppercase text-slate-800">${comp.type.toUpperCase().replace('_', ' ')}</h5>
                  <p class="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">${summary}</p>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" onclick="openComponentEditor('${comp.id}')" class="px-2 py-1 text-[10px] font-bold text-slate-550 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">Edit</button>
                <button type="button" onclick="moveBuilderComponent(${idx}, 'up')" ${idx === 0 ? 'disabled' : ''} class="h-6 w-6 font-black text-slate-400 hover:text-slate-700 border border-slate-200 disabled:opacity-30 rounded-lg cursor-pointer flex items-center justify-center text-xs">↑</button>
                <button type="button" onclick="moveBuilderComponent(${idx}, 'down')" ${idx === builderComponents.length - 1 ? 'disabled' : ''} class="h-6 w-6 font-black text-slate-400 hover:text-slate-700 border border-slate-200 disabled:opacity-30 rounded-lg cursor-pointer flex items-center justify-center text-xs">↓</button>
                <button type="button" onclick="deleteBuilderComponent('${comp.id}')" class="h-6 w-6 font-black text-red-500 hover:bg-red-50 border border-red-100 rounded-lg cursor-pointer flex items-center justify-center text-xs">×</button>
              </div>
            </div>
          `;
        }).join("");
      }

      function updateCompSetting(key, val) {
        const comp = builderComponents.find(c => c.id === currentEditingCompId);
        if (comp) {
          comp.settings[key] = val;
        }
      }

      function updateCompSettingArray(key, idx, val) {
        const comp = builderComponents.find(c => c.id === currentEditingCompId);
        if (comp) {
          comp.settings[key][idx] = val;
        }
      }

      function updateCompSettingNestedArray(key, idx, nestedKey, val) {
        const comp = builderComponents.find(c => c.id === currentEditingCompId);
        if (comp) {
          if (!comp.settings[key][idx]) {
            comp.settings[key][idx] = {};
          }
          comp.settings[key][idx][nestedKey] = val;
        }
      }

      function compressBuilderImage(file, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            const MAX_DIM = 700;
            if (width > height) {
              if (width > MAX_DIM) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedDataUrl = canvas.toDataURL("image/webp", 0.7);
              callback(compressedDataUrl);
            }
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }

      function uploadBuilderImageFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        compressBuilderImage(file, function(dataUrl) {
          updateCompSetting('image', dataUrl);
          renderComponentEditor(); // redraw to show uploaded preview
        });
      }

      function renderComponentEditor() {
        const container = document.getElementById("lp-editor-inputs-container");
        if (!container) return;

        const comp = builderComponents.find(c => c.id === currentEditingCompId);
        if (!comp) {
          closeComponentEditor();
          return;
        }

        document.getElementById("lp-editor-comp-title").textContent = `Edit ${comp.type.toUpperCase().replace('_', ' ')} Section`;
        container.innerHTML = "";

        if (comp.type === 'hero') {
          container.innerHTML = `
            <div class="grid gap-4">
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Badge / Tagline</label>
                <input type="text" value="${comp.settings.badge || ''}" oninput="updateCompSetting('badge', this.value)" class="h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Headline / Main Title</label>
                <textarea rows="2" oninput="updateCompSetting('title', this.value)" class="p-3 border border-slate-200 rounded-lg focus:outline-none">${comp.settings.title || ''}</textarea>
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Sub-headline / Description</label>
                <textarea rows="3" oninput="updateCompSetting('subtitle', this.value)" class="p-3 border border-slate-200 rounded-lg focus:outline-none">${comp.settings.subtitle || ''}</textarea>
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">CTA Button Text</label>
                <input type="text" value="${comp.settings.cta_text || ''}" oninput="updateCompSetting('cta_text', this.value)" class="h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Background Color</label>
                <input type="color" value="${comp.settings.bg_color || '#F8FAFC'}" onchange="updateCompSetting('bg_color', this.value)" class="h-9 w-20 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Hero Image</label>
                ${comp.settings.image ? `<img src="${comp.settings.image}" class="h-20 w-auto object-contain rounded-lg border border-slate-200 mb-2" />` : ''}
                <input type="file" onchange="uploadBuilderImageFile(event)" class="text-[10px]" />
                <p class="text-[9px] text-slate-400">Upload a promo image. Compressed to WebP.</p>
              </div>
            </div>
          `;
        } else if (comp.type === 'product_showcase') {
          const options = catalogProducts.map(p => `
            <option value="${p.id}" ${comp.settings.product_id === p.id ? 'selected' : ''}>${p.name} (${p.price} Tk)</option>
          `).join("");

          container.innerHTML = `
            <div class="grid gap-4">
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Select Catalog Product</label>
                <select onchange="updateCompSetting('product_id', this.value)" class="h-9 px-2 border border-slate-200 rounded-lg focus:outline-none bg-white">
                  <option value="">-- Choose Product --</option>
                  ${options}
                </select>
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Product Benefits (Highlight points)</label>
                <div class="space-y-2">
                  ${[0, 1, 2].map(idx => `
                    <input type="text" value="${comp.settings.benefits[idx] || ''}" oninput="updateCompSettingArray('benefits', ${idx}, this.value)" placeholder="Benefit point ${idx + 1}" class="h-9 px-3 w-full border border-slate-200 rounded-lg focus:outline-none" />
                  `).join("")}
                </div>
              </div>
            </div>
          `;
        } else if (comp.type === 'benefits') {
          container.innerHTML = `
            <div class="grid gap-4">
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Section Title</label>
                <input type="text" value="${comp.settings.title || ''}" oninput="updateCompSetting('title', this.value)" class="h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div class="border-t border-slate-100 pt-3 space-y-4">
                <h5 class="font-bold text-slate-700 uppercase">Benefits Details</h5>
                ${[0, 1, 2].map(idx => `
                  <div class="space-y-2 border border-slate-150 p-3 rounded-lg bg-slate-50/50">
                    <span class="font-bold text-slate-500 text-[10px]">Item ${idx + 1}</span>
                    <div class="grid gap-1">
                      <label class="font-bold text-slate-600 text-[9px] uppercase">Title</label>
                      <input type="text" value="${comp.settings.items[idx]?.title || ''}" oninput="updateCompSettingNestedArray('items', ${idx}, 'title', this.value)" class="h-8 px-2 border border-slate-200 rounded-lg bg-white" />
                    </div>
                    <div class="grid gap-1">
                      <label class="font-bold text-slate-600 text-[9px] uppercase">Description</label>
                      <textarea rows="2" oninput="updateCompSettingNestedArray('items', ${idx}, 'description', this.value)" class="p-2 border border-slate-200 rounded-lg bg-white">${comp.settings.items[idx]?.description || ''}</textarea>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        } else if (comp.type === 'reviews') {
          container.innerHTML = `
            <div class="grid gap-4">
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Section Title</label>
                <input type="text" value="${comp.settings.title || ''}" oninput="updateCompSetting('title', this.value)" class="h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div class="border-t border-slate-100 pt-3 space-y-4">
                <h5 class="font-bold text-slate-700 uppercase">Customer Reviews</h5>
                ${[0, 1, 2].map(idx => `
                  <div class="space-y-2 border border-slate-150 p-3 rounded-lg bg-slate-50/50">
                    <span class="font-bold text-slate-500 text-[10px]">Review ${idx + 1}</span>
                    <div class="grid gap-1">
                      <label class="font-bold text-slate-600 text-[9px] uppercase">Reviewer Name</label>
                      <input type="text" value="${comp.settings.reviews[idx]?.name || ''}" oninput="updateCompSettingNestedArray('reviews', ${idx}, 'name', this.value)" class="h-8 px-2 border border-slate-200 rounded-lg bg-white" />
                    </div>
                    <div class="grid gap-1">
                      <label class="font-bold text-slate-600 text-[9px] uppercase">Review Comment</label>
                      <textarea rows="2" oninput="updateCompSettingNestedArray('reviews', ${idx}, 'text', this.value)" class="p-2 border border-slate-200 rounded-lg bg-white">${comp.settings.reviews[idx]?.text || ''}</textarea>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        } else if (comp.type === 'faq') {
          container.innerHTML = `
            <div class="grid gap-4">
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Section Title</label>
                <input type="text" value="${comp.settings.title || ''}" oninput="updateCompSetting('title', this.value)" class="h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div class="border-t border-slate-100 pt-3 space-y-4">
                <h5 class="font-bold text-slate-700 uppercase">Frequently Asked Questions</h5>
                ${[0, 1, 2].map(idx => `
                  <div class="space-y-2 border border-slate-150 p-3 rounded-lg bg-slate-50/50">
                    <span class="font-bold text-slate-500 text-[10px]">FAQ ${idx + 1}</span>
                    <div class="grid gap-1">
                      <label class="font-bold text-slate-600 text-[9px] uppercase">Question</label>
                      <input type="text" value="${comp.settings.faqs[idx]?.question || ''}" oninput="updateCompSettingNestedArray('faqs', ${idx}, 'question', this.value)" class="h-8 px-2 border border-slate-200 rounded-lg bg-white" />
                    </div>
                    <div class="grid gap-1">
                      <label class="font-bold text-slate-600 text-[9px] uppercase">Answer</label>
                      <textarea rows="2" oninput="updateCompSettingNestedArray('faqs', ${idx}, 'answer', this.value)" class="p-2 border border-slate-200 rounded-lg bg-white">${comp.settings.faqs[idx]?.answer || ''}</textarea>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        } else if (comp.type === 'checkout') {
          const options = catalogProducts.map(p => `
            <option value="${p.id}" ${comp.settings.product_id === p.id ? 'selected' : ''}>${p.name} (${p.price} Tk)</option>
          `).join("");

          container.innerHTML = `
            <div class="grid gap-4">
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Target Catalog Product</label>
                <select onchange="updateCompSetting('product_id', this.value)" class="h-9 px-2 border border-slate-200 rounded-lg focus:outline-none bg-white">
                  <option value="">-- Choose Product --</option>
                  ${options}
                </select>
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Block Header Title</label>
                <input type="text" value="${comp.settings.title || ''}" oninput="updateCompSetting('title', this.value)" class="h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
              <div class="grid gap-1">
                <label class="font-bold text-slate-600 uppercase">Submit Button Text</label>
                <input type="text" value="${comp.settings.button_text || ''}" oninput="updateCompSetting('button_text', this.value)" class="h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
              </div>
            </div>
          `;
        }
      }

      function saveLandingPage() {
        const title = document.getElementById("lp-title").value.trim();
        const slug = document.getElementById("lp-id").value.trim();

        if (!title) {
          alert("Page title is required!");
          return;
        }
        if (!slug) {
          alert("URL slug is required!");
          return;
        }

        // Validate checkout block exists
        const checkoutExists = builderComponents.some(c => c.type === 'checkout');
        if (!checkoutExists) {
          if (!confirm("Warning: You haven't added a Checkout Block. Customers won't be able to purchase directly. Do you still want to save?")) {
            return;
          }
        }

        // Populate hidden input
        document.getElementById("lp-form-components").value = JSON.stringify(builderComponents);
        
        // Submit
        document.getElementById("lp-builder-form").submit();
      }

      /* ──────────────────────────────────────────────────────────
         THEME PICKER LOGIC
         ────────────────────────────────────────────────────────── */
      function selectThemeInSettings(theme, applyLocal = true) {
        // Update hidden input val
        document.getElementById("settings-theme-color-val").value = theme;

        // Add highlight classes on selected theme button
        const buttons = document.querySelectorAll(".theme-option-btn");
        buttons.forEach(btn => {
          const val = btn.getAttribute("data-theme-val");
          if (val === theme) {
            btn.className = "theme-option-btn flex h-10 items-center gap-2 rounded-full border px-4 font-bold cursor-pointer transition-all border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] ring-1 ring-[var(--primary)]";
          } else {
            btn.className = "theme-option-btn flex h-10 items-center gap-2 rounded-full border px-4 font-bold cursor-pointer transition-all border-slate-200 text-slate-700 bg-white";
          }
        });

        // Instantly apply theme preview on settings page load
        if (applyLocal && window.applyTheme) {
          window.applyTheme(theme);
          localStorage.setItem("cb_theme", theme);
        }
      }
    </script>

    <!-- LANDING PAGE BUILDER MODAL -->
    <div id="lp-builder-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 overflow-y-auto hidden">
        <div class="bg-white w-full max-w-5xl rounded-3xl border border-slate-200/80 shadow-2xl flex flex-col h-[90vh] overflow-hidden">
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div class="text-left">
                    <h3 id="lp-builder-title" class="text-sm font-black uppercase tracking-wider text-slate-800">Landing Page Builder</h3>
                    <p class="text-[10px] text-slate-400 font-bold mt-0.5">Drag, drop, and configure sections to build your landing page.</p>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onclick="closeLandingPageBuilder()" class="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all">Cancel</button>
                    <button type="button" onclick="saveLandingPage()" class="bg-black text-white hover:bg-black/90 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md">Save Page</button>
                </div>
            </div>

            <!-- Modal Body (Two Column Layout) -->
            <div class="flex-1 flex overflow-hidden">
                <!-- Left Column: Page Settings & Metadata (Scrollable) -->
                <div class="w-1/3 border-r border-slate-100 p-6 overflow-y-auto space-y-5 bg-slate-50/30">
                    <form id="lp-builder-form" action="/admin/landing-page" method="POST">
                        @csrf
                        <input type="hidden" name="components" id="lp-form-components" value="[]" />
                        
                        <div class="space-y-4 text-xs text-left">
                            <div class="border-b border-slate-150 pb-2 mb-3">
                                <h4 class="font-black text-slate-750 uppercase tracking-wide">Page Settings</h4>
                            </div>

                            <div class="space-y-1">
                                <label class="font-bold text-slate-655 uppercase">Page Title <span class="text-red-500">*</span></label>
                                <input type="text" name="title" id="lp-title" required placeholder="e.g. Special Offer Wood Footrest" onkeyup="if(!document.getElementById('lp-id').readOnly) generateSlug(this.value, 'lp-id')" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium" />
                            </div>

                            <div class="space-y-1">
                                <label class="font-bold text-slate-655 uppercase">URL Slug / Path <span class="text-red-500">*</span></label>
                                <input type="text" name="id" id="lp-id" required placeholder="e.g. wood-footrest-deal" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium" />
                            </div>

                            <div class="space-y-1">
                                <label class="font-bold text-slate-655 uppercase">Custom Domain (Optional)</label>
                                <input type="text" name="custom_domain" id="lp-custom-domain" placeholder="e.g. footrestdeal.com" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium" />
                                <p class="text-[9px] text-slate-400 leading-normal">DNS A/CNAME record of this domain must point to your server IP.</p>
                            </div>

                            <div class="space-y-1">
                                <label class="font-bold text-slate-655 uppercase">GTM Container ID (Optional)</label>
                                <input type="text" name="gtm_id" id="lp-gtm-id" placeholder="e.g. GTM-XXXXXXX" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium" />
                                <p class="text-[9px] text-slate-400 leading-normal">Separate GTM Container ID for tracking conversions on this page.</p>
                            </div>

                            <div class="space-y-1">
                                <label class="font-bold text-slate-655 uppercase">Template</label>
                                <select name="template" id="lp-template" class="w-full h-10 px-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-medium">
                                    <option value="default">Default Landing Page</option>
                                </select>
                            </div>

                            <div class="space-y-1">
                                <label class="font-bold text-slate-655 uppercase">Custom CSS (Optional)</label>
                                <textarea name="custom_css" id="lp-custom-css" rows="4" placeholder="/* Custom CSS overrides */" class="w-full p-3 border border-slate-200 rounded-xl focus:outline-none bg-white font-mono"></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Right Column: Canvas & Component Options -->
                <div class="flex-1 flex flex-col overflow-hidden bg-slate-100/50 p-6">
                    <!-- Dynamic Component Editor (Hidden by default, shown when editing a component) -->
                    <div id="lp-component-editor" class="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-y-auto space-y-6 hidden">
                        <!-- Head of Editor -->
                        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h4 id="lp-editor-comp-title" class="font-black text-sm uppercase text-slate-800">Edit Section</h4>
                            <button type="button" onclick="closeComponentEditor()" class="text-xs font-bold text-indigo-650 hover:underline uppercase">Done Editing</button>
                        </div>
                        <!-- Inputs will be injected here dynamically -->
                        <div id="lp-editor-inputs-container" class="space-y-4 text-xs text-left"></div>
                    </div>

                    <!-- Main Canvas Panel -->
                    <div id="lp-canvas-panel" class="flex-1 flex flex-col overflow-hidden space-y-4">
                        <div class="flex justify-between items-center">
                            <h4 class="font-black text-xs uppercase tracking-wide text-slate-600">Page Components Layout</h4>
                            <span class="text-[10px] text-slate-400 font-bold">Add sections and reorder them.</span>
                        </div>

                        <!-- Components List (Scrollable Canvas) -->
                        <div id="lp-components-list" class="flex-1 overflow-y-auto border-2 border-dashed border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50 min-h-[200px]">
                            <!-- Injected dynamically -->
                        </div>

                        <!-- Add Component Buttons -->
                        <div class="pt-2">
                            <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2 text-left">Add Section to Layout</label>
                            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                <button type="button" onclick="addBuilderComponent('hero')" class="border border-slate-200 hover:border-slate-350 bg-white p-2.5 rounded-xl text-center cursor-pointer hover:bg-slate-50 transition-all">
                                    <span class="block text-lg">🚀</span>
                                    <span class="text-[9px] font-extrabold uppercase text-slate-600">Hero Section</span>
                                </button>
                                <button type="button" onclick="addBuilderComponent('product_showcase')" class="border border-slate-200 hover:border-slate-350 bg-white p-2.5 rounded-xl text-center cursor-pointer hover:bg-slate-50 transition-all">
                                    <span class="block text-lg">🎁</span>
                                    <span class="text-[9px] font-extrabold uppercase text-slate-600">Showcase</span>
                                </button>
                                <button type="button" onclick="addBuilderComponent('benefits')" class="border border-slate-200 hover:border-slate-350 bg-white p-2.5 rounded-xl text-center cursor-pointer hover:bg-slate-50 transition-all">
                                    <span class="block text-lg">🌟</span>
                                    <span class="text-[9px] font-extrabold uppercase text-slate-600">Benefits Grid</span>
                                </button>
                                <button type="button" onclick="addBuilderComponent('reviews')" class="border border-slate-200 hover:border-slate-350 bg-white p-2.5 rounded-xl text-center cursor-pointer hover:bg-slate-50 transition-all">
                                    <span class="block text-lg">❤️</span>
                                    <span class="text-[9px] font-extrabold uppercase text-slate-600">Reviews</span>
                                </button>
                                <button type="button" onclick="addBuilderComponent('faq')" class="border border-slate-200 hover:border-slate-350 bg-white p-2.5 rounded-xl text-center cursor-pointer hover:bg-slate-50 transition-all">
                                    <span class="block text-lg">❓</span>
                                    <span class="text-[9px] font-extrabold uppercase text-slate-600">FAQ Section</span>
                                </button>
                                <button type="button" onclick="addBuilderComponent('checkout')" class="border border-slate-200 hover:border-slate-350 bg-white p-2.5 rounded-xl text-center cursor-pointer hover:bg-slate-50 transition-all">
                                    <span class="block text-lg">🛒</span>
                                    <span class="text-[9px] font-extrabold uppercase text-slate-600">Checkout Block</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
