class autoStore_HairCare_PO {
    addHairCareProductsToBaskeet() {
        globalThis.data.productName.forEach(function(element) {
            cy.addProductToBasket(element).then(() => {
                //debugger
            })
        })
        cy.get('.dropdown-toggle > .fa').click().debug();
    }
    
}
export default autoStore_HairCare_PO;