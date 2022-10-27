/// <reference types="cypress" />

describe("Dashlets and dashboards", { defaultCommandTimeout: 5000 },() => {
    beforeEach(() => {
        cy.fixture("List_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit(creds.env)
            cy.wait(2000)
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
        })
    })

    //TEST WORKS:26.10
    it("Save the dashboard with dashlet added", () => {
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
    })



    //TEST WORKS:26.10
    //Dashlets selecting
    it("Dashlets Categories", () => {
        cy.get("@admDashJson").then((admDashJson) => {
            cy.get('.drawer__header__title').should('have.text', 'Dashboards')
            cy.get('.drawer__header').children('.drawer__header__add-button').wait(600).click();
            cy.get('.dashboard-modify__add-dashlet').wait(2000).click();
            cy.wait(600)
            for (let i = 0; i < admDashJson.length; i++) {
                
                //Verify the names of Categories
                cy.get('.dashlet-selector-categories').invoke('text').then
                cy.get('.dashlet-selector-categories__wrapper').within(() => {
                    cy.get('.wrapper__item').invoke('text').then((txt) => {
                        if (txt = admDashJson[i].type) {
                            cy.log('Category name verified:', txt)
                        }
                        else { 
                        }
                    })
                })
                cy.get('.dashlet-selector-categories').within(() => {
                    cy.get('.wrapper__item').contains(admDashJson[i].type).click()
                })
                //verify the correct category entered
                cy.get('.dashlet-selector__sub-title').should('have.text', " " + admDashJson[i].type + " Dashlets")

                //Verify the number of items
                cy.get('.dashlet-selector-item__title').should('have.length', admDashJson[i].name.length)

                //Verify the list of dashlet names and descriptions
                //JSON FILE!!!!

                cy.get('.dashlet-selector-item__title').each((item, index) => {
                    cy.wrap(item).should('contain.text', admDashJson[i].name[index]).siblings('.dashlet-selector-item__content')
                        .should('contain.text', admDashJson[i].descr[index])
                    cy.wrap(item).should('contain.text', admDashJson[i].name[index]).siblings('.dashlet-selector-item__content').invoke('text').then(cy.log)
                })


                //Go back to Dashboards
                
            }
            cy.get('.header__edit-block > .mat-tooltip-trigger > .icon-button > .background-secondary > svg').click({ force: true })
                cy.wait(500)
                cy.get('.background-secondary > svg').click()
            })
        })
        //TEST WORKS:26.10
    it("ALL Dashlets Categories", () => {
        cy.get("@admDashJson").then((admDashJson) => {
            cy.get('.drawer__header__title').should('have.text', 'Dashboards')
            cy.get('.drawer__header').children('.drawer__header__add-button').wait(600).click();
            
            cy.get('.dashboard-modify__header-input').clear();
            const dashid = () => Cypress._.random(0, 1e6)
                const did = dashid()
                const alldashname = `OLS_bs_node${did}`
            cy.get('.dashboard-modify__header-input').type(alldashname);
            cy.get('.dashboard-modify__add-dashlet').click();
            cy.wait(600)

            // Make one array of ALL dashlet names

            var allDashlets = []
            for (let i = 0; i < admDashJson.length; i++) {
                allDashlets = [].concat(allDashlets, admDashJson[i].name)
            }

            //Verify all dashlet names are present

            const allDashletsList = []
            cy.get('.dashlet-selector-item__title').each(($el) => {
                cy.get($el).invoke('text').then((txt) => {
                    txt = txt.trim()
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

            //Verify the number of dashlets is the same as within categories
            cy.get('.dashlet-selector__content').find('.dashlet-selector-item__title').should('have.length', allDashlets.length)
                .then(() => {
                    //Comparing two lists    
                    if (JSON.stringify(allDashlets.sort()) === JSON.stringify(allDashletsList.sort())) {
                        cy.log('All dashlets are present!')
                    }
                    else {
                        cy.log('Revise the dashlet names!!!')
                    }
                })
        })
    })


    //test works: 27.10
    it.only('Deleting cancel and ok', function () {
        cy.wait(5000)
        cy.get('.navigation-list-item').contains('copy-OLS_bs_node774377').invoke('show')
        .trigger('mouseenter')
        cy.get('.navigation-list-item').contains('copy-OLS_bs_node774377')
            .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })
            
        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Delete').click();
        })
        //cancelling
        cy.get('.confirmation-modal__btn-group').children('[type="button"]').contains('Cancel').click();
        cy.get('.navigation-list-item').contains('copy-OLS_bs_node774377').invoke('show')
        .trigger('mouseenter')
        cy.get('.navigation-list-item').contains('copy-OLS_bs_node774377')
            .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })
            
        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Delete').click();
        })
        cy.get('.confirmation-modal__btn-group').children('[type="submit"]').contains('Delete').click();
        cy.get('.mat-simple-snack-bar-content').should("have.text",'Successfully deleted')
        cy.contains('a', 'copy-OLS_bs_node774377').should('not.exist')
    });
})