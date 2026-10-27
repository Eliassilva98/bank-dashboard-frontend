import { Card, Header, Label, Value, Hint } from './styles'
import Button from '../button/Button'

const StatCard = ({ label, value, hint, action, isLoading, error, onRetry }) => {
  return (
    <Card>
      <Header>
        <Label>{label}</Label>
        {action}
      </Header>

      {isLoading && <Value>Carregando...</Value>}

      {!isLoading && error && ((
        <>
          <Value>--</Value>
          <Hint $isError>{error}</Hint>
          <Button type='button' variant='secondary' size='sm' onClick={onRetry}>Tentar novamente</Button>
        </>
      ))}

      {!isLoading && !error && (
        <>
          <Value>{value}</Value>
          {hint && <Hint>{hint}</Hint>}
        </>
      )}
    </Card>
  )
}

export default StatCard