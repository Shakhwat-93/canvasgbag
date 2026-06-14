@extends('layouts.app')

@section('title', 'Shop All Premium Bags | CanvasBag')

@section('content')
<section class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center mb-8 text-center">
        <h1 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Our Premium Carry</h1>
        <span class="mt-2.5 h-1 w-12 rounded bg-[var(--primary)]" />
    </div>

    <div class="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4 pt-4">
        @foreach($products as $product)
            @include('components.product-card', ['product' => $product])
        @endforeach
    </div>
</section>
@endsection
