// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.Commands.add('login', () => {
  cy.request({
    log: true,
    failOnStatusCode: true,
    method: 'POST',
    url: '/login',
    headers: {
      "accept": "application/json",
      "content-type": "application/json"
    },
    body: {
      "email": "fulano@qa.com",
      "password": "teste"
    },
  }).then((response) => {
    console.log(response);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Login realizado com sucesso");
  });
})