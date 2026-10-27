import { createGlobalStyle } from 'styled-components'
import { color } from './themeHelpers'

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${({ theme }) => theme.fonts?.body || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
    line-height: 1.5;
    color: ${color('text.primary')};
    background-color: ${color('background.secondary')};
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${({ theme }) => theme.fonts?.heading || 'inherit'};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    line-height: 1.25;
    color: ${color('text.primary')};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  a {
    color: ${color('border.focus')};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid ${color('border.focus')};
      outline-offset: 2px;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;

    &:disabled {
      cursor: not-allowed;
    }
  }

  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul,
  ol {
    list-style: none;
  }

  :focus-visible {
    outline: 2px solid ${color('border.focus')};
    outline-offset: 2px;
  }

  ::selection {
    background-color: ${color('border.focus')};
    color: ${color('background.primary')};
  }
`

export default GlobalStyles
