/// <reference types="cypress" />

describe("Dashlets", () => {
    beforeEach(() => {
            const login = "Olha_test";
            const password = "Olha1605";
        cy.visit ("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
        cy.get('#input-login-id').type(login)
        cy.get('#input-password-id').type(password)
        cy.get('.background-primary').contains("Login to Avantra").click()
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
            cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text','Dashboards')
            cy.get('.sidebar-list__header > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
            cy.get('.dashboard-modify__header-input').clear();
            cy.get('.dashboard-modify__header-input').type('Administrative-ols');
            cy.get('.dashboard-modify__add-dashlet').click();
            cy.wait(2000)
    //Log each element of dashlet categories
            cy.get('[class="dashlet-selector-categories"]').within(() => {
                cy.get('[class="dashlet-selector-categories__item ng-star-inserted"]').each(($el) =>{
                    cy.get($el).invoke('text').then(cy.log)
                })

            })
            cy.contains('Administrative').click()
    //verify the correct category entered
            cy.get('.dashlet-selector__sub-title').should('have.text', "Administrative Dashlets")
    //Verify the number of items
            cy.get('.dashlet-selector-item__title').should('have.length', 4)
    //Verify the list of dashlet names
            cy.get('.dashlet-selector-item__title').then(($els) => {
               return (
               Cypress.$.makeArray($els)
               .map((el) => el.innerText)
               )
            })
            .should('deep.equal', ['Signed in Users', 'Check For Updates', 'Logbook Activities', 'Business Service Node'])
    //Verify the Dashlet description one by one
                cy.get('.dashlet-selector-item__title').each(($el, index, $list) =>{
                    if($el.text().includes('Signed in Users')){
                        cy.get($el).parent().within(() =>{
                            cy.get('.dashlet-selector-item__content--description-text').contains('Show number of users signed in to Avantra')
                            .invoke('text').then(cy.log)
                        })
                    }
                    else if($el.text().includes('Check For Updates')){
                        cy.get($el).parent().within(() =>{
                            cy.get('.dashlet-selector-item__content--description-text').contains('Show new Avantra updates which are available at syslink download site.')
                            .invoke('text').then(cy.log)
                        })
                    }
                    else if($el.text().includes('Logbook Activities')){
                        cy.get($el).parent().within(() =>{
                            cy.get('.dashlet-selector-item__content--description-text').contains('Show the number of Logbook activities')
                            .invoke('text').then(cy.log)
                        })
                    }
                    else {
                        cy.get($el).parent().within(() =>{
                            cy.get('.dashlet-selector-item__content--description-text').contains('Shows Result of a single node from a Business Service')
                            .invoke('text').then(cy.log)
                        })
                    }
    

            })
        });
    


})