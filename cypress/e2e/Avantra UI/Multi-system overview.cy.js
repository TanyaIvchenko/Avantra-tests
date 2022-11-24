/// <reference types="cypress" />



describe("Multiple systems overview create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
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

    it("Multiple System Overview creation", () => {

        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(2000)
        cy.get('.drawer__header').children('.drawer__header__add-button').click();
        cy.wait(1000)
        cy.get('.dashboard-modify__header-input').clear();
        //timestamp dashboard name               
        var stamp = Math.round(+new Date() / 1000);
        const dashname = `Ols_multisys_ovw${stamp}`
        cy.get('.dashboard-modify__header-input').type(dashname)
        cy.get('.dashboard-modify__add-dashlet').click();
        cy.get('.dashlet-selector-item__title').contains('Multiple System Overview').parent()
            .within(() => {
                cy.get('.dashlet-selector-item__button').wait(2000).click()
            })
        cy.get('[placeholder="Multiple System Overview"]').type("Multiple_System_Overview_ols")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest")
        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('ABAP Systems').click()
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
    })
    //  works: 03.11
    it("Multiple System Overview editing created - 1- Category", () => {
        cy.reload()
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(200).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(500)
            .click()
        cy.wait(200)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header')
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_Category")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_Category")
        cy.wait(600)
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]').within(() => {
            cy.get('.ng-star-inserted').contains('1 minute').click()
        })
        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('All Active Servers').click()
        })

        cy.get('#showInstallationInfo').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#showInstallationInfo').should('be.checked')

        cy.get('#showVersionInfo').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#showVersionInfo').should('be.checked')

        cy.get('#showInstanceDetails').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#showInstanceDetails').should('be.checked')

        //Select Check Types To Show
        cy.get('#RTM').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#RTM').should('be.checked')

        cy.get('#daily').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#daily').should('be.checked')

        cy.get('#Server').siblings('.custom-checkbox__checkmark').click()
        cy.wait(300)
        cy.get('#Server').should('be.checked')

        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        // cy.reload()
        //     cy.wait(600)
        // cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
    xit("Assertions for instances", function() {

        cy.reload()
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(2000).click()
        cy.get('@inventory').then((inventory) => {
           
            // Finding system name
            let systemsList = []
            let instancesJson = []
            let instancesList
            cy.get('.system-title__name.avantra-dashlet__headline').each(($el) => {
                cy.get($el).invoke('text').then((txt) => {
                    txt = txt.trim()
                    systemsList.push(txt)
                    // finding instances in JSON for the name from UI
                instancesList = inventory.find(el => el.name === txt);
                instancesJson = instancesList.instances
                cy.wrap(instancesList)
                cy.log('from JSON:  ' + instancesList.instances)
                })
                //create an arrays with instances on UI
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                let instancesUi = []
                cy.get($el).parents('.system-element').within(() => {
                    cy.get('.system-element-database__instances-list').then(($name) => {
                        if($name.length > 0) {
                            for(let i = 0; i < $name.length; i++ ) {
                                cy.get($name). invoke('text'). then((txtName) => {
                                txtName = txtName[i].trim()
                                instancesUi.push(txtName)
                                cy.log("From UI: " + instancesUi)
                                })
                            }
                        } else cy.log("No instances")
                        // cy.log(JSON.stringify(instancesJson.sort()) + " - from JSON and " + JSON.stringify(instancesUi.sort()) + " - from UI")
                    })
                    // cy.get('.system-element-database__instances-list')
                    // cy.get('div.database-instance__name').each(($name) => {    
                    //     instancesUi.length = 0
                    //     cy.get($name).invoke('text').then((txtName) => {
                    //             txtName = txtName.trim()
                    //             instancesUi.push(txtName)                                
                    //     })
                    // cy.log(JSON.stringify(instancesJson.sort()) + " - from JSON and " + JSON.stringify(instancesUi.sort()) + " - from UI")
                    // if (JSON.stringify(instancesJson.sort()) === JSON.stringify(instancesUi.sort())) {
                    //     cy.log("Instances present: " + instancesUi + " (UI) " + instancesJson + " (JSON) ")
                    // }
                    // })    
                        
                })
            })
            // .then((array) => cy.get(systemsList.sort()))
            // cy.wrap(systemsList)
            //     .then((array) => cy.log('List of systems', JSON.stringify(array)))

            // here comes creating and adding the instances to the array
            // here comes checking the consistency of system and instances list

        })
    })
    // works: 03.11
    it("Multiple System Overview editing created - 2 - Individual", () => {
        cy.reload()
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

        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_individual")
        cy.wait(600)
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_individual")

        cy.wait(600)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('ABAP Systems').click()
        })
        cy.get('#individualCheck').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('#individualCheck').should('be.checked')

        cy.get('.ng-placeholder').contains('Select individual Checks').parents('.ng-select-multiple').click()
        cy.get('[placeholder="Select individual Checks"]').within(() => {
            cy.get('.ng-star-inserted').contains('FULLCHECK').click()
        })
        cy.get('#individualCheck').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('.ng-placeholder').contains('Select individual Checks').parents('.ng-select-container').within(() => {
            cy.get('.ng-arrow-wrapper').click()
        })
        cy.wait(300)
        cy.get('[placeholder="Select individual Checks"]').within(() => {
            cy.get('.ng-star-inserted').contains('CPULOAD').click()
        })


        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.wait(2000)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.reload()
        cy.wait(2000)
    })
    // works: 03.11
    xit("Multiple System Overview editing created - 3 - Check Selectors", () => {
        cy.reload()
        cy.wait(600)
        cy.get('.navigation-list-item').contains('a', dashboardName)
            .wait(1000).click()
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(1000)
            .click()
        cy.wait(1000)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header').wait(600)
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.get('.header__edit-block')
            .get('[mattooltip="Edit Dashboard"]')
            .wait(1000)
            .click()
        cy.wait(1000)
        cy.get('.avantra-drawer__content').within(() => {
            cy.get('.avantra-dashlet__header').wait(600)
                .within(() => {
                    cy.get('[mattooltip="Dashlet Settings"]')
                        .click()
                })
        })
        cy.get('[placeholder="Multiple System Overview"]').clear().type("Multiple_System_Overview_ols_edited_checksel")
        cy.get('[formcontrolname="subtitle"]').children('avantra-input-field').clear().type("Autotest_edited_checksel")
        cy.wait(600)


        cy.wait(800)
        cy.get('avantra-dashlet-settings-system-predefined').click()
        cy.get('avantra-dashlet-settings-system-predefined').within(() => {
            cy.get('.ng-star-inserted').contains('Avantra Servers').click()
        })
        cy.get('.dashlet-settings__param').contains("Refresh Interval").siblings('.dashlet-settings__param--content').click()
        cy.get('[role="listbox"]').within(() => {
            cy.get('.ng-star-inserted').contains('10 seconds').click()
        })
        cy.get('#checkSelectorId').siblings('.radio-button__checkmark').click()
        cy.wait(300)
        cy.get('#checkSelectorId').should('be.checked')

        cy.get('.ng-placeholder').contains('Select check').parents('.ng-select-container').click()
        cy.get('[placeholder="Select check"]').within(() => {
            cy.get('.ng-star-inserted').contains('ols-rtm').click()
        })

        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.wait(800)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
    })
})