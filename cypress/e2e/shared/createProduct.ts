import { faker } from '@faker-js/faker';

/**
 * Função para criar um novo produto.
 * @returns {void} - Não retorna nada.
 * @example
 * // Para criar um novo produto:
 * createProduct();
 */
export default function createProduct(): void {
  const name = faker.commerce.productName();
  const price = faker.commerce.price({ min: 50, max: 250, dec: 0 });
  const descriptions = faker.commerce.productDescription();
  const amount = faker.number.int({ min: 50, max: 500 });

  cy.request({
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
      quantidade: amount,
    },
  }).then((response) => {
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Cadastro realizado com sucesso');
  });
}
