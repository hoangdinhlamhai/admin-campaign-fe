import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { AuthProvider } from '@/lib/auth/auth-context'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
