import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { logout as logoutRequest } from '@/api/authAPI'
import { authStorage } from '@/utils/authStorage'
import { AuthProvider } from './authProvider'
import { useAuth } from './useAuth'

jest.mock('@/api/authAPI', () => ({ logout: jest.fn() }))

const session = { token: 'tok', user: { id: 1, name: 'Elias' } }

const Consumer = () => {
  const { user, login, logout } = useAuth()

  return (
    <div>
      <p>{user ? `logado: ${user.name}` : 'deslogado'}</p>
      <button type='button' onClick={() => login(session)}>entrar</button>
      <button type='button' onClick={logout}>sair</button>
    </div>
  )
}

const renderProvider = () =>
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  )

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    logoutRequest.mockResolvedValue({})
  })

  it('começa deslogado sem sessão salva', () => {
    renderProvider()

    expect(screen.getByText('deslogado')).toBeInTheDocument()
  })

  it('restaura o usuário da sessão salva (recarregar a página)', () => {
    authStorage.saveSession(session)
    renderProvider()

    expect(screen.getByText('logado: Elias')).toBeInTheDocument()
  })

  it('login guarda a sessão e atualiza o usuário', async () => {
    renderProvider()

    await userEvent.click(screen.getByRole('button', { name: 'entrar' }))

    expect(screen.getByText('logado: Elias')).toBeInTheDocument()
    expect(authStorage.getToken()).toBe('tok')
  })

  it('logout avisa o servidor e limpa a sessão local', async () => {
    authStorage.saveSession(session)
    renderProvider()

    await userEvent.click(screen.getByRole('button', { name: 'sair' }))

    await waitFor(() => expect(screen.getByText('deslogado')).toBeInTheDocument())
    expect(logoutRequest).toHaveBeenCalledTimes(1)
    expect(authStorage.getToken()).toBeNull()
    expect(authStorage.getUser()).toBeNull()
  })

  it('logout encerra a sessão local mesmo se o servidor falhar', async () => {
    logoutRequest.mockRejectedValue(new Error('Network Error'))
    authStorage.saveSession(session)
    renderProvider()

    await userEvent.click(screen.getByRole('button', { name: 'sair' }))

    await waitFor(() => expect(screen.getByText('deslogado')).toBeInTheDocument())
    expect(authStorage.getToken()).toBeNull()
  })
})

describe('useAuth', () => {
  it('avisa quando usado fora do AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => null)

    expect(() => render(<Consumer />)).toThrow(
      'useAuth deve ser usado dentro de um AuthProvider'
    )

    consoleError.mockRestore()
  })
})
