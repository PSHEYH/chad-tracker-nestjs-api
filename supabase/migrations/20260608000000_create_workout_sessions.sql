create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete restrict,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  calories_burned integer,
  constraint workout_sessions_finished_after_start
    check (finished_at is null or finished_at >= started_at),
  constraint workout_sessions_calories_burned_non_negative
    check (calories_burned is null or calories_burned >= 0)
);

create index if not exists workout_sessions_user_id_idx
  on public.workout_sessions(user_id);

create index if not exists workout_sessions_workout_id_idx
  on public.workout_sessions(workout_id);

alter table public.workout_sessions enable row level security;

-- The NestJS backend uses a secret/service-role key and is the only writer.
revoke all on table public.workout_sessions from anon, authenticated;
