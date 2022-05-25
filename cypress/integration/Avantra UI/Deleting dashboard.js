/// <reference types="cypress" />

describe("Dashlets and dashboards", () => {
    before(function () {
        cy.fixture("Admin_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")

        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
            cy.wait(5000)
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
        })
    })
        //test works!
        it('Deleting cancel and ok', function () {
            cy.get(':nth-child(32) > .sidebar-list-item > .sidebar-list-item__text').trigger('mouseover')
            cy.get(':nth-child(32) > .sidebar-list-item > .mat-tooltip-trigger > .menu-button__icon').click({ force: true })
            cy.get(':nth-child(2) > avantra-button > .icon-button > .background-undefined > svg').click();
            cy.get('.mat-dialog-actions > [backgroundcolor="primary"] > .background-primary > .button__text').click();
            cy.get('.mat-dialog-actions > [backgroundcolor="primary"] > .background-primary > .button__text').contains('No').click({ force: true });
            cy.get(':nth-child(32) > .sidebar-list-item > .sidebar-list-item__text').trigger('mouseover')
            cy.get(':nth-child(32) > .sidebar-list-item > .mat-tooltip-trigger > .menu-button__icon').click({ force: true })
            cy.get(':nth-child(2) > avantra-button > .icon-button > .background-undefined > svg').click();
            cy.get('.background-action > .button__text').contains('Yes').click({ force: true });
            cy.contains('a', 'OLS11').should('not.exist')
        })
    })