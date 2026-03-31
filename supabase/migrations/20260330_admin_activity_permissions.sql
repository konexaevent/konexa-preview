alter table public.activities
  add column if not exists age_range text check (age_range in ('18-25', '25-35', '35-50', '50+'));

alter table public.activities
  add column if not exists price text;

create table if not exists public.homepage_content (
  id text primary key default 'home',
  hero_carousel_images jsonb not null default '[]'::jsonb,
  hosts jsonb not null default '[]'::jsonb,
  memories_video_url text,
  memories_items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

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

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

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

alter table public.homepage_content enable row level security;

create policy "Homepage content is readable by everyone"
on public.homepage_content
for select
to anon, authenticated
using (true);

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

drop policy if exists "Hosts or admins can update participant status" on public.activity_participants;

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

insert into storage.buckets (id, name, public)
values ('activity-images', 'activity-images', true)
on conflict (id) do update
set public = excluded.public;

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
