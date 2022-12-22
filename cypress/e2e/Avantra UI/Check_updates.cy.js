/// <reference types="cypress" />


describe("Check for updates: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    before(function () {
        cy.fixture("Credentials").as("creds")
    })
    beforeEach(function () {
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.fixture("Credentials").as("creds")
        cy.get("@creds").then((creds) => {
            let envServer = creds.env;
            let localUser = creds.login;
            let passwd = creds.password;
            cy.Login_Session(localUser, envServer, passwd)
            cy.visit(creds.env)
        })
        
    })
    let dashboardName;
    let table = []
  
    after(() => {
        // delete dashboard
        cy.wait(10000)

        cy.contains(dashboardName).realHover()
        cy.get('.navigation-list-item').contains(dashboardName)
            .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })

        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Delete').click({ force: true });
        })
        cy.get('.confirmation-modal__btn-group [type="submit"]').contains('Delete').click({ force: true });
        cy.wait(800)
        cy.get('.mat-simple-snack-bar-content').should("have.text", 'Successfully deleted')
        cy.contains('a', dashboardName).should('not.exist')

    })
    it("Check for updates creation", function () {

        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(2000)
        cy.get('.drawer__header').children('.drawer__header__add-button').click();
        cy.wait(1000)
        cy.get('.dashboard-modify__header-input').clear();
        //timestamp dashboard name               
        var stamp = Math.round(+new Date() / 1000);
        const dashname = `Ols_cfu${stamp}`
        cy.get('.dashboard-modify__header-input').type(dashname)
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
        cy.get('.dashlet-selector-item__title').contains('Check For Updates').siblings('.dashlet-selector-item__button').click()

        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').type("Autotest")
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
    it("Check for updates assertions created", function () {

        cy.wait(800)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(2000).click()
        cy.get('.mat-card-title').should('have.text', 'Check For Updates')
        table = ['Avantra Server', '23.0.4', '23.0.3', 'Avantra Agent', '23.0.4.1117', '23.0.3']
        let tableValues = []
        cy.get('.mat-row avantra-string-cell .mat-tooltip-trigger').each(($el) => {
            cy.get($el).invoke('text').then((text) => {
                let txtValues = text.trim()
                tableValues.push(txtValues)
            })
        })
        cy.wrap(tableValues).then(() => {
            if (JSON.stringify(tableValues.sort()) === JSON.stringify(table.sort())) {
                cy.log('Table is verified!')
            }
        })
    })






})
