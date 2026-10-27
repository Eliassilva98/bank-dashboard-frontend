import client from './client'
import { forgotPassword, login, logout, register, resetPassword } from './authAPI'
import { getAccountOverview } from './accountAPI'
import { getMarketOverview } from './marketAPI'
import { createTransaction, getTransactions } from './transactionsAPI'

jest.mock('./client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() }
}))

describe('authAPI', () => {
  it('register envia nome, e-mail e senha com cookies', async () => {
    const payload = { name: 'Elias', email: 'e@e.com', password: 'senha1234' }
    await register(payload)

    expect(client.post).toHaveBeenCalledWith('/auth/register', payload, {
      withCredentials: true
    })
  })

  it('login envia as credenciais com cookies (refresh token httpOnly)', async () => {
    const credentials = { email: 'e@e.com', password: 'senha1234' }
    await login(credentials)

    expect(client.post).toHaveBeenCalledWith('/auth/login', credentials, {
      withCredentials: true
    })
  })

  it('logout chama a rota com cookies e sem corpo', async () => {
    await logout()

    expect(client.post).toHaveBeenCalledWith('/auth/logout', null, {
      withCredentials: true
    })
  })

  it('forgotPassword envia só o e-mail', async () => {
    await forgotPassword('e@e.com')

    expect(client.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'e@e.com' })
  })

  it('resetPassword envia o token e a nova senha', async () => {
    await resetPassword({ token: 'abc', password: 'nova12345' })

    expect(client.post).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'abc',
      password: 'nova12345'
    })
  })
})

describe('accountAPI', () => {
  it('getAccountOverview devolve os dados da conta', async () => {
    client.get.mockResolvedValue({ data: { account: { balance: '800.60' } } })

    await expect(getAccountOverview()).resolves.toEqual({ account: { balance: '800.60' } })
    expect(client.get).toHaveBeenCalledWith('/accounts/me')
  })
})

describe('marketAPI', () => {
  it('getMarketOverview devolve os indicadores', async () => {
    client.get.mockResolvedValue({ data: { dolar: null, selic: null, cdi: null } })

    await expect(getMarketOverview()).resolves.toEqual({
      dolar: null,
      selic: null,
      cdi: null
    })
    expect(client.get).toHaveBeenCalledWith('/market')
  })
})

describe('transactionsAPI', () => {
  describe('createTransaction', () => {
    it('depósito não envia o e-mail de destino', async () => {
      client.post.mockResolvedValue({ data: { new_balance: 500 } })

      await createTransaction({
        type: 'deposit',
        amount: 500,
        targetEmail: 'ignorado@email.com',
        description: 'Salário'
      })

      expect(client.post).toHaveBeenCalledWith('/transactions', {
        type: 'deposit',
        amount: 500,
        description: 'Salário'
      })
    })

    it('transferência envia o e-mail de destino', async () => {
      client.post.mockResolvedValue({ data: { new_balance: 380 } })

      const result = await createTransaction({
        type: 'transfer',
        amount: 120,
        targetEmail: 'maria@email.com',
        description: undefined
      })

      expect(client.post).toHaveBeenCalledWith('/transactions', {
        type: 'transfer',
        amount: 120,
        targetEmail: 'maria@email.com',
        description: undefined
      })
      expect(result).toEqual({ new_balance: 380 })
    })
  })

  describe('getTransactions', () => {
    it('pede a página e o tamanho informados', async () => {
      client.get.mockResolvedValue({ data: { items: [], total: 0 } })

      await getTransactions({ page: 2, pageSize: 5 })

      expect(client.get).toHaveBeenCalledWith('/transactions', {
        params: { page: 2, pageSize: 5 }
      })
    })

    it('usa página 1 com 10 itens por padrão', async () => {
      client.get.mockResolvedValue({ data: { items: [], total: 0 } })

      await getTransactions()

      expect(client.get).toHaveBeenCalledWith('/transactions', {
        params: { page: 1, pageSize: 10 }
      })
    })
  })
})
