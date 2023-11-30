describe('Test register page', () => {
    it('Al een account button test', () => {
      cy.visit('http://localhost:5000/registreren')
      cy.contains('Klik hier').click()
      cy.url().should('include', '/inloggen')
    })
  })

describe('Test register page', () => {
    it('Registreer zonder waardes', () => {
        cy.visit('http://localhost:5000/registreren')
        cy.contains('Registreer').click()
        cy.get('span').should('have.text', 'Gebruiksnaam is verplicht!')
    })
})

describe('Test register page', () => {
    it('Registreer zonder email', () => {
        cy.visit('http://localhost:5000/registreren')
        cy.get('#gebruiksnaam').type('test')
        cy.contains('Registreer').click()
        cy.get('span').should('have.text', 'Email is verplicht!')
    })
})

describe('Test register page', () => {
    it('Registreer zonder wachtwoord', () => {
        cy.visit('http://localhost:5000/registreren')
        cy.get('#gebruiksnaam').type('test')
        cy.get('#email').type('test@test.com')
        cy.contains('Registreer').click()
        cy.get('span').should('have.text', 'Wachtwoord is verplicht!')
    })
})

describe('Test register page', () => {
    it('Registreer met verschillende wachtwoorden', () => {
        cy.visit('http://localhost:5000/registreren')
        cy.get('#gebruiksnaam').type('test')
        cy.get('#email').type('test@test.com')
        cy.get('#wachtwoord').type('test')
        cy.get('#herhaal-wachtwoord').type('test1')
        cy.contains('Registreer').click()
        cy.get('span').should('have.text', 'Wachtwoord is niet hetzelfde!')
    })
})

// Backend server is lokaal getest hier. In de CI/CD pipeline hebben we geen lokale api.
// describe('Test register page', () => {
//     it('Registreer met juiste gegevens', () => {
//         cy.visit('http://localhost:5000/registreren')
//         cy.get('#gebruiksnaam').type('test')
//         cy.get('#email').type('test@test.com')
//         cy.get('#wachtwoord').type('test')
//         cy.get('#herhaal-wachtwoord').type('test')
//         cy.contains('Registreer').click()
//         cy.url().should('include', '/inloggen')
//     })
// })