
# **Teste Automatizado de API com Cypress e ServeREST**

Este projeto visa realizar testes automatizados de API utilizando a ferramenta Cypress em conjunto com a API ServeREST.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E=20.9.0-brightgreen.svg)](https://nodejs.org/)

## ServeREST

O ServeREST é uma API RESTful de teste, disponível em [ServeREST GitHub](https://github.com/ServeRest/ServeRest). Certifique-se de referenciar este projeto ao utilizar a API em seus testes.

## GitHub Actions

Este projeto está integrado ao GitHub Actions para automação de testes. Os testes são executados automaticamente em cada push para o repositório.

## Configuração do Ambiente

Certifique-se de ter as versões corretas do Node.js, Cypress e ServeREST instaladas.

 ````json
  { "node": "20.9.0",   "cypress": "13.6.1",   "serveRest": "2.28" }
 ````

## Configuração

1. **Clonar o repositório e instale as dependências**

 ````bash
    git clone git@github.com:LeohsPaixao/cypress-serveRest.git
    cd cypress-serveRest
    npm install
 ````

2. **Inicie o servidor ServeRest**

 ````bash
    npm start # Abrirá na porta 3000 (Default)
 ````

3. **Rode os testes**

 ````bash
    npm run cy:open # Rode os testes no modo interativo do cypress
    npm run cy:run # Rode os testes no modo headless do cypress
 ````

## Test Report

 **Em Desenvolvimento**

 Este projeto visa utilizar o Allure Report para os reports dos testes tanto no Github Actions quanto localmente.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests para melhorar este projeto.

## Licença

Este projeto é licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.
