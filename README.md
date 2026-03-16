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
