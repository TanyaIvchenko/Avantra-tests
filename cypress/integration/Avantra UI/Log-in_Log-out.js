/// <reference types="Cypress" />


describe("Dashboards", () => {
    const login = "Tanya admin";
    const password = "Tanya";


    it("Log-in", () => {
        cy.visit("https://eiger.dev.gcp.avantra.net:8443/xn/ui");
        cy.get('#input-login-id').type(login)
        cy.get('#input-password-id').type(password)
        cy.get('.background-primary').contains("Login to Avantra").click()
        let postRequest
        cy.request('POST', 'xn/api/auth/login', { username: login, password: password, keepSignedIn: false })
            .then(({ body }) => {
                postRequest = body
            })
            .should((response) => {
                expect(response.status).to.eq(200)
                expect(response).to.have.property('headers')
                expect(response).property('body').to.contain({
                    username: 'Tanya admin'
                })
            })
        console.log(postRequest)
    });

    it("Log out", () => {

        cy.get('.name__text').click();
        cy.get('.mat-menu-content > :nth-child(2)').click();
        cy.get('.section__title').contains("Login to Avantra")
    })
})