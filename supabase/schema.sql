-- 3D Man Box / 3D Man Club — Supabase Schema
-- Apply via: supabase db push  OR  paste in the SQL editor.

create extension if not exists "pgcrypto";

-- ============================================================
-- USERS PROFILES (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  stripe_customer_id text unique,
  total_credits int not null default 10,
  used_credits int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, total_credits)
  values (new.id, new.email, 10)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  stripe_customer_id text,
  email text not null,
  sku text not null,
  amount_total int not null,
  currency text not null default 'eur',
  mode text not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_email on public.orders (email);

-- ============================================================
-- INVOICES
-- ============================================================
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  stripe_invoice_id text unique not null,
  email text not null,
  amount_paid int not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  email text not null,
  sku text not null,
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- GENERATIONS (KI character generations)
-- ============================================================
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  prompt text not null,
  category text,
  variation_count int not null default 4,
  status text not null default 'pending',
  result_urls jsonb,
  credits_spent int not null default 1,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_gen_user on public.generations (user_id, created_at desc);

-- ============================================================
-- CREDITS LEDGER
-- ============================================================
create table if not exists public.credit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  email text not null,
  delta int not null,
  reason text not null,
  ref_id text,
  created_at timestamptz not null default now()
);

create or replace function public.grant_credits(user_email text, amount int)
returns void language plpgsql security definer as $$
declare
  uid uuid;
begin
  select id into uid from public.profiles where email = lower(user_email) limit 1;
  if uid is null then
    -- User noch nicht angelegt; Credits beim ersten Login zuteilen
    insert into public.credit_events (user_id, email, delta, reason)
    values (null, lower(user_email), amount, 'purchase_pending');
    return;
  end if;
  update public.profiles set total_credits = total_credits + amount, updated_at = now() where id = uid;
  insert into public.credit_events (user_id, email, delta, reason)
  values (uid, lower(user_email), amount, 'purchase');
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.orders        enable row level security;
alter table public.invoices      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.generations   enable row level security;
alter table public.credit_events enable row level security;

create policy "profiles: self read"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles: self update"
  on public.profiles for update using (auth.uid() = id);

create policy "generations: own"
  on public.generations for all using (auth.uid() = user_id);

create policy "orders: by email"
  on public.orders for select using (
    auth.jwt() ->> 'email' = email
  );

create policy "invoices: by email"
  on public.invoices for select using (
    auth.jwt() ->> 'email' = email
  );

create policy "subscriptions: by email"
  on public.subscriptions for select using (
    auth.jwt() ->> 'email' = email
  );

create policy "credit_events: own"
  on public.credit_events for select using (
    user_id = auth.uid() or auth.jwt() ->> 'email' = email
  );
