import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { login } from '@/api/authAPI'
import Login from './Login'

const mockNavigate = jest.fn()
const mockSaveAuth = jest.fn()

jest.mock('@/api/authAPI', () => ({ login: jest.fn() }))

jest.mock('@/context/useAuth', () => ({
  useAuth: () => ({ login: mockSaveAuth })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const fillAndSubmit = async ({ email, password }) => {
  if (email) await userEvent.type(screen.getByLabelText('E-mail'), email)
  if (password) await userEvent.type(screen.getByLabelText('Senha'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('Login', () => {
  beforeEach(() => {
    renderWithProviders(<Login />)
  })

  it('mostra o formulário e os links de apoio', () => {
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Esqueçeu sua senha/ })).toHaveAttribute(
      'href',
      '/forgot-password'
    )
    expect(screen.getByRole('link', { name: 'Abra a sua' })).toHaveAttribute(
      'href',
      '/register'
    )
  })

  describe('validação', () => {
    it('exige e-mail e senha', async () => {
      await fillAndSubmit({})

      expect(await screen.findByText('Informe o email')).toBeInTheDocument()
      expect(screen.getByText('Informe a senha')).toBeInTheDocument()
      expect(login).not.toHaveBeenCalled()
    })

    it('rejeita e-mail em formato inválido', async () => {
      await fillAndSubmit({ email: 'isso-nao-e-email', password: '12345678' })

      expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
      expect(login).not.toHaveBeenCalled()
    })

    it('exige senha com no mínimo 8 caracteres', async () => {
      await fillAndSubmit({ email: 'elias@email.com', password: '1234567' })

      expect(
        await screen.findByText('Senha deve conter no mínimo 8 caracteres')
      ).toBeInTheDocument()
      expect(login).not.toHaveBeenCalled()
    })
  })

  describe('envio', () => {
    it('entra, guarda a sessão e vai para o dashboard', async () => {
      const response = { data: { token: 'tok', user: { id: 1, name: 'Elias' } } }
      login.mockResolvedValue(response)

      await fillAndSubmit({ email: 'elias@email.com', password: 'senha1234' })

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
      expect(login).toHaveBeenCalledWith({
        email: 'elias@email.com',
        password: 'senha1234'
      })
      expect(mockSaveAuth).toHaveBeenCalledWith(response.data)
    })

    it('mostra a mensagem do backend quando as credenciais estão erradas', async () => {
      login.mockRejectedValue({ response: { data: { message: 'Credenciais inválidas' } } })

      await fillAndSubmit({ email: 'elias@email.com', password: 'senha-errada' })

      expect(await screen.findByRole('alert')).toHaveTextContent('Credenciais inválidas')
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockSaveAuth).not.toHaveBeenCalled()
    })

    it('mostra a mensagem padrão quando não há resposta do servidor (ex.: CORS)', async () => {
      login.mockRejectedValue(new Error('Network Error'))

      await fillAndSubmit({ email: 'elias@email.com', password: 'senha1234' })

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Erro inesperado. Tente novamente.'
      )
    })

    it('limpa o erro anterior ao tentar de novo', async () => {
      login.mockRejectedValueOnce({ response: { data: { message: 'Credenciais inválidas' } } })
      login.mockResolvedValueOnce({ data: { token: 't', user: { id: 1 } } })

      await fillAndSubmit({ email: 'elias@email.com', password: 'senha1234' })
      expect(await screen.findByRole('alert')).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

      await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
    })
  })

  it('alterna a visibilidade da senha', async () => {
    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('type', 'password')

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(input).toHaveAttribute('type', 'text')

    await userEvent.click(screen.getByRole('button', { name: 'Esconder senha' }))
    expect(input).toHaveAttribute('type', 'password')
  })
})
