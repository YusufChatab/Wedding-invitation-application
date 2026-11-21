-- Family invitations: each invitation can be for several people (the "pax"
-- column in the guest Excel), and the RSVP records how many are coming.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run again. Nothing is deleted: existing invitations get 2 seats if
-- they allowed a plus one, otherwise 1, and existing RSVPs keep their headcount.

-- The backfills only run when the column is first added, so running this file
-- again never overwrites newer headcounts.
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'invitations' and column_name = 'max_guests') then
    alter table invitations add column max_guests int not null default 1;
    update invitations set max_guests = 2 where plus_one_allowed;
  end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'rsvps' and column_name = 'guest_count') then
    alter table rsvps add column guest_count int not null default 1;
    update rsvps set guest_count = case when not attending then 0 when bringing_plus_one then 2 else 1 end;
  end if;
end $$;

alter table invitations add column if not exists side text; -- whose guest: Farah or Raziq
alter table invitations drop constraint if exists invitations_max_guests_check;
alter table invitations add constraint invitations_max_guests_check check (max_guests between 1 and 20);

-- The return type changes, so the function has to be dropped and re-created.
drop function if exists get_invitation(text);

create function get_invitation(p_slug text)
returns table (
  name text,
  max_guests int,
  events text,
  attending boolean,
  guest_count int
)
language sql
security definer
set search_path = public
as $$
  select i.name, i.max_guests, i.events, r.attending, r.guest_count
  from invitations i
  left join rsvps r on r.invitation_id = i.id
  where i.slug = p_slug;
$$;

-- RSVP with a headcount, capped at the invitation's seats.
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
  select * into v_inv from invitations where slug = p_slug;
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

revoke all on function get_invitation(text) from public;
revoke all on function submit_rsvp_guests(text, boolean, int) from public;
grant execute on function get_invitation(text) to anon, authenticated;
grant execute on function submit_rsvp_guests(text, boolean, int) to anon, authenticated;

-- Dashboard summary (Table Editor → rsvp_summary), now with seats and headcount.
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
order by i.side, i.name;
