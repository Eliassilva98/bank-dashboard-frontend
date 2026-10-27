import styled from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  shadow
} from '@/styles/themeHelpers'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing('md')};
  background-color: rgba(15, 23, 42, 0.6);
  z-index: 50;
`

export const Dialog = styled.div`
  width: 100%;
  max-width: 28rem;
  max-height: calc(100dvh - ${spacing('xl')});
  display: flex;
  flex-direction: column;
  background-color: ${color('background.primary')};
  border: 1px solid ${color('border.default')};
  border-radius: ${radius('md')};
  box-shadow: ${shadow('lg')};
  outline: none;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing('md')};
  padding: ${spacing('md')} ${spacing('lg')};
  border-bottom: 1px solid ${color('border.default')};
`

export const Title = styled.h2`
  margin: 0;
  font-size: ${fontSize('lg')};
  font-weight: ${fontWeight('semibold')};
  color: ${color('text.primary')};
  line-height: 1.25;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: ${color('text.secondary')};
  background-color: transparent;
  border: none;
  border-radius: ${radius('sm')};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: ${color('text.primary')};
    background-color: ${color('background.secondary')};
  }

  &:focus-visible {
    outline: 2px solid ${color('border.focus')};
    outline-offset: 2px;
  }
`

export const Content = styled.div`
  padding: ${spacing('lg')};
  overflow-y: auto;
`
