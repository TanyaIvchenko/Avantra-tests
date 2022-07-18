/// <reference types="cypress" />

describe("Dashlets and dashboards", { defaultCommandTimeout: 5000 }, () => {
    before(() => {
        cy.fixture("Admin_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
            cy.wait(500)
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
            cy.wait(5000)
        })
    })
    beforeEach(() => {

        // Preserve the Cookies
        
        Cypress.Cookies.preserveOnce('token', 'JSESSIONID');
        
        })

//ADMINISTRATIVE
    it("Business Service Node creation", () => {

        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
        cy.get('.dashboard-modify__header-input').type('Business_Service_Node_ols');
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click();
        cy.get('.dashlet-selector-item__title').contains('Business Service Node').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Business Service Node"]').type("Business Service Node_ols")
        cy.get('[formcontrolname="subtitle"]').children('input').type("Autotest")
        cy.wait(600)
        cy.get('.dropdown-group > :nth-child(1) > .mat-tooltip-trigger > .select > #undefined > .ng-select-container > .ng-arrow-wrapper').click();
        cy.get('.ng-dropdown-panel').within(() => {
        cy.get('.ng-star-inserted').contains('BS_ols').click({ force:true })
        })
        cy.wait(5000)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[mattooltip="Save"]')
                .within(() => {
                    cy.get('.icon-button__text')
                        .click({ force:true })
                })
        })
        cy.wait(5000)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
    it("Business Service Node editing created", () => {
        cy.wait(5000)
        cy.get('.sidebar-list-item').contains('a', "Business_Service_Node_ols")
            .click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(2000)
                .click() 
                cy.wait(5000)
        cy.get('.avantra-drawer__content').within (() =>{
                cy.get('.avantra-dashlet__header')
            .within (() =>{
            cy.wait(2000)
            cy.get('[mattooltip="Dashlet Settings"]')
            .click()
            })
        })
        
            cy.get('[placeholder="Business Service Node"]').clear().type("Business Service Node_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited")
            cy.wait(600)
            cy.get('[placeholder="Select Business Service"]').click()
            cy.get('.ng-dropdown-panel').within(() => {
                cy.get('.ng-star-inserted').contains('BS_REL_8').click({ force:true })
                cy.wait(300)
            })
            cy.get('[placeholder="Select Business Service Node"]').click()
            cy.get('.ng-dropdown-panel').within(() => {
                cy.get('.ng-star-inserted').contains('RTM Checks').click({ force:true })
                cy.wait(300)
            })
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('5 minutes').click()
            })
            
            cy.wait(300)
            cy.wait(5000)
            
            cy.wait(300)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
//
    it("Logbook Activities creation", () => {
        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
        cy.get('.dashboard-modify__header-input').clear();
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click();
        cy.get('.dashlet-selector-item__title').contains('Logbook Activities').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Logbook Activities"]').clear().type("Logbook_ols")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.get('#input-dashboard-name-id').type("Logbook_act_dash_test")
        cy.wait(300)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
    })
    it("Logbook Activities editing", () => {
        cy.wait(600)
        cy.get('.sidebar-list-item').contains('a', "Logbook_act_dash_test")
            .click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(2000)
                .click() 
                cy.wait(2000)
        cy.get('.avantra-drawer__content').within (() =>{
                cy.get('.avantra-dashlet__header')
            .within (() =>{
            cy.get('[mattooltip="Dashlet Settings"]')
            .click()
            })
        })
           
            cy.get('[placeholder="Logbook Activities"]').clear().type("Logbook_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('input').type("Autotest1")
            cy.wait(600)
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('10 minutes').click()
            })
            
            cy.wait(300)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
    it("Check For Updates creation", () => {

        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
        cy.get('.dashboard-modify__header-input').clear()
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
        cy.get('.dashlet-selector-item__title').contains('Check For Updates').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Check For Updates"]').clear().type("Check_For_Updates_ols")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.get('#input-dashboard-name-id').type("Check_For_Updates_test")
        cy.wait(300)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(5000)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
    it("Check For Updates editing created", () => {
        cy.wait(600)
        cy.get('.sidebar-list-item').contains('a', "Check_For_Updates_test")
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
           
            cy.get('[placeholder="Check For Updates"]').clear().type("Check_For_Updates_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('input').type("Autotest_edited")
            cy.wait(600)
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('1 hour').click()
            })
            
            cy.wait(300)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
    
    it("Signed in Users creation", () => {

        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
        cy.get('.dashboard-modify__header-input').clear()
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
        cy.get('.dashlet-selector-item__title').contains('Signed in Users').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Signed in Users"]').clear().type("Signed_in_Users_ols")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.get('#input-dashboard-name-id').type("Signed_in_Users_test")
        cy.wait(300)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
    it("Signed in Users editing created", () => {
        cy.wait(600)
        cy.get('.sidebar-list-item').contains('a', "Signed_in_Users_test")
        .wait(2000).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(5000)
                .click() 
            cy.wait(2000)
        cy.get('.avantra-drawer__content').within (() =>{
                cy.get('.avantra-dashlet__header')
            .within (() =>{
                cy.get('[mattooltip="Save"]').click()
            .click()
            })
        })
           
            cy.get('[placeholder="Signed in Users"]').clear().type("Signed_in_Users_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('input').type("Autotest_edited")
            cy.wait(600)
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('1 minute').click()
            })
            
            cy.wait(300)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
//CHECKS
it("Multi RTM Status creation", () => {

    cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
    cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
    cy.get('.dashboard-modify__header-input').clear()
    cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
    cy.get('.dashlet-selector-item__title').contains('Multi RTM Status').parent()
    .within (() =>{
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    })
    cy.get('[placeholder="Multi RTM Status"]').type("Multi_RTM_Status_ols")
    cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
    cy.wait(600)
    cy.get('.dashlet-add__stepper').within(() => {
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    })
    cy.get('#input-dashboard-name-id').type("Multi_RTM_Status_test")
    cy.wait(300)
    cy.get('.sub-header').within(() => {
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    })
    cy.wait(300)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
it("Multi RTM Status editing created", () => {
    cy.wait(600)
    cy.get('.sidebar-list-item').contains('a', "Multi_RTM_Status_test")
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
       
        cy.get('[placeholder="Multi RTM Status"]').clear().type("Multi_RTM_Status_ols_edited")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]'). within(() => {
            cy.get('.ng-star-inserted').contains('1 minute').click()
        })
        cy.wait(300)

        
        cy.get('avantra-dashlet-settings-check-selector').click()
        cy.get('avantra-dashlet-settings-check-selector').within(() =>{
        cy.get('.ng-star-inserted').contains('ols-all').click()
    })
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
            cy.get('.ng-star-inserted').contains('All Servers').click()
        })
        //radiobuttons
        cy.get('.radio-button__label').contains('Predefined').siblings('.radio-button__input').should('be.checked')
        cy.get('.radio-button__label').contains('Ad-Hoc (Classic UI)').siblings('.radio-button__input').should('not.be.checked')

        cy.get('.dashlet-settings__param--title').contains('No Data Status').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('No Data Status').parent('.dashlet-settings__param').within(() =>{
            cy.get('ng-dropdown-panel').contains('CRITICAL').click()
        })
        //checkbox
        cy.get('label').contains('Include Unknown Checks').siblings('.custom-checkbox__checkmark').click()

        cy.get('label').contains('Include Unknown Checks').siblings('input').should('be.checked')

        cy.get('.dashlet-settings__param--title').contains('Chart Type').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('Chart Type').parent('.dashlet-settings__param').within(() =>{
            cy.get('ng-dropdown-panel').contains('Pie Chart').click()
        })
        cy.get('.dashlet-settings__param--title').contains('Check Confirmation').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('Check Confirmation').parent('.dashlet-settings__param').within(() =>{
            cy.get('ng-dropdown-panel').contains('Not Confirmed').click()
        })
        
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
it("RTM Check creation", () => {

    cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
    cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
    cy.get('.dashboard-modify__header-input').clear()
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
    cy.get('#input-dashboard-name-id').type("RTM_Check_test")
    cy.wait(300)
    cy.get('.sub-header').within(() => {
        cy.get('[mattooltip="Save"]').click()
    })
    cy.wait(300)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
it("RTM Check editing created", () => {
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
// Multiple System Overview
it("Multiple System Overview creation", () => {

    cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
    cy.wait(5000)
    cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
    cy.get('.dashboard-modify__header-input').clear()
    cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
    cy.get('.dashlet-selector-item__title').contains('Multiple System Overview').parent()
    .within (() =>{
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    })
    cy.get('[placeholder="Multiple System Overview"]').type("Multiple_System_Overview_ols")
    cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
    cy.wait(600)
    cy.get('avantra-dashlet-settings-system-predefined').click()
    cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('All Servers').click()
    })
    cy.wait(600)
    cy.get('.dashlet-add__stepper').within(() => {
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    })
    cy.get('#input-dashboard-name-id').type("Multiple_System_Overview_test")
    cy.wait(300)
    cy.get('.sub-header').within(() => {
        cy.get('[mattooltip="Save"]').click()
    })
    cy.wait(300)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
it("Multiple System Overview editing created - 1- Category", () => {
    cy.wait(600)
    cy.get('.sidebar-list-item').contains('a', "Multiple_System_Overview_test")
    .wait(5000).click()
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
       
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_Category")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited_Category")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]'). within(() => {
            cy.get('.ng-star-inserted').contains('1 minute').click()
        })
        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
    cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('All DB Servers').click()
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

        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
it("Multiple System Overview editing created - 2 - Individual", () => {
    cy.wait(600)
    cy.get('.sidebar-list-item').contains('a', "Multiple_System_Overview_test")
    .wait(5000).click()
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
       
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_individual")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited_individual")

        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('All DB Servers').click()
    })
        cy.get('#individualCheck').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('#individualCheck').should('be.checked')

        cy.get('.ng-placeholder').contains('Select individual Checks').parents('.ng-select-multiple').click()
        cy.get('[placeholder="Select individual Checks"]').within(() =>{
            cy.get('.ng-star-inserted').contains('FULLCHECK').click()
        })
        cy.get('#individualCheck').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('.ng-placeholder').contains('Select individual Checks').parents('.ng-select-container').within(() =>{
        cy.get('.ng-arrow-wrapper').click()
        })
        cy.wait(300)
        cy.get('[placeholder="Select individual Checks"]').within(() =>{
            cy.get('.ng-star-inserted').contains('CPULOAD').click()
        })

        
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
it("Multiple System Overview editing created - 3 - Check Selectors", () => {
    cy.wait(600)
    cy.get('.sidebar-list-item').contains('a', "Multiple_System_Overview_test")
    .wait(5000).click()
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
       
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_checksel")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited_checksel")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]'). within(() => {
            cy.get('.ng-star-inserted').contains('5 minutes').click()
        })
        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('All DB Servers').click()
    })
        cy.get('#checkSelectorId').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('#checkSelectorId').should('be.checked')

        cy.get('.ng-placeholder').contains('Select check').parents('.ng-select-container').click()
        cy.get('[placeholder="Select check"]').within(() =>{
            cy.get('.ng-star-inserted').contains('Olha-one-check').click()
        })
                
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
//SAP HotNews
it.only("SAP HotNews creation", () => {

    cy.get('.drawer__header__title').should('have.text', 'Dashboards')
    cy.wait(5000)
    cy.get('.drawer__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
    cy.get('.dashboard-modify__header-input').clear()
    cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
    cy.get('[placeholder="Search Dashlet"]').within(() => {
       cy.get('input').type('sap')
    })
    cy.get('.dashlet-selector-item__title').should('have.length', 1)
    cy.get('.dashlet-selector-item__title').should('contain', 'SAP HotNews')
    cy.get('.dashlet-selector-item__button').wait(2000).click()

    cy.get('[placeholder="SAP HotNews"]').type("Hot_ols")
    cy.get('[formcontrolname="subtitle"]').clear().type("Autotest")
    cy.wait(2000)
    cy.get('.mat-paginator-range-label').should('contain', 'Page 1 of')
    cy.wait(10000)
    //Get number of pages
    cy.get('.mat-paginator-range-label').invoke('text')
    .then(text => +text.replace('Page 1 of', '').trim()).then((text) =>{
    cy.log('Number of pages is: ', text)
    cy.wrap(text).as('pageNum')
    })
    cy.get('[aria-label="First page"]').should('have.class', 'mat-button-disabled')
    cy.get('[aria-label="Previous page"]').should('have.class', 'mat-button-disabled')
    //Length=26, because of tr for table header
    cy.get('[aria-label="avantra-table"]').find('tr').should('have.length', 26)
    //For pages more than 1
    cy.get('@pageNum').then((pageNum) => {
        if(pageNum>1){
    //click once Next page
    cy.get('[aria-label="Next page"]').click()
    cy.get('.mat-paginator-range-label').wait(600).should('contain', 'Page 2 of')
    cy.get('[aria-label="First page"]').should('not.have.class', 'mat-button-disabled')
    cy.get('[aria-label="Previous page"]').should('not.have.class', 'mat-button-disabled')
    //click Last page
    cy.get('[aria-label="Last page"]').click()
    cy.get('@pageNum').then((pageNum) => {
    let newPageNum;
    newPageNum = 'Page '+ pageNum;
    cy.get('.mat-paginator-range-label').wait(600).invoke('text').should('contain', newPageNum);
})
//Counting pages for 50 per page
    cy.get('.mat-paginator-page-size-select').wait(200).click()
    cy.get('.mat-option-text').contains('50').parent('mat-option').click()
    cy.then((pageNum) => {
        let fiftyPageNum;
       fiftyPageNum = 'Page '+ pageNum/2;
        let fiftyMinusPageNum;
        fiftyMinusPageNum = 'Page '+ ((pageNum/2)-1);
        cy.get('.mat-paginator-range-label').wait(600).invoke('text').then((text) =>{
            if(text.includes(fiftyPageNum)) {
                cy.log('Number for 50 per page:', fiftyPageNum)
            }
            else if (text.includes(fiftyMinusPageNum)) {
                cy.log('Number for 50 per page:', fiftyMinusPageNum)
            }
            else {
                cy.log('Number for 50 per page: INCORRECT')
            }
        })
        })
         //Length=51, because of tr for table header
    cy.get('[aria-label="First page"]').click()
    cy.get('[aria-label="avantra-table"]').find('tr').should('have.length', 51)
    //Counting pages for 100 per page
        cy.get('.mat-paginator-page-size-select').wait(200).click()
        cy.get('.mat-option-text').contains('100').parent('mat-option').click()
        //Length=101, because of tr for table header
        cy.get('[aria-label="avantra-table"]').find('tr').should('have.length', 101)
        cy.then((pageNum) => {
            let hundredPageNum;
            hundredPageNum = 'Page '+ pageNum/4;
            let hundredMinusPageNum;
            hundredMinusPageNum = 'Page '+ ((pageNum/4)-1);
            cy.get('.mat-paginator-range-label').wait(600).invoke('text').then((text) =>{
                if(text.includes(hundredPageNum)) {
                    cy.log('Number for 100 peк page:', hundredPageNum)
                }
                else if (text.includes(hundredMinusPageNum)) {
                    cy.log('Number for 100 per page:', hundredMinusPageNum)
                }
                else{
                    cy.log('Number for 100 per page: INCORRECT')
                }
            })
            })
        }
    //For ONE page
        else{
            cy.get('[aria-label="Next page"]').should('not.have.class', 'mat-button-disabled')
            cy.get('[aria-label="Last page"]').should('not.have.class', 'mat-button-disabled')
            
        }
        })
    
    // cy.wait(600)
    // cy.get('.dashlet-add__stepper').within(() => {
    //     cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    // })
    // cy.get('#input-dashboard-name-id').type("Predictive_Resource_Planning_test")
    // cy.wait(300)
    // cy.get('.sub-header').within(() => {
    //     cy.get('[mattooltip="Save"]').click()
    // })
    // cy.wait(300)
    // cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})

//Predictive Resource Planning
it("Predictive Resource Planning creation", () => {

    cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
    cy.wait(5000)
    cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
    cy.get('.dashboard-modify__header-input').clear()
    cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
    cy.get('.dashlet-selector-item__title').contains('Predictive Resource Planning').parent()
    .within (() =>{
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    })
    cy.get('[placeholder="Predictive Resource Planning"]').type("Predictive_Resource_Planning_ols")
    cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
    cy.wait(600)
    cy.get('avantra-dashlet-settings-system-predefined').click()
    cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('All Servers').click()
    })
    cy.wait(600)
    cy.get('.dashlet-add__stepper').within(() => {
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    })
    cy.get('#input-dashboard-name-id').type("Predictive_Resource_Planning_test")
    cy.wait(300)
    cy.get('.sub-header').within(() => {
        cy.get('[mattooltip="Save"]').click()
    })
    cy.wait(300)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})

//Current Time

})

