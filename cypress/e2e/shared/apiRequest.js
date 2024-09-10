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