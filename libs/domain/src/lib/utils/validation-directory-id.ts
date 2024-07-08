import { EntityNotEmpty, EntityNotExists } from '../error';
import { FindDirectoryByIdRepository } from '../repository';
import { left, right } from '../shared/either';

export async function ValidationDirectoryId(
  id: string,
  findDirectoryByIdRepository: FindDirectoryByIdRepository
) {
  if (Object.keys(id).length < 1) {
    return left(new EntityNotEmpty('Directory ID'));
  }

  const result = await findDirectoryByIdRepository.find(id);

  if (Object.keys(result?.id ?? result).length < 1) {
    return left(new EntityNotExists('Directory'));
  }

  return right(undefined);
}
