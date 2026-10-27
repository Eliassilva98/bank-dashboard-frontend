import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AuthContext } from '@/context/authContext'
import { getAccountOverview } from '@/api/accountAPI'
import { getTransactions } from '@/api/transactionsAPI'
import { getMarketOverview } from '@/api/marketAPI'
import Dashboard from './Dashboard'

jest.mock('@/api/accountAPI', () => ({ getAccountOverview: jest.fn() }))
jest.mock('@/api/transactionsAPI', () => ({
  getTransactions: jest.fn(),
  createTransaction: jest.fn()
}))
jest.mock('@/api/marketAPI', () => ({ getMarketOverview: jest.fn() }))

const logout = jest.fn()

const makeTransactions = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    type: index % 2 === 0 ? 'deposit' : 'transfer_out',
    amount: '100.00',
    description: `Movimento ${index + 1}`,
    counterparty: null,
    created_at: '2026-10-17T15:00:00.000Z'
  }))

const setupApis = ({ transactions = makeTransactions(3), total } = {}) => {
  getAccountOverview.mockResolvedValue({ account: { balance: '800.60' } })
  getTransactions.mockResolvedValue({
    items: transactions,
    total: total ?? transactions.length
  })
  getMarketOverview.mockResolvedValue({
    dolar: { value: 5.06, variationPct: 0.1, updatedAt: '2026-10-19 07:58:23' },
    selic: { value: 14.9, date: '17/10/2026' },
    cdi: { value: 14.8, date: '17/10/2026' }
  })
}

const renderDashboard = async () => {
  renderWithProviders(
    <AuthContext.Provider value={{ user: { id: 1 }, logout }}>
      <Dashboard />
    </AuthContext.Provider>
  )

  await screen.findByText(/^R\$\s800,60$/)
}

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    logout.mockResolvedValue(undefined)
  })

  it('mostra saldo, mercado e últimas transações', async () => {
    setupApis()
    await renderDashboard()

    expect(screen.getByText(/US\$\s5,06/)).toBeInTheDocument()
    expect(screen.getByText('14.9%')).toBeInTheDocument()
    expect(screen.getByText('Movimento 1')).toBeInTheDocument()
  })

  it('o botão "Nova Transação" fica abaixo dos cards, não no topo da página', async () => {
    setupApis()
    await renderDashboard()

    const heading = screen.getByText('Seu resumo financeiro.')
    const button = screen.getByRole('button', { name: 'Nova Transação' })

    expect(
      heading.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('abre e fecha o modal de nova transação', async () => {
    setupApis()
    await renderDashboard()

    await userEvent.click(screen.getByRole('button', { name: 'Nova Transação' }))
    expect(screen.getByRole('dialog', { name: 'Nova transação' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  describe('esconder o saldo', () => {
    it('esconde só o saldo, mantendo receitas e despesas visíveis', async () => {
      setupApis()
      await renderDashboard()

      await userEvent.click(screen.getByRole('button', { name: 'Esconder valores' }))

      expect(screen.queryByText(/800,60/)).not.toBeInTheDocument()
      expect(screen.getByText('R$ ••••')).toBeInTheDocument()
      expect(screen.getByText('Receitas')).toBeInTheDocument()
      expect(screen.getAllByText(/R\$\s100,00/).length).toBeGreaterThan(0)
    })

    it('já abre com o saldo escondido se o usuário escolheu assim antes', async () => {
      localStorage.setItem('balance-hidden', 'true')
      setupApis()

      renderWithProviders(
        <AuthContext.Provider value={{ user: { id: 1 }, logout }}>
          <Dashboard />
        </AuthContext.Provider>
      )

      expect(await screen.findByText('R$ ••••')).toBeInTheDocument()
      expect(screen.queryByText(/800,60/)).not.toBeInTheDocument()
    })

    it('mostra o saldo de novo ao clicar outra vez', async () => {
      setupApis()
      await renderDashboard()

      await userEvent.click(screen.getByRole('button', { name: 'Esconder valores' }))
      await userEvent.click(screen.getByRole('button', { name: 'Mostrar valores' }))

      expect(screen.getByText(/^R\$\s800,60$/)).toBeInTheDocument()
    })
  })

  describe('limite do extrato', () => {
    it('mostra só as 5 últimas e oferece "Ver mais" quando há mais', async () => {
      setupApis({ transactions: makeTransactions(10), total: 14 })
      await renderDashboard()

      expect(screen.getByText('Movimento 5')).toBeInTheDocument()
      expect(screen.queryByText('Movimento 6')).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Ver mais' })).toHaveAttribute(
        'href',
        '/extrato'
      )
    })

    it('não mostra "Ver mais" quando tudo já está na tela', async () => {
      setupApis({ transactions: makeTransactions(5) })
      await renderDashboard()

      expect(screen.getByText('Movimento 5')).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Ver mais' })).not.toBeInTheDocument()
    })
  })

  describe('sair da conta', () => {
    it('fica no fim da página, depois do extrato', async () => {
      setupApis()
      await renderDashboard()

      const list = screen.getByText('Últimas transações')
      const button = screen.getByRole('button', { name: 'Sair da conta' })

      expect(
        list.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    })

    it('chama o logout e mostra que está processando', async () => {
      setupApis()
      let finishLogout
      logout.mockReturnValue(new Promise((resolve) => { finishLogout = resolve }))
      await renderDashboard()

      await userEvent.click(screen.getByRole('button', { name: 'Sair da conta' }))

      expect(logout).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('button', { name: /Aguarde/ })).toBeDisabled()

      finishLogout()
      await waitFor(() => expect(logout).toHaveBeenCalledTimes(1))
    })
  })

  describe('quando algo falha', () => {
    it('o dólar aparece mesmo se a Selic e o CDI estiverem fora do ar', async () => {
      setupApis()
      getMarketOverview.mockResolvedValue({
        dolar: { value: 5.06, variationPct: 0, updatedAt: '2026-10-19 07:58:23' },
        selic: null,
        cdi: null
      })
      await renderDashboard()

      expect(screen.getByText(/US\$\s5,06/)).toBeInTheDocument()
      expect(screen.getAllByText('Indisponível')).toHaveLength(2)
    })

    it('mostra o erro do mercado sem derrubar o resto do dashboard', async () => {
      setupApis()
      getMarketOverview.mockRejectedValue({
        response: { data: { message: 'Serviço de mercado indisponível' } }
      })
      await renderDashboard()

      expect(screen.getByText('Serviço de mercado indisponível')).toBeInTheDocument()
      expect(screen.getByText('Movimento 1')).toBeInTheDocument()
    })

    it('permite tentar de novo quando o saldo não carrega', async () => {
      setupApis()
      getAccountOverview
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce({ account: { balance: '800.60' } })

      renderWithProviders(
        <AuthContext.Provider value={{ user: { id: 1 }, logout }}>
          <Dashboard />
        </AuthContext.Provider>
      )

      const error = await screen.findByText('Não foi possível carregar sua conta.')
      const card = error.closest('div').parentElement

      await userEvent.click(within(card).getByRole('button', { name: 'Tentar novamente' }))

      expect(await screen.findByText(/^R\$\s800,60$/)).toBeInTheDocument()
    })
  })
})
