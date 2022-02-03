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
        it.only("Dashlets Categories", () => {
            cy.get("@admDashJson").then((admDashJson) =>{
            for ( let i=0; i < admDashJson.length; i++ ){        
                cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text','Dashboards')
                cy.get('.sidebar-list__header > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
                cy.get('.dashboard-modify__header-input').clear();
                cy.get('.dashboard-modify__header-input').type(admDashJson[i].type);
                cy.get('.dashboard-modify__add-dashlet').click();
                cy.wait(600)
    //Verify the names of Categories
                cy.get('[class="dashlet-selector-categories"]').within(() => {
                    cy.get('[class="dashlet-selector-categories__item ng-star-inserted"]').invoke('text').then ((txt) => 
                    // +text.replace(' ', '').trim());
                    {
                        if (txt=admDashJson[i].type) {
                            cy.log('Category name verified:', txt)
                        }
                        else {}
                    })
                cy.contains(admDashJson[i].type).click()

    //verify the correct category entered
                cy.get('.dashlet-selector__sub-title').should('have.text', admDashJson[i].type +" Dashlets")
            
    //Verify the number of items
                cy.get('.dashlet-selector-item__title').should('have.length', admDashJson[i].name.length)

    //Verify the list of dashlet names and descriptions
            //JSON FILE!!!!
        
                cy.get('.dashlet-selector-item__title').each((item,index) => {
                    cy.wrap(item).should('contain.text', admDashJson[i].name[index]).siblings('.dashlet-selector-item__content')
                    .should('contain.text', admDashJson[i].descr[index])
                    cy.wrap(item).should('contain.text', admDashJson[i].name[index]).siblings('.dashlet-selector-item__content').invoke('text').then(cy.log)
                })
                
    
        //Go back to Dashboards
                cy.get('.header__edit-block > .btn-group__item > .icon-button > .background-undefined').click({force:true})
                cy.wait(500)
                cy.get('.btn-group > [iconpath="assets/media/icons/shared/menu-close.svg"] > .icon-button > .background-undefined').click()

            }
            })
        });

        it.only("ALL Dashlets Categories", () => {
            cy.get("@admDashJson").then((admDashJson) =>{
                cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text','Dashboards')
                cy.get('.sidebar-list__header > app-button.ng-star-inserted > .icon-button > .icon-button__control > svg').click();
                cy.get('.dashboard-modify__header-input').clear();
                cy.get('.dashboard-modify__header-input').type("ALL_Dashlets");
                cy.get('.dashboard-modify__add-dashlet').click();
                cy.wait(600)

// Make one array of ALL dashlet names

            var allDashlets = []
            for (let i=0; i<admDashJson.length; i++) {
                allDashlets = []. concat(allDashlets, admDashJson[i].name)
                cy.log(allDashlets)
            }
                      
//Verify all dashlet names are present
 
            const allDashletsList = []
            cy.get('.dashlet-selector-item__title').each(($el) => {
                cy.get($el).invoke('text').then((txt)=> { 
                    allDashletsList.push(txt)
                })
            })
                .then((array) => cy.get(allDashletsList.sort()))

// list on ALL tab
            cy.wrap(allDashletsList)
                    .then((array) => cy.log('List on page', JSON.stringify(array)))

// list within categories
            cy.wrap(allDashlets.sort())
                    .then((array) => cy.log('List within categories', JSON.stringify(array)))
                .then(() => {

//Comparing two lists                    
            expect(allDashlets.sort()).to.equal(allDashletsList.sort()).then(cy.log('All dashlets are present!'))
                })

//Verify the number of dashlets is the same as within categories
            cy.get('.dashlet-selector__content').find('.dashlet-selector-item__title').should('have.length', allDashlets.length)
                


            })
        })
})