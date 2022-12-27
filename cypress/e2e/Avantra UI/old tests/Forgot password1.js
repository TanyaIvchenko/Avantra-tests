describe("Password restore", () => {
    beforeEach(() => {
        cy.visit ("https://app.dev.avantra.com/xn/ui/")
    })
    const login = "Olha_test";
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

    it.only("Send email for Email", ()=> {
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
})