import { Injectable } from '@nestjs/common';
import { ListScheduling, ListSchedulingDto } from '@workspaces/domain';

@Injectable()
export class ListSchedulingService {
  constructor(private useCase: ListScheduling) {}

  list(input: ListSchedulingDto) {
    return this.useCase.execute(input);
  }
}
