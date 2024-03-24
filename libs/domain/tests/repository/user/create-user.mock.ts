import { CreateUserDto, CreateUserRepository } from '../../../src';

export class CreateUserRepositoryMock implements CreateUserRepository {
  createUser: CreateUserDto = {
    name: '',
    nickname: '',
    birthDate: new Date(),
  };
  async create(input: CreateUserDto): Promise<void> {
    this.createUser = input;
  }
}
