import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListContentFileDto, ListContentFileResponseDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import {
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  ListContentFileRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId } from '../../utils';

export class ListContentFile
  implements
    UseCase<
      ListContentFileDto,
      Either<EntityNotEmpty | EntityNotExists, ListContentFileResponseDto>
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
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists, ListContentFileResponseDto>
  > {
    const { directoryId, loggedUserId } = input;
    const loggedUserString = 'logged user';
    const directoryString = 'directory';

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty(`${directoryString} ID`));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty(`${loggedUserString} ID`));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const directoryResult = await this.findDirectoryByIdRepository.find(
      directoryId
    );

    if (Object.keys(directoryResult?.id ?? directoryResult).length < 1) {
      return left(new EntityNotExists(directoryString));
    }

    const resultList = await this.listContentFileRepository.list(input);

    return right(resultList);
  }
}
