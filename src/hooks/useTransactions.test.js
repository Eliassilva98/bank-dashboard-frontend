import { act, renderHook, waitFor } from '@testing-library/react'
import { getTransactions } from '@/api/transactionsAPI'
import useTransactions from './useTransactions'

jest.mock('@/api/transactionsAPI', () => ({ getTransactions: jest.fn() }))

const firstPage = { items: [{ id: 1 }, { id: 2 }], total: 12 }
const secondPage = { items: [{ id: 3 }], total: 12 }

describe('useTransactions', () => {
  it('carrega a primeira página ao montar', async () => {
    getTransactions.mockResolvedValue(firstPage)

    const { result } = renderHook(() => useTransactions())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(getTransactions).toHaveBeenCalledWith({ page: 1, pageSize: 10 })
    expect(result.current.items).toEqual(firstPage.items)
    expect(result.current.total).toBe(12)
    expect(result.current.error).toBeNull()
  })

  it('respeita o tamanho de página informado', async () => {
    getTransactions.mockResolvedValue(firstPage)

    renderHook(() => useTransactions({ pageSize: 5 }))

    await waitFor(() =>
      expect(getTransactions).toHaveBeenCalledWith({ page: 1, pageSize: 5 })
    )
  })

  it('busca a nova página ao trocar de página', async () => {
    getTransactions.mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage)

    const { result } = renderHook(() => useTransactions())
    await waitFor(() => expect(result.current.items).toEqual(firstPage.items))

    act(() => result.current.setPage(2))

    await waitFor(() => expect(result.current.items).toEqual(secondPage.items))
    expect(getTransactions).toHaveBeenLastCalledWith({ page: 2, pageSize: 10 })
    expect(result.current.page).toBe(2)
  })

  it('guarda a mensagem do backend quando a busca falha', async () => {
    getTransactions.mockRejectedValue({ response: { data: { message: 'Sessão expirada' } } })

    const { result } = renderHook(() => useTransactions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Sessão expirada')
  })

  it('usa a mensagem padrão quando o erro não vem do backend', async () => {
    getTransactions.mockRejectedValue(new Error('Network Error'))

    const { result } = renderHook(() => useTransactions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Não foi possível carregar o extrato.')
  })

  it('refetch busca de novo e atualiza a lista', async () => {
    getTransactions.mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage)

    const { result } = renderHook(() => useTransactions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(() => result.current.refetch())

    expect(result.current.items).toEqual(secondPage.items)
    expect(getTransactions).toHaveBeenCalledTimes(2)
  })

  it('refetch limpa o erro anterior quando dá certo', async () => {
    getTransactions.mockRejectedValueOnce(new Error('x')).mockResolvedValueOnce(firstPage)

    const { result } = renderHook(() => useTransactions())
    await waitFor(() => expect(result.current.error).not.toBeNull())

    await act(() => result.current.refetch())

    expect(result.current.error).toBeNull()
    expect(result.current.items).toEqual(firstPage.items)
  })

  it('usa lista vazia quando a API não devolve itens', async () => {
    getTransactions.mockResolvedValue({})

    const { result } = renderHook(() => useTransactions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.items).toEqual([])
    expect(result.current.total).toBe(0)
  })
})
