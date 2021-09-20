/// <reference types="cypress" />


describe("Login to Avantra", () => {
    beforeEach(() => {
        cy.visit ("https://app.dev.avantra.com/xn/ui/")
    })
const login = "Olha_test";
const password = "Olha1605";

    it("Login UI without checkbox", () => {
cy.get('#input-login-id').type(login)
cy.get('#input-password-id').type(password)
cy.get('#input-password-id').invoke('attr', 'type').should('contain', 'password')
cy.get('.input-field__password-visibility-switch').click()
cy.get('#input-password-id > .mat-tooltip-trigger > #undefined').invoke('attr', 'type').should('contain', 'text')
cy.get('.background-primary').contains("Login to Avantra").click()
    });

    it ("Login and Password fields validation", () => {
cy.get('.background-primary').contains("Login to Avantra").click()
cy.wait(500)
cy.get('#input-login-id').invoke('attr', 'tooltip').should('contain', 'Login should not be empty')
cy.get('#input-login-id').should('have.class', 'ng-invalid')
cy.get('#input-password-id').invoke('attr', 'tooltip').should('contain', 'Password should not be empty')
cy.get('#input-password-id').should('have.class', 'ng-invalid')
cy.get('#input-login-id').type("testLogin")
cy.get('body').click(0,0)
cy.wait(500)
cy.get('#input-login-id').should('have.class', 'ng-valid')
cy.get('#input-password-id').type("testPassword")
cy.get('body').click(0,0)
cy.wait(500)
cy.get('#input-password-id').should('have.class', 'ng-valid')
    });
});

describe("Password restore", () => {
    beforeEach(() => {
        cy.visit ("https://app.dev.avantra.com/xn/ui/")
    })
const login = "Olha_test";
const password = "Olha1605";
    it("Send email UI", ()=> {
        cy.get('.content-block__button-forgot-password').click()
        cy.get('.section__title').contains("Restore Password")
        cy.get('.button-back').click()
        cy.get('.content-block__button-forgot-password').click()
        cy.get('#input-restore-login-id').invoke('attr', 'placeholder').should('contain', 'Username or Email')
        cy.get('#input-restore-login-id').type(login)
        cy.get('.background-primary').contains("Send").click()
        cy.wait(1000)
        cy.get('.section__title').contains("Email sent")
        cy.get('.section__subtitle').contains("Please check your Email and follow the instructions")
        cy.get('.button-back').click()
    });
    
    // it ("Post Forgot Password", () => {
    //     cy.route("POST", "/api/auth/requestNewPassword").as("postRequestNew");
    //     cy.get('#input-restore-login-id').type(login)
    //     cy.get('.background-primary').contains("Send").click()
    // })
//     it.only("Response Forgot password", () => {
//         cy.get('.content-block__button-forgot-password').click()
//         cy.request('https://app.dev.avantra.com/xn/api/auth/requestNewPassword')
//   .should((response) => {
//     expect(response.status).to.eq(200)
//     expect(response).to.have.property('headers')
//     expect(response).to.have.property('duration')
//   })
//     })
});