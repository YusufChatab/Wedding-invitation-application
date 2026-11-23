-- Family guests with "NA" in the Pax column: their RSVP only asks whether
-- they're coming, with no number of guests (family has no seat limit).
-- Run once in Supabase after 004: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run again. Nothing is deleted.

alter table invitations add column if not exists ask_count boolean not null default true;

-- The NA guests already imported (Raziq's side). Later imports set this from the Excel.
update invitations set ask_count = false
where slug in ('uni-eri', 'uni-gina', 'bang-anton', 'bang-dut', 'ni-uci', 'da-os', 'demang', 'da-adi');

-- The return type changes, so the function has to be dropped and re-created.
drop function if exists get_invitation(text);

create function get_invitation(p_slug text)
returns table (
  name text,
  max_guests int,
  events text,
  attending boolean,
  guest_count int,
  is_open boolean,
  ask_count boolean
)
language sql
security definer
set search_path = public
as $$
  select i.name, i.max_guests, i.events, r.attending, r.guest_count, i.is_open, i.ask_count
  from invitations i
  left join rsvps r on r.invitation_id = i.id
  where i.slug = p_slug;
$$;

revoke all on function get_invitation(text) from public;
grant execute on function get_invitation(text) to anon, authenticated;

-- Dashboard summary: "family (NA)" guests show as attending with no headcount.
drop view if exists rsvp_summary;
create view rsvp_summary with (security_invoker = true) as
select
  i.name,
  i.side,
  i.slug,
  i.events,
  case when i.ask_count then i.max_guests::text else 'NA' end as pax,
  case when r.attending is null then 'pending'
       when r.attending then 'attending'
       else 'not attending' end as status,
  case when not r.attending then 0 when i.ask_count then r.guest_count end as headcount,
  r.updated_at
from invitations i
left join rsvps r on r.invitation_id = i.id
where not i.is_open
order by i.side, i.name;
