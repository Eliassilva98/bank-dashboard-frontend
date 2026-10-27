export const loggedUser = {
  id: 1,
  name: 'Elias Blum',
  email: 'elias@email.com'
}

const buildTransactions = () => [
  {
    id: 7,
    type: 'transfer_in',
    amount: '10.00',
    description: null,
    counterparty: { name: 'Maria Alves' },
    created_at: '2026-10-19T15:00:00.000Z'
  },
  {
    id: 6,
    type: 'transfer_out',
    amount: '120.00',
    description: null,
    counterparty: { name: 'João Souza' },
    created_at: '2026-10-18T15:00:00.000Z'
  },
  {
    id: 5,
    type: 'deposit',
    amount: '500.00',
    description: 'Salário',
    counterparty: null,
    created_at: '2026-10-17T15:00:00.000Z'
  },
  {
    id: 4,
    type: 'deposit',
    amount: '300.60',
    description: 'Freelance',
    counterparty: null,
    created_at: '2026-10-16T15:00:00.000Z'
  },
  {
    id: 3,
    type: 'transfer_out',
    amount: '50.00',
    description: 'Presente',
    counterparty: null,
    created_at: '2026-10-15T15:00:00.000Z'
  },
  {
    id: 2,
    type: 'deposit',
    amount: '20.00',
    description: 'Reembolso',
    counterparty: null,
    created_at: '2026-10-14T15:00:00.000Z'
  },
  {
    id: 1,
    type: 'deposit',
    amount: '40.00',
    description: 'Primeiro depósito',
    counterparty: null,
    created_at: '2026-10-13T15:00:00.000Z'
  }
]

const defaultMarket = {
  dolar: { value: 5.0619, variationPct: -0.051335, updatedAt: '2026-10-19 07:58:23' },
  selic: { value: 14.9, date: '17/10/2026' },
  cdi: { value: 14.8, date: '17/10/2026' }
}

Cypress.Commands.add(
  'mockApi',
  ({ balance = 800.6, transactions = buildTransactions(), market = defaultMarket } = {}) => {
    const state = { balance, transactions: [...transactions] }

    cy.intercept('GET', '**/accounts/me', (req) => {
      req.reply({ account: { balance: String(state.balance) }, user: loggedUser })
    }).as('getAccount')

    cy.intercept('GET', '**/market', market ? { body: market } : { statusCode: 502, body: { status: 'error', message: 'Serviço de mercado indisponível' } }).as('getMarket')

    cy.intercept({ method: 'GET', pathname: '**/transactions' }, (req) => {
      const page = Number(req.query.page ?? 1)
      const pageSize = Number(req.query.pageSize ?? 10)
      const start = (page - 1) * pageSize

      req.reply({
        items: state.transactions.slice(start, start + pageSize),
        total: state.transactions.length
      })
    }).as('getTransactions')

    cy.intercept('POST', '**/transactions', (req) => {
      const { type, amount, description } = req.body
      const isDeposit = type === 'deposit'

      state.balance = isDeposit ? state.balance + amount : state.balance - amount
      state.transactions.unshift({
        id: state.transactions.length + 1,
        type: isDeposit ? 'deposit' : 'transfer_out',
        amount: String(amount),
        description: description ?? null,
        counterparty: isDeposit ? null : { name: 'Maria Alves' },
        created_at: '2026-10-20T12:00:00.000Z'
      })

      req.reply({ statusCode: 201, body: { new_balance: state.balance } })
    }).as('createTransaction')

    cy.intercept('POST', '**/auth/logout', { statusCode: 204 }).as('logout')
  }
)

Cypress.Commands.add('visitAsLoggedUser', (path = '/', options = {}) => {
  cy.mockApi(options)

  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('@fintech:token', 'e2e-token')
      win.localStorage.setItem('@fintech:user', JSON.stringify(loggedUser))
    }
  })
})
