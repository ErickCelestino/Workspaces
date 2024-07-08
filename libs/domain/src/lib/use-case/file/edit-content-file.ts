import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { EditContentFileDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  EditContentFileRepository,
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import {
  ValidationContentFileId,
  ValidationDirectoryId,
  ValidationUserId,
} from '../../utils';

export class EditContentFile
  implements
    UseCase<EditContentFileDto, Either<EntityNotEmpty | EntityNotExists, void>>
{
  constructor(
    @Inject('EditContentFileRepository')
    private editContentFileRepository: EditContentFileRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository,
    @Inject('FindContentFileByIdRepository')
    private findContentFileByIdRepository: FindContentFileByIdRepository
  ) {}

  async execute(
    input: EditContentFileDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, void>> {
    const { idToEdit, directoryId, loggedUserId, newFileName } = input;

    if (Object.keys(idToEdit).length < 1) {
      return left(new EntityNotEmpty('ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty('Directory ID'));
    }

    if (Object.keys(newFileName).length < 1) {
      return left(new EntityNotEmpty('name'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    await ValidationDirectoryId(directoryId, this.findDirectoryByIdRepository);

    await ValidationContentFileId(idToEdit, this.findContentFileByIdRepository);

    await this.editContentFileRepository.edit(input);

    return right(undefined);
  }
}
