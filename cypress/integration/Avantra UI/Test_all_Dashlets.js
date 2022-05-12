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
            cy.get('[fxlayoutalign="row"] > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
            cy.get('avantra-dashboards-details-edit.ng-star-inserted > .mat-tooltip-trigger').click();
        })
    })

    it.only("Business Service Node", () => {
        cy.get(':nth-child(2) > :nth-child(1) > avantra-dashlet-selector-item > .dashlet-selector-item > .dashlet-selector-item__button').click();
        cy.get('.dropdown-group > :nth-child(1) > .mat-tooltip-trigger > .select > #undefined > .ng-select-container > .ng-arrow-wrapper').click();
        cy.get('.ng-dropdown-panel-items').within(() => {
            cy.get('.ng-option').contains('BS_REL_8').click()
        //cy.get('.header__edit-block > .mat-tooltip-trigger.ng-star-inserted > .icon-button > .background-primary').click()
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').within(() => {
            cy.get('[type="button"]').click()
        })
    })

    it("Logbook Activities", () => {
        cy.get('.dashlet-selector-item__title').contains('Logbook Activities').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').click()
        })
        cy.get('[placeholder="Logbook Activities"]').type("Tanya test")
        cy.get('[formcontrolname="subtitle"]').children('input').type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.get('#input-dashboard-name-id').type("Logbook_act_dash_test")
        cy.wait(300)
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        cy.wait(300)
    })

})
