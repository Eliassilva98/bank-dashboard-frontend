import { css } from 'styled-components'
import { theme } from './theme'

const breakpoints = theme.breakpoints

const buildMedia =
  (maxWidth) =>
  (strings, ...values) => css`
    @media (max-width: ${maxWidth}) {
      ${css(strings, ...values)}
    }
  `

export const media = {
  xs: buildMedia(breakpoints.xs),
  sm: buildMedia(breakpoints.sm),
  md: buildMedia(breakpoints.md),
  lg: buildMedia(breakpoints.lg),
  xl: buildMedia(breakpoints.xl)
}
