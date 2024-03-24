import { Injectable } from '@nestjs/common';
import { CreateUser, CreateUserDto } from '@workspaces/domain';

@Injectable()
export class CreateUserService {
  constructor(private useCase: CreateUser) {}

  async create(createUserDto: CreateUserDto) {
    return this.useCase.execute(createUserDto);
  }
}
