/// <reference types="cypress" />
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();

describe("Logbook activities: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
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
        cy.fixture("Logbook").then((logbookData) => {
            this.logbookData = logbookData
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
    it("Logbook Activities creation", function ()  {
        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(1000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name         

        cy.stampDashName(this.logbookData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        cy.wait(1000)
        dashlets.selectDashletCategory(this.dashletsData.categoryAdmin)
        cy.wait(200)
        dashlets.addDashlet(this.logbookData.dashletDefTitle)
        cy.wait(200)
        dashlets.elements.getTitle().clear().type(this.logbookData.title)

        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)
    })
    it("Logbook Activities assertions", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(5000)
        dashlets.elements.getDashletCardTitle().should('contain.text', this.logbookData.dashletDefTitle)
        dashlets.elements.getDashletHeadline().should('contain.text', this.logbookData.headlineToday)
        dashlets.elements.getLogbookDate().first().should('contain.text', this.logbookData.dateYesterday)
        dashlets.elements.getLogbookDate().last().should('contain.text', this.logbookData.dateWeekly)
    })
    it("Logbook Activities editing", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(5000)
        dashboards.clickEditDashboard()
        cy.wait(2000)
        dashlets.openDashletSettings()
        cy.wait(600)
        
        dashlets.elements.getTitle().clear().type(this.logbookData.titleEdited)
        cy.wait(600)
        dashlets.openSettingDropdownByTitle(this.logbookData.paramRefreshInterval)
        
        dashlets.selectDropdownItem(this.logbookData.itemRefreshInterval)
        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
    })
})