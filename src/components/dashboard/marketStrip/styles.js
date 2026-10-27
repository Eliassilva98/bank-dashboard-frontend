import styled, { css } from 'styled-components'
import {
  color,
  spacing,
  fontSize,
  fontWeight,
  radius,
  shadow
} from '@/styles/themeHelpers'
import { media } from '@/styles/media'

export const Strip = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: ${spacing('lg')};
  padding: ${spacing('md')} ${spacing('lg')};
  background-color: ${color('background.primary')};
  border: 1px solid ${color('border.default')};
  border-radius: ${radius('md')};
  box-shadow: ${shadow('sm')};

  ${media.md`
  flex-direction: column;
  gap: ${spacing('md')};
  padding: ${spacing('md')};
`}
`

const indicatorBase = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 ${spacing('md')};

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  &:not(:last-child) {
    border-right: 1px solid ${color('border.default')};
  }

  ${media.md`
  padding: 0;

  &:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid ${color('border.default')};
    padding-bottom: ${spacing('md')};
  }
`}
`

export const Indicator = styled.div`
  ${indicatorBase}
  gap: ${spacing('xs')};
`

export const IndicatorSkeleton = styled.div`
  ${indicatorBase}
  gap: ${spacing('sm')};
`

export const Name = styled.span`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  color: ${color('text.secondary')};
  line-height: 1.25;
  text-transform: uppercase;
  letter-spacing: 0.025rem;
`

export const Value = styled.strong`
  font-size: ${fontSize('lg')};
  font-weight: ${fontWeight('semibold')};
  color: ${color('text.primary')};
  line-height: 1.25;
`

export const Meta = styled.span`
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('regular')};
  color: ${color('text.secondary')};
  line-height: 1.25;

  &[data-variation='positive'] {
    color: ${color('feedback.success')};
  }

  &[data-variation='negative'] {
    color: ${color('feedback.error')};
  }
`

export const Variation = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${spacing('xs')};
  font-size: ${fontSize('sm')};
  font-weight: ${fontWeight('medium')};
  line-height: 1.25;
  color: ${({ $trend }) => {
    if ($trend === 'up') return color('feedback.success')
    if ($trend === 'down') return color('feedback.error')
    return color('text.secondary')
  }};

  svg {
    color: inherit;
  }
`
