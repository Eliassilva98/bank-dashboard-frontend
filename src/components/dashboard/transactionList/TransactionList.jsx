import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { isIncoming } from '@/utils/transactionType'
import { List, Row, Main, Description, Date, Amount, Pagination, PageButton, Empty, Error } from './styles'
import Button from '@/components/ui/button/Button'

const PAGE_SIZE = 10

const getDescription = (transaction) => {
  if (transaction.counterparty?.name) {
    const preposition = transaction.type === 'transfer_in' ? 'de' : 'para'

    return `Transferência ${preposition} ${transaction.counterparty.name}`
  }

  return transaction.description || (transaction.type === 'deposit' ? 'Depósito' : 'Transferência')
}

const TransactionList = ({
  items,
  page,
  total,
  onPageChange,
  isLoading,
  error,
  onRetry,
  showPagination = true }) => {
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const hasPrevious = page > 1
  const hasNext = page < totalPages

  if (isLoading) return <List>Carregando extrato...</List>
  if (error) return <Error>{error} <Button type='button' onClick={onRetry}>Tentar novamente</Button></Error>

  return (
    <List>
      {items.length === 0 && <Empty>Nenhuma transação ainda. Faça seu primeiro depósito!</Empty>}

      {items.map((transaction) => {
        const isDeposit = isIncoming(transaction)
        const amount = Number(transaction.amount)

        return (
          <Row key={transaction.id}>
            <Main>
              <Description>
                {getDescription(transaction)}
              </Description>
              <Date>{formatDate(transaction.created_at)}</Date>
            </Main>
            <Amount data-deposit={isDeposit}>
              {`${isDeposit ? '+' : '-'} ${formatCurrency(amount)}`}
            </Amount>
          </Row>
        )
      })}

      {showPagination && totalPages > 1 && (
        <Pagination>
          <PageButton type='button' disabled={!hasPrevious} onClick={() => onPageChange(page - 1)}>
            Anterior
          </PageButton>
          <span>{`Página ${page} de ${totalPages}`}</span>
          <PageButton type='button' disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
            Próxima
          </PageButton>
        </Pagination>
      )}
    </List>
  )
}

export default TransactionList