<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseService
{
    protected string $catalogUrl;
    protected string $catalogKey;
    protected string $ordersUrl;
    protected string $ordersKey;

    public function __construct()
    {
        $this->catalogUrl = rtrim(config('services.supabase.catalog_url'), '/');
        $this->catalogKey = config('services.supabase.catalog_key') ?? '';
        $this->ordersUrl = rtrim(config('services.supabase.orders_url'), '/');
        $this->ordersKey = config('services.supabase.orders_key') ?? '';
    }

    /**
     * Helper to get common headers for Catalog DB requests.
     */
    protected function catalogHeaders(): array
    {
        return [
            'apikey' => $this->catalogKey,
            'Authorization' => 'Bearer ' . $this->catalogKey,
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Helper to get common headers for Orders DB requests.
     */
    protected function ordersHeaders(): array
    {
        return [
            'apikey' => $this->ordersKey,
            'Authorization' => 'Bearer ' . $this->ordersKey,
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Create a configured HTTP client wrapper.
     */
    protected function client(): \Illuminate\Http\Client\PendingRequest
    {
        $client = Http::asJson();
        if (config('app.env') === 'local') {
            return $client->withoutVerifying();
        }
        return $client;
    }

    /* ──────────────────────────────────────────────────────────
       CATALOG / SETTINGS / PRODUCTS / CATEGORIES APIS
       ────────────────────────────────────────────────────────── */

    /**
     * Get Settings
     */
    public function getCatalogSettings(): array
    {
        try {
            $response = $this->client()->withHeaders($this->catalogHeaders())
                ->get("{$this->catalogUrl}/rest/v1/cb_settings?id=eq.main_settings&select=*");

            if ($response->successful() && !empty($response->json())) {
                $rows = $response->json();
                $settings = $rows[0]['data'] ?? [];
                if (!empty($settings)) {
                    return $settings;
                }
            }
        } catch (\Exception $e) {
            Log::error("Supabase getCatalogSettings error: " . $e->getMessage());
        }

        return FallbackData::settings();
    }

    /**
     * Update Settings
     */
    public function updateCatalogSettings(array $settings): bool
    {
        try {
            $response = $this->client()->withHeaders(array_merge($this->catalogHeaders(), [
                'Prefer' => 'resolution=merge-duplicates',
            ]))->post("{$this->catalogUrl}/rest/v1/cb_settings", [
                'id' => 'main_settings',
                'data' => $settings,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase updateCatalogSettings error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get Products
     */
    public function getCatalogProducts(): array
    {
        try {
            $response = $this->client()->withHeaders($this->catalogHeaders())
                ->get("{$this->catalogUrl}/rest/v1/cb_products?select=*");

            if ($response->successful()) {
                $products = array_map(function ($row) {
                    return $row['data'] ?? [];
                }, $response->json() ?? []);
                if (!empty($products)) {
                    return $products;
                }
            }
        } catch (\Exception $e) {
            Log::error("Supabase getCatalogProducts error: " . $e->getMessage());
        }

        return FallbackData::products();
    }

    /**
     * Upsert Product
     */
    public function upsertCatalogProduct(string $productId, array $productData): bool
    {
        try {
            $response = $this->client()->withHeaders(array_merge($this->catalogHeaders(), [
                'Prefer' => 'resolution=merge-duplicates',
            ]))->post("{$this->catalogUrl}/rest/v1/cb_products", [
                'id' => $productId,
                'data' => $productData,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase upsertCatalogProduct error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete Product
     */
    public function deleteCatalogProduct(string $productId): bool
    {
        try {
            $response = $this->client()->withHeaders($this->catalogHeaders())
                ->delete("{$this->catalogUrl}/rest/v1/cb_products?id=eq.{$productId}");

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase deleteCatalogProduct error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get Categories
     */
    public function getCatalogCategories(): array
    {
        try {
            $response = $this->client()->withHeaders($this->catalogHeaders())
                ->get("{$this->catalogUrl}/rest/v1/cb_categories?select=*");

            if ($response->successful()) {
                $categories = array_map(function ($row) {
                    return $row['data'] ?? [];
                }, $response->json() ?? []);
                if (!empty($categories)) {
                    return $categories;
                }
            }
        } catch (\Exception $e) {
            Log::error("Supabase getCatalogCategories error: " . $e->getMessage());
        }

        return FallbackData::categories();
    }

    /**
     * Upsert Category
     */
    public function upsertCatalogCategory(string $categoryId, array $categoryData): bool
    {
        try {
            $response = $this->client()->withHeaders(array_merge($this->catalogHeaders(), [
                'Prefer' => 'resolution=merge-duplicates',
            ]))->post("{$this->catalogUrl}/rest/v1/cb_categories", [
                'id' => $categoryId,
                'data' => $categoryData,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase upsertCatalogCategory error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete Category
     */
    public function deleteCatalogCategory(string $categoryId): bool
    {
        try {
            $response = $this->client()->withHeaders($this->catalogHeaders())
                ->delete("{$this->catalogUrl}/rest/v1/cb_categories?id=eq.{$categoryId}");

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase deleteCatalogCategory error: " . $e->getMessage());
            return false;
        }
    }

    /* ──────────────────────────────────────────────────────────
       ORDERS APIS (ORDERS DB)
       ────────────────────────────────────────────────────────── */

    /**
     * Get Orders from Remote Supabase
     */
    public function getOrders(int $limit = 200): array
    {
        try {
            $response = $this->client()->withHeaders($this->ordersHeaders())
                ->get("{$this->ordersUrl}/rest/v1/orders?select=*&order=created_at.desc&limit={$limit}");

            if ($response->successful()) {
                return $response->json() ?? [];
            }
        } catch (\Exception $e) {
            Log::error("Supabase getOrders error: " . $e->getMessage());
        }

        return [];
    }

    /**
     * Insert Order to Remote Supabase
     */
    public function insertOrder(array $orderData): bool
    {
        try {
            $response = $this->client()->withHeaders(array_merge($this->ordersHeaders(), [
                'Prefer' => 'return=representation',
            ]))->post("{$this->ordersUrl}/rest/v1/orders", $orderData);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase insertOrder error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update Order Status in Remote Supabase
     */
    public function updateOrderStatus(string $orderId, string $status): bool
    {
        try {
            $response = $this->client()->withHeaders($this->ordersHeaders())
                ->patch("{$this->ordersUrl}/rest/v1/orders?id=eq.{$orderId}", [
                    'status' => $status,
                ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase updateOrderStatus error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete Order from Remote Supabase
     */
    public function deleteOrder(string $orderId): bool
    {
        try {
            $response = $this->client()->withHeaders($this->ordersHeaders())
                ->delete("{$this->ordersUrl}/rest/v1/orders?id=eq.{$orderId}");

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Supabase deleteOrder error: " . $e->getMessage());
            return false;
        }
    }

    /* ──────────────────────────────────────────────────────────
       SUPABASE AUTH APIS
       ────────────────────────────────────────────────────────── */

    /**
     * Authenticate email/password against Supabase Auth endpoints.
     */
    public function verifyAdminCredentials(string $email, string $password): ?array
    {
        try {
            $response = $this->client()->withHeaders([
                'apikey' => $this->catalogKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->catalogUrl}/auth/v1/token?grant_type=password", [
                'email' => $email,
                'password' => $password,
            ]);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error("Supabase verifyAdminCredentials error: " . $e->getMessage());
        }

        return null;
    }
}
