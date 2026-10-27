describe('Dashboard', () => {
  describe('resumo', () => {
    beforeEach(() => {
      cy.visitAsLoggedUser('/')
    })

    it('mostra saldo, receitas, despesas, mercado e últimas transações', () => {
      cy.contains(/R\$\s800,60/).should('be.visible')
      cy.contains('Receitas').should('be.visible')
      cy.contains('Despesas').should('be.visible')
      cy.contains(/US\$\s5,06/).should('be.visible')
      cy.contains('14.9%').should('be.visible')
      cy.contains('14.8%').should('be.visible')
      cy.contains('Últimas transações').should('be.visible')
    })

    it('soma como receita depósitos e transferências recebidas', () => {
      cy.contains('Receitas').parent().parent().should('contain.text', '870,60')
    })

    it('soma como despesa só as transferências enviadas', () => {
      cy.contains('Despesas').parent().parent().should('contain.text', '170,00')
    })

    it('mostra a transferência recebida como entrada e a enviada como saída', () => {
      cy.contains('Transferência de Maria Alves').should('be.visible')
      cy.contains('Transferência para João Souza').should('be.visible')
    })
  })

  describe('esconder o saldo', () => {
    beforeEach(() => {
      cy.visitAsLoggedUser('/')
      cy.contains(/R\$\s800,60/).should('be.visible')
    })

    it('esconde só o saldo e mantém receitas, despesas e extrato visíveis', () => {
      cy.get('button[aria-label="Esconder valores"]').click()

      cy.contains(/800,60/).should('not.exist')
      cy.contains('R$ ••••').should('be.visible')
      cy.contains('Receitas').parent().parent().should('contain.text', '870,60')
      cy.contains('Despesas').parent().parent().should('contain.text', '170,00')
      cy.contains(/\+\s+R\$\s500,00/).should('be.visible')
    })

    it('guarda a escolha depois de recarregar a página', () => {
      cy.get('button[aria-label="Esconder valores"]').click()
      cy.reload()

      cy.contains('R$ ••••').should('be.visible')
      cy.contains(/800,60/).should('not.exist')
    })

    it('mostra o saldo de novo ao clicar outra vez', () => {
      cy.get('button[aria-label="Esconder valores"]').click()
      cy.get('button[aria-label="Mostrar valores"]').click()

      cy.contains(/R\$\s800,60/).should('be.visible')
    })
  })

  describe('layout dos botões', () => {
    beforeEach(() => {
      cy.visitAsLoggedUser('/')
      cy.contains('button', 'Nova Transação').should('be.visible')
    })

    it('"Nova Transação" fica abaixo dos cards de valores, não no topo', () => {
      cy.contains('Seu saldo').then(($card) => {
        const cardBottom = $card.closest('section')[0].getBoundingClientRect().bottom

        cy.contains('button', 'Nova Transação').then(($button) => {
          expect($button[0].getBoundingClientRect().top).to.be.gte(cardBottom)
        })
      })
    })

    it('"Sair da conta" é o último elemento, abaixo do extrato', () => {
      cy.contains('Últimas transações').then(($title) => {
        const titleTop = $title[0].getBoundingClientRect().top

        cy.contains('button', 'Sair da conta').then(($button) => {
          expect($button[0].getBoundingClientRect().top).to.be.gt(titleTop)
        })
      })
    })

    it('os dois botões não ficam lado a lado', () => {
      cy.contains('button', 'Nova Transação').then(($new) => {
        cy.contains('button', 'Sair da conta').then(($out) => {
          const newRect = $new[0].getBoundingClientRect()
          const outRect = $out[0].getBoundingClientRect()

          expect(outRect.top).to.be.gt(newRect.bottom)
        })
      })
    })
  })

  describe('limite do extrato', () => {
    it('mostra só as 5 últimas e leva ao extrato completo pelo "Ver mais"', () => {
      cy.visitAsLoggedUser('/')

      cy.contains('Transferência de Maria Alves').should('be.visible')
      cy.contains('Reembolso').should('not.exist')
      cy.contains('Primeiro depósito').should('not.exist')

      cy.contains('a', 'Ver mais').click()

      cy.location('pathname').should('eq', '/extrato')
      cy.contains('Extrato completo.').should('be.visible')
      cy.contains('Reembolso').should('be.visible')
      cy.contains('Primeiro depósito').should('be.visible')
    })

    it('volta ao resumo pelo link do extrato', () => {
      cy.visitAsLoggedUser('/extrato')

      cy.contains('a', 'Voltar ao resumo').click()

      cy.location('pathname').should('eq', '/')
      cy.contains('Seu resumo financeiro.').should('be.visible')
    })

    it('não mostra "Ver mais" quando há 5 transações ou menos', () => {
      cy.visitAsLoggedUser('/', {
        transactions: [
          {
            id: 1,
            type: 'deposit',
            amount: '10.00',
            description: 'Único',
            counterparty: null,
            created_at: '2026-10-13T15:00:00.000Z'
          }
        ]
      })

      cy.contains('Único').should('be.visible')
      cy.contains('a', 'Ver mais').should('not.exist')
    })

    it('mostra uma mensagem quando não há nenhuma transação', () => {
      cy.visitAsLoggedUser('/', { transactions: [] })

      cy.contains('Nenhuma transação ainda. Faça seu primeiro depósito!').should('be.visible')
    })
  })

  describe('nova transação', () => {
    beforeEach(() => {
      cy.visitAsLoggedUser('/')
      cy.contains(/R\$\s800,60/).should('be.visible')
      cy.contains('button', 'Nova Transação').click()
    })

    it('abre e fecha o modal (botão, Escape e clique fora)', () => {
      cy.get('[role="dialog"]').should('be.visible')
      cy.get('button[aria-label="Fechar"]').click()
      cy.get('[role="dialog"]').should('not.exist')

      cy.contains('button', 'Nova Transação').click()
      cy.get('body').type('{esc}')
      cy.get('[role="dialog"]').should('not.exist')

      cy.contains('button', 'Nova Transação').click()
      cy.get('[role="dialog"]').parent().click('topLeft')
      cy.get('[role="dialog"]').should('not.exist')
    })

    it('faz um depósito e atualiza saldo, extrato e mostra a confirmação', () => {
      cy.get('#transaction-amount').type('200')
      cy.get('#transaction-description').type('Bônus')
      cy.contains('[role="dialog"] button', 'Depositar').click()

      cy.wait('@createTransaction').its('request.body').should('deep.equal', {
        type: 'deposit',
        amount: 200,
        description: 'Bônus'
      })
      cy.get('[role="dialog"]').should('not.exist')
      cy.contains(/R\$\s1\.000,60/).should('be.visible')
      cy.contains('Bônus').should('be.visible')
      cy.contains('[role="status"]', /Depósito de R\$\s200,00 realizado!/).should('be.visible')
    })

    it('faz uma transferência enviando o e-mail do destinatário', () => {
      cy.contains('[role="dialog"] button', 'Transferência').click()
      cy.get('#transaction-amount').type('100')
      cy.get('#transaction-target').type('maria@email.com')
      cy.contains('[role="dialog"] button', 'Transferir').click()

      cy.wait('@createTransaction').its('request.body').should('deep.equal', {
        type: 'transfer',
        amount: 100,
        targetEmail: 'maria@email.com'
      })
      cy.contains(/R\$\s700,60/).should('be.visible')
      cy.contains('[role="status"]', /Transferência de R\$\s100,00 realizada!/).should('be.visible')
    })

    it('exige o e-mail do destinatário numa transferência', () => {
      cy.contains('[role="dialog"] button', 'Transferência').click()
      cy.get('#transaction-amount').type('100')
      cy.contains('[role="dialog"] button', 'Transferir').click()

      cy.contains('[role="alert"]', 'Informe o e-mail da conta de destino.').should('be.visible')
      cy.get('@createTransaction.all').should('have.length', 0)
    })

    it('mostra "saldo insuficiente" do servidor e mantém o modal aberto', () => {
      cy.intercept('POST', '**/transactions', {
        statusCode: 400,
        body: { status: 'error', message: 'Saldo insuficiente' }
      }).as('insufficient')
      cy.contains('[role="dialog"] button', 'Transferência').click()
      cy.get('#transaction-amount').type('99999')
      cy.get('#transaction-target').type('maria@email.com')
      cy.contains('[role="dialog"] button', 'Transferir').click()

      cy.wait('@insufficient')
      cy.contains('[role="alert"]', 'Saldo insuficiente').should('be.visible')
      cy.get('[role="dialog"]').should('be.visible')
      cy.contains(/R\$\s800,60/).should('be.visible')
    })
  })

  describe('quando algo falha', () => {
    it('mostra o dólar mesmo com a Selic e o CDI fora do ar', () => {
      cy.visitAsLoggedUser('/', {
        market: {
          dolar: { value: 5.06, variationPct: 0.1, updatedAt: '2026-10-19 07:58:23' },
          selic: null,
          cdi: null
        }
      })

      cy.contains(/US\$\s5,06/).should('be.visible')
      cy.get('strong').filter(':contains("Indisponível")').should('have.length', 2)
    })

    it('mostra o erro do mercado sem derrubar o resto da página', () => {
      cy.visitAsLoggedUser('/', { market: null })

      cy.contains('Serviço de mercado indisponível').should('be.visible')
      cy.contains(/R\$\s800,60/).should('be.visible')
      cy.contains('Últimas transações').should('be.visible')
    })
  })
})
