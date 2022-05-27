describe("check the name and delete if exists", { defaultCommandTimeout: 5000 },() => {

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
        })
    })


    it("Save the dashboard: delete existing, save", () => {
        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();

        
        //Business Service Node
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
        cy.wait(500)
        cy.get('[placeholder="Select Business Service Node"]').click()
        cy.get('[placeholder="Select Business Service Node"]').within(() =>{
            cy.get('.ng-option').contains('achvcc-sapiq').click()
        })
        cy.wait(300)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[mattooltip="Save"]')
                .within(() => {
                    cy.get('.icon-button__text')
                        .click({ force:true })
                })
        })
        // Delete the dashboard with the same name prior to name the current one
        // Creating list of the dashboard names
        const allDashboardsList = []
        cy.get('avantra-sidebar-list-item').each(($el) => {
            cy.get($el).invoke('text').then((txt) => {
                txt = txt.trim()
                allDashboardsList.push(txt)
            })
        })
             .then(() => {
        //Searching for the existing dashboard with the name we need

            if (allDashboardsList.includes('OLS_name_check')) {
                cy.log('Dashboard already exists, deleting old dashboard: OLS_name_check')
               cy.get('avantra-sidebar-list-item').contains('OLS_name_check').trigger('mouseover')
                cy.get('avantra-sidebar-list-item').contains('OLS_name_check').siblings('.sidebar-list-item__menu-button')
                .click({ force: true })

                //click Delete on menu appeared
                cy.get('.mat-menu-item').contains('Delete').click()
                //pop-up confirmation: confirm deletion
                cy.get('[class="confirmation-modal"]').within(() => {
                    cy.contains('Yes').click()
                })
                //Verify the dashboard is deleted
                cy.contains('a', 'OLS_name_check').should('not.exist')
                
            }
            else { 
                cy.contains('a', 'OLS_name_check').should('not.exist')
                 cy.log('Dashboard is not existing')
            }

             })
             cy.wait(300)
             cy.get('.dashboard-modify__header-input').type('OLS_name_check')
             cy.wait(3000)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]')
                .within(() => {
                    cy.get('.icon-button__text')
                        .click({ force:true })
                })



        })
        cy.wait(3000)
        cy.get('.updated-at__time').wait(500).should('have.text', 'less than a minute ago')

    })
})