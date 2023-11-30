describe('Initial home page test', () => {
  it('Visits mahoot site', () => {
    cy.visit('/')
    cy.title().should('eq', 'Mahoot')
  })
})

describe('Test login button', () => {
  it('Visits mahoot site', () => {
    cy.visit('/')
    cy.contains('Inloggen').click()
    cy.url().should('include', '/inloggen')
  })
})

describe('Test register button', () => {
  it('Visits mahoot site', () => {
    cy.visit('/')
    cy.contains('Registreren').click()
    cy.url().should('include', '/registreren')
  })
})