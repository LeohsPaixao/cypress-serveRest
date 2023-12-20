import { faker } from '@faker-js/faker';

function createUserAdm() {
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
      "administrador": "true"
    }
  }).then((response) => {
    // Parseia a string JSON do responseBody para um objeto
    const requestBodyData = JSON.parse(response.requestBody);

    // Retorna os dados do usuário separadamente
    return {
      nome: requestBodyData.nome,
      email: requestBodyData.email,
      password: requestBodyData.password,
      administrador: requestBodyData.administrador
    };
  });
}

export default createUserAdm;
