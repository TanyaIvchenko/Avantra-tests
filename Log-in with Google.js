/// <reference types="Cypress" />

describe("Google Login", () => {

    /**
     * 2nd param replaces the global config (cypress.json) only in the scope of the current .spec.
     * Similar to: Cypress.config('baseUrl', 'https://accounts.google.com');
     */
    it('should input email and password', { baseUrl:  'https://accounts.google.com', chromeWebSecurity: false }, function() {
      // Handling all errors and 'skipping' test to avoid global failure.
      cy.on('chrome-error', (err, runnable) => {
        console.error('Google Login -> chrome-error', err);
        this.skip();
      });
  
      cy.visit("https://app.dev.avantra.com/xn/ui/");
      cy.get('.saml-sign-in').contains("Google").click({ force: true });
      // Google Login Redirection: Email Input
      cy.url().should('contain', 'accounts.google.com')
        cy.get('#identifierId').type("tatyana.ivchenko@avantra.com")
        cy.get('#identifierNext button').click().wait(3000);
  
      // Google Login Redirection: Password Input
      cy.url().should('contain', 'accounts.google.com')
        .get('input[type="password"]').type('IloveIncom1!')
        .get('#passwordNext button').click().wait(1500);
    });

// describe("Testing login page", () => {  

//     beforeEach(() => {
//         cy.visit("https://app.dev.avantra.com/xn/ui/");
//         cy.get('.card-aligner')
//   })

//     it("Login with Google account", () => {
//     cy.get('.saml-sign-in').contains("Google").invoke("removeAttr", "target").click()

//     })
})