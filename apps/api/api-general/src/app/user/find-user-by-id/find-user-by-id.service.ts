import { Injectable } from '@nestjs/common';
import { FindUserById } from '@workspaces/domain';

@Injectable()
export class FindUserByIdService {
  constructor(private useCase: FindUserById) {}

  async find(id: string) {
    return await this.useCase.execute(id);
  }
}
