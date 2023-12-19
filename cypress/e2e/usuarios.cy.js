import { faker } from '@faker-js/faker';
import createUser from './shared/createUser';

describe(" Teste de Usuários via API", () => {

  let userID;

  beforeEach(() => {
    cy.login();

    return createUser().then((id) => {
      userID = id;
    });
  });

  it("Deve ser listados um usuário", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'GET',
      url: '/usuarios',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "quantidade": 1,
        "usuarios": [
          {
            "nome": "Fulana da Silva",
            "email": "fulano@qa.com",
            "password": "teste",
            "administrador": "true",
            "_id": "0uxuPY0cbmQhpEz1"
          }
        ]
      }
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(200);
    });
  });

  it("Deve cadatrar um novo usuario", () => {
    const randomEmail = faker.internet.email();

    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'POST',
      url: '/usuarios',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "nome": "Fulana da Silva",
        "email": randomEmail,
        "password": "<PASSWORD>",
        "administrador": "true"
      }
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    })
  });

  it("Deve ser exibido uma mensagem caso o email informado seja igual de um usuário já cadastro", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'POST',
      url: '/usuarios',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "nome": "Fulana da Silva",
        "email": "fulano@qa.com",
        "password": "<PASSWORD>",
        "administrador": "true"
      }
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Este email já está sendo usado");
    })
  });

  it("Deve buscar um usuários pelo ID", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'GET',
      url: '/usuarios/0uxuPY0cbmQhpEz1',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "quantidade": 1,
        "usuarios": [
          {
            "nome": "Fulana da Silva",
            "email": "fulano@qa.com",
            "password": "<PASSWORD>",
            "administrador": "true",
            "_id": "0uxuPY0cbmQhpEz1"
          }
        ]
      }
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(200);
    });
  });

  it("Deve ser exibido uma mensagem caso o usuário não é encontrado na buscar", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'GET',
      url: '/usuarios/0uxuPY0cbmQhpEz2',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "quantidade": 1,
        "usuarios": [
          {
            "nome": "Fulana da Silva",
            "email": "fulano@qa.com",
            "password": "<PASSWORD>",
            "administrador": "true",
            "_id": "0uxuPY0cbmQhpEz1"
          }
        ]
      }
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Usuário não encontrado");
    })
  });

  it("Deve excluir um usuário", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'DELETE',
      url: `/usuarios/${userID}`,
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "quantidade": 1,
        "usuarios": [
          {
            "nome": "Fulana da Silva",
            "email": "fulano@qa.com",
            "password": "<PASSWORD>",
            "administrador": "true",
            "_id": "0uxuPY0cbmQhpEz1"
          }
        ]
      }
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Registro excluído com sucesso");
    })
  });
})