/// <reference types="cypress" />

import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";
import MultiSys from "../../pageObjects/MultiSys.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();
const multiSys = new MultiSys();


describe("Multiple systems overview create, assert, edit, delete", { defaultCommandTimeout: 10000 }, () => {
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
        cy.fixture("MultiSys").then((multiSysData) => {
            this.multiSysData = multiSysData
        })
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })
        cy.fixture("systems-instances").then((inventory) => {
            this.inventory = inventory
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

    it("Multiple System Overview creation", function () {

        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(1000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name         

        cy.stampDashName(this.multiSysData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        dashlets.selectDashletCategory(this.dashletsData.categorySystems)
        cy.wait(1000)
        dashlets.addDashlet(this.multiSysData.dashletDefTitle)
        cy.wait(2000)


        // dashlets.elements.getSubtitle().type(this.multiSysData.subtitle)
        cy.wait(600)
        dashlets.openSystemPredefinedDropdown()
        dashlets.elements.getSystemPredefinedValue().contains(this.multiSysData.systemPredefined).click()

        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)

    })
    //  works: 03.11
    it("Multiple System Overview editing created - 1- Category", function () {
        cy.reload()
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(5000)
        dashboards.clickEditDashboard()
        cy.wait(2000)
        dashlets.openDashletSettings()
        cy.wait(600)

        dashlets.elements.getTitle().clear().type(this.dashletsData.titleEdited + "Cat")
        // dashlets.elements.getSubtitle().clear().type(this.dashletsData.subtitleEdited + "Cat")
        cy.wait(600)

        dashlets.openSettingDropdownByTitle(this.multiSysData.paramRefreshInterval)
        dashlets.elements.getRefreshIntervalValue().contains(this.multiSysData.itemRefreshInterval).click()
        cy.wait(300)

        dashlets.openSystemPredefinedDropdown()
        dashlets.elements.getSystemPredefinedValue().contains(this.multiSysData.systemPredefinedEdited).click()

        dashlets.elements.getRadioButtonMark(this.multiSysData.radioCategory).should('be.checked')
        dashlets.elements.getCheckboxByLabel(this.multiSysData.checkboxInstalInfo).click()
        cy.wait(300)
        dashlets.elements.getCheckmarkByLabel(this.multiSysData.checkboxInstalInfo).should('be.checked')

        dashlets.elements.getCheckboxByLabel(this.multiSysData.checkboxVersionInfo).click()
        cy.wait(300)
        dashlets.elements.getCheckmarkByLabel(this.multiSysData.checkboxVersionInfo).should('be.checked')

        dashlets.elements.getCheckboxByLabel(this.multiSysData.checkboxInstanceDetails).click()
        cy.wait(300)
        dashlets.elements.getCheckmarkByLabel(this.multiSysData.checkboxInstanceDetails).should('be.checked')

        //Select Check Types To Show
        dashlets.elements.getCheckboxByLabel(this.multiSysData.checkboxRTM).click()
        cy.wait(300)
        dashlets.elements.getCheckmarkByLabel(this.multiSysData.checkboxRTM).should('be.checked')

        dashlets.elements.getCheckboxByLabel(this.multiSysData.checkboxDaily).click()
        cy.wait(300)
        dashlets.elements.getCheckmarkByLabel(this.multiSysData.checkboxDaily).should('be.checked')

        dashlets.elements.getCheckboxByLabel(this.multiSysData.checkboxServer).click()
        cy.wait(300)
        dashlets.elements.getCheckmarkByLabel(this.multiSysData.checkboxServer).should('be.checked')

        cy.wait(800)
        dashboards.saveDashboard()

    })
    xit("Assertions for instances", function () {
        // Not working currently. Review with API!!!!!!!!!!!!!!!!
        cy.reload()
        cy.wait(20000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(20000)
        // cy.get('@inventory').then((inventory) => {

        // Finding system name
        let systemsList = []
        let instancesList
        multiSys.elements.getSystemHeadline().each(($el) => {
            cy.get($el).invoke('text').then((txt) => {
                let instancesJson = []
                txt = txt.trim()
                systemsList.push(txt)
                cy.log(systemsList)
                // finding instances in JSON for the name from UI
                instancesList = this.inventory.find(el => el.name === txt);
                instancesJson = instancesList.instances
                cy.wrap(instancesList)
                cy.log('from JSON:  ' + instancesList.instances)
            })
            //create an arrays with instances on UI
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            let instancesUi = []
            cy.get($el).parents('.system-element').within(() => {
                if (cy.get($el).parents('.system-element').find('.system-element__database-instances-list').length) {
                    multiSys.elements.getDbInstancesList().then(($name) => {
                        for (let i = 0; i < $name.length; i++) {
                            cy.get($name).invoke('text').then((txtName) => {
                                txtName = txtName[i].trim()
                                instancesUi.push(txtName)
                                cy.log("From UI: " + instancesUi)
                            })
                        }

                    })
                } 
                // else cy.log("No instances")

            })
        })

        // })
    })
    // works: 03.11
    it("Multiple System Overview editing created - 2 - Individual", function () {
        cy.reload()
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(10000)
        dashboards.clickEditDashboard()
        cy.wait(10000)
        dashlets.openDashletSettings()
        cy.wait(600)

        dashlets.elements.getTitle().clear().type(this.dashletsData.titleEdited + "Ind")
        // dashlets.elements.getSubtitle().clear().type(this.dashletsData.subtitleEdited + "Ind")
        cy.wait(600)

        dashlets.openSystemPredefinedDropdown()
        dashlets.elements.getSystemPredefinedValue().contains(this.multiSysData.systemPredefinedEdited1).click()

        // dashlets.elements.getCheckboxByLabel(this.multiSysData.checkboxInstalInfo).click()
        // cy.wait(300)
        // dashlets.elements.getCheckmarkByLabel(this.multiSysData.checkboxInstalInfo).should('be.checked')
        dashlets.elements.getRadioButton(this.multiSysData.selectIndividualLabel).click()
        dashlets.elements.getDropdownArrow(this.multiSysData.selectIndividualLabel).click()

        cy.wait(300)
        dashlets.selectMultiChoiceItem(this.multiSysData.individualCheckItem1)
        cy.wait(300)
        // cy.get('.ng-placeholder').contains('Select individual Checks').parents('.ng-select-container').within(() => {
        //     cy.get('.ng-arrow-wrapper').click()
        // })
        cy.wait(300)
        dashlets.selectMultiChoiceItem(this.multiSysData.individualCheckItem2)


        cy.wait(800)
        dashboards.saveDashboard()
        cy.wait(2000)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)

    })
    // works: 03.11
    it("Multiple System Overview editing created - 3 - Check Selectors", function () {
        cy.reload()
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(10000)
        dashboards.clickEditDashboard()
        cy.wait(10000)
        dashlets.openDashletSettings()
        cy.wait(600)

        dashlets.elements.getTitle().clear().type(this.dashletsData.titleEdited + "Sel")
        // dashlets.elements.getSubtitle().clear().type(this.dashletsData.subtitleEdited + "Sel")
        cy.wait(600)



        dashlets.openSystemPredefinedDropdown()
        dashlets.elements.getSystemPredefinedValue().contains(this.multiSysData.systemPredefined).click()

        dashlets.openSettingDropdownByTitle(this.multiSysData.paramRefreshInterval)
        dashlets.elements.getRefreshIntervalValue().contains(this.multiSysData.itemRefreshInterval).click()

        dashlets.elements.getRadioButton(this.multiSysData.radioCheckSelector).click()


        cy.wait(300)
        dashlets.elements.getRadioButtonMark(this.multiSysData.radioCheckSelector).should('be.checked')

        dashlets.elements.getDropdownArrow(this.multiSysData.placeholderCheckSelector).click()
        cy.wait(300)

        dashlets.selectDropdownItem(this.multiSysData.itemCheckSelector)
        // cy.get('[placeholder="Select check"]').within(() => {
        //     cy.get('.ng-star-inserted').contains('ols-rtm').click()
        // })


        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
    })
})