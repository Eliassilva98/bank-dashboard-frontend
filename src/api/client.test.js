import axios from 'axios'
import { authStorage } from '@/utils/authStorage'
import { getCurrentPath, redirectTo } from '@/utils/navigation'
import client from './client'

jest.mock('@/config/env', () => ({ API_URL: 'http://api.test' }))

jest.mock('@/utils/navigation', () => ({
  getCurrentPath: jest.fn(),
  redirectTo: jest.fn()
}))

jest.mock('axios', () => {
  const makeInstance = () => {
    const instance = jest.fn()
    instance.post = jest.fn()
    instance.interceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
    return instance
  }

  return { __esModule: true, default: { create: jest.fn(() => makeInstance()) } }
})

const [clientInstance, refreshInstance] = axios.create.mock.results.map(
  (result) => result.value
)
const createConfigs = axios.create.mock.calls.map(([config]) => config)
const [requestInterceptor] = clientInstance.interceptors.request.use.mock.calls[0]
const [, responseErrorHandler] = clientInstance.interceptors.response.use.mock.calls[0]

const axiosError = (status, url = '/transactions') => ({
  response: { status },
  config: { url, headers: {} }
})

describe('api/client', () => {
  beforeEach(() => {
    localStorage.clear()
    getCurrentPath.mockReturnValue('/')
  })

  it('exporta a instância criada pelo axios', () => {
    expect(client).toBe(clientInstance)
  })

  it('cria os dois clientes com a URL da API e o de refresh com cookies', () => {
    expect(createConfigs).toHaveLength(2)
    expect(createConfigs[0]).toMatchObject({ baseURL: 'http://api.test' })
    expect(createConfigs[1]).toMatchObject({
      baseURL: 'http://api.test',
      withCredentials: true
    })
  })

  describe('interceptor de requisição', () => {
    it('envia o token no header Authorization quando há sessão', () => {
      authStorage.saveSession({ token: 'tok-1', user: { id: 1 } })

      const config = requestInterceptor({ headers: {} })

      expect(config.headers.Authorization).toBe('Bearer tok-1')
    })

    it('não envia Authorization sem sessão', () => {
      const config = requestInterceptor({ headers: {} })

      expect(config.headers.Authorization).toBeUndefined()
    })
  })

  describe('interceptor de resposta', () => {
    it('repassa erros que não são 401 sem tentar renovar o token', async () => {
      const error = axiosError(500)

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(refreshInstance.post).not.toHaveBeenCalled()
    })

    it('não tenta renovar o token quando o 401 vem de uma rota de auth (ex.: senha errada)', async () => {
      const error = axiosError(401, '/auth/login')

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(refreshInstance.post).not.toHaveBeenCalled()
    })

    it('rejeita erros sem resposta, como falha de rede ou CORS', async () => {
      const error = { config: { url: '/transactions', headers: {} } }

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(refreshInstance.post).not.toHaveBeenCalled()
    })

    it('renova o token no 401 e repete a requisição original', async () => {
      refreshInstance.post.mockResolvedValue({ data: { token: 'novo-token' } })
      clientInstance.mockResolvedValue({ data: 'ok' })
      const error = axiosError(401)

      const result = await responseErrorHandler(error)

      expect(refreshInstance.post).toHaveBeenCalledWith('/auth/refresh')
      expect(authStorage.getToken()).toBe('novo-token')
      expect(clientInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          _retry: true,
          headers: { Authorization: 'Bearer novo-token' }
        })
      )
      expect(result).toEqual({ data: 'ok' })
    })

    it('não entra em loop: uma requisição já repetida não renova de novo', async () => {
      const error = axiosError(401)
      error.config._retry = true

      await expect(responseErrorHandler(error)).rejects.toBe(error)
      expect(refreshInstance.post).not.toHaveBeenCalled()
    })

    it('encerra a sessão e vai para o login quando a renovação falha', async () => {
      authStorage.saveSession({ token: 'velho', user: { id: 1 } })
      const refreshError = new Error('refresh expirado')
      refreshInstance.post.mockRejectedValue(refreshError)

      await expect(responseErrorHandler(axiosError(401))).rejects.toBe(refreshError)

      expect(authStorage.getToken()).toBeNull()
      expect(authStorage.getUser()).toBeNull()
      expect(redirectTo).toHaveBeenCalledWith('/login')
    })

    it('não redireciona de novo se já está na tela de login', async () => {
      getCurrentPath.mockReturnValue('/login')
      refreshInstance.post.mockRejectedValue(new Error('x'))

      await expect(responseErrorHandler(axiosError(401))).rejects.toThrow('x')

      expect(redirectTo).not.toHaveBeenCalled()
    })

    it('trata a resposta de refresh sem token como falha', async () => {
      refreshInstance.post.mockResolvedValue({ data: {} })

      await expect(responseErrorHandler(axiosError(401))).rejects.toThrow(
        'Refresh sem token na resposta.'
      )
      expect(redirectTo).toHaveBeenCalledWith('/login')
    })
  })
})
