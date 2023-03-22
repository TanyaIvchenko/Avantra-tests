/// <reference types="cypress" />


describe("Testing GraphQL queries", () => {
    it("Query dashboard is 200", function () {
        const id = 664
        cy.request({
            method: 'POST',
            url: 'https://gotham.dev.gcp.avantra.net:8443/xn/api/graphql/',
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
              query dashboard ($id: ID!) {
                dashboard (id: $id) {
                    id
                    name
                    description
                    type
                    shared
                    custId
                    definition
                    timestamp
                }
            }
              `,
              variables: {
                id,
              }
            },
            failOnStatusCode: false
        }).its('status')
        .should('be.eq', 200)
    })

    it("Query dashboard Response", function () {
        const id = 29
        cy.request({
            method: 'POST',
            url: 'https://gotham.dev.gcp.avantra.net:8443/xn/api/graphql/',
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
              query dashboard ($id: ID!) {
                dashboard (id: $id) {
                    id
                    name
                    description
                    type
                    shared
                    custId
                    definition
                    timestamp
                }
            }
              `,
              variables: {
                id,
              }
            },
            failOnStatusCode: false
        }).then((res) => {
        expect(res.body.data.dashboard.name).to.equal("ols_charts")
        console.log(res.body.data)
    })

    })
})