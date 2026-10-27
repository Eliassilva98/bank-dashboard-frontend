import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import Link from './Link'

describe('Link', () => {
  describe('link interno (to)', () => {
    it('renderiza um link para a rota, sem abrir nova aba', () => {
      renderWithProviders(<Link to='/extrato'>Ver mais</Link>)

      const link = screen.getByRole('link', { name: 'Ver mais' })

      expect(link).toHaveAttribute('href', '/extrato')
      expect(link).not.toHaveAttribute('target')
    })
  })

  describe('link externo (href)', () => {
    it('abre em nova aba de forma segura', () => {
      renderWithProviders(<Link href='https://exemplo.com'>Site</Link>)

      const link = screen.getByRole('link', { name: 'Site' })

      expect(link).toHaveAttribute('href', 'https://exemplo.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('desabilitado', () => {
    it('não vira link e avisa para leitores de tela', () => {
      renderWithProviders(
        <Link to='/extrato' disabled>
          Indisponível
        </Link>
      )

      const element = screen.getByText('Indisponível')

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(element.tagName).toBe('SPAN')
      expect(element).toHaveAttribute('aria-disabled', 'true')
      expect(element).toHaveAttribute('data-disabled', 'true')
    })

    it('também desabilita links externos', () => {
      renderWithProviders(
        <Link href='https://exemplo.com' disabled>
          Externo
        </Link>
      )

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByText('Externo')).not.toHaveAttribute('href')
    })
  })

  describe('sem destino', () => {
    it('renderiza só o texto, sem link', () => {
      renderWithProviders(<Link>Sem destino</Link>)

      const element = screen.getByText('Sem destino')

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(element.tagName).toBe('SPAN')
      expect(element).not.toHaveAttribute('aria-disabled')
    })
  })

  describe('aparência', () => {
    it('usa variante primary, tamanho md e sem sublinhado por padrão', () => {
      renderWithProviders(<Link to='/'>Início</Link>)

      const link = screen.getByRole('link', { name: 'Início' })

      expect(link).toHaveAttribute('data-variant', 'primary')
      expect(link).toHaveAttribute('data-size', 'md')
      expect(link).toHaveAttribute('data-underline', 'false')
    })

    it('repassa variante, tamanho e sublinhado informados', () => {
      renderWithProviders(
        <Link to='/' variant='ghost' size='sm' underline>
          Início
        </Link>
      )

      const link = screen.getByRole('link', { name: 'Início' })

      expect(link).toHaveAttribute('data-variant', 'ghost')
      expect(link).toHaveAttribute('data-size', 'sm')
      expect(link).toHaveAttribute('data-underline', 'true')
    })

    it('repassa atributos extras, como aria-label', () => {
      renderWithProviders(
        <Link to='/' aria-label='Ir para o início'>
          Início
        </Link>
      )

      expect(screen.getByRole('link', { name: 'Ir para o início' })).toBeInTheDocument()
    })
  })
})
