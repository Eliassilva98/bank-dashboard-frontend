import { act, renderHook, waitFor } from '@testing-library/react'
import { getAccountOverview } from '@/api/accountAPI'
import useAccount from './useAccount'

jest.mock('@/api/accountAPI', () => ({ getAccountOverview: jest.fn() }))

const overview = { user: { name: 'Elias' }, account: { balance: '800.60' } }

describe('useAccount', () => {
  it('carrega a conta ao montar', async () => {
    getAccountOverview.mockResolvedValue(overview)

    const { result } = renderHook(() => useAccount())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.account).toEqual(overview)
    expect(result.current.error).toBeNull()
  })

  it('guarda o erro quando a busca falha', async () => {
    getAccountOverview.mockRejectedValue(new Error('Network Error'))

    const { result } = renderHook(() => useAccount())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Não foi possível carregar sua conta.')
    expect(result.current.account).toBeNull()
  })

  it('applyBalance atualiza só o saldo, sem nova chamada à API', async () => {
    getAccountOverview.mockResolvedValue(overview)

    const { result } = renderHook(() => useAccount())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.applyBalance(1300.6))

    expect(result.current.account.account.balance).toBe(1300.6)
    expect(result.current.account.user).toEqual({ name: 'Elias' })
    expect(getAccountOverview).toHaveBeenCalledTimes(1)
  })

  it('applyBalance não faz nada se a conta ainda não carregou', async () => {
    getAccountOverview.mockRejectedValue(new Error('x'))

    const { result } = renderHook(() => useAccount())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.applyBalance(10))

    expect(result.current.account).toBeNull()
  })

  it('refetch busca a conta de novo e limpa o erro', async () => {
    getAccountOverview.mockRejectedValueOnce(new Error('x')).mockResolvedValueOnce(overview)

    const { result } = renderHook(() => useAccount())
    await waitFor(() => expect(result.current.error).not.toBeNull())

    await act(() => result.current.refetch())

    expect(result.current.error).toBeNull()
    expect(result.current.account).toEqual(overview)
  })
})
