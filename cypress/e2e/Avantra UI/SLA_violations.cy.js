/// <reference types="cypress" />
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();

describe("SLA Violations: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
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
        cy.fixture("Sla_violations").then((slaViolData) => {
            this.slaViolData = slaViolData
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

    it("SLA Violations creation", function () {
        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(1000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name         

        cy.stampDashName(this.slaViolData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        dashlets.selectDashletCategory(this.dashletsData.categoryCompliance)
        cy.wait(3000)
        dashlets.addDashlet(this.slaViolData.dashletDefTitle)
        cy.wait(2000)

        dashlets.openSystemPredefinedDropdown()
        dashlets.selectDropdownItem(this.slaViolData.valuePredefined)
        
        cy.wait(1000)
        dashlets.saveDashlet()
        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(1000)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)

    })
    it("SLA Violations assertions", function () {
        cy.wait(2000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(2000)
         dashlets.elements.getDashletCardTitle().should('contain', this.slaViolData.dashletDefTitle)
         dashlets.elements.getDashletHeadline().should('contain', this.slaViolData.valuePredefined)
        
        let today = new Date();
        let currentMonth = today.toLocaleString('default', { month: 'long' })
        dashlets.elements.getSlaMonth().first().should('contain.text', currentMonth)

        today.setMonth(today.getMonth()-1);
        const previousMonth = today.toLocaleString('default', { month: 'long' });

        dashlets.elements.getSlaMonth().last().should('contain.text', previousMonth)
    })
    it("SLA Violations editing", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(5000)
        dashboards.clickEditDashboard()
        cy.wait(2000)
        dashlets.openDashletSettings()
        cy.wait(600)

        dashlets.elements.getTitle().clear().type(this.slaViolData.dashletTitleEdited)
        cy.wait(600)

        dashlets.openSettingDropdownByTitle(this.slaViolData.paramRefreshInterval)
        cy.wait(200)
        dashlets.selectDropdownItem(this.slaViolData.itemRefreshInterval)
        cy.wait(600)
        dashlets.openSystemPredefinedDropdown()
        dashlets.selectDropdownItem(this.slaViolData.valuePredefinedEdited)

        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
    })
    it("SLA Violations edited assertions", function () {
        cy.wait(2000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(2000)
         dashlets.elements.getDashletCardTitle().should('contain', this.slaViolData.dashletTitleEdited)
         dashlets.elements.getDashletHeadline().should('contain', this.slaViolData.valuePredefinedEdited)
        
        let today = new Date();
        let currentMonth = today.toLocaleString('default', { month: 'long' })
        dashlets.elements.getSlaMonth().first().should('contain.text', currentMonth)

        today.setMonth(today.getMonth()-1);
        const previousMonth = today.toLocaleString('default', { month: 'long' });

        dashlets.elements.getSlaMonth().last().should('contain.text', previousMonth)

    })
})