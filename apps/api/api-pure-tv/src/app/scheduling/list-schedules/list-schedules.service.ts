import { Injectable } from '@nestjs/common';
import { ListSchedules, ListSchedulesDto } from '@workspaces/domain';

@Injectable()
export class ListSchedulesService {
  constructor(private useCase: ListSchedules) {}

  list(input: ListSchedulesDto) {
    return this.useCase.execute(input);
  }
}
