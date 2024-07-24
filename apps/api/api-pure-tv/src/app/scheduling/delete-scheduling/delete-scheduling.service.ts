import { Injectable } from '@nestjs/common';
import { DeleteScheduling, DeleteSchedulingDto } from '@workspaces/domain';

@Injectable()
export class DeleteSchedulingService {
  constructor(private useCase: DeleteScheduling) {}

  async delete(input: DeleteSchedulingDto) {
    return await this.useCase.execute(input);
  }
}
