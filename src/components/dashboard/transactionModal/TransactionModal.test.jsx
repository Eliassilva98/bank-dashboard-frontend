import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { createTransaction } from '@/api/transactionsAPI'
import TransactionModal from './TransactionModal'

jest.mock('@/api/transactionsAPI', () => ({ createTransaction: jest.fn() }))

const renderModal = (props = {}) => {
  const onClose = jest.fn()
  const onTransactionCreated = jest.fn()

  renderWithProviders(
    <TransactionModal
      onClose={onClose}
      onTransactionCreated={onTransactionCreated}
      {...props}
    />
  )

  return { onClose, onTransactionCreated }
}

const submitForm = () =>
  fireEvent.submit(screen.getByRole('button', { name: /Depositar|Transferir/ }).closest('form'))

describe('TransactionModal', () => {
  it('abre como depósito, sem o campo de conta de destino', () => {
    renderModal()

    expect(screen.getByRole('dialog', { name: 'Nova transação' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Depositar' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Conta de destino')).not.toBeInTheDocument()
  })

  it('mostra o campo de destino e o botão "Transferir" ao escolher transferência', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: 'Transferência' }))

    expect(screen.getByLabelText('Conta de destino')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Transferir' })).toBeInTheDocument()
  })

  describe('validação', () => {
    it('não envia sem valor e avisa o usuário', () => {
      renderModal()

      submitForm()

      expect(screen.getByRole('alert')).toHaveTextContent('Informe um valor maior que zero.')
      expect(createTransaction).not.toHaveBeenCalled()
    })

    it('não aceita valor zero ou negativo', async () => {
      renderModal()

      await userEvent.type(screen.getByLabelText('Valor'), '-5')
      submitForm()

      expect(screen.getByRole('alert')).toHaveTextContent('Informe um valor maior que zero.')
      expect(createTransaction).not.toHaveBeenCalled()
    })

    it('exige o e-mail do destinatário numa transferência', async () => {
      renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Transferência' }))
      await userEvent.type(screen.getByLabelText('Valor'), '50')
      submitForm()

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Informe o e-mail da conta de destino.'
      )
      expect(createTransaction).not.toHaveBeenCalled()
    })
  })

  describe('envio', () => {
    it('faz o depósito, avisa o dashboard, fecha o modal e mostra a confirmação', async () => {
      const result = { new_balance: 1300.6 }
      createTransaction.mockResolvedValue(result)
      const { onClose, onTransactionCreated } = renderModal()

      await userEvent.type(screen.getByLabelText('Valor'), '500')
      await userEvent.type(screen.getByLabelText('Descrição (Opcional)'), ' Salário ')
      await userEvent.click(screen.getByRole('button', { name: 'Depositar' }))

      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

      expect(createTransaction).toHaveBeenCalledWith({
        type: 'deposit',
        amount: 500,
        description: 'Salário'
      })
      expect(onTransactionCreated).toHaveBeenCalledWith(result)
      expect(await screen.findByText(/Depósito de R\$\s500,00 realizado!/)).toBeInTheDocument()
    })

    it('envia o e-mail do destinatário na transferência', async () => {
      createTransaction.mockResolvedValue({ new_balance: 680 })
      const { onClose } = renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Transferência' }))
      await userEvent.type(screen.getByLabelText('Valor'), '120')
      await userEvent.type(screen.getByLabelText('Conta de destino'), ' maria@email.com ')
      await userEvent.click(screen.getByRole('button', { name: 'Transferir' }))

      await waitFor(() => expect(onClose).toHaveBeenCalled())

      expect(createTransaction).toHaveBeenCalledWith({
        type: 'transfer',
        amount: 120,
        description: undefined,
        targetEmail: 'maria@email.com'
      })
      expect(
        await screen.findByText(/Transferência de R\$\s120,00 realizada!/)
      ).toBeInTheDocument()
    })

    it('mostra a mensagem do backend e mantém o modal aberto (ex.: saldo insuficiente)', async () => {
      createTransaction.mockRejectedValue({
        response: { data: { message: 'Saldo insuficiente' } }
      })
      const { onClose, onTransactionCreated } = renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Transferência' }))
      await userEvent.type(screen.getByLabelText('Valor'), '99999')
      await userEvent.type(screen.getByLabelText('Conta de destino'), 'maria@email.com')
      await userEvent.click(screen.getByRole('button', { name: 'Transferir' }))

      expect(await screen.findByRole('alert')).toHaveTextContent('Saldo insuficiente')
      expect(onClose).not.toHaveBeenCalled()
      expect(onTransactionCreated).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Transferir' })).toBeEnabled()
    })

    it('usa uma mensagem padrão quando o erro não vem do backend', async () => {
      createTransaction.mockRejectedValue(new Error('Network Error'))
      renderModal()

      await userEvent.type(screen.getByLabelText('Valor'), '10')
      await userEvent.click(screen.getByRole('button', { name: 'Depositar' }))

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Não foi possível completar a transação.'
      )
    })

    it('desabilita o botão enquanto processa, evitando envio duplo', async () => {
      let resolveRequest
      createTransaction.mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve
        })
      )
      renderModal()

      await userEvent.type(screen.getByLabelText('Valor'), '10')
      await userEvent.click(screen.getByRole('button', { name: 'Depositar' }))

      expect(screen.getByRole('button', { name: 'Processando' })).toBeDisabled()

      resolveRequest({ new_balance: 10 })
      await waitFor(() => expect(createTransaction).toHaveBeenCalledTimes(1))
    })
  })

  describe('fechar', () => {
    it('fecha no botão de fechar', async () => {
      const { onClose } = renderModal()

      await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('fecha com a tecla Escape', async () => {
      const { onClose } = renderModal()

      await userEvent.keyboard('{Escape}')

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('fecha ao clicar fora, mas não ao clicar dentro do modal', async () => {
      const { onClose } = renderModal()

      await userEvent.click(screen.getByRole('dialog'))
      expect(onClose).not.toHaveBeenCalled()

      await userEvent.click(screen.getByRole('dialog').parentElement)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
