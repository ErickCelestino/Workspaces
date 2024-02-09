import { Injectable } from '@nestjs/common';
import { CreateUser, CreateUserDto } from '@workspaces/domain';

@Injectable()
export class CreateUserService {
  constructor(private useCase: CreateUser) {}

  async create(registerUserDto: CreateUserDto) {
    return this.useCase.execute(registerUserDto);
  }
}
