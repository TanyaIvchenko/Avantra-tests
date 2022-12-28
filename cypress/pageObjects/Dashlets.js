class Dashlets {

    elements = {
        getDashletTitle: () => cy.get('.dashlet-selector-item__title'),
        getSubtitle: () => cy.get('[formcontrolname="subtitle"]').children('avantra-input-field'),
        getSaveButton: () => cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]'),
        getTableRow: () => cy.get('.mat-table tr.mat-row'),
        getDashletTile: () => cy.get('.dashlet-selector-item__title')
        

    }
    saveDashlet() {
        this.elements.getSaveButton().click()
    }
    addDashlet(dashlet) {
        this.elements.getDashletTile().contains(dashlet).siblings('.dashlet-selector-item__button').click()
    }
}
export default Dashlets