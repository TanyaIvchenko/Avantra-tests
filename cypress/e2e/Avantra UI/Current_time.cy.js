/// <reference types="cypress" />
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();

describe("Current Time: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
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
        cy.fixture("CurrentTime").then((currentTimeData) => {
            this.currentTimeData = currentTimeData
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

    it("Current Time creation", function () {
        cy.wait(2000)
        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(1000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name         

        cy.stampDashName(this.currentTimeData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        dashlets.selectDashletCategory(this.dashletsData.categoryGeneral)
        cy.wait(3000)
        dashlets.addDashlet(this.currentTimeData.dashletDefTitle)
        cy.wait(2000)

        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone1)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone1)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone2)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone2)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone3)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone3)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone4)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone4)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone5)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone5)

        cy.wait(1000)
        dashlets.saveDashlet()
        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(1000)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)

    })
    it("Current time assertions", function () {
        cy.wait(2000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(2000)
        dashlets.elements.getDashletCardTitle().should('contain', this.currentTimeData.dashletDefTitle)
        function z(tm) {
            return ('0' + tm).slice(-2)
        }

        let date = new Date()
        let utcTime = z(date.getUTCHours()) + ':' + z(date.getUTCMinutes())

        let zone1 = z(date.getUTCHours() + 2) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone1)
            .invoke('text').then((time) => {
                let timeZone1 = time.trim()
                if (zone1 === timeZone1) {
                    cy.log("TimeZone1: VERIFIED!")
                }

            })
        let zone2 = z(date.getUTCHours() + 1) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone2)
            .invoke('text').then((time) => {
                let timeZone2 = time.trim()
                if (zone2 === timeZone2) {
                    cy.log("TimeZone2: VERIFIED!")
                }

            })
        let zone3 = z(date.getUTCHours()) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone3)
            .invoke('text').then((time) => {
                let timeZone3 = time.trim()
                if (zone3 === timeZone3) {
                    cy.log("TimeZone3: VERIFIED!")
                }

            })
        let zone4 = z(date.getUTCHours() - 4) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone4)
            .invoke('text').then((time) => {
                let timeZone4 = time.trim()
                if (zone4 === timeZone4) {
                    cy.log("TimeZone4: VERIFIED!")
                }

            })
        let zone5 = z(date.getUTCHours() + 8) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone5)
            .invoke('text').then((time) => {
                let timeZone5 = time.trim()
                if (zone5 === timeZone5) {
                    cy.log("TimeZone5: VERIFIED!")
                }

            })
    })
    it("Current Time editing", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(5000)
        dashboards.clickEditDashboard()
        cy.wait(2000)
        dashlets.openDashletSettings()
        cy.wait(600)

        dashlets.elements.getTitle().clear().type(this.currentTimeData.dashletTitleEdited)
        cy.wait(600)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.paramRefreshInterval)
        dashlets.elements.getRefreshIntervalValue().contains(this.currentTimeData.itemRefreshInterval).click()

        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone1)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone1Edited)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone3)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone3Edited)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone4)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone4Edited)
        dashlets.openSettingDropdownByTitle(this.currentTimeData.titleTimeZone5)
        dashlets.selectDropdownItem(this.currentTimeData.valueTimeZone5Edited)

        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
    })
    it("Current Time edited assertions", function () {
        cy.wait(2000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(2000)
        dashlets.elements.getDashletCardTitle().should('contain', this.currentTimeData.dashletTitleEdited)
        
        function z(tm) {
            return ('0' + tm).slice(-2)
        }

        let date = new Date()
        let utcTime = z(date.getUTCHours()) + ':' + z(date.getUTCMinutes())

        let zone1 = z(date.getUTCHours()) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone1Edited)
            .invoke('text').then((time) => {
                let timeZone1 = time.trim()
                if (zone1 === timeZone1) {
                    cy.log("TimeZone1: VERIFIED!")
                }

            })
        let zone2 = z(date.getUTCHours() + 1) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone2)
            .invoke('text').then((time) => {
                let timeZone2 = time.trim()
                if (zone2 === timeZone2) {
                    cy.log("TimeZone2: VERIFIED!")
                }

            })
        let zone3 = z(date.getUTCHours() - 5) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone3Edited)
            .invoke('text').then((time) => {
                let timeZone3 = time.trim()
                if (zone3 === timeZone3) {
                    cy.log("TimeZone3: VERIFIED!")
                }

            })
        let zone4 = z(date.getUTCHours() - 8) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone4Edited)
            .invoke('text').then((time) => {
                let timeZone4 = time.trim()
                if (zone4 === timeZone4) {
                    cy.log("TimeZone4: VERIFIED!")
                }

            })
        let zone5 = z(date.getUTCHours() +11) + ':' + z(date.getUTCMinutes())
        dashlets.elements.getTimezoneTime(this.currentTimeData.valueTimeZone5Edited)
            .invoke('text').then((time) => {
                let timeZone5 = time.trim()
                if (zone5 === timeZone5) {
                    cy.log("TimeZone5: VERIFIED!")
                }

            })

    })
})