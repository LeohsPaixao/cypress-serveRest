import { faker } from '@faker-js/faker'
import createProductId from './createProductId'

function createTrolley() {
  const randomAmount = faker.number.int({ min: 2, max: 10 });
  let productIds = [];
  let amounts = [];

  Cypress._.times(1, () => {
    amounts.push(randomAmount);

    createProductId().then(
      (id) => {
        productIds.push(id);
      },
      (error) => {
        // Lidar com erros ao obter IDs dos produtos
        console.error('Erro ao obter ID do produto:', error);
      }
    );
  });

  return cy.wrap(productIds).then((productIds) => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'POST',
      url: '/carrinhos',
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": localStorage.getItem('token')
      },
      body: {
        "produtos": productIds.map((id, index) => ({
          "idProduto": id,
          "quantidade": amounts[index]
        }))
      }
    }).then((response) => {
      const id = response.body._id;

      return cy.wrap(id)
    });
  });
}

export default createTrolley;