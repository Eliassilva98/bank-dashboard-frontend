import styled from 'styled-components'
import { fontSize, spacing } from '@/styles/themeHelpers'

export const Container = styled.div`
  width: 100%;
  max-width: 28rem;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing('md')};
`

export const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: calc(${spacing('xs')} * -1);
  margin-bottom: ${spacing('xs')};
  font-size: ${fontSize('sm')};
`
