import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { MoveFileToDirectoryDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
  MoveFileToDirectoryRepository,
} from '../../repository';

export class MoveFileToDirectory
  implements
    UseCase<
      MoveFileToDirectoryDto,
      Either<EntityNotEmpty | EntityNotExists, void>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository,
    @Inject('FindContentFileByIdRepository')
    private findContentFileByIdRepository: FindContentFileByIdRepository,
    @Inject('MoveFileToDirectoryRepository')
    private moveFileToDirectoryRepository: MoveFileToDirectoryRepository
  ) {}
  async execute(
    input: MoveFileToDirectoryDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, void>> {
    const { idToMove, idToMoveDirectory, loggedUserId } = input;

    if (Object.keys(idToMove).length < 1) {
      return left(new EntityNotEmpty('file ID'));
    }

    if (Object.keys(idToMoveDirectory).length < 1) {
      return left(new EntityNotEmpty('ID'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged user ID'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const fiteredDirectory = await this.findDirectoryByIdRepository.find(
      idToMoveDirectory
    );

    if (Object.keys(fiteredDirectory?.id ?? fiteredDirectory).length < 1) {
      return left(new EntityNotExists('Directory'));
    }

    const filteredFile = await this.findContentFileByIdRepository.find(
      idToMove
    );

    if (Object.keys(filteredFile?.id ?? filteredFile).length < 1) {
      return left(new EntityNotExists('File'));
    }

    await this.moveFileToDirectoryRepository.move(input);

    return right(undefined);
  }
}
