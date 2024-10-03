import { Injectable } from '@nestjs/common';
import {
  ListCompaniesByUserId,
  ListCompaniesByUserIdDto,
} from '@workspaces/domain';

@Injectable()
export class ListCompaniesByUserIdService {
  constructor(private useCase: ListCompaniesByUserId) {}

  async list(input: ListCompaniesByUserIdDto) {
    return await this.useCase.execute(input);
  }
}