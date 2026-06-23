<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
    protected SupabaseService $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    /**
     * Check if admin is authenticated
     */
    protected function checkAuth()
    {
        if (!session()->has('admin_token')) {
            return false;
        }
        return true;
    }

    /**
     * Admin Dashboard Main Page
     */
    public function index()
    {
        if (!$this->checkAuth()) {
            return redirect()->route('admin.login');
        }

        $settings = $this->supabase->getCatalogSettings();
        $categories = $this->supabase->getCatalogCategories();
        $products = $this->supabase->getCatalogProducts();
        $landingPages = $this->supabase->getLandingPages();
        $orders = [];

        return view('admin.index', [
            'settings' => $settings,
            'categories' => $categories,
            'products' => $products,
            'landingPages' => $landingPages,
            'orders' => $orders,
        ]);
    }

    /**
     * Admin Login View
     */
    public function loginForm()
    {
        if ($this->checkAuth()) {
            return redirect()->route('admin.index');
        }
        return view('admin.login');
    }

    /**
     * Process Admin Login via Supabase Auth
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $this->supabase->verifyAdminCredentials(
            $request->input('email'),
            $request->input('password')
        );

        if ($credentials && isset($credentials['access_token'])) {
            session([
                'admin_token' => $credentials['access_token'],
                'admin_email' => $credentials['user']['email'] ?? $request->input('email'),
            ]);
            return redirect()->route('admin.index')->with('success', 'Logged in successfully.');
        }

        return back()->withErrors(['email' => 'Invalid email or password.']);
    }

    /**
     * Admin Logout
     */
    public function logout()
    {
        session()->forget(['admin_token', 'admin_email']);
        return redirect()->route('admin.login')->with('success', 'Logged out successfully.');
    }

    /**
     * Update Site Settings
     */
    public function updateSettings(Request $request)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $settings = $request->input('settings');
        if (empty($settings) || !is_array($settings)) {
            return back()->withErrors(['settings' => 'Invalid settings structure.']);
        }

        // Fetch current settings to preserve image details if not modified
        $current = $this->supabase->getCatalogSettings();
        $merged = array_merge($current, $settings);

        $success = $this->supabase->updateCatalogSettings($merged);
        if ($success) {
            Cache::forget('cb_settings');
            return back()->with('success', 'Settings updated successfully.');
        }

        return back()->withErrors(['settings' => 'Failed to save settings to Supabase.']);
    }

    /**
     * Upsert Category (Create & Update)
     */
    public function upsertCategory(Request $request)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $id = $request->input('id');
        $slug = $request->input('slug');
        $name = $request->input('name');
        $description = $request->input('description') ?? '';
        $image = $request->input('image') ?? '';

        if (!$id) {
            $id = (string) \Illuminate\Support\Str::uuid();
        }

        $categoryData = [
            'id' => $id,
            'slug' => $slug,
            'name' => $name,
            'description' => $description,
            'image' => $image,
        ];

        $success = $this->supabase->upsertCatalogCategory($id, $categoryData);
        if ($success) {
            Cache::forget('cb_categories');
            return back()->with('success', 'Category saved successfully.');
        }

        return back()->withErrors(['category' => 'Failed to save category to Supabase.']);
    }

    /**
     * Delete Category
     */
    public function deleteCategory($id)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $success = $this->supabase->deleteCatalogCategory($id);
        if ($success) {
            Cache::forget('cb_categories');
            return back()->with('success', 'Category deleted successfully.');
        }

        return back()->withErrors(['category' => 'Failed to delete category.']);
    }

    /**
     * Upsert Product (Create & Update)
     */
    public function upsertProduct(Request $request)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $id = $request->input('id');
        $name = $request->input('name');
        $slug = $request->input('slug');
        $price = intval($request->input('price'));
        $compareAtPrice = $request->input('compareAtPrice') ? intval($request->input('compareAtPrice')) : null;
        $badge = $request->input('badge') ?: null;
        $categorySlug = $request->input('categorySlug');
        $categoryName = $request->input('categoryName');
        
        $isBestSeller = $request->has('isBestSeller') || $request->input('isBestSeller') === 'true';

        $benefits = $request->input('benefits') ?: [];
        $specs = $request->input('specs') ?: [];
        $images = $request->input('images') ?: [];
        $variants = $request->input('variants') ?: [];

        if (!$id) {
            $id = (string) \Illuminate\Support\Str::uuid();
        }

        $productData = [
            'id' => $id,
            'name' => $name,
            'slug' => $slug,
            'price' => $price,
            'compareAtPrice' => $compareAtPrice,
            'badge' => $badge,
            'categorySlug' => $categorySlug,
            'categoryName' => $categoryName,
            'isBestSeller' => $isBestSeller,
            'benefits' => $benefits,
            'specs' => $specs,
            'images' => $images,
            'variants' => $variants,
            'story' => $request->input('story') ?? '',
        ];

        $success = $this->supabase->upsertCatalogProduct($id, $productData);
        if ($success) {
            Cache::forget('cb_products');
            return back()->with('success', 'Product saved successfully.');
        }

        return back()->withErrors(['product' => 'Failed to save product to Supabase.']);
    }

    /**
     * Delete Product
     */
    public function deleteProduct($id)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $success = $this->supabase->deleteCatalogProduct($id);
        if ($success) {
            Cache::forget('cb_products');
            return back()->with('success', 'Product deleted successfully.');
        }

        return back()->withErrors(['product' => 'Failed to delete product.']);
    }

    /**
     * Update Order Status (writes to Supabase and Local MySQL DB status)
     */
    public function updateOrderStatus(Request $request, $id)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $status = $request->input('status'); // e.g. New, Confirmed, Dispatched, Delivered, Cancelled
        
        // 1. Update in remote Supabase
        $this->supabase->updateOrderStatus($id, $status);

        // 2. Update in local MySQL
        $localStatusMap = [
            'new' => 'pending',
            'pending' => 'pending',
            'confirmed' => 'confirmed',
            'dispatched' => 'dispatched',
            'delivered' => 'delivered',
            'cancelled' => 'cancelled',
        ];
        $localStatus = $localStatusMap[strtolower($status)] ?? 'pending';

        $localOrder = Order::find($id);
        if ($localOrder) {
            $localOrder->status = $localStatus;
            $localOrder->save();
        }

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Delete Order
     */
    public function deleteOrder($id)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        // 1. Delete from remote Supabase
        $this->supabase->deleteOrder($id);

        // 2. Delete from local MySQL
        $localOrder = Order::find($id);
        if ($localOrder) {
            $localOrder->delete();
        }

        return back()->with('success', 'Order deleted successfully.');
    }

    /**
     * Upsert Landing Page (Create & Update)
     */
    public function upsertLandingPage(Request $request)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $id = $request->input('id'); // Slug
        $id = strtolower(trim($id));
        $id = preg_replace('/[^a-z0-9\-]/', '', str_replace(' ', '-', $id));

        if (empty($id)) {
            return back()->withErrors(['landing_page' => 'Slug cannot be empty.']);
        }

        $components = $request->input('components');
        $componentsArray = is_string($components) ? json_decode($components, true) : $components;

        $data = [
            'title' => $request->input('title') ?? 'New Landing Page',
            'custom_domain' => $request->input('custom_domain') ? strtolower(trim($request->input('custom_domain'))) : null,
            'gtm_id' => $request->input('gtm_id') ? trim($request->input('gtm_id')) : null,
            'template' => $request->input('template') ?? 'default',
            'custom_css' => $request->input('custom_css') ?? '',
            'components' => $componentsArray ?? [],
        ];

        $success = $this->supabase->upsertLandingPage($id, $data);
        if ($success) {
            Cache::forget('cb_landing_pages');
            return back()->with('success', 'Landing page saved successfully.');
        }

        return back()->withErrors(['landing_page' => 'Failed to save landing page to Supabase.']);
    }

    /**
     * Delete Landing Page
     */
    public function deleteLandingPage($id)
    {
        if (!$this->checkAuth()) { return response()->json(['error' => 'Unauthorized'], 401); }

        $success = $this->supabase->deleteLandingPage($id);
        if ($success) {
            Cache::forget('cb_landing_pages');
            return back()->with('success', 'Landing page deleted successfully.');
        }

        return back()->withErrors(['landing_page' => 'Failed to delete landing page.']);
    }
}
