import { Injectable } from '@nestjs/common';
import {
  FindUnauthorizedUsersByCompanyId,
  FindUnauthorizedUsersByCompanyIdDto,
} from '@workspaces/domain';

@Injectable()
export class FindUnauthorizedUsersByCompanyIdService {
  constructor(private useCase: FindUnauthorizedUsersByCompanyId) {}

  async find(input: FindUnauthorizedUsersByCompanyIdDto) {
    return await this.useCase.execute(input);
  }
}
