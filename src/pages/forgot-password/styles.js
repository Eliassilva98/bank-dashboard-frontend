import styled from 'styled-components'
import { fontSize, spacing } from '@/styles/themeHelpers'

export const SuccessAction = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${spacing('md')};

  button {
    width: 100%;
    max-width: 20rem;
    min-height: 3.25rem;
    font-size: ${fontSize('lg')};
  }
`
