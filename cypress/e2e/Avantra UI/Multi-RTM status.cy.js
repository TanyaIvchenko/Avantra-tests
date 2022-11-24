/// <reference types="cypress" />


describe("Multi-RTM status: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    before(() => {
        cy.fixture("Credentials").as("creds")
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit(creds.env)
            cy.wait(600)
            cy.get('body').then((body) => {
                if (body.find('#input-login-id').length > 0) {
                    cy.get('#input-login-id').type(creds.login)
                    cy.get('#input-password-id').type(creds.password)
                    cy.get('.background-primary').contains("Login to Avantra").click()
                    cy.wait(600)
                    cy.get('.drawer__header__title').wait(600).should('have.text', 'Dashboards')
                    cy.wait(600)
                }
            })
        })
    })
    beforeEach(() => {
        cy.fixture("systems-instances").as("inventory")
        // Preserve the Cookies

        Cypress.Cookies.preserveOnce('token', 'JSESSIONID');
        
    })
    let dashboardName;
    let checkSelector
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
    it("Multi RTM Status creation", () => {
        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(2000)
        cy.get('.drawer__header').children('.drawer__header__add-button').click();
        cy.wait(1000)
        cy.get('.dashboard-modify__header-input').clear();
        //timestamp dashboard name               
        var stamp = Date.now();
        const dashname = `Ols_multi_rtm${stamp}`
        cy.get('.dashboard-modify__header-input').type(dashname)
        cy.get('.dashboard-modify__add-dashlet').click();
        cy.get('.dashlet-selector-item__title').contains('Multi RTM Status').parent()
            .within(() => {
                cy.get('.dashlet-selector-item__button').wait(2000).click()
            })
        cy.get('[placeholder="Multi RTM Status"]').type("Multi_RTM_Status_ols")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
        cy.wait(600)
        checkSelector = "ols_all_new"
        cy.get('[placeholder="Select Check Selector"]').click().within(() => {
            cy.get('[role="listbox"]').contains(checkSelector).click()
        })
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
        cy.wait(1000)

    })
    //works: 31.10
    it("Created dashboard assertions", () => {
        cy.get('mat-card-title').should('contain', 'Multi_RTM_Status')
        cy.get(".avantra-dashlet__headline").invoke('text')
            .then(txt => {
                cy.log(txt);
                expect(txt).to.include(checkSelector);
            })
            



        cy.log('Check selector is present')
        cy.get(".avantra-dashlet__headline").should('include.text', checkSelector)
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
                                        cy.get('.highcharts-bar-series .highcharts-color-2').realHover()

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
    it("Multi RTM Status editing", () => {
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


        cy.get('avantra-dashlet-settings-check-selector').click()
        checkSelector = 'ols-all'
        cy.get('avantra-dashlet-settings-check-selector').within(() => {
            cy.get('.ng-star-inserted').contains(checkSelector).click()
        })
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('ABAP Systems').click()
        })
        //radiobuttons
        cy.get('.radio-button__label').contains('Predefined').siblings('.radio-button__input').should('be.checked')
        cy.get('.radio-button__label').contains('Ad-Hoc (Classic UI)').siblings('.radio-button__input').should('not.be.checked')

        cy.get('.dashlet-settings__param--title').contains('No Data Status').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('No Data Status').parent('.dashlet-settings__param').within(() => {
            cy.get('ng-dropdown-panel').contains('CRITICAL').click()
        })
        //checkbox
        cy.get('label').contains('Include Unknown Checks').siblings('.custom-checkbox__checkmark').click()

        cy.get('label').contains('Include Unknown Checks').siblings('input').should('be.checked')

        cy.get('.dashlet-settings__param--title').contains('Chart Type').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('Chart Type').parent('.dashlet-settings__param').within(() => {
            cy.get('ng-dropdown-panel').contains('Pie Chart').click()
        })
        cy.get('.dashlet-settings__param--title').contains('Check Confirmation').siblings('.dashlet-settings__param--content').click()
        cy.get('.dashlet-settings__param--title').contains('Check Confirmation').parent('.dashlet-settings__param').within(() => {
            cy.get('ng-dropdown-panel').contains('Not Confirmed').click()
        })

        cy.wait(600)
        // cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"] button').click({ force: true })
        // cy.wait(800)
        cy.get('[elementid="dashboards.dashboard.action-buttons.save"] button').click({ force: true })
        cy.wait(800)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.log(dashboardName)
            
    })
    it("Edited dashboard assertions", () => {
        cy.get('mat-card-title').should('contain', dashboardName)
        cy.get(".avantra-dashlet__headline").invoke('text')
            .then(txt => {
                cy.log(txt);
                expect(txt).to.include(checkSelector);
            })
            



        cy.log('Check selector is present')
        cy.get(".avantra-dashlet__headline").should('include.text', checkSelector)
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
                            cy.get('.highcharts-pie-series')
                                .then(() => {
                                    //  Verify the bars' colors are correct and visible (visisbility is not verified yet)
                                    if (status == "Ok") {
                                        cy.log('OK is present')
                                        cy.get('.highcharts-pie-series .highcharts-color-0').should('have.class', 'highcharts-color-0').and('be.visible')
                                        cy.get('.highcharts-pie-series .highcharts-color-0').realHover()

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
                                        cy.get('.highcharts-pie-series .highcharts-color-1').should('have.class', 'highcharts-color-1').and('be.visible')
                                        cy.get('.highcharts-pie-series .highcharts-color-1').realHover()

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
                                        cy.get('.highcharts-pie-series .highcharts-color-2').should('have.class', 'highcharts-color-2').and('be.visible')
                                        cy.get('.highcharts-pie-series .highcharts-color-2').realHover()

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
                            cy.get('.highcharts-pie-series')
                                .then(() => {
                                    //  Verify the bars' colors are correct and invisible
                                    if (status == "Ok") {
                                        cy.log('OK is NOT present')
                                        // cy.get('.highcharts-bar-series .highcharts-color-0').should('have.css', 'height', '0')
                                        // cy.log('css')
                                        cy.get('.highcharts-pie-series .highcharts-color-0').should('have.attr', 'height', '0')
                                        cy.log('attr')

                                    } else if (status == "Warning") {
                                        cy.log('WARNING is NOT present')
                                        cy.get('.highcharts-pie-series .highcharts-color-1').should('have.attr', 'height', '0')

                                    } else if (status == "Critical") {
                                        cy.log('CRITICAL is NOT present')
                                        cy.get('.highcharts-pie-series .highcharts-color-2').should('have.attr', 'height', '0')

                                    } else cy.log('Other status is found NOT visible ' + status)
                                });

                        });
                };
            })

        })
    })
})