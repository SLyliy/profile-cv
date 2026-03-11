-- Run this in Supabase SQL Editor

create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists feedback_messages_created_at_idx
  on public.feedback_messages (created_at desc);

alter table public.feedback_messages enable row level security;

drop policy if exists "feedback_read_all" on public.feedback_messages;
create policy "feedback_read_all"
  on public.feedback_messages
  for select
  using (true);

drop policy if exists "feedback_insert_all" on public.feedback_messages;
create policy "feedback_insert_all"
  on public.feedback_messages
  for insert
  with check (
    char_length(btrim(text)) > 0
    and char_length(text) <= 80
  );
