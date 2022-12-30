/// <reference types="cypress" />

import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();


describe("Multiple systems overview create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
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
        cy.fixture("MultiSys").then((multiSysData) => {
            this.multiSysData = multiSysData
        }) 
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })        
                     
    })
    let dashboardName;
    let table = []
  
    after(function() {
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

    it("Multiple System Overview creation", () => {

        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(5000)
        dashboards.clearDashboardHeader()
        
        //timestamp dashboard name and typing it to dashboard name         
              
        cy.stampDashName(this.multiSysData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })
               
        dashboards.clickAddDashletButton()
        dashlets.addDashlet(this.multiSysData.dashletDefTitle)
        cy.wait(2000)

        dashlets.elements.getSubtitle().type(this.multiSysData.subtitle)
        cy.wait(600)
        dashlets.elements.getSystemPredefinedDropdown()
        dashlets.elements.getSystemPredefinedValue(this.multiSysData.systemPredefined)
        
        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(800)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', 'less than a minute ago')
        cy.log(dashboardName)
        
    })
    //  works: 03.11
    it("Multiple System Overview editing created - 1- Category", () => {
        cy.reload()
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(200).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(500)
            .click()
        cy.wait(200)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header')
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_Category")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_Category")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]').within(() => {
            cy.get('.ng-star-inserted').contains('1 minute').click()
        })
        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('All Active Servers').click()
        })

        cy.get('#showInstallationInfo').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#showInstallationInfo').should('be.checked')

        cy.get('#showVersionInfo').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#showVersionInfo').should('be.checked')

        cy.get('#showInstanceDetails').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#showInstanceDetails').should('be.checked')

        //Select Check Types To Show
        cy.get('#RTM').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#RTM').should('be.checked')

        cy.get('#daily').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#daily').should('be.checked')

        cy.get('#Server').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#Server').should('be.checked')

        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        // cy.reload()
        //     cy.wait(600)
        // cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
    xit("Assertions for instances", function() {

        cy.reload()
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(2000).click()
        cy.get('@inventory').then((inventory) => {
           
            // Finding system name
            let systemsList = []
            let instancesJson = []
            let instancesList
            cy.get('.system-title__name.avantra-dashlet__headline').each(($el) => {
                cy.get($el).invoke('text').then((txt) => {
                    txt = txt.trim()
                    systemsList.push(txt)
                    // finding instances in JSON for the name from UI
                instancesList = inventory.find(el => el.name === txt);
                instancesJson = instancesList.instances
                cy.wrap(instancesList)
                cy.log('from JSON:  ' + instancesList.instances)
                })
                //create an arrays with instances on UI
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                let instancesUi = []
                cy.get($el).parents('.system-element').within(() => {
                    cy.get('.system-element-database__instances-list').then(($name) => {
                        if($name.length > 0) {
                            for(let i = 0; i < $name.length; i++ ) {
                                cy.get($name). invoke('text'). then((txtName) => {
                                txtName = txtName[i].trim()
                                instancesUi.push(txtName)
                                cy.log("From UI: " + instancesUi)
                                })
                            }
                        } else cy.log("No instances")
                        // cy.log(JSON.stringify(instancesJson.sort()) + " - from JSON and " + JSON.stringify(instancesUi.sort()) + " - from UI")
                    })
                    // cy.get('.system-element-database__instances-list')
                    // cy.get('div.database-instance__name').each(($name) => {    
                    //     instancesUi.length = 0
                    //     cy.get($name).invoke('text').then((txtName) => {
                    //             txtName = txtName.trim()
                    //             instancesUi.push(txtName)                                
                    //     })
                    // cy.log(JSON.stringify(instancesJson.sort()) + " - from JSON and " + JSON.stringify(instancesUi.sort()) + " - from UI")
                    // if (JSON.stringify(instancesJson.sort()) === JSON.stringify(instancesUi.sort())) {
                    //     cy.log("Instances present: " + instancesUi + " (UI) " + instancesJson + " (JSON) ")
                    // }
                    // })    
                        
                })
            })
            // .then((array) => cy.get(systemsList.sort()))
            // cy.wrap(systemsList)
            //     .then((array) => cy.log('List of systems', JSON.stringify(array)))

            // here comes creating and adding the instances to the array
            // here comes checking the consistency of system and instances list

        })
    })
    // works: 03.11
    it("Multiple System Overview editing created - 2 - Individual", () => {
        cy.reload()
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(2000).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(5000)
            .click()
        cy.wait(2000)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header')
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })

        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_individual")
        cy.wait(600)
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_individual")

        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('ABAP Systems').click()
        })
        cy.get('#individualCheck').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('#individualCheck').should('be.checked')

        cy.get('.ng-placeholder').contains('Select individual Checks').parents('.ng-select-multiple').click()
        cy.get('[placeholder="Select individual Checks"]').within(() => {
            cy.get('.ng-star-inserted').contains('FULLCHECK').click()
        })
        cy.get('#individualCheck').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('.ng-placeholder').contains('Select individual Checks').parents('.ng-select-container').within(() => {
            cy.get('.ng-arrow-wrapper').click()
        })
        cy.wait(300)
        cy.get('[placeholder="Select individual Checks"]').within(() => {
            cy.get('.ng-star-inserted').contains('CPULOAD').click()
        })


        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.wait(2000)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.reload()
        cy.wait(2000)
    })
    // works: 03.11
    xit("Multiple System Overview editing created - 3 - Check Selectors", () => {
        cy.reload()
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(1000).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(1000)
            .click()
        cy.wait(1000)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header').wait(600)
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(1000)
            .click()
        cy.wait(1000)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header').wait(600)
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_checksel")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_checksel")
        cy.wait(600)


        cy.wait(800)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('Avantra Servers').click()
        })
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]').within(() => {
            cy.get('.ng-star-inserted').contains('10 seconds').click()
        })
        cy.get('#checkSelectorId').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('#checkSelectorId').should('be.checked')

        cy.get('.ng-placeholder').contains('Select check').parents('.ng-select-container').click()
        cy.get('[placeholder="Select check"]').within(() => {
            cy.get('.ng-star-inserted').contains('ols-rtm').click()
        })

        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.wait(800)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
})