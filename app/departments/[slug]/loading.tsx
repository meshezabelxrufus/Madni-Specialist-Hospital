/**
 * Department Page — Loading skeleton
 * Shown by Next.js while the page is streaming / being generated.
 */

export default function DepartmentLoading() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Hero skeleton */}
      <div style={{
        height: '100vh',
        background: 'linear-gradient(to bottom, var(--color-bg-elevated), var(--color-bg))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ opacity: 0.4, display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: 120, height: 12, borderRadius: 6, background: 'var(--color-accent)', opacity: 0.3 }} />
          <div style={{ width: 320, height: 40, borderRadius: 8, background: 'var(--color-text-primary)', opacity: 0.08 }} />
          <div style={{ width: 240, height: 20, borderRadius: 6, background: 'var(--color-text-primary)', opacity: 0.06 }} />
        </div>
      </div>
    </div>
  )
}
