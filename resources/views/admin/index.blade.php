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
            <button onclick="switchTab('orders')" id="btn-tab-orders" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left bg-black text-white shadow-md cursor-pointer">
                📦 Orders List
            </button>
            <button onclick="switchTab('products')" id="btn-tab-products" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left text-slate-600 hover:bg-slate-100 cursor-pointer">
                🎒 Products Manager
            </button>
            <button onclick="switchTab('categories')" id="btn-tab-categories" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left text-slate-600 hover:bg-slate-100 cursor-pointer">
                📂 Categories Manager
            </button>
            <button onclick="switchTab('settings')" id="btn-tab-settings" class="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left text-slate-600 hover:bg-slate-100 cursor-pointer">
                ⚙️ Site Settings
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

            <!-- 1. ORDERS TAB -->
            <div id="tab-orders" class="space-y-6">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 class="text-base font-black uppercase tracking-wider text-slate-800">Orders List</h2>
                    <span class="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">{{ count($orders) }} Total</span>
                </div>

                <div class="overflow-x-auto -mx-5 px-5">
                    <table class="w-full border-collapse text-left text-xs min-w-[700px]">
                        <thead>
                            <tr class="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                                <th class="pb-3 w-32">Order ID</th>
                                <th class="pb-3">Customer</th>
                                <th class="pb-3">Attribution</th>
                                <th class="pb-3 text-right">Amount</th>
                                <th class="pb-3 text-center">Status</th>
                                <th class="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 font-semibold text-slate-700">
                            @forelse($orders as $ord)
                                <tr class="hover:bg-slate-50/50 transition-colors">
                                    <td class="py-4">
                                        <span class="font-extrabold text-slate-900 block">{{ $ord['id'] }}</span>
                                        <span class="text-[9px] text-slate-400 font-bold block mt-0.5">{{ date('d M Y, h:i A', strtotime($ord['created_at'])) }}</span>
                                    </td>
                                    <td class="py-4 space-y-0.5">
                                        <p class="font-bold text-slate-800">{{ $ord['customer_name'] }}</p>
                                        <p class="text-[10px] text-slate-450">{{ $ord['phone'] }}</p>
                                        <p class="text-[10px] text-slate-400 italic truncate max-w-xs">{{ $ord['address'] }}</p>
                                    </td>
                                    <td class="py-4 text-[10px]">
                                        <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-500 capitalize">{{ $ord['traffic_source'] ?? 'Direct' }}</span>
                                    </td>
                                    <td class="py-4 text-right">
                                        <span class="font-black text-slate-900">{{ number_format($ord['amount']) }}৳</span>
                                        <span class="text-[9px] text-slate-400 font-bold block mt-0.5">{{ $ord['items'] }} item(s)</span>
                                    </td>
                                    <td class="py-4 text-center">
                                        <form action="/admin/order/{{ $ord['id'] }}/status" method="POST" class="inline-block">
                                            @csrf
                                            <select name="status" onchange="this.form.submit()" class="rounded-lg border border-slate-200 text-[10px] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white font-bold cursor-pointer">
                                                <option value="New" {{ $ord['status'] === 'New' ? 'selected' : '' }}>New</option>
                                                <option value="Confirmed" {{ $ord['status'] === 'Confirmed' ? 'selected' : '' }}>Confirmed</option>
                                                <option value="Dispatched" {{ $ord['status'] === 'Dispatched' ? 'selected' : '' }}>Dispatched</option>
                                                <option value="Delivered" {{ $ord['status'] === 'Delivered' ? 'selected' : '' }}>Delivered</option>
                                                <option value="Cancelled" {{ $ord['status'] === 'Cancelled' ? 'selected' : '' }}>Cancelled</option>
                                            </select>
                                        </form>
                                    </td>
                                    <td class="py-4 text-right">
                                        <form action="/admin/order/{{ $ord['id'] }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this order?')" class="inline-block">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="text-red-500 hover:text-red-700 p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="py-8 text-center text-slate-400 font-semibold">No orders placed yet.</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 2. PRODUCTS TAB -->
            <div id="tab-products" class="space-y-6 hidden">
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
                                    <p class="text-xs font-extrabold text-slate-900 mt-1.5">{{ number_format($p['price']) }}৳</p>
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
      // 1. Tab switching engine
      function switchTab(activeTab) {
        const tabs = ['orders', 'products', 'categories', 'settings'];
        tabs.forEach(tab => {
          const btn = document.getElementById(`btn-tab-${tab}`);
          const container = document.getElementById(`tab-${activeTab === tab ? tab : tab}`);
          
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
        const savedTab = localStorage.getItem("cb_admin_active_tab");
        if (savedTab) {
          switchTab(savedTab);
        }
        
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
        div.className = "flex gap-2 items-center";
        div.innerHTML = `
          <input type="text" name="images[${imgRowIndex}][url]" value="${url}" placeholder="Image URL (e.g. /brand/image.webp)" class="flex-1 h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
          <input type="text" name="images[${imgRowIndex}][alt]" value="${alt}" placeholder="Alt Text" class="w-32 h-9 px-3 border border-slate-200 rounded-lg focus:outline-none" />
          <button type="button" onclick="this.parentNode.remove()" class="text-red-500 hover:text-red-700 p-2 cursor-pointer font-bold">&times;</button>
        `;
        container.appendChild(div);
        imgRowIndex++;
      }

      function addProductVariantRow(id = "", name = "", color = "", image = "", inStock = true) {
        const container = document.getElementById("product-variants-inputs-container");
        const div = document.createElement("div");
        div.className = "flex flex-wrap gap-2 items-center border border-slate-100 p-2.5 rounded-xl bg-slate-50/50";
        if (!id) id = 'var-' + Math.random().toString(36).substr(2, 6);
        div.innerHTML = `
          <input type="hidden" name="variants[${varRowIndex}][id]" value="${id}" />
          <input type="text" name="variants[${varRowIndex}][name]" value="${name}" placeholder="Name (e.g. Forest Green)" class="w-36 h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" required />
          <input type="text" name="variants[${varRowIndex}][colorCode]" value="${color}" placeholder="Color (e.g. #1A5F35)" class="w-28 h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" />
          <input type="text" name="variants[${varRowIndex}][image]" value="${image}" placeholder="Matching Image URL" class="flex-1 min-w-[150px] h-9 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" />
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
</body>
</html>
