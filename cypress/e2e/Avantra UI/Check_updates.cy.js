/// <reference types="cypress" />

import CheckUpd from "../../pageObjects/Check_updates.js";
import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";

const dashboards = new Dashboards()
const dashlets = new Dashlets()
const checkUpd = new CheckUpd()
let dashName

describe("Check for updates: create, assert, edit, delete", { defaultCommandTimeout: 7000 }, () => {
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
        cy.fixture("Check_updates").then((checkUpdData) => {
            this.checkUpdData = checkUpdData
        })      
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })         
    })
    let dashboardName;
    let table = []
  
    after(function() {
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
    it("Check for updates creation", function () {

        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(5000)
        dashboards.clearDashboardHeader()
        
        //timestamp dashboard name               
              
        cy.stampDashName(this.checkUpdData.dashboardName).then(($el) => {
            dashName = $el.toString()
            cy.log(dashName)
            dashboards.elements.getDashboardHeader().type(dashName)
        })
        
        dashboards.clickAddDashletButton()
        dashlets.addDashlet(this.checkUpdData.dashletDefTitle)
        cy.wait(2000)

        dashlets.elements.getSubtitle().type(this.checkUpdData.subtitle)
        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(800)
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashName)
            .then(() => {
                dashboardName = dashName;
            })
            dashlets.elements.getTableRow().each(($el) => {
                cy.get($el).should('have.css', this.dashletsData.colorCss, this.dashletsData.notHoverCss)
                cy.get($el).realHover().wait(200)
                cy.get($el).should('have.css', this.dashletsData.colorCss, this.dashletsData.hoverCss)
            })
        })
    it("Check for updates assertions created", function () {

        cy.wait(800)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(2000).click()
            dashboards.elements.getDashletCardTitle().should('have.text', this.checkUpdData.dashletDefTitle)
        table = this.checkUpdData.tableData
        let tableValues = []
        checkUpd.elements.getTableCell().each(($el) => {
            cy.get($el).invoke('text').then((text) => {
                let txtValues = text.trim()
                tableValues.push(txtValues)
            })
        })
        cy.wrap(tableValues).then(() => {
            if (JSON.stringify(tableValues.sort()) === JSON.stringify(table.sort())) {
                cy.log('Table is verified!')
            }
        })
    })






})
