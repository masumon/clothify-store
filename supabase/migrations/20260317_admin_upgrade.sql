-- Clothify admin upgrade migration
-- 1) Product draft mode support
-- 2) Persistent traffic analytics support

alter table if exists public.products
  add column if not exists is_published boolean not null default true;

create index if not exists idx_products_is_published
  on public.products (is_published);

create table if not exists public.page_visits (
  id bigserial primary key,
  visitor_id text not null,
  path text not null,
  source text not null default 'Direct',
  country text not null default 'Unknown',
  created_at timestamptz not null default now()
);

create index if not exists idx_page_visits_created_at
  on public.page_visits (created_at desc);

create index if not exists idx_page_visits_visitor_created
  on public.page_visits (visitor_id, created_at desc);

create index if not exists idx_page_visits_source_created
  on public.page_visits (source, created_at desc);
