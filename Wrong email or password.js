/// <reference types="Cypress" />


describe("Testing login page", () => {  

    beforeEach(() => {
        cy.visit("https://app.dev.avantra.com/xn/ui/");
        cy.get('.card-aligner')
  })

  it("Login and Password fields validation", () => {
    cy.get('.background-primary').contains("Login to Avantra").click()
    cy.wait(500)
    cy.get('[fieldid="input-login-id"]').invoke('attr', 'tooltip').should('contain', 'Login should not be empty')
    cy.get('#input-login-id').should('have.class', 'ng-invalid')
    cy.get('[fieldid="input-password-id"]').invoke('attr', 'tooltip').should('contain', 'Password should not be empty')
    cy.get('#input-password-id').should('have.class', 'ng-invalid')
    cy.get('#input-login-id').type("testLogin")
    cy.get('body').click(0,0)
    cy.wait(500)
    cy.get('[fieldid="input-login-id"]').should('have.class', 'ng-valid')
    cy.get('#input-password-id').type("testPassword")
    cy.get('body').click(0,0)
    cy.wait(500)
    cy.get('[fieldid="input-password-id"]').should('have.class', 'ng-valid')
    })
    
  it("Try wrong login name", () => {
        cy.get('#input-login-id').type("Tanya");
        cy.get('#input-password-id').type("Tanya")
        cy.get('.content-block__button-sign-in').click();
        cy.get('.mat-simple-snackbar > span').should('have.text', 'The user name or password is not correct!')
    })
    it("Try wrong password", () => {
            cy.get('#input-login-id').type("Tanya admin");
            cy.get('#input-password-id').type("admin")
            cy.get('.content-block__button-sign-in').click();
            cy.get('.mat-simple-snackbar > span').should('have.text', 'Bad credentials')
    })
})