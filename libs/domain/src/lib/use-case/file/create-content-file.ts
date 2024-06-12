import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreateContentFileDto } from '../../dto';
import {
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
  FileNotAllowed,
} from '../../error';
import {
  CreateContentFileRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { FileTypes } from '../../type';

export class CreateContentFile
  implements
    UseCase<
      CreateContentFileDto,
      Either<EntityNotEmpty | EntityNotExists | EntityNotCreated, string[]>
    >
{
  constructor(
    @Inject('CreateContentFileRepository')
    private createContentFileRepository: CreateContentFileRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository
  ) {}
  async execute(
    input: CreateContentFileDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists | EntityNotCreated, string[]>
  > {
    const { loggedUserId, directoryId, file } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged User ID'));
    }

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty('Directory ID'));
    }

    if (Object.keys(file).length < 1) {
      return left(new EntityNotEmpty('File'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const fiteredDirectory = await this.findDirectoryByIdRepository.find(
      directoryId
    );

    if (Object.keys(fiteredDirectory).length < 1) {
      return left(new EntityNotExists('Directory'));
    }

    let error = false;
    for (const item of file) {
      if (!FileTypes.includes(item.mimetype)) {
        error = true;
      }
    }

    if (error === true) {
      return left(new FileNotAllowed());
    }

    const filteredContentFile = await this.createContentFileRepository.create(
      input
    );

    if (Object.keys(filteredContentFile).length < 1) {
      return left(new EntityNotCreated('Content File'));
    }

    return right(filteredContentFile);
  }
}
