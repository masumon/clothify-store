-- Clothify order item integrity upgrade
-- 1) Persist individual cart lines for each order
-- 2) Support server-side amount verification and inventory reconciliation

create table if not exists public.order_items (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete restrict,
  selected_size text not null default 'Standard',
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0),
  line_total numeric not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id
  on public.order_items (order_id);

create index if not exists idx_order_items_product_id
  on public.order_items (product_id);
