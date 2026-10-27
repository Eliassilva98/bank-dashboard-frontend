import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import MarketStrip from './MarketStrip'

const market = {
  dolar: { value: 5.0619, variationPct: -0.05, updatedAt: '2026-10-19 07:58:23' },
  selic: { value: 14.9, date: '17/10/2026' },
  cdi: { value: 14.8, date: '17/10/2026' }
}

const renderStrip = (props = {}) =>
  renderWithProviders(
    <MarketStrip market={market} isLoading={false} error={null} {...props} />
  )

describe('MarketStrip', () => {
  it('mostra dólar, Selic e CDI', () => {
    renderStrip()

    expect(screen.getByText(/US\$\s5,06/)).toBeInTheDocument()
    expect(screen.getByText('14.9%')).toBeInTheDocument()
    expect(screen.getByText('14.8%')).toBeInTheDocument()
    expect(screen.getAllByText('Referência 17/10/2026')).toHaveLength(2)
  })

  it('mostra a variação do dólar com o sinal correto', () => {
    const { unmount } = renderStrip()

    expect(screen.getByText(/-0,05%/)).toBeInTheDocument()

    unmount()
    renderStrip({ market: { ...market, dolar: { ...market.dolar, variationPct: 1.234 } } })

    expect(screen.getByText(/\+\s*1,23%/)).toBeInTheDocument()
  })

  it('mostra o erro geral', () => {
    renderStrip({ market: null, error: 'Não foi possível carregar os dados do mercado.' })

    expect(
      screen.getByText('Não foi possível carregar os dados do mercado.')
    ).toBeInTheDocument()
  })

  it('não mostra os indicadores enquanto carrega', () => {
    renderStrip({ market: null, isLoading: true })

    expect(screen.queryByText('Dólar')).not.toBeInTheDocument()
    expect(screen.queryByText('Selic')).not.toBeInTheDocument()
  })

  describe('quando só um indicador falha', () => {
    it('marca só a Selic e o CDI como indisponíveis e mantém o dólar', () => {
      renderStrip({ market: { ...market, selic: null, cdi: null } })

      expect(screen.getByText(/US\$\s5,06/)).toBeInTheDocument()
      expect(screen.getAllByText('Indisponível')).toHaveLength(2)
    })

    it('marca só o dólar como indisponível e mantém Selic e CDI', () => {
      renderStrip({ market: { ...market, dolar: null } })

      expect(screen.getAllByText('Indisponível')).toHaveLength(1)
      expect(screen.getByText('14.9%')).toBeInTheDocument()
      expect(screen.getByText('14.8%')).toBeInTheDocument()
    })
  })
})
