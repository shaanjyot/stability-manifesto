-- Blogs table: public reads via PostgREST; inserts/deletes only via service role (API routes).

create table public.blogs (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique,
  title text not null,
  summary text not null,
  page_count integer,
  pdf_storage_path text not null,
  created_at timestamptz not null default now()
);

comment on table public.blogs is 'Blog posts backed by PDFs in storage bucket blog-pdfs';

alter table public.blogs enable row level security;

create policy "blogs_select_public"
  on public.blogs for select to anon,
  authenticated using (true);

-- Public bucket for embedded PDF iframes; uploads use service role from server routes only.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'blog-pdfs',
    'blog-pdfs',
    true,
    52428800,
    array['application/pdf']::text[]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "blog_pdfs_select_public"
  on storage.objects for select to anon,
  authenticated using (bucket_id = 'blog-pdfs');
