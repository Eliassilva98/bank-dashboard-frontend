import { useState } from 'react'
import { logout as logoutRequest } from '@/api/authAPI'
import { authStorage } from '@/utils/authStorage'
import { AuthContext } from './authContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authStorage.getUser())

  const login = (sessionData) => {
    authStorage.saveSession(sessionData)
    setUser(sessionData.user)
  }

  const logout = async () => {
    await logoutRequest().catch(() => null)
    authStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}