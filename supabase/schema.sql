create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  full_name text not null,
  birth_date date,
  phone_number text,
  role text not null default 'member' check (role in ('member', 'host', 'admin')),
  avatar_url text not null default 'https://api.dicebear.com/9.x/lorelei/svg?seed=konexa',
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  price text,
  starts_at timestamptz not null,
  city text not null,
  age_range text check (age_range in ('18-25', '25-35', '35-50', '50+')),
  hero_image_url text not null,
  image_focus_x numeric not null default 50,
  image_focus_y numeric not null default 50,
  image_zoom numeric not null default 1,
  host_user_id uuid references public.profiles (id) on delete set null,
  host_name text,
  host_avatar_url text,
  requires_approval boolean not null default false,
  max_participants integer not null default 8,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_participants (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  request_message text,
  phone_number text,
  whatsapp_opt_in boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (activity_id, user_id)
);

create table if not exists public.homepage_content (
  id text primary key default 'home',
  hero_carousel_images jsonb not null default '[]'::jsonb,
  hosts jsonb not null default '[]'::jsonb,
  memories_video_url text,
  memories_items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists phone_number text;

alter table public.activity_participants
  add column if not exists request_message text;

alter table public.activities
  add column if not exists age_range text check (age_range in ('18-25', '25-35', '35-50', '50+'));

alter table public.activities
  add column if not exists price text;

alter table public.activities
  add column if not exists image_focus_x numeric not null default 50;

alter table public.activities
  add column if not exists image_focus_y numeric not null default 50;

alter table public.activities
  add column if not exists image_zoom numeric not null default 1;

alter table public.activities
  add column if not exists host_name text;

alter table public.activities
  add column if not exists host_avatar_url text;

alter table public.activity_participants
  add column if not exists phone_number text;

alter table public.activity_participants
  add column if not exists whatsapp_opt_in boolean not null default false;

insert into public.homepage_content (
  id,
  hero_carousel_images,
  hosts,
  memories_video_url,
  memories_items
)
values (
  'home',
  '[
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80"
  ]'::jsonb,
  '[
    {"age":"18-25","name":"Ariadna Puig","role":"Host del grup 18-25","bio":"Fa de pont perquè la gent nova se senti integrada des del primer moment.","avatarUrl":"/ariadnapuig.jpg","videoUrl":"https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"},
    {"age":"25-35","name":"Sara Renart","role":"Host del grup 25-35","bio":"Cuida l''ambient i ajuda que les converses surtin de manera natural.","avatarUrl":"https://api.dicebear.com/9.x/lorelei/svg?seed=Sara","videoUrl":"https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"},
    {"age":"35-50","name":"Lucas Moreno","role":"Host del grup 35-50","bio":"Acompanya el grup perquè tothom se senti comode i benvingut.","avatarUrl":"https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas","videoUrl":"https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"},
    {"age":"50+","name":"Elena Vega","role":"Host del grup +50","bio":"Transmet calma i dona suport si algu necessita un primer punt de referencia.","avatarUrl":"https://api.dicebear.com/9.x/lorelei/svg?seed=Elena","videoUrl":"https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"}
  ]'::jsonb,
  'https://www.youtube.com/embed/Scxs7L0vhZ4?si=Vv8H7MLegQmCj0xy',
  '[
    {"title":"Sopars amb conversa facil","imageUrl":"https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"},
    {"title":"Passejos tranquils amb cafe","imageUrl":"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"},
    {"title":"Tallers creatius en grup petit","imageUrl":"https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80"}
  ]'::jsonb
)
on conflict (id) do nothing;

create table if not exists public.user_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  connected_user_id uuid not null references public.profiles (id) on delete cascade,
  shared_activities_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, connected_user_id),
  check (user_id <> connected_user_id)
);

create table if not exists public.connection_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  connected_user_id uuid not null references public.profiles (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, connected_user_id, activity_id),
  check (user_id <> connected_user_id)
);

create index if not exists idx_activity_participants_user_id
  on public.activity_participants (user_id);

create index if not exists idx_activity_participants_activity_id
  on public.activity_participants (activity_id);

create index if not exists idx_user_connections_user_id
  on public.user_connections (user_id, shared_activities_count desc);

create index if not exists idx_connection_activities_user_id
  on public.connection_activities (user_id, connected_user_id);

create or replace view public.activity_cards as
select
  a.id,
  a.title,
  a.summary,
  a.price,
  a.starts_at,
  a.city,
  a.age_range,
  a.hero_image_url,
  a.image_focus_x,
  a.image_focus_y,
  a.image_zoom,
  a.host_user_id,
  a.host_name,
  a.host_avatar_url,
  a.requires_approval,
  a.max_participants,
  count(ap.id)::int as participant_count
from public.activities a
left join public.activity_participants ap on ap.activity_id = a.id
group by a.id;

create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql
security definer
as $$
declare
  existing_role text;
begin
  select role
  into existing_role
  from public.profiles
  where id = new.id;

  insert into public.profiles (id, first_name, last_name, full_name, role, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', split_part(coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), ' ', 1)),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), existing_role, 'member'),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      'https://api.dicebear.com/9.x/lorelei/svg?seed=' || coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
    )
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    full_name = excluded.full_name,
    role = coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), public.profiles.role, excluded.role),
    avatar_url = excluded.avatar_url;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row execute function public.sync_profile_from_auth();

create or replace function public.rebuild_connection_for_pair(
  p_user_id uuid,
  p_connected_user_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  shared_count integer;
begin
  if p_user_id = p_connected_user_id then
    return;
  end if;

  delete from public.connection_activities
  where user_id = p_user_id
    and connected_user_id = p_connected_user_id;

  insert into public.connection_activities (user_id, connected_user_id, activity_id)
  select
    p_user_id,
    p_connected_user_id,
    ap1.activity_id
  from public.activity_participants ap1
  join public.activity_participants ap2
    on ap2.activity_id = ap1.activity_id
   and ap2.user_id = p_connected_user_id
  where ap1.user_id = p_user_id
  on conflict do nothing;

  select count(*)::int
  into shared_count
  from public.connection_activities
  where user_id = p_user_id
    and connected_user_id = p_connected_user_id;

  if shared_count > 0 then
    insert into public.user_connections (user_id, connected_user_id, shared_activities_count)
    values (p_user_id, p_connected_user_id, shared_count)
    on conflict (user_id, connected_user_id) do update
    set
      shared_activities_count = excluded.shared_activities_count,
      updated_at = now();
  else
    delete from public.user_connections
    where user_id = p_user_id
      and connected_user_id = p_connected_user_id;
  end if;
end;
$$;

create or replace function public.refresh_connections_from_activity()
returns trigger
language plpgsql
security definer
as $$
declare
  activity_user_id uuid;
begin
  for activity_user_id in
    select distinct user_id
    from public.activity_participants
    where activity_id = coalesce(new.activity_id, old.activity_id)
      and user_id <> coalesce(new.user_id, old.user_id)
  loop
    perform public.rebuild_connection_for_pair(coalesce(new.user_id, old.user_id), activity_user_id);
    perform public.rebuild_connection_for_pair(activity_user_id, coalesce(new.user_id, old.user_id));
  end loop;

  return coalesce(new, old);
end;
$$;

drop trigger if exists refresh_connections_on_activity_participants on public.activity_participants;
create trigger refresh_connections_on_activity_participants
after insert or delete on public.activity_participants
for each row execute function public.refresh_connections_from_activity();

alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.activity_participants enable row level security;
alter table public.user_connections enable row level security;
alter table public.connection_activities enable row level security;
alter table public.homepage_content enable row level security;

create policy "Profiles are readable by authenticated users"
on public.profiles
for select
to authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Activities are readable by everyone"
on public.activities
for select
to anon, authenticated
using (true);

create policy "Homepage content is readable by everyone"
on public.homepage_content
for select
to anon, authenticated
using (true);

create policy "Admins can create activities"
on public.activities
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Admins can update activities"
on public.activities
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Admins can delete activities"
on public.activities
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Admins can update homepage content"
on public.homepage_content
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Admins can insert homepage content"
on public.homepage_content
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Participants are readable by authenticated users"
on public.activity_participants
for select
to authenticated
using (true);

create policy "Users can join an activity"
on public.activity_participants
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can update participant status"
on public.activity_participants
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Users can view their own connections"
on public.user_connections
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can view their own shared connection activities"
on public.connection_activities
for select
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('activity-images', 'activity-images', true)
on conflict (id) do update
set public = excluded.public;

create policy "Avatar images are public"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Activity images are public"
on storage.objects
for select
to public
using (bucket_id = 'activity-images');

create policy "Admins can upload activity images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'activity-images'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Admins can update activity images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'activity-images'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  bucket_id = 'activity-images'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "Admins can delete activity images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'activity-images'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);
