-- Profiles table
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Anyone authenticated can view profiles"
  on profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- Auto-create profile on signup
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Habits table
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles on delete cascade,
  name text not null,
  color text not null default '#10b981',
  frequency int[] not null default '{0,1,2,3,4,5,6}',
  created_at timestamptz default now()
);

alter table habits enable row level security;

-- Completions table
create table completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits on delete cascade,
  user_id uuid not null,
  completed_date date not null,
  created_at timestamptz default now(),
  unique (habit_id, completed_date)
);

alter table completions enable row level security;

-- Buddy requests table (must be created before is_buddy function)
create type buddy_status as enum ('pending', 'accepted', 'declined');

create table buddy_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references profiles on delete cascade,
  to_user_id uuid references profiles on delete cascade,
  invite_code text unique,
  status buddy_status not null default 'pending',
  created_at timestamptz default now(),
  unique (from_user_id, to_user_id)
);

alter table buddy_requests enable row level security;

-- Buddy helper function (depends on buddy_requests table)
create function is_buddy(other_user_id uuid)
returns boolean as $$
  select exists (
    select 1 from buddy_requests
    where status = 'accepted'
      and (
        (from_user_id = auth.uid() and to_user_id = other_user_id)
        or (from_user_id = other_user_id and to_user_id = auth.uid())
      )
  );
$$ language sql security definer stable;

-- RLS policies for habits
create policy "Owner can manage own habits"
  on habits for all
  to authenticated
  using (auth.uid() = user_id);

create policy "Buddies can view habits"
  on habits for select
  to authenticated
  using (is_buddy(user_id));

-- RLS policies for completions
create policy "Owner can manage own completions"
  on completions for all
  to authenticated
  using (auth.uid() = user_id);

create policy "Buddies can view completions"
  on completions for select
  to authenticated
  using (is_buddy(user_id));

-- RLS policies for buddy requests
create policy "Users can view own buddy requests"
  on buddy_requests for select
  to authenticated
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Users can insert buddy requests"
  on buddy_requests for insert
  to authenticated
  with check (auth.uid() = from_user_id);

create policy "Recipient can update buddy request status"
  on buddy_requests for update
  to authenticated
  using (auth.uid() = to_user_id);

-- Updated_at trigger for profiles
create function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();
