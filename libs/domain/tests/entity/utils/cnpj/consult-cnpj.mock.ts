import { faker } from '@faker-js/faker';
import { ConsultCNPJResponse } from '../../../../src';

export const ConsultCnpjMock: ConsultCNPJResponse = {
  abertura: faker.string.alpha(3),
  bairro: faker.string.alpha(3),
  cep: faker.string.alpha(3),
  email: faker.internet.email(),
  logradouro: faker.string.alpha(3),
  municipio: faker.string.alpha(3),
  natureza_juridica: faker.string.alpha(3),
  nome: faker.string.alpha(3),
  numero: faker.string.alpha(3),
  porte: faker.string.alpha(3),
  situacao: faker.string.alpha(3),
  telefone: faker.string.alpha(3),
  uf: faker.string.alpha(2),
};
