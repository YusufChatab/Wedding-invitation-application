-- Open invitations: one shared link for a whole family (Keluarga Besar), with
-- no RSVP form. Anyone with the link can leave a wish, signed with the name
-- they type in.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run again. Nothing is deleted.

alter table invitations add column if not exists is_open boolean not null default false;

alter table wishes add column if not exists guest_name text;
alter table wishes drop constraint if exists wishes_guest_name_check;
alter table wishes add constraint wishes_guest_name_check
  check (guest_name is null or char_length(guest_name) between 1 and 60);

-- The two family links, Resepsi only.
insert into invitations (slug, name, events, max_guests, side, is_open) values
  ('keluarga-besar-chatab', 'Keluarga Besar Chatab', 'reception', 1, 'Raziq', true),
  ('keluarga-besar-umi-syamsyiah', 'Keluarga Besar Umi Syamsyiah', 'reception', 1, 'Raziq', true)
on conflict (slug) do update set
  name = excluded.name,
  events = excluded.events,
  is_open = true;

-- The return type changes, so the function has to be dropped and re-created.
drop function if exists get_invitation(text);

create function get_invitation(p_slug text)
returns table (
  name text,
  max_guests int,
  events text,
  attending boolean,
  guest_count int,
  is_open boolean
)
language sql
security definer
set search_path = public
as $$
  select i.name, i.max_guests, i.events, r.attending, r.guest_count, i.is_open
  from invitations i
  left join rsvps r on r.invitation_id = i.id
  where i.slug = p_slug;
$$;

-- A wish on an open link, signed with the visitor's own name.
create or replace function add_open_wish(p_slug text, p_name text, p_message text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text := left(trim(p_name), 60);
  v_msg text := left(trim(p_message), 500);
begin
  select id into v_id from invitations where slug = p_slug and is_open;
  if v_id is null then
    raise exception 'invitation not found';
  end if;
  if v_name = '' or v_msg = '' then
    raise exception 'name or message is empty';
  end if;
  -- Spam guards: the same name can't post the same wish twice, and each
  -- family link takes at most 1000 wishes.
  if exists (select 1 from wishes where invitation_id = v_id and lower(guest_name) = lower(v_name) and message = v_msg) then
    return;
  end if;
  if (select count(*) from wishes where invitation_id = v_id) >= 1000 then
    raise exception 'too many wishes';
  end if;
  insert into wishes (invitation_id, guest_name, message) values (v_id, v_name, v_msg);
end;
$$;

-- Personal links keep their own limit; open links use add_open_wish instead.
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
  select id into v_id from invitations where slug = p_slug and not is_open;
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

-- Open links have no RSVP.
create or replace function submit_rsvp_guests(p_slug text, p_attending boolean, p_guests int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv invitations;
  v_count int;
begin
  select * into v_inv from invitations where slug = p_slug and not is_open;
  if not found then
    raise exception 'invitation not found';
  end if;

  v_count := case when p_attending then least(greatest(coalesce(p_guests, 1), 1), v_inv.max_guests) else 0 end;

  insert into rsvps (invitation_id, attending, bringing_plus_one, plus_one_name, guest_count, updated_at)
  values (v_inv.id, p_attending, v_count > 1, null, v_count, now())
  on conflict (invitation_id) do update set
    attending = excluded.attending,
    bringing_plus_one = excluded.bringing_plus_one,
    plus_one_name = null,
    guest_count = excluded.guest_count,
    updated_at = now();
end;
$$;

-- Wishes show the typed name when there is one.
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
  select w.id, coalesce(w.guest_name, i.name), w.message, r.attending, w.created_at
  from wishes w
  join invitations i on i.id = w.invitation_id
  left join rsvps r on r.invitation_id = i.id
  order by w.created_at desc
  limit least(greatest(p_limit, 1), 500);
$$;

revoke all on function get_invitation(text) from public;
revoke all on function add_open_wish(text, text, text) from public;
grant execute on function get_invitation(text) to anon, authenticated;
grant execute on function add_open_wish(text, text, text) to anon, authenticated;

-- Dashboard (Table Editor → wishes_summary): who wrote it, and on which link.
drop view if exists wishes_summary;
create view wishes_summary with (security_invoker = true) as
select
  coalesce(w.guest_name, i.name) as guest,
  i.name as invitation,
  i.slug,
  case when i.is_open then 'open link'
       when r.attending is null then 'no reply yet'
       when r.attending then 'attending'
       else 'not attending' end as rsvp,
  w.message,
  w.created_at
from wishes w
join invitations i on i.id = w.invitation_id
left join rsvps r on r.invitation_id = i.id
order by w.created_at desc;

-- Keep the open links out of the RSVP headcount summary.
drop view if exists rsvp_summary;
create view rsvp_summary with (security_invoker = true) as
select
  i.name,
  i.side,
  i.slug,
  i.events,
  i.max_guests,
  case when r.attending is null then 'pending'
       when r.attending then 'attending'
       else 'not attending' end as status,
  case when r.attending then r.guest_count else 0 end as headcount,
  r.updated_at
from invitations i
left join rsvps r on r.invitation_id = i.id
where not i.is_open
order by i.side, i.name;
