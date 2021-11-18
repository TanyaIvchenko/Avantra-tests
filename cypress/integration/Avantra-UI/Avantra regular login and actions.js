/// <reference types="Cypress" />


describe("Log-in with Avantra", () => {
    beforeEach(() => {
        cy.visit("https://app.dev.avantra.com/xn/ui/");
        cy.get('#input-login-id').type("Tanya admin")
        cy.get('#input-password-id').type("Tanya")
        cy.get('.custom-checkbox__checkmark').click()
        cy.get('.button').click()
    })

    it('Navigate to Settings', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.name__text').click();
        cy.get('.cdk-focused').click();
        cy.get(':nth-child(2) > .ng-untouched > [style="text-transform: none; width: auto;"] > .mat-tooltip-trigger > #undefined').clear();
        cy.get(':nth-child(2) > .ng-untouched > [style="text-transform: none; width: auto;"] > .mat-tooltip-trigger > #undefined').type('Tanya');
        cy.get(':nth-child(4) > .ng-untouched > [style="text-transform: none; width: auto;"] > .mat-tooltip-trigger > #undefined').click();
        cy.get(':nth-child(5) > .ng-untouched > [style="text-transform: none; width: auto;"] > .mat-tooltip-trigger > #undefined').clear();
        cy.get(':nth-child(5) > .ng-untouched > [style="text-transform: none; width: auto;"] > .mat-tooltip-trigger > #undefined').type('Ivchenko');
        cy.get('.mat-drawer-container').click();
        /* ==== End Cypress Studio ==== */
    });

    it.only('Create Dashboard', function() {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.sidebar-list__add-button').click();
        cy.get('.dashboard-modify__header-input').clear();
        cy.get('.dashboard-modify__header-input').type('Tanya_test');
        cy.get('[iconpath="assets/media/icons/shared/menu-ok.svg"] > .icon-button > .icon-button__control').click();
        cy.get('[iconpath="assets/media/icons/shared/menu-close.svg"] > .icon-button > .icon-button__control > svg').click();
        /* ==== End Cypress Studio ==== */
    });

    it('Sign out from the Avantra', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.name__text').click();
        cy.get('.mat-menu-content > :nth-child(2)').click();
        /* ==== End Cypress Studio ==== */
    });

    /* === Test Created with Cypress Studio === */
    it('Duplicate the Dashboard', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(5) > .sidebar-list-item > .mat-menu-trigger > .menu-button__icon').click();
        cy.get('.mat-menu-content > :nth-child(1) > app-button > .icon-button').click();
        /* ==== End Cypress Studio ==== */
    });
    /* === Test Created with Cypress Studio === */
    it('Delete the Dashboard', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(2) > .sidebar-list-item > .mat-menu-trigger > .menu-button__icon').click();
        cy.get('.mat-menu-content > :nth-child(2) > app-button > .icon-button').click();
        /* ==== End Cypress Studio ==== */
    });

})
