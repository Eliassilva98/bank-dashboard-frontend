import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'

export const renderWithProviders = (ui, { route = '/' } = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider theme={theme}>
        <ToastProvider>{ui}</ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
