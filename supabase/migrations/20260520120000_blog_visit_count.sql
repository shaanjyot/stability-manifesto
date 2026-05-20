-- Page view counter for blog posts (incremented on each detail page load).

alter table public.blogs
  add column if not exists visit_count bigint not null default 0;

comment on column public.blogs.visit_count is 'Incremented once per request to /blogs/:slug (approximate page views).';

-- Atomic increment callable via PostgREST; security definer bypasses RLS for the update only.
create or replace function public.increment_blog_visit (p_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.blogs
  set visit_count = visit_count + 1
  where slug = p_slug;
end;
$$;

grant execute on function public.increment_blog_visit (text) to anon, authenticated;
