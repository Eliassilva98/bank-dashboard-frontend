import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ToastProvider } from './ToastProvider'
import { useToast } from './ToastContext'

const Trigger = ({ type, message = 'Operação concluída' }) => {
  const { showToast } = useToast()

  return (
    <button type='button' onClick={() => showToast({ type, message })}>
      disparar
    </button>
  )
}

const setup = (props) => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  renderWithProviders(<Trigger {...props} />)

  return user
}

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('não mostra nada até alguém disparar', () => {
    setup()

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('mostra a mensagem quando é disparado', async () => {
    const user = setup()

    await user.click(screen.getByRole('button', { name: 'disparar' }))

    expect(screen.getByRole('status')).toHaveTextContent('Operação concluída')
  })

  it.each(['success', 'error', 'info'])('aceita o tipo %s', async (type) => {
    const user = setup({ type })

    await user.click(screen.getByRole('button', { name: 'disparar' }))

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('usa o tipo "info" quando nenhum é informado', async () => {
    const user = setup()

    await user.click(screen.getByRole('button', { name: 'disparar' }))

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('usa um ícone padrão para um tipo desconhecido, sem quebrar', async () => {
    const user = setup({ type: 'inexistente' })

    await user.click(screen.getByRole('button', { name: 'disparar' }))

    expect(screen.getByRole('status')).toHaveTextContent('Operação concluída')
  })

  it('some sozinho depois de 4 segundos', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'disparar' }))

    act(() => {
      jest.advanceTimersByTime(3999)
    })
    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('fecha ao clicar no botão de fechar', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'disparar' }))

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('empilha vários avisos e fecha só o que foi clicado', async () => {
    const user = setup()
    const trigger = screen.getByRole('button', { name: 'disparar' })

    await user.click(trigger)
    await user.click(trigger)

    expect(screen.getAllByRole('status')).toHaveLength(2)

    await user.click(screen.getAllByRole('button', { name: 'Fechar' })[0])

    expect(screen.getAllByRole('status')).toHaveLength(1)
  })

  it('cada aviso some no seu próprio tempo', async () => {
    const user = setup()
    const trigger = screen.getByRole('button', { name: 'disparar' })

    await user.click(trigger)
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    await user.click(trigger)

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(screen.getAllByRole('status')).toHaveLength(1)

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('useToast', () => {
  it('avisa quando usado fora do ToastProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => null)

    expect(() => render(<Trigger />)).toThrow(
      'useToast deve ser usado dentro de um ToastProvider'
    )

    consoleError.mockRestore()
  })

  it('funciona com o provider montado sem o roteador', () => {
    render(
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <Trigger />
        </ToastProvider>
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: 'disparar' })).toBeInTheDocument()
  })
})
