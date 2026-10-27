import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { register } from '@/api/authAPI'
import Register from './Register'

const mockNavigate = jest.fn()

jest.mock('@/api/authAPI', () => ({ register: jest.fn() }))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const fillAndSubmit = async ({ name, email, password }) => {
  if (name) await userEvent.type(screen.getByLabelText('Nome'), name)
  if (email) await userEvent.type(screen.getByLabelText('E-mail'), email)
  if (password) await userEvent.type(screen.getByLabelText('Senha'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
}

describe('Register', () => {
  beforeEach(() => {
    renderWithProviders(<Register />)
  })

  it('tem um link para quem já tem conta', () => {
    expect(screen.getByRole('link', { name: 'Entre' })).toHaveAttribute('href', '/login')
  })

  it('exige nome, e-mail e senha', async () => {
    await fillAndSubmit({})

    expect(await screen.findByText('Informe o nome.')).toBeInTheDocument()
    expect(screen.getByText('Informe o e-mail')).toBeInTheDocument()
    expect(screen.getByText('Informe a senha.')).toBeInTheDocument()
    expect(register).not.toHaveBeenCalled()
  })

  it('rejeita e-mail inválido e senha curta', async () => {
    await fillAndSubmit({ name: 'Elias', email: 'sem-arroba', password: '123' })

    expect(await screen.findByText('E-mail inválido.')).toBeInTheDocument()
    expect(screen.getByText('Senha deve conter no mínimo 8 caracteres.')).toBeInTheDocument()
    expect(register).not.toHaveBeenCalled()
  })

  it('cria a conta e leva para o login', async () => {
    register.mockResolvedValue({})

    await fillAndSubmit({ name: 'Elias', email: 'elias@email.com', password: 'senha1234' })

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'))
    expect(register).toHaveBeenCalledWith({
      name: 'Elias',
      email: 'elias@email.com',
      password: 'senha1234'
    })
  })

  it('mostra a mensagem do backend quando o e-mail já existe', async () => {
    register.mockRejectedValue({ response: { data: { message: 'E-mail já cadastrado' } } })

    await fillAndSubmit({ name: 'Elias', email: 'elias@email.com', password: 'senha1234' })

    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail já cadastrado')
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('mostra a mensagem padrão quando o servidor não responde', async () => {
    register.mockRejectedValue(new Error('Network Error'))

    await fillAndSubmit({ name: 'Elias', email: 'elias@email.com', password: 'senha1234' })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Erro inesperado. Tente novamente.'
    )
  })
})
