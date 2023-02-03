class MultiSys {

    elements= {
       
        getSystemHeadline: () => cy.get('.system-title__name.avantra-dashlet__headline'),
        getDbInstancesList: () => cy.get('.system-element-database__instances-list .database-instance')
    }
   

    
}
export default MultiSys