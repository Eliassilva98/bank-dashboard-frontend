import styled from 'styled-components'
import { color, fontSize, fontWeight, spacing } from '@/styles/themeHelpers'
import { media } from '@/styles/media'

export const Container = styled.main`
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: ${spacing('xl')} ${spacing('lg')};

  ${media.md`
  padding: ${spacing('lg')} ${spacing('md')};
`}
`

export const Section = styled.section`
  & + & {
    margin-top: ${spacing('xl')};
  }
`

export const Actions = styled.div`
  display: flex;
  gap: ${spacing('md')};
`

export const Footer = styled.footer`
  display: flex;
  justify-content: center;
  margin-top: ${spacing('xl')};
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing('md')};
  margin-bottom: ${spacing('md')};
`

export const SectionTitle = styled.h2`
  font-size: ${fontSize('lg')};
  font-weight: ${fontWeight('semibold')};
  color: ${color('text.primary')};
`
