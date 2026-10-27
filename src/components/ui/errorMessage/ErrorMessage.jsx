import { Wrapper } from './styles'

const ErrorMessage = ({ children }) => {
  if (!children) return null

  return <Wrapper role='alert'>{children}</Wrapper>
}

export default ErrorMessage