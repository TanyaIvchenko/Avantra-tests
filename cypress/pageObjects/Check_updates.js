class CheckUpd {

    elements = {
        getTableCell: () => cy.get('.mat-row avantra-string-cell .cell-type-string')
        

    }
    saveDashlet() {
        this.elements.getSaveButton().click()
    }
    
}
export default CheckUpd