/// <reference types="cypress" />
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();

describe("SAP HotNews: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    beforeEach(function () {
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.fixture("Credentials")
            .then((creds) => {
                this.creds = creds
                cy.loginSession(this.creds.login, this.creds.env, this.creds.password)
                cy.visit(creds.env)

            })
        cy.fixture("Dashboards").then((dashboardsData) => {
            this.dashboardsData = dashboardsData
        })
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })
        cy.fixture("HotNews").then((hotNewsData) => {
            this.hotNewsData = hotNewsData
        })

    })
    let dashboardName;

    after(function () {
        // delete dashboard
        cy.wait(5000)

        cy.contains(dashboardName).realHover()
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains(dashboardName)
            .siblings('.navigation-list-item__menu-button')
            .invoke('show')
            .click({ force: true })

        cy.wait(1000)
        dashboards.elements.getQuickActionsMenu().within(() => {
            dashboards.clickQuickDeleteDashboard()
        })
        dashboards.submitModalDashboardDelete()
        cy.wait(800)
        dashboards.elements.getHeaderMessage().should("have.text", this.dashboardsData.successfulDeletion)

    })

it("RTM Check creation", () => {
    //Finding the dashboard in the list
    cy.get('.sidebar-list-item').contains('a', "OLS_name_check")
        .click()
        cy.wait(5000)
    cy.get('.header__edit-block')
        .get('[mattooltip="Edit Dashboard"]')
            .wait(2000)
            .click() 
            cy.wait(5000)

cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
cy.get('.dashlet-selector-item__title').contains('RTM Check').parent()
.within (() =>{
    cy.get('.dashlet-selector-item__button').wait(2000).click()
})
cy.get('[placeholder="RTM Check"]').type("RTM _check_ols")
cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
cy.wait(600)
cy.get('.dashlet-settings__param--title').contains('System').siblings('.dashlet-settings__param--content').click()
    cy.get('.dashlet-settings__param--title').contains('System').parent('.dashlet-settings__param').within(() =>{
        cy.get('ng-dropdown-panel').contains('ggbvrd-sybsa1_SA1_00').click()
    })
cy.wait(600)
cy.get('.dashlet-add__stepper').within(() => {
    cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
})
cy.wait(5000)
cy.get('.sub-header').within(() => {
    cy.get('[mattooltip="Save"]').click()
})
cy.wait(300)
cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
it("RTM Check editing", () => {
cy.wait(600)
cy.get('.sidebar-list-item').contains('a', "RTM_Check_test")
.wait(2000).click()
cy.get('.header__edit-block')
    .get('[mattooltip="Edit Dashboard"]')
        .wait(5000)
        .click() 
    cy.wait(2000)
cy.get('.avantra-drawer__content').within (() =>{
        cy.get('.avantra-dashlet__header')
    .within (() =>{
    cy.get('[mattooltip="Dashlet Settings"]')
    .click()
    })
})
   
    cy.get('[placeholder="RTM Check"]').clear().type("RTM_Check_ols_edited")
    cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited")
    cy.wait(600)
    cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
    cy.get('[role="listbox"]'). within(() => {
        cy.get('.ng-star-inserted').contains('1 minute').click()
    })
    cy.wait(600)
    cy.get('.dashlet-settings__param--title').contains('System').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('System').parent('.dashlet-settings__param').within(() =>{
            cy.get('ng-dropdown-panel').contains('golf').click()
        })
    
    cy.get('.radio-button__label').contains('Custom Check').siblings('.radio-button__checkmark').click()
    
    cy.get('.ng-placeholder').contains('Select Check').parents('.ng-select-container').click()
    cy.get('.ng-placeholder').contains('Select Check').parents('.ng-select').children('.ng-dropdown-panel').within(() =>{
        cy.get('.ng-star-inserted').contains('VS_MEMORY').click()
    })
    cy.get('.custom-checkbox__label').contains('Hide check result').siblings('.custom-checkbox__checkmark').click()
    cy.get('.custom-checkbox__label').contains('Show background color in status color').siblings('.custom-checkbox__checkmark').click()
    cy.get('.sub-header').within(() => {
        cy.get('[mattooltip="Save"]').click()
    })
    cy.wait(300)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
})