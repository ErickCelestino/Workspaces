import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { DownloadContentFileDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  DownloadContentFileRepository,
  FindContentFileByIdRepository,
  FindDirectoryByIdRepository,
  FindUserByIdRepository,
} from '../../repository';

export class DownloadContentFile
  implements
    UseCase<
      DownloadContentFileDto,
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
    @Inject('DownloadContentFileRepository')
    private downloadContentFileRepository: DownloadContentFileRepository
  ) {}
  async execute(
    input: DownloadContentFileDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, void>> {
    const { directoryId, idToDownload, loggedUserId } = input;

    if (Object.keys(directoryId).length < 1) {
      return left(new EntityNotEmpty('directory ID'));
    }

    if (Object.keys(idToDownload).length < 1) {
      return left(new EntityNotEmpty('ID to download'));
    }

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('logged user ID'));
    }

    const filteredUser = await this.findUserByIdRepository.find(loggedUserId);

    if (Object.keys(filteredUser?.userId ?? filteredUser).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const fiteredDirectory = await this.findDirectoryByIdRepository.find(
      directoryId
    );

    if (Object.keys(fiteredDirectory?.id ?? fiteredDirectory).length < 1) {
      return left(new EntityNotExists('Directory'));
    }

    const filteredContentFile = await this.findContentFileByIdRepository.find(
      idToDownload
    );

    if (
      Object.keys(filteredContentFile?.id ?? filteredContentFile).length < 1
    ) {
      return left(new EntityNotExists('Content File'));
    }

    await this.downloadContentFileRepository.download(input);

    return right(undefined);
  }
}
