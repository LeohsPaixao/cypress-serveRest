import { faker } from '@faker-js/faker';

function createProduct() {
  const name = faker.commerce.productName();
  const price = faker.commerce.price({ min: 50, max: 250, dec: 0 });
  const descritions = faker.commerce.productDescription();
  const amount = faker.number.int({ min: 50, max: 500 });

  cy.request({
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
      "quantidade": amount
    }
  }).then((response) => {
    console.log(response);
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Cadastro realizado com sucesso");
  });
}

export default createProduct;