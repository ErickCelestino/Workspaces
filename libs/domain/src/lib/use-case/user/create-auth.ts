import { UseCase } from '../../base/use-case';
import { CreateAuthDto } from '../../dto';
import { EntityNotExists, InsufficientCharacters } from '../../error';
import { CreateAuthRepository, FindUserByIdRepository } from '../../repository';
import { Either, left, right } from '../../shared/either';
import { HashGenerator } from '@workspaces/utils-core';
import { Inject } from '@nestjs/common';

export class CreateAuth
  implements
    UseCase<
      CreateAuthDto,
      Either<InsufficientCharacters | EntityNotExists, void>
    >
{
  constructor(
    @Inject('FindUserByIdRepository')
    private findUserByIdRepository: FindUserByIdRepository,
    @Inject('HashGenerator')
    private hashGenerator: HashGenerator,
    @Inject('CreateAuthRepository')
    private createAuthRepository: CreateAuthRepository
  ) {}

  async execute(
    input: CreateAuthDto
  ): Promise<Either<InsufficientCharacters | EntityNotExists, void>> {
    const { email, password, user_id } = input;

    if (email.length < 3) {
      return left(new InsufficientCharacters('Email'));
    }

    if (password.length < 3) {
      return left(new InsufficientCharacters('Password'));
    }

    if (user_id.length < 3) {
      return left(new EntityNotExists('User'));
    }

    const userResult = await this.findUserByIdRepository.find(user_id);

    if (userResult.length < 1) {
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
