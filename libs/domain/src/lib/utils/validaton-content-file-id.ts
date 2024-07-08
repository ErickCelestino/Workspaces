import { EntityNotEmpty, EntityNotExists } from '../error';
import { FindContentFileByIdRepository } from '../repository';
import { left, right } from '../shared/either';

export async function ValidationContentFileId(
  id: string,
  findContentFileByIdRepository: FindContentFileByIdRepository
) {
  if (Object.keys(id).length < 1) {
    return left(new EntityNotEmpty('File ID'));
  }

  const filteredFile = await findContentFileByIdRepository.find(id);

  if (Object.keys(filteredFile?.id ?? filteredFile).length < 1) {
    return left(new EntityNotExists('File'));
  }

  return right(undefined);
}
