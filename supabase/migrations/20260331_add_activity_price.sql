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
