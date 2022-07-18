/// <reference types="cypress" />

describe("Creating and saving dashboard", () => {
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

    //test works
    it("Save the dashboard with dashlet added", () => {
        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(600)
        cy.get('.drawer__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
        cy.get('.dashboard-modify__header-input').clear();
        cy.get('.dashboard-modify__header-input').type('OLS_new_test');
        cy.get('.dashboard-modify__add-dashlet').click();
        cy.get(':nth-child(2) > :nth-child(1) > avantra-dashlet-selector-item > .dashlet-selector-item > .dashlet-selector-item__button').click();
        cy.get('.dropdown-group > :nth-child(1) > .mat-tooltip-trigger > .select > #undefined > .ng-select-container > .ng-arrow-wrapper').click();
        cy.wait(3000)
        cy.get('.ng-dropdown-panel-items').within(() => {
            cy.get('.ng-option').contains('BS_REL_8').click()

        })
        cy.wait(3000)
        //get element within another element
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[mattooltip="Save"]')
                .within(() => {
                    cy.get('.icon-button__text')
                        .click({ force: true })
                })
        })
        cy.wait(5000)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]')
                .within(() => {
                    cy.get('.icon-button__text')
                        .click({ force: true })
                })

        })
        cy.wait(3000)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
})