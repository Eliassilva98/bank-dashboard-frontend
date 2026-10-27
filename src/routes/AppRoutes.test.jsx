import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AuthContext } from '@/context/authContext'
import AppRoutes from './AppRoutes'

jest.mock('@/pages/login/Login', () => () => <p>página de login</p>)
jest.mock('@/pages/register/Register', () => () => <p>página de cadastro</p>)
jest.mock('@/pages/forgot-password/ForgotPassword', () => () => <p>página esqueci a senha</p>)
jest.mock('@/pages/forgot-password/ResetPassword', () => () => <p>página nova senha</p>)
jest.mock('@/pages/dashboard/Dashboard', () => () => <p>página dashboard</p>)
jest.mock('@/pages/statement/Statement', () => () => <p>página extrato</p>)

const renderAt = (route, user) =>
  renderWithProviders(
    <AuthContext.Provider value={{ user }}>
      <AppRoutes />
    </AuthContext.Provider>,
    { route }
  )

const loggedUser = { id: 1 }

describe('AppRoutes', () => {
  describe('sem login', () => {
    it.each([
      ['/login', 'página de login'],
      ['/register', 'página de cadastro'],
      ['/forgot-password', 'página esqueci a senha'],
      ['/reset-password', 'página nova senha']
    ])('%s é pública', (route, text) => {
      renderAt(route, null)

      expect(screen.getByText(text)).toBeInTheDocument()
    })

    it.each(['/', '/extrato', '/qualquer-coisa'])(
      '%s manda para o login',
      (route) => {
        renderAt(route, null)

        expect(screen.getByText('página de login')).toBeInTheDocument()
      }
    )
  })

  describe('com login', () => {
    it('mostra o dashboard na raiz', () => {
      renderAt('/', loggedUser)

      expect(screen.getByText('página dashboard')).toBeInTheDocument()
    })

    it('mostra o extrato completo em /extrato', () => {
      renderAt('/extrato', loggedUser)

      expect(screen.getByText('página extrato')).toBeInTheDocument()
    })

    it.each(['/login', '/register'])('%s redireciona para o dashboard', (route) => {
      renderAt(route, loggedUser)

      expect(screen.getByText('página dashboard')).toBeInTheDocument()
    })

    it('rota desconhecida volta para o dashboard', () => {
      renderAt('/nao-existe', loggedUser)

      expect(screen.getByText('página dashboard')).toBeInTheDocument()
    })
  })
})
