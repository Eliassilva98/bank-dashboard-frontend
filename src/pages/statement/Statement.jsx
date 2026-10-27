import useTransactions from '@/hooks/useTransactions'
import PageContainer from '@/components/ui/pageContainer/PageContainer'
import PageHeader from '@/components/ui/pageHeader/PageHeader'
import Link from '@/components/ui/link/Link'
import TransactionList from '@/components/dashboard/transactionList/TransactionList'
import { Container, Section } from '@/pages/dashboard/styles'

const Statement = () => {
  const {
    items,
    page,
    total,
    setPage,
    isLoading,
    error,
    refetch
  } = useTransactions()

  return (
    <PageContainer>
      <Container>
        <Link to='/' variant='ghost'>← Voltar ao resumo</Link>

        <PageHeader
          title='Extrato completo.'
          description='Todas as suas movimentações, das mais recentes às mais antigas.'
        />

        <Section>
          <TransactionList
            items={items}
            page={page}
            total={total}
            onPageChange={setPage}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        </Section>
      </Container>
    </PageContainer>
  )
}

export default Statement
