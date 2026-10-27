import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formata uma data ISO no padrão brasileiro', () => {
    expect(formatDate('2026-10-17T15:00:00.000Z')).toBe('17/10/2026')
  })

  it('mantém datas que já estão em dd/mm/aaaa (formato do BCB)', () => {
    expect(formatDate('19/10/2026')).toBe('19/10/2026')
  })

  it.each([undefined, null, ''])('devolve "--" quando não há data (%p)', (value) => {
    expect(formatDate(value)).toBe('--')
  })

  it('devolve "--" para uma data inválida', () => {
    expect(formatDate('isso não é data')).toBe('--')
  })
})
