import { apiRequest } from './shared/apiRequest';

describe('Teste de Login via API', () => {

  it('Deve realizar o login com sucesso', () => {
    apiRequest({
      method: 'POST',
      url: '/login',
      body: {
        "email": "fulano@qa.com",
        "password": "teste"
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.include("Login realizado com sucesso");
    });
  });

  it("Deve exibir uma mensagem de Email inválido", () => {
    apiRequest({
      method: 'POST',
      url: '/login',
      body: {
        "email": "fulano",
        "password": "teste"
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.email).to.include("deve ser um email válido");
    });
  });

  it("Deve exibir uma mensagem de Senha inválida", () => {
    apiRequest({
      method: 'POST',
      url: '/login',
      body: {
        "email": "fulano@qa.com",
        "password": ""
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.password).to.include("não pode ficar em branco");
    });
  });

  it("Deve exibir uma mensagem para credenciais inválidas", () => {
    apiRequest({
      method: 'POST',
      url: '/login',
      body: {
        "email": "fulano2@qa.com",
        "password": "teste"
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body.message).to.include("Email e/ou senha inválidos");
    });
  });
});
