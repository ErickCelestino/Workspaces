import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListDeviceDto, ListDeviceResponseDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import { FindUserByIdRepository, ListDeviceRepository } from '../../repository';
import { ValidationUserId } from '../../utils';

export class ListDevice
  implements
    UseCase<ListDeviceDto, Either<EntityNotEmpty, ListDeviceResponseDto>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('ListDeviceRepository')
    private listDeviceRepository: ListDeviceRepository
  ) {}
  async execute(
    input: ListDeviceDto
  ): Promise<Either<EntityNotEmpty, ListDeviceResponseDto>> {
    const { loggedUserId } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const filteredDevices = await this.listDeviceRepository.list(input);

    return right(filteredDevices);
  }
}
