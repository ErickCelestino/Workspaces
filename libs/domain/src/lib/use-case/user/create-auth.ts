import { UseCase } from '../../base/use-case';
import { CreateAuthDto, FilterByEmailOrNicknameDto } from '../../dto';
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

    const filterDto: FilterByEmailOrNicknameDto = {
      email: email,
    };

    const filteredEmail = await this.filterByEmailRepository.filter(filterDto);

    if (filteredEmail.length > 0) {
      for (const filteredEmailItem of filteredEmail) {
        if (filteredEmailItem.user_id !== user_id) {
          return left(new EntityAlreadyExists(email));
        }
      }
    }

    const userResult = await this.findUserByIdRepository.find(user_id);

    if (userResult.user_id.length < 1) {
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
