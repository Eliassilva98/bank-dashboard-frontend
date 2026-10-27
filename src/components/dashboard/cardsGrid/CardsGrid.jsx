import { useMemo } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import StatCard from '@/components/ui/statCard/StatCard'
import { formatCurrency } from '@/utils/formatCurrency'
import { HIDDEN_VALUE } from '@/utils/hiddenValue'
import { isIncoming } from '@/utils/transactionType'
import { Grid, VisibilityButton } from './styles'

const CardsGrid = ({
  account,
  transactions,
  isLoading,
  error,
  onRetry,
  isHidden,
  onToggleHidden
}) => {
  const { income, expense } = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          const amount = Number(transaction.amount)

          if (isIncoming(transaction)) {
            acc.income += amount
          } else {
            acc.expense += amount
          }
          return acc
        },
        { income: 0, expense: 0 }
      ),
    [transactions]
  )

  const balance = Number(account?.account?.balance ?? 0)

  const Icon = isHidden ? EyeOff : Eye

  return (
    <Grid>
      <StatCard
        label='Seu saldo'
        value={isHidden ? HIDDEN_VALUE : formatCurrency(balance)}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        action={
          <VisibilityButton
            type='button'
            onClick={onToggleHidden}
            aria-label={isHidden ? 'Mostrar valores' : 'Esconder valores'}
            aria-pressed={isHidden}
          >
            <Icon size={20} aria-hidden='true' />
          </VisibilityButton>
        }
      />

      <StatCard
        label='Receitas'
        value={formatCurrency(income)}
        hint='No período exíbido'
      />

      <StatCard
        label='Despesas'
        value={formatCurrency(expense)}
        hint='No período exíbido'
      />
    </Grid>
  )
}

export default CardsGrid
