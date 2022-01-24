/// <reference types="cypress" />


describe("Login to Avantra", () => {
    beforeEach(() => {
        cy.visit ("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
    })
const login = "Olha_test";
const password = "Olha1605";
const incor_login = "Olha_incorrect";
const incor_password = "Incorrect_pass";

    it("Login UI without checkbox", () => {
cy.get('#input-login-id').type(login)
cy.get('#input-password-id').type(password)
cy.get('#input-password-id').invoke('attr', 'type').should('contain', 'password')
cy.get('.input-field__password-visibility-switch').click()
cy.get('#input-password-id').invoke('attr', 'type').should('contain', 'text')
cy.get('.background-primary').contains("Login to Avantra").click()
    });

    it.only("Login and Password fields validation", () => {
cy.get('.background-primary').contains("Login to Avantra").click()
cy.wait(500)


cy.get('#input-login-id').invoke('attr', 'tooltip').should('contain', 'Login should not be empty')
cy.get('#input-login-id').should('have.class', 'ng-invalid')
cy.get('[fieldid="input-password-id"]').invoke('attr', 'tooltip').should('contain', 'Password should not be empty')
cy.get('#input-password-id').should('have.class', 'ng-invalid')
cy.get('#input-login-id').type("testLogin")
cy.get('body').click(0,0)
cy.wait(500)
cy.get('[fieldid="input-login-id"]').should('have.class', 'ng-valid')
cy.get('#input-password-id').type("testPassword")
cy.get('body').click(0,0)
cy.wait(500)
cy.get('[fieldid="input-password-id"]').should('have.class', 'ng-valid')
    });
    it("Response 200", () => {
        cy.get('#input-login-id').type(login)
        cy.get('#input-password-id').type(password)
        cy.get('.background-primary').contains("Login to Avantra").click()     
        let postRequest
        cy.request('POST', 'xn/api/auth/login', { username: login, password:password, keepSignedIn: false})
          .then( ({ body }) => {
            postRequest = body
          })
          .should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response).to.have.property('headers')
                    expect(response).property('body').to.contain({
                        username: 'Olha_test'
                      })
                    })
        console.log(postRequest)
    });
    it("Response 400 for incorrect username", () => {
        cy.get('#input-login-id').type(incor_login)
        cy.get('#input-password-id').type(password)
        cy.get('.background-primary').contains("Login to Avantra").click()     
        let postRequest
        cy.request({
            method: 'POST',
            url: 'https://app.dev.avantra.com/xn/api/auth/login', 
            username: login, 
            password:password,
            failOnStatusCode: false} )
          .then( ({ body }) => {
            postRequest = body
          })
          .should((response) => {
                    expect(response.status).to.eq(400)
                    expect(response).to.have.property('headers')
                    expect(response).property('body').to.contain('400 Bad Request')
                    })
        console.log(postRequest)
    });
    it("Response 400 for incorrect password", () => {
        cy.get('#input-login-id').type(login)
        cy.get('#input-password-id').type(incor_password)
        cy.get('.background-primary').contains("Login to Avantra").click()     
        let postRequest
        cy.request({
            method: 'POST',
            url: 'https://app.dev.avantra.com/xn/api/auth/login', 
            username: login, 
            password:password,
            failOnStatusCode: false} )
          .then( ({ body }) => {
            postRequest = body
          })
          .should((response) => {
                    expect(response.status).to.eq(400)
                    expect(response).to.have.property('headers')
                    expect(response).property('body').to.contain('400 Bad Request')
                    })
        console.log(postRequest)
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
        cy.wait(3000)
        cy.get('.section__title').contains("Email sent")
        cy.get('.section__subtitle').contains("Please check your Email and follow the instructions")
        cy.get('.button-back').click()
    });
    
    it('Response data assertions', () => {
        cy.get('.content-block__button-forgot-password').click()     
        let postRequest
        cy.request('POST', 'xn/api/auth/requestNewPassword', { name: 'testName' })
          .then( ({ body }) => {
            postRequest = body
          })
          .should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response).to.have.property('headers')
                    expect(response).property('body').to.contain({
                        msg: 'An email with instructions to reset the password has been sent.'
                      })
                    })
        console.log(postRequest)
     
})

});