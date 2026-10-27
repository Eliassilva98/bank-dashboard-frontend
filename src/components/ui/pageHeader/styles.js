import styled from 'styled-components'
import { color, spacing, fontSize, fontWeight } from '@/styles/themeHelpers'

export const Wrapper = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${spacing('xs')};
  margin-bottom: ${spacing('lg')};
  text-align: center;
`

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${fontSize('lg')};
  font-weight: ${fontWeight('semibold')};
  color: ${color('text.primary')};
  line-height: 1.25;
`

export const Subtitle = styled.h2`
  font-size: ${fontSize('md')};
  font-weight: ${fontWeight('medium')};
  color: ${color('text.primary')};
  line-height: 1.5;
`

export const Description = styled.p`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('regular')};
  color: ${color('text.secondary')};
  line-height: 1.5;
`
