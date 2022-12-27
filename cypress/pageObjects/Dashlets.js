class Dashlets {

    elements = {
        getDashletTitle: () => cy.get('.dashlet-selector-item__title'),
        getSubtitle: () => cy.get('[formcontrolname="subtitle"]').children('avantra-input-field'),
        getSaveButton: () => cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]'),
        getTableRow: () => cy.get('.mat-table tr.mat-row')
        

    }
    saveDashlet() {
        this.elements.getSaveButton().click()
    }
}
export default Dashlets