-- Optional migration only. The prototype currently uses browser localStorage.
-- Do not enable shared browser access without authenticated ownership and suitable RLS policies.
create table if not exists public.products (
  id text primary key,
  name text not null check (length(trim(name)) > 0),
  category text not null default '',
  quantity integer not null default 0 check (quantity >= 0),
  unit_cost numeric(12,2) not null check (unit_cost >= 0),
  selling_price numeric(12,2) not null check (selling_price >= 0),
  expiry_date date not null,
  daily_sales numeric(12,3) not null default 0 check (daily_sales >= 0),
  extra_unit_cost numeric(12,2) not null default 0 check (extra_unit_cost >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- RLS policies depend on the app's identity/ownership model and must be added before cloud access is enabled.
