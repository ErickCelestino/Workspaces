import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListDirectoryDto, ListDirectoryResponseDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindUserByIdRepository,
  ListDirectoryRepository,
} from '../../repository';
import { ValidationUserId } from '../../utils';

export class ListDirectory
  implements
    UseCase<
      ListDirectoryDto,
      Either<EntityNotEmpty | EntityNotExists, ListDirectoryResponseDto>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('ListDirectoryRepository')
    private listDirectoryRepository: ListDirectoryRepository
  ) {}

  async execute(
    input: ListDirectoryDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists, ListDirectoryResponseDto>
  > {
    const { loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged User ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const listDirectory = await this.listDirectoryRepository.list(input);

    return right(listDirectory);
  }
}
