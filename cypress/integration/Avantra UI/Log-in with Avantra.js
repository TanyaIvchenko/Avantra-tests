/// <reference types="Cypress" />


describe("Log-in with Avantra", () => {  

    beforeEach(() => {
        cy.visit("https://app.dev.avantra.com/xn/ui/authentication/sign-in");
        //cy.log(Cypress.env("name"));
        //cy.navigateTo_Avantra_Login_page(); //check the baseUrl in config/Avantra.json file and command at support/commands.js file
  })

    it("Login with Avantra account with invalid login and password", () => {
        cy.get('.saml-sign-in').contains("Avantra").click({ force: true });
        cy.get('#username').type("Tanya admin");
        cy.get('#password').type("Admin")
        cy.get('#kc-login').click();
        cy.get('.kc-feedback-text').should('have.text', 'Invalid username or password.')
    })

    it("Trying to login without login and password", () => {
        cy.get('.saml-sign-in').contains("Avantra").invoke("removeAttr", "target").click({ force: true });
        cy.get('#kc-login').click();
        cy.get('.kc-feedback-text').should('have.text', 'Invalid username or password.')
    })

    it("Login with correct username and incorrect password", () => {
        cy.get('.saml-sign-in').contains("Avantra").click({ force: true });
        cy.get('#username').type("Tanya admin");
        cy.get('#password').type("Admin")
        cy.get('#kc-login').click();
        cy.get('.kc-feedback-text').should('have.text', 'Invalid username or password.')
    })
    it("Login with correct username and correct password", () => {
        cy.get('.saml-sign-in').contains("Avantra").click({ force: true });
        cy.get('#username').type("tatyana.ivchenko@avantra.com");
        cy.get('#password').type("IloveIncom1!")
        cy.get('#kc-login').click();
        //failed authorization for now
        //cy.get('.kc-feedback-text').should('have.text', 'Invalid username or password.')
    })
})


//saml-sign-in
//.cy.get(':nth-child(3) > .content-block > .saml-sign-in > .saml-sign-in__button').invoke("removeAttr", "target").click({ force: true });
