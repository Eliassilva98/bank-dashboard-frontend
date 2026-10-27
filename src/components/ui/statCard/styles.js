import styled from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  shadow
} from '@/styles/themeHelpers'

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing('xs')};
  padding: ${spacing('lg')};
  background-color: ${color('background.primary')};
  border: 1px solid ${color('border.default')};
  border-radius: ${radius('md')};
  box-shadow: ${shadow('sm')};
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing('sm')};
  min-height: 1.75rem;
`

export const Label = styled.span`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  color: ${color('text.secondary')};
  line-height: 1.25;
`

export const Value = styled.strong`
  font-size: ${fontSize('lg')};
  font-weight: ${fontWeight('semibold')};
  color: ${color('text.primary')};
  line-height: 1.25;
`

export const Hint = styled.span`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('regular')};
  color: ${color('text.secondary')};
  line-height: 1.25;
`
