/// <reference types="cypress" />


describe("Multi-RTM status: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    before(() => {
        cy.fixture("Credentials").as("creds")
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.get("@creds").then((creds) => {
            cy.visit(creds.env)
            cy.wait(600)
            cy.get('body').then((body) => {
                if (body.find('#input-login-id').length > 0) {
                    cy.get('#input-login-id').type(creds.login)
                    cy.get('#input-password-id').type(creds.password)
                    cy.get('.background-primary').contains("Login to Avantra").click()
                    cy.wait(600)
                    cy.get('.drawer__header__title').wait(600).should('have.text', 'Dashboards')
                    cy.wait(600)
                }
            })
        })
    })
    beforeEach(() => {
        cy.fixture("systems-instances").as("inventory")
        // Preserve the Cookies

        Cypress.Cookies.preserveOnce('token', 'JSESSIONID');
        
    })
    let dashboardName;
    let checkSelector
    let rowNames = ['Note', 'Version', 'Title', 'Status', 'Date', 'Component', 'Cat.', 'Secur. Cat.', 'Relevant For']
    after(() => {
        // delete dashboard
        cy.wait(5000)
        // cy.get('.navigation-list-item')
        cy.contains(dashboardName).realHover()
        cy.get('.navigation-list-item').contains(dashboardName)
            .siblings('.navigation-list-item__menu-button').invoke('show').click({ force: true })

        cy.wait(1000)
        cy.get('.mat-menu-panel').within(() => {
            cy.get('.mat-menu-item').contains('Delete').click({ force: true });
        })
        cy.get('.confirmation-modal__btn-group [type="submit"]').contains('Delete').click({ force: true });
        cy.wait(600)
        cy.get('.mat-simple-snack-bar-content').should("have.text", 'Successfully deleted')
        cy.contains('a', dashboardName).should('not.exist')

    })
    it("SAP HotNews creation", function() {

        cy.get('.drawer__header__title').should('have.text', 'Dashboards')
        cy.wait(2000)
        cy.get('.drawer__header').children('.drawer__header__add-button').click();
        cy.wait(1000)
        cy.get('.dashboard-modify__header-input').clear();
        //timestamp dashboard name               
                var stamp=Math.round(+new Date()/1000);
                const dashname = `Ols_hotnews${stamp}`
                cy.get('.dashboard-modify__header-input').type(dashname)
        cy.get('.dashboard-modify__add-dashlet').wait(2000).click()
        cy.get('[placeholder="Search Dashlet"]').within(() => {
           cy.get('input').type('sap')
        })
        cy.wait(200)
        cy.get('.dashlet-selector-item__title').should('have.length', 1)
        cy.get('.dashlet-selector-item__title').should('contain', 'SAP HotNews')
        cy.get('.dashlet-selector-item__button').wait(2000).click()
    
        cy.get('[placeholder="SAP HotNews"]').type("SAP HotNews ols")
        cy.get('[formcontrolname="subtitle"]').clear().type("Autotest")
        cy.wait(2000)
        cy.get('.mat-paginator-range-label').should('contain', 'Page 1 of')
        cy.wait(10000)
        //Get number of pages
        
        
        cy.wait(600)
        cy.get('[elementid="dashboards.add-dashlet-stepper.action-buttons.save"]').click()
        cy.wait(800)
        cy.get('.sub-header').within(() => {
            cy.get('[elementid="dashboards.dashboard.action-buttons.save"]').click()
        })
        cy.wait(800)
        cy.get('.updated-at__time').should('have.text', 'less than a minute ago')
        cy.log(dashname)
                    .then(() => {
                        dashboardName = dashname;
                    })
    
    })
    it("SAP Hotnews assertions", function() {
        cy.get('mat-card-title').should('contain', 'SAP HotNews')
        cy.log('Row headers are present: ')
        let rowUINames = []
        cy.get('.mat-header-row th.mat-header-cell').each(($el) => {
            cy.get($el).invoke('text').then((txt) => {
                    txt = txt.trim()
                    rowUINames.push(txt)
            })
        })
            .then(() => {
                cy.wrap(rowUINames)
            }).then(() => { 
            if (JSON.stringify(rowUINames.sort()) === JSON.stringify(rowNames.sort())) {
                cy.log("ALL headers are present!!")
            } else cy.log("rows: " + rowUINames +"   "+ "array: " + rowNames)
            })
        cy.get('.mat-paginator-range-label').invoke('text')
        .then(text => +text.replace('Page 1 of', '').trim()).then((text) =>{
        cy.log('Number of pages is: ', text)
        cy.wrap(text).as('pageNum')
        })
        cy.get('[aria-label="First page"]').should('have.class', 'mat-button-disabled')
        cy.get('[aria-label="Previous page"]').should('have.class', 'mat-button-disabled')
        //Length=26, because of tr for table header
        cy.get('[aria-label="avantra-table"]').find('tr').should('have.length', 4)
        //For pages more than 1
        cy.get('@pageNum').then((pageNum) => {
            if(pageNum>1){
                cy.log("Pages MORE than one!!Number: ", pageNum)
        //click once Next page
        cy.get('[aria-label="Next page"]').click()
        cy.get('.mat-paginator-range-label').wait(600).should('contain', 'Page 2 of')
        cy.get('[aria-label="First page"]').should('not.have.class', 'mat-button-disabled')
        cy.get('[aria-label="Previous page"]').should('not.have.class', 'mat-button-disabled')
        //click Last page
        cy.get('[aria-label="Last page"]').click()
        cy.get('@pageNum').then((pageNum) => {
        let newPageNum;
        newPageNum = 'Page '+ pageNum;
        cy.get('.mat-paginator-range-label').wait(600).invoke('text').should('contain', newPageNum);
    })
    //Counting pages for 50 per page
        cy.get('.mat-paginator-page-size-select').wait(200).click()
        cy.get('.mat-option-text').contains('50').parent('mat-option').click()
        cy.then((pageNum) => {
            let fiftyPageNum;
           fiftyPageNum = 'Page '+ pageNum/2;
            let fiftyMinusPageNum;
            fiftyMinusPageNum = 'Page '+ ((pageNum/2)-1);
            cy.get('.mat-paginator-range-label').wait(600).invoke('text').then((text) =>{
                if(text.includes(fiftyPageNum)) {
                    cy.log('Number for 50 per page:', fiftyPageNum)
                }
                else if (text.includes(fiftyMinusPageNum)) {
                    cy.log('Number for 50 per page:', fiftyMinusPageNum)
                }
                else {
                    cy.log('Number for 50 per page: INCORRECT')
                }
            })
            })
             //Length=51, because of tr for table header
        cy.get('[aria-label="First page"]').click()
        cy.get('[aria-label="avantra-table"]').find('tr').should('have.length', 51)
        //Counting pages for 100 per page
            cy.get('.mat-paginator-page-size-select').wait(200).click()
            cy.get('.mat-option-text').contains('100').parent('mat-option').click()
            //Length=101, because of tr for table header
            cy.get('[aria-label="avantra-table"]').find('tr').should('have.length', 101)
            cy.then((pageNum) => {
                let hundredPageNum;
                hundredPageNum = 'Page '+ pageNum/4;
                let hundredMinusPageNum;
                hundredMinusPageNum = 'Page '+ ((pageNum/4)-1);
                cy.get('.mat-paginator-range-label').wait(600).invoke('text').then((text) =>{
                    if(text.includes(hundredPageNum)) {
                        cy.log('Number for 100 per page:', hundredPageNum)
                    }
                    else if (text.includes(hundredMinusPageNum)) {
                        cy.log('Number for 100 per page:', hundredMinusPageNum)
                    }
                    else{
                        cy.log('Number for 100 per page: INCORRECT')
                    }
                })
                })
            }
        //For ONE page
            else{
                cy.log("ONE page assertion!!!")
                cy.get('[aria-label="Next page"]').should('have.class', 'mat-button-disabled')
                cy.get('[aria-label="Last page"]').should('have.class', 'mat-button-disabled')
                
            }
            })
    })
})
