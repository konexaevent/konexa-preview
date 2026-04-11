create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql
security definer
as $$
declare
  existing_role text;
  existing_first_name text;
  existing_last_name text;
  existing_full_name text;
  existing_avatar_url text;
begin
  select role, first_name, last_name, full_name, avatar_url
  into existing_role, existing_first_name, existing_last_name, existing_full_name, existing_avatar_url
  from public.profiles
  where id = new.id;

  insert into public.profiles (id, first_name, last_name, full_name, role, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'first_name', ''),
      existing_first_name,
      split_part(coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), ' ', 1)
    ),
    coalesce(nullif(new.raw_user_meta_data ->> 'last_name', ''), existing_last_name),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      existing_full_name,
      split_part(new.email, '@', 1)
    ),
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), existing_role, 'member'),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      existing_avatar_url,
      'https://api.dicebear.com/9.x/lorelei/svg?seed=' || coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
    )
  )
  on conflict (id) do update
  set
    first_name = coalesce(excluded.first_name, public.profiles.first_name),
    last_name = coalesce(excluded.last_name, public.profiles.last_name),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), public.profiles.role, excluded.role),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;
