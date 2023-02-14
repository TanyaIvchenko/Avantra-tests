describe("SAP HotNews: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    beforeEach(function () {
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.fixture("Credentials")
            .then((creds) => {
                this.creds = creds
                cy.loginSession(this.creds.login, this.creds.env, this.creds.password)
                cy.visit(creds.env)

            })
        cy.fixture("Dashboards").then((dashboardsData) => {
            this.dashboardsData = dashboardsData
        })
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })
        cy.fixture("HotNews").then((hotNewsData) => {
            this.hotNewsData = hotNewsData
        })

    })
    let dashboardName;

    after(function () {
        // delete dashboard
        cy.wait(5000)

        cy.contains(dashboardName).realHover()
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains(dashboardName)
            .siblings('.navigation-list-item__menu-button')
            .invoke('show')
            .click({ force: true })

        cy.wait(1000)
        dashboards.elements.getQuickActionsMenu().within(() => {
            dashboards.clickQuickDeleteDashboard()
        })
        dashboards.submitModalDashboardDelete()
        cy.wait(800)
        dashboards.elements.getHeaderMessage().should("have.text", this.dashboardsData.successfulDeletion)

    })
    it("Logbook Activities creation", () => {
        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(1000)
        cy.get('.drawer__header').children('.drawer__header__add-button').click();
        cy.wait(1000)
        cy.get('.dashboard-modify__header-input').clear();
        //timestamp dashboard name               
        var stamp = Date.now();
        const dashname = `OLS_lb_act${stamp}`
        cy.get('.dashboard-modify__header-input').type(dashname)

        cy.get('.dashboard-modify__add-dashlet').click();
        cy.get('.dashlet-selector-item__title').contains('Logbook Activities').parent()
            .within(() => {
                cy.get('.dashlet-selector-item__button').wait(2000).click()
            })
        cy.get('[placeholder="Logbook Activities"]').clear().type("Logbook_ols")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
        cy.wait(600)
        cy.get('.dashlet-add__stepper').within(() => {
            cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"]').click()
        })
        cy.wait(600)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })
        cy.wait(1000)
    })
    // works 27.10
    it("Logbook Activities editing", () => {
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })

        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Edit').click();
        })
        //Findind and clicking Dashlet Setting button on dashlet
        cy.get('.ng-star-inserted').contains('Logbook_ols').parents('.avantra-dashlet__header')
            .within(() => {
                cy.get('[mattooltip="Dashlet Settings"]')
                    .wait(2000)
                    .click()
                cy.wait(5000)
            })

        cy.get('[placeholder="Logbook Activities"]').clear().type("Logbook_ols_edited")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').type("Autotest1")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]').within(() => {
            cy.get('.ng-star-inserted').contains('10 minutes').click()
        })

        cy.wait(300)
        cy.get('.sub-header').within(() => {
            cy.get('[mattooltip="Save"]').click()
        })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')

    })
})