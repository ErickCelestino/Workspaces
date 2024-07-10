import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import {
  ListSimpleDirectoryDto,
  ListSimpleDirectoryResponseDto,
} from '../../dto';
import { EntityNotEmpty } from '../../error';
import {
  FindUserByIdRepository,
  ListSimpleDirectoryRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { ValidationUserId } from '../../utils';

export class ListSimpleDirectory
  implements
    UseCase<
      ListSimpleDirectoryDto,
      Either<EntityNotEmpty, ListSimpleDirectoryResponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('ListSimpleDirectoryRepository')
    private listSimpleDirectoryRepository: ListSimpleDirectoryRepository
  ) {}
  async execute(
    input: ListSimpleDirectoryDto
  ): Promise<Either<EntityNotEmpty, ListSimpleDirectoryResponseDto>> {
    const { loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const filteredDirectories = await this.listSimpleDirectoryRepository.list(
      input
    );

    return right(filteredDirectories);
  }
}
