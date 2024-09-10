import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { ListDeviceDto, ListDeviceResponseDto } from '../../dto';
import { EntityNotEmpty } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  ListDeviceRepository,
} from '../../repository';
import {
  ValidationCompanyId,
  ValidationTextField,
  ValidationUserId,
} from '../../utils';

export class ListDevice
  implements
    UseCase<ListDeviceDto, Either<EntityNotEmpty, ListDeviceResponseDto>>
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindSimpleCompanyByIdRepository')
    private findCompanyByIdRepository: FindCompanyByIdRepository,
    @Inject('ListDeviceRepository')
    private listDeviceRepository: ListDeviceRepository
  ) {}
  async execute(
    input: ListDeviceDto
  ): Promise<Either<EntityNotEmpty, ListDeviceResponseDto>> {
    const { loggedUserId, companyId } = input;

    const loggedUserIdValidation = await ValidationTextField(
      loggedUserId,
      'Logged User ID'
    );
    if (loggedUserIdValidation.isLeft())
      return left(loggedUserIdValidation.value);

    const companyIdValidation = await ValidationTextField(
      companyId,
      'Company ID'
    );
    if (companyIdValidation.isLeft()) return left(companyIdValidation.value);

    const userValidation = await ValidationUserId(
      loggedUserId,
      this.findUserByIdRepository
    );

    if (userValidation.isLeft()) {
      return left(userValidation.value);
    }

    const companyValidation = await ValidationCompanyId(
      companyId,
      this.findCompanyByIdRepository
    );

    if (companyValidation.isLeft()) {
      return left(companyValidation.value);
    }

    const filteredDevices = await this.listDeviceRepository.list(input);

    return right(filteredDevices);
  }
}
