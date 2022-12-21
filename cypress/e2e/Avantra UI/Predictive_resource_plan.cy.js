/// <reference types="cypress" />


describe("Predictive resource planning: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
  before(() => {

    
    cy.fixture("Credentials").as("creds")
       
            cy.session('ols', () => {
            cy.get("@creds").then((creds) => {
            // DO NOT FORGET TO USE YOUR CREDS!!!!!!
            
                cy.visit(creds.env)
                cy.wait(600)
                cy.get('body').then((body) => {
                    if (body.find('#input-login-id').length > 0) {
                        cy.get('#input-login-id').type(creds.login)
                        cy.get('#input-password-id').type(creds.password)
                        cy.get('.background-primary').contains("Login to Avantra").click()
                        cy.wait(800)
                        cy.get('.drawer__header__title').wait(600).should('have.text', 'Dashboards')
                        cy.wait(600)
                    }
                    cy.visit('/xn/ui/main/dashboards')
                })
            })
         })

 })    
    beforeEach( function() {

        login('user')

        // Preserve the Cookies

        // Cypress.Cookies.preserveOnce('token', 'JSESSIONID');

    })
    let dashboardName;
    let labels = []
    // let rowNames = ['Note', 'Version', 'Title', 'Status', 'Date', 'Component', 'Cat.', 'Secur. Cat.', 'Relevant For']
    after(() => {
        // delete dashboard
        cy.wait(5000)
        // cy.get('.navigation-list-item')
        cy.contains(dashboardName).realHover()
        cy.get('.navigation-list-item').contains(dashboardName)
            .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })

        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Delete').click({ force: true });
        })
        cy.get('.confirmation-modal__btn-group [type="submit"]').contains('Delete').click({ force: true });
        cy.wait(600)
        cy.get('.mat-simple-snack-bar-content').should("have.text", 'Successfully deleted')
        cy.contains('a', dashboardName).should('not.exist')

    })
    it("Predictive resource planning creation", function () {

        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(2000)
        cy.get('.drawer__header').children('.drawer__header__add-button').click();
        cy.wait(1000)
        cy.get('.dashboard-modify__header-input').clear();
        //timestamp dashboard name               
        var stamp = Math.round(+new Date() / 1000);
        const dashname = `Ols_prp${stamp}`
        cy.get('.dashboard-modify__header-input').type(dashname)
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
        cy.get('.dashlet-selector-item__title').contains('Predictive Resource Planning').parent()
            .within(() => {
                cy.get('.dashlet-selector-item__button').wait(2000).click()
            })
        // cy.get('[placeholder="Predictive Resource Planning"]').type("Predictive_Resource_Planning_ols")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').type("Autotest")
        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('All Active Servers').click()
        })
        cy.get('span.dashlet-settings__param--title').contains('Resource Type').siblings('div.dashlet-settings__param--content')
            .click().wait(200)
        cy.get('[title="Server: Total Disk Size"]')
            .click().wait(200)
        cy.wait(600)
       cy.wait(300)
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
    it("Predictive resource planning assertions created", function () {
        labels = ['Last 2 months', 'Today', 'Next 6 months']
        let labelsNames = []
        cy.get('.highcharts-xaxis-labels span').each(($el) => {
            cy.get($el).invoke('text').then((text) => {
                let txtLabels = text.trim()
                labelsNames.push(txtLabels)
            })
        })
        cy.wrap(labelsNames).then(() => {
            if(JSON.stringify(labelsNames.sort()) === JSON.stringify(labels.sort())) {
                cy.log('Labels verified!')
            }
        })

    })
    it("Predictive resource planning editing", function () {
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(2000).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(5000)
            .click()
        cy.wait(2000)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header')
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })

        cy.get('[placeholder="Multi RTM Status"]').clear().type(dashboardName + "_edited")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]').within(() => {
            cy.get('.ng-star-inserted').contains('1 minute').click()
        })
        cy.wait(300)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('ols_mii').click()
        })
    })
})