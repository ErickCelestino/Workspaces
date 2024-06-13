import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListContentFileDto } from '../../dto';
import { ContentFile } from '../../entity';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import {
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  ListContentFileRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';

export class ListContentFile
  implements
    UseCase<
      ListContentFileDto,
      Either<EntityNotEmpty | EntityNotExists, ContentFile[]>
    >
{
  constructor(
    @Inject('ListContentFileRepository')
    private listContentFileRepository: ListContentFileRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository
  ) {}

  async execute(
    input: ListContentFileDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, ContentFile[]>> {
    const { directoryId, loggedUserId, take, skip } = input;
    const loggedUserString = 'logged user';
    const directoryString = 'directory';

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty(`${directoryString} ID`));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty(`${loggedUserString} ID`));
    }

    const userResult = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(userResult).length < 1) {
      return left(new EntityNotExists(loggedUserString));
    }

    const directoryResult = await this.findDirectoryByIdRepository.find(
      directoryId
    );

    if (Object.keys(directoryResult).length < 1) {
      return left(new EntityNotExists(directoryString));
    }

    const resultList = await this.listContentFileRepository.list(input);

    return right(resultList);
  }
}
