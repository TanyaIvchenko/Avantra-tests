/// <reference types="cypress" />

import Dashboards from "../../pageObjects/Dashboards.js";
import Dashlets from "../../pageObjects/Dashlets.js";
import MultiRtmStat from "../../pageObjects/MultiRtmStat.js";

const dashboards = new Dashboards();
const dashlets = new Dashlets();
// const multiRtmStat = new MultiRtmStat();
// let dashName

describe("Multi-RTM status: create, assert, edit, delete", { defaultCommandTimeout: 7000 }, () => {
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
        cy.fixture("MultiRtmStat").then((multiRtmStatData) => {
            this.multiRtmStatData = multiRtmStatData
        }) 
        cy.fixture("Dashlets").then((dashletsData) => {
            this.dashletsData = dashletsData
        })        
                     
    })
    let dashboardName;
    let dashboardID
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

    it("Multi RTM Status creation", function () {
        dashboards.elements.getDashboardsTitle().should('have.text', this.dashboardsData.title)
        cy.wait(2000)
        dashboards.clickCreateDashboard()
        cy.wait(5000)
        dashboards.clearDashboardHeader()
        
        //timestamp dashboard name and typing it to dashboard name         
              
        cy.stampDashName(this.multiRtmStatData.dashboardName).then(($el) => {
            dashboardName = $el.toString().trim()
            cy.log(dashboardName)
            dashboards.elements.getDashboardHeader().type(dashboardName)
        })
        cy.wait(600)       
        dashboards.clickAddDashletButton()
        dashlets.addDashlet(this.multiRtmStatData.dashletDefTitle)
        cy.wait(2000)

        cy.wait(600)
        dashlets.openSettingDropdownByTitle(this.multiRtmStatData.paramCheckSelector)
        dashlets.elements.getCheckSelectorItem().contains(this.multiRtmStatData.checkSelector).click()
        cy.wait(600)
        dashlets.saveDashlet()
        cy.wait(800)
        dashboards.saveDashboard()
        cy.wait(8000)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)
          
        cy.wait(1000)
        

    })
    it('Dashboard ID', function() {
        cy.request({
            method: 'POST',
            url: 'https://gotham.dev.gcp.avantra.net:8443/xn/api/graphql/',
            encoding: 'binary',
            headers: {
                'User-Agent': 'PostmanRuntime/7.31.1',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': 'Basic YWx3OjEyMDRReWI5bWptYg==',
                'Cookie': 'JSESSIONID=node09ytz4hf0hbo47x76msq3iepk87.node0',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            },
            body: {
                query: `
                query GetDashboards {
                    dashboards {
                      totalElements
                      items {
                        id
                        name
                        description
                        __typename
                      }
                      __typename
                    }
                  }
              `,
              
            },
            failOnStatusCode: false
        })
            .then((resp) => {
                const respArray = resp.body.data.dashboards.items;

                var result = respArray.find(item => item.name === dashboardName)
                console.log("HERE IS ARRAY!" + result.id)
                dashboardID = result.id
            })

        
        
    })

    
    it("Created dashboard assertions", function() {
        let dashletData
        let okNumber
        let critNumber
        cy.wait(800)
        //assert OK checks count

        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(2000)
            .click()
        dashboards.elements.getDashletCardTitle().should('have.text', this.multiRtmStatData.dashletDefTitle)
        dashlets.elements.getDashletHeadline().invoke('text')
            .then(txt => {
                cy.log(txt);
                expect(txt).to.include(this.multiRtmStatData.checkSelector);
            })
        cy.log('Check selector headline is present')
        cy.request({
            method: 'POST',
            url: 'https://gotham.dev.gcp.avantra.net:8443/xn/api/graphql/',
            encoding: 'binary',
            headers: {
                'User-Agent': 'PostmanRuntime/7.31.1',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': 'Basic YWx3OjEyMDRReWI5bWptYg==',
                'Cookie': 'JSESSIONID=node09ytz4hf0hbo47x76msq3iepk87.node0',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            },
            body: {
                query: `
                query dashboardValues ($dashboardId: ID!) {
                    dashboardValues (dashboardId: $dashboardId) {
                        uuid
                        data
                        dashletClass
                    }
                }
              `,
              variables: {
                "dashboardId": dashboardID
              }
            },
            failOnStatusCode: false
        })
            .then((resp) => {
                // NOT READY YET!!!!!!
                 const respArray2 = resp.body.data.dashboardValues

                console.log("HERE IS DATA!" + respArray2[0].data)
                dashletData = JSON.parse(respArray2[0].data)
                cy.log("HERE IS SUBT " + dashletData.subtitle)
                okNumber = dashletData.okCount
                critNumber = dashletData.critCount
                cy.log("NUMBER " + okNumber)
                dashlets.elements.getCheckCountByStatus().each(($el) => {
                cy.get($el).invoke('text').then((txt) =>{
                    let txtNumber = txt.trim()
                    if (txtNumber == okNumber) {
                        cy.log("Number of OK checks verified")
                    } else {throw new Error("Number of OK checks failed")}
                    if (txtNumber == critNumber) {
                        cy.log("Number of CRIT checks verified")
                    } else {throw new Error("Number of CRIT checks failed")}
                })
            })
            })
        dashlets.elements.getChartTitle().should('have.text', this.multiRtmStatData.graphTitle)

        dashlets.elements.getCheckCountByStatus().each(($el) => {
            cy.get($el).invoke('text').then(() => {
                let txtCount = $el.text()
                txtCount = parseInt(txtCount)
                // if checks count is more than 0, then verify the statuses
                if (txtCount > 0) {
                    cy.get($el).siblings('.status-card__content-names-status-type')
                        .invoke('text').then(text => {
                            let status = text.trim();
                            cy.log('status is: ' + status);
                            dashlets.elements.getChartBar()
                                .then(() => {
                                    //  Verify the bars' colors are correct and visible (visisbility is not verified yet)
                                    if (status == "Ok") {
                                        cy.log('OK is present')
                                        dashlets.elements.getBarStatusOk()
                                            .should('have.class', this.dashletsData.OkBarClass)
                                            .and('be.visible')

                                        dashlets.elements.getBarStatusOk().realHover()
                                        // tooltip is visible
                                        dashlets.elements.getBarTooltip().should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        dashlets.elements.getBarTooltipCount()
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })

                                    } else if (status == "Warning") {
                                        cy.log('WARNING is present')
                                        dashlets.elements.getBarStatusWarn()
                                            .should('have.class', this.dashletsData.WarnBarClass)
                                            .and('be.visible')
                                        dashlets.elements.getBarStatusWarn().realHover()

                                        // tooltip is visible
                                        dashlets.elements.getBarTooltip().should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        dashlets.elements.getBarTooltipCount()
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })
                                    } else if (status == "Critical") {
                                        cy.log('CRITICAL is present')
                                        dashlets.elements.getBarStatusCrit()
                                            .should('have.class', this.dashletsData.CritBarClass)
                                            .and('be.visible')
                                            dashlets.elements.getBarStatusCrit().realHover()

                                        // tooltip is visible
                                        dashlets.elements.getBarTooltip().should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        dashlets.elements.getBarTooltipCount()
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })
                                    } else cy.log('Other status is present ' + status)
                                });

                        });
                } else {
                    // other numbers are greyed out
                    cy.get($el).should('have.class', this.multiRtmStatData.greyedNumbersClass)
                    cy.get($el).siblings('.status-card__content-names-status-type')
                        .invoke('text').then(text => {
                            let status = text.trim();
                            cy.log('status is: ' + status);
                            dashlets.elements.getChartBar()
                                .then(() => {
                                    //  Verify the bars' colors are correct and visible (visisbility is not verified yet)
                                    if (status == "Ok") {
                                        cy.log('OK is NOT present')
                                        // cy.get('.highcharts-bar-series .highcharts-color-0').should('have.css', 'height', '0')
                                        // cy.log('css')
                                        dashlets.elements.getBarStatusOk().should('have.attr', 'height', '0')
                                        cy.log('attr')

                                    } else if (status == "Warning") {
                                        cy.log('WARNING is NOT present')
                                        dashlets.elements.getBarStatusWarn().should('have.attr', 'height', '0')

                                    } else if (status == "Critical") {
                                        cy.log('CRITICAL is NOT present')
                                        dashlets.elements.getBarStatusCrit().should('have.attr', 'height', '0')

                                    } else cy.log('Other status is found NOT visible ' + status)
                                });

                        });
                };
            })

        })
    })
    xit("Multi RTM Status editing", function() {
        cy.wait(800)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(2000)
            .click()
        cy.wait(1000)
        dashboards.clickEditDashboard()
        cy.wait(7000)
        dashlets.openDashletSettings()
        cy.wait(600)

        dashlets.elements.getTitle().clear().type(this.dashletsData.titleEdited)
        dashlets.elements.getSubtitle().clear().type(this.dashletsData.subtitleEdited)
        cy.wait(600)
        dashlets.openSettingDropdownByTitle(this.multiRtmStatData.paramRefreshInterval)
        dashlets.elements.getRefreshIntervalValue().contains('1 minute').click()
        cy.wait(300)


        dashlets.openSettingDropdownByTitle(this.multiRtmStatData.paramCheckSelector)
        dashlets.elements.getCheckSelectorItem().contains(this.multiRtmStatData.checkSelectorEdited).click()

        dashlets.openSystemPredefinedDropdown()
        dashlets.elements.getSystemPredefinedValue().contains(this.multiRtmStatData.systemPredefinedEdited).click()
        //radiobuttons
        dashlets.elements.getRadioButtonMark(this.multiRtmStatData.radioButtonPredefinedTitle).should('be.checked')
        dashlets.elements.getRadioButtonMark(this.multiRtmStatData.radioButtonAdhocTitle).should('not.be.checked')

        dashlets.openSettingDropdownByTitle(this.multiRtmStatData.paramNoDataStatusTitle)
        dashlets.elements.getSettingDropdownByTitle(this.multiRtmStatData.paramNoDataStatusTitle).then(($el) => {
            cy.wrap($el).contains(this.multiRtmStatData.noDataStatusValue).click()
        })
           
            
        //checkbox
        dashlets.elements.getCheckboxByLabel(this.multiRtmStatData.checkboxIncludeUnknown).click()

        dashlets.elements.getCheckmarkByLabel(this.multiRtmStatData.checkboxIncludeUnknown).should('be.checked')

        dashlets.openSettingDropdownByTitle(this.multiRtmStatData.paramChartType)
        dashlets.elements.getSettingDropdownByTitle(this.multiRtmStatData.paramChartType)
            .contains(this.multiRtmStatData.chartTypeValue)
            .click()
        
            dashlets.openSettingDropdownByTitle(this.multiRtmStatData.paramCheckConfirm)
            dashlets.elements.getSettingDropdownByTitle(this.multiRtmStatData.paramCheckConfirm)
                .contains(this.multiRtmStatData.paramCheckConfirmValue)
                .click()

        cy.wait(600)
        
        dashboards.saveDashboard()
        cy.wait(800)
        dashboards.elements.getUpdatedData().should('have.text', this.dashboardsData.updatedTime)
        cy.log(dashboardName)
            
    })
    xit("Edited dashboard assertions", function() {
        cy.wait(800)
        dashboards.elements.getDashboardNameAtNavmenu()
            .contains('a', dashboardName)
            .wait(2000)
            .click()
        cy.wait(1000)
        
        dashboards.elements.getDashboardName().should('contain', dashboardName)

        dashlets.elements.getDashletCardTitle().should('have.text', this.dashletsData.titleEdited)

        dashlets.elements.getDashletHeadline().should('contain',this.multiRtmStatData.checkSelectorEdited);
        cy.log('Check selector is present')

        dashlets.elements.getChartTitle().should('have.text', this.multiRtmStatData.graphTitle)
        cy.log('Checks title is present')

       
        dashlets.elements.getCheckCountByStatus().each(($el) => {
            cy.get($el).invoke('text').then(() => {
                let txtCount = $el.text()
                txtCount = parseInt(txtCount)
                // if checks count is more than 0, then verify the statuses
                if (txtCount > 0) {
                    cy.get($el).siblings('.status-card__content-names-status-type')
                        .invoke('text').then(text => {
                            let status = text.trim();
                            cy.log('status is: ' + status);
                            dashlets.elements.getPiePiece()
                                .then(() => {
                                    //  Verify the bars' colors are correct and visible (visisbility is not verified yet)
                                    if (status == "Ok") {
                                        cy.log('OK is present')
                                        dashlets.elements.getPieStatusOk()
                                            .should('have.class', this.dashletsData.OkBarClass)
                                            .and('be.visible')

                                        dashlets.elements.getPieStatusOk().realHover()
                                        // tooltip is visible
                                        dashlets.elements.getBarTooltip().should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        dashlets.elements.getBarTooltipCount()
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })

                                    } else if (status == "Warning") {
                                        cy.log('WARNING is present')
                                        dashlets.elements.getPieStatusWarn()
                                            .should('have.class', this.dashletsData.WarnBarClass)
                                            .and('be.visible')
                                        dashlets.elements.getPieStatusWarn().realHover()

                                        // tooltip is visible
                                        dashlets.elements.getBarTooltip().should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        dashlets.elements.getBarTooltipCount()
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })
                                    } else if (status == "Critical") {
                                        cy.log('CRITICAL is present')
                                        dashlets.elements.getPieStatusCrit()
                                            .should('have.class', this.dashletsData.CritBarClass)
                                            .and('be.visible')
                                            dashlets.elements.getPieStatusCrit().realHover()

                                        // tooltip is visible
                                        dashlets.elements.getBarTooltip().should('be.visible')
                                        cy.log(txtCount)
                                        // tooltip number is the same as for checks
                                        dashlets.elements.getBarTooltipCount()
                                            .should(($tooltipCount) => {
                                                expect(parseInt($tooltipCount.text())).to.be.equal(txtCount)
                                            })
                                    } else cy.log('Other status is present ' + status)
                                });

                        });
                } else {
                    // other numbers are greyed out
                    cy.get($el).should('have.class', this.multiRtmStatData.greyedNumbersClass)
                    cy.get($el).siblings('.status-card__content-names-status-type')
                        .invoke('text').then(text => {
                            let status = text.trim();
                            cy.log('status is: ' + status);
                           

                        });
                };
            })

        })
    })
})