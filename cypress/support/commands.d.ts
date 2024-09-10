declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Um comando customizado do Cypress para realizar o login de um usuário.
       *
       * @param {Object} options - As opções para o comando de login.
       * @param {boolean} options.admin - Se verdadeiro, faz login como um usuário administrador.
       * @param {boolean} options.normal - Se verdadeiro, faz login como um usuário normal.
       *
       * @returns {Cypress.Chainable<any>} - Um objeto encadeável do Cypress.
       *
       * @throws {Error} - Lança um erro se nem 'admin' nem 'normal' forem definidos.
       *
       * @example
       * // Para fazer login como um usuário administrador:
       * cy.login({ admin: true });
       *
       * // Para fazer login como um usuário normal:
       * cy.login({ normal: true });
       *
       * // Caso tente chamar o comando sem definir 'admin' ou 'normal', um erro será lançado:
       * cy.login({});
       */
      login(options: { admin?: boolean; normal?: boolean }): Cypress.Chainable<any>;
    }
  }
}
