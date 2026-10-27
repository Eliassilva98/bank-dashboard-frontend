import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { getTransactions } from '@/api/transactionsAPI'
import Statement from './Statement'

jest.mock('@/api/transactionsAPI', () => ({ getTransactions: jest.fn() }))

const items = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, index) => ({
    id: from + index,
    type: 'deposit',
    amount: '10.00',
    description: `Movimento ${from + index}`,
    counterparty: null,
    created_at: '2026-10-17T15:00:00.000Z'
  }))

describe('Statement', () => {
  it('mostra o extrato completo com o link para voltar ao resumo', async () => {
    getTransactions.mockResolvedValue({ items: items(1, 10), total: 25 })
    renderWithProviders(<Statement />)

    expect(await screen.findByText('Movimento 1')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Extrato completo.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Voltar ao resumo/ })).toHaveAttribute('href', '/')
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument()
  })

  it('navega entre as páginas do extrato', async () => {
    getTransactions
      .mockResolvedValueOnce({ items: items(1, 10), total: 25 })
      .mockResolvedValueOnce({ items: items(11, 20), total: 25 })
    renderWithProviders(<Statement />)

    await screen.findByText('Movimento 1')
    await userEvent.click(screen.getByRole('button', { name: 'Próxima' }))

    expect(await screen.findByText('Movimento 11')).toBeInTheDocument()
    expect(getTransactions).toHaveBeenLastCalledWith({ page: 2, pageSize: 10 })
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument()
  })

  it('mostra o erro e permite tentar de novo', async () => {
    getTransactions
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ items: items(1, 2), total: 2 })
    renderWithProviders(<Statement />)

    await userEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByText('Movimento 1')).toBeInTheDocument()
  })
})
