<?php

use App\Http\Controllers\StoreController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Storefront routes
Route::get('/', [StoreController::class, 'home'])->name('home');
Route::get('/shop', [StoreController::class, 'shop'])->name('shop');
Route::get('/category/{slug}', [StoreController::class, 'category'])->name('category');
Route::get('/product/{slug}', [StoreController::class, 'product'])->name('product');
Route::get('/checkout', [StoreController::class, 'checkout'])->name('checkout');
Route::post('/checkout', [StoreController::class, 'placeOrder'])->name('checkout.place');
Route::get('/order/success/{id}', [StoreController::class, 'success'])->name('order.success');
Route::get('/lp/{slug}', [StoreController::class, 'renderLandingPage'])->name('landing_page.show');

// Admin routes
Route::get('/admin/login', [AdminController::class, 'loginForm'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login']);
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
Route::post('/admin/settings', [AdminController::class, 'updateSettings'])->name('admin.settings');
Route::post('/admin/category', [AdminController::class, 'upsertCategory'])->name('admin.category.upsert');
Route::delete('/admin/category/{id}', [AdminController::class, 'deleteCategory'])->name('admin.category.delete');
Route::post('/admin/product', [AdminController::class, 'upsertProduct'])->name('admin.product.upsert');
Route::delete('/admin/product/{id}', [AdminController::class, 'deleteProduct'])->name('admin.product.delete');
Route::post('/admin/order/{id}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.order.status');
Route::delete('/admin/order/{id}', [AdminController::class, 'deleteOrder'])->name('admin.order.delete');
Route::post('/admin/landing-page', [AdminController::class, 'upsertLandingPage'])->name('admin.landing_page.upsert');
Route::delete('/admin/landing-page/{id}', [AdminController::class, 'deleteLandingPage'])->name('admin.landing_page.delete');

// Helper setup route for cPanel deployment without SSH/terminal access
Route::get('/cpanel-setup', function() {
    try {
        echo "<h3>cPanel Laravel Setup Tool</h3>";
        
        // 1. Run migrations
        echo "Running database migrations... ";
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        echo "<span style='color: green;'><b>Done.</b></span><br>";
        echo "<pre>" . \Illuminate\Support\Facades\Artisan::output() . "</pre>";

        // 2. Clear cache
        echo "Clearing cache... ";
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        \Illuminate\Support\Facades\Artisan::call('view:clear');
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        echo "<span style='color: green;'><b>Done.</b></span><br>";

        echo "<br><span style='color: green;'><b>Setup completed successfully!</b></span>";
        echo "<br><a href='/'>Go to Homepage</a>";
    } catch (\Exception $e) {
        echo "<br><span style='color: red;'><b>Error occurred during setup:</b></span><br>";
        echo "<pre>" . $e->getMessage() . "</pre>";
    }
});


