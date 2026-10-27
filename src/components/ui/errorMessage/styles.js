import styled from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  transition
} from '@/styles/themeHelpers'

const errorTransition = transition(['opacity', 'transform', '0.2s', 'ease'])

export const Wrapper = styled.div`
  width: 100%;
  padding: ${spacing('sm')} ${spacing('md')};
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  line-height: 1.5;
  color: ${color('feedback.error')};
  background-color: ${color('background.error')};
  border: 1px solid ${color('feedback.error')};
  border-left-width: 4px;
  border-radius: ${radius('md')};
  ${errorTransition}

  &[role='alert'] {
    animation: slideIn 0.2s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:empty {
    display: none;
  }
`
