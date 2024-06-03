import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreateContentVideoDto } from '../../dto';
import { EntityNotCreated, EntityNotEmpty, EntityNotExists } from '../../error';
import {
  CreateContentVideoRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';

export class CreateContentVideo
  implements
    UseCase<
      CreateContentVideoDto,
      Either<EntityNotEmpty | EntityNotExists | EntityNotCreated, string>
    >
{
  constructor(
    @Inject('CreateContentVideoRepository')
    private createContentVideoRepository: CreateContentVideoRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindDirectoryByIdRepository')
    private findDirectoryByIdRepository: FindDirectoryByIdRepository
  ) {}
  async execute(
    input: CreateContentVideoDto
  ): Promise<
    Either<EntityNotEmpty | EntityNotExists | EntityNotCreated, string>
  > {
    const {
      loggedUserId,
      directoryId,
      name,
      duration,
      format,
      resolution,
      size,
    } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged User ID'));
    }

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty('Directory ID'));
    }

    if (Object.keys(duration).length < 1) {
      return left(new EntityNotEmpty('Duration'));
    }

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (Object.keys(format).length < 1) {
      return left(new EntityNotEmpty('Format'));
    }

    if (Object.keys(resolution).length < 1) {
      return left(new EntityNotEmpty('Resolution'));
    }

    if (Object.keys(size).length < 1) {
      return left(new EntityNotEmpty('Size'));
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

    const filteredContentVideo = await this.createContentVideoRepository.create(
      input
    );

    if (Object.keys(filteredContentVideo).length < 1) {
      return left(new EntityNotCreated('Content Video'));
    }

    return right(filteredContentVideo);
  }
}
