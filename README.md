# Clothify CMS

Next.js + Supabase powered ecommerce CMS.

Features

- Dynamic products
- Checkout with bKash
- Admin dashboard
- Supabase database

## Migration (Required for Draft + Persistent Analytics)

Run the SQL file below in Supabase SQL Editor:

- `supabase/migrations/20260317_admin_upgrade.sql`

This migration adds:

- `products.is_published` for draft/publish workflow
- `page_visits` table for persistent traffic analytics

## Merchandising Migration (Low Stock + Featured + Campaign Badge)

Run this SQL file in Supabase SQL Editor:

- `supabase/migrations/20260317_product_merchandising_upgrade.sql`

This migration adds:

- `products.stock_quantity`
- `products.is_featured`
- `products.campaign_badge`

## প্রোডাকশন ভেরিফিকেশন রিপোর্ট (2026-03-17)

স্ট্যাটাস: সফল

- GitHub sync: `main` branch up-to-date
- Vercel production deploy: সফল
- Build check (`npm run build`): সফল (compile + type + lint)
- Live route check:
  - `/` -> 200
  - `/checkout` -> 200
  - `/order-success` -> 200
  - `/admin/orders` -> 401 (expected, auth protected)
  - `/api/sumonix` -> 405 on GET (expected, POST-only endpoint)
- Live API smoke test (valid payload):
  - `POST /api/sumonix` -> সফল
  - `POST /api/track-visit` -> সফল
- Merchandising data quality:
  - `null_stock = 0`
  - `negative_stock = 0`
  - `null_featured = 0`

## একক SQL স্ক্রিপ্ট (Migration + Health Check)

Supabase SQL Editor-এ নিচের স্ক্রিপ্ট একবার চালালেই column + index + data quality verify করা যাবে:

```sql
begin;

alter table if exists public.products
  add column if not exists stock_quantity integer default 20;

alter table if exists public.products
  add column if not exists is_featured boolean default false;

alter table if exists public.products
  add column if not exists campaign_badge text;

update public.products
set stock_quantity = 20
where stock_quantity is null;

update public.products
set is_featured = false
where is_featured is null;

alter table public.products
  alter column stock_quantity set not null,
  alter column stock_quantity set default 20,
  alter column is_featured set not null,
  alter column is_featured set default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_stock_quantity_nonnegative'
  ) then
    alter table public.products
      add constraint products_stock_quantity_nonnegative
      check (stock_quantity >= 0);
  end if;
end $$;

commit;

create index if not exists idx_products_stock_quantity
  on public.products (stock_quantity);

create index if not exists idx_products_is_featured
  on public.products (is_featured);

select
  'columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'products'
  and column_name in ('stock_quantity', 'is_featured', 'campaign_badge')
order by column_name;

select
  'indexes' as check_type,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'products'
  and indexname in ('idx_products_stock_quantity', 'idx_products_is_featured');

select
  'data_quality' as check_type,
  count(*) filter (where stock_quantity is null) as null_stock,
  count(*) filter (where stock_quantity < 0) as negative_stock,
  count(*) filter (where is_featured is null) as null_featured
from public.products;
```

## PWA (Installable CLOTHFY App)

PWA support has been enabled with `next-pwa`.

- App name: `CLOTHFY`
- Manifest: `public/manifest.webmanifest`
- Icons:
  - `public/icons/icon-192.png`
  - `public/icons/icon-512.png`
  - `public/icons/apple-touch-icon.png`
- Install prompt component: `components/PWAInstallPrompt.tsx`

Production behavior:

- Service worker is generated on `next build`
- Users get an install banner when browser `beforeinstallprompt` is available
- App can be installed to device home screen as `CLOTHFY`
