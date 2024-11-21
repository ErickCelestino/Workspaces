import { Inject } from '@nestjs/common';
import { UseCase } from '../../../base/use-case';
import { CreatePreRegistrationDto } from '../../../dto';
import { EntityNotCreated, EntityNotEmpty } from '../../../error';
import { CreatePreRegistrationRepository } from '../../../repository';
import { Either, left, right } from '../../../shared/either';

export class CreatePreRegistration
  implements
    UseCase<
      CreatePreRegistrationDto,
      Either<EntityNotEmpty | EntityNotCreated, string>
    >
{
  constructor(
    @Inject('CreatePreRegistrationRepository')
    private createPreRegistrationRepository: CreatePreRegistrationRepository
  ) {}
  async execute(
    input: CreatePreRegistrationDto
  ): Promise<Either<EntityNotEmpty | EntityNotCreated, string>> {
    const { sendingId } = input;

    if (Object.keys(sendingId).length < 1) {
      return left(new EntityNotEmpty('Sending ID'));
    }

    const createdPreRegistration =
      await this.createPreRegistrationRepository.create(input);

    if (Object.keys(createdPreRegistration).length < 1) {
      return left(new EntityNotCreated('Pre Registration'));
    }

    return right(createdPreRegistration);
  }
}
