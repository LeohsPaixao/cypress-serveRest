import { faker } from '@faker-js/faker';
import createProduct from './shared/createProduct';

describe("Testes de produtos via API", () => {

  context("Admin", () => {
    beforeEach(() => {
      cy.login({ admin: true })
    });

    it("Deve listar todos os projetos cadatrados", () => {
      cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'GET',
        url: '/produtos',
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        },
        body: {}
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(200);
      });
    });

    it("Deve cadatrar um novo produto", () => {
      createProduct();
    });

    it("Deve ser exibido uma mensagem caso tente cadastrar um novo produto com o mesmo nome de um produto já cadastrado", () => {
      cy.request({
        log: true,
        failOnStatusCode: false,
        method: 'POST',
        url: '/produtos',
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "Authorization": localStorage.getItem('token')
        },
        body: {
          "nome": "Teste Produto02",
          "descricao": "Teste Descrição",
          "preco": 110,
          "quantidade": 110,
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Já existe produto com esse nome");
      });
    });

    it("Deve ser exibido uma mensagem caso o token tenha expirado ou inválido", () => {
      const name = faker.commerce.productName();
      const price = faker.commerce.price({ min: 50, max: 250, dec: 0 });
      const descritions = faker.commerce.productDescription();
      const amount = faker.number.int({ min: 50, max: 500 });

      cy.request({
        log: true,
        failOnStatusCode: false,
        method: 'POST',
        url: '/produtos',
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
        },
        body: {
          "nome": name,
          "descricao": descritions,
          "preco": price,
          "quantidade": amount
        }
      }).then((response) => {
        console.log(response);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais");
      });
    });
  });

  context("Normal", () => {
    beforeEach(() => {
      cy.login({ normal: true });
    });

    it("Deve ser exibido uma mensagem de rota exclusiva caso tente cadastrar um novo produto com usuario normal", () => {
      const name = faker.commerce.productName();
      const price = faker.commerce.price({ min: 50, max: 250, dec: 0 });
      const descritions = faker.commerce.productDescription();
      const amount = faker.number.int({ min: 50, max: 500 });

      cy.request({
        log: true,
        failOnStatusCode: false,
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
        expect(response.status).to.equal(403);
        expect(response.body.message).to.equal("Rota exclusiva para administradores");
      });
    })
  })
})