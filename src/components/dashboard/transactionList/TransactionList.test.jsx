import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import TransactionList from './TransactionList'

const deposit = {
  id: 1,
  type: 'deposit',
  amount: '500.00',
  description: 'Salário',
  counterparty: null,
  created_at: '2026-10-17T15:00:00.000Z'
}

const transferOut = {
  id: 2,
  type: 'transfer_out',
  amount: '120.00',
  description: null,
  counterparty: { name: 'Maria Alves' },
  created_at: '2026-10-17T16:00:00.000Z'
}

const transferIn = {
  id: 3,
  type: 'transfer_in',
  amount: '10.00',
  description: null,
  counterparty: { name: 'João Souza' },
  created_at: '2026-10-17T17:00:00.000Z'
}

const renderList = (props = {}) =>
  renderWithProviders(
    <TransactionList
      items={[]}
      page={1}
      total={0}
      onPageChange={jest.fn()}
      isLoading={false}
      error={null}
      onRetry={jest.fn()}
      {...props}
    />
  )

describe('TransactionList', () => {
  it('mostra o estado de carregamento', () => {
    renderList({ isLoading: true })

    expect(screen.getByText('Carregando extrato...')).toBeInTheDocument()
  })

  it('mostra o erro e permite tentar de novo', async () => {
    const onRetry = jest.fn()
    renderList({ error: 'Não foi possível carregar o extrato.', onRetry })

    expect(screen.getByText(/Não foi possível carregar o extrato\./)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('mostra uma mensagem quando não há transações', () => {
    renderList()

    expect(
      screen.getByText('Nenhuma transação ainda. Faça seu primeiro depósito!')
    ).toBeInTheDocument()
  })

  it('mostra o depósito como entrada, com a descrição informada', () => {
    renderList({ items: [deposit], total: 1 })

    expect(screen.getByText('Salário')).toBeInTheDocument()
    expect(screen.getByText(/^\+\s+R\$\s500,00$/)).toBeInTheDocument()
    expect(screen.getByText('17/10/2026')).toBeInTheDocument()
  })

  it('usa "Depósito" quando o depósito não tem descrição', () => {
    renderList({ items: [{ ...deposit, description: null }], total: 1 })

    expect(screen.getByText('Depósito')).toBeInTheDocument()
  })

  it('mostra a transferência enviada como saída, com o nome do destinatário', () => {
    renderList({ items: [transferOut], total: 1 })

    expect(screen.getByText('Transferência para Maria Alves')).toBeInTheDocument()
    expect(screen.getByText(/^-\s+R\$\s120,00$/)).toBeInTheDocument()
  })

  it('mostra a transferência recebida como ENTRADA, com o nome de quem enviou', () => {
    renderList({ items: [transferIn], total: 1 })

    expect(screen.getByText('Transferência de João Souza')).toBeInTheDocument()
    expect(screen.getByText(/^\+\s+R\$\s10,00$/)).toBeInTheDocument()
  })

  it('pinta entradas e saídas de forma diferente', () => {
    renderList({ items: [deposit, transferOut, transferIn], total: 3 })

    expect(screen.getByText(/^\+\s+R\$\s500,00$/)).toHaveAttribute('data-deposit', 'true')
    expect(screen.getByText(/^-\s+R\$\s120,00$/)).toHaveAttribute('data-deposit', 'false')
    expect(screen.getByText(/^\+\s+R\$\s10,00$/)).toHaveAttribute('data-deposit', 'true')
  })

  describe('paginação', () => {
    it('não aparece quando cabe em uma página', () => {
      renderList({ items: [deposit], total: 10 })

      expect(screen.queryByText(/Página/)).not.toBeInTheDocument()
    })

    it('mostra a página atual e o total de páginas', () => {
      renderList({ items: [deposit], page: 2, total: 25 })

      expect(screen.getByText('Página 2 de 3')).toBeInTheDocument()
    })

    it('desabilita "Anterior" na primeira página e "Próxima" na última', () => {
      const { unmount } = renderList({ items: [deposit], page: 1, total: 25 })

      expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Próxima' })).toBeEnabled()

      unmount()
      renderList({ items: [deposit], page: 3, total: 25 })

      expect(screen.getByRole('button', { name: 'Anterior' })).toBeEnabled()
      expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled()
    })

    it('chama onPageChange com a página certa', async () => {
      const onPageChange = jest.fn()
      renderList({ items: [deposit], page: 2, total: 25, onPageChange })

      await userEvent.click(screen.getByRole('button', { name: 'Próxima' }))
      await userEvent.click(screen.getByRole('button', { name: 'Anterior' }))

      expect(onPageChange).toHaveBeenNthCalledWith(1, 3)
      expect(onPageChange).toHaveBeenNthCalledWith(2, 1)
    })

    it('some quando showPagination é falso (resumo do dashboard)', () => {
      renderList({ items: [deposit], total: 25, showPagination: false })

      expect(screen.queryByText(/Página/)).not.toBeInTheDocument()
    })
  })
})
