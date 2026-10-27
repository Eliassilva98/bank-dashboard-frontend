import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, ThemeProvider } from 'styled-components'
import { theme } from './theme'
import GlobalStyles from './GlobalStyles'

const generatedCss = (customTheme = theme) => {
  const sheet = new ServerStyleSheet()

  renderToString(
    sheet.collectStyles(
      <ThemeProvider theme={customTheme}>
        <GlobalStyles />
      </ThemeProvider>
    )
  )

  const css = sheet.getStyleTags().replace(/\s+/g, '')

  sheet.seal()

  return css
}

describe('GlobalStyles', () => {
  it('zera margens e paddings e usa border-box em tudo', () => {
    expect(generatedCss()).toContain('box-sizing:border-box;margin:0;padding:0;')
  })

  it('aplica a cor de fundo e a cor do texto do tema ao body', () => {
    const css = generatedCss()

    expect(css).toContain(`background-color:${theme.colors.background.secondary}`)
    expect(css).toContain(`color:${theme.colors.text.primary}`)
  })

  it('usa a fonte do tema', () => {
    expect(generatedCss()).toContain(theme.fonts.body.replace(/\s+/g, ''))
  })

  it('usa fontes do sistema quando o tema não define fontes', () => {
    expect(generatedCss({ ...theme, fonts: undefined })).toContain('system-ui,-apple-system')
  })

  it('mostra foco visível usando a cor de foco do tema', () => {
    expect(generatedCss()).toContain(
      `:focus-visible{outline:2pxsolid${theme.colors.border.focus}`
    )
  })

})
