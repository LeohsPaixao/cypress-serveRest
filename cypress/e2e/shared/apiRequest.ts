import type { ApiRequestOptions } from '../../support/types/api';

/**
 * Função para fazer requisições HTTP usando o comando `cy.api` do Cypress.
 * @param {ApiRequestOptions} param0 - As opções para a requisição.
 * @param {string} param0.method - O método HTTP da requisição.
 * @param {string} param0.url - A URL da requisição.
 * @param {Record<string, unknown>} param0.body - O corpo da requisição.
 * @param {boolean} param0.failOnStatusCode - Se deve falhar se o status code não for 200.
 * @param {boolean} param0.auth - Se deve autenticar a requisição.
 * @returns {Cypress.Chainable<Cypress.Response<unknown>>} - O objeto encadeável da resposta.
 */
export default function apiRequest({
  method,
  url,
  body = {},
  failOnStatusCode = true,
  auth = true,
}: ApiRequestOptions): Cypress.Chainable<Cypress.Response<unknown>> {
  const headers: Record<string, string> = {
    accept: 'application/json',
    'content-type': 'application/json',
  };

  if (auth) {
    const token = window.localStorage.getItem('token');
    if (token) {
      headers.Authorization = token;
    }
  }

  return cy.api({
    log: true,
    failOnStatusCode,
    method,
    url,
    headers,
    body: body as Record<string, unknown> | undefined,
  });
}
