import { faker } from '@faker-js/faker';

import createProductId from './createProductId';

/**
 * Função para criar um novo carrinho.
 * @returns {Cypress.Chainable<string>} - O objeto encadeável do ID do carrinho.
 * @example
 * // Para criar um novo carrinho:
 * createTrolley();
 */
export default function createTrolley(): Cypress.Chainable<string> {
  const randomAmount = faker.number.int({ min: 2, max: 10 });
  const productIds: string[] = [];
  const amounts: number[] = [];

  Cypress._.times(1, () => {
    amounts.push(randomAmount);

    createProductId().then((id: string) => productIds.push(id));
  });

  return cy.wrap(productIds).then((wrappedProductIds: string[]) => {
    return cy
      .request({
        log: true,
        failOnStatusCode: false,
        method: 'POST',
        url: '/carrinhos',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: window.localStorage.getItem('token') || '',
        },
        body: {
          produtos: wrappedProductIds.map((id, index) => ({
            idProduto: id,
            quantidade: amounts[index],
          })),
        },
      })
      .then((response) => {
        const id = response.body._id as string;
        return cy.wrap(id);
      });
  });
}
