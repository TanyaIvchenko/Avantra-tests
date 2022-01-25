/// <reference types="cypress" />

describe("Dashlets and dashboards", () => {
    before (function(){
        cy.fixture("Admin_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")
    })
    beforeEach(() => {
// DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) =>{      
            cy.visit ("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
        })
    })

it("Save the dashboard with dashlet added", () => {
    cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text','Dashboards')
    cy.get('.sidebar-list__header > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
    cy.get('.dashboard-modify__header-input').clear();
    cy.get('.dashboard-modify__header-input').type('OLS4');
    cy.get('.dashboard-modify__add-dashlet').click();
    cy.get(':nth-child(1) > app-dashlet-selector-item > .dashlet-selector-item > .dashlet-selector-item__button').click();
    cy.get('.header__edit-block > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
    cy.wait(3000)
    //get element within another element
    cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').within(() => {
        cy.get('[type="button"]').click()
    })
});


    it("Cancel delete and submit delete of the dashboard", () => {
//Cancel
    cy.contains('a', 'OLS3').parent('[class="sidebar-list-item"]').within(() => {
    cy.get('[class="mat-menu-trigger sidebar-list-item__menu-button ng-star-inserted"]').click({force:true})
    })
    //click Delete on menu appered
    cy.get('[iconpath="assets/media/icons/shared/menu-remove.svg"]').click()
    //pop-up confirmation: cancel
    cy.get('[class="confirmation-modal"]').within(() => {
        cy.contains('No').click()
    })
//Delete
    cy.contains('a', 'OLS3').parent('[class="sidebar-list-item"]').within(() => {
        cy.get('[class="mat-menu-trigger sidebar-list-item__menu-button ng-star-inserted"]').click({force:true})
    })
    //click Delete on menu appered
    cy.get('[iconpath="assets/media/icons/shared/menu-remove.svg"]').click()
    //pop-up confirmation: confirm deletion
    cy.get('[class="confirmation-modal"]').within(() => {
        cy.contains('Yes').click()
    })
//Verify the dashboard is deleted
    cy.contains('a', 'OLS3').should('not.exist')
        });

//Dashlets selecting
        it.only("Administrative Dashlets", () => {
            cy.get("@admDashJson").then((admDashJson) =>{
            
                cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text','Dashboards')
                cy.get('.sidebar-list__header > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
                cy.get('.dashboard-modify__header-input').clear();
                cy.get('.dashboard-modify__header-input').type(admDashJson[0].type[0]);
                cy.get('.dashboard-modify__add-dashlet').click();
                cy.wait(600)
    //Log each element of dashlet categories
                cy.get('[class="dashlet-selector-categories"]').within(() => {
                    cy.get('[class="dashlet-selector-categories__item ng-star-inserted"]').invoke('text').then ((txt) => {
                        if (txt=admDashJson[0].type[0]) {
                            cy.log('Category name verified:', txt)
                        }
                        else {}
                    })

                })
                cy.contains(admDashJson[0].type[0]).click()

    //verify the correct category entered
                cy.get('.dashlet-selector__sub-title').should('have.text', admDashJson[0].type[0] +" Dashlets")
            
    //Verify the number of items
                cy.get('.dashlet-selector-item__title').should('have.length', 4)

    //Verify the list of dashlet names and descriptions
            //JSON FILE!!!!
        
                cy.get('.dashlet-selector-item__title').each((item,index) => {
                    cy.wrap(item).should('contain.text', admDashJson[0].name[index]).parent()
                    .should('contain.text', admDashJson[0].descr[index])
                    cy.wrap(item).should('contain.text', admDashJson[0].name[index]).siblings('.dashlet-selector-item__content').invoke('text').then(cy.log)
                })
    
            })

        });
    


})