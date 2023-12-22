import createUserAdm from '../e2e/shared/createUserAdm';
import createUser from '../e2e/shared/createUser';

Cypress.Commands.add('login', (options = {}) => {
  const { admin, normal } = options;

  if (admin) {
    return createUserAdm().then((userData) => {
      // Use os dados do usuário conforme necessário
      const emailUsuario = userData.email;
      const senhaUsuario = userData.password;

      // Agora, faz a requisição para login
      return cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'POST',
        url: '/login',
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: {
          "email": emailUsuario,
          "password": senhaUsuario
        },
      }).then((response) => {
        console.log(response);
        localStorage.setItem('token', response.body.authorization);
        expect(localStorage.getItem('token')).not.null;
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Login realizado com sucesso");
      });
    });

  } else if (normal) {
    return createUser().then((userData) => {
      const emailUsuario = userData.email;
      const senhaUsuario = userData.password;

      // Agora, faz a requisição para login
      return cy.request({
        log: true,
        failOnStatusCode: true,
        method: 'POST',
        url: '/login',
        headers: {
          "accept": "application/json",
          "content-type": "application/json"
        },
        body: {
          "email": emailUsuario,
          "password": senhaUsuario
        },
      }).then((response) => {
        console.log(response)
        localStorage.setItem('token', response.body.authorization);
        expect(localStorage.getItem('token')).not.null;
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Login realizado com sucesso");
      });
    });
  } else {
    // Retorna uma promessa rejeitada com a mensagem de erro
    return Promise.reject('Deve ser definido que tipo de usuário');
  }
});
