import { EntityNotEmpty, EntityNotExists } from '../error';
import { FindUserByIdRepository } from '../repository';
import { left, right } from '../shared/either';

export async function ValidationUserId(
  id: string,
  findUserByIdRepository: FindUserByIdRepository
) {
  if (Object.keys(id).length < 1) {
    return left(new EntityNotEmpty('File ID'));
  }

  const filteredUser = await findUserByIdRepository.find(id);

  if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
    return left(new EntityNotExists('User'));
  }

  return right(undefined);
}
