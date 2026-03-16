-- Clothify merchandising upgrade
-- 1) Low stock support
-- 2) Featured product flags
-- 3) Campaign badge support

alter table if exists public.products
  add column if not exists stock_quantity integer not null default 20;

alter table if exists public.products
  add column if not exists is_featured boolean not null default false;

alter table if exists public.products
  add column if not exists campaign_badge text;

create index if not exists idx_products_stock_quantity
  on public.products (stock_quantity);

create index if not exists idx_products_is_featured
  on public.products (is_featured);
