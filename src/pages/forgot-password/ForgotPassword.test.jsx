import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { forgotPassword } from '@/api/authAPI'
import ForgotPassword from './ForgotPassword'

jest.mock('@/api/authAPI', () => ({ forgotPassword: jest.fn() }))

const submit = async (email) => {
  if (email) await userEvent.type(screen.getByLabelText('E-mail'), email)
  await userEvent.click(screen.getByRole('button', { name: 'Enviar link' }))
}

describe('ForgotPassword', () => {
  beforeEach(() => {
    renderWithProviders(<ForgotPassword />)
  })

  it('exige o e-mail', async () => {
    await submit()

    expect(await screen.findByText('Informe o e-mail.')).toBeInTheDocument()
    expect(forgotPassword).not.toHaveBeenCalled()
  })

  it('rejeita e-mail inválido', async () => {
    await submit('invalido')

    expect(await screen.findByText('E-mail inválido.')).toBeInTheDocument()
    expect(forgotPassword).not.toHaveBeenCalled()
  })

  it('pede o link e mostra a confirmação sem revelar se o e-mail existe', async () => {
    forgotPassword.mockResolvedValue({})

    await submit('elias@email.com')

    expect(
      await screen.findByRole('heading', { name: 'Verifique seu e-mail.' })
    ).toBeInTheDocument()
    expect(screen.getByText(/Se esse e-mail estiver cadastrado/)).toBeInTheDocument()
    expect(forgotPassword).toHaveBeenCalledWith('elias@email.com')
  })

  it('mostra o erro e mantém o formulário quando a chamada falha', async () => {
    forgotPassword.mockRejectedValue({
      response: { data: { message: 'Muitas tentativas. Aguarde.' } }
    })

    await submit('elias@email.com')

    expect(await screen.findByRole('alert')).toHaveTextContent('Muitas tentativas. Aguarde.')
    expect(screen.getByRole('button', { name: 'Enviar link' })).toBeInTheDocument()
  })

  it('desabilita o botão enquanto envia', async () => {
    let finish
    forgotPassword.mockReturnValue(new Promise((resolve) => { finish = resolve }))

    await submit('elias@email.com')

    expect(screen.getByRole('button', { name: /Aguarde/ })).toBeDisabled()

    finish({})
    expect(await screen.findByText('Verifique seu e-mail.')).toBeInTheDocument()
  })
})
