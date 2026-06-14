<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    /**
     * Homepage
     */
    public function home()
    {
        $products = Cache::remember('cb_products', 300, function () {
            return $this->supabase->getCatalogProducts();
        });

        // Filter best sellers and recent
        $bestSellers = array_filter($products, function ($p) {
            return !empty($p['isBestSeller']) || !empty($p['is_best_seller']);
        });

        return view('home', [
            'products' => $products,
            'bestSellers' => array_slice($bestSellers, 0, 8),
        ]);
    }

    /**
     * Shop All Products Page
     */
    public function shop()
    {
        $products = Cache::remember('cb_products', 300, function () {
            return $this->supabase->getCatalogProducts();
        });

        return view('shop', [
            'products' => $products,
        ]);
    }

    /**
     * Category Listings Page
     */
    public function category($slug)
    {
        $categories = Cache::remember('cb_categories', 300, function () {
            return $this->supabase->getCatalogCategories();
        });

        $currentCategory = collect($categories)->first(function ($c) use ($slug) {
            return ($c['slug'] ?? '') === $slug;
        });

        if (!$currentCategory) {
            abort(404, 'Category not found');
        }

        $allProducts = Cache::remember('cb_products', 300, function () {
            return $this->supabase->getCatalogProducts();
        });

        $products = collect($allProducts)->filter(function ($p) use ($slug) {
            return ($p['categorySlug'] ?? '') === $slug || ($p['category_slug'] ?? '') === $slug;
        })->all();

        return view('category', [
            'category' => $currentCategory,
            'products' => $products,
        ]);
    }

    /**
     * Product Details Page
     */
    public function product($slug)
    {
        $products = Cache::remember('cb_products', 300, function () {
            return $this->supabase->getCatalogProducts();
        });

        $product = collect($products)->first(function ($p) use ($slug) {
            return ($p['slug'] ?? '') === $slug;
        });

        if (!$product) {
            abort(404, 'Product not found');
        }

        $categorySlug = $product['categorySlug'] ?? $product['category_slug'] ?? '';
        $related = collect($products)
            ->filter(function ($p) use ($categorySlug, $product) {
                return (($p['categorySlug'] ?? '') === $categorySlug) && ($p['id'] !== $product['id']);
            })
            ->slice(0, 4)
            ->all();

        return view('product', [
            'product' => $product,
            'related' => $related,
        ]);
    }

    /**
     * Cart View Page
     */
    public function cart()
    {
        return view('cart');
    }

    /**
     * Checkout Form Page
     */
    public function checkout()
    {
        return view('checkout');
    }

    /**
     * Place COD Order (writes to Supabase and Local MySQL DB)
     */
    public function placeOrder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'address' => 'required|string',
            'shipping_zone' => 'required|string',
            'note' => 'nullable|string',
            'items' => 'required', // Array of items from request
        ]);

        $name = $request->input('name');
        $phone = $request->input('phone');
        $address = $request->input('address');
        $shippingZoneInput = $request->input('shipping_zone');
        $note = $request->input('note');
        $itemsRaw = $request->input('items');

        // Parse shipping zone
        $shippingZone = (strtolower($shippingZoneInput) === 'inside dhaka') ? 'Inside Dhaka' : 'Outside Dhaka';

        // Extract city/area for MySQL database compatibility
        $city = ($shippingZone === 'Inside Dhaka') ? 'Dhaka' : 'Outside Dhaka';
        $addressLower = strtolower($address);
        if (strpos($addressLower, 'dhaka') !== false) {
            $city = 'Dhaka';
        } elseif (strpos($addressLower, 'chittagong') !== false || strpos($addressLower, 'chattogram') !== false) {
            $city = 'Chittagong';
        } elseif (strpos($addressLower, 'sylhet') !== false) {
            $city = 'Sylhet';
        } elseif (strpos($addressLower, 'rajshahi') !== false) {
            $city = 'Rajshahi';
        } elseif (strpos($addressLower, 'khulna') !== false) {
            $city = 'Khulna';
        } elseif (strpos($addressLower, 'barisal') !== false) {
            $city = 'Barisal';
        } elseif (strpos($addressLower, 'rangpur') !== false) {
            $city = 'Rangpur';
        } elseif (strpos($addressLower, 'mymensingh') !== false) {
            $city = 'Mymensingh';
        }

        $area = 'N/A';
        $addrParts = explode(',', $address);
        if (count($addrParts) > 1) {
            $area = trim($addrParts[count($addrParts) - 2]);
        } elseif (count($addrParts) === 1) {
            // Try separating by spaces
            $spaceParts = explode(' ', $address);
            if (count($spaceParts) > 1) {
                $area = trim($spaceParts[count($spaceParts) - 2]);
            }
        }

        $fullAddress = $address;

        // Parse items if they arrive as a JSON string
        $items = is_string($itemsRaw) ? json_decode($itemsRaw, true) : $itemsRaw;

        if (empty($items) || !is_array($items)) {
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json(['error' => 'Cart items are missing.'], 400);
            }
            return back()->withErrors(['items' => 'Cart items are missing.']);
        }

        // Fetch settings for shipping calculations
        $settings = $this->supabase->getCatalogSettings();
        $shippingInside = intval($settings['shippingInsideDhaka'] ?? 60);
        $shippingOutside = intval($settings['shippingOutsideDhaka'] ?? 130);

        // Calculate totals
        $subtotal = 0;
        $totalQuantity = 0;
        $distinctItemsCount = count($items);

        foreach ($items as $item) {
            $subtotal += intval($item['price']) * intval($item['quantity']);
            $totalQuantity += intval($item['quantity']);
        }

        // Apply discount: subtotal >= 3200 gets 250 discount
        $discount = $subtotal >= 3200 ? 250 : 0;
        
        // Free shipping condition: subtotal >= 2500 gets free shipping
        $deliveryFee = ($subtotal >= 2500 || $subtotal === 0) ? 0 : (($shippingZone === 'Inside Dhaka') ? $shippingInside : $shippingOutside);

        $total = max(($subtotal + $deliveryFee) - $discount, 0);

        // Generate Order ID (Format: ORD-XXXXXX)
        $orderId = 'ORD-' . mt_rand(100000, 999999);
        
        $primaryProductName = $items[0]['name'] ?? 'Premium Backpack';

        $trafficSource = $request->cookie('traffic_source', 'organic');
        $ipAddress = $request->ip();

        // 1. Write to remote Supabase Orders DB
        $orderedItems = array_map(function ($item) {
            $variantStr = !empty($item['variantName']) ? " - " . $item['variantName'] : "";
            return [
                'name' => $item['name'] . $variantStr,
                'price' => intval($item['price']),
                'quantity' => intval($item['quantity'])
            ];
        }, $items);

        $supabaseOrderData = [
            'id' => $orderId,
            'customer_name' => $name,
            'phone' => $phone,
            'address' => $fullAddress,
            'product_name' => $primaryProductName,
            'quantity' => $distinctItemsCount,
            'source' => 'main website',
            'status' => 'New',
            'amount' => $total,
            'items' => $totalQuantity,
            'payment_status' => 'Unpaid',
            'shipping_zone' => $shippingZone,
            'ordered_items' => $orderedItems,
            'notes' => $note ?: null,
            'traffic_source' => $trafficSource,
            'ip_address' => $ipAddress ?: null,
            'created_at' => now()->toRfc3339String()
        ];

        $this->supabase->insertOrder($supabaseOrderData);

        // 2. Write to local MySQL DB using Eloquent
        $localOrder = Order::create([
            'id' => $orderId,
            'customer_name' => $name,
            'phone' => $phone,
            'city' => $city,
            'area' => $area,
            'address' => $address,
            'note' => $note ?: null,
            'status' => 'pending',
            'payment_method' => 'cod',
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'discount' => $discount,
            'total' => $total,
            'attribution' => [
                'traffic_source' => $trafficSource,
                'ip_address' => $ipAddress ?: null
            ],
            'created_at' => now(),
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $orderId,
                'product_id' => $item['productId'] ?? '',
                'variant_id' => $item['variantId'] ?? 'standard',
                'product_name' => $item['name'],
                'variant_name' => $item['variantName'] ?? 'Standard',
                'unit_price' => intval($item['price']),
                'quantity' => intval($item['quantity']),
                'total' => intval($item['price']) * intval($item['quantity']),
            ]);
        }

        // Return JSON response for AJAX checkout flows, or redirect for standard forms
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'orderId' => $orderId,
                'total' => $total,
                'items' => $items,
                'shippingCost' => $deliveryFee,
                'shippingZone' => $shippingZone,
                'subtotal' => $subtotal,
                'name' => $name,
                'phone' => $phone,
                'address' => $fullAddress,
                'note' => $note ?: ''
            ], 201);
        }

        // Put order data in session for GTM tracking on success redirect
        session()->flash('cb_success_order', [
            'id' => $orderId,
            'name' => $name,
            'phone' => $phone,
            'address' => $fullAddress,
            'shippingZone' => $shippingZone,
            'note' => $note ?: '',
            'subtotal' => $subtotal,
            'deliveryFee' => $deliveryFee,
            'total' => $total,
            'items' => $items
        ]);

        return redirect()->route('order.success', ['id' => $orderId, 'total' => $total]);
    }

    /**
     * Order Success page
     */
    public function success($id)
    {
        $order = Order::with('items')->find($id);

        // Fallback to session data if local DB doesn't have it immediately, or fetch from Supabase
        if (!$order) {
            $supabaseOrders = $this->supabase->getOrders();
            $remoteOrder = collect($supabaseOrders)->firstWhere('id', $id);

            if ($remoteOrder) {
                // Map it
                $order = (object)[
                    'id' => $remoteOrder['id'],
                    'customer_name' => $remoteOrder['customer_name'],
                    'phone' => $remoteOrder['phone'],
                    'address' => $remoteOrder['address'],
                    'note' => $remoteOrder['notes'] ?? '',
                    'subtotal' => $remoteOrder['amount'] - ($remoteOrder['delivery_fee'] ?? 0),
                    'delivery_fee' => $remoteOrder['delivery_fee'] ?? 0,
                    'discount' => 0,
                    'total' => $remoteOrder['amount'],
                    'created_at' => \Carbon\Carbon::parse($remoteOrder['created_at']),
                    'items' => collect($remoteOrder['ordered_items'] ?? [])->map(function ($item) {
                        return (object)[
                            'product_name' => $item['name'],
                            'variant_name' => '',
                            'unit_price' => $item['price'],
                            'quantity' => $item['quantity'],
                            'total' => $item['price'] * $item['quantity']
                        ];
                    })
                ];
            }
        }

        return view('success', [
            'orderId' => $id,
            'order' => $order,
        ]);
    }
}
