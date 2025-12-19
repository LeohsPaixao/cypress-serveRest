import { faker } from '@faker-js/faker';

/**
 * Função para criar um novo ID de usuário.
 * @returns {Cypress.Chainable<string>} - O objeto encadeável do ID do usuário.
 * @example
 * // Para criar um novo ID de usuário:
 * createUserId();
 */
export default function createUserId(): Cypress.Chainable<string> {
  const email = faker.internet.email();
  const username = faker.internet.username();
  const password = faker.internet.password();

  return cy
    .request({
      log: true,
      failOnStatusCode: false,
      method: 'POST',
      url: '/usuarios',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: {
        nome: username,
        email,
        password,
        administrador: 'false',
      },
    })
    .then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');

      const id = response.body._id as string;
      return cy.wrap(id);
    });
}
