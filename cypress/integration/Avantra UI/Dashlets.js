/// <reference types="cypress" />

describe("Dashlets", () => {
    beforeEach(() => {
            const login = "Olha_test";
            const password = "Olha1605";
        cy.visit ("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
        cy.get('#input-login-id').type(login)
        cy.get('#input-password-id').type(password)
        cy.get('.background-primary').contains("Login to Avantra").click()
    })


it("Login UI without checkbox", () => {
    cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text','Dashboards')

        });

    


})