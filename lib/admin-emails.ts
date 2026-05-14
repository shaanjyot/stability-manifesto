/** Comma- or whitespace-separated allowlist from ADMIN_EMAIL (or SUPABASE_ADMIN_EMAIL). */
export function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAIL ?? process.env.SUPABASE_ADMIN_EMAIL ?? ''
  return raw
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return parseAdminEmails().includes(normalized)
}

export function adminAllowlistConfigured(): boolean {
  return parseAdminEmails().length > 0
}
