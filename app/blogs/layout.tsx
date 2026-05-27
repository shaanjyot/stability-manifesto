import { SiteFooter } from '@/app/components/SiteFooter'
import { SiteHeader } from '@/app/components/SiteHeader'

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        background: '#060608',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <SiteHeader />
      <main style={{ paddingTop: 70 }}>{children}</main>
      <SiteFooter />
    </div>
  )
}
