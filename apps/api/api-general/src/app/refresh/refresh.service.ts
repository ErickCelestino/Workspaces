import { Injectable } from '@nestjs/common';
import { Refresh, RefreshDto } from '@workspaces/domain';

@Injectable()
export class RefreshService {
  constructor(private useCase: Refresh) {}

  async refresh(input: RefreshDto) {
    return await this.useCase.execute(input);
  }
}
