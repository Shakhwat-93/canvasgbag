@extends('layouts.app')

@section('title', ($category['name'] ?? 'Category') . ' | CanvasBag')

@section('content')
<section class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center mb-8 text-center">
        <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{{ $category['name'] ?? 'Category' }}</h1>
        @if(!empty($category['description']))
            <p class="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl">{{ $category['description'] }}</p>
        @endif
        <span class="mt-2.5 h-1 w-12 rounded bg-[var(--primary)]" />
    </div>

    @if(empty($products))
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <p class="text-sm font-semibold text-slate-400">No products found in this category.</p>
            <a href="/shop" class="mt-4 bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">Browse Shop</a>
        </div>
    @else
        <div class="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4 pt-4">
            @foreach($products as $product)
                @include('components.product-card', ['product' => $product])
            @endforeach
        </div>
    @endif
</section>
@endsection
