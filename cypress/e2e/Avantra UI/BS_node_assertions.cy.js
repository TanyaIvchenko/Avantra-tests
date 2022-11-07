/// <reference types="cypress" />

describe("Dashlets and dashboards", { defaultCommandTimeout: 5000 }, () => {
    before(() => {
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
            cy.get('.drawer__header__title').wait(600).should('have.text', 'Dashboards')
            cy.wait(600)
        })
    })
    beforeEach(() => {

        // Preserve the Cookies
        
   Cypress.Cookies.preserveOnce('token', 'JSESSIONID');
        
        })
let dashboardName;


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
            let nodeText = 'BS_RELEASE'
            cy.get('.ng-dropdown-panel').within(() => {
            cy.get('.ng-dropdown-panel-items').contains(nodeText).click({ force:true })
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
            
        
        
        //Assertions:
        cy.get('mat-card-title').should('contain', 'Business Service Node')
        cy.get(".avantra-dashlet__headline").invoke('text')
            .then(txt => {
                cy.log(txt);
                expect(txt).to.include(nodeText);
        })
})

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
            cy.get('[placeholder="Business Service Node"]').type(dashboardName=dashboardName + "_edited")
            cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited")
            cy.wait(600)
            cy.get('[placeholder="Select Business Service"]').click()
            cy.get('.ng-dropdown-panel').within(() => {
                cy.get('.ng-star-inserted').contains('BS_RELEASE - Copy').click({ force:true })
                cy.wait(300)
            })
            cy.get('[placeholder="Select Business Service Node"]').click()
            let nodeText = 'Relevant Custom Checks';
            // cy.get('').within(() => {
                cy.get('.ng-dropdown-panel .ng-dropdown-panel-items').contains(nodeText).click({ force:true })
                cy.wait(300)
            // })
            cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
            // cy.get('[role="listbox"]'). within(() => {
                cy.get('[role="listbox"] .ng-star-inserted').contains('5 minutes').click()
            // }) 
            cy.wait(300)
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
            cy.wait(300)
            cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        // Assertions:
        cy.log(dashboardName)
            cy.get('mat-card-title').should('contain', dashboardName)
            cy.get(".avantra-dashlet__headline").invoke('text')
            .then(txt => {
                cy.log(txt);
                expect(txt).to.include(nodeText);
        })
            cy.get('.avantra-dashlet__info').should('have.text', 'Checks')
                    // width and height are not correctly invoking!!!!
                    // cy.get('.highcharts-series rect').each(($el) => {    
                    //             cy.get($el).invoke('width').then(() =>{
                    //                 let elHeight = $el.width()
                    //                 cy.log(elHeight)
                    //                 if ( elHeight > 0 ){
                                        
                    //                     // cy.get($el).trigger('mouseover');
                    //                 }
                    //         })
                    // })
            cy.get('.status-card__content .status-card__content-names-status-count').each(($el) => {
                    cy.get($el).invoke('text').then((txt) => {
                        let txtCount = $el.text()
                        cy.log(txtCount)
                                if (txtCount >0){
                                    cy.get($el).siblings('.status-card__content-names-status-type')
                                }
                    })
                    // Допилить переход на график!!!!
            })
        })         
            
})