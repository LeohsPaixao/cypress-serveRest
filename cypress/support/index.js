/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable default-param-last */

import './commands'
/**
 * Comando global que captura todos os erros
 * nesse caso precisamos pular erros conhecidos
 * provocado intencionalmente para testar caso de uso que contem erro
 */
Cypress.on('uncaught:exception', (err) => {
  const errorMessage = err.message.toLowerCase();
  const skipErrors = ['graphql error', 'failed to fetch', 'onopen', 'code', 'TypeError', 'ResizeObserver '];

  /**
   * @returns true mantém o erro
   * @returns false pula o erro
   */
  let response = true;

  skipErrors.every((error) => {
    if (errorMessage.includes(error)) {
      response = false;
      return false;
    }

    return true;
  });

  return response;
});

Cypress.on('before:browser:launch', (browser = {}, launchOptions) => {
  if (browser.name === 'chrome' || browser.name === 'electron') {
    launchOptions.args.push('--disable-dev-shm-usage');
    return launchOptions;
  }

  return launchOptions;
});

Cypress.on("window:before:load", win => {
  win.fetch = null;
});