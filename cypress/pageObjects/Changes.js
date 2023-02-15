class Changes {
    elements = {
        getCheckListTile: () => cy.get('.dashlet-selector-item__title').contains('Check List'),
        getCheckSelectorDropdown: () => cy.get('.dashlet-settings__param span')
                                        .contains('Check Selector') 
                                        .siblings('div.dashlet-settings__param--content'),
        getCheckSelectorItem: () => cy.get('avantra-dashlet-settings-check-selector .ng-dropdown-panel-items'),
        getStatusIconAndName: () => cy.get('.cell-type-status-icon-and-name span'),
        getStatus: () =>  cy.get('.cdk-column-status'),
        getCheckResult: () => cy.get('.mat-column-result')
    }
    addCheckListDashlet() {
        this.elements.getCheckListTile().siblings('.dashlet-selector-item__button').click()
    }
    
}
export default Changes