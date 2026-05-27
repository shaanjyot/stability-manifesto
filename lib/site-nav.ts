export type NavItem =
  | { kind: 'scroll'; id: string; label: string }
  | { kind: 'link'; label: string; href: string }

export type DesktopNavEntry =
  | { kind: 'scroll'; id: string; label: string }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'dropdown'; label: string; items: { id: string; label: string }[] }

export const NAV_ITEMS: NavItem[] = [
  { kind: 'scroll', id: 'hero', label: 'Home' },
  { kind: 'scroll', id: 'problem', label: 'The Problem' },
  { kind: 'scroll', id: 'paradigms', label: 'Why They Fail' },
  { kind: 'scroll', id: 'missing', label: 'Missing Layer' },
  { kind: 'scroll', id: 'manifesto', label: 'Why Manifesto' },
  { kind: 'scroll', id: 'gudiya', label: 'GUDIYA' },
  { kind: 'scroll', id: 'pdf', label: 'Read PDF' },
  { kind: 'link', label: 'Blogs', href: '/blogs' },
]

export const DESKTOP_NAV: DesktopNavEntry[] = [
  { kind: 'scroll', id: 'hero', label: 'Home' },
  {
    kind: 'dropdown',
    label: 'Manifesto',
    items: [
      { id: 'problem', label: 'The Problem' },
      { id: 'paradigms', label: 'Why They Fail' },
      { id: 'missing', label: 'Missing Layer' },
      { id: 'manifesto', label: 'Why Manifesto' },
    ],
  },
  { kind: 'scroll', id: 'gudiya', label: 'GUDIYA' },
  { kind: 'scroll', id: 'pdf', label: 'Read PDF' },
  { kind: 'link', label: 'Blogs', href: '/blogs' },
]

export function sectionHref(id: string): string {
  return id === 'hero' ? '/' : `/#${id}`
}
