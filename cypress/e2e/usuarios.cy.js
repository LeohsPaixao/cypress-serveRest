import { faker } from '@faker-js/faker';
import createUser from './shared/createUser';

describe(" Teste de Usuários via API", () => {

  beforeEach(() => {
    cy.login();
  });

  it("Deve ser listados todos usuário", () => {
    cy.request({
      log: true,
      failOnStatusCode: true,
      method: 'GET',
      url: '/usuarios',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
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
      failOnStatusCode: true,
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
      failOnStatusCode: true,
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
    let userID;

    // Cria o usuário primeiro
    return createUser().then((id) => {
      userID = id;

      // Agora, faz a requisição para excluir o usuário
      return cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'DELETE',
        url: `/usuarios/${userID}`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
      });
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Registro excluído com sucesso");
    });
  });


  it("Deve editar um usuário", () => {
    const randomEmail = faker.internet.email();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    let userID;

    // Cria o usuário primeiro
    return createUser().then((id) => {
      userID = id;

      // Agora, faz a requisição para editar o usuário
      return cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'PUT',
        url: `/usuarios/${userID}`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: {
          "nome": username,
          "email": randomEmail,
          "password": password,
          "administrador": "true",
        }
      });
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Registro alterado com sucesso");
    });
  });

  it("Deve ser exibida uma mensagem caso coloque um email existente na edição do usuário", () => {
    let userID;

    // Cria o usuário primeiro
    return createUser().then((id) => {
      userID = id;

      // Tenta editar o usuário com um email existente
      return cy.request({
        log: true,
        failOnStatusCode: false,
        method: 'PUT',
        url: `/usuarios/${userID}`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: {
          "nome": "Fulana da Silva",
          "email": "fulano@qa.com",
          "password": "<PASSWORD>",
          "administrador": "true",
        }
      });
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Este email já está sendo usado");
    });
  });
})