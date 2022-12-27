/// <reference types="cypress" />

import Checklist from "../../pageObjects/Checklist.js";
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();
const checklist = new Checklist();

describe("Check list: create, assert, edit, delete", { defaultCommandTimeout: 5000 }, () => {
    // before(function () {
    //     cy.fixture("Credentials").as("creds")
    // })
    beforeEach(function () {
        // DO NOT FORGET TO USE YOUR CREDS!!!!!!
        cy.fixture("Credentials")
        .then((creds) => {
            this.creds = creds
            let envServer = this.creds.env;
            let localUser = this.creds.login;
            let passwd = this.creds.password;
            cy.loginSession(localUser, envServer, passwd)
            cy.visit(creds.env)
        })
        cy.fixture("Dashboards").then((dashboardsData) => {
            this.dashboardsData = dashboardsData
        })
        cy.fixture("Checklist").then((checklistData) => {
            this.checklistData = checklistData
        })              
    })
    let dashboardName;
    let table = []
  
    after(function() {
        // delete dashboard
        cy.wait(10000)

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
    it("Check List creation", function () {

        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(10000)
        dashboards.clearDashboardHeader()
        
        //timestamp dashboard name               
        var stamp = Math.round(+new Date() / 1000);
        let dashname = this.checklistData.dashboardName+stamp
        cy.log(dashname)
        dashboards.elements.getDashboardHeader().type(dashname)
        dashboards.clickAddDashletButton()
        checklist.addCheckListDashlet()
        cy.wait(2000)

        dashlets.elements.getSubtitle().type(this.checklistData.subtitle)
        checklist.openCheckSelectorDropdown()
        checklist.elements.getCheckSelectorItem().contains(this.checklistData.checkSelector).click()
        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(800)
        dashboards.saveDashboard()
        cy.wait(8000)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashname)
            .then(() => {
                dashboardName = dashname;
            })
        // cy.reload()
        // cy.wait(600)
        // dashboards.elements.getDashboardNameAtNavmenu().contains('a', dashname)
        //         .wait(200).click()
        dashlets.elements.getTableRow().each(($el) => {
            cy.get($el).should('have.css', this.checklistData.colorCss, this.checklistData.notHoverCss)
            cy.get($el).realHover().wait(200)
            cy.get($el).should('have.css', this.checklistData.colorCss, this.checklistData.hoverCss)
        })
        })
    it("Check list assertions created", function () {

        cy.wait(800)
        dashboards.elements.getDashboardNameAtNavmenu().contains('a', dashboardName)
            .wait(2000).click()
       dashboards.elements.getDashletCardTitle().should('have.text', this.checklistData.dashletDefTitle)
        checklist.elements.getStatusIconAndName()
            .contains(this.checklistData.warningCheck)
            .siblings('img')
            .should('have.attr', 'src', this.checklistData.warningStatus)
        checklist.elements.getStatusIconAndName()
            .contains(this.checklistData.critCheck)
            .siblings('img')
            .should('have.attr', 'src', this.checklistData.critStatus)
        checklist.elements.getStatusIconAndName()
            .contains(this.checklistData.okCheck)
            .siblings('img')
            .should('have.attr', 'src', this.checklistData.okStatus)
            checklist.elements.getStatus()
            .contains(this.checklistData.okCheck).parents('.mat-table tr.mat-row').within(() => {
                checklist.elements.getCheckResult()
                .should(($span) => {
                    expect($span.text()).to.contain(this.checklistData.agentaliveOkResult);
                })
            })
            
            
    })

})