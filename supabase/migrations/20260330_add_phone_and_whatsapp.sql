alter table public.profiles
  add column if not exists phone_number text;

alter table public.activity_participants
  add column if not exists phone_number text;

alter table public.activity_participants
  add column if not exists whatsapp_opt_in boolean not null default false;
