const DIVIDER_COLOR = 'rgb(226, 232, 240)'

const viewports = {
  'celular pequeno (320)': [320, 700],
  'celular (375)': [375, 812],
  'tablet (768)': [768, 1024],
  'notebook (1024)': [1024, 768],
  'desktop (1280)': [1280, 800],
  'tela grande (1920)': [1920, 1080]
}

const indicator = (name) => cy.contains('span', name).parent()

describe('Responsividade', () => {
  describe('sem rolagem horizontal', () => {
    Object.entries(viewports).forEach(([label, [width, height]]) => {
      it(`dashboard em ${label}`, () => {
        cy.viewport(width, height)
        cy.visitAsLoggedUser('/')
        cy.contains(/R\$\s800,60/).should('be.visible')

        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth, 'largura do conteúdo').to.be.lte(
            doc.documentElement.clientWidth
          )
        })
      })

      it(`extrato completo em ${label}`, () => {
        cy.viewport(width, height)
        cy.visitAsLoggedUser('/extrato')
        cy.contains('Extrato completo.').should('be.visible')

        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.lte(doc.documentElement.clientWidth)
        })
      })

      it(`login em ${label}`, () => {
        cy.viewport(width, height)
        cy.visit('/login')
        cy.contains('button', 'Entrar').should('be.visible')

        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.lte(doc.documentElement.clientWidth)
        })
      })
    })
  })

  describe('botão "Nova Transação"', () => {
    const buttonPadding = (width, expected) => {
      cy.viewport(width, 800)
      cy.visitAsLoggedUser('/')
      cy.contains('button', 'Nova Transação')
        .should('have.css', 'padding-left', expected)
        .and('have.css', 'padding-right', expected)
    }

    it('tem 24px de espaço lateral em celulares (320)', () => buttonPadding(320, '24px'))
    it('tem 24px de espaço lateral em celulares (375)', () => buttonPadding(375, '24px'))
    it('tem 24px de espaço lateral exatamente em 768px', () => buttonPadding(768, '24px'))
    it('volta para 16px logo acima de 768px', () => buttonPadding(769, '16px'))
    it('tem 16px de espaço lateral no desktop', () => buttonPadding(1280, '16px'))

    it('o texto nunca encosta nas bordas do botão em celulares', () => {
      cy.viewport(320, 700)
      cy.visitAsLoggedUser('/')

      cy.contains('button', 'Nova Transação').then(($button) => {
        const range = document.createRange()
        range.selectNodeContents($button[0])
        const text = range.getBoundingClientRect()
        const box = $button[0].getBoundingClientRect()

        expect(text.left - box.left, 'espaço à esquerda').to.be.gte(20)
        expect(box.right - text.right, 'espaço à direita').to.be.gte(20)
      })
    })
  })

  describe('divisões entre Dólar, Selic e CDI', () => {
    it('desktop: linhas verticais finas e cinzas entre os cards', () => {
      cy.viewport(1280, 800)
      cy.visitAsLoggedUser('/')

      ;['Dólar', 'Selic'].forEach((name) => {
        indicator(name)
          .should('have.css', 'border-right-width', '1px')
          .and('have.css', 'border-right-color', DIVIDER_COLOR)
          .and('have.css', 'border-bottom-width', '0px')
      })

      indicator('CDI').should('have.css', 'border-right-width', '0px')
        .and('have.css', 'border-bottom-width', '0px')
    })

    it('celular: linhas horizontais iguais, finas e na mesma cor cinza', () => {
      cy.viewport(375, 812)
      cy.visitAsLoggedUser('/')

      ;['Dólar', 'Selic'].forEach((name) => {
        indicator(name)
          .should('have.css', 'border-bottom-width', '1px')
          .and('have.css', 'border-bottom-color', DIVIDER_COLOR)
          .and('have.css', 'border-bottom-style', 'solid')
          .and('have.css', 'border-right-width', '0px')
      })

      indicator('CDI').should('have.css', 'border-bottom-width', '0px')
    })

    it('celular: nenhuma borda preta aparece entre os cards', () => {
      cy.viewport(375, 812)
      cy.visitAsLoggedUser('/')

      ;['Dólar', 'Selic', 'CDI'].forEach((name) => {
        indicator(name).then(($el) => {
          const style = getComputedStyle($el[0])

          ;['top', 'right', 'bottom', 'left'].forEach((side) => {
            if (style.getPropertyValue(`border-${side}-width`) !== '0px') {
              expect(style.getPropertyValue(`border-${side}-color`)).to.eq(DIVIDER_COLOR)
            }
          })
        })
      })
    })

    it('celular: todos os cards têm o mesmo alinhamento lateral', () => {
      cy.viewport(375, 812)
      cy.visitAsLoggedUser('/')

      const lefts = []

      ;['Dólar', 'Selic', 'CDI'].forEach((name) => {
        indicator(name).then(($el) => lefts.push($el[0].getBoundingClientRect().left))
      })

      cy.then(() => {
        expect(new Set(lefts).size, 'posições à esquerda diferentes').to.eq(1)
      })
    })

    it('celular: os três cards ficam empilhados, um embaixo do outro', () => {
      cy.viewport(375, 812)
      cy.visitAsLoggedUser('/')

      const tops = []

      ;['Dólar', 'Selic', 'CDI'].forEach((name) => {
        indicator(name).then(($el) => tops.push($el[0].getBoundingClientRect().top))
      })

      cy.then(() => {
        expect(tops[1]).to.be.gt(tops[0])
        expect(tops[2]).to.be.gt(tops[1])
      })
    })

    it('desktop: os três cards ficam lado a lado', () => {
      cy.viewport(1280, 800)
      cy.visitAsLoggedUser('/')

      const tops = []

      ;['Dólar', 'Selic', 'CDI'].forEach((name) => {
        indicator(name).then(($el) => tops.push(Math.round($el[0].getBoundingClientRect().top)))
      })

      cy.then(() => {
        expect(new Set(tops).size, 'alturas diferentes').to.eq(1)
      })
    })
  })

  describe('grade de cards (saldo, receitas, despesas)', () => {
    const columns = () =>
      cy.contains('Seu saldo').closest('section').then(($grid) =>
        getComputedStyle($grid[0]).gridTemplateColumns.split(' ').length
      )

    it('desktop: 3 colunas', () => {
      cy.viewport(1280, 800)
      cy.visitAsLoggedUser('/')

      columns().should('eq', 3)
    })

    it('tablet (768): 1 coluna', () => {
      cy.viewport(768, 1024)
      cy.visitAsLoggedUser('/')

      columns().should('eq', 1)
    })

    it('celular: 1 coluna', () => {
      cy.viewport(375, 812)
      cy.visitAsLoggedUser('/')

      columns().should('eq', 1)
    })
  })

  describe('alinhamento dos cards de valores', () => {
    const topsOf = (names, pick) => {
      const tops = []

      names.forEach((name) => {
        cy.contains('span', name).then(($label) => {
          tops.push(Math.round(pick($label).getBoundingClientRect().top))
        })
      })

      return cy.then(() => tops)
    }

    const names = ['Seu saldo', 'Receitas', 'Despesas']

    it('desktop: os rótulos ficam na mesma altura nos três cards', () => {
      cy.viewport(1280, 800)
      cy.visitAsLoggedUser('/')
      cy.contains(/R\$\s800,60/).should('be.visible')

      topsOf(names, ($label) => $label[0]).then((tops) => {
        expect(new Set(tops).size, `alturas dos rótulos: ${tops}`).to.eq(1)
      })
    })

    it('desktop: os valores ficam na mesma altura nos três cards', () => {
      cy.viewport(1280, 800)
      cy.visitAsLoggedUser('/')
      cy.contains(/R\$\s800,60/).should('be.visible')

      topsOf(names, ($label) => $label.parent().parent().find('strong')[0]).then((tops) => {
        expect(new Set(tops).size, `alturas dos valores: ${tops}`).to.eq(1)
      })
    })

    it('desktop: os três cards têm a mesma altura', () => {
      cy.viewport(1280, 800)
      cy.visitAsLoggedUser('/')
      cy.contains(/R\$\s800,60/).should('be.visible')

      const heights = []

      names.forEach((name) => {
        cy.contains('span', name).then(($label) => {
          heights.push(Math.round($label.parent().parent()[0].getBoundingClientRect().height))
        })
      })

      cy.then(() => {
        expect(new Set(heights).size, `alturas dos cards: ${heights}`).to.eq(1)
      })
    })
  })

  describe('modal em tela pequena', () => {
    it('cabe na tela e todos os campos continuam alcançáveis', () => {
      cy.viewport(320, 568)
      cy.visitAsLoggedUser('/')
      cy.contains('button', 'Nova Transação').click()

      cy.get('[role="dialog"]').then(($dialog) => {
        const rect = $dialog[0].getBoundingClientRect()

        expect(rect.left).to.be.gte(0)
        expect(rect.right).to.be.lte(320)
      })

      cy.get('#transaction-amount').scrollIntoView().should('be.visible')
      cy.contains('[role="dialog"] button', 'Depositar').scrollIntoView().should('be.visible')
    })
  })
})
