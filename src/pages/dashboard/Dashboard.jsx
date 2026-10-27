import { useState } from 'react'
import useAccount from '@/hooks/useAccount'
import useTransactions from '@/hooks/useTransactions'
import useMarket from '@/hooks/useMarket'
import PageContainer from '@/components/ui/pageContainer/PageContainer'
import PageHeader from '@/components/ui/pageHeader/PageHeader'
import Button from '@/components/ui/button/Button'
import CardsGrid from '@/components/dashboard/cardsGrid/CardsGrid'
import MarketStrip from '@/components/dashboard/marketStrip/MarketStrip'
import TransactionList from '@/components/dashboard/transactionList/TransactionList'
import TransactionModal from '@/components/dashboard/transactionModal/TransactionModal'
import Link from '@/components/ui/link/Link'
import useBalanceVisibility from '@/hooks/useBalanceVisibility'
import { useAuth } from '@/context/useAuth'
import { Actions, Container, Footer, Section, SectionHeader, SectionTitle } from './styles'

const RECENT_LIMIT = 5

const Dashboard = () => {
  const { isHidden, toggle: toggleHidden } = useBalanceVisibility()
  const { logout } = useAuth()

  const {
    account,
    isLoading: accountLoading,
    error: accountError,
    refetch: refetchAccount,
    applyBalance
  } = useAccount()

  const {
    items,
    page,
    total,
    setPage,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions
  } = useTransactions()

  const { market, isLoading: marketLoading, error: marketError } = useMarket()

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
  }

  const handleTransactionCreated = (result) => {
    if (result?.new_balance !== undefined) {
      applyBalance(result.new_balance)
    }

    refetchTransactions()
  }

  return (
    <PageContainer>
      <Container>
        <PageHeader
          title='Seu resumo financeiro.'
          description='Acompanhe saldo, movimentações e mercado.'
        />

        <Section>
          <CardsGrid
            account={account}
            transactions={items}
            isLoading={accountLoading}
            error={accountError}
            onRetry={refetchAccount}
            isHidden={isHidden}
            onToggleHidden={toggleHidden}
          />
        </Section>

        <Section>
          <Actions>
            <Button type='button' onClick={() => setIsTransactionModalOpen(true)}>
              Nova Transação
            </Button>
          </Actions>
        </Section>

        <Section>
          <MarketStrip market={market} isLoading={marketLoading} error={marketError} />
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Últimas transações</SectionTitle>
            {total > RECENT_LIMIT && <Link to='/extrato'>Ver mais</Link>}
          </SectionHeader>

          <TransactionList
            items={items.slice(0, RECENT_LIMIT)}
            page={page}
            total={total}
            onPageChange={setPage}
            isLoading={transactionsLoading}
            error={transactionsError}
            onRetry={refetchTransactions}
            showPagination={false}
          />
        </Section>

        <Footer>
          <Button
            type='button'
            variant='primary'
            isLoading={isLoggingOut}
            onClick={handleLogout}
          >
            Sair da conta
          </Button>
        </Footer>

        {isTransactionModalOpen && (
          <TransactionModal
            onClose={() => setIsTransactionModalOpen(false)}
            onTransactionCreated={handleTransactionCreated}
          />
        )}
      </Container>
    </PageContainer>
  )
}

export default Dashboard