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

    cy.visit("https://eiger.dev.gcp.avantra.net:8443/xn/ui");
    cy.get('.saml-sign-in').contains("Google").click({ force: true });
  });

  /* ==== Test Created with Cypress Studio ==== */
  it.only('Tanya Google login', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://eiger.dev.gcp.avantra.net:8443/xn/ui');
    cy.get(':nth-child(3) > .content-block > .saml-sign-in > .saml-sign-in__button').click(); //doesn't work now (24.01.22)
    /* ==== End Cypress Studio ==== */
  });
})