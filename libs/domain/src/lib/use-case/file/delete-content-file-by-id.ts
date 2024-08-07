import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DeleteContentFileByIdDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import {
  DeleteContentFileByIdRepository,
  DeleteFileByNameRepository,
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';

export class DeleteContentFileById
  implements
    UseCase<
      DeleteContentFileByIdDto,
      Either<EntityNotEmpty | EntityNotExists, void>
    >
{
  constructor(
    @Inject('DeleteContentFileByIdRepository')
    private deleteCotentFileByIdRepository: DeleteContentFileByIdRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository,
    @Inject('FindContentFileByIdRepository')
    private findContentFileByIdRepository: FindContentFileByIdRepository,
    @Inject('DeleteFileByNameRepository')
    private deleteFileByNameRepository: DeleteFileByNameRepository
  ) {}

  async execute(
    input: DeleteContentFileByIdDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, void>> {
    const { directoryId, loggedUserId, idToDelete } = input;

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty('directory ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    if (Object.keys(idToDelete).length < 1) {
      return left(new EntityNotEmpty('ID to delete'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const fiteredDirectory = await this.findDirectoryByIdRepository.find(
      directoryId
    );

    if (Object.keys(fiteredDirectory?.id ?? fiteredDirectory).length < 1) {
      return left(new EntityNotExists('Directory'));
    }

    const filteredContentFile = await this.findContentFileByIdRepository.find(
      idToDelete
    );

    if (
      Object.keys(filteredContentFile?.id ?? filteredContentFile).length < 1
    ) {
      return left(new EntityNotExists('Content File'));
    }

    await this.deleteCotentFileByIdRepository.delete(input);
    await this.deleteFileByNameRepository.delete(filteredContentFile.fileName);
    return right(undefined);
  }
}
