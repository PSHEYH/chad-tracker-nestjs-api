create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  password_hash text not null,
  role text not null default 'user',
  token_version integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- The NestJS backend uses the service-role key and is the only writer.
revoke all on table public.users from anon, authenticated;
