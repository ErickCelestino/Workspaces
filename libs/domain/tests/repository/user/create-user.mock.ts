import { CreateUserDto, CreateUserRepository } from '../../../src';

export class CreateUserRepositoryMock implements CreateUserRepository {
  createUser: CreateUserDto = {
    name: '',
    nickName: '',
  };
  async create(input: CreateUserDto): Promise<void> {
    this.createUser = input;
  }
}
