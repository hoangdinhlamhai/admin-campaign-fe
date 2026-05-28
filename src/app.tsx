import { Outlet } from 'react-router'
import { Suspense } from 'react'

export function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-dvh bg-[hsl(var(--background))]"><span className="text-[hsl(var(--muted))]">Đang tải...</span></div>}>
      <Outlet />
    </Suspense>
  )
}
