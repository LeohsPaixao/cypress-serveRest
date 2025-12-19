import { faker } from '@faker-js/faker';

import type { UserData } from '../../support/types/api';

/**
 * Função para criar um novo usuário administrador.
 * @returns {Cypress.Chainable<UserData>} - O objeto encadeável do usuário administrador.
 * @example
 * // Para criar um novo usuário administrador:
 * createUserAdm();
 */
export default function createUserAdm(): Cypress.Chainable<UserData> {
  const email = faker.internet.email();
  const username = faker.internet.username();
  const password = faker.internet.password();

  // Armazena os dados do usuário antes da requisição
  const userData: UserData = {
    nome: username,
    email,
    password,
    administrador: 'true',
  };

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
      body: userData,
    })
    .then(() => {
      // Retorna os dados do usuário que foram enviados na requisição
      return cy.wrap(userData);
    });
}
