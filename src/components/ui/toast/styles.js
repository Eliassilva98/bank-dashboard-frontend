import styled, { css } from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  shadow
} from '@/styles/themeHelpers'

const typeStyles = {
  success: css`
    color: ${color('feedback.success')};
    background-color: ${color('background.success')};
    border-color: ${color('feedback.success')};
  `,

  error: css`
    color: ${color('feedback.error')};
    background-color: ${color('background.error')};
    border-color: ${color('feedback.error')};
  `,

  info: css`
    color: ${color('text.primary')};
    background-color: ${color('background.primary')};
    border-color: ${color('border.default')};
  `
}

export const ToastViewport = styled.div`
  position: fixed;
  right: ${spacing('lg')};
  bottom: ${spacing('lg')};
  display: flex;
  flex-direction: column;
  gap: ${spacing('sm')};
  max-width: 24rem;
  width: calc(100% - ${spacing('xl')});
  z-index: 100;
`

export const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing('sm')};
  padding: ${spacing('md')};
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  line-height: 1.5;
  background-color: ${color('background.primary')};
  border: 1px solid ${color('border.default')};
  border-radius: ${radius('md')};
  box-shadow: ${shadow('md')};

  svg {
    flex-shrink: 0;
  }

  span {
    flex: 1;
    min-width: 0;
  }

  ${({ $type }) => typeStyles[$type] || typeStyles.info}
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  color: inherit;
  background-color: transparent;
  border: none;
  border-radius: ${radius('sm')};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`
