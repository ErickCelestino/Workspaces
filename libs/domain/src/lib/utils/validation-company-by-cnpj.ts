import { EntityAlreadyExists, EntityNotEmpty, EntityNotExists } from '../error';
import { FindCompanyByCnpjRepository } from '../repository';
import { Either, left, right } from '../shared/either';

export async function ValidationCompanyByCnpj(
  cnpj: string,
  findCompanyByCnpjRepository: FindCompanyByCnpjRepository
): Promise<Either<EntityNotEmpty | EntityNotExists, void>> {
  const formatedcnpj = cnpj.replace(/[^\d]+/g, '');
  if (Object.keys(formatedcnpj).length < 1) {
    return left(new EntityNotEmpty('Cnpj'));
  }

  const filteredCompany = await findCompanyByCnpjRepository.find(formatedcnpj);

  if (Object.keys(filteredCompany?.id ?? filteredCompany).length > 0) {
    return left(new EntityAlreadyExists('Company'));
  }
  return right(undefined);
}
