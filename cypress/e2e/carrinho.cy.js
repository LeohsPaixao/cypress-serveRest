import { faker } from '@faker-js/faker';
import createProductId from './shared/createProductId'
import createTrolley from './shared/createTrolley';

const randomAmount = faker.number.int({ min: 2, max: 10 });

describe("Testes de carrinho via API", () => {

  context("Admin", () => {
    beforeEach(() => {
      cy.login({ admin: true });
    })

    it("Deve listar os carrinho cadastrado", () => {
      cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'GET',
        url: '/carrinhos',
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        }
      }).then((response) => {
        console.log(response);
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
        cy.request({
          log: true,
          failOnStatusCode: true,
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
          console.log(response);
          expect(response.status).to.equal(201);
          expect(response.body.message).to.equal("Cadastro realizado com sucesso");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso tente colocar um produto inexistente no carrinho", () => {
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
          "produtos": [
            {
              "idProduto": faker.string.uuid(),
              "quantidade": randomAmount
            },
          ]
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Produto não encontrado");
      });
    });

    it("Deve ser exibido uma mensagem caso tente colocar dois produtos iguais no carrinhos", () => {
      let productId;

      return createProductId().then((id) => {
        productId = id;

        return cy.request({
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
            "produtos": [
              {
                "idProduto": productId,
                "quantidade": randomAmount
              },
              {
                "idProduto": productId,
                "quantidade": randomAmount
              }
            ]
          }
        }).then((response) => {
          console.log(response);
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal("Não é permitido possuir produto duplicado");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso tente colocar um produto com quantidade zerada no carrinho", () => {
      let productId;

      return createProductId(1).then((id) => {
        productId = id;

        return cy.request({
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
            "produtos": [
              {
                "idProduto": productId,
                "quantidade": 2
              }
            ]
          }
        }).then((response) => {
          console.log(response);
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal("Produto não possui quantidade suficiente");
        });
      });
    });

    it("Deve ser exibido uma mensagem caso tente cadastrar sem autenticação de usuário administrador", () => {
      cy.request({
        log: true,
        failOnStatusCode: false,
        method: 'POST',
        url: '/carrinhos',
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: {
          "produtos": [
            {
              "idProduto": faker.string.uuid(),
              "quantidade": randomAmount
            },
          ]
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      });
    });

    it("Deve buscar um carrinho de compras", () => {
      let trolleyId;

      return createTrolley().then((id) => {
        trolleyId = id;

        return cy.request({
          log: true,
          failOnStatusCode: true,
          method: 'GET',
          url: `/carrinhos/${trolleyId}`,
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": localStorage.getItem('token')
          }
        }).then((response) => {
          console.log(response);
          expect(response.status).to.equal(200);
        });
      })
    });

    it("Deve ser exibido uma mensagem caso o carrinho não é encontrado", () => {
      cy.request({
        log: true,
        failOnStatusCode: false,
        method: 'GET',
        url: `/carrinhos/${faker.string.uuid()}`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Carrinho não encontrado");
      });
    });

    it("Deve concluir com compra e excluir o carrinho", () => {
      createTrolley()

      cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'DELETE',
        url: `/carrinhos/concluir-compra`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro excluído com sucesso");
      })
    });

    it("Deve ser exibido uma mensagem caso não encontre o carrinho do usuário", () => {
      cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'DELETE',
        url: `/carrinhos/concluir-compra`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Não foi encontrado carrinho para esse usuário");
      })
    });

    it("Deve ser exibido uma mensagem caso tente concluir uma compra sem autenticação do usuário administrador", () => {
      cy.request({
        log: true,
        failOnStatusCode: false,
        method: 'DELETE',
        url: `/carrinhos/concluir-compra`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      })
    });

    it("Deve cancelar uma compra", () => {
      createTrolley()

      cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'DELETE',
        url: `/carrinhos/cancelar-compra`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro excluído com sucesso. Estoque dos produtos reabastecido");
      })
    });

    it("Deve ser exibido uma mensagem caso não encontre o carrinho do usuário para cancelar a compra", () => {
      cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'DELETE',
        url: `/carrinhos/cancelar-compra`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Não foi encontrado carrinho para esse usuário");
      })
    });

    it("Deve ser exibido uma mensagem caso tente cancelar uma compra sem a autenticação do usuário adminstrador", () => {
      cy.request({
        log: true,
        failOnStatusCode: false,
        method: 'DELETE',
        url: `/carrinhos/cancelar-compra`,
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      })
    })
  });
})