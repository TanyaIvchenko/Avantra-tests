class Dashboards {

    elements = {
        getDashboardsTitle: () => cy.get('.drawer__header__title'),
        getDashboardNameAtNavmenu : () => cy.get('.navigation-list-item'),
        getPlusSign: () => cy.get('.drawer__header').children('.drawer__header__add-button'),
        getDashboardHeader: () => cy.get('.dashboard-modify__header-input'),
        getAddDashletButton: () => cy.get('.dashboard-modify__add-dashlet'),
        getSaveDashboardButton: () => cy.get('[elementid="dashboards.dashboard.action-buttons.save"]'),
        getUpdatedData: () => cy.get('.updated-at__time'),
        getDashletCardTitle: () =>  cy.get('.mat-card-title'),
        getQuickActionsMenu: () => cy.get('.mat-menu-panel'),
        getQuickActionItem: () => cy.get('.mat-menu-item'),
        getModalDeleteSubmit: () => cy.get('.confirmation-modal__btn-group [type="submit"]').contains('Delete'),
        getHeaderMessage: () => cy.get('.mat-simple-snack-bar-content')
    }
    clickCreateDashboard() {
        this.elements.getPlusSign().click();
    }
    clearDashboardHeader() {
        this.elements.getDashboardHeader().clear()
    }
    clickAddDashletButton(){
        this.elements.getAddDashletButton().wait(200).click()
    }
    saveDashboard(){
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
}
export default Dashboards