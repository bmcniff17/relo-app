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
