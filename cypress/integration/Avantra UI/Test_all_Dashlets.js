/// <reference types="cypress" />

describe("Test All dashlets", () => {
    before(function () {
        cy.fixture("Admin_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")
    })
    beforeEach(() => {

        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
            cy.get(':nth-child(9) > .sidebar-list-item > .sidebar-list-item__text').click();
            cy.get('.header__edit-block > .mat-tooltip-trigger > .icon-button > .background-undefined > svg').click();
            cy.get('.dashboard-modify__add-dashlet').click();
        })
    })

    it("Business Service Node", () => {
        cy.get(':nth-child(2) > app-gridster.ng-star-inserted > .gridster-component > .scrollHorizontal > [style="z-index: 1; display: block; transform: translate3d(0px, 0px, 0px); width: 325px; height: 217.5px;"] > .gridster-item__content > app-dashlet-selector-item.ng-star-inserted > .dashlet-selector-item > .dashlet-selector-item__button').click();
        cy.get(':nth-child(1) > app-select.ng-untouched > .select > #undefined > .ng-select-container > .ng-arrow-wrapper').click();
        cy.get(':nth-child(1) > app-select.ng-untouched > .select > #undefined > .ng-select-container > .ng-value-container > .ng-input').click();
        cy.get(':nth-child(1) > .ng-untouched > .select > #undefined > .ng-select-container > .ng-value-container > .ng-input').click()
        cy.get('#a43d7e29b9ab-6').click().should('have.value', 'BS_REL_8')

    })
})