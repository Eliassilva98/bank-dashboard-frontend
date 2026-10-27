import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import Login from '@/pages/login/Login'
import Register from '@/pages/register/Register'
import ForgotPassword from '@/pages/forgot-password/ForgotPassword'
import ResetPassword from '@/pages/forgot-password/ResetPassword'
import ProtectedRoutes from '@/routes/ProtectedRoutes'
import Dashboard from '@/pages/dashboard/Dashboard'
import Statement from '@/pages/statement/Statement'

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path='/login' element={user ? <Navigate to='/' replace /> : <Login />} />
      <Route path='/register' element={user ? <Navigate to='/' replace /> : <Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route element={<ProtectedRoutes />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/extrato' element={<Statement />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
