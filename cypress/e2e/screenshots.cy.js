const screens = [
  { name: 'celular-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 }
]

describe('Capturas de tela para revisão visual', () => {
  screens.forEach(({ name, width, height }) => {
    describe(name, () => {
      beforeEach(() => {
        cy.viewport(width, height)
      })

      it('dashboard', () => {
        cy.visitAsLoggedUser('/')
        cy.contains(/R\$\s800,60/).should('be.visible')
        cy.contains('Transferência de Maria Alves').should('be.visible')
        cy.screenshot(`dashboard-${name}`, { capture: 'fullPage' })
      })

      it('dashboard com saldo escondido', () => {
        cy.visitAsLoggedUser('/')
        cy.get('button[aria-label="Esconder valores"]').click()
        cy.contains('R$ ••••').should('be.visible')
        cy.screenshot(`dashboard-saldo-escondido-${name}`, { capture: 'fullPage' })
      })

      it('modal de nova transação', () => {
        cy.visitAsLoggedUser('/')
        cy.contains('button', 'Nova Transação').click()
        cy.get('[role="dialog"]').should('be.visible')
        cy.screenshot(`modal-${name}`, { capture: 'viewport' })
      })

      it('extrato completo', () => {
        cy.visitAsLoggedUser('/extrato')
        cy.contains('Primeiro depósito').should('be.visible')
        cy.screenshot(`extrato-${name}`, { capture: 'fullPage' })
      })

      it('login', () => {
        cy.visit('/login')
        cy.contains('button', 'Entrar').should('be.visible')
        cy.screenshot(`login-${name}`)
      })
    })
  })
})
