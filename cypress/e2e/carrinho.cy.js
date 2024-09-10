import { faker } from '@faker-js/faker';
import { apiRequest } from './shared/apiRequest'; // Importe a função apiRequest
import createProductId from './shared/createProductId';
import createTrolley from './shared/createTrolley';

const randomAmount = faker.number.int({ min: 2, max: 10 });

describe("Testes de carrinho via API", () => {
  context("Admin", () => {
    beforeEach(() => {
      cy.login({ admin: true });
    });

    it("Deve listar os carrinhos cadastrados", () => {
      apiRequest({
        method: 'GET',
        url: '/carrinhos',
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it("Deve cadastrar um novo carrinho", () => {
      let productIds = [];
      let amounts = [];

      Cypress._.times(3, () => {
        amounts.push(randomAmount);

        createProductId().then((id) => {
          productIds.push(id);
        });
      });

      cy.wrap(productIds).then((productIds) => {
        apiRequest({
          method: 'POST',
          url: '/carrinhos',
          body: {
            "produtos": productIds.map((id, index) => ({
              "idProduto": id,
              "quantidade": amounts[index]
            }))
          }
        }).then((response) => {
          expect(response.status).to.equal(201);
          expect(response.body.message).to.equal("Cadastro realizado com sucesso");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso tente colocar um produto inexistente no carrinho", () => {
      apiRequest({
        method: 'POST',
        url: '/carrinhos',
        failOnStatusCode: false,
        body: {
          "produtos": [
            {
              "idProduto": faker.string.uuid(),
              "quantidade": randomAmount
            }
          ]
        }
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Produto não encontrado");
      });
    });

    it("Deve ser exibido uma mensagem caso tente colocar dois produtos iguais no carrinho", () => {
      createProductId().then((productId) => {
        apiRequest({
          method: 'POST',
          url: '/carrinhos',
          failOnStatusCode: false,
          body: {
            "produtos": [
              { "idProduto": productId, "quantidade": randomAmount },
              { "idProduto": productId, "quantidade": randomAmount }
            ]
          }
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal("Não é permitido possuir produto duplicado");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso tente colocar um produto com quantidade zerada no carrinho", () => {
      createProductId(1).then((productId) => {
        apiRequest({
          method: 'POST',
          url: '/carrinhos',
          failOnStatusCode: false,
          body: {
            "produtos": [
              { "idProduto": productId, "quantidade": 2 }
            ]
          }
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal("Produto não possui quantidade suficiente");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso tente cadastrar sem autenticação de usuário administrador", () => {
      apiRequest({
        method: 'POST',
        url: '/carrinhos',
        failOnStatusCode: false,
        auth: false,
        body: {
          "produtos": [
            {
              "idProduto": faker.string.uuid(),
              "quantidade": randomAmount
            }
          ]
        }
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      });
    });

    it("Deve buscar um carrinho de compras", () => {
      createTrolley().then((trolleyId) => {
        apiRequest({
          method: 'GET',
          url: `/carrinhos/${trolleyId}`,
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      });
    });

    it("Deve ser exibido uma mensagem caso o carrinho não seja encontrado", () => {
      apiRequest({
        method: 'GET',
        url: `/carrinhos/${faker.string.uuid()}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Carrinho não encontrado");
      });
    });

    it("Deve concluir com compra e excluir o carrinho", () => {
      createTrolley().then(() => {
        apiRequest({
          method: 'DELETE',
          url: `/carrinhos/concluir-compra`,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal("Registro excluído com sucesso");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso não encontre o carrinho do usuário", () => {
      apiRequest({
        method: 'DELETE',
        url: `/carrinhos/concluir-compra`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Não foi encontrado carrinho para esse usuário");
      });
    });

    it("Deve ser exibido uma mensagem caso tente concluir uma compra sem autenticação do usuário administrador", () => {
      apiRequest({
        method: 'DELETE',
        url: `/carrinhos/concluir-compra`,
        failOnStatusCode: false,
        auth: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      });
    });

    it("Deve cancelar uma compra", () => {
      createTrolley().then(() => {
        apiRequest({
          method: 'DELETE',
          url: `/carrinhos/cancelar-compra`,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.equal("Registro excluído com sucesso. Estoque dos produtos reabastecido");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso não encontre o carrinho do usuário para cancelar a compra", () => {
      apiRequest({
        method: 'DELETE',
        url: `/carrinhos/cancelar-compra`,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Não foi encontrado carrinho para esse usuário");
      });
    });

    it("Deve ser exibido uma mensagem caso tente cancelar uma compra sem a autenticação do usuário administrador", () => {
      apiRequest({
        method: 'DELETE',
        url: `/carrinhos/cancelar-compra`,
        failOnStatusCode: false,
        auth: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      });
    });
  });
});
