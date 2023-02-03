class Dashboards {

    elements = {
        getDashboardsTitle: () => cy.get('.header__title-wrapper .title-wrapper__title'),
        getDashboardName: () => cy.get('.avantra-page__header-title'),
        getDashboardNameAtNavmenu : () => cy.get('.navigation-list-item'),
        getPlusSign: () => cy.get('avantra-button.title-wrapper__add-button'),
        getDashboardHeader: () => cy.get('.dashboard-modify__header-input'),
        getAddDashletButton: () => cy.get('.dashboard-modify__add-dashlet'),
        getSaveDashboardButton: () => cy.get('[elementid="dashboards.dashboard.action-buttons.save"]'),
        getUpdatedData: () => cy.get('.updated-at__time'),
        getDashletCardTitle: () =>  cy.get('.mat-card-title'),
        getQuickActionsMenu: () => cy.get('.mat-menu-panel'),
        getQuickActionItem: () => cy.get('.mat-menu-item'),
        getModalDeleteSubmit: () => cy.get('.confirmation-modal__btn-group [type="submit"]').contains('Delete'),
        getHeaderMessage: () => cy.get('.mat-simple-snack-bar-content'),
        getEditDashboardButton: () => cy.get('.header__edit-block [mattooltip="Edit Dashboard"]')
    }

    clickCreateDashboard() {
        this.elements.getPlusSign().click();
    }
    clearDashboardHeader() {
        this.elements.getDashboardHeader().clear()
    }
    clickAddDashletButton() {
        this.elements.getAddDashletButton().wait(200).click()
    }
    saveDashboard() {
        cy.get('.sub-header').within(() => {
            this.elements.getSaveDashboardButton().click()
        })
    }
    clickQuickDeleteDashboard() {
        this.elements.getQuickActionItem().contains('Delete').click({ force: true });
    }
    submitModalDashboardDelete() {
        this.elements.getModalDeleteSubmit().click({ force: true })
    }
    clickEditDashboard() {
        this.elements.getEditDashboardButton().click()
    }
    
    
}
export default Dashboards