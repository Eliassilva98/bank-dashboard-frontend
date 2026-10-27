const colors = {
  pageBackground: 'rgb(248, 250, 252)',
  cardBackground: 'rgb(255, 255, 255)',
  textPrimary: 'rgb(15, 23, 42)',
  textSecondary: 'rgb(71, 85, 105)',
  primary: 'rgb(59, 130, 246)',
  success: 'rgb(34, 197, 94)',
  error: 'rgb(239, 68, 68)',
  border: 'rgb(226, 232, 240)',
  white: 'rgb(255, 255, 255)'
}

describe('Cores e identidade visual', () => {
  beforeEach(() => {
    cy.visitAsLoggedUser('/')
    cy.contains(/R\$\s800,60/).should('be.visible')
  })

  it('usa o fundo claro da página e texto escuro legível', () => {
    cy.get('body')
      .should('have.css', 'background-color', colors.pageBackground)
      .and('have.css', 'color', colors.textPrimary)
  })

  it('o botão principal é azul com texto branco', () => {
    cy.contains('button', 'Nova Transação')
      .should('have.css', 'background-color', colors.primary)
      .and('have.css', 'color', colors.white)
  })

  it('o botão "Sair da conta" tem o estilo configurado', () => {
    cy.contains('button', 'Sair da conta').should('be.visible')
  })

  it('entradas aparecem em verde e saídas em vermelho no extrato', () => {
    cy.contains('span', /^\+\s+R\$\s10,00$/).should('have.css', 'color', colors.success)
    cy.contains('span', /^\+\s+R\$\s500,00$/).should('have.css', 'color', colors.success)
    cy.contains('span', /^-\s+R\$\s120,00$/).should('have.css', 'color', colors.error)
    cy.contains('span', /^-\s+R\$\s50,00$/).should('have.css', 'color', colors.error)
  })

  it('a queda do dólar aparece em vermelho', () => {
    cy.contains('span', /-0,05%/).should('have.css', 'color', colors.error)
  })

  it('a alta do dólar aparece em verde', () => {
    cy.visitAsLoggedUser('/', {
      market: {
        dolar: { value: 5.2, variationPct: 0.8, updatedAt: '2026-10-19 07:58:23' },
        selic: { value: 14.9, date: '17/10/2026' },
        cdi: { value: 14.8, date: '17/10/2026' }
      }
    })

    cy.contains('span', /\+\s*0,80%/).should('have.css', 'color', colors.success)
  })

  it('os cards são brancos, com borda cinza clara', () => {
    cy.contains('Seu saldo').parent().parent()
      .should('have.css', 'background-color', colors.cardBackground)
      .and('have.css', 'border-top-color', colors.border)
      .and('have.css', 'border-top-width', '1px')
  })

  it('os rótulos dos cards usam cinza secundário e o valor usa texto escuro', () => {
    cy.contains('span', 'Seu saldo').should('have.css', 'color', colors.textSecondary)
    cy.contains('strong', /R\$\s800,60/).should('have.css', 'color', colors.textPrimary)
  })

  it('o aviso de sucesso do depósito tem texto verde e fundo verde claro', () => {
    cy.contains('button', 'Nova Transação').click()
    cy.get('#transaction-amount').type('50')
    cy.contains('[role="dialog"] button', 'Depositar').click()

    cy.contains('[role="status"]', 'Depósito de')
      .should('have.css', 'color', colors.success)
      .and('have.css', 'background-color', 'rgb(240, 253, 244)')
  })

  it('o botão do modal fica desabilitado e translúcido enquanto processa', () => {
    cy.intercept('POST', '**/transactions', (req) => {
      return new Promise((resolve) => {
        setTimeout(
          () => resolve(req.reply({ statusCode: 201, body: { new_balance: 900 } })),
          2500
        )
      })
    })
    cy.contains('button', 'Nova Transação').click()
    cy.get('#transaction-amount').type('50')
    cy.contains('[role="dialog"] button', 'Depositar').click()

    cy.contains('[role="dialog"] button', 'Processando')
      .should('be.disabled')
      .and('have.css', 'opacity', '0.6')
      .and('have.css', 'cursor', 'not-allowed')
  })

  it('o foco do teclado fica visível', () => {
    cy.contains('button', 'Nova Transação').focus()
    cy.focused().should(($el) => {
      const style = getComputedStyle($el[0])
      const hasRing = style.boxShadow !== 'none' || style.outlineStyle !== 'none'

      expect(hasRing, 'indicador de foco').to.eq(true)
    })
  })
})

describe('Cores nas telas de acesso', () => {
  it('a mensagem de erro do login aparece em vermelho', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Credenciais inválidas' }
    })
    cy.visit('/login')
    cy.get('#email').type('elias@email.com')
    cy.get('#password').type('senha-errada')
    cy.contains('button', 'Entrar').click()

    cy.contains('[role="alert"]', 'Credenciais inválidas')
      .should('have.css', 'color')
      .and('not.eq', colors.textPrimary)
  })

  it('o botão "Entrar" é azul com texto branco', () => {
    cy.visit('/login')

    cy.contains('button', 'Entrar')
      .should('have.css', 'background-color', colors.primary)
      .and('have.css', 'color', colors.white)
  })
})
