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
  FindUrlFileRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { FileTypes } from '../../type';
import { ValidationDirectoryId, ValidationUserId } from '../../utils';

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
    private findDirectoryByIdRepository: FindDirectoryByIdRepository,
    @Inject('FindUrlFileRepository')
    private findUrlFileRepository: FindUrlFileRepository
  ) {}
  async execute(
    input: CreateContentFileDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists | EntityNotCreated, string[]>
  > {
    const listId = [];
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

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const directoryValidation = await ValidationDirectoryId(
      directoryId,
      this.findDirectoryByIdRepository
    );

    if (directoryValidation.isLeft()) {
      return left(directoryValidation.value);
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

    for (const item of file) {
      const resultUrl = await this.findUrlFileRepository.find({
        fileName: item.filename,
      });

      const filteredContentFileId =
        await this.createContentFileRepository.create({
          file: {
            ...item,
            path: resultUrl,
          },
          directoryId,
          loggedUserId,
        });
      if (Object.keys(filteredContentFileId).length < 1) {
        return left(new EntityNotCreated('Content File'));
      }
      listId.push(filteredContentFileId);
    }

    return right(listId);
  }
}
