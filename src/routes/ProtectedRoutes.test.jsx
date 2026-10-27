import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '@/context/authContext'
import ProtectedRoutes from './ProtectedRoutes'

const renderRoutes = (user) =>
  render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={['/privada']}>
        <Routes>
          <Route path='/login' element={<p>tela de login</p>} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/privada' element={<p>área restrita</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )

describe('ProtectedRoutes', () => {
  it('mostra a página para quem está logado', () => {
    renderRoutes({ id: 1 })

    expect(screen.getByText('área restrita')).toBeInTheDocument()
  })

  it('manda quem não está logado para o login', () => {
    renderRoutes(null)

    expect(screen.getByText('tela de login')).toBeInTheDocument()
    expect(screen.queryByText('área restrita')).not.toBeInTheDocument()
  })
})
