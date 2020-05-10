import s from './selectors'

describe('Fan-kit', () => {
  before(() => cy.visit('/fan-kit'))

  it('should display images', () => {
    cy.get(s.ITEMS).should('exist')
  })

  it('should be possible to download an image in PNG', () => {
    cy.get(s.ITEMS)
      .first()
      .find(s.DOWNLOAD_BTN)
      .click()
      .get(s.DIALOG)
      .should('be.visible')
      .find(s.DOWNLOAD_LINK)
      .filter('[href$="png"]')
      .then(anchor => {
        const url = anchor.attr('href')
        cy.request(url).then(response => {
          expect(response.status).to.equal(200)
          expect(response.headers['content-type']).to.equal('image/png')
        })
      })
  })

  it('should be possible to close that dialog and navigate away', () => {
    cy.get(s.DIALOG_CLOSE_BTN)
      .click()
      .get(s.DIALOG)
      .should('not.be.visible')
      .get('.Header__link')
      .first()
      .click()
  })
})
