import client from './client'

export const register = async (payload) =>
  client.post('/auth/register', payload, { withCredentials: true })
export const login = async (credentials) =>
  client.post('/auth/login', credentials, { withCredentials: true })
export const logout = () =>
  client.post('/auth/logout', null, { withCredentials: true })
export const forgotPassword = (email) =>
  client.post('/auth/forgot-password', { email })
export const resetPassword = ({ token, password }) =>
  client.post('/auth/reset-password', { token, password })
