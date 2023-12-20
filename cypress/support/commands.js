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

import createUserAdm from '../e2e/shared/createUserAdm';

Cypress.Commands.add('login', () => {
  // Cria o usuário primeiro
  return createUserAdm().then((userData) => {
    // Use os dados do usuário conforme necessário
    const emailUsuario = userData.email;
    const senhaUsuario = userData.password;

    // Agora, faz a requisição para login
    return cy.request({
      failOnStatusCode: true,
      method: 'POST',
      url: '/login',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "email": emailUsuario,
        "password": senhaUsuario
      },
    });
  }).then((response) => {
    localStorage.setItem('token', response.body.authorization);
    expect(localStorage.getItem('token')).not.null;
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Login realizado com sucesso");
  });
});

