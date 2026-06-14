<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('customer_name', 255);
            $table->string('phone', 50);
            $table->string('city', 100);
            $table->string('area', 100);
            $table->text('address');
            $table->text('note')->nullable();
            $table->string('status', 50)->default('pending');
            $table->string('payment_method', 50)->default('cod');
            $table->integer('subtotal');
            $table->integer('delivery_fee')->default(0);
            $table->integer('discount')->default(0);
            $table->integer('total');
            $table->json('attribution')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->string('order_id', 36);
            $table->string('product_id', 100);
            $table->string('variant_id', 100);
            $table->string('product_name', 255);
            $table->string('variant_name', 255);
            $table->integer('unit_price');
            $table->integer('quantity');
            $table->integer('total');

            $table->foreign('order_id')
                  ->references('id')
                  ->on('orders')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
