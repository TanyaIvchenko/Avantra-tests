describe("Dashlets and dashboards", { defaultCommandTimeout: 5000 },() => {

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


    it("Save the dashboard with dashlets + edit Multi RTM Status", () => {
        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();

        // Delete the dashboard with the same name prior to name the current one
        //Creating list of the dashboard names
    //     const allDashboardsList = []
    //     cy.get('avantra-sidebar-list-item').each(($el) => {
    //         cy.get($el).invoke('text').then((txt) => {
    //             txt = txt.trim()
    //             allDashboardsList.push(txt)
    //         })
    //     })
    //         .then((array) => cy.get(allDashboardsList.sort()))
    //     //Searching for the existing dashboard with the name we need
    //     .then((allDashboardsList) => {
    //     for (let i = 0; i < allDashboardsList.length; i++) { 
    //         cy.get('avantra-sidebar-list-item').each(($el) => {
    //             cy.get($el).invoke('text').then((txt) => {
    //                 txt = txt.trim()
    //             cy.log(txt)
    //         if (txt == "OLS_few_dashlets_added") {
    //             cy.log('Dashboard already exists, deleting old dashboard', txt)
    //             cy.contains('a', txt).parent('.sidebar-list-item').trigger('mouseover')
    //             cy.contains('a', txt).parent('.sidebar-list-item').within(() => {
    //                 cy.get('button').click({ force: true })
    //             })
    //             //click Delete on menu appeared
    //             cy.get('button').contains('Delete').parents('.mat-focus-indicator').click()
    //             //pop-up confirmation: confirm deletion
    //             cy.get('[class="confirmation-modal"]').within(() => {
    //                 cy.contains('Yes').click()
    //             })
    //             //Verify the dashboard is deleted
    //             cy.contains('a', 'OLS_few_dashlets_added').should('not.exist')
                
    //         }
    //         else { }
    //     })
    // })
    // }
    
// })



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
        //Logbook activities
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click();
        cy.get('.dashlet-selector-item__title').contains('Logbook Activities').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Logbook Activities"]').clear().type("Logbook_ols")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        //Check For Updates
        cy.get('*[class="sidebar-list__title ng-star-inserted"]').should('have.text', 'Dashboards')
        cy.get('.sidebar-list__header > .mat-tooltip-trigger > .icon-button > .background-undefined').click();
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
        cy.get('.dashlet-selector-item__title').contains('Check For Updates').parent()
        .within (() =>{
            cy.get('.dashlet-selector-item__button').wait(2000).click()
        })
        cy.get('[placeholder="Check For Updates"]').clear().type("Check_For_Updates_ols")
        cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.wait(300)
        //Signed in Users
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
        cy.wait(300)
        //Multi RTM Status
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
        //RTM Check
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
            cy.get('ng-dropdown-panel').contains('golf_SMA_00').click()
        })
    cy.wait(600)
    cy.get('.dashlet-add__stepper').within(() => {
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
    })
    cy.wait(300)
    cy.get('.dashboard-modify__header-input').type('OLS_few_dashlets_added_test')
    cy.wait(300)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]')
                .within(() => {
                    cy.get('.icon-button__text')
                        .click({ force:true })
                })

        })
        cy.wait(3000)
        cy.get('.updated-at__time').wait(500).should('have.text', 'less than a minute ago')

    //Editing Multi RTM Status
            cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
                .wait(5000)
                .click() 
            cy.wait(2000)
            cy.get('mat-card-title').contains('Multi_RTM_Status_ols').parents('.avantra-dashlet__header').within(() =>{
            cy.get('[mattooltip="Dashlet Settings"]')
            .click()
             })
            cy.get('[placeholder="Multi RTM Status"]').clear().type("Multi_RTM_Status_ols_edited")
            cy.get('[formcontrolname="subtitle"]').children('input').clear().type("Autotest_edited")
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
})