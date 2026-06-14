<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    // The primary key is not auto-incrementing
    public $incrementing = false;

    // The primary key type is string
    protected $keyType = 'string';

    // Disable default Eloquent timestamps since we use custom created_at
    public $timestamps = false;

    protected $fillable = [
        'id',
        'customer_name',
        'phone',
        'city',
        'area',
        'address',
        'note',
        'status',
        'payment_method',
        'subtotal',
        'delivery_fee',
        'discount',
        'total',
        'attribution',
        'created_at',
    ];

    protected $casts = [
        'attribution' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the items for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'id');
    }
}
