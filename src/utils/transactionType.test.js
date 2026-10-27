import { isIncoming } from './transactionType'

describe('isIncoming', () => {
  it.each(['deposit', 'transfer_in'])('%s é entrada de dinheiro', (type) => {
    expect(isIncoming({ type })).toBe(true)
  })

  it('transfer_out é saída', () => {
    expect(isIncoming({ type: 'transfer_out' })).toBe(false)
  })

  it('não quebra com transação ausente ou sem tipo', () => {
    expect(isIncoming(undefined)).toBe(false)
    expect(isIncoming({})).toBe(false)
  })
})
