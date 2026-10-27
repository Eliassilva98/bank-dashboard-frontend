import axios from 'axios'
import { authStorage } from '@/utils/authStorage'
import { API_URL } from '@/config/env'
import { getCurrentPath, redirectTo } from '@/utils/navigation'

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000
})

const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true
})

client.interceptors.request.use((config) => {
  const token = authStorage.getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthRoute = originalRequest?.url?.includes('/auth/')

    const shouldRefresh =
      error.response?.status === 401 && !isAuthRoute && !originalRequest?._retry

    if (!shouldRefresh) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { data } = await refreshClient.post('/auth/refresh')

      if (!data?.token) {
        throw new Error('Refresh sem token na resposta.')
      }
      authStorage.setToken(data.token)
      originalRequest.headers.Authorization = `Bearer ${data.token}`

      return client(originalRequest)
    } catch (refreshError) {
      authStorage.clear()

      if (getCurrentPath() !== '/login') {
        redirectTo('/login')
      }

      return Promise.reject(refreshError)
    }
  }
)

export default client
