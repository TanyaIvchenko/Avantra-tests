/// <reference types="cypress" />

import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();


describe("Charts: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {

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
        cy.fixture("Charts").then((chartsData) => {
            this.chartsData = chartsData
        })
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
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

    it("Charts creation", function () {

        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(5000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name              

        cy.stampDashName(this.chartsData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        dashlets.selectDashletCategory(this.dashletsData.categoryPerformance)
        cy.wait(1000)
        dashlets.addDashlet(this.chartsData.dashletDefTitle)
        cy.wait(2000)

        dashlets.elements.getRadioButtonMark(this.chartsData.labelRadioSystem)
            .as('radio')
            .invoke('is', ':checked')
            .then(checked => {
                if (checked) {
                    dashlets.elements.getDropdownArrow(this.chartsData.paramSelectSystem).click()
                } else {
                    cy.get('@radio')
                        .check()
                    dashlets.elements.getDropdownArrow(this.chartsData.paramSelectSystem).click()
                }
            })
        dashlets.selectDropdownItem(this.chartsData.valueSystem)
        dashlets.openSettingDropdownByTitle(this.chartsData.paramChartName)
        dashlets.selectDropdownItem(this.chartsData.valueChartName)
        dashlets.elements.getSettingInput(this.chartsData.paramDays).clear().type(this.chartsData.valueDays)

        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(800)
        dashboards.saveDashboard()
        cy.wait(8000)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
    })
    it("Charts assertions created", function () {

        cy.wait(800)
        dashboards.elements.getDashboardNameAtNavmenu().contains('a', dashboardName)
            .wait(2000).click()
        let labelXAxis = []
        let labelYAxis = []
        dashlets.elements.getDashletCardTitle().should('have.text', this.chartsData.valueChartName)
        dashlets.elements.getChartLabels().each(($el) => {
            cy.get($el).invoke('text').then((txt) => {
                txt = txt.trim()
                labelXAxis.push(txt)

            })
        }).then(() => {
            cy.log("X: " + labelXAxis.toString())
            })
        dashlets.elements.getChartLabelsY().each(($el) => {
            cy.get($el).invoke('text').then((txt) => {
                txt = txt.trim()
                labelYAxis.push(txt)
                cy.log(labelYAxis)
            })
        }).then(() => {
            cy.log("Y: " + labelYAxis.toString())
            JSON.stringify(labelYAxis) === JSON.stringify(this.chartsData.valuesYaxis)
            })
    })

})