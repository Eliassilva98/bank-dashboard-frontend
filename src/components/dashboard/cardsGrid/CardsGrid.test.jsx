import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import CardsGrid from './CardsGrid'

const account = { account: { balance: '800.60' } }

const transactions = [
  { id: 1, type: 'deposit', amount: '500.00' },
  { id: 2, type: 'deposit', amount: '300.50' },
  { id: 3, type: 'transfer_out', amount: '120.00' },
  { id: 4, type: 'transfer_in', amount: '10.00' }
]

const renderGrid = (props = {}) =>
  renderWithProviders(
    <CardsGrid
      account={account}
      transactions={transactions}
      isLoading={false}
      error={null}
      onRetry={jest.fn()}
      isHidden={false}
      onToggleHidden={jest.fn()}
      {...props}
    />
  )

const card = (label) => screen.getByText(label).closest('div').parentElement

describe('CardsGrid', () => {
  it('mostra o saldo formatado em reais', () => {
    renderGrid()

    expect(screen.getByText(/^R\$\s800,60$/)).toBeInTheDocument()
  })

  it('soma como receita os depósitos e as transferências recebidas', () => {
    renderGrid()

    expect(card('Receitas')).toHaveTextContent(/R\$\s810,50/)
  })

  it('soma como despesa só as transferências enviadas', () => {
    renderGrid()

    expect(card('Despesas')).toHaveTextContent(/R\$\s120,00/)
  })

  it('mostra zero em receitas e despesas sem transações', () => {
    renderGrid({ transactions: [] })

    expect(card('Receitas')).toHaveTextContent(/R\$\s0,00/)
    expect(card('Despesas')).toHaveTextContent(/R\$\s0,00/)
  })

  describe('esconder o saldo', () => {
    it('esconde SÓ o saldo, mantendo receitas e despesas visíveis', () => {
      renderGrid({ isHidden: true })

      expect(card('Seu saldo')).toHaveTextContent('R$ ••••')
      expect(screen.queryByText(/800,60/)).not.toBeInTheDocument()
      expect(card('Receitas')).toHaveTextContent(/R\$\s810,50/)
      expect(card('Despesas')).toHaveTextContent(/R\$\s120,00/)
    })

    it('o botão avisa a ação disponível para leitores de tela', () => {
      const { unmount } = renderGrid({ isHidden: false })

      expect(screen.getByRole('button', { name: 'Esconder valores' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )

      unmount()
      renderGrid({ isHidden: true })

      expect(screen.getByRole('button', { name: 'Mostrar valores' })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    })

    it('chama onToggleHidden ao clicar no olho', async () => {
      const onToggleHidden = jest.fn()
      renderGrid({ onToggleHidden })

      await userEvent.click(screen.getByRole('button', { name: 'Esconder valores' }))

      expect(onToggleHidden).toHaveBeenCalledTimes(1)
    })
  })

  it('mostra carregando no saldo', () => {
    renderGrid({ isLoading: true })

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('mostra o erro no saldo e permite tentar de novo', async () => {
    const onRetry = jest.fn()
    renderGrid({ error: 'Não foi possível carregar sua conta.', onRetry })

    expect(screen.getByText('Não foi possível carregar sua conta.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
