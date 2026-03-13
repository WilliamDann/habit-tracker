-- Strip @domain from existing usernames that look like emails
update public.profiles
set username = split_part(username, '@', 1)
where username like '%@%';

-- Update trigger to use email prefix for new users
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    display_name = coalesce(excluded.display_name, public.profiles.display_name);
  return new;
end;
$$ language plpgsql security definer;
