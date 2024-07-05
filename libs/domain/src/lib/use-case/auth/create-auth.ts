import { UseCase } from '../../base/use-case';
import { CreateAuthDto } from '../../dto';
import {
  EntityAlreadyExists,
  EntityNotExists,
  InsufficientCharacters,
} from '../../error';
import {
  CreateAuthRepository,
  FilterByEmailOrNicknameRepository,
  FindUserByIdRepository,
  HashGeneratorRepository,
} from '../../repository';
import { Either, left, right } from '../../shared/either';
import { Inject } from '@nestjs/common';

export class CreateAuth
  implements
    UseCase<
      CreateAuthDto,
      Either<InsufficientCharacters | EntityNotExists, void>
    >
{
  constructor(
    @Inject('FilterByEmailOrNicknameRepository')
    private filterByEmailRepository: FilterByEmailOrNicknameRepository,
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('HashGeneratorRepository')
    private hashGenerator: HashGeneratorRepository,
    @Inject('CreateAuthRepository')
    private createAuthRepository: CreateAuthRepository
  ) {}

  async execute(
    input: CreateAuthDto
  ): Promise<Either<InsufficientCharacters | EntityNotExists, void>> {
    const { email, password, userId } = input;

    if (Object.keys(email).length < 1 || email.length < 3) {
      return left(new InsufficientCharacters('Email'));
    }

    if (Object.keys(password).length < 1 || password.length < 3) {
      return left(new InsufficientCharacters('Password'));
    }

    if (Object.keys(userId).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const filteredEmail = await this.filterByEmailRepository.filter(email);

    if (Object.keys(filteredEmail?.userId).length > 0) {
      return left(new EntityAlreadyExists(email));
    }
    const userResult = await this.findUserByIdRepository.find(userId);

    if (Object.keys(userResult).length < 1) {
      return left(new EntityNotExists('User'));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    await this.createAuthRepository.create({
      ...input,
      password: hashedPassword,
    });

    return right(undefined);
  }
}
