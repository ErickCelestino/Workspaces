import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { UploadProfileImageDto } from '../../dto';
import {
  EntityNotComplete,
  EntityNotEmpty,
  EntityNotLoaded,
} from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindUserByIdRepository,
  RegisterProfileImageRepository,
  UploadContentFileRepository,
} from '../../repository';
import { ValidationUserId } from '../../utils';

export class UploadProfileImage
  implements UseCase<UploadProfileImageDto, Either<EntityNotEmpty, string>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('UploadContentFileRepository')
    private uploadContentFileRepository: UploadContentFileRepository,
    @Inject('RegisterProfileImageRepository')
    private registerProfileImageRepository: RegisterProfileImageRepository
  ) {}
  async execute(
    input: UploadProfileImageDto
  ): Promise<Either<EntityNotEmpty, string>> {
    const { file, loggedUserId } = input;

    if (Object.keys(file).length < 1) {
      return left(new EntityNotEmpty('File'));
    }

    const loggedUserValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (loggedUserValidation.isLeft()) {
      return left(loggedUserValidation.value);
    }

    const key = `${Date.now()}-${file.originalname}`;

    const resultUpload = await this.uploadContentFileRepository.upload({
      file: file,
      bucket: process.env['AWS_S3_BUCKET_PROFILE_NAME'] ?? '',
      key,
    });

    if (Object.keys(resultUpload).length < 1) {
      return left(new EntityNotLoaded('Image Profile'));
    }

    const registerProfileImage =
      await this.registerProfileImageRepository.register({
        urlProfile: resultUpload,
        userId: loggedUserId,
      });

    if (Object.keys(registerProfileImage).length < 1) {
      return left(new EntityNotComplete('Upload Image'));
    }

    return right(registerProfileImage);
  }
}
