/// <reference types="cypress" />

describe("Dashlets and dashboards", { defaultCommandTimeout: 5000 }, () => {
    beforeEach(() => {
        cy.fixture("List_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit(creds.env)
            cy.wait(600)
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
            cy.wait(600)
            cy.get('.drawer__header__title').should('have.text', 'Dashboards')
            cy.wait(600)

        })
    })
  let dashboardName;
//ADMINISTRATIVE
// works:27.10
    it("Dashboard creation and Business Service Node adding", () => {
            cy.get('.drawer__header__title').should('have.text', 'Dashboards')
            cy.wait(2000)
            cy.get('.drawer__header').children('.drawer__header__add-button').click();
            cy.wait(1000)
            cy.get('.dashboard-modify__header-input').clear();
            //timestamp dashboard name               
                    var stamp=Date.now();
                    const dashname = `OLS_bs_node${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    
            cy.get('.dashboard-modify__add-dashlet').click();
            cy.get(':nth-child(2) > :nth-child(1) > avantra-dashlet-selector-item > .dashlet-selector-item > .dashlet-selector-item__button').click();
            cy.get('.dropdown-group > :nth-child(1) > .mat-tooltip-trigger > .select > #undefined > .ng-select-container > .ng-arrow-wrapper').click();
            cy.get('.ng-dropdown-panel').within(() => {
                
                cy.get('.ng-dropdown-panel-items').contains('BS_RELEASE').click({ force:true })
            })
            cy.wait(3000)
            //get element within another element
            cy.get('.dashlet-add__stepper').within(() => {
                cy.get('[mattooltip="Save"]')
                    .within(() => {
                        cy.get('.icon-button__text')
                            .click({ force:true })
                    })
            })
            cy.wait(5000)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]')
                    .within(() => {
                        cy.get('.icon-button__text')
                            .click({ force:true })
                    })
    
            })
            cy.wait(3000)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
            cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })
            


        // cy.wait(3000)
        // // Delete the dashboard with the same name prior to name the current one
        // // Creating list of the dashboard names
        // const allDashboardsList = []
        // cy.get('avantra-sidebar-list-item').each(($el) => {
        //     cy.get($el).invoke('text').then((txt) => {
        //         txt = txt.trim()
        //         allDashboardsList.push(txt)
        //     })
        // })
        //      .then(() => {
        // //Searching for the existing dashboard with the name we need

        //     if (allDashboardsList.includes('OLS_name_check')) {
        //         cy.log('Dashboard already exists, deleting old dashboard: OLS_name_check')
        //        cy.get('avantra-sidebar-list-item').contains('OLS_name_check').trigger('mouseover')
        //         cy.get('avantra-sidebar-list-item').contains('OLS_name_check').siblings('.sidebar-list-item__menu-button')
        //         .click({ force: true })

        //         //click Delete on menu appeared
        //         cy.get('.mat-menu-item').contains('Delete').click()
        //         //pop-up confirmation: confirm deletion
        //         cy.get('[class="confirmation-modal"]').within(() => {
        //             cy.contains('Yes').click()
        //         })
        //         //Verify the dashboard is deleted
        //         cy.contains('a', 'OLS_name_check').should('not.exist')
                
        //     }
        //     else { 
        //         cy.contains('a', 'OLS_name_check').should('not.exist')
        //          cy.log('Dashboard is not existing')
        //     }

        //      })
        //      cy.wait(300)
        //      cy.get('.dashboard-modify__header-input').type('OLS_name_check')
        //      cy.wait(3000)
        // cy.get('.sub-header').within(() => {
        //     cy.get('[mattooltip="Save"]')
        //         .within(() => {
        //             cy.get('.icon-button__text')
        //                 .click({ force:true })
        //         })

        // })
        // cy.wait(3000)
        cy.get('.updated-at__time').wait(500).should('have.text', 'less than a minute ago')
})
// works 27.10
    it("Business Service Node editing", () => {
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .click()
            cy.wait(5000)
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(2000)
                .click() 
                cy.wait(5000)
        //Findind and clicking Dashlet Setting button on dashlet
        cy.get('.ng-star-inserted').contains('Business Service Node').parents('.avantra-dashlet__header')
        .within (() =>{
            cy.get('[mattooltip="Dashlet Settings"]')
                .wait(2000)
                .click()
                cy.wait(5000)
        })
        //Editing dashlet settings
            cy.get('[placeholder="Business Service Node"]').type(dashboardName + "_edited")
            cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited")
            cy.wait(600)
            cy.get('[placeholder="Select Business Service"]').click()
            cy.get('.ng-dropdown-panel').within(() => {
                cy.get('.ng-star-inserted').contains('BS_RELEASE - Copy').click({ force:true })
                cy.wait(300)
            })
            cy.get('[placeholder="Select Business Service Node"]').click()
            cy.get('.ng-dropdown-panel').within(() => {
                cy.get('.ng-dropdown-panel-items').contains('Relevant Custom Checks').click({ force:true })
                cy.wait(300)
            })
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('5 minutes').click()
            })
            
            cy.wait(300)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
//works 27.10
    it("Logbook Activities creation", () => {
        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
            cy.wait(1000)
            cy.get('.drawer__header').children('.drawer__header__add-button').click();
            cy.wait(1000)
            cy.get('.dashboard-modify__header-input').clear();
            //timestamp dashboard name               
                    var stamp=Date.now();
                    const dashname = `OLS_lb_act${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    
            cy.get('.dashboard-modify__add-dashlet').click();
        cy.get('.dashlet-selector-item__title').contains('Logbook Activities').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Logbook Activities"]').clear().type("Logbook_ols")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.wait(600)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.log(dashname)
        .then(() => {
            dashboardName = dashname;
        })
        cy.wait(1000)
    })
    // works 27.10
    it("Logbook Activities editing", () => {
        cy.get('.navigation-list-item').contains('a', dashboardName)
        .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })
            
        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Edit').click();
        })
        //Findind and clicking Dashlet Setting button on dashlet
        cy.get('.ng-star-inserted').contains('Logbook_ols').parents('.avantra-dashlet__header')
        .within (() =>{
            cy.get('[mattooltip="Dashlet Settings"]')
                .wait(2000)
                .click()
                cy.wait(5000)
        })
           
            cy.get('[placeholder="Logbook Activities"]').clear().type("Logbook_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').type("Autotest1")
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
    // works: 
    it("Check For Updates creation", () => {
        // adding to Logbook activities dashboard
        cy.get('.navigation-list-item').contains('a', dashboardName)
        .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })
            
        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Edit').click();
        })
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
        cy.get('.dashlet-selector-item__title').contains('Check For Updates').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Check For Updates"]').clear().type("Check_For_Updates_ols")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.wait(5000)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(5000)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.log(dashboardName)

})
// works: 28.10
    it("Check For Updates editing", () => {
                //Finding the dashboard in the list
                cy.get('.navigation-list-item').contains('a', dashboardName)
                .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })
                    
                cy.wait(1000)
                cy.get('.mat-menu-panel').within(() => {
                    cy.get('.mat-menu-item').contains('Edit').click();
                })

        //Findind and clicking Dashlet Setting button on dashlet
        cy.get('.ng-star-inserted').contains('Check_For_Updates_ols').parents('.avantra-dashlet__header')
        .within (() =>{
            cy.get('[mattooltip="Dashlet Settings"]')
                .wait(2000)
                .click()
                cy.wait(5000)
        })
           
            cy.get('[placeholder="Check For Updates"]').clear().type(dashboardName + '_edited chfup')
            cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').type("Autotest_edited")
            cy.wait(600)
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('1 hour').click()
            })
            
            cy.wait(5000)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
 
    it("Signed in Users creation", () => {
        //Finding the dashboard in the list
        cy.get('.sidebar-list-item').contains('a', "OLS_name_check")
            .click()
            cy.wait(5000)
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(2000)
                .click() 
                cy.wait(5000)

        //Adding new dashlet
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
        cy.wait(5000)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
    it("Signed in Users editing", () => {
            //Finding the dashboard in the list
                cy.get('.sidebar-list-item').contains('a', "OLS_name_check")
                .click()
                cy.wait(5000)
            cy.get('.header__edit-block')
                .get('[mattooltip="Edit Dashboard"]')
                    .wait(2000)
                    .click() 
                    cy.wait(5000)
    
            //Findind and clicking Dashlet Setting button on dashlet
            cy.get('.ng-star-inserted').contains('Signed_in_Users_ols').parents('.avantra-dashlet__header')
            .within (() =>{
                cy.get('[mattooltip="Dashlet Settings"]')
                    .wait(2000)
                    .click()
                    cy.wait(5000)
            })
           
            cy.get('[placeholder="Signed in Users"]').clear().type("Signed_in_Users_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited")
            cy.wait(600)
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('1 minute').click()
            })
            
            cy.wait(5000)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
//CHECKS
it("Multi RTM Status creation", () => {
        //Finding the dashboard in the list
        cy.get('.sidebar-list-item').contains('a', "OLS_name_check")
            .click()
            cy.wait(5000)
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(2000)
                .click() 
                cy.wait(5000)

    //Adding the dashlet
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
    cy.wait(300)
    cy.get('.sub-header').within(() => {
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    })
    cy.wait(300)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
it("Multi RTM Status editing", () => {
            //Finding the dashboard in the list
            cy.get('.sidebar-list-item').contains('a', "OLS_name_check")
            .click()
            cy.wait(5000)
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(2000)
                .click() 
                cy.wait(5000)

        //Findind and clicking Dashlet Setting button on dashlet
        cy.get('.ng-star-inserted').contains('Multi_RTM_Status_ols').parents('.avantra-dashlet__header')
        .within (() =>{
            cy.get('[mattooltip="Dashlet Settings"]')
                .wait(2000)
                .click()
                cy.wait(5000)
        })
       
        cy.get('[placeholder="Multi RTM Status"]').clear().type("Multi_RTM_Status_ols_edited")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]'). within(() => {
            cy.get('.ng-star-inserted').contains('1 minute').click()
        })
        cy.wait(300)
        
        cy.get('avantra-dashlet-settings-check-selector.ng-untouched > .mat-tooltip-trigger > .select > #undefined > .ng-select-container > .ng-arrow-wrapper').click()
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
        //Finding the dashboard in the list
        cy.get('.sidebar-list-item').contains('a', "OLS_name_check")
            .click()
            cy.wait(5000)
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(2000)
                .click() 
                cy.wait(5000)

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
    cy.wait(5000)
    cy.get('.sub-header').within(() => {
        cy.get('[mattooltip="Save"]').click()
    })
    cy.wait(300)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

})
it("RTM Check editing", () => {
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



//Multiple System Overview
//SAP HotNews
//Predictive Resource Planning
//Current Time

})

