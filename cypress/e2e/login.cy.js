describe('Test login page', () => {
    it('Geen account button test', () => {
      cy.visit('/inloggen')
      cy.contains('Klik hier').click()
      cy.url().should('include', '/registreren')
    })
  })

describe('Test login page', () => {
    it('Inloggen zonder gebruiksnaam', () => {
        cy.visit('/inloggen')
        cy.get('form').contains('Inloggen').click()
        cy.get('span').should('have.text', 'Gebruiksnaam is verplicht!')
    })
})

describe('Test login page', () => {
    it('Inloggen zonder wachtwoord', () => {
        cy.visit('/inloggen')
        cy.get('#gebruiksnaam').type('test')
        cy.get('form').contains('Inloggen').click()
        cy.get('span').should('have.text', 'Wachtwoord is verplicht!')
    })
})

// Backend server is lokaal getest hier. In de CI/CD pipeline hebben we geen lokale api.
// describe('Test login page', () => {
//     it('Inloggen met verkeerde gegevens', () => {
//         cy.visit('http://localhost:5000/inloggen')
//         cy.get('#gebruiksnaam').type('test2')
//         cy.get('#wachtwoord').type('test2')
//         cy.get('form').contains('Inloggen').click()
//         cy.get('span').should('have.text', 'Gebruiksnaam en/of wachtwoord is verkeerd!')
//     })
// })

// describe('Test login page', () => {
//     it('Inloggen met juiste gegevens', () => {
//         cy.visit('http://localhost:5000/inloggen')
//         cy.get('#gebruiksnaam').type('test')
//         cy.get('#wachtwoord').type('test')
//         cy.get('form').contains('Inloggen').click()
//         cy.url().should('include', '/dashboard')
//     })
// })