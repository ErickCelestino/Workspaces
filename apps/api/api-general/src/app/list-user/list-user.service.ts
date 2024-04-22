import { Injectable } from '@nestjs/common';
import { ListUser } from '@workspaces/domain';

@Injectable()
export class ListUserService {
  constructor(private useCase: ListUser) {}

  async list(input: string) {
    return await this.useCase.execute(input);
  }
}
