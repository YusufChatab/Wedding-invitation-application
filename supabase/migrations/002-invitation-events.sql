-- Lets each invitation cover both events, or only the Akad Nikah or only the
-- Reception. Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run again. Existing invitations keep access to both events.

alter table invitations
  add column if not exists events text not null default 'both';

alter table invitations drop constraint if exists invitations_events_check;
alter table invitations
  add constraint invitations_events_check check (events in ('both', 'akad', 'reception'));

-- The return type changes, so the function has to be dropped and re-created.
drop function if exists get_invitation(text);

create function get_invitation(p_slug text)
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

revoke all on function get_invitation(text) from public;
grant execute on function get_invitation(text) to anon, authenticated;

-- Add the invited events to the dashboard summary. The view is dropped first
-- because a new column can't be added in the middle of an existing view.
drop view if exists rsvp_summary;
create view rsvp_summary with (security_invoker = true) as
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
