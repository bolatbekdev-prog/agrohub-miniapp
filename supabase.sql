create table if not exists public.leads (
 id bigint generated always as identity primary key,
 created_at timestamptz not null default now(),
 full_name text not null,
 phone text not null,
 region text,
 role text,
 service text,
 message text
);
alter table public.leads enable row level security;
-- Do not publish service_role credentials to the frontend. Only the server API writes leads.

-- Optional verified Telegram user ID (set by server after signature verification).
alter table public.leads add column if not exists telegram_user_id bigint;
