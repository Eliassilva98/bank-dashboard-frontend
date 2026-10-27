import { formatCurrency, formatUsd } from './formatCurrency'

describe('formatCurrency', () => {
  it('formata um número em reais', () => {
    expect(formatCurrency(800.6)).toMatch(/^R\$\s800,60$/)
  })

  it('aceita valores em string, como vêm da API', () => {
    expect(formatCurrency('1500.5')).toMatch(/^R\$\s1\.500,50$/)
  })

  it('formata zero e valores negativos', () => {
    expect(formatCurrency(0)).toMatch(/^R\$\s0,00$/)
    expect(formatCurrency(-20)).toMatch(/^-R\$\s20,00$/)
  })

  it.each([undefined, 'abc', NaN, Infinity])(
    'devolve "--" para valor inválido (%p)',
    (value) => {
      expect(formatCurrency(value)).toBe('--')
    }
  )

  it('trata null como zero', () => {
    expect(formatCurrency(null)).toMatch(/^R\$\s0,00$/)
  })
})

describe('formatUsd', () => {
  it('formata um número em dólares no padrão pt-BR', () => {
    expect(formatUsd(5.0619)).toMatch(/^US\$\s5,06$/)
  })

  it('devolve "--" para valor inválido', () => {
    expect(formatUsd(undefined)).toBe('--')
    expect(formatUsd('abc')).toBe('--')
  })
})
