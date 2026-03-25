insert into public.activities (title, summary, starts_at, city, hero_image_url, max_participants)
values
  (
    'Hosted dinner for people who want an easy first conversation',
    'A guided dinner with enough structure to break the ice without feeling forced.',
    '2026-03-27T19:30:00+00',
    'Madrid',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    10
  ),
  (
    'Coffee walk for calm conversations and low-pressure introductions',
    'A city walk and a neighbourhood cafe stop designed for first-time Konexa users.',
    '2026-03-28T17:45:00+00',
    'Madrid',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    8
  ),
  (
    'Cooking workshop where the activity does the social work for you',
    'Hands-on food prep, paired teams, and a shared table at the end of the session.',
    '2026-03-29T11:00:00+00',
    'Madrid',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    10
  ),
  (
    'Creative club for thoughtful people who prefer quieter plans',
    'Collage, prompts and relaxed group conversation in a hosted indoor setting.',
    '2026-03-30T16:30:00+00',
    'Madrid',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    8
  ),
  (
    'Sunday vermut with people who already know how Konexa feels',
    'Casual midday gathering ideal for reconnecting with familiar faces from past plans.',
    '2026-04-05T12:30:00+00',
    'Madrid',
    'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=80',
    10
  )
on conflict do nothing;

-- Optional after you create real users in Supabase Auth:
-- Replace the full_name filters below with names that exist in public.profiles.
--
-- insert into public.activity_participants (activity_id, user_id)
-- select a.id, p.id
-- from public.activities a
-- join public.profiles p on p.full_name = 'Alex Rivera'
-- where a.title = 'Hosted dinner for people who want an easy first conversation'
-- on conflict do nothing;
