import { faker } from '@faker-js/faker';

export const generateProductData = () => ({
  nome: faker.commerce.productName() + Cypress._.random(1, 854758564454),
  descricao: faker.commerce.productDescription(),
  preco: faker.commerce.price({ min: 50, max: 250, dec: 0 }),
  quantidade: faker.number.int({ min: 50, max: 500 })
});