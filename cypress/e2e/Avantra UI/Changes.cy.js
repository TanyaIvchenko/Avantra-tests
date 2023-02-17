/// <reference types="cypress" />

import Changes from "../../pageObjects/Changes.js";
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();
const changes = new Changes();
let dashName

describe("Changes: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    // before(function () {
    //     cy.fixture("Credentials").as("creds")
    // })
    beforeEach(function () {
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.fixture("Credentials")
            .then((creds) => {
                this.creds = creds
                let envServer = this.creds.env;
                let localUser = this.creds.login;
                let passwd = this.creds.password;
                cy.loginSession(localUser, envServer, passwd)
                cy.visit(creds.env)
            })
        cy.fixture("Dashboards").then((dashboardsData) => {
            this.dashboardsData = dashboardsData
        })
        cy.fixture("Changes").then((changesData) => {
            this.changesData = changesData
        })
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })

    })
    let dashboardName;
    let table = []

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

    it("Changes creation", function () {

        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(5000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name              

        cy.stampDashName(this.changesData.dashboardName).then(($el) => {
            dashName = $el.toString().trim()
            cy.log(dashName)
            dashboards.elements.getDashboardHeader().type(dashName)
        })

        dashboards.clickAddDashletButton()
        dashlets.selectDashletCategory(this.dashletsData.categoryChanges)
        cy.wait(1000)
        dashlets.addDashlet(this.changesData.dashletDefTitle)
        cy.wait(2000)

        //dashlets.elements.getSubtitle().type(this.checklistData.subtitle) (no subtitle in this dashlet)
        dashlets.openSystemPredefinedDropdown()
        dashlets.selectDropdownItem(this.changesData.valuePredefined)
        //dashlets.elements.getCheckSelectorItem().contains(this.checklistData.checkSelector).click()
        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(800)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashName)
            .then(() => {
                dashboardName = dashName;
            })
    })
    it("Changes assertions", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(5000)
        dashlets.elements.getDashletCardTitle().should('contain.text', this.changesData.dashletDefTitle)
        dashlets.elements.getDashletHeadline().should('contain.text', 'Changes')
        dashlets.elements.getDashletHeadline().should('contain.text', this.changesData.valuePredefined)

        
        // .changes__months-name -> class for changes dashlet
        dashlets.elements.getChangesMonth().first().should('contain.text', this.changesData.currentMonth)
        dashlets.elements.getChangesMonth().last().should('contain.text', this.changesData.previousMonth)
    })

})