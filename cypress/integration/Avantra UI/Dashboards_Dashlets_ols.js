/// <reference types="cypress" />

describe("Dashlets and dashboards", { defaultCommandTimeout: 5000 },() => {
    before(function () {
        cy.fixture("Admin_dashlets").as("admDashJson")
        cy.fixture("Credentials").as("creds")
    })
    beforeEach(() => {

        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
            cy.wait(5000)
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
        })
    })

    //test works
    it("Save the dashboard with dashlet added", () => {
        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
        cy.get('.dashboard-modify__header-input').clear();
        cy.get('.dashboard-modify__header-input').type('OLS13');
        cy.get('.dashboard-modify__add-dashlet').click();
        cy.get(':nth-child(2) > :nth-child(1) > avantra-dashlet-selector-item > .dashlet-selector-item > .dashlet-selector-item__button').click();
        cy.get('.dropdown-group > :nth-child(1) > .mat-tooltip-trigger > .select > #undefined > .ng-select-container > .ng-arrow-wrapper').click();
        cy.get('.ng-dropdown-panel').within(() => {
            // cy.get('#ad267ff583a0-6')
            cy.get('.ng-star-inserted').contains('BS_REL_8').click({ force:true })
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
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })

    //the draft of deleting test
    // it("Cancel delete and submit delete of the dashboard", () => {
    //     //Cancel
    //     cy.contains('a', 'OLS3').parent('[class="sidebar-list-item"]').within(() => {
    //         cy.get('[class="mat-menu-trigger sidebar-list-item__menu-button ng-star-inserted"]').click({ force: true })
    //     })
    //     //click Delete on menu appered
    //     cy.get('[iconpath="assets/media/icons/shared/menu-remove.svg"]').click()
    //     //pop-up confirmation: cancel
    //     cy.get('[class="confirmation-modal"]').within(() => {
    //         cy.contains('No').click()
    //     })
    //     //Delete
    //     cy.contains('a', 'OLS3').parent('[class="sidebar-list-item"]').within(() => {
    //         cy.get('[class="mat-menu-trigger sidebar-list-item__menu-button ng-star-inserted"]').click({ force: true })
    //     })
    //     //click Delete on menu appered
    //     cy.get('[iconpath="assets/media/icons/shared/menu-remove.svg"]').click()
    //     //pop-up confirmation: confirm deletion
    //     cy.get('[class="confirmation-modal"]').within(() => {
    //         cy.contains('Yes').click()
    //     })
    //     //Verify the dashboard is deleted
    //     cy.contains('a', 'OLS3').should('not.exist')
    // });

    //test doesn't work
    //Dashlets selecting
    it.only("Dashlets Categories", () => {
        cy.get("@admDashJson").then((admDashJson) => {
            for (let i = 0; i < admDashJson.length; i++) {
                
                cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
                cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
                cy.get('.dashboard-modify__header-input').clear();
                cy.get('.dashboard-modify__header-input').type(admDashJson[i].type);
                cy.get('.dashboard-modify__add-dashlet').wait(2000).click();
                cy.wait(600)

                //Verify the names of Categories
                cy.get('.dashlet-selector-categories').within(() => {
                    cy.get('.wrapper__item').invoke('text').then((txt) => {
                        if (txt = admDashJson[i].type) {
                            cy.log('Category name verified:', txt)
                        }
                        else { }
                    })
                })
                cy.get('.dashlet-selector-categories').within(() => {
                    cy.get('.wrapper__item').contains(admDashJson[i].type).click()
                })
                //verify the correct category entered
                cy.get('.dashlet-selector__sub-title').should('have.text', admDashJson[i].type + " Dashlets")

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
                cy.get('.header__edit-block > .btn-group__item > .icon-button > .background-undefined').click({ force: true })
                cy.wait(500)
                cy.get('.btn-group > [iconpath="assets/media/icons/shared/menu-close.svg"] > .icon-button > .background-undefined').click()
            }
            })
        })
        //test under construction
    it("ALL Dashlets Categories", () => {
        cy.get("@admDashJson").then((admDashJson) => {
            cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
            cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
            cy.get('.dashboard-modify__header-input').clear();
            cy.get('.dashboard-modify__header-input').type("ALL_Dashlets");
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


    //test works!
    it('Deleting cancel and ok', function () {
        cy.get(':nth-child(32) > .sidebar-list-item > .sidebar-list-item__text').trigger('mouseover')
        cy.get(':nth-child(32) > .sidebar-list-item > .mat-tooltip-trigger > .menu-button__icon').click({ force: true })
        cy.get(':nth-child(2) > avantra-button > .icon-button > .background-undefined > svg').click();
        cy.get('.mat-dialog-actions > [backgroundcolor="primary"] > .background-primary > .button__text').click();
        cy.get('.mat-dialog-actions > [backgroundcolor="primary"] > .background-primary > .button__text').contains('No').click({ force: true });
        cy.get(':nth-child(32) > .sidebar-list-item > .sidebar-list-item__text').trigger('mouseover')
        cy.get(':nth-child(32) > .sidebar-list-item > .mat-tooltip-trigger > .menu-button__icon').click({ force: true })
        cy.get(':nth-child(2) > avantra-button > .icon-button > .background-undefined > svg').click();
        cy.get('.background-action > .button__text').contains('Yes').click({ force: true });
        cy.contains('a', 'OLS11').should('not.exist')
    });
})