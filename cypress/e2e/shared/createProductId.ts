import { faker } from '@faker-js/faker';

/**
 * Função para criar um novo ID de produto.
 * @param {number} quantity - A quantidade de produtos a serem criados.
 * @returns {Cypress.Chainable<string>} - O objeto encadeável do ID do produto.
 * @example
 * // Para criar um novo ID de produto:
 * createProductId();
 */
export default function createProductId(quantity: number = faker.number.int({ min: 50, max: 500 })): Cypress.Chainable<string> {
  const name = faker.commerce.productName() + Cypress._.random(1, 854758564);
  const price = faker.commerce.price({ min: 50, max: 250, dec: 0 });
  const descriptions = faker.commerce.productDescription();

  return cy
    .request({
      log: true,
      failOnStatusCode: true,
      method: 'POST',
      url: '/produtos',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: window.localStorage.getItem('token') || '',
      },
      body: {
        nome: name,
        descricao: descriptions,
        preco: price,
        quantidade: quantity,
      },
    })
    .then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');

      const id = response.body._id as string;
      return cy.wrap(id);
    });
}
