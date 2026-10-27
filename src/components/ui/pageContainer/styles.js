import styled from 'styled-components'
import { spacing } from '@/styles/themeHelpers'

export const PageContainer = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${spacing('lg')};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`
