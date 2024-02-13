import { CreateAuthDto, CreateAuthRepository } from '../../../src';

export class CreateAuthRepositoryMock implements CreateAuthRepository {
  createAuth: CreateAuthDto = {
    email: '',
    password: '',
    user_id: '',
  };
  async create(input: CreateAuthDto): Promise<void> {
    this.createAuth = input;
  }
}
