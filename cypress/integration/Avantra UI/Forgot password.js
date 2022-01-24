describe("Password restore", () => {
    beforeEach(() => {
        cy.visit ("https://eiger.dev.gcp.avantra.net:8443/xn/ui")
    })
    const login = "Tanya admin";
    it("Send email for username", ()=> {
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

    it("Send email for Email", ()=> {
      cy.get('.content-block__button-forgot-password').click()
      cy.get('.section__title').contains("Restore Password")
      cy.get('#input-restore-login-id').invoke('attr', 'placeholder').should('contain', 'Username or Email')
      cy.get('#input-restore-login-id').type("tatyana.ivchenko@avantra.com")
      cy.get('.background-primary').contains("Send").click()
      cy.wait(3000)
      cy.get('.section__title').contains("Email sent")
      cy.get('.section__subtitle').contains("Please check your Email and follow the instructions")
      cy.get('.button-back').click()
  });

    it('Response data assertions', () => {
        cy.get('.content-block__button-forgot-password').click()     
        let postRequest
        cy.request('POST', 'xn/api/auth/requestNewPassword', { name: 'Tanya admin' })
          .then( ({ body }) => {
            postRequest = body
          })
          .should((response) => {
                    expect(response.status).to.eq(200)
                    expect(response).to.have.property('headers')
                    expect(response).property('body').to.contain({
                      msg: "If a user exists with the name 'Tanya admin' then a password-reset will be sent to the email address on file. Please check your email for further instructions. If you do not receive an email, please contact your system administrator."                    
                    })
        console.log(postRequest)
    }) 
})
})