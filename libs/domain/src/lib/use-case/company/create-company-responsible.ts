import { Inject } from '@nestjs/common';
import { UseCase } from '../../base/use-case';
import { CreateCompanyResponsibleDto } from '../../dto';
import { EntityNotEmpty, EntityNotExists } from '../../error';
import { Either, left, right } from '../../shared/either';
import {
  FindCompanyByIdRepository,
  FindUserByIdRepository,
  CreateCompanyResponsibleRespository,
} from '../../repository';
import { ValidationCompanyId, ValidationUserId } from '../../utils';

export class CreateCompanyResponsible
  implements
    UseCase<
      CreateCompanyResponsibleDto,
      Either<EntityNotEmpty | EntityNotExists, string>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('FindCompanyByIdRepository')
    private findCompanyByIdRepository: FindCompanyByIdRepository,
    private createCompanyResponsibleRepository: CreateCompanyResponsibleRespository
  ) {}

  async execute(
    input: CreateCompanyResponsibleDto
  ): Promise<Either<EntityNotEmpty | EntityNotExists, string>> {
    const {
      companyId,
      loggedUserId,
      body: { name, birthdate, cpf, email, phone },
    } = input;

    if (Object.keys(loggedUserId).length < 1) {
      return left(new EntityNotEmpty('Logged User ID'));
    }

    if (Object.keys(companyId).length < 1) {
      return left(new EntityNotEmpty('Company ID'));
    }

    if (Object.keys(name).length < 1) {
      return left(new EntityNotEmpty('Name'));
    }

    if (Object.keys(birthdate).length < 1) {
      return left(new EntityNotEmpty('Birth Date'));
    }

    if (Object.keys(cpf).length < 1) {
      return left(new EntityNotEmpty('CPF'));
    }

    if (Object.keys(email).length < 1) {
      return left(new EntityNotEmpty('Email'));
    }

    if (Object.keys(phone).length < 1) {
      return left(new EntityNotEmpty('Phone'));
    }
    const formatedPhone = phone.replace(/[^\d]+/g, '');
    const formatedCpf = cpf.replace(/[^\d]+/g, '');

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

    const createdCompanyResponsible =
      await this.createCompanyResponsibleRepository.create({
        body: {
          birthdate,
          cpf: formatedCpf,
          phone: formatedPhone,
          email,
          name,
        },
        companyId,
        loggedUserId,
      });

    if (Object.keys(createdCompanyResponsible).length < 1) {
      return left(new EntityNotExists('Company Responsible'));
    }

    return right(createdCompanyResponsible);
  }
}
