-- Wedding invitation schema.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
--
-- Security model: guests never get direct table access. The public (anon) key
-- can only call the functions below, which look an invitation up by its slug,
-- so nobody can list the guest list or post a wish under someone else's name.

create extension if not exists pgcrypto;

-- One row per invitation link (a person or a household).
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- used in the link: /yusuf-chatab
  name text not null,                     -- shown on the cover: "Yusuf Chatab"
  plus_one_allowed boolean not null default false,
  -- which events this invitation covers: both, akad (Akad Nikah) or reception
  events text not null default 'both' check (events in ('both', 'akad', 'reception')),
  phone text,
  created_at timestamptz not null default now()
);

-- One RSVP per invitation; submitting again updates it.
create table if not exists rsvps (
  invitation_id uuid primary key references invitations(id) on delete cascade,
  attending boolean not null,
  bringing_plus_one boolean not null default false,
  plus_one_name text,
  updated_at timestamptz not null default now()
);

-- Wishes / comments shown publicly on the invitation.
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists wishes_created_at_idx on wishes (created_at desc);

alter table invitations enable row level security;
alter table rsvps enable row level security;
alter table wishes enable row level security;
-- No policies on purpose: anon/authenticated roles get no direct access.
-- The service-role key (import script, admin) bypasses RLS.

-- ---------------------------------------------------------------------------
-- Public functions
-- ---------------------------------------------------------------------------

create or replace function get_invitation(p_slug text)
returns table (
  name text,
  plus_one_allowed boolean,
  events text,
  attending boolean,
  bringing_plus_one boolean,
  plus_one_name text
)
language sql
security definer
set search_path = public
as $$
  select i.name, i.plus_one_allowed, i.events, r.attending, r.bringing_plus_one, r.plus_one_name
  from invitations i
  left join rsvps r on r.invitation_id = i.id
  where i.slug = p_slug;
$$;

create or replace function submit_rsvp(
  p_slug text,
  p_attending boolean,
  p_bringing_plus_one boolean,
  p_plus_one_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv invitations;
  v_plus boolean;
begin
  select * into v_inv from invitations where slug = p_slug;
  if not found then
    raise exception 'invitation not found';
  end if;

  -- A plus one only counts if the invitation allows it and the guest is coming.
  v_plus := p_attending and v_inv.plus_one_allowed and coalesce(p_bringing_plus_one, false);

  insert into rsvps (invitation_id, attending, bringing_plus_one, plus_one_name, updated_at)
  values (
    v_inv.id,
    p_attending,
    v_plus,
    case when v_plus then nullif(left(trim(p_plus_one_name), 100), '') end,
    now()
  )
  on conflict (invitation_id) do update set
    attending = excluded.attending,
    bringing_plus_one = excluded.bringing_plus_one,
    plus_one_name = excluded.plus_one_name,
    updated_at = now();
end;
$$;

create or replace function add_wish(p_slug text, p_message text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_msg text := left(trim(p_message), 500);
begin
  select id into v_id from invitations where slug = p_slug;
  if v_id is null then
    raise exception 'invitation not found';
  end if;
  if v_msg = '' then
    raise exception 'message is empty';
  end if;
  -- Light spam guard: at most 5 wishes per invitation.
  if (select count(*) from wishes where invitation_id = v_id) >= 5 then
    raise exception 'too many wishes';
  end if;
  insert into wishes (invitation_id, message) values (v_id, v_msg);
end;
$$;

create or replace function list_wishes(p_limit int default 100)
returns table (
  id uuid,
  name text,
  message text,
  attending boolean,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select w.id, i.name, w.message, r.attending, w.created_at
  from wishes w
  join invitations i on i.id = w.invitation_id
  left join rsvps r on r.invitation_id = i.id
  order by w.created_at desc
  limit least(greatest(p_limit, 1), 500);
$$;

revoke all on function get_invitation(text) from public;
revoke all on function submit_rsvp(text, boolean, boolean, text) from public;
revoke all on function add_wish(text, text) from public;
revoke all on function list_wishes(int) from public;
grant execute on function get_invitation(text) to anon, authenticated;
grant execute on function submit_rsvp(text, boolean, boolean, text) to anon, authenticated;
grant execute on function add_wish(text, text) to anon, authenticated;
grant execute on function list_wishes(int) to anon, authenticated;

-- Handy view for you in the dashboard (Table Editor → rsvp_summary).
create or replace view rsvp_summary with (security_invoker = true) as
select
  i.name,
  i.slug,
  i.events,
  i.plus_one_allowed,
  case when r.attending is null then 'pending'
       when r.attending then 'attending'
       else 'not attending' end as status,
  coalesce(r.bringing_plus_one, false) as bringing_plus_one,
  r.plus_one_name,
  case when r.attending then 1 + (case when r.bringing_plus_one then 1 else 0 end) else 0 end as headcount,
  r.updated_at
from invitations i
left join rsvps r on r.invitation_id = i.id
order by i.name;

-- Wishes with guest names, for the dashboard (Table Editor → wishes_summary).
create or replace view wishes_summary with (security_invoker = true) as
select
  i.name as guest,
  i.slug,
  case when r.attending is null then 'no reply yet'
       when r.attending then 'attending'
       else 'not attending' end as rsvp,
  w.message,
  w.created_at
from wishes w
join invitations i on i.id = w.invitation_id
left join rsvps r on r.invitation_id = i.id
order by w.created_at desc;
