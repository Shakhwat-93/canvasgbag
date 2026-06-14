<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share settings and categories globally with caching
        \Illuminate\Support\Facades\View::composer('*', function ($view) {
            // Avoid calling database/Supabase during migrations or console commands
            if (app()->runningInConsole()) {
                $view->with([
                    'settings' => [],
                    'categories' => [],
                ]);
                return;
            }

            try {
                $supabase = app(\App\Services\SupabaseService::class);
                
                $settings = \Illuminate\Support\Facades\Cache::remember('cb_settings', 300, function () use ($supabase) {
                    return $supabase->getCatalogSettings();
                });

                $categories = \Illuminate\Support\Facades\Cache::remember('cb_categories', 300, function () use ($supabase) {
                    return $supabase->getCatalogCategories();
                });

                $view->with([
                    'settings' => $settings ?: [],
                    'categories' => $categories ?: [],
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("AppServiceProvider boot error: " . $e->getMessage());
                $view->with([
                    'settings' => [],
                    'categories' => [],
                ]);
            }
        });
    }

}
