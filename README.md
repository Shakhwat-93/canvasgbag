# CanvasBag

Premium, mobile-first ecommerce MVP for Bangladesh canvas bag sales. Built with Next.js App Router,
Tailwind, shadcn/ui, Framer Motion, Supabase/PostgreSQL architecture, Cloudinary-ready image
configuration, COD checkout, and analytics hooks.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` and fill the values you use:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
```

Without Supabase credentials, checkout runs in demo mode and creates a local-looking order id so the
full conversion flow can be tested immediately.

## Supabase

Run `supabase/schema.sql` in a Supabase SQL editor to create the MVP commerce tables:

- products, product images, categories, variants, inventory
- customers, addresses, orders, order items
- reviews, discounts, analytics events

Public reads are covered with RLS policies. Order writes should go through the server-side service role.

## Core Routes

- `/`
- `/category/[slug]`
- `/product/[slug]`
- `/cart`
- `/checkout`
- `/order/success/[id]`

## Quality Checks

```bash
npm run lint
npm run build
```
