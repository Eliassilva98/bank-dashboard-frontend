import styled from 'styled-components'
import { color, radius, spacing } from '@/styles/themeHelpers'
import { media } from '@/styles/media'

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing('lg')};

  ${media.md`
  grid-template-columns: 1fr;
  gap: ${spacing('md')};
`}
`

export const VisibilityButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing('xs')};
  color: ${color('text.secondary')};
  background: none;
  border: none;
  border-radius: ${radius('sm')};
  cursor: pointer;

  &:hover {
    color: ${color('text.primary')};
  }

  &:focus-visible {
    outline: 2px solid ${color('border.focus')};
    outline-offset: 2px;
  }
`
