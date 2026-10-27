import styled from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  transition
} from '@/styles/themeHelpers'

const buttonTransition = transition(
  ['background-color', 'border-color', 'color'],
  '0.2s',
  'ease'
)

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing('lg')};
`

export const TypeGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing('sm')};
`

export const TypeButton = styled.button`
  padding: ${spacing('sm')} ${spacing('md')};
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  color: ${({ $active }) =>
    $active ? color('text.inverse') : color('text.primary')};
  background-color: ${({ $active }) =>
    $active ? color('border.focus') : color('background.secondary')};
  border: 1px solid
    ${({ $active }) => ($active ? color('border.focus') : color('border.default'))};
  border-radius: ${radius('sm')};
  cursor: pointer;
  ${buttonTransition}

  &:hover:not([disabled]) {
    background-color: ${({ $active }) =>
      $active ? color('border.focus') : color('border.disabled')};
  }

  &:focus-visible {
    outline: 2px solid ${color('border.focus')};
    outline-offset: 2px;
  }
`

export const Field = styled.div`
  dispaly: flex;
  flex-direction: column;
  gap: ${spacing('xs')};
`

export const Label = styled.label`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  color: ${color('text.secondary')};
  line-height: 1.25;
`

export const Input = styled.input`
  width: 100%;
  padding: ${spacing('sm')} ${spacing('md')};
  font-size: ${fontSize('md')};
  color: ${color('text.primary')};
  background-color: ${color('background.input')};
  border: 1px solid ${color('border.default')};
  border-radius: ${radius('sm')};
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: ${color('text.placeholder')};
  }

  &:hover {
    border-color: ${color('border.hover')};
  }

  &:focus {
    border-color: ${color('border.focus')};
    box-shadow: 0 0 0 3px ${color('feedback.focusShadow')};
  }

  &:disabled {
    color: ${color('text.disabled')};
    background-color: ${color('background.disabled')};
    cursor: not-allowed;
  }
`

export const SubmitButton = styled.button`
  width: 100%;
  padding: ${spacing('md')};
  font-size: ${fontSize('md')};
  font-weight: ${fontWeight('semibold')};
  color: ${color('text.inverse')};
  background-color: ${color('border.focus')};
  border: none;
  border-radius: ${radius('sm')};
  cursor: pointer;
  ${buttonTransition}

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${color('border.focus')};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const FormError = styled.p`
  margin: 0;
  padding: ${spacing('sm')} ${spacing('md')};
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  color: ${color('feedback.error')};
  text-align: center;
  background-color: ${color('background.error')};
  border: 1px solid ${color('feedback.error')};
  border-radius: ${radius('sm')};
`
