import styled from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  transition
} from '@/styles/themeHelpers'
import { media } from '@/styles/media'

const baseTransition = transition([
  'border-color',
  'box-shadow',
  'background-color',
  '0.2s',
  'ease'
])

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing('xs')};
  width: 100%;
`

export const Label = styled.label`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  color: ${color('text.secondary')};
  line-height: 1.25;
`

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`

export const Input = styled.input`
  width: 100%;
  height: 2.75rem;
  padding: 0 ${spacing('md')};
  padding-right: ${spacing('xl')};
  font-size: ${fontSize('md')};
  line-height: 1.5;
  color: ${color('text.primary')};
  background-color: ${color('background.input')};
  border: 1px solid
    ${({ $hasError }) => color($hasError ? 'feedback.error' : 'border.default')};
  border-radius: ${radius('md')};
  ${baseTransition}

  &::placeholder {
    color: ${color('text.placeholder')};
  }

  &:hover:not(:disabled) {
    border-color: ${({ $hasError }) => color($hasError ? 'feedback.error' : 'border.hover')};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ $hasError }) => color($hasError ? 'feedback.error' : 'border.focus')};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) => color($hasError ? 'feedback.errorShadow' : 'feedback.focusShadow')};
  }

  &:disabled {
    background-color: ${color('background.disabled')};
    color: ${color('text.disabled')};
    border-color: ${color('border.disabled')};
    cursor: not-allowed;
  }

  &[aria-invalid='true'] {
    background-color: ${color('background.error')};
  }

  ${media.md`
    height: 2.5rem;
    font-size: ${fontSize('sm')};
`}
`

export const ToggleButton = styled.button`
  position: absolute;
  right: ${spacing('sm')};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: ${color('text.secondary')};
  background-color: transparent;
  border-radius: ${radius('sm')};
  cursor: pointer;
  ${baseTransition}

  &:hover {
    color: ${color('text.primary')};
    background-color: ${color('background.secondary')};
  }

  &:focus-visible {
    outline: 2px solid ${color('border.focus')};
    outline-offset: 2px;
  }

  &:active {
    color: ${color('text.primary')};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`

export const ErrorText = styled.span`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('regular')};
  color: ${color('feedback.error')};
  line-height: 1.25;
`
