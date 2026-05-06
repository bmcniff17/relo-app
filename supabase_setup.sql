-- ── Relo App — Supabase Setup ────────────────────────────────────────────────
-- Run this entire file once in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run)

-- 1. Profiles table (one row per user, auto-created on signup)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. Saved data table (key/value store for neighborhoods, apartments, move prefs)
create table public.saved_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  key text not null,
  value jsonb,
  updated_at timestamptz default now(),
  unique(user_id, key)
);

alter table public.saved_data enable row level security;

create policy "Users can manage own data" on public.saved_data
  for all using (auth.uid() = user_id);


-- 3. Disable email confirmation so users can sign in immediately
-- Go to: Authentication → Providers → Email → toggle off "Confirm email"
-- (Can't be done via SQL — do it in the Supabase dashboard)


-- 4. Corporate relocation tables

create table public.employer_packages (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references auth.users(id) on delete cascade not null,
  company_name text not null,
  code text unique not null,
  stipend_amount numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz default now()
);

alter table public.employer_packages enable row level security;

create policy "Employers manage own packages" on public.employer_packages
  for all using (auth.uid() = employer_id);

create policy "Authenticated users can look up packages by code" on public.employer_packages
  for select using (auth.uid() is not null);


create table public.employee_packages (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references auth.users(id) on delete cascade not null,
  package_id uuid references public.employer_packages(id) on delete cascade not null,
  employee_name text,
  linked_at timestamptz default now(),
  unique(employee_id, package_id)
);

alter table public.employee_packages enable row level security;

create policy "Employees manage own links" on public.employee_packages
  for all using (auth.uid() = employee_id);

create policy "Employers view their employee links" on public.employee_packages
  for select using (
    exists (
      select 1 from public.employer_packages ep
      where ep.id = package_id and ep.employer_id = auth.uid()
    )
  );


create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references auth.users(id) on delete cascade not null,
  package_id uuid references public.employer_packages(id) on delete cascade not null,
  amount numeric(10,2) not null,
  category text not null,
  description text,
  receipt_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'flagged')),
  created_at timestamptz default now()
);

alter table public.expenses enable row level security;

create policy "Employees manage own expenses" on public.expenses
  for all using (auth.uid() = employee_id);

create policy "Employers view expenses in their packages" on public.expenses
  for select using (
    exists (
      select 1 from public.employer_packages ep
      where ep.id = package_id and ep.employer_id = auth.uid()
    )
  );

create policy "Employers update expense status" on public.expenses
  for update using (
    exists (
      select 1 from public.employer_packages ep
      where ep.id = package_id and ep.employer_id = auth.uid()
    )
  );


-- 5. Storage bucket for receipts
-- Go to: Storage → New bucket → name "receipts" → Private
-- Then add these storage policies in the dashboard under Storage → receipts → Policies:
--   INSERT: (auth.uid()::text = (storage.foldername(name))[1])
--   SELECT: (auth.uid()::text = (storage.foldername(name))[1])
--     OR exists (select 1 from public.employer_packages ep
--                join public.expenses ex on ex.package_id = ep.id
--                where ep.employer_id = auth.uid() and ex.receipt_url like '%' || name || '%')
