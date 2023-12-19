describe('Teste de Login via API', () => {

  it('Deve realizar o login com sucesso', () => {
    cy.request({
      log: true,
      failOnStatusCode: true,
      method: 'POST',
      url: '/login',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "email": "fulano@qa.com",
        "password": "teste"
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Login realizado com sucesso");
    });
  });

  it("Deve ser exibido uma mensagem de Email inválido", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'POST',
      url: '/login',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "email": "fulano",
        "password": "teste"
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal("email deve ser um email válido");
    });
  });

  it("Deve ser exibido uma mensagem de Senha inválida", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'POST',
      url: '/login',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "email": "fulano@qa.com",
        "password": ""
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(400);
      expect(response.body.password).to.equal("password não pode ficar em branco");
    });
  });

  it("Deve ser exibido uma mensagem caso uma das credenciais seja inválida", () => {
    cy.request({
      log: true,
      failOnStatusCode: false,
      method: 'POST',
      url: '/login',
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: {
        "email": "fulano2@qa.com",
        "password": "teste"
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal("Email e/ou senha inválidos");
    });
  });
});
