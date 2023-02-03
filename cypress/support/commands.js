// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
Cypress.Commands.add("navigateTo_WebdriverUni_Homepage", () => {
    cy.visit("/")
})

Cypress.Commands.add("navigateTo_WebdriverUni_Checkbox_Page", () => {
    cy.visit("/" + "/Dropdown-Checkboxes-RadioButtons/index.html")
})


Cypress.Commands.add("selectProduct", productName => {
    cy.get(".fixed_wrapper .prdocutname").each(($el, index, $list) => {
        if($el.text().includes(productName)) {
            cy.wrap($el).click()
        }
    });
});

Cypress.Commands.add("addProductToBasket", productName => {
    cy.get(".fixed_wrapper .prdocutname").each(($el, index, $list) => {
        if($el.text() === productName) {
            cy.log($el.text())
            cy.get('.productcart').eq(index).click();
        }
    });
});


Cypress.Commands.add("webdriverUni_ContactForm_Submission", (firstName, lastName, email, comment, $selector, textToLocate) => {
    cy.get('[name="first_name"]').type(firstName);
    cy.get('[name="last_name"]').type(lastName);
    cy.get('[name="email"]').type(email)
    cy.get('textarea.feedback-input').type(comment)
    cy.get('[type="submit"]').click();
    cy.get($selector).contains(textToLocate)
})

// Set CYPRESS_COMMAND_DELAY above zero for demoing to stakeholders,
// E.g. CYPRESS_COMMAND_DELAY=1000 node_modules/.bin/cypress open
const COMMAND_DELAY = Cypress.env('COMMAND_DELAY') || 0;
if (COMMAND_DELAY > 0) {
    for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
        Cypress.Commands.overwrite(command, (originalFn, ...args) => {
            const origVal = originalFn(...args);

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(origVal);
                }, COMMAND_DELAY);
            });
        });
    }
}

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('loginSession', (localUser, envServer, passwd) => {
    cy.session([localUser, envServer, passwd], () => {
        cy.visit(envServer)
        cy.wait(600)
            cy.get('body').then((body) => {
                if (body.find('#input-login-id').length > 0) {
                    cy.get('#input-login-id').type(localUser)
                    cy.get('#input-password-id').type(passwd)
                    cy.get('.background-primary').contains("Login to Avantra").click()
                    cy.wait(800)

                }
                
            })
 
    })
})

Cypress.Commands.add('stampDashName', (dashname) => {
    var stamp = Math.round(+new Date() / 1000);
    dashname = dashname + stamp
    return dashname;
})

