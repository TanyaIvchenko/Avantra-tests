/// <reference types="cypress" />

describe("Login valid creds", () => {
    beforeEach(() => {
        cy.visit ("https://app.dev.avantra.com/xn/ui/")
    })
const login = "Olha_test";
const password = "Olha1605";

    it.only("Login UI without checkbox", () => {
cy.get('#input-login-id').type(login)
cy.get('#input-password-id').type(password)
cy.get('#input-password-id').invoke('attr', 'type').should('contain', 'password')
cy.get('.input-field__password-visibility-switch').click()
cy.get('#input-password-id > .mat-tooltip-trigger > #undefined').invoke('attr', 'type').should('contain', 'text')//вот здесь работает?
cy.get('.background-primary').contains("Login to Avantra").click()
    });
    it("Forgot password", ()=> {
        cy.get('.content-block__button-forgot-password').click()
        cy.get('.section__title').contains("Restore Password")
        cy.get('.button-back').click()
        cy.get('.content-block__button-forgot-password').click()
        cy.get('#input-restore-login-id').invoke('attr', 'placeholder').should('contain', 'Username or Email')
        cy.get('#input-restore-login-id').type(login)
        cy.get('.background-primary').contains("Send").click()
        cy.get('.section__title').contains("sent")
        cy.get('.section__subtitle').contains("Please check your Email and follow the instructions")
        cy.get('.button-back').click()
    });
});