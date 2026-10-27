import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'

const ProtectedRoutes = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' replace />

  return <Outlet />
}

export default ProtectedRoutes