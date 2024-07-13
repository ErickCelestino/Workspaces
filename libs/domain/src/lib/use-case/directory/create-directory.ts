import { UseCase } from '../../base/use-case';
import { CreateDirectoryDto, FindDirectoryByNameDto } from '../../dto';
import {
  EntityAlreadyExists,
  EntityNotCreated,
  EntityNotEmpty,
  EntityNotExists,
} from '../../error';
import {
  CreateDirectoryRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { FindDirectoryByNameRepository } from '../../repository/directory/find-directory-by-name';
import { Inject } from '@nestjs/common';

export class CreateDirectory
  implements
    UseCase<
      CreateDirectoryDto,
      Either<
        | EntityNotEmpty
        | EntityNotExists
        | EntityAlreadyExists
        | EntityNotCreated,
        string
      >
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByNameRepository')
    private findDirectoryByNameRepository: FindDirectoryByNameRepository,
    @Inject('CreateDirectoryRepository')
    private createDirectoryRepository: CreateDirectoryRepository
  ) {}

  async execute(
    input: CreateDirectoryDto
  ): Promise<
    Either<
      EntityNotEmpty | EntityNotExists | EntityAlreadyExists | EntityNotCreated,
      string
    >
  > {
    const { body, loggedUserId } = input;

    if (Object.keys(body.name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const findDirectoryInput: FindDirectoryByNameDto = {
      name: body.name,
      loggedUserId,
    };

    const findDirectory = await this.findDirectoryByNameRepository.find(
      findDirectoryInput
    );

    if (Object.keys(findDirectory).length > 0) {
      return left(new EntityAlreadyExists('Directory'));
    }

    const createDirectory = await this.createDirectoryRepository.create(input);

    if (Object.keys(createDirectory).length < 1) {
      return left(new EntityNotCreated('Directory'));
    }

    return right(createDirectory);
  }
}
