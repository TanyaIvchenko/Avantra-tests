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
        cy.fixture("RTM_check").then((rtmCheckData) => {
            this.rtmCheckData = rtmCheckData
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

it("RTM Check creation", function () {
    //Finding the dashboard in the list
    dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(1000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name         

        cy.stampDashName(this.rtmCheckData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        dashlets.selectDashletCategory(this.dashletsData.categoryChecks)
        cy.wait(3000)
        dashlets.addDashlet(this.rtmCheckData.dashletDefTitle)
        cy.wait(2000)

    dashlets.openSettingDropdownByTitle(this.rtmCheckData.paramSystem)
    cy.wait(200)
    dashlets.selectDropdownItem(this.rtmCheckData.valueSystem)

    dashlets.elements.getDropdownArrow(this.rtmCheckData.paramCheck).click()
    cy.wait(200)
    dashlets.selectDropdownItem(this.rtmCheckData.valueCheck)
    cy.wait(2000)

    dashlets.saveDashlet()
    cy.wait(1000)
    dashboards.saveDashboard()
    cy.wait(800)
    dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
    cy.log(dashboardName)

})

it("RTM Check assertions", function () {
    cy.wait(6000)
    dashboards.elements.getDashboardNameAtNavmenu()
        .contains('a', dashboardName)
        .wait(200).click()

    dashlets.elements.getDashletCardTitle().should('contain', this.rtmCheckData.dashletDefTitle)
    dashlets.elements.getRtmCheckSystem().should('contain', this.rtmCheckData.valueSystem)
    dashlets.elements.getRtmCheckType().should('contain', this.rtmCheckData.valueCheck)
})

it("RTM Check editing", function() {
    cy.wait(6000)
    dashboards.elements.getDashboardNameAtNavmenu()
        .contains('a', dashboardName)
        .wait(200).click()
    cy.wait(5000)
    dashboards.clickEditDashboard()
    cy.wait(2000)
    dashlets.openDashletSettings()
    cy.wait(600)

    dashlets.elements.getTitle().clear().type(this.rtmCheckData.dashletTitleEdited)
    cy.wait(600)


    dashlets.openSettingDropdownByTitle(this.rtmCheckData.paramRefreshInterval)
    cy.wait(200)
    dashlets.selectDropdownItem(this.rtmCheckData.itemRefreshInterval)
    cy.wait(600)


    dashlets.openSettingDropdownByTitle(this.rtmCheckData.paramSystem)
    cy.wait(200)
    dashlets.selectDropdownItem(this.rtmCheckData.valueSystemEdited)

    
    dashlets.elements.getRadioButton(this.rtmCheckData.radioCustomCheck).click()

    dashlets.elements.getDropdownArrow(this.rtmCheckData.paramCheck).click({force:true})
    cy.wait(200)
    dashlets.selectDropdownItem(this.rtmCheckData.customCheck)
    cy.wait(2000)
    
    dashlets.elements.getCheckboxByLabel(this.rtmCheckData.checkboxHideResult).click()
    dashlets.elements.getCheckboxByLabel(this.rtmCheckData.checkboxBgColor).click()
    
    cy.wait(1000)
    dashboards.saveDashboard()
    cy.wait(800)
    dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
})
it("RTM Check edited assertions", function () {
    cy.wait(6000)
    dashboards.elements.getDashboardNameAtNavmenu()
        .contains('a', dashboardName)
        .wait(200).click()

    dashlets.elements.getDashletCardTitle().should('contain', this.rtmCheckData.dashletTitleEdited)
    dashlets.elements.getRtmCheckSystem().should('contain', this.rtmCheckData.valueSystemEdited)
    dashlets.elements.getRtmCheckType().should('contain', this.rtmCheckData.customCheck)
})
})