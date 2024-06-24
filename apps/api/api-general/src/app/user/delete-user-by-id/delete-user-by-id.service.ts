import { Injectable } from '@nestjs/common';
import { DeleteUserById, DeleteUserByIdDto } from '@workspaces/domain';

@Injectable()
export class DeleteUserByIdService {
  constructor(private useCase: DeleteUserById) {}

  async delete(input: DeleteUserByIdDto) {
    return this.useCase.execute(input);
  }
}
