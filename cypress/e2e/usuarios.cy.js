import { faker } from '@faker-js/faker';
import { apiRequest } from './shared/apiRequest';
import createUserId from './shared/createUserId';

describe("Teste de Usuários via API", () => {

  beforeEach(() => {
    cy.login({ admin: true });
  });

  it("Deve listar todos os usuários", () => {
    apiRequest({ method: 'GET', url: '/usuarios' })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
      });
  });

  it("Deve cadastrar um novo usuário", () => {
    const randomEmail = faker.internet.email();

    apiRequest({
      method: 'POST',
      url: '/usuarios',
      body: {
        "nome": "Fulana da Silva",
        "email": randomEmail,
        "password": "<PASSWORD>",
        "administrador": "true"
      }
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.include("Cadastro realizado com sucesso");
    });
  });

  it("Deve exibir uma mensagem ao tentar cadastrar usuário com email duplicado", () => {
    apiRequest({
      method: 'POST',
      url: '/usuarios',
      body: {
        "nome": "Fulana da Silva",
        "email": "fulano@qa.com",
        "password": "<PASSWORD>",
        "administrador": "true"
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.include("Este email já está sendo usado");
    });
  });

  it("Deve buscar um usuário pelo ID", () => {
    const userID = "0uxuPY0cbmQhpEz1";

    apiRequest({
      method: 'GET',
      url: `/usuarios/${userID}`
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('_id', userID);
    });
  });

  it("Deve exibir uma mensagem ao não encontrar o usuário na busca", () => {
    apiRequest({
      method: 'GET',
      url: `/usuarios/${faker.string.uuid()}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.include("Usuário não encontrado");
    });
  });

  it("Deve excluir um usuário", () => {
    createUserId().then((userID) => {
      return apiRequest({
        method: 'DELETE',
        url: `/usuarios/${userID}`
      });
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.include("Registro excluído com sucesso");
    });
  });

  it("Deve editar um usuário", () => {
    const randomEmail = faker.internet.email();
    const username = faker.internet.userName();
    const password = faker.internet.password();

    createUserId().then((userID) => {
      return apiRequest({
        method: 'PUT',
        url: `/usuarios/${userID}`,
        body: {
          "nome": username,
          "email": randomEmail,
          "password": password,
          "administrador": "true",
        }
      });
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.include("Registro alterado com sucesso");
    });
  });

  it("Deve exibir uma mensagem ao tentar editar com email existente", () => {
    createUserId().then((userID) => {
      return apiRequest({
        method: 'PUT',
        url: `/usuarios/${userID}`,
        body: {
          "nome": "Fulana da Silva",
          "email": "fulano@qa.com",
          "password": "<PASSWORD>",
          "administrador": "true",
        },
        failOnStatusCode: false
      });
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.include("Este email já está sendo usado");
    });
  });
});
