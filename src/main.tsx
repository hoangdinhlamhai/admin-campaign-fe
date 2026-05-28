import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { AuthProvider } from '@/lib/auth/auth-context'
import { ThemeProvider } from '@/components/theme/theme-provider'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './globals.css'
import './styles/date-picker.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
