import { Injectable } from '@nestjs/common';
import { FindUserById, FindUserByIdDto } from '@workspaces/domain';

@Injectable()
export class FindUserByIdService {
  constructor(private useCase: FindUserById) {}

  async find(input: FindUserByIdDto) {
    return await this.useCase.execute(input);
  }
}
