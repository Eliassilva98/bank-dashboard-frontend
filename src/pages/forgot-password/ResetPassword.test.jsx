import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { resetPassword } from '@/api/authAPI'
import ResetPassword from './ResetPassword'

const mockNavigate = jest.fn()

jest.mock('@/api/authAPI', () => ({ resetPassword: jest.fn() }))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const renderReset = (route = '/reset-password?token=abc123') =>
  renderWithProviders(<ResetPassword />, { route })

const fillAndSubmit = async (password, confirmPassword = password) => {
  if (password) await userEvent.type(screen.getByLabelText('Nova senha'), password)
  if (confirmPassword) {
    await userEvent.type(screen.getByLabelText('Confirmar nova senha'), confirmPassword)
  }
  await userEvent.click(screen.getByRole('button', { name: 'Salvar nova senha' }))
}

describe('ResetPassword', () => {
  it('exige a senha e a confirmação', async () => {
    renderReset()

    await fillAndSubmit('', '')

    expect(await screen.findByText('Informe a senha')).toBeInTheDocument()
    expect(screen.getByText('Confirme a senha')).toBeInTheDocument()
    expect(resetPassword).not.toHaveBeenCalled()
  })

  it('exige no mínimo 8 caracteres', async () => {
    renderReset()

    await fillAndSubmit('1234567')

    expect(
      await screen.findByText('Senha deve conter no mínimo 8 caracteres.')
    ).toBeInTheDocument()
    expect(resetPassword).not.toHaveBeenCalled()
  })

  it('não aceita confirmação diferente da senha', async () => {
    renderReset()

    await fillAndSubmit('senha1234', 'outra-senha')

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument()
    expect(resetPassword).not.toHaveBeenCalled()
  })

  it('envia o token da URL junto com a nova senha e mostra o sucesso', async () => {
    resetPassword.mockResolvedValue({})
    renderReset()

    await fillAndSubmit('senha1234')

    expect(await screen.findByRole('heading', { name: 'Senha redefinida' })).toBeInTheDocument()
    expect(resetPassword).toHaveBeenCalledWith({ token: 'abc123', password: 'senha1234' })

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('avisa que o link é inválido quando a URL não tem token', async () => {
    renderReset('/reset-password')

    await fillAndSubmit('senha1234')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Link de redefinição inválido ou expirado.'
    )
    expect(resetPassword).not.toHaveBeenCalled()
  })

  it('mostra a mensagem do backend quando o token expirou', async () => {
    resetPassword.mockRejectedValue({
      response: { data: { message: 'Token expirado' } }
    })
    renderReset()

    await fillAndSubmit('senha1234')

    expect(await screen.findByRole('alert')).toHaveTextContent('Token expirado')
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled())
  })
})
