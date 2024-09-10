import { faker } from '@faker-js/faker';
import { apiRequest } from './shared/apiRequest';
import createProduct from './shared/createProduct';
import createProductId from './shared/createProductId';
import { generateProductData } from './shared/generateProductData';

const productData = generateProductData();

describe("Testes de produtos via API", () => {


  context("Admin", () => {
    beforeEach(() => {
      cy.login({ admin: true });
    });

    it("Deve listar todos os produtos cadastrados", () => {
      apiRequest({ method: 'GET', url: '/produtos' })
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an('object');
        });
    });

    it("Deve cadastrar um novo produto", () => {
      createProduct();
    });

    it("Deve exibir mensagem ao tentar cadastrar produto com nome duplicado", () => {
      apiRequest({
        method: 'POST',
        url: '/produtos',
        body: {
          nome: "Teste Produto02",
          descricao: "Teste Descrição",
          preco: 110,
          quantidade: 110
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.include("produto com esse nome");
      });
    });

    it("Deve exibir mensagem ao usar token inválido ou expirado", () => {
      apiRequest({
        method: 'POST',
        url: '/produtos',
        body: productData,
        auth: false,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.include("Token de acesso ausente, inválido, expirado");
      });
    });

    it("Deve buscar um produto pelo ID", () => {
      createProductId().then((productId) => {
        apiRequest({
          method: 'GET',
          url: `/produtos/${productId}`
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('_id', productId);
        });
      });
    });

    it("Deve exibir mensagem ao não encontrar produto", () => {
      apiRequest({
        method: 'GET',
        url: `/produtos/${faker.string.uuid()}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.include("Produto não encontrado");
      });
    });

    it("Deve excluir um produto", () => {
      createProductId().then((productId) => {
        apiRequest({
          method: 'DELETE',
          url: `/produtos/${productId}`
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.include("Registro excluído com sucesso");
        });
      });
    });

    it("Deve exibir mensagem ao tentar excluir sem autenticação de administrador", () => {
      createProductId().then((productId) => {
        apiRequest({
          method: 'DELETE',
          url: `/produtos/${productId}`,
          auth: false,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(401);
          expect(response.body.message).to.include("Token de acesso ausente, inválido, expirado");
        });
      });
    });

    it("Deve editar um produto", () => {
      createProductId().then((productId) => {
        apiRequest({
          method: 'PUT',
          url: `/produtos/${productId}`,
          body: productData
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.message).to.include("Registro alterado com sucesso");
        });
      });
    });

    it("Deve exibir mensagem ao tentar editar com nome de produto já cadastrado", () => {
      apiRequest({
        method: 'PUT',
        url: `/produtos/${faker.string.uuid()}`,
        body: {
          nome: "Teste Produto02",
          descricao: "Teste Descrição",
          preco: 110,
          quantidade: 110
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.include("produto com esse nome");
      });
    });

    it("Deve exibir mensagem ao tentar editar sem autenticação de administrador", () => {
      createProductId().then((productId) => {
        apiRequest({
          method: 'PUT',
          url: `/produtos/${productId}`,
          body: productData,
          auth: false,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(401);
          expect(response.body.message).to.include("Token de acesso ausente, inválido, expirado");
        });
      });
    });
  });

  context("Normal", () => {
    beforeEach(() => {
      cy.login({ normal: true });
    });

    it("Deve exibir mensagem de rota exclusiva ao tentar cadastrar produto com usuário normal", () => {
      apiRequest({
        method: 'POST',
        url: '/produtos',
        body: generateProductData(),
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.include("Rota exclusiva para administradores");
      });
    });

    it("Deve exibir mensagem de rota exclusiva ao tentar excluir produto com usuário normal", () => {
      apiRequest({
        method: 'DELETE',
        url: `/produtos/${faker.string.uuid()}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.include("Rota exclusiva para administradores");
      });
    });

    it("Deve exibir mensagem de rota exclusiva ao tentar editar produto com usuário normal", () => {
      apiRequest({
        method: 'PUT',
        url: `/produtos/${faker.string.uuid()}`,
        body: {
          nome: "Teste Produto02",
          descricao: "Teste Descrição",
          preco: 110,
          quantidade: 110
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(403);
        expect(response.body.message).to.include("Rota exclusiva para administradores");
      });
    });
  });
});
