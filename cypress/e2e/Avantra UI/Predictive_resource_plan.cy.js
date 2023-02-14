/// <reference types="cypress" />

import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();


describe("Predictive resource planning: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
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
        cy.fixture("PredResPlan").then((predResData) => {
            this.predResData = predResData
        })
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })
        cy.fixture("systems-instances").then((inventory) => {
            this.inventory = inventory
        })

    })
    let dashboardName;
    let labels = []
    // let rowNames = ['Note', 'Version', 'Title', 'Status', 'Date', 'Component', 'Cat.', 'Secur. Cat.', 'Relevant For']
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
    it("Predictive resource planning creation", function () {
        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(1000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name         

        cy.stampDashName(this.predResData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        dashlets.selectDashletCategory(this.dashletsData.categoryPerformance)
        cy.wait(1000)
        dashlets.addDashlet(this.predResData.dashletDefTitle)
        cy.wait(2000)

        
        
        dashlets.elements.getTitle().type(this.predResData.title)
        //cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').type("Autotest")
        cy.wait(600)
        dashlets.openSystemPredefinedDropdown()
        
        dashlets.elements.getSystemPredefinedValue().contains(this.dashletsData.systemPredefined).click()
        dashlets.openSettingDropdownByTitle(this.predResData.settingResource).wait(200)
        dashlets.selectDropdownItem(this.predResData.resourceDiskSize).wait(200)    
       
       
        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)
    })
    it("Predictive resource planning assertions created", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200)
            .click()
        cy.wait(5000)


        dashlets.elements.getSysSelectorInfo().should('have.text', this.dashletsData.systemPredefined)
        dashlets.elements.getResourceInfo().should(($div) => {
            expect($div.text().trim()).equal(this.predResData.titleDiskSizeTotal);
        })
        labels = this.predResData.labels
        let labelsNames = []
        dashlets.elements.getChartLabels().each(($el) => {
            cy.get($el).invoke('text').then((text) => {
                let txtLabels = text.trim()
                labelsNames.push(txtLabels)
            })
        })
        cy.wrap(labelsNames).then(() => {
            if (JSON.stringify(labelsNames.sort()) === JSON.stringify(labels.sort())) {
                cy.log('Labels verified!')
            }
        })

    })
    it("Predictive resource planning editing", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200)
            .click()
        cy.wait(5000)
        dashboards.clickEditDashboard()
        cy.wait(2000)
        dashlets.openDashletSettings()
        cy.wait(600)

        dashlets.elements.getTitle().clear().type(dashboardName + "_edited")
        cy.wait(600)
        dashlets.openSettingDropdownByTitle(this.predResData.paramRefreshInterval)
        dashlets.selectDropdownItem(this.predResData.itemRefreshInterval)
        cy.wait(300)
        dashlets.openSystemPredefinedDropdown()
        dashlets.selectDropdownItem(this.predResData.systemPredefinedEdited)
        dashlets.openSettingDropdownByTitle(this.predResData.settingResource).wait(200)  
        dashlets.selectDropdownItem(this.predResData.resourceDiskSizeUsed)
        cy.wait(600)
    
        dashlets.openSettingDropdownByTitle(this.predResData.settingHistoricalPredict)

        
        dashlets.selectDropdownItem(this.predResData.valueHistoricalPredict)

     
        dashlets.focusSettingByTitle(this.predResData.settingMonthlPredict)
            .type(this.predResData.valueMonthlPredict)
        cy.wait(300)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)

    })
    it("Predictive resource planning edited assertions", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200)
            .click()
        cy.wait(5000)
        dashlets.elements.getSysSelectorInfo().should('have.text', this.predResData.systemPredefinedEdited)
        dashlets.elements.getResourceInfo().should(($div) => {
            expect($div.text().trim()).equal(this.predResData.titleDiskSizeUsed);
        })
        labels = this.predResData.labelsEdited
        let labelsNames = []
        dashlets.elements.getChartLabels().each(($el) => {
            cy.get($el).invoke('text').then((text) => {
                let txtLabels = text.trim()
                labelsNames.push(txtLabels)
            })
        })
        cy.wrap(labelsNames).then(() => {
            if (JSON.stringify(labelsNames.sort()) === JSON.stringify(labels.sort())) {
                cy.log('Labels verified!')
            }
        })
    })
})