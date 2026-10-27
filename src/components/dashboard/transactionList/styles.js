import styled from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  shadow
} from '@/styles/themeHelpers'

export const SectionTitle = styled.h2`

`

export const List = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: ${spacing('md')} 0;
  background-color: ${color('background.primary')};
  border: 1px solid ${color('border.default')};
  border-radius: ${radius('md')};
  box-shadow: ${shadow('sm')};
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing('md')};
  padding: ${spacing('md')} ${spacing('lg')};
  border-bottom: 1px solid ${color('border.default')};

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: ${color('background.secondary')};
  }
`

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing('xs')};
  min-width: 0;
  flex: 1;
`

export const Description = styled.strong`
  font-size: ${fontSize('md')};
  font-weight: ${fontWeight('medium')};
  color: ${color('text.primary')};
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Date = styled.span`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('regular')};
  color: ${color('text.secondary')};
  line-height: 1.25;
`

export const Amount = styled.span`
  flex-shrink: 0;
  font-size: ${fontSize('md')};
  font-weight: ${fontWeight('semibold')};
  color: ${color('text.primary')};
  line-height: 1.25;

  &[data-deposit='true'] {
    color: ${color('feedback.success')};
  }

  &[data-deposit='false'] {
    color: ${color('feedback.error')};
  }
`

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing('md')};
  padding: ${spacing('md')} ${spacing('lg')} 0;
  border-top: 1px solid ${color('border.default')};
  font-size: ${fontSize('sm')};
  color: ${color('text.secondary')};
`

export const PageButton = styled.button`
  padding: ${spacing('sm')} ${spacing('md')};
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  color: ${color('text.primary')};
  background-color: ${color('background.primary')};
  border: 1px solid ${color('border.default')};
  border-radius: ${radius('sm')};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${color('background.secondary')};
    border-color: ${color('border.hover')};
  }

  &:focus-visible {
    outline: 2px solid ${color('border.focus')};
    outline-offset: 2px;
  }

  &:disabled {
    color: ${color('text.disabled')};
    background-color: ${color('background.disabled')};
    border-color: ${color('border.disabled')};
    cursor: not-allowed;
  }
`

export const Empty = styled.p`
  padding: ${spacing('xl')};
  font-size: ${fontSize('md')};
  text-align: center;
  color: ${color('text.secondary')};
`

export const Error = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing('md')};
  padding: ${spacing('xl')};
  font-size: ${fontSize('md')};
  text-align: center;
  color: ${color('feedback.error')};
`
