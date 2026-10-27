import { authStorage } from './authStorage'

const session = { token: 'abc123', user: { id: 1, name: 'Elias', email: 'elias@email.com' } }

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('não tem token nem usuário no início', () => {
    expect(authStorage.getToken()).toBeNull()
    expect(authStorage.getUser()).toBeNull()
  })

  it('salva e recupera a sessão', () => {
    authStorage.saveSession(session)

    expect(authStorage.getToken()).toBe('abc123')
    expect(authStorage.getUser()).toEqual(session.user)
  })

  it('troca só o token (renovação) e mantém o usuário', () => {
    authStorage.saveSession(session)
    authStorage.setToken('token-renovado')

    expect(authStorage.getToken()).toBe('token-renovado')
    expect(authStorage.getUser()).toEqual(session.user)
  })

  it('apaga a sessão ao limpar', () => {
    authStorage.saveSession(session)
    authStorage.clear()

    expect(authStorage.getToken()).toBeNull()
    expect(authStorage.getUser()).toBeNull()
  })
})
