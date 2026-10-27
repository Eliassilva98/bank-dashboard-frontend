import { act, renderHook } from '@testing-library/react'
import useBalanceVisibility from './useBalanceVisibility'

describe('useBalanceVisibility', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('começa com o saldo visível', () => {
    const { result } = renderHook(() => useBalanceVisibility())

    expect(result.current.isHidden).toBe(false)
  })

  it('alterna entre esconder e mostrar', () => {
    const { result } = renderHook(() => useBalanceVisibility())

    act(() => result.current.toggle())
    expect(result.current.isHidden).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.isHidden).toBe(false)
  })

  it('guarda a preferência para a próxima visita', () => {
    const first = renderHook(() => useBalanceVisibility())

    act(() => first.result.current.toggle())
    first.unmount()

    const second = renderHook(() => useBalanceVisibility())

    expect(second.result.current.isHidden).toBe(true)
  })

  it('continua funcionando quando o localStorage não está disponível', () => {
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    const { result } = renderHook(() => useBalanceVisibility())

    expect(result.current.isHidden).toBe(false)

    act(() => result.current.toggle())
    expect(result.current.isHidden).toBe(true)

    getItem.mockRestore()
    setItem.mockRestore()
  })
})
