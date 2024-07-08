import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DetailsContentFileDto } from '../../dto';
import { ContentFile } from '../../entity';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { ValidationUserId } from '../../utils';

export class DetailsContentFile
  implements
    UseCase<DetailsContentFileDto, Either<EntityNotEmpty, ContentFile>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository,
    @Inject('FindContentFileByIdRepository')
    private findContentFileByIdRepository: FindContentFileByIdRepository
  ) {}
  async execute(
    input: DetailsContentFileDto
  ): Promise<Either<EntityNotEmpty, ContentFile>> {
    const { id, directoryId, loggedUserId } = input;

    if (Object.keys(id).length < 1) {
      return left(new EntityNotEmpty('id'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty('Directory ID'));
    }

    await ValidationUserId(loggedUserId, this.findUserByIdRepository);

    const fiteredDirectory = await this.findDirectoryByIdRepository.find(
      directoryId
    );

    if (Object.keys(fiteredDirectory?.id ?? fiteredDirectory).length < 1) {
      return left(new EntityNotExists('Directory'));
    }

    const filteredContentFile = await this.findContentFileByIdRepository.find(
      id
    );

    if (
      Object.keys(filteredContentFile?.id ?? filteredContentFile).length < 1
    ) {
      return left(new EntityNotExists('Content File'));
    }

    return right(filteredContentFile);
  }
}
