import { Wrapper, Title, Subtitle, Description } from './styles'

const PageHeader = ({ title, subtitle, description }) => {
  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {description && <Description>{description}</Description>}
    </Wrapper>
  )
}

export default PageHeader