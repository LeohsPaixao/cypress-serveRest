/**
 * A function to make HTTP requests using Cypress' `cy.api` command.
 * This function handles authentication and provides default headers.
 *
 * @param {Object} options - The options for the API request.
 * @param {string} options.method - The HTTP method for the request.
 * @param {string} options.url - The URL for the request.
 * @param {Object} [options.body={}] - The request body. Default is an empty object.
 * @param {boolean} [options.failOnStatusCode=true] - Whether to fail the test if the response status code is not successful. Default is true.
 * @param {boolean} [options.auth=true] - Whether to include an Authorization header with the token from localStorage. Default is true.
 *
 * @returns {Chainable<Response>} - The Cypress chainable response object.
 */
export function apiRequest({ method, url, body = {}, failOnStatusCode = true, auth = true }) {
  const headers = {
    "accept": "application/json",
    "content-type": "application/json",
  };

  if (auth) {
    headers["Authorization"] = localStorage.getItem('token');
  }

  return cy.api({
    log: true,
    failOnStatusCode,
    method,
    url,
    headers,
    body
  });
}