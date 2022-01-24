/// <reference types="cypress" />

describe("Login tests", () => {

    it("Login via UI", () => {
        cy.visit("https://app.dev.avantra.com/xn/ui/");
        cy.get("#input-login-id").type("Tanya admin");
        cy.get("#input-password-id").type("Tanya")
        cy.get(".content-block__button-sign-in").click()
    })

    it("API Login body validation", () => {
        cy.request({
            method: "POST",
            url: "https://app.dev.avantra.com/xn/api/auth/login",
            body: {
                username: "Tanya admin",
                password: "Tanya"
            }
        }).then(response => {
            expect(response.status).to.eql(200)
            expect(response.body).to.have.all.keys('username', 'token')
            cy.log(response.body)
        })
    })
    it.only("Login using Token (set to Cookie from POST request)", () => {
        cy.request({
            method: "POST",
            url: "https://app.dev.avantra.com/xn/api/auth/login",
            body: {
                username: "Tanya admin",
                password: "Tanya"
            }
        }).then(response => {
            cy.setCookie("token", response.body.token)
            cy.visit("https://app.dev.avantra.com/xn/ui/")

        })

    })
})