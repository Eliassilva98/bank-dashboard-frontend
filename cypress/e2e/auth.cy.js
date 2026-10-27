import { loggedUser } from '../support/commands'

describe('Autenticação', () => {
  it('manda quem não está logado para o login', () => {
    cy.visit('/')

    cy.location('pathname').should('eq', '/login')
    cy.contains('h1, h2', 'Entrar').should('be.visible')
  })

  it('protege também a página de extrato', () => {
    cy.visit('/extrato')

    cy.location('pathname').should('eq', '/login')
  })

  it('mostra erros de validação sem chamar o servidor', () => {
    cy.intercept('POST', '**/auth/login').as('login')
    cy.visit('/login')

    cy.contains('button', 'Entrar').click()

    cy.contains('Informe o email').should('be.visible')
    cy.contains('Informe a senha').should('be.visible')

    cy.get('#email').type('isso-nao-e-email')
    cy.get('#password').type('123')
    cy.contains('button', 'Entrar').click()

    cy.contains('E-mail inválido').should('be.visible')
    cy.contains('Senha deve conter no mínimo 8 caracteres').should('be.visible')
    cy.get('@login.all').should('have.length', 0)
  })

  it('mostra a mensagem do servidor quando a senha está errada', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { status: 'error', message: 'Credenciais inválidas' }
    }).as('login')
    cy.visit('/login')

    cy.get('#email').type('elias@email.com')
    cy.get('#password').type('senha-errada')
    cy.contains('button', 'Entrar').click()

    cy.wait('@login')
    cy.contains('[role="alert"]', 'Credenciais inválidas').should('be.visible')
    cy.location('pathname').should('eq', '/login')
  })

  it('entra, mostra o dashboard e guarda a sessão', () => {
    cy.mockApi()
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { token: 'e2e-token', user: loggedUser }
    }).as('login')
    cy.visit('/login')

    cy.get('#email').type('elias@email.com')
    cy.get('#password').type('senha1234')
    cy.contains('button', 'Entrar').click()

    cy.wait('@login').its('request.body').should('deep.equal', {
      email: 'elias@email.com',
      password: 'senha1234'
    })
    cy.location('pathname').should('eq', '/')
    cy.contains('Seu resumo financeiro.').should('be.visible')
    cy.window().its('localStorage')
      .invoke('getItem', '@fintech:token')
      .should('eq', 'e2e-token')
  })

  it('quem já está logado não vê o login', () => {
    cy.visitAsLoggedUser('/login')

    cy.location('pathname').should('eq', '/')
  })

  it('sai da conta, limpa a sessão e volta para o login', () => {
    cy.visitAsLoggedUser('/')

    cy.contains('button', 'Sair da conta').click()

    cy.wait('@logout')
    cy.location('pathname').should('eq', '/login')
    cy.window().its('localStorage')
      .invoke('getItem', '@fintech:token')
      .should('be.null')

    cy.visit('/')
    cy.location('pathname').should('eq', '/login')
  })

  it('sai da conta mesmo se o servidor falhar', () => {
    cy.visitAsLoggedUser('/')
    cy.intercept('POST', '**/auth/logout', { forceNetworkError: true })

    cy.contains('button', 'Sair da conta').click()

    cy.location('pathname').should('eq', '/login')
  })

  it('renova o token quando ele expira e continua na página', () => {
    cy.visitAsLoggedUser('/')
    cy.contains('R$').should('be.visible')

    let attempts = 0
    cy.intercept('GET', '**/accounts/me', (req) => {
      attempts += 1
      if (req.headers.authorization === 'Bearer e2e-token') {
        req.reply({ statusCode: 401, body: { message: 'Token expirado' } })
        return
      }
      req.reply({ account: { balance: '999.00' }, user: loggedUser })
    }).as('account')
    cy.intercept('POST', '**/auth/refresh', {
      statusCode: 200,
      body: { token: 'token-renovado' }
    }).as('refresh')

    cy.reload()

    cy.wait('@refresh')
    cy.contains(/R\$\s999,00/).should('be.visible')
    cy.location('pathname').should('eq', '/')
    cy.wrap(null).then(() => expect(attempts).to.be.gte(2))
  })

  it('volta para o login quando o refresh também falha', () => {
    cy.visitAsLoggedUser('/')
    cy.intercept('GET', '**/accounts/me', { statusCode: 401, body: { message: 'Expirado' } })
    cy.intercept('POST', '**/auth/refresh', { statusCode: 401, body: { message: 'Expirado' } })

    cy.reload()

    cy.location('pathname').should('eq', '/login')
  })
})
