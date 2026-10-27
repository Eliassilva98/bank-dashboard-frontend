import { getApiErrorMessage } from './apiError'

describe('getApiErrorMessage', () => {
  it('usa a mensagem enviada pelo backend', () => {
    const error = { response: { data: { message: 'Saldo insuficiente' } } }

    expect(getApiErrorMessage(error)).toBe('Saldo insuficiente')
  })

  it('usa a mensagem padrão quando o erro não tem resposta (ex.: CORS ou rede)', () => {
    expect(getApiErrorMessage(new Error('Network Error'))).toBe(
      'Erro inesperado. Tente novamente.'
    )
  })

  it('usa a mensagem alternativa informada', () => {
    expect(getApiErrorMessage({}, 'Falha ao carregar')).toBe('Falha ao carregar')
  })

  it('não quebra com erro nulo ou indefinido', () => {
    expect(getApiErrorMessage(null)).toBe('Erro inesperado. Tente novamente.')
    expect(getApiErrorMessage(undefined)).toBe('Erro inesperado. Tente novamente.')
  })
})
