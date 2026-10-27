import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import App from './App'
import { AuthProvider } from '@/context/authProvider'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'
import { theme } from '@/styles/theme'
import GlobalStyles from '@/styles/GlobalStyles'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <ToastProvider>
            <GlobalStyles />
            <App />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)