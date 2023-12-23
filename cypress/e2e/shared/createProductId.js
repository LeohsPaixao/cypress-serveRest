import { faker } from '@faker-js/faker';

function createProductId(quantity = faker.number.int({ min: 50, max: 500 })) {
  const name = faker.commerce.productName() + Cypress._.random(1, 854758564);
  const price = faker.commerce.price({ min: 50, max: 250, dec: 0 });
  const descritions = faker.commerce.productDescription();

  return cy.request({
    log: true,
    failOnStatusCode: true,
    method: 'POST',
    url: '/produtos',
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": localStorage.getItem('token')
    },
    body: {
      "nome": name,
      "descricao": descritions,
      "preco": price,
      "quantidade": quantity
    }
  }).then((response) => {
    console.log(response);
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Cadastro realizado com sucesso");

    const id = response.body._id;
    return cy.wrap(id);
  });
}

export default createProductId;
