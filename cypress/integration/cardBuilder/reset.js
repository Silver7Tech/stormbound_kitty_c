import s from './selectors'

describe('Card Builder — Reset', () => {
  before(() => {
    cy.visit('/card')
  })

  it('should reset all info', () => {
    cy.get(s.NAME_INPUT)
      .type('Kitty Sparkles')
      .get(s.MOVEMENT_INPUT)
      .type('2')
      .get(s.STRENGTH_INPUT)
      .type('2/4/5/6/8')
      .get(s.MANA_INPUT)
      .type('4')
      .get(s.RARITY_SELECT)
      .select('epic')
      .get(s.RACE_INPUT)
      .type('rodent{enter}', { force: true })
      .get(s.FACTION_SELECT)
      .select('ironclad')
      .get(s.IMAGE_INPUT)
      .type('https://i.imgur.com/nLtdfAg.png', { delay: 0 })
      .get(s.ELDER_CHECKBOX)
      .check()
      .get(s.HERO_CHECKBOX)
      .check()
      .get(s.ANCIENT_CHECKBOX)
      .check()

      .url()
      .should('not.match', /\/card$/)

      .get(s.RESET_BTN)
      .click()
      .get(s.RESET_CONFIRM_BTN)
      .click()

      .get(s.NAME_INPUT)
      .should('be.empty')
      .get(s.MOVEMENT_INPUT)
      .should('be.empty')
      .get(s.STRENGTH_INPUT)
      .should('be.empty')
      .get(s.MANA_INPUT)
      .should('be.empty')
      .get(s.RARITY_SELECT)
      .should('have.value', 'common')
      .get(s.RACE_SELECT)
      .should('have.value', '')
      .get(s.FACTION_SELECT)
      .should('have.value', 'neutral')
      .get(s.IMAGE_INPUT)
      .should('be.empty')
      .get(s.ELDER_CHECKBOX)
      .should('not.be.checked')
      .get(s.HERO_CHECKBOX)
      .should('not.be.checked')
      .get(s.ANCIENT_CHECKBOX)
      .should('not.be.checked')
  })
})
