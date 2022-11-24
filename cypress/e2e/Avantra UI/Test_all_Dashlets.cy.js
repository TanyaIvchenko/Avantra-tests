/// <reference types="cypress" />

describe("Dashlets and dashboards", { defaultCommandTimeout: 5000 }, () => {
    before(() => {
        cy.fixture("List_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit(creds.env)
            cy.wait(600)
            cy.get('body').then((body) => {
                if (body.find('#input-login-id').length > 0) {
                    cy.get('#input-login-id').type(creds.login)
                    cy.get('#input-password-id').type(creds.password)
                    cy.get('.background-primary').contains("Login to Avantra").click()
                    cy.wait(600)
                    cy.get('.drawer__header__title').wait(600).should('have.text', 'Dashboards')
                    cy.wait(600)
                }
            })
            
        })
    })
    beforeEach(() => {

        // Preserve the Cookies
        
   Cypress.Cookies.preserveOnce('token', 'JSESSIONID');
        
        })
// cy.wait(3000)
//         // Delete the dashboard with the same name prior to name the current one
//         // Creating list of the dashboard names
//         const allDashboardsList = []
//         cy.get('avantra-sidebar-list-item').each(($el) => {
//             cy.get($el).invoke('text').then((txt) => {
//                 txt = txt.trim()
//                 allDashboardsList.push(txt)
//             })
//         })
//              .then(() => {
//         //Searching for the existing dashboard with the name we need

//             if (allDashboardsList.includes('OLS_name_check')) {
//                 cy.log('Dashboard already exists, deleting old dashboard: OLS_name_check')
//                cy.get('avantra-sidebar-list-item').contains('OLS_name_check').trigger('mouseover')
//                 cy.get('avantra-sidebar-list-item').contains('OLS_name_check').siblings('.sidebar-list-item__menu-button')
//                 .click({ force: true })

//                 //click Delete on menu appeared
//                 cy.get('.mat-menu-item').contains('Delete').click()
//                 //pop-up confirmation: confirm deletion
//                 cy.get('[class="confirmation-modal"]').within(() => {
//                     cy.contains('Yes').click()
//                 })
//                 //Verify the dashboard is deleted
//                 cy.contains('a', 'OLS_name_check').should('not.exist')
                
//             }
//             else { 
//                 cy.contains('a', 'OLS_name_check').should('not.exist')
//                  cy.log('Dashboard is not existing')
//             }

//              })
//              cy.wait(300)
//              cy.get('.dashboard-modify__header-input').type('OLS_name_check')
//              cy.wait(3000)
//         cy.get('.sub-header').within(() => {
//             cy.get('[mattooltip="Save"]')
//                 .within(() => {
//                     cy.get('.icon-button__text')
//                         .click({ force:true })
//                 })

//         })
//         cy.wait(3000)

//ADMINISTRATIVE
let dashboardName;
//ADMINISTRATIVE
// works:27.10
xit("Dashboard creation and Business Service Node adding", () => {
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
            cy.wait(600)
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
    cy.wait(800)
    cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
cy.wait(800)
cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
            cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })
            
        cy.get('.updated-at__time').wait(500).should('have.text', 'less than a minute ago')
})
// works 27.10
xit("Business Service Node editing", () => {
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
            // cy.get('[role="listbox"]'). within(() => {
                cy.get('[role="listbox"] .ng-star-inserted').contains('5 minutes').click()
            // })
            
            cy.wait(300)
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
//works 27.10
xit("Logbook Activities creation", () => {
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
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
    cy.wait(800)
cy.get('.sub-header').within(() => {
    cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
})
cy.wait(800)
cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.log(dashname)
        .then(() => {
            dashboardName = dashname;
        })
        cy.wait(1000)
    })
    // works 27.10
xit("Logbook Activities editing", () => {
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
    // works: 28.10
xit("Check For Updates creation", () => {
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
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
        cy.wait(800)
    cy.get('.sub-header').within(() => {
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
    })
    cy.wait(800)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })

})
// works: 28.10
 xit("Check For Updates editing", () => {
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
 
    // works:28.10
xit("Signed in Users creation", () => {

        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
            cy.wait(2000)
            cy.get('.drawer__header').children('.drawer__header__add-button').click();
            cy.wait(1000)
            cy.get('.dashboard-modify__header-input').clear();
            //timestamp dashboard name               
                    var stamp=Date.now();
                    const dashname = `OLS_sign_in${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    
            cy.get('.dashboard-modify__add-dashlet').click();
        cy.get('.dashlet-selector-item__title').contains('Signed in Users').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Signed in Users"]').clear().type("Signed_in_Users_ols")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
    cy.wait(600)
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
        cy.wait(800)
    cy.get('.sub-header').within(() => {
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
    })
    cy.wait(800)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.log(dashname)
        .then(() => {
            dashboardName = dashname;
        })
        cy.wait(1000)

})
//works: 31.10
xit("Signed in Users editing created", () => {
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
        .wait(2000).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(5000)
                .click() 
            cy.wait(2000)
            cy.get('.ng-star-inserted').contains('Signed_in_Users_ols').parents('.avantra-dashlet__header')
                    .within (() =>{
                        cy.get('[mattooltip="Dashlet Settings"]')
                            .wait(2000)
                            .click()
                            cy.wait(5000)
                    })
           
            cy.get('[placeholder="Signed in Users"]').clear().type("Signed_in_Users_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').type("Autotest_edited")
            cy.wait(600)
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            cy.get('[role="listbox"]'). within(() => {
                cy.get('.ng-star-inserted').contains('1 minute').click()
            })
            
            cy.wait(300)
            cy.get('.sub-header').within(() => {
                cy.get('[mattooltip="Save"]').click()
            })
            cy.wait(600)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
//CHECKS
works:31.10
xit("Multi RTM Status creation", () => {
    cy.get('.drawer__header__title').should('have.text', 'Dashboards')
    cy.wait(2000)
    cy.get('.drawer__header').children('.drawer__header__add-button').click();
    cy.wait(1000)
    cy.get('.dashboard-modify__header-input').clear();
    //timestamp dashboard name               
            var stamp=Date.now();
            const dashname = `Ols_multi_rtm${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    cy.get('.dashboard-modify__add-dashlet').click();
    cy.get('.dashlet-selector-item__title').contains('Multi RTM Status').parent()
    .within (() =>{
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    })
    cy.get('[placeholder="Multi RTM Status"]').type("Multi_RTM_Status_ols")
    cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
    cy.wait(600)
    cy.get('[placeholder="Select Check Selector"]').click(). within(() => 
{
    cy.get('[role="listbox"]').contains('ols_all_new').click()
})
cy.wait(600)
cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
cy.wait(800)
cy.get('.sub-header').within(() => {
cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
})
cy.wait(800)
cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
            cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })
            cy.wait(1000)

})
//works: 31.10
xit("Multi RTM Status editing", () => {
    cy.wait(600)
    cy.get('.navigation-list-item').contains('a', dashboardName)
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
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited")
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
            cy.get('.ng-star-inserted').contains('ABAP Systems').click()
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
xit("RTM Check creation", () => {

    cy.get('.drawer__header__title').should('have.text', 'Dashboards')
    cy.wait(2000)
    cy.get('.drawer__header').children('.drawer__header__add-button').click();
    cy.wait(1000)
    cy.get('.dashboard-modify__header-input').clear();
    //timestamp dashboard name               
            var stamp=Date.now();
            const dashname = `Ols_rtm_check${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
    cy.get('.dashlet-selector-item__title').contains('RTM Check').parent()
    .within (() =>{
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    })
    cy.get('[placeholder="RTM Check"]').type("RTM _check_ols")
    cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
    cy.wait(600)
    cy.get('.dashlet-settings__param--title').contains('System').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('System').parent('.dashlet-settings__param').within(() =>{
            cy.get('ng-dropdown-panel').contains('ggbvrd-sybsa1_SA1_00').click()
        })
   cy.wait(600)
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
    cy.wait(800)
cy.get('.sub-header').within(() => {
    cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
})
cy.wait(800)
cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })
})
xit("RTM Check editing created", () => {
    cy.wait(600)
    cy.get('.navigation-list-item').contains('a', dashboardName)
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
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited")
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
// test works: 01.11
xit("Multiple System Overview creation", () => {

    cy.get('.drawer__header__title').should('have.text', 'Dashboards')
    cy.wait(2000)
    cy.get('.drawer__header').children('.drawer__header__add-button').click();
    cy.wait(1000)
    cy.get('.dashboard-modify__header-input').clear();
    //timestamp dashboard name               
            var stamp=Math.round(+new Date()/1000);
            const dashname = `Ols_multisys_ovw${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    cy.get('.dashboard-modify__add-dashlet').click();
    cy.get('.dashlet-selector-item__title').contains('Multiple System Overview').parent()
    .within (() =>{
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    })
    cy.get('[placeholder="Multiple System Overview"]').type("Multiple_System_Overview_ols")
    cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
    cy.wait(600)
    cy.get('avantra-dashlet-settings-system-predefined').click()
    cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('ABAP Systems').click()
    })
    cy.wait(600)
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
        cy.wait(800)
    cy.get('.sub-header').within(() => {
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
    })
    cy.wait(800)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    cy.log(dashname)
                .then(() => {
                    dashboardName = dashname;
                })
})
//  works: 03.11
xit("Multiple System Overview editing created - 1- Category", () => {
    cy.reload()
    cy.wait(600)
    cy.get('.navigation-list-item').contains('a', dashboardName)
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
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_Category")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_Category")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]'). within(() => {
            cy.get('.ng-star-inserted').contains('1 minute').click()
        })
        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
    cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
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
    cy.wait(2000)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
// works: 03.11
xit("Multiple System Overview editing created - 2 - Individual", () => {
    cy.reload()
    cy.wait(600)
    cy.get('.navigation-list-item').contains('a', dashboardName)
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
       
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_individual")
        cy.wait(600)
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_individual")

        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('ABAP Systems').click()
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

        
        cy.wait(800)
    cy.get('.sub-header').within(() => {
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
    })
    cy.wait(2000)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
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
        cy.get('.avantra-drawer__content').within (() =>{
            cy.get('.avantra-dashlet__header').wait(600)
                .within (() =>{
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
    cy.get('.avantra-drawer__content').within (() =>{
        cy.get('.avantra-dashlet__header').wait(600)
            .within (() =>{
            cy.get('[mattooltip="Dashlet Settings"]')
    .click()
    })
}) 
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_checksel")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_checksel")
        cy.wait(600)
        
        
        cy.wait(800)
    cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() =>{
        cy.get('.ng-star-inserted').contains('Avantra Servers').click()
    })
    cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
    cy.get('[role="listbox"]'). within(() => {
        cy.get('.ng-star-inserted').contains('10 seconds').click()
    })
        cy.get('#checkSelectorId').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('#checkSelectorId').should('be.checked')

        cy.get('.ng-placeholder').contains('Select check').parents('.ng-select-container').click()
        cy.get('[placeholder="Select check"]').within(() =>{
            cy.get('.ng-star-inserted').contains('ols-rtm').click()
        })
                
        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.wait(800)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
})
//SAP HotNews. Not encountered: changing the SAP notes priority, pages number 1<...<4
// gotham: SAP backbone to configure
it("SAP HotNews creation", function() {

    cy.get('.drawer__header__title').should('have.text', 'Dashboards')
    cy.wait(2000)
    cy.get('.drawer__header').children('.drawer__header__add-button').click();
    cy.wait(1000)
    cy.get('.dashboard-modify__header-input').clear();
    //timestamp dashboard name               
            var stamp=Math.round(+new Date()/1000);
            const dashname = `Ols_hotnews${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
    cy.get('[placeholder="Search Dashlet"]').within(() => {
       cy.get('input').type('sap')
    })
    cy.wait(200)
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
    cy.get('[aria-label="avantra-table"]').find('tr').should('have.length', 4)
    //For pages more than 1
    cy.get('@pageNum').then((pageNum) => {
        if(pageNum>1){
            cy.log("Pages MORE than one!!Number: ", pageNum)
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
                    cy.log('Number for 100 per page:', hundredPageNum)
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
            cy.log("ONE page assertion!!!")
            cy.get('[aria-label="Next page"]').should('have.class', 'mat-button-disabled')
            cy.get('[aria-label="Last page"]').should('have.class', 'mat-button-disabled')
            
        }
        })
    
    cy.wait(600)
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
    cy.wait(800)
    cy.get('.sub-header').within(() => {
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
    })
    cy.wait(800)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    cy.log(dashname)
                .then(() => {
                    dashboardName = dashname;
                })

})

// //Predictive Resource Planning
xit("Predictive Resource Planning creation", () => {

    cy.get('.drawer__header__title').should('have.text', 'Dashboards')
    cy.wait(2000)
    cy.get('.drawer__header').children('.drawer__header__add-button').click();
    cy.wait(1000)
    cy.get('.dashboard-modify__header-input').clear();
    //timestamp dashboard name               
            var stamp=Math.round(+new Date()/1000);
            const dashname = `Ols_prp${stamp}`
            cy.get('.dashboard-modify__header-input').type(dashname)
    cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
    cy.get('.dashlet-selector-item__title').contains('Predictive Resource Planning').parent()
    .within (() =>{
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    })
    cy.get('[placeholder="Predictive Resource Planning"]').type("Predictive_Resource_Planning_ols")
    cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
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
    cy.get('.dashlet-add__stepper').within(() => {
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    })
    cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
        cy.wait(800)
    cy.get('.sub-header').within(() => {
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
    })
    cy.wait(800)
    cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    cy.log(dashname)
                .then(() => {
                    dashboardName = dashname;
                })

})

//Current Time

})

