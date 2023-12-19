describe('Teste de Login via API', () => {

  it('Deve realizar o login com sucesso', () => {
    const email = "fulano@qa.com";
    const password = "teste";

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
        "email": email,
        "password": password
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Login realizado com sucesso");
    });
  });

  it("Deve ser exibido uma mensagem de credenciais inválidos - Email", () => {
    const email = "fulano";
    const password = "teste";

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
        "email": email,
        "password": password
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal("email deve ser um email válido");
    });
  });

  it("Deve ser exibido uma mensagem de credenciais inválidos - Senha", () => {
    const email = "fulano@qa.com";
    const password = "";

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
        "email": email,
        "password": password
      },
    }).then((response) => {
      console.log(response);
      expect(response.status).to.equal(400);
      expect(response.body.password).to.equal("password não pode ficar em branco");
    });
  })
});
