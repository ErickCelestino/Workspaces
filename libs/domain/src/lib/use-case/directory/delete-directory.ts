import { Inject } from '@nestjs/common';
import {
  DeleteDirectoryRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { DeleteDirectoryDto } from '../../dto';
import { Either, left, right } from '../../shared/either';
import { EntityNotEmpty } from '../../error';
import { ValidationDirectoryId, ValidationUserId } from '../../utils';

export class DeleteDirectory {
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository,
    @Inject('DeleteDirectoryRepository')
    private deleteDirectoryRepository: DeleteDirectoryRepository
  ) {}

  async execute(
    input: DeleteDirectoryDto
  ): Promise<Either<EntityNotEmpty, void>> {
    const { id, loggedUserId } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('Directory ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('User ID'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const directoryValidation = await ValidationDirectoryId(
      id,
      this.findDirectoryByIdRepository
    );

    if (directoryValidation.isLeft()) {
      return left(directoryValidation.value);
    }

    await this.deleteDirectoryRepository.delete(input);

    return right(undefined);
  }
}
