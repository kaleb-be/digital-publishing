-- =============================================================================
-- Biir v2: Books, Chapters, Comments, Approval
-- Run in Supabase SQL Editor.
-- =============================================================================

-- 1. Books (replaces stories)
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  cover_url text,
  cover_source text check (cover_source in ('unsplash', 'custom')),
  author_clerk_id text not null,
  author_name text,
  genre text,
  tags text[] default '{}',
  chapter_prefix text,
  approval_status text check (approval_status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Chapters (book_id replaces story_id)
-- If you have an existing chapters table, drop it first: drop table if exists public.chapter_purchases; drop table if exists public.chapters;
create table if not exists public.chapters (
  id uuid default gen_random_uuid() primary key,
  book_id uuid not null references public.books(id) on delete cascade,
  title text not null,
  content_md text not null default '',
  order_index integer not null,
  is_premium boolean not null default false,
  price_credits integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Chapter purchases
create table if not exists public.chapter_purchases (
  id uuid default gen_random_uuid() primary key,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  clerk_user_id text not null,
  created_at timestamptz not null default now(),
  unique (chapter_id, clerk_user_id)
);

-- 4. Book comments
create table if not exists public.book_comments (
  id uuid default gen_random_uuid() primary key,
  book_id uuid not null references public.books(id) on delete cascade,
  clerk_user_id text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 5. Moderators (users who can approve books)
create table if not exists public.moderators (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null unique,
  created_at timestamptz not null default now()
);
