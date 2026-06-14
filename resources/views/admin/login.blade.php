<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | CanvasBag</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-4 text-slate-800 font-poppins">
    <div class="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6">
        <!-- Brand Info -->
        <div class="text-center space-y-2">
            <span class="inline-grid h-12 w-12 place-items-center rounded-full bg-black text-white shadow-md mb-2">
                <img src="/brand/logo.webp" alt="CanvasBag Logo" width="28" height="28" class="object-contain" />
            </span>
            <h1 class="text-xl font-black uppercase tracking-widest text-slate-900">CanvasBag Admin</h1>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Secured with Supabase Auth</p>
        </div>

        <!-- Session Messages -->
        @if ($errors->any())
            <div class="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-xs font-semibold space-y-1">
                @foreach ($errors->all() as $error)
                    <p>⚠️ {{ $error }}</p>
                @endforeach
            </div>
        @endif

        @if (session('success'))
            <div class="bg-green-50 border border-green-200 text-green-600 rounded-2xl p-4 text-xs font-semibold">
                ✅ {{ session('success') }}
            </div>
        @endif

        <!-- Login Form -->
        <form action="/admin/login" method="POST" class="space-y-4">
            @csrf
            <div class="space-y-1.5">
                <label for="email" class="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="admin@canvasbagbd.com" class="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-sm font-medium bg-slate-50/25" />
            </div>

            <div class="space-y-1.5">
                <label for="password" class="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <input type="password" id="password" name="password" required placeholder="••••••••" class="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-sm font-medium bg-slate-50/25" />
            </div>

            <button type="submit" class="w-full h-11 bg-black text-white hover:bg-black/90 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md mt-2">
                Log In
            </button>
        </form>

        <div class="text-center pt-2">
            <a href="/" class="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors">&larr; Back to Store</a>
        </div>
    </div>
</body>
</html>
