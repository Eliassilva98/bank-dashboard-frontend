import styled, { css } from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  transition
} from '@/styles/themeHelpers'
import { media } from '@/styles/media'

const buttonTransition = transition(
  ['background', 'border-color', 'box-shadow', 'transform'],
  '0.2s',
  'ease'
)

const baseButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing('xs')};
  min-height: 2.75rem;
  padding: 0 ${spacing('lg')};
  font-size: ${fontSize('md')};
  font-weight: ${fontWeight('medium')};
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: ${radius('md')};
  cursor: pointer;
  ${buttonTransition}

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${color('feedback.focusShadow')};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.85;
  }

  ${media.md`
min-height: 2.5rem;
padding: 0 ${spacing('xl')};
font-size: ${fontSize('sm')};
`}
`

export const Button = styled.button`
  ${baseButton}

  &[data-variant='primary'] {
    color: ${color('text.inverse')};
    background-color: ${color('border.focus')};
    border-color: ${color('border.focus')};

    &:hover:not(:disabled) {
      background-color: ${color('text.secondary')};
      border-color: ${color('text.secondary')};
    }
  }

  &[data-variant='secondary'] {
    color: ${color('text.primary')};
    background-color: ${color('background.primary')};
    border-color: ${color('border.default')};

    &:hover:not(:disabled) {
      background-color: ${color('background.secondary')};
      border-color: ${color('border.hover')};
    }
  }

  &[data-variant='danger'] {
    color: ${color('background.primary')};
    background-color: ${color('feedback.error')};
    border-color: ${color('feedback.error')};

    &:hover:not(:disabled) {
      filter: brightness(0.95);
    }

    &:focus-visible {
      box-shadow: 0 0 0 3px ${color('feedback.errorShadow')};
    }
  }

  &[data-variant='ghost'] {
    color: ${color('text.secondary')};
    background-color: transparent;
    border-color: transparent;

    &:hover:not(:disabled) {
      color: ${color('text.primary')};
      background-color: ${color('background.secondary')};
    }
  }

  &[data-variant='link'] {
    min-height: auto;
    padding: 0;
    color: ${color('border.focus')};
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover:not(:disabled) {
      color: ${color('text.secondary')};
    }

    &:focus-visible {
      outline: 2px solid ${color('border.focus')};
      outline-offset: 2px;
      box-shadow: none;
    }

    &:disabled[data-variant='primary'],
    &:disabled[data-variant='danger'] {
      color: ${color('background.primary')};
    }
  }
`
