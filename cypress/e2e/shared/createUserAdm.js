import { faker } from '@faker-js/faker';

export function createUserAdm() {
  const email = faker.internet.email();
  const username = faker.internet.userName();
  const password = faker.internet.password();

  try {
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
        "email": email,
        "password": password,
        "administrador": "true"
      }
    }).then((response) => {
      const requestBodyData = JSON.parse(response.requestBody);

      return {
        nome: requestBodyData.nome,
        email: requestBodyData.email,
        password: requestBodyData.password,
        administrador: requestBodyData.administrador
      };
    });
  } catch (e) {
    throw new Error('Não foi possivel criar um usuário Admin')
  }
}
