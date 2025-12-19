import createUser from '../../e2e/shared/createUser';
import createUserAdm from '../../e2e/shared/createUserAdm';
import type { LoginResponse, SuccessMessageResponse, UserData } from '../types/api';

Cypress.Commands.add('login', (options: { admin?: boolean; normal?: boolean } = {}): Cypress.Chainable<Cypress.Response<LoginResponse>> => {
  const { admin, normal } = options;

  if (admin) {
    return createUserAdm().then((userData: UserData): Cypress.Chainable<Cypress.Response<LoginResponse>> => {
      const emailUsuario = userData.email;
      const senhaUsuario = userData.password;

      return cy
        .request({
          log: true,
          failOnStatusCode: true,
          method: 'POST',
          url: '/login',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: {
            email: emailUsuario,
            password: senhaUsuario,
          },
        })
        .then((response: Cypress.Response<LoginResponse>) => {
          const token = response.body.authorization;
          window.localStorage.setItem('token', token);

          expect(response.status).to.equal(200);
          expect((response.body as SuccessMessageResponse).message).to.equal('Login realizado com sucesso');
        });
    });
  } else if (normal) {
    return createUser().then((userData: UserData): Cypress.Chainable<Cypress.Response<LoginResponse>> => {
      const emailUsuario = userData.email;
      const senhaUsuario = userData.password;

      return cy
        .request({
          log: true,
          failOnStatusCode: true,
          method: 'POST',
          url: '/login',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: {
            email: emailUsuario,
            password: senhaUsuario,
          },
        })
        .then((response: Cypress.Response<LoginResponse>) => {
          const token = response.body.authorization;
          window.localStorage.setItem('token', token);

          expect(response.status).to.equal(200);
          expect((response.body as SuccessMessageResponse).message).to.equal('Login realizado com sucesso');
        });
    });
  } else {
    throw new Error('Deve ser definido que tipo de usuário');
  }
});
