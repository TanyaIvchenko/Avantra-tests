/// <reference types="cypress" />



describe("BS node create, assert, edit, assert, delete", { defaultCommandTimeout: 5000 }, () => {
    before(() => {
        cy.fixture("Credentials").as("creds")
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit(creds.env)
            cy.wait(600)
            cy.get('#input-login-id').type(creds.login)
            cy.get('#input-password-id').type(creds.password)
            cy.get('.background-primary').contains("Login to Avantra").click()
            cy.wait(600)
            cy.get('.drawer__header__title').wait(600).should('have.text', 'Dashboards')
            cy.wait(600)
        })
    })
    beforeEach(() => {

        // Preserve the Cookies

        Cypress.Cookies.preserveOnce('token', 'JSESSIONID');

    })
    let dashboardName;
    let nodeText;
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



    it("Dashboard creation and Business Service Node adding", () => {
        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(500)
        cy.get('.drawer__header').children('.drawer__header__add-button').click();
        cy.wait(500)
        cy.get('.dashboard-modify__header-input').clear();
        //timestamp dashboard name               
        var stamp = Date.now();
        const dashname = `OLS_bs_node${stamp}`
        cy.get('.dashboard-modify__header-input').type(dashname)

        cy.get('.dashboard-modify__add-dashlet').click();
        cy.contains('Business Service Node').siblings('.dashlet-selector-item .dashlet-selector-item__button').click();
        cy.get('[placeholder="Select Business Service"] span.ng-arrow-wrapper').click();
        nodeText = 'BS_RELEASE'
        cy.get('.ng-dropdown-panel .ng-dropdown-panel-items').contains(nodeText).click({ force: true })
        cy.wait(600)
        cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"] button').click({ force: true })
        cy.wait(800)
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"] button').click({ force: true })
        cy.wait(800)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })

    })
    it("Created dashboard assertions", () => {
        cy.get('mat-card-title').should('contain', 'Business Service Node')
        cy.get(".avantra-dashlet__headline").invoke('text')
            .then(txt => {
                cy.log(txt);
                expect(txt).to.include(nodeText);
            })
    })

    it("Business Service Node editing", () => {
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .click()
        cy.wait(500)
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(200)
            .click()
        cy.wait(500)
        //Findind and clicking Dashlet Setting button on dashlet
        cy.get('.ng-star-inserted').contains('Business Service Node').parents('.avantra-dashlet__header')
            .within(() => {
                cy.get('[mattooltip="Dashlet Settings"]')
                    .wait(200)
                    .click()
                cy.wait(500)
            })
        //Editing dashlet settings
        cy.get('[placeholder="Business Service Node"]').type(dashboardName + "_edited")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited")
        cy.wait(600)
        cy.get('[placeholder="Select Business Service"]').click()
        cy.get('.ng-dropdown-panel').within(() => {
            cy.get('.ng-star-inserted').contains('BS_RELEASE - Copy').click({ force: true })
            cy.wait(300)
        })
        cy.get('[placeholder="Select Business Service Node"]').click()
        nodeText = 'Relevant Custom Checks';
        cy.get('.ng-dropdown-panel .ng-dropdown-panel-items').contains(nodeText).click({ force: true })
        cy.wait(300)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"] .ng-star-inserted').contains('5 minutes').click()
        cy.wait(300)
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"] button').click({ force: true })
        cy.wait(300)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')



    })
    it("Assertions for edited: ", () => {
        cy.log(dashboardName)
        cy.get('mat-card-title').should('contain', dashboardName)
        cy.log('Node name is present')
        cy.get(".avantra-dashlet__headline").should('include.text', nodeText)
        cy.log('Checks title is present')
        cy.get('.avantra-dashlet__info').should('have.text', 'Checks')

        cy.get('.status-card__content .status-card__content-names-status-count').each(($el) => {
            cy.get($el).invoke('text').then(() => {
                let txtCount = $el.text()
                txtCount = parseInt(txtCount)
                // if checks count is more than 0, then verify the statuses
                if (txtCount > 0) {
                    cy.get($el).siblings('.status-card__content-names-status-type')
                        .invoke('text').then(text => {
                            let status = text.trim();
                            cy.log('status is: ' + status);
                            cy.get('.highcharts-series rect')
                                .then(() => {
                                    //  Verify the bars' colors are correct and visible (visisbility is not verified yet)
                                    if (status == "Ok") {
                                        cy.log('OK is present')
                                        cy.get('.highcharts-bar-series .highcharts-color-0').should('have.class', 'highcharts-color-0').and('be.visible')
                                        cy.get('.highcharts-bar-series .highcharts-color-0').realHover()

                                        // tooltip is visible
                                        cy.get('g.highcharts-label.highcharts-tooltip.highcharts-color-0').should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        cy.get('div.highcharts-label.highcharts-tooltip.highcharts-color-0 b')
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })

                                    } else if (status == "Warning") {
                                        cy.log('WARNING is present')
                                        cy.get('.highcharts-bar-series .highcharts-color-1').should('have.class', 'highcharts-color-1').and('be.visible')
                                        cy.get('.highcharts-bar-series .highcharts-color-1').realHover()

                                        // tooltip is visible
                                        cy.get('g.highcharts-label.highcharts-tooltip.highcharts-color-1').should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        cy.get('div.highcharts-label.highcharts-tooltip.highcharts-color-1 b')
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })
                                    } else if (status == "Critical") {
                                        cy.log('CRITICAL is present')
                                        cy.get('.highcharts-bar-series .highcharts-color-2').should('have.class', 'highcharts-color-2').and('be.visible')
                                        cy.get('.highcharts-bar-series .highcharts-color-0').realHover()

                                        cy.log('tooltip is visible')
                                        cy.get('g.highcharts-label.highcharts-tooltip.highcharts-color-2').should('be.visible')
                                        cy.log(txtCount)
                                        cy.log('tooltip number is the same as for checks')
                                        cy.get('div.highcharts-label.highcharts-tooltip.highcharts-color-2 b')
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })
                                    } else cy.log('Other status is present ' + status)
                                });

                        });
                } else {
                    // other numbers are greyed out
                    cy.get($el).should('have.class', 'grayscale')
                    cy.get($el).siblings('.status-card__content-names-status-type')
                        .invoke('text').then(text => {
                            let status = text.trim();
                            cy.log('status is: ' + status);
                            cy.get('.highcharts-series rect')
                                .then(() => {
                                    //  Verify the bars' colors are correct and visible (visisbility is not verified yet)
                                    if (status == "Ok") {
                                        cy.log('OK is NOT present')
                                        // cy.get('.highcharts-bar-series .highcharts-color-0').should('have.css', 'height', '0')
                                        // cy.log('css')
                                        cy.get('.highcharts-bar-series .highcharts-color-0').should('have.attr', 'height', '0')
                                        cy.log('attr')

                                    } else if (status == "Warning") {
                                        cy.log('WARNING is NOT present')
                                        cy.get('.highcharts-bar-series .highcharts-color-1').should('have.attr', 'height', '0')

                                    } else if (status == "Critical") {
                                        cy.log('CRITICAL is NOT present')
                                        cy.get('.highcharts-bar-series .highcharts-color-2').should('have.attr', 'height', '0')

                                    } else cy.log('Other status is found NOT visible ' + status)
                                });

                        });
                };
            })

        })
    })

})