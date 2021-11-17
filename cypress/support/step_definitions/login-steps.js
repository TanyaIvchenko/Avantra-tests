import { Before, Given, When, And, Then } from "cypress-cucumber-preprocessor/steps";

Given('I access the WebdriverUniversity Login Portal page', () => {
    cy.visit("http://www.webdriveruniversity.com/Login-Portal/index.html");
})

When("I enter a username {word}", (userName) =>{
    cy.get("#text").type(userName);
})

And("I enter a password {word}", (userName) =>{
    cy.get("#password").type(userName);
})

And("I click on the login button", () =>{
    cy.get("#login-button").click();
})

And("I should be presented with the following message {word} {word}", (message, message2) =>{

})