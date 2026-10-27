import { renderHook, waitFor } from '@testing-library/react'
import { getMarketOverview } from '@/api/marketAPI'
import useMarket from './useMarket'

jest.mock('@/api/marketAPI', () => ({ getMarketOverview: jest.fn() }))

describe('useMarket', () => {
  it('carrega os indicadores de mercado', async () => {
    const market = { dolar: { value: 5.06 }, selic: null, cdi: null }
    getMarketOverview.mockResolvedValue(market)

    const { result } = renderHook(() => useMarket())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.market).toEqual(market)
    expect(result.current.error).toBeNull()
  })

  it('guarda o erro quando todos os indicadores falham (502)', async () => {
    getMarketOverview.mockRejectedValue({
      response: { data: { message: 'Serviço de mercado indisponível' } }
    })

    const { result } = renderHook(() => useMarket())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Serviço de mercado indisponível')
    expect(result.current.market).toBeNull()
  })

  it('usa a mensagem padrão quando não há resposta do servidor', async () => {
    getMarketOverview.mockRejectedValue(new Error('Network Error'))

    const { result } = renderHook(() => useMarket())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe('Não foi possível carregar os dados do mercado.')
  })
})
