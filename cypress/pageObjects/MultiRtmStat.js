class MultiRtmStat {

    elements= {
        getDashletTitle: () => cy.get('.dashlet-selector-item__title'),
        getTitlePlaceholderDef: () => cy.get('[placeholder="Multi RTM Status"]')
    }
   
}
export default MultiRtmStat