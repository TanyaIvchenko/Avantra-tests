/// <reference types="cypress" />
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();

describe("SAP HotNews: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    beforeEach(function () {
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.fixture("Credentials")
            .then((creds) => {
                this.creds = creds
                cy.loginSession(this.creds.login, this.creds.env, this.creds.password)
                cy.visit(creds.env)

            })
        cy.fixture("Dashboards").then((dashboardsData) => {
            this.dashboardsData = dashboardsData
        })
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })
        cy.fixture("HotNews").then((hotNewsData) => {
            this.hotNewsData = hotNewsData
        })

    })
    let dashboardName;

    after(function () {
        // delete dashboard
        cy.wait(5000)

        cy.contains(dashboardName).realHover()
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains(dashboardName)
            .siblings('.navigation-list-item__menu-button')
            .invoke('show')
            .click({ force: true })

        cy.wait(1000)
        dashboards.elements.getQuickActionsMenu().within(() => {
            dashboards.clickQuickDeleteDashboard()
        })
        dashboards.submitModalDashboardDelete()
        cy.wait(800)
        dashboards.elements.getHeaderMessage().should("have.text", this.dashboardsData.successfulDeletion)

    })
    it("SAP HotNews creation", function () {

        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(1000)
        dashboards.clearDashboardHeader()

        //timestamp dashboard name and typing it to dashboard name         

        cy.stampDashName(this.hotNewsData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })

        dashboards.clickAddDashletButton()
        cy.wait(2000)
        dashlets.elements.getDashletSearch().type(this.hotNewsData.searchKeyword)

        cy.wait(1000)

        dashlets.addDashlet(this.hotNewsData.dashletDefTitle)

        dashlets.elements.getTitle().type(this.hotNewsData.title)
        cy.wait(2000)
        dashlets.elements.getPaginatorRangeLabel().should('contain', this.hotNewsData.paginatorLabel)
        cy.wait(10000)
        //Get number of pages


        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(1000)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)

    })
    it("SAP Hotnews assertions", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(2000)
        dashlets.elements.getDashletCardTitle().should('contain', this.hotNewsData.title)
        cy.log('Row headers are present: ')
        let rowUINames = []
        dashlets.elements.getTableHeaders().each(($el) => {
            cy.get($el).invoke('text').then((txt) => {
                txt = txt.trim()
                rowUINames.push(txt)
            })
        })
            .then(() => {
                cy.wrap(rowUINames)
            }).then(() => {
                if (JSON.stringify(rowUINames.sort()) === JSON.stringify(this.hotNewsData.tableHeaders.sort())) {
                    cy.log("ALL headers are present!!")
                } else cy.log("rows: " + rowUINames + "   " + "array: " + this.hotNewsData.tableHeaders)
            })
        dashlets.elements.getPaginatorRangeLabel().invoke('text')
            .then(text => +text.replace(this.hotNewsData.paginatorLabel, '').trim()).then((text) => {
                cy.log('Number of pages is: ', text)
                cy.wrap(text).as('pageNum')
            })
        dashlets.elements.getFirstPageButton().should('have.class', this.hotNewsData.disabledButton)
        dashlets.elements.getPreviousPageButton().should('have.class', this.hotNewsData.disabledButton)
        //Length=26, because of tr for table header
        dashlets.elements.getTableRows().find('tr').should('have.length', 26)
        //For pages more than 1
        cy.get('@pageNum').then((pageNum) => {
            if (pageNum > 1) {
                cy.log("Pages MORE than one!!Number: ", pageNum)
                //click once Next page
                dashlets.elements.getNextPageButton().click()
                dashlets.elements.getPaginatorRangeLabel().wait(600).should('contain', this.hotNewsData.paginatorLabelSecond)
                dashlets.elements.getFirstPageButton().should('not.have.class', this.hotNewsData.disabledButton)
                dashlets.elements.getPreviousPageButton().should('not.have.class', this.hotNewsData.disabledButton)
                dashlets.elements.getPreviousPageButton().click()
                //click Last page
                dashlets.elements.getLastPageButton().click()
                cy.get('@pageNum').then((pageNum) => {
                    let newPageNum;
                    newPageNum = 'Page ' + pageNum;
                    dashlets.elements.getPaginatorRangeLabel().wait(600).invoke('text').should('contain', newPageNum);
                })
                //Counting pages for 50 per page
                dashlets.elements.getPageNumberDropdown().wait(200).click()
                dashlets.elements.getPaginatorValue(this.hotNewsData.pagesNumberFifty).click()
                cy.then((pageNum) => {
                    let fiftyPageNum;
                    fiftyPageNum = 'Page ' + pageNum / 2;
                    let fiftyMinusPageNum;
                    fiftyMinusPageNum = 'Page ' + ((pageNum / 2) - 1);
                    dashlets.elements.getPaginatorRangeLabel().wait(600).invoke('text').then((text) => {
                        if (text.includes(fiftyPageNum)) {
                            cy.log('Number for 50 per page:', fiftyPageNum)
                        }
                        else if (text.includes(fiftyMinusPageNum)) {
                            cy.log('Number for 50 per page:', fiftyMinusPageNum)
                        }
                        else if (text.includes(this.hotNewsData.paginatorLabel)) {
                            cy.log('Number for 50 per page: less or 1')
                        }
                        else {
                            cy.log('Number for 50 per page: INCORRECT')
                        }
                    })
                })
                //Length=51, because of tr for table header
                dashlets.elements.getItemsPerPage().invoke('text').then((text) => {
                    let itemsPerPage =parseInt(text.slice(4))
                    cy.log(itemsPerPage)
                    if(itemsPerPage < 51) {
                        dashlets.elements.getTableRows().find('tr').should('have.length', itemsPerPage + 1)
                    } else {
                        dashlets.elements.getFirstPageButton().click()
                        dashlets.elements.getTableRows().find('tr').should('have.length', itemsPerPage + 1)
                    }
                })
                

                //Counting pages for 100 per page
                dashlets.elements.getPageNumberDropdown().wait(200).click()
                
                dashlets.elements.getPaginatorValue(this.hotNewsData.pagesNumberHundred).click()
                //Length=101, because of tr for table header
                dashlets.elements.getItemsPerPage().invoke('text').then((text) => {
                    let itemsPerPage =parseInt(text.slice(4))
                    cy.log(itemsPerPage)
                    if(itemsPerPage < 100) {
                        dashlets.elements.getTableRows().find('tr').should('have.length', itemsPerPage + 1)
                    }
                })
                cy.then((pageNum) => {
                    let hundredPageNum;
                    hundredPageNum = 'Page ' + pageNum / 4;
                    let hundredMinusPageNum;
                    hundredMinusPageNum = 'Page ' + ((pageNum / 4) - 1);
                    dashlets.elements.getPaginatorRangeLabel().wait(600).invoke('text').then((text) => {
                        if (text.includes(hundredPageNum)) {
                            cy.log('Number for 100 per page:', hundredPageNum)
                        }
                        else if (text.includes(hundredMinusPageNum)) {
                            cy.log('Number for 100 per page:', hundredMinusPageNum)
                        }
                        else if (text.includes(this.hotNewsData.paginatorLabel)) {
                            cy.log('Number for 100 per page: less or 1')
                        }
                        else {
                            cy.log('Number for 100 per page: INCORRECT')
                        }
                    })
                })
            }
            //For ONE page
            else {
                cy.log("ONE page assertion!!!")
                dashlets.elements.getNextPageButton().should('have.class', this.hotNewsData.disabledButton)
                dashlets.elements.getLastPageButton().should('have.class', this.hotNewsData.disabledButton)

            }
        })
    })
    it("SAP HotNews editing", function () {
        cy.wait(6000)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(200).click()
        cy.wait(5000)
        dashboards.clickEditDashboard()
        cy.wait(2000)
        dashlets.openDashletSettings()
        cy.wait(600)


        dashlets.openSettingDropdownByTitle(this.hotNewsData.settingPriority)
        dashlets.selectDropdownItem(this.hotNewsData.valuePriorityEdited)
        dashboards.saveDashboard()
        cy.wait(800)

        cy.reload()
        dashlets.elements.getTableRows().find('tr').should('have.length', 26)
        // Check the titles, note numbers, statuses, components, relevant for
    })
})
