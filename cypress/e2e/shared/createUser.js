import { faker } from '@faker-js/faker';

function createUser() {
  const randomEmail = faker.internet.email();
  const username = faker.internet.userName();
  const password = faker.internet.password();

  return cy.request({
    log: true,
    failOnStatusCode: false,
    method: 'POST',
    url: '/usuarios',
    headers: {
      "accept": "application/json",
      "content-type": "application/json"
    },
    body: {
      "nome": username,
      "email": randomEmail,
      "password": password,
      "administrador": "false"
    }
  }).then((response) => {
    console.log(response);
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Cadastro realizado com sucesso");

    const id = response.body._id;
    return cy.wrap(id);
  });
}

export default createUser;