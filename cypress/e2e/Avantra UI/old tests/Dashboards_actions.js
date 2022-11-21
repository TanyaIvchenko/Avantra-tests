/// <reference types="Cypress" />


describe("Dashboards", () => {
    beforeEach(() => {
        cy.visit("https://eiger.dev.gcp.avantra.net:8443/xn/ui");
        cy.get('#input-login-id').type("Tanya admin")
        cy.get('#input-password-id').type("Tanya")
        cy.get('.custom-checkbox__checkmark').click()
        cy.get('.button').click()
    })

    it.only("Create and save Dashboard", () => {
        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
        cy.get('.dashboard-modify__header-input').clear();
        cy.get('.dashboard-modify__header-input').type('Tanya test');
        cy.get('.dashboard-modify__add-dashlet').click();
        cy.get(':nth-child(1) > app-dashlet-selector-item > .dashlet-selector-item > .dashlet-selector-item__button').click();
        cy.get('.header__edit-block > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
        cy.wait(3000)
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').within(() => {
            cy.get('[type="button"]').click()
        })
    })
    it("Administrative Dashlets", () => {
        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text','Dashboards')
        cy.get('.sidebar-list__header > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
        cy.get('.dashboard-modify__header-input').clear();
        cy.get('.dashboard-modify__header-input').type('Administrative-ols');
        cy.get('.dashboard-modify__add-dashlet').click();
        cy.wait(2000)
        // Logging each element of dashlet categories
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
    })

    it("Cancel delete and submit delete of the dashboard", () => {
        //Cancel
        cy.contains('a', 'Tanya test').parent('[class="sidebar-list-item"]').trigger('mouseover').within(() => {
            cy.get('[class="mat-menu-trigger sidebar-list-item__menu-button ng-star-inserted"]').click({ force: true })
        })
        //click Delete on menu appered
        cy.get('[iconpath="assets/media/icons/shared/menu-remove.svg"]').click()
        //pop-up confirmation: cancel
        cy.get('[class="confirmation-modal"]').within(() => {
            cy.contains('No').click()
        })
        //Delete
        cy.contains('a', 'Tanya test').parent('[class="sidebar-list-item"]').trigger('mouseover').within(() => {
            cy.get('[class="mat-menu-trigger sidebar-list-item__menu-button ng-star-inserted"]').click({ force: true })
        })
        //click Delete on menu appeared
        cy.get('[iconpath="assets/media/icons/shared/menu-remove.svg"]').click()
        //pop-up confirmation: confirm deletion
        cy.get('[class="confirmation-modal"]').within(() => {
            cy.contains('Yes').click()
        })
        //Verify the dashboard is deleted
        cy.contains('a', 'Tanya test').should('not.exist')
    });
})
